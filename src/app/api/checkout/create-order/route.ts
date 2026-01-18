import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '@/lib/orderService';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { getEstimatedShippingCost, validateDpdShipment } from '@/lib/shippingUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const orderData = await req.json();
        const session = await getAuthSession();
        const userId = session?.user ? (session.user as any).id : null;

        const paymentMethod = orderData.paymentMethod || 'cash_on_delivery';

        if (!orderData?.address || !orderData?.billing || !orderData?.items) {
            return NextResponse.json({ error: 'Date de comandă invalide.' }, { status: 400 });
        }

        // Transform address shapes
        const transformedAddress = {
            nume_prenume: [orderData.address.firstName || '', orderData.address.lastName || ''].join(' ').trim() || orderData.address.nume_prenume || '',
            email: orderData.address.email || '',
            telefon: orderData.address.phone || orderData.address.telefon || '',
            judet: orderData.address.county || orderData.address.judet || '',
            localitate: orderData.address.city || orderData.address.localitate || '',
            strada_nr: orderData.address.street || orderData.address.strada_nr || '',
            postCode: orderData.address.postalCode || orderData.address.postCode || '',
            country: orderData.address.country || 'RO', // Added country
            bloc: orderData.address.bloc || '',
            scara: orderData.address.scara || '',
            etaj: orderData.address.etaj || '',
            ap: orderData.address.ap || '',
            interfon: orderData.address.interfon || '',
        };

        const isBillingCompany = orderData.billing.type === 'company' || orderData.billing.tip_factura === 'persoana_juridica';
        const transformedBilling = {
            tip_factura: isBillingCompany ? ('persoana_juridica' as const) : ('persoana_fizica' as const),
            name: isBillingCompany ? undefined : [orderData.billing.firstName || '', orderData.billing.lastName || ''].join(' ').trim() || orderData.billing.name || '',
            email: orderData.billing.email || transformedAddress.email,
            telefon: orderData.billing.phone || orderData.billing.telefon || transformedAddress.telefon,
            denumire_companie: isBillingCompany ? (orderData.billing.companyName || orderData.billing.denumire_companie || '') : undefined,
            cui: isBillingCompany ? (orderData.billing.cui || '') : undefined,
            reg_com: isBillingCompany ? (orderData.billing.regCom || orderData.billing.reg_com || '') : undefined,
            judet: orderData.billing.county || orderData.billing.judet || transformedAddress.judet,
            localitate: orderData.billing.city || orderData.billing.localitate || transformedAddress.localitate,
            strada_nr: orderData.billing.street || orderData.billing.strada_nr || transformedAddress.strada_nr,
            postCode: orderData.billing.postalCode || orderData.billing.postCode || transformedAddress.postCode,
        };

        // Replace orderData versions
        orderData.address = transformedAddress;
        orderData.billing = transformedBilling;

        const items = orderData.items;

        // Server-side validation for international shipping
        if (transformedAddress.country && transformedAddress.country !== 'RO') {
            const dpdCheck = validateDpdShipment(items);
            if (!dpdCheck.valid) {
                return NextResponse.json({ error: dpdCheck.error || 'Livrare internațională imposibilă pentru aceste produse.' }, { status: 400 });
            }
        }

        // Shipping cost calculation
        let costLivrare = 0;
        const subtotal = items.reduce((s: number, it: any) => s + (Number(it.unitAmount ?? it.price ?? 0) * Number(it.quantity ?? 1)), 0);

        if (transformedAddress.country && transformedAddress.country !== 'RO') {
            costLivrare = getEstimatedShippingCost(transformedAddress.country, items);
        } else {
            // Domestic Logic
            const FREE_SHIPPING_THRESHOLD = 500;
            const SHIPPING_FEE = 19.99;
            costLivrare = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        }

        // Stripe
        if (paymentMethod === 'card') {
            if (!Array.isArray(items) || items.length === 0) {
                return NextResponse.json({ error: 'Coșul este gol.' }, { status: 400 });
            }

            try {
                const origin = req.headers.get('origin') || process.env.PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
                const secret = process.env.STRIPE_SECRET_KEY;

                if (!secret) {
                    return NextResponse.json({ error: 'STRIPE_SECRET_KEY nu este setat' }, { status: 500 });
                }

                const stripe = new Stripe(secret);

                const checkoutData = {
                    items,
                    address: transformedAddress,
                    billing: transformedBilling,
                    marketing: orderData.marketing,
                    userId: userId || null,
                    discountCode: orderData.discountCode || null,
                    discountAmount: orderData.discountAmount || 0,
                    shippingCost: costLivrare, // Save calculated shipping cost
                };

                const compactCart = items.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    unitAmount: item.unitAmount || item.price,
                }));

                const metadata: Record<string, string> = {
                    cart_summary: JSON.stringify(compactCart).slice(0, 500),
                    user_email: transformedAddress.email || '',
                    userId: userId || '',
                    has_full_data: 'true',
                };

                const line_items = [
                    ...items.map((item: any) => ({
                        price_data: {
                            currency: 'ron',
                            product_data: { name: item.name },
                            unit_amount: Math.round((item.unitAmount || item.price) * 100),
                        },
                        quantity: item.quantity,
                    }))
                ];

                // Add shipping line item (if > 0)
                // Note: We ignore discount logic here for Stripe "price" breakdown because it gets complex.
                // Ideally we should apply discount as a coupon or negative line item.
                // But the previous code didn't handle discount in Stripe session?
                // Wait, orderData.discountAmount exists.
                // If we have a discount, we should subtract it or add a coupon.
                // Stripe coupons need to be created in Stripe.
                // Simpler way: Apply discount to unit_amounts or add a negative line item is not allowed directly without coupon.
                // Alternative: Reduce the total amount via `discounts` parameter referencing a Stripe Coupon ID.
                // Or if it's a fixed custom discount, we might just reduce the line items?
                // Given complexity, let's see how tablou handled it.
                // Tablou `create-order`:
                /*
                  // ... (no discount handling in line_items construction in viewed code)
                  // Wait, viewing line 128-145:
                  // line_items: [... items..., { name: 'Cost Livrare' ... }]
                */
                // It seems tablou `create-order` ignored discountAmount in Stripe session creation?!
                // That's a bug in tablou if so, or I missed it.
                // Lines 98-106 save `discountAmount` in `checkoutData`.
                // But `stripe.checkout.sessions.create` uses `line_items`.
                // If `discountAmount` > 0, the user pays full price on Stripe? That's bad.

                // I should fix this for Visionboard.
                // If discountAmount > 0, I can add a "Discount" line item? No, negative amounts not allowed.
                // I can create an ad-hoc coupon code in Stripe if I want, or use `discounts: [{ coupon: ... }]`.
                // But easier is `discounts: [{ coupon: '...' }]` if I have one.
                // If I don't have a Stripe coupon object, I can't use `discounts`.
                // Hack: Reduce the price of a dummy item or spread discount?
                // Better: Use `discounts` with `coupon_data` (inline coupon) is not supported in Checkout?
                // `discounts` accepts `{ coupon: string }` or `{ promotion_code: string }`.

                // Actually, if I just want to charge less, I should adjust `unit_amount`.
                // But `unit_amount` is per item.

                // Let's check `tablou` lines 124-149 again.
                // It definitely doesn't use `discountAmount`.
                // Maybe discounts happen before?
                // `DiscountCodeInput` updates `discountAmount` state in `page.tsx`.

                // I will assume for now I should just replicate `tablou` behavior, but it looks suspicious.
                // If I replicate it, customers will overpay on card.
                // Validation: `orderData` has `discountAmount`.
                // If `discountAmount > 0`: I should subtract it.
                // Since I can't easily spread it or use coupons without Stripe Setup,
                // I will just subtract it from the total by adding a negative number... oh wait I can't.
                // I will subtract it from the first item? No.

                // The proper way without Stripe Coupons is to not send line items but just `amount` and `currency`?
                // No, `line_items` is required.

                // For now, I will proceed with `tablou` code to match source, but I'll add a comment.
                // Wait, maybe `fulfillOrder` handles it? `fulfillOrder` is for non-card.

                // Let's implement `shippingCost` correctly at least.

                if (costLivrare > 0) {
                    line_items.push({
                        price_data: {
                            currency: 'ron',
                            product_data: { name: 'Cost Livrare' },
                            unit_amount: Math.round(costLivrare * 100),
                        },
                        quantity: 1,
                    });
                }

                const sessionPayload: any = {
                    mode: 'payment',
                    payment_method_types: ['card'],
                    customer_email: transformedAddress.email || undefined,
                    line_items,
                    metadata,
                    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${origin}/checkout`,
                };

                // Attempt to handle discount by creating a coupon on the fly?
                // Or if discountAmount > 0, we can use `discounts`.
                // `stripe.coupons.create`.
                if (orderData.discountAmount > 0) {
                    const coupon = await stripe.coupons.create({
                        amount_off: Math.round(orderData.discountAmount * 100),
                        currency: 'ron',
                        duration: 'once',
                        name: orderData.discountCode || 'Reducere'
                    });
                    sessionPayload.discounts = [{ coupon: coupon.id }];
                }

                const session = await stripe.checkout.sessions.create(sessionPayload);

                await prisma.pendingCheckout.create({
                    data: {
                        sessionId: session.id,
                        checkoutData: checkoutData as any,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    },
                });

                return NextResponse.json({
                    sessionId: session.id,
                    url: session.url
                });
            } catch (err: any) {
                console.error('[Stripe] Eroare creare sesiune:', err?.message || err);
                return NextResponse.json({ error: err?.message || 'Eroare Stripe' }, { status: 500 });
            }
        }

        // Ramburs / OP
        else {
            try {
                const { invoiceLink, orderNo, orderId } = await fulfillOrder(
                    {
                        ...orderData,
                        userId,
                        cart: items,
                        shippingFee: costLivrare // Pass calculated shipping fee
                    },
                    'Ramburs'
                );

                return NextResponse.json({
                    success: true,
                    message: 'Comanda a fost procesată!',
                    invoiceLink: invoiceLink ?? null,
                    orderNo: orderNo ?? null,
                    orderId: orderId ?? null,
                });
            } catch (error: any) {
                console.error('[API /checkout/create-order] EROARE la fulfillOrder:', error?.message || error);
                return NextResponse.json({ error: 'Eroare la procesarea comenzii.' }, { status: 500 });
            }
        }
    } catch (error: any) {
        console.error('[API /checkout/create-order] EROARE:', error?.message || error);
        return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 });
    }
}
