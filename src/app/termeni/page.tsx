import React from 'react';

export const metadata = {
    title: "Termeni și condiții | Visionboard.ro",
    description: "Vezi termenii și condițiile de utilizare și procesare comenzi pe Visionboard.ro.",
};

export default function TermeniPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-100 px-4 pb-12 pt-28">
            <div className="max-w-3xl mx-auto rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow p-8">
                <h1 className="text-3xl font-bold mb-6">Termeni și Condiții Generale de Vânzare</h1>
                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                    <p className="text-lg text-red-800 dark:text-red-300 font-semibold mb-2">
                        Document legal conform: <strong>OUG 34/2014</strong> (drepturile consumatorilor), <strong>Legea 449/2003</strong> (vânzarea de bunuri de consum), <strong>Codul Civil</strong> român.
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                        <strong>Operator economic:</strong> CULOAREA DIN VIATA SA SRL | <strong>CUI:</strong> RO44820819 | <strong>J20/1108/2021</strong><br />
                        <strong>Sediul:</strong> Sat Topliceni, Buzău, România | <strong>Autorizare ONRC:</strong> Validă
                    </p>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">1. Informații generale</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Visionboard.ro este o platformă online care oferă servicii de tipar digital și producție de tablouri personalizate (Vision Board). Prețurile afișate includ TVA, iar comenzile sunt procesate doar după confirmarea comenzii.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">2. Comenzi și livrare</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Termenul standard de livrare este 24–48h din momentul confirmării comenzii. Livrarea se face prin curierat rapid (DPD/Fan Courier). Visionboard.ro nu este responsabil pentru întârzierile datorate firmelor de curierat.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">3. Plată și facturare</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Plata se poate efectua online (card bancar), prin ordin de plată sau ramburs la livrare. Facturile sunt emise automat pe baza datelor furnizate de client.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">4. Drepturi de autor și Responsabilitate Conținut</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Clientul este responsabil de drepturile asupra imaginilor, textelor sau designului încărcat pentru tipar. Visionboard.ro nu își asumă răspunderea pentru conținutul trimis de client și nici pentru calitatea imaginilor încărcate (rezoluție mică, etc.).
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">5. Drepturi Consumatori (OUG 34/2014)</h2>
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                    <p className="text-green-900 dark:text-green-300"><strong>Drept de retragere:</strong></p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-green-800 dark:text-green-400">
                        <li><strong>EXCEPȚIE MAJORĂ - Produse personalizate:</strong> Conform Art. 16(c) OUG 34/2014, produsele realizate după specificațiile consumatorului (ex. tablouri cu pozele clientului) <strong>NU beneficiază de dreptul de retragere</strong>. Aceste produse sunt finale.</li>
                        <li><strong>Produse standard (dacă există):</strong> Drept de retragere 14 zile.</li>
                        <li><strong>Reclamații:</strong> Orice defect de fabricație trebuie semnalat în 48h de la primire la contact@visionboard.ro.</li>
                    </ul>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">6. Garanție</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Oferim garanție de conformitate conform legii 449/2003. Produsele defecte sau neconforme vor fi înlocuite gratuit. Garanția nu acoperă uzura normală sau deteriorările cauzate de manipulare necorespunzătoare.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">7. Soluționarea Litigiilor</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
                    <p className="text-yellow-900 dark:text-yellow-300"><strong>Soluționarea alternativă a litigiilor (SAL):</strong></p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-yellow-800 dark:text-yellow-400">
                        <li><strong>ANPC SAL:</strong> <a href="https://anpc.ro/ce-este-sal/" target="_blank" className="underline">anpc.ro/ce-este-sal</a></li>
                        <li><strong>Platforma SOL (UE):</strong> <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" className="underline">ec.europa.eu/consumers/redress</a></li>
                        <li><strong>Jurisdicția:</strong> Instanțele române.</li>
                    </ul>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Email: <a href="mailto:contact@visionboard.ro" className="text-indigo-600 underline">contact@visionboard.ro</a><br />
                    Tel: <a href="tel:0750473111" className="text-indigo-600 underline">0750 473 111</a><br />
                    Program: L–V 9:00–18:00
                </p>

                <div className="mt-8 border-t dark:border-slate-700 pt-6">
                    <p className="text-xs text-slate-500 text-center mb-4">
                        <strong>Document actualizat:</strong> 18.01.2026 |
                        <strong>Versiunea:</strong> 1.0
                    </p>
                    <div className="text-center">
                        <a href="/" className="inline-block px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow transition transform hover:-translate-y-0.5">Înapoi la prima pagină</a>
                    </div>
                </div>
            </div>
        </main>
    );
}
