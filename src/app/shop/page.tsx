import Link from 'next/link';
import Image from 'next/image';

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
            <section className="bg-indigo-50 dark:bg-slate-800/50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Modele Gata Făcute</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Alege un design creat de experți și personalizează-l minimal sau comandă-l direct.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {SHOP_ITEMS.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <div className="h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wide">
                                        {item.category}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                                    <div className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                                        {item.price} Lei
                                    </div>
                                    <Link href={`/configurator?template=${item.id}`} className="block w-full text-center rounded-xl border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white font-semibold py-3 transition-colors">
                                        Personalizează
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
