"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";

export default function ContactClient() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(null);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'A apărut o eroare.');
            setSent(true);
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (err: any) {
            setError(err.message || "Eroare la trimitere.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center lg:p-8 p-0 pt-24 lg:pt-28">
            <div className="w-full max-w-[1600px] bg-white dark:bg-slate-950 lg:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 min-h-screen lg:min-h-[800px] flex flex-col lg:flex-row">

                {/* Left Panel - Info & Branding */}
                <div className="relative lg:w-5/12 bg-slate-100 dark:bg-slate-900 p-8 lg:p-16 flex flex-col justify-between overflow-hidden">
                    {/* Background blobs */}
                    <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

                    <div className="relative z-10">
                        <Link href="/" className="inline-block mb-12 opacity-80 hover:opacity-100 transition">
                            <span className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">← Înapoi la site</span>
                        </Link>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
                            Hai să <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">colaborăm.</span>
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                            Fie că ai nevoie de canvas-uri personalizate, configuratoare sau doar un sfat, suntem aici.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 space-y-8">
                        {/* Email */}
                        <div className="flex items-start gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-violet-500/50 group-hover:bg-violet-500/5 transition-all duration-300 shadow-sm">
                                <Mail className="w-5 h-5 text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Email</h3>
                                <a href="mailto:contact@visionboard.ro" className="text-slate-500 dark:text-slate-400 hover:text-violet-500 transition-colors">contact@visionboard.ro</a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-green-500/50 group-hover:bg-green-500/5 transition-all duration-300 shadow-sm">
                                <Phone className="w-5 h-5 text-slate-900 dark:text-white group-hover:text-green-500 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Telefon & WhatsApp</h3>
                                <a href="tel:0750473111" className="text-slate-500 dark:text-slate-400 hover:text-green-500 transition-colors">0750 473 111</a>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                                <MapPin className="w-5 h-5 text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Locație</h3>
                                <p className="text-slate-500 dark:text-slate-400">România, Online & Livrare Națională</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="lg:w-7/12 bg-white dark:bg-slate-950 p-8 lg:p-20 flex flex-col justify-center relative">
                    {sent ? (
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Mesaj recepționat!</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Mulțumim că ne-ai contactat. Echipa noastră a primit detaliile și te va contacta în cel mai scurt timp posibil.</p>
                            <button onClick={() => setSent(false)} className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Trimite un alt mesaj</button>
                        </div>
                    ) : (
                        <div className="max-w-lg mx-auto w-full">
                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Trimite-ne un mesaj</h2>
                                <p className="text-slate-500 dark:text-slate-400">Completează formularul de mai jos.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-slate-900 dark:text-white ml-1">Nume complet</label>
                                        <input
                                            id="name" name="name"
                                            placeholder="ex: Ion Popescu"
                                            required
                                            value={form.name} onChange={handleChange}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-semibold text-slate-900 dark:text-white ml-1">Telefon (opțional)</label>
                                        <input
                                            id="phone" name="phone"
                                            placeholder="07xx xxx xxx"
                                            value={form.phone} onChange={handleChange}
                                            className="w-full h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-slate-900 dark:text-white ml-1">Adresă de email</label>
                                    <input
                                        id="email" name="email" type="email"
                                        placeholder="ex: ion@gmail.com"
                                        required
                                        value={form.email} onChange={handleChange}
                                        className="w-full h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-slate-900 dark:text-white ml-1">Cu ce te putem ajuta?</label>
                                    <textarea
                                        id="message" name="message"
                                        required
                                        rows={4}
                                        placeholder="Salut, aș dori detalii despre..."
                                        value={form.message} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 outline-none resize-none transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-base font-bold tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Se trimite...
                                        </>
                                    ) : "Trimite Mesajul"}
                                </button>

                                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-6">
                                    Prin trimiterea acestui formular, ești de acord cu <Link href="/termeni" className="underline hover:text-slate-900 dark:hover:text-white">Termenii și Condițiile</Link> noastre.
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
