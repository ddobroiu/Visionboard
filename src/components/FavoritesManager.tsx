"use client";

import { useState } from "react";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FavoriteProduct {
    id: string;
    productSlug: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export default function FavoritesManager() {
    // În viitor, acestea vor veni din DB sau localStorage
    const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

    const removeFavorite = (id: string) => {
        setFavorites(prev => prev.filter(f => f.id !== id));
    };

    if (favorites.length === 0) {
        return (
            <div className="text-center py-20 px-4 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <Heart size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nu ai niciun favorit selectat</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                    Adaugă tablourile canvas sau plexiglas care îți plac la favorite pentru a le găsi mai ușor data viitoare.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/canvas"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all active:scale-95"
                    >
                        Creează Canvas <ArrowRight size={18} />
                    </Link>
                    <Link
                        href="/plexiglass"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white dark:text-black text-white rounded-xl font-bold transition-all active:scale-95"
                    >
                        Print Plexiglas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Favoritele mele</h2>
                    <p className="text-gray-600 dark:text-gray-400">Produse salvate în contul tău</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map((product) => (
                    <div
                        key={product.id}
                        className="group relative bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                    >
                        <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-slate-800">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={() => removeFavorite(product.id)}
                                    className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg text-red-500 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
                                    title="Elimină de la favorite"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                    {product.category}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                                {product.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-xl font-black text-slate-900 dark:text-white">
                                    {product.price} RON
                                </span>
                                <Link
                                    href={`/${product.productSlug}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    <ShoppingCart size={16} /> Detalii
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
