import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Numele, emailul și mesajul sunt obligatorii.' }, { status: 400 });
        }

        await sendContactFormEmail({ name, email, phone, message });

        return NextResponse.json({ success: true, message: 'Mesaj trimis cu succes!' });
    } catch (error: any) {
        console.error('[API/Contact] Error:', error);
        return NextResponse.json({ error: 'Eroare la trimiterea mesajului. Te rugăm să încerci din nou mai târziu.' }, { status: 500 });
    }
}
