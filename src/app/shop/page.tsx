"use client";

import React, { useMemo, useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Filter,
    X,
    ChevronLeft,
    ChevronRight,
    Search,
    ChevronDown,
    Menu
} from "lucide-react";
import { PRODUCTS, Product, CATEGORIES_ORDER } from "@/lib/products";

// --- CONFIG ---
const ITEMS_PER_PAGE = 12;

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    // 1. URL State
    const selectedCategory = searchParams.get("category") || "Toate";
    const selectedSubcategory = searchParams.get("subcategory") || "Toate";
    const searchTerm = searchParams.get("search") || "";
    const [currentPage, setCurrentPage] = useState(1);

    // 2. Handler update URL
    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "" || value === "Toate") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        if (updates.category && updates.category !== selectedCategory) {
            params.delete("subcategory");
        }

        const newUrl = `${pathname}?${params.toString()}`;
        startTransition(() => {
            router.push(newUrl, { scroll: false });
        });
        setCurrentPage(1);
    };

    // 3. Data Processing
    const categories = useMemo(() => {
        const displayedCats = Array.from(new Set(PRODUCTS.map(p => p.category)));
        // Sort by predefined order
        return ["Toate", ...displayedCats.sort((a, b) => {
            const idxA = CATEGORIES_ORDER.indexOf(a);
            const idxB = CATEGORIES_ORDER.indexOf(b);
            return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
        })];
    }, []);

    const subcategories = useMemo(() => {
        if (selectedCategory === "Toate") return [];
        return Array.from(new Set(PRODUCTS
            .filter(p => p.category === selectedCategory)
            .map(p => p.subcategory)
        )).sort();
    }, [selectedCategory]);

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(p => {
            if (selectedCategory !== "Toate" && p.category !== selectedCategory) return false;
            if (selectedSubcategory !== "Toate" && p.subcategory !== selectedSubcategory) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                if (!p.title.toLowerCase().includes(term) && !p.description.toLowerCase().includes(term)) return false;
            }
            return true;
        });
    }, [selectedCategory, selectedSubcategory, searchTerm]);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    // Local state for sidebar on mobile
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [localSearch, setLocalSearch] = useState(searchTerm);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchTerm) updateFilters({ search: localSearch });
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 pt-20"> {/* PT-20 for fixed header */}

            {/* --- HERO HEADER --- */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 px-4 mb-8">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Magazin <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Visionboard</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                        Alege template-ul perfect pentru visurile tale sau configureazÄƒ un produs de la zero.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- MOBILE TOGGLE --- */}
                    <button
                        className="lg:hidden w-full flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 font-bold"
                        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    >
                        <span>{showMobileSidebar ? "Ascunde Filtre" : "AratÄƒ Filtre & Categorii"}</span>
                        <Filter size={20} />
                    </button>

                    {/* --- SIDEBAR --- */}
                    <aside className={`lg:w-72 shrink-0 space-y-8 ${showMobileSidebar ? 'block' : 'hidden lg:block'}`}>

                        {/* SEARCH */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Search size={18} /> CÄƒutare
                            </h3>
                            <div className="relative">
                                <input
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                    placeholder="CautÄƒ..."
                                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                                />
                                {localSearch && (
                                    <button onClick={() => setLocalSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"><X size={14} /></button>
                                )}
                            </div>
                        </div>

                        {/* CATEGORII */}
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Filter size={18} /> Categorii
                            </h3>
                            <div className="flex flex-col gap-1">
                                {categories.map(cat => (
                                    <div key={cat}>
                                        <button
                                            onClick={() => updateFilters({ category: cat })}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between font-medium ${selectedCategory === cat
                                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-[1.02]"
                                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                }`}
                                        >
                                            {cat}
                                            {selectedCategory === cat && <ChevronRight size={16} />}
                                        </button>

                                        {/* Nested Subcategories */}
                                        {selectedCategory === cat && subcategories.length > 0 && (
                                            <div className="ml-4 mt-2 pl-4 border-l-2 border-slate-100 dark:border-slate-700 space-y-1 animate-in slide-in-from-left-2 duration-200">
                                                <button
                                                    onClick={() => updateFilters({ subcategory: "Toate" })}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${selectedSubcategory === "Toate" ? "text-violet-600 bg-violet-50 dark:bg-violet-900/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                                        }`}
                                                >
                                                    Toate
                                                </button>
                                                {subcategories.map(sub => (
                                                    <button
                                                        key={sub}
                                                        onClick={() => updateFilters({ subcategory: sub })}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedSubcategory === sub
                                                                ? "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-900/30 font-bold"
                                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                                            }`}
                                                    >
                                                        {sub}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* --- GRID & CONTENT --- */}
                    <div className="flex-1 min-w-0">
                        {/* Header Rezultate */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {selectedCategory === "Toate" ? "Toate Produsele" : selectedCategory}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {filteredProducts.length} rezultate
                                </p>
                            </div>
                            {/* Active Filters Tags */}
                            <div className="flex gap-2">
                                {selectedSubcategory !== "Toate" && (
                                    <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-full flex items-center gap-1">
                                        {selectedSubcategory} <button onClick={() => updateFilters({ subcategory: "Toate" })}><X size={12} /></button>
                                    </span>
                                )}
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <>
                                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                                    {paginatedProducts.map((product) => (
                                        <div key={product.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="aspect-[4/5] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                    {product.category}
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <div className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-2 uppercase tracking-wider">
                                                    {product.subcategory}
                                                </div>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 leading-tight">
                                                    {product.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                                                    {product.description}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                                                        {product.price} Lei
                                                    </span>
                                                    <Link
                                                        href={`/configurator?product=${product.id}`}
                                                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-violet-600 dark:hover:bg-violet-200 transition-colors"
                                                    >
                                                        PersonalizeazÄƒ
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center gap-2">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="px-4 py-2 font-bold text-slate-700 dark:text-slate-300">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Nu am gÄƒsit produse</h3>
                                <p className="text-slate-500">ÃŽncearcÄƒ alte filtre.</p>
                                <button onClick={() => updateFilters({ category: "Toate", subcategory: null, search: "" })} className="mt-4 text-violet-600 font-bold hover:underline">ReseteazÄƒ tot</button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Se încarcă magazinul...</div>}>
            <ShopContent />
        </Suspense>
    );
}

