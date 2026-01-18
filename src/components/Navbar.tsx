"use client";

import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
    const { cartCount } = useCart();
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="no-underline">
                    <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-900 bg-clip-text text-transparent">
                        Visionboard.ro
                    </div>
                </Link>

                <nav className="hidden md:flex gap-8 items-center">
                    <Link href="/" className="text-slate-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Acasă
                    </Link>
                    <Link href="/shop" className="text-slate-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Magazin
                    </Link>
                    <Link href="/configurator" className="text-slate-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Configurator
                    </Link>
                </nav>

                <div className="flex gap-4 items-center">
                    <Link href={session?.user ? "/account" : "/login"} className="text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 p-2">
                        <User size={24} />
                    </Link>

                    <Link href="/checkout" className="text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 relative p-2">
                        <ShoppingCart size={24} />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <Link href="/configurator" className="hidden sm:inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                        Start Design
                    </Link>
                </div>
            </div>
        </header>
    );
}
