import { Metadata } from 'next';
import LivrareClient from "@/components/LivrareClient";

export const metadata: Metadata = {
    title: 'Livrare și Transport | Visionboard.ro',
    description: 'Află detalii despre modalitățile de livrare, costuri de transport și timpii de execuție pentru produsele Visionboard.ro.',
    keywords: ['livrare', 'transport', 'costuri livrare', 'visionboard', 'livrare tablouri'],
    alternates: {
        canonical: '/livrare',
    },
};

export default function LivrarePage() {
    return <LivrareClient />;
}
