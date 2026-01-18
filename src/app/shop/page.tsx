import Navbar from '@/components/Navbar';
import Link from 'next/link';

// Mock data for shop items
const SHOP_ITEMS = [
    {
        id: 1,
        title: 'Visionboard Cariera & Succes',
        price: 150,
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2874&auto=format&fit=crop', // Placeholder
        category: 'Cariera'
    },
    {
        id: 2,
        title: 'Visionboard Wellness & Health',
        price: 150,
        image: 'https://images.unsplash.com/photo-1544367563-12123d832d34?q=80&w=2940&auto=format&fit=crop', // Placeholder
        category: 'Sanatate'
    },
    {
        id: 3,
        title: 'Visionboard Travel & Adventure',
        price: 150,
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2938&auto=format&fit=crop', // Placeholder
        category: 'Calatorii'
    },
    {
        id: 4,
        title: 'Visionboard Love & Family',
        price: 150,
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2940&auto=format&fit=crop', // Placeholder
        category: 'Familie'
    },
];

export default function ShopPage() {
    return (
        <main>
            <Navbar />

            <section className="section" style={{ background: 'var(--accent)', paddingBottom: '2rem' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Modele Gata Făcute</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--secondary-foreground)', maxWidth: '600px', margin: '0 auto' }}>
                        Alege un design creat de experți și personalizează-l minimal sau comandă-l direct.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {SHOP_ITEMS.map((item) => (
                            <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface)', transition: 'transform 0.2s' }}>
                                <div style={{ height: '200px', background: '#e2e8f0', position: 'relative' }}>
                                    {/* Using standard img tag for simplicity with external urls for now, or Next Image if configured */}
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {item.category}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                                        {item.price} Lei
                                    </div>
                                    <Link href={`/configurator?template=${item.id}`} className="btn btn-outline" style={{ width: '100%' }}>
                                        Personalizează
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem 0', marginTop: 'auto' }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--secondary-foreground)' }}>
                    &copy; {new Date().getFullYear()} Visionboard.ro. Toate drepturile rezervate.
                </div>
            </footer>
        </main>
    );
}
