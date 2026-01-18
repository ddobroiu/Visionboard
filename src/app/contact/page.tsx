import { Metadata } from 'next';
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = {
    title: 'Contactează-ne | Visionboard.ro',
    description: 'Ai întrebări despre serviciile noastre sau despre vision board-ul tău? Contactează echipa Visionboard.ro prin email, telefon sau WhatsApp.',
    keywords: ['contact', 'visionboard', 'suport', 'tablouri personalizate'],
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
