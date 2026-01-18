import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email || typeof email !== 'string') {
            return NextResponse.json({ success: false, message: 'Email invalid.' }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: {
                email_source: {
                    email,
                    source: "Visionboard"
                }
            }
        });
        if (!user) {
            return NextResponse.json({ success: true, message: 'Dacă există un cont, vei primi email.' });
        }

        // Delete existing tokens for this user
        await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min

        await prisma.passwordResetToken.create({
            data: {
                token,
                expires,
                userId: user.id
            }
        });

        await sendPasswordResetEmail(email, token);

        return NextResponse.json({ success: true, message: 'Email trimis (dacă există cont).' });
    } catch (e: any) {
        console.error('[request-reset] error', e?.message || e);
        // Silent fail to user, log error
        return NextResponse.json({ success: true, message: 'Email trimis...' });
    }
}
