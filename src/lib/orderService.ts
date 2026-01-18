import { appendOrder, type NewOrder, type Address, type Billing } from "@/lib/orderStore";
import { Resend } from 'resend';
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";

// --- OBLIO CONFIG ---
const OBLIO_EMAIL = process.env.OBLIO_EMAIL || ""; // "ionut@tablou.net"
const OBLIO_API_KEY = process.env.OBLIO_API_KEY || "";
const OBLIO_ID_FIRMA = process.env.OBLIO_CIF_FIRMA || "";
const OBLIO_SERIE_FACTURA = process.env.OBLIO_SERIE_FACTURA || "";
const OBLIO_GESTIUNE = process.env.OBLIO_GESTIUNE || ""; // Gestiunea pt scadere stoc

let oblioToken: string | null = null;
let oblioTokenExp: number = 0;

async function getOblioAccessToken(): Promise<string | null> {
    if (!OBLIO_EMAIL || !OBLIO_API_KEY) return null;
    if (oblioToken && Date.now() < oblioTokenExp) return oblioToken;

    try {
        const res = await fetch("https://www.oblio.eu/api/authorize/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: OBLIO_EMAIL,
                client_secret: OBLIO_API_KEY,
            }),
        });
        if (!res.ok) throw new Error("Oblio calc auth fail");
        const data = await res.json();
        oblioToken = data.access_token;
        // Expiră in 3600s de obicei, luăm marjă
        oblioTokenExp = Date.now() + (data.expires_in || 3600) * 1000 - 60000;
        return oblioToken;
    } catch (e) {
        console.error("Oblio Auth Error:", e);
        return null;
    }
}

async function createOblioInvoice(order: NewOrder, orderNo: number): Promise<{ link?: string, serie?: string, numar?: string }> {
    const token = await getOblioAccessToken();
    if (!token || !OBLIO_ID_FIRMA || !OBLIO_SERIE_FACTURA) return {};

    try {
        // Determine client type
        const isCompany = order.billing.tip_factura !== 'persoana_fizica';
        const clientName = isCompany ? order.billing.denumire_companie : order.billing.name || order.address.nume_prenume;
        const cif = isCompany ? order.billing.cui : "";
        const rc = isCompany ? order.billing.reg_com : "";

        // Items mapped
        const products = order.items.map(it => ({
            name: it.metadata?.productName || it.name, // Folosim numele "curat" dacă există
            code: it.metadata?.sku || "",
            description: it.name, // Descrierea poate fi numele lung
            price: it.unit,
            measure_unit: "buc",
            currency: "RON",
            vat_name: "19%",
            vat_percentage: 19,
            vat_included: 1, // Prețurile includ TVA
            quantity: it.qty,
            product_type: "Produs finit",
            // gestiune: OBLIO_GESTIUNE // Opțional: Scade stoc
        }));

        if (order.shippingFee > 0) {
            products.push({
                name: "Taxa livrare",
                code: "TRANSPORT",
                description: "Servicii de curierat",
                price: order.shippingFee,
                measure_unit: "buc",
                currency: "RON",
                vat_name: "19%",
                vat_percentage: 19,
                vat_included: 1,
                quantity: 1,
                product_type: "Serviciu",
            });
        }

        const payload = {
            cif: OBLIO_ID_FIRMA,
            client: {
                name: clientName,
                cif: cif,
                rc: rc,
                code: "", // Cod client intern
                address: order.billing.strada_nr,
                state: order.billing.judet,
                city: order.billing.localitate,
                country: "RO",
                email: order.billing.email || order.address.email,
                phone: order.billing.telefon || order.address.telefon,
                save: 1
            },
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date().toISOString().split('T')[0], // Scadența azi pt plată card
            deliveryDate: "",
            collectDate: "",
            seriesName: OBLIO_SERIE_FACTURA,
            language: "RO",
            precision: 2,
            currency: "RON",
            products: products,
            workStation: "Visionboard", // marchează punctul de lucru
            useStock: 0
        };

        const res = await fetch("https://www.oblio.eu/api/docs/invoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (!res.ok) {
            console.error("Oblio Invoice Error Body:", json);
            return {};
        }

        return {
            link: json.link, // Link PDF public
            serie: json.seriesName,
            numar: json.number
        };

    } catch (e) {
        console.error("Oblio Create Invoice Error:", e);
        return {};
    }
}

// --- ORDER FULFILLMENT MAIN ---
export async function fulfillOrder(input: {
    userId?: string;
    items: any[];
    shippingCost?: number;
    subtotal?: number;
    discountAmount?: number;
    totalWithShipping?: number;
    address: Address;
    billing: Billing;
    sameAsDelivery?: boolean;
    createAccount?: boolean;
    paymentMethod?: string;
    newsletter?: boolean;
    marketing?: any;
}, paymentType: 'Ramburs' | 'Card') {

    // 1. Calculate totals (server-side verification recommended but we trust input for now)
    const items = input.items.map((i: any) => ({
        name: i.title || i.name,
        qty: i.quantity || i.qty || 1,
        unit: i.price,
        total: (i.price * (i.quantity || 1)),
        artworkUrl: i.artworkUrl || i.image || null,
        metadata: i.file ? { file: i.file, ...i.metadata } : i.metadata
    }));

    const shippingFee = typeof input.shippingCost === 'number' ? input.shippingCost : 19.99;
    const total = typeof input.totalWithShipping === 'number' ? input.totalWithShipping :
        items.reduce((acc, it) => acc + it.total, 0) + shippingFee;

    // 2. Normalize Address/Billing
    const address: Address = {
        ...input.address,
        // Ensure all required fields
        nume_prenume: input.address.nume_prenume || '',
        email: input.address.email || '',
        telefon: input.address.telefon || '',
        judet: input.address.judet || '',
        localitate: input.address.localitate || '',
        strada_nr: input.address.strada_nr || '',
    };

    const billing: Billing = {
        tip_factura: input.billing.tip_factura || 'persoana_fizica',
        name: input.billing.name || (input.billing.tip_factura === 'persoana_fizica' ? address.nume_prenume : undefined),
        email: input.billing.email || address.email,
        telefon: input.billing.telefon || address.telefon,
        judet: input.billing.judet || address.judet,
        localitate: input.billing.localitate || address.localitate,
        strada_nr: input.billing.strada_nr || address.strada_nr,
        cui: input.billing.cui,
        reg_com: input.billing.reg_com,
        denumire_companie: input.billing.denumire_companie
    };

    // 3. User Account Creation (Optional)
    let userId = input.userId;
    let userPassword = '';

    if (input.createAccount && !userId && address.email) {
        try {
            if (process.env.DATABASE_URL) {
                const existing = await prisma.user.findUnique({
                    where: {
                        email_source: {
                            email: address.email,
                            source: "Visionboard"
                        }
                    }
                });

                if (existing) {
                    userId = existing.id;
                } else {
                    // Create new user
                    const generatedPass = Math.random().toString(36).slice(-8);
                    const hash = await bcrypt.hash(generatedPass, 10);

                    const newUser = await prisma.user.create({
                        data: {
                            email: address.email,
                            name: address.nume_prenume,
                            source: "Visionboard",
                            passwordHash: hash,
                            phone: address.telefon,
                            role: 'user',
                            addresses: {
                                create: {
                                    type: 'shipping',
                                    isDefault: true,
                                    nume: address.nume_prenume,
                                    telefon: address.telefon,
                                    judet: address.judet,
                                    localitate: address.localitate,
                                    strada_nr: address.strada_nr,
                                    postCode: address.postCode
                                }
                            }
                        }
                    });

                    userId = newUser.id;
                    userPassword = generatedPass;

                    // Send welcome email with password? 
                    // tablou code didn't explicitly send password in welcome email in the snippet I saw, 
                    // but we can assume normal flow.
                }
            }
        } catch (e) {
            console.error("Account creation failed:", e);
        }
    }

    // 4. Create Order Object
    const newOrder: NewOrder = {
        paymentType,
        address,
        billing,
        items,
        shippingFee,
        total,
        userId: userId || undefined,
        marketing: input.marketing,
        source: "Visionboard"
    };

    // 5. Save Order (DB or File)
    const savedOrder = await appendOrder(newOrder);

    // 6. Generate Invoice (Oblio) - Async, don't block? Or block?
    // tablou code did it before returning?
    // We can do it parallel or after.
    let invoiceLink: string | undefined;

    // Doar dacă avem facturare activată
    if (OBLIO_API_KEY) {
        const inv = await createOblioInvoice(newOrder, savedOrder.orderNo);
        if (inv.link) {
            invoiceLink = inv.link;
            // Update order with invoice
            if (process.env.DATABASE_URL) {
                await prisma.order.update({
                    where: { id: savedOrder.id },
                    data: { invoiceUrl: inv.link }
                }).catch(console.error);
            }
        }
    }

    // 7. Send Emails
    try {
        const emailPayload = {
            ...savedOrder,
            userEmail: address.email,
            currency: 'RON'
        };
        await sendOrderConfirmationEmail(emailPayload);
        await sendNewOrderAdminEmail(emailPayload);
    } catch (e) {
        console.error("Email sending failed:", e);
    }

    return {
        orderId: savedOrder.id,
        orderNo: savedOrder.orderNo,
        invoiceLink,
        userCreated: !!userPassword,
        userPassword // Frontend can display this if needed
    };
}
