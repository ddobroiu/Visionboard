import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politica de Confidențialitate (GDPR) | Visionboard.ro',
    description: 'Află cum colectăm, utilizăm și protejăm datele tale personale conform GDPR. Visionboard.ro respectă intimitatea ta.',
    keywords: ['confidențialitate', 'gdpr', 'protectia datelor', 'visionboard', 'politica date'],
    alternates: {
        canonical: '/confidentialitate',
    },
};

export default function ConfidentialitatePage() {
    return (
        <div className="container mx-auto px-4 pb-12 pt-28 max-w-4xl text-slate-800 dark:text-gray-200">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Politica de Confidențialitate GDPR</h1>

            <div className="prose dark:prose-invert max-w-none space-y-6">
                <p><strong>Actualizat la:</strong> 18.01.2026 | <strong>Versiunea:</strong> 1.0</p>
                <p><strong>Operator de date:</strong> CULOAREA DIN VIATA SA SRL, CUI: RO44820819, J20/1108/2021, Sat Topliceni, Buzău, România</p>
                <p><strong>Contact DPO:</strong> contact@visionboard.ro</p>

                <section className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h2 className="text-xl font-bold mt-2 mb-2 text-red-800 dark:text-red-300">1. Ce date colectăm?</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Date de identificare:</strong> Nume, prenume.</li>
                        <li><strong>Date de contact:</strong> Email, număr de telefon, adresă de livrare/facturare.</li>
                        <li><strong>Date despre comenzi:</strong> Produsele comandate, imagini urcate pentru personalizare.</li>
                        <li><strong>Date tehnice:</strong> IP, browser (prin cookies).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mt-6 mb-2">2. Scopul prelucrării</h2>
                    <p>Folosim datele dvs. pentru:</p>
                    <ul className="list-disc pl-5">
                        <li>Procesarea și livrarea comenzilor de tablouri personalizate.</li>
                        <li>Facturare și obligații fiscale.</li>
                        <li>Comunicarea legată de statusul comenzii.</li>
                        <li>Suport clienți și rezolvarea reclamațiilor.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mt-6 mb-2">3. Partajarea datelor</h2>
                    <p>
                        Datele dvs. pot fi transmise către:
                        Firme de curierat (pentru livrare), Procesatori de plăți (pentru încasarea banilor), Furnizori de servicii IT (hosting).
                        Nu vindem datele dvs. către terți.
                    </p>
                </section>

                <section className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h2 className="text-xl font-bold mt-2 mb-2 text-green-800 dark:text-green-300">4. Drepturile Dumneavoastră</h2>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Dreptul de acces, rectificare și ștergere (&quot;dreptul de a fi uitat&quot;).</li>
                        <li>Dreptul la restricționarea prelucrării.</li>
                        <li>Dreptul la portabilitatea datelor.</li>
                        <li>Dreptul de a depune o plângere la ANSPDCP (dataprotection.ro).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mt-6 mb-2">5. Securitatea Datelor</h2>
                    <p>
                        Implementăm măsuri tehnice și organizatorice (criptare, acces restricționat) pentru a proteja datele dvs. personale împotriva pierderii sau accesului neautorizat. Imaginile urcate pentru tablouri sunt șterse periodic după finalizarea comenzii, conform politicii interne.
                    </p>
                </section>

                <section className="mt-8 border-t dark:border-slate-700 pt-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Pentru exercitarea drepturilor sau întrebări, contactați-ne la: <a href="mailto:contact@visionboard.ro" className="text-indigo-600 underline">contact@visionboard.ro</a>
                    </p>
                    <div className="mt-4 text-center">
                        <a href="/" className="inline-block px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold">Înapoi la prima pagină</a>
                    </div>
                </section>
            </div>
        </div>
    );
}
