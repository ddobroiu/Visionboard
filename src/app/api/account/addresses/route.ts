import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request) {
    const session = await getAuthSession();
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    const addresses = await prisma.address.findMany({ where: { userId }, orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }] });
    return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
    const session = await getAuthSession();
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    try {
        const body = await req.json();
        const type = (body.type as string) || 'shipping';

        const data: any = {
            userId,
            type,
            label: body.label || null,
            nume: body.nume || null,
            email: body.email || null,
            telefon: body.telefon || null,
            company: body.company || null,
            cui: body.cui || null,
            regCom: body.regCom || null,
            country: body.country || 'RO',
            judet: body.judet || '',
            localitate: body.localitate || '',
            strada_nr: body.strada_nr || '',
            postCode: body.postCode || null,
            bloc: body.bloc || null,
            scara: body.scara || null,
            etaj: body.etaj || null,
            ap: body.ap || null,
            interfon: body.interfon || null,
            isDefault: Boolean(body.isDefault) || false,
        };

        // Verificăm dacă user-ul mai are adrese de acest tip. Prima adresă de transport e mereu default.
        const count = await prisma.address.count({ where: { userId, type: 'shipping' } });
        if (count === 0 && type === 'shipping') {
            data.isDefault = true;
        }

        if (data.isDefault && type === 'shipping') {
            await prisma.address.updateMany({ where: { userId, type: 'shipping', isDefault: true }, data: { isDefault: false } });
        }

        const created = await prisma.address.create({ data });
        return NextResponse.json({ success: true, address: created });
    } catch (e: any) {
        console.error('[POST /api/account/addresses] error', e?.message || e);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
