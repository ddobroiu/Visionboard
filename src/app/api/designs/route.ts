import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Verificăm dacă utilizatorul este admin
        // Se presupune că rolul 'admin' este setat corect pe utilizator
        if ((session.user as any).role !== 'admin') {
            return new NextResponse('Forbidden: Doar administratorii pot salva template-uri.', { status: 403 });
        }

        const body = await req.json();
        const { name, data, isPublic } = body;

        if (!name || !data) {
            return new NextResponse('Numele și datele designului sunt obligatorii', { status: 400 });
        }

        const design = await prisma.design.create({
            data: {
                name,
                data,
                userId: (session.user as any).id,
                isPublic: isPublic || false,
                source: "Visionboard"
            }
        });

        return NextResponse.json(design);
    } catch (error) {
        console.error('[DESIGNS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
