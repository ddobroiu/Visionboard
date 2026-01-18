import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
    return (
        <header style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #7c3aed, #4c1d95)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Visionboard.ro
                    </div>
                </Link>

                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'var(--foreground)', fontWeight: 500 }}>
                        Acasă
                    </Link>
                    <Link href="/shop" style={{ textDecoration: 'none', color: 'var(--foreground)', fontWeight: 500 }}>
                        Magazin
                    </Link>
                    <Link href="/configurator" style={{ textDecoration: 'none', color: 'var(--foreground)', fontWeight: 500 }}>
                        Configurator
                    </Link>
                </nav>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/shop" className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                        <ShoppingBag size={20} />
                        <span>Modele</span>
                    </Link>
                    <Link href="/configurator" className="btn btn-primary">
                        Start Design
                    </Link>
                </div>
            </div>
        </header>
    );
}
