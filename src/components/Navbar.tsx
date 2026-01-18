"use client";

import Link from 'next/link';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { cartCount } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/checkout" className="relative group" style={{ textDecoration: 'none', color: 'var(--foreground)', marginRight: '1rem' }}>
                        <div style={{ position: 'relative', padding: '0.5rem' }}>
                            <ShoppingCart size={24} />
                            {mounted && cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </Link>

                    <Link href="/configurator" className="btn btn-primary">
                        Start Design
                    </Link>
                </div>
            </div>
        </header>
    );
}
