import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClientPage from "./AccountClientPage";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    const session = await getAuthSession();

    if (!session?.user) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contul meu</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Pentru a accesa istoricul comenzilor, te rugăm să te autentifici.</p>
                <Link href="/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                    Mergi la autentificare
                </Link>
            </div>
        );
    }

    const userId = (session.user as any).id as string;
    const userEmail = session.user.email;

    console.log(`[AccountPage] Checking orders for UserID: ${userId} | Email: ${userEmail}`);

    // Construim condiția de căutare
    const whereCondition: any = {
        source: 'Visionboard',
        OR: [
            { userId: userId },
        ]
    };

    // Dacă avem email, căutăm și în JSON-ul de facturare (fără path pentru siguranță dacă path-ul dă eroare)
    if (userEmail) {
        whereCondition.OR.push({
            billingAddress: {
                path: ['email'],
                equals: userEmail
            }
        });
    }

    try {
        const orderRecords = await prisma.order.findMany({
            where: whereCondition,
            orderBy: { createdAt: "desc" },
            include: { items: true },
            take: 50,
        });

        console.log(`[AccountPage] Found ${orderRecords.length} orders.`);

        // Convertim datele pentru a fi sigure de trimis la Client
        const orders = orderRecords.map((o) => {
            const items = (o.items || []).map((it: any) => ({
                name: it.name,
                qty: it.quantity,
                unit: Number(it.price),
                total: Number(it.total),
            }));

            const address: any = typeof o.shippingAddress === "object" ? o.shippingAddress : {};
            // Asigurăm compatibilitatea cu JSON-ul de billing
            const billingData: any = typeof o.billingAddress === "object" ? o.billingAddress : {};

            return {
                id: o.id,
                orderNo: Number(o.orderNo),
                createdAt: o.createdAt.toISOString(),
                status: o.status,
                canceledAt: o.canceledAt ? o.canceledAt.toISOString() : null,
                total: Number(o.totalAmount),
                paymentType: o.paymentMethod,
                items,
                itemsCount: items.length,
                awbNumber: o.awbNumber ? String(o.awbNumber) : null,
                awbCarrier: o.awbCarrier || null,
                invoiceLink: o.invoiceUrl || null,
                address,
                billing: billingData,
                shippingFee: Number(o.shippingFee ?? 0),
            };
        });

        // Încercăm să găsim ultima comandă pentru datele de facturare implicite
        const lastBillingOrder = await prisma.order.findFirst({
            where: whereCondition,
            orderBy: { createdAt: "desc" },
            select: { billingAddress: true },
        });

        const billing = (lastBillingOrder?.billingAddress as any) || null;

        return (
            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<div className="p-10 text-center text-gray-600 dark:text-gray-400">Se încarcă...</div>}>
                    <AccountClientPage orders={orders} billing={billing} session={session as any} />
                </Suspense>
            </div>
        );

    } catch (error) {
        console.error("[AccountPage] Error fetching orders:", error);
        // Returnăm o pagină funcțională chiar dacă comenzile nu s-au putut încărca
        return (
            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<div className="p-10 text-center text-gray-600 dark:text-gray-400">Se încarcă...</div>}>
                    <AccountClientPage orders={[]} billing={null} session={session as any} />
                </Suspense>
                <div className="mt-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl text-amber-800 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="font-bold text-lg">Notificare Sistem</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">
                        Momentan nu am putut prelua istoricul comenzilor din baza de date. Totuși, poți gestiona în continuare profilul, adresele și restul setărilor din meniul lateral. Te rugăm să verifici din nou istoricul comenzilor peste câteva minute.
                    </p>
                </div>
            </div>
        );
    }
}
