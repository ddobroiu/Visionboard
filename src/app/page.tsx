import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowRight, Palette, Layers, Box } from 'lucide-react';

export default function Home() {
    return (
        <main>
            <Navbar />

            {/* Hero */}
            <section className="section" style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #7c3aed, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
                        Transformă Visurile în Realitate
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--secondary-foreground)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Creează-ți propriul Visionboard online și comandă-l imprimat premium pe Canvas, Forex sau Sticlă Acrilică. Vizualizează succesul în fiecare zi.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/configurator" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                            Creează Visionboard <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section" style={{ background: 'var(--accent)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Cum Funcționează</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ width: '3rem', height: '3rem', background: 'var(--primary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem' }}>
                                <Palette size={24} />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>1. Configurează Online</h3>
                            <p style={{ color: 'var(--secondary-foreground)' }}>
                                Folosește editorul nostru intuitiv. Încarcă pozele tale, adaugă citate motivaționale și stickere pentru a-ți contura viziunea.
                            </p>
                        </div>

                        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ width: '3rem', height: '3rem', background: 'var(--primary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem' }}>
                                <Layers size={24} />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>2. Alege Materialul</h3>
                            <p style={{ color: 'var(--secondary-foreground)' }}>
                                Selectează suportul ideal pentru camera ta: Canvas textura, Forex modern și ușor, sau Sticlă Acrilică premium.
                            </p>
                        </div>

                        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ width: '3rem', height: '3rem', background: 'var(--primary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.5rem' }}>
                                <Box size={24} />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>3. Livrare Rapidă</h3>
                            <p style={{ color: 'var(--secondary-foreground)' }}>
                                Plasăm comanda în producție și îți livrăm tabloul gata de agățat pe perete în cel mai scurt timp.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem 0', marginTop: 'auto' }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--secondary-foreground)' }}>
                    &copy; {new Date().getFullYear()} Visionboard.ro. Toate drepturile rezervate.
                </div>
            </footer>
        </main>
    )
}
