import Link from 'next/link';
import { ArrowRight, Palette, Layers, Box } from 'lucide-react';

export default function Home() {
    return (
        <main>
            {/* Hero */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                        Transformă Visurile în Realitate
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                        Creează-ți propriul Visionboard online și comandă-l imprimat premium pe Canvas, Forex sau Sticlă Acrilică. Vizualizează succesul în fiecare zi.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/configurator" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all">
                            Creează Visionboard <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">Cum Funcționează</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-6">
                                <Palette size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">1. Configurează Online</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Folosește editorul nostru intuitiv. Încarcă pozele tale, adaugă citate motivaționale și stickere pentru a-ți contura viziunea.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-6">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">2. Alege Materialul</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Selectează suportul ideal pentru camera ta: Canvas textura, Forex modern și ușor, sau Sticlă Acrilică premium.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-6">
                                <Box size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">3. Livrare Rapidă</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Plasăm comanda în producție și îți livrăm tabloul gata de agățat pe perete în cel mai scurt timp.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    )
}
