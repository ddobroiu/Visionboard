import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

export type Address = {
    nume_prenume: string;
    email: string;
    telefon: string;
    judet: string;
    localitate: string;
    strada_nr: string;
    postCode?: string;
    bloc?: string;
    scara?: string;
    etaj?: string;
    ap?: string;
    interfon?: string;
};

export type Billing = {
    tip_factura: 'persoana_fizica' | 'companie' | 'persoana_juridica';
    cui?: string;
    reg_com?: string;
    denumire_companie?: string;
    name?: string;
    email?: string;
    telefon?: string;
    judet?: string;
    localitate?: string;
    strada_nr?: string;
};

export type MarketingInfo = {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    gclid?: string;
    fbclid?: string;
    referrer?: string;
    landingPage?: string;
    userAgent?: string;
};

export type StoredOrder = {
    orderNo: number;
    id: string;
    createdAt: string; // ISO
    paymentType: 'Ramburs' | 'Card';
    address: Address;
    billing: Billing;
    items: Array<{
        name: string;
        qty: number;
        unit: number;
        total: number;
        artworkUrl?: string | null;
        metadata?: Record<string, unknown> | undefined;
    }>;
    shippingFee: number;
    total: number;
    invoiceLink?: string | null;
    marketing?: MarketingInfo;
    userId?: string | null;
    status?: 'active' | 'canceled';
    canceledAt?: string | null;
    awbNumber?: string | null;
    awbCarrier?: string | null;
    source?: string | null;
};

export type NewOrder = Omit<StoredOrder, 'id' | 'createdAt' | 'orderNo'>;

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'orders.jsonl');
const SEQ_PATH = path.join(DATA_DIR, 'order-seq.txt');
const SESSION_MAP_PATH = path.join(DATA_DIR, 'session-map.json');
const CANCEL_MAP_PATH = path.join(DATA_DIR, 'canceled-orders.json');

function ensureDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, '');
}

async function nextOrderNo(): Promise<number> {
    ensureDir();
    let current = 999;
    try {
        if (fs.existsSync(SEQ_PATH)) {
            const txt = await fs.promises.readFile(SEQ_PATH, 'utf8').catch(() => '');
            const n = parseInt((txt || '').trim(), 10);
            if (Number.isFinite(n) && n >= 999) current = n;
        } else {
            const content = await fs.promises.readFile(FILE_PATH, 'utf8').catch(() => '');
            const lines = content.split(/\r?\n/).filter(Boolean);
            let maxNo = 0;
            for (const line of lines) {
                try {
                    const obj = JSON.parse(line);
                    if (obj?.orderNo && Number.isFinite(obj.orderNo)) maxNo = Math.max(maxNo, obj.orderNo);
                } catch { }
            }
            if (maxNo >= 999) current = maxNo;
        }
    } catch { }
    const next = current + 1;
    await fs.promises.writeFile(SEQ_PATH, String(next), 'utf8');
    return next;
}

// --- FUNCȚIA ESENȚIALĂ EXPORTATĂ ---
export async function appendOrder(input: NewOrder): Promise<StoredOrder> {
    // Dacă avem bază de date, salvăm cu Prisma
    if (process.env.DATABASE_URL) {
        const last = await prisma.order.findFirst({ orderBy: { orderNo: 'desc' } }).catch(() => null);
        const orderNo = (last?.orderNo ?? 999) + 1;

        // FIX: Verificăm dacă userId există în DB înainte de a-l folosi
        let validUserId: string | undefined = undefined;
        if (input.userId) {
            try {
                const userExists = await prisma.user.findUnique({ where: { id: input.userId } });
                if (userExists) {
                    validUserId = input.userId;
                } else {
                    console.warn('[orderStore] userId provided but user does not exist:', input.userId);
                }
            } catch (e) {
                console.warn('[orderStore] Error checking userId:', (e as Error)?.message);
            }
        }

        const created = await prisma.order.create({
            data: {
                orderNo,
                paymentMethod: input.paymentType, // paymentType -> paymentMethod
                shippingAddress: input.address as any, // address -> shippingAddress
                billingAddress: input.billing as any, // billing -> billingAddress
                shippingFee: Number(input.shippingFee ?? 0),
                totalAmount: Number(input.total ?? 0), // total -> totalAmount
                invoiceUrl: input.invoiceLink || null, // invoiceLink -> invoiceUrl
                awbNumber: (input as NewOrder).awbNumber || null,
                awbCarrier: (input as NewOrder).awbCarrier || null,
                marketing: input.marketing || undefined,
                source: input.source || process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '').replace('www.', '') || 'Visionboard',
                userId: validUserId,
                items: {
                    create: (input.items || []).map((it) => ({
                        name: it.name,
                        quantity: it.qty, // qty -> quantity
                        price: Number(it.unit ?? 0), // unit -> price
                        total: Number(it.total ?? 0),
                        artworkUrl: it.artworkUrl || null,
                        metadata: (it.metadata || {}) as any,
                    })),
                },
            },
        });

        // Salvare adresă implicită utilizator (best-effort)
        try {
            if (created.userId) {
                const a = input.address as Address;
                await prisma.address.updateMany({ where: { userId: created.userId, isDefault: true, type: 'shipping' }, data: { isDefault: false } });
                await prisma.address.create({
                    data: {
                        userId: created.userId,
                        type: 'shipping',
                        isDefault: true,
                        nume: a.nume_prenume || null,
                        email: a.email || null,
                        telefon: a.telefon || null,
                        judet: a.judet || '',
                        localitate: a.localitate || '',
                        strada_nr: a.strada_nr || '',
                        postCode: a.postCode || null,
                        bloc: a.bloc || null,
                        scara: a.scara || null,
                        etaj: a.etaj || null,
                        ap: a.ap || null,
                        interfon: a.interfon || null,
                        label: 'Implicit',
                    },
                });

                const b: Billing | undefined = input.billing;
                if (b && b.tip_factura && b.tip_factura !== 'persoana_fizica') {
                    const existingBilling = await prisma.address.findFirst({ where: { userId: created.userId, type: 'billing' } });
                    const billingData = {
                        userId: created.userId,
                        type: 'billing',
                        isDefault: false,
                        nume: b.name || a.nume_prenume || null,
                        email: (b as any).email || a.email || null,
                        telefon: (b as any).telefon || a.telefon || null,
                        judet: b.judet || a.judet || '',
                        localitate: b.localitate || a.localitate || '',
                        strada_nr: b.strada_nr || a.strada_nr || '',
                        postCode: a.postCode || null,
                        bloc: null,
                        scara: null,
                        etaj: null,
                        ap: null,
                        interfon: null,
                        label: 'Facturare',
                    };
                    if (existingBilling) {
                        await prisma.address.update({ where: { id: existingBilling.id }, data: billingData });
                    } else {
                        await prisma.address.create({ data: billingData });
                    }
                }
            }
        } catch (e) {
            console.warn('[orderStore] address save skipped:', ((e as Error)?.message) || String(e));
        }

        return {
            id: created.id,
            orderNo: created.orderNo,
            createdAt: created.createdAt.toISOString(),
            paymentType: created.paymentMethod as unknown as StoredOrder['paymentType'],
            address: (typeof created.shippingAddress === 'string' ? JSON.parse(created.shippingAddress) : created.shippingAddress) as unknown as Address,
            billing: (typeof created.billingAddress === 'string' ? JSON.parse(created.billingAddress) : created.billingAddress) as unknown as Billing,
            items: (input.items || []) as StoredOrder['items'],
            shippingFee: Number(created.shippingFee),
            total: Number(created.totalAmount),
            invoiceLink: created.invoiceUrl,
            awbNumber: created.awbNumber || null,
            awbCarrier: created.awbCarrier || null,
            marketing: created.marketing as unknown as MarketingInfo | undefined,
            userId: created.userId,
            source: created.source,
        };
    }

    // Fallback fișier local
    ensureDir();
    const orderNo = await nextOrderNo();
    const order: StoredOrder = {
        orderNo,
        id: (globalThis as any).crypto?.randomUUID?.() || (await import('crypto')).randomUUID(),
        createdAt: new Date().toISOString(),
        ...input,
    };
    await fs.promises.appendFile(FILE_PATH, JSON.stringify(order) + '\n', 'utf8');
    return order;
}

export async function listOrders(limit = 200): Promise<StoredOrder[]> {
    if (process.env.DATABASE_URL) {
        try {
            const recs = await prisma.order.findMany({
                where: { type: "order" }, // Doar comenzi, nu oferte
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: { items: true },
            });
            return recs.map((r: any) => ({
                orderNo: r.orderNo,
                id: r.id,
                createdAt: r.createdAt.toISOString(),
                paymentType: r.paymentMethod as any,
                address: (typeof r.shippingAddress === 'string' ? JSON.parse(r.shippingAddress) : (r.shippingAddress || {})) as any,
                billing: (typeof r.billingAddress === 'string' ? JSON.parse(r.billingAddress) : (r.billingAddress || {})) as any,
                items: (r.items || []).map((it: any) => ({
                    name: it.name,
                    qty: it.quantity,
                    unit: Number(it.price),
                    total: Number(it.total),
                    artworkUrl: it.artworkUrl,
                    metadata: it.metadata
                })),
                shippingFee: Number(r.shippingFee ?? 0),
                total: Number(r.totalAmount ?? 0),
                invoiceLink: r.invoiceUrl || null,
                awbNumber: r.awbNumber || null,
                awbCarrier: r.awbCarrier || null,
                marketing: (r.marketing || undefined) as any,
                userId: r.userId || null,
                status: (r.status as any) || undefined,
                canceledAt: r.canceledAt ? r.canceledAt.toISOString() : null,
                source: r.source || 'Visionboard',
            }));
        } catch (e) {
            console.warn('[orderStore] DB listOrders failed:', ((e as Error)?.message) || String(e));
        }
    }

    ensureDir();
    const content = await fs.promises.readFile(FILE_PATH, 'utf8').catch(() => '');
    const lines = content.split(/\r?\n/).filter(Boolean);
    let cancelMap: Record<string, string> = {};
    try {
        const raw = await fs.promises.readFile(CANCEL_MAP_PATH, 'utf8').catch(() => '{}');
        cancelMap = JSON.parse(raw || '{}');
    } catch { }
    const orders: StoredOrder[] = [];
    for (let i = Math.max(0, lines.length - limit); i < lines.length; i++) {
        try {
            const obj = JSON.parse(lines[i]);
            if (cancelMap[obj.id]) {
                obj.status = 'canceled';
                obj.canceledAt = cancelMap[obj.id];
            }
            orders.push(obj);
        } catch { }
    }
    orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return orders;
}

export async function listOffers(limit = 200): Promise<StoredOrder[]> {
    if (process.env.DATABASE_URL) {
        try {
            const recs = await prisma.order.findMany({
                where: { type: "offer" }, // Doar oferte
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: { items: true },
            });
            return recs.map((r: any) => ({
                orderNo: r.orderNo,
                id: r.id,
                createdAt: r.createdAt.toISOString(),
                paymentType: r.paymentMethod as any,
                address: (typeof r.shippingAddress === 'string' ? JSON.parse(r.shippingAddress) : (r.shippingAddress || {})) as any,
                billing: (typeof r.billingAddress === 'string' ? JSON.parse(r.billingAddress) : (r.billingAddress || {})) as any,
                items: (r.items || []).map((it: any) => ({
                    name: it.name,
                    qty: it.quantity,
                    unit: Number(it.price),
                    total: Number(it.total),
                    artworkUrl: it.artworkUrl,
                    metadata: it.metadata
                })),
                shippingFee: Number(r.shippingFee ?? 0),
                total: Number(r.totalAmount ?? 0),
                invoiceLink: r.invoiceUrl || null,
                awbNumber: r.awbNumber || null,
                awbCarrier: r.awbCarrier || null,
                marketing: (r.marketing || undefined) as any,
                userId: r.userId || null,
                status: (r.status as any) || undefined,
                canceledAt: r.canceledAt ? r.canceledAt.toISOString() : null,
                source: r.source || 'Visionboard',
            }));
        } catch (e) {
            console.warn('[orderStore] DB listOffers failed:', ((e as Error)?.message) || String(e));
        }
    }
    return [];
}

export async function getOrder(id: string): Promise<StoredOrder | null> {
    if (process.env.DATABASE_URL) {
        try {
            const r = await prisma.order.findUnique({ where: { id }, include: { items: true } });
            if (!r) return null;
            return {
                orderNo: r.orderNo,
                id: r.id,
                createdAt: r.createdAt.toISOString(),
                paymentType: r.paymentMethod as any,
                address: (typeof r.shippingAddress === 'string' ? JSON.parse(r.shippingAddress) : (r.shippingAddress || {})) as any,
                billing: (typeof r.billingAddress === 'string' ? JSON.parse(r.billingAddress) : (r.billingAddress || {})) as any,
                items: (r.items || []).map((it: any) => ({
                    name: it.name,
                    qty: it.quantity,
                    unit: Number(it.price),
                    total: Number(it.total),
                    artworkUrl: it.artworkUrl,
                    metadata: it.metadata
                })),
                shippingFee: Number(r.shippingFee ?? 0),
                total: Number(r.totalAmount ?? 0),
                invoiceLink: r.invoiceUrl || null,
                awbNumber: r.awbNumber || null,
                awbCarrier: r.awbCarrier || null,
                marketing: (r.marketing || undefined) as any,
                userId: r.userId || null,
                status: (r.status as any) || undefined,
                canceledAt: r.canceledAt ? r.canceledAt.toISOString() : null,
                source: r.source || 'Visionboard',
            } as StoredOrder;
        } catch (e) {
            console.warn('[orderStore] DB getOrder failed:', ((e as Error)?.message) || String(e));
        }
    }

    ensureDir();
    const content = await fs.promises.readFile(FILE_PATH, 'utf8').catch(() => '');
    const lines = content.split(/\r?\n/).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
        try {
            const obj = JSON.parse(lines[i]);
            if (obj.id === id) return obj as StoredOrder;
        } catch { }
    }
    return null;
}

type SessionMap = Record<string, { orderId: string; orderNo: number; createdAt: string }>;

function ensureSessionMap(): void {
    ensureDir();
    if (!fs.existsSync(SESSION_MAP_PATH)) {
        fs.writeFileSync(SESSION_MAP_PATH, '{}', 'utf8');
    }
}

export async function mapStripeSessionToOrder(sessionId: string, orderId: string, orderNo: number): Promise<void> {
    try {
        ensureSessionMap();
        const raw = await fs.promises.readFile(SESSION_MAP_PATH, 'utf8').catch(() => '{}');
        let map: SessionMap = {};
        try { map = JSON.parse(raw || '{}'); } catch { map = {}; }
        map[sessionId] = { orderId, orderNo, createdAt: new Date().toISOString() };
        await fs.promises.writeFile(SESSION_MAP_PATH, JSON.stringify(map, null, 2), 'utf8');
    } catch (e) {
        console.warn('[orderStore] Nu pot scrie session-map:', (e as any)?.message || e);
    }
}

export async function getOrderNoByStripeSession(sessionId: string): Promise<number | undefined> {
    try {
        ensureSessionMap();
        const raw = await fs.promises.readFile(SESSION_MAP_PATH, 'utf8').catch(() => '{}');
        const map = JSON.parse(raw || '{}') as SessionMap;
        const rec = map[sessionId];
        return rec?.orderNo;
    } catch {
        return undefined;
    }
}
