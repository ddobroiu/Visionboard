"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { MapPin, Phone, Mail, Sparkles, Facebook, Instagram } from "lucide-react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!email) return;

        setStatus("loading");
        setMessage("");

        // Simulate API call for now or implement later
        setTimeout(() => {
            setStatus("success");
            setMessage("Te-ai abonat cu succes!");
            (form.querySelector('input[name="email"]') as HTMLInputElement).value = "";
            setStatus("idle");
        }, 1000);
    };

    const linkClass = "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm flex items-center gap-2";

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                    {/* 1. Brand & Socials */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-block no-underline">
                            <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-900 bg-clip-text text-transparent">
                                Visionboard.ro
                            </div>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                            {siteConfig.description} Creează-ți propriul vision board și transformă-ți visurile în realitate cu printuri de înaltă calitate.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href="#" className="p-2.5 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all border border-slate-200 dark:border-slate-700">
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2.5 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all border border-slate-200 dark:border-slate-700">
                                <Instagram className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* 2. Navigation Columns */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Produse */}
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">Produse</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/configurator" className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-sm bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg w-fit">
                                        <Sparkles size={14} />
                                        Configurator
                                    </Link>
                                </li>
                                <li><Link href="/shop" className={linkClass}>Magazin</Link></li>
                                <li><Link href="/contact" className={linkClass}>Cere Ofertă</Link></li>
                            </ul>
                        </div>

                        {/* Suport */}
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">Informații</h3>
                            <ul className="space-y-3">
                                <li><Link href="/livrare" className={linkClass}>Livrare</Link></li>
                                <li><Link href="/termeni" className={linkClass}>Termeni și Condiții</Link></li>
                                <li><Link href="/confidentialitate" className={linkClass}>Confidențialitate</Link></li>
                                <li><Link href="/politica-cookies" className={linkClass}>Politica Cookies</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">Contact</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                                    <a href="mailto:contact@visionboard.ro" className={linkClass}>contact@visionboard.ro</a>
                                </li>
                                <li className="pt-2">
                                    <Link href="/contact" className="inline-flex items-center justify-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-sm font-bold transition-colors w-full">
                                        Contactează-ne
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. Newsletter */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Abonează-te la Newsletter</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Primești inspirație și oferte exclusive.
                            </p>
                            <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Adresa ta de email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    disabled={status === "loading"}
                                />
                                <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-slate-200 h-10 rounded-lg text-sm font-bold transition-colors" disabled={status === "loading"}>
                                    {status === "loading" ? "Se trimite..." : "Mă Abonez"}
                                </button>
                            </form>

                            <div className="mt-3 min-h-5">
                                {status !== "idle" && (
                                    <p className={`text-xs font-medium ${status === "success" ? "text-emerald-500" : "text-red-500"}`}>
                                        {message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
                        &copy; {new Date().getFullYear()} Visionboard.ro. Toate drepturile rezervate.
                    </p>
                    <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500">ANPC SAL</a>
                        <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500">Platforma SOL</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
