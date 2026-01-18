import React from 'react';

export const metadata = {
    title: "Politica de Cookies | Visionboard.ro",
    description: "Află cum folosim cookies pe site-ul Visionboard.ro pentru o experiență optimă.",
};

export default function PoliticaCookiesPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100 px-4 pb-12 pt-28">
            <div className="max-w-3xl mx-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow p-8">
                <h1 className="text-3xl font-bold mb-6">Politica de Cookies</h1>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                    <p className="text-lg text-blue-800 dark:text-blue-300 font-semibold mb-2">
                        Utilizăm cookies conform <strong>ePrivacy Directive</strong> și <strong>GDPR</strong>.
                    </p>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Ce sunt cookies?</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Cookies sunt fișiere mici de text stocate pe dispozitivul tău care ne ajută să facem site-ul să funcționeze mai bine (ex: să ținem minte produsele din coș).
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Ce tipuri de cookies folosim?</h2>

                <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">🔒 COOKIES ESENȚIALE</h3>
                        <p className="text-sm text-green-700 dark:text-green-400 mb-2">Strict necesare pentru funcționarea site-ului.</p>
                        <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-400 space-y-1">
                            <li>Coș de cumpărături (salvarea configuratorului).</li>
                            <li>Autentificare utilizator.</li>
                            <li>Securitate.</li>
                        </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📊 COOKIES ANALITICE</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">Opționale. Ne ajută să înțelegem cum este folosit site-ul.</p>
                        <ul className="list-disc pl-5 text-sm text-purple-700 dark:text-purple-400 space-y-1">
                            <li>Google Analytics (statistici trafic anonimizate).</li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Controlul Cookies</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Puteți șterge sau bloca cookies din setările browser-ului dumneavoastră oricând. Rețineți însă că blocarea cookies esențiale poate afecta funcționarea configuratorului și a coșului de cumpărături.
                </p>

                <div className="mt-8 border-t dark:border-slate-700 pt-6 text-center">
                    <a href="/" className="inline-block px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold">Înapoi la prima pagină</a>
                </div>
            </div>
        </main>
    );
}
