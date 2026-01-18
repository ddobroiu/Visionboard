"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff } from 'lucide-react';
import Navbar from "@/components/Navbar";

export default function LoginPage() {
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [mode, setMode] = useState<'magic' | 'password'>('password');
    const [isResetView, setIsResetView] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [regName, setRegName] = useState("");
    const [regConfirm, setRegConfirm] = useState("");

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            if (mode === 'magic') {
                const res = await signIn("email", { email, redirect: false, callbackUrl: "/account" });
                if ((res as any)?.error) {
                    setError('Nu s-a putut trimite linkul.');
                } else {
                    setSuccess('Verifică emailul pentru link de autentificare.');
                }
            } else {
                const res = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/account" });
                if ((res as any)?.error) {
                    setError('Email sau parolă incorecte.');
                } else if ((res as any)?.ok) {
                    window.location.href = '/account';
                } else {
                    setError('Autentificare eșuată.');
                }
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleResetRequest(e: FormEvent) {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('/api/auth/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setSuccess('Dacă există un cont cu acest email, vei primi instrucțiunile de resetare.');
            } else {
                setError(data.message || 'Nu s-a putut trimite cererea.');
            }
        } catch (err) {
            setError('Eroare de conexiune.');
        } finally {
            setLoading(false);
        }
    }

    async function onRegister(e: FormEvent) {
        e.preventDefault();
        if (!email || password.length < 8 || password !== regConfirm) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name: regName }),
            });
            const data = await res.json();
            if (!res.ok || !data?.success) {
                setError(data?.message || 'Crearea contului a eșuat');
                return;
            }
            const loginRes = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/account?welcome=1' });
            if ((loginRes as any)?.error) {
                setError('Cont creat dar autentificarea automată a eșuat — încearcă să te loghezi.');
            } else {
                window.location.href = '/account?welcome=1';
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setError(null);
        setSuccess(null);
    }, [tab, isResetView]);

    return (
        <>
            <div className="flex min-h-[calc(100vh-100px)] items-center justify-center pb-12 pt-24 " style={{ background: 'var(--background)' }}>
                <div className="w-full max-w-md space-y-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl">
                    <div className="flex justify-center mb-4">
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #7c3aed, #4c1d95)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Visionboard.ro
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-black dark:text-white text-center">
                        {isResetView ? 'Resetare Parolă' : 'Contul Meu'}
                    </h1>

                    {!isResetView && (
                        <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-inner">
                            <button
                                type="button"
                                onClick={() => setTab('login')}
                                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${tab === 'login'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >Autentificare</button>
                            <button
                                type="button"
                                onClick={() => setTab('register')}
                                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${tab === 'register'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >Creează cont</button>
                        </div>
                    )}

                    <div className="space-y-5">

                        {tab === 'login' && !isResetView && (
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-black dark:text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="email@exemplu.ro"
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                {mode === 'password' && (
                                    <div>
                                        <label className="block text-sm font-medium text-black dark:text-white mb-1">Parolă</label>
                                        <div className="relative">
                                            <input
                                                type={showLoginPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-black dark:text-white placeholder-slate-400 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                placeholder="••••••••"
                                                required
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                                            >
                                                {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !email || (mode === 'password' && !password)}
                                    className="w-full rounded-lg px-4 py-2 bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {loading ? 'Se procesează...' : mode === 'magic' ? 'Trimite link de login' : 'Autentifică-te'}
                                </button>

                                <div className="flex items-center justify-between text-xs pt-1">
                                    <button
                                        type="button"
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
                                        onClick={() => setMode(m => m === 'password' ? 'magic' : 'password')}
                                    >
                                        {mode === 'password' ? 'Login cu link pe email' : 'Login cu parolă'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setError(null); setSuccess(null); setIsResetView(true); }}
                                        className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:underline transition-colors"
                                    >
                                        Resetare parolă
                                    </button>
                                </div>
                            </form>
                        )}

                        {isResetView && (
                            <form onSubmit={handleResetRequest} className="space-y-4">
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                                    <p className="text-sm text-black dark:text-white mb-4">Introdu adresa de email și îți vom trimite un link pentru a seta o parolă nouă.</p>

                                    <div className="text-left mb-4">
                                        <label className="block text-sm font-medium text-black dark:text-white mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-black dark:text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            placeholder="email@exemplu.ro"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="w-full rounded-lg px-4 py-2 bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
                                    >
                                        {loading ? 'Se trimite...' : 'Trimite link resetare'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsResetView(false)}
                                        className="mt-4 text-xs text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:underline"
                                    >
                                        ← Înapoi la autentificare
                                    </button>
                                </div>
                            </form>
                        )}

                        {tab === 'register' && !isResetView && (
                            <form onSubmit={onRegister} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-1">Nume (opțional)</label>
                                    <input
                                        type="text"
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-black dark:text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="Nume și prenume"
                                        autoComplete="name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-black dark:text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="email@exemplu.ro"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-1">Parolă</label>
                                    <div className="relative">
                                        <input
                                            type={showRegisterPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-black dark:text-white placeholder-slate-400 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            placeholder="Minim 8 caractere"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-1">Confirmă parola</label>
                                    <div className="relative">
                                        <input
                                            type={showRegisterPassword ? "text" : "password"}
                                            value={regConfirm}
                                            onChange={(e) => setRegConfirm(e.target.value)}
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-black dark:text-white placeholder-slate-400 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            placeholder="Repetă parola"
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !email || password.length < 8 || password !== regConfirm}
                                    className="w-full rounded-lg px-4 py-2 bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
                                >{loading ? 'Se procesează...' : 'Creează cont'}</button>
                            </form>
                        )}

                        {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm text-center">{error}</div>}
                        {success && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm text-center">{success}</div>}

                        {!isResetView && tab === 'login' && mode === 'password' && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 text-center pt-2">Nu ai cont? Îl poți crea rapid aici sau la checkout.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
