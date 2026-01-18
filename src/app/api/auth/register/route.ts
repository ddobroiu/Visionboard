import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ success: false, message: 'Email invalid.' }, { status: 400 });
        }
        if (!password || typeof password !== 'string' || password.length < 8) {
            return NextResponse.json({ success: false, message: 'Parola trebuie să aibă minim 8 caractere.' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({
            where: {
                email_source: {
                    email,
                    source: "Visionboard"
                }
            }
        });
        if (existing) {
            return NextResponse.json({ success: false, message: 'Există deja un cont cu acest email pe Visionboard.' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                source: "Visionboard",
                name: (typeof name === 'string' && name.trim()) ? name.trim() : undefined,
                passwordHash,
            },
        });

        await sendWelcomeEmail(user.email!, user.name || "Client");

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error('[register] error', e?.message || e);
        return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
    }
}
