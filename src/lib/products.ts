export type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    subcategory: string;
    tags?: string[];
};

export const PRODUCTS: Product[] = [
    // --- CANVAS ---
    {
        id: "canvas-bumbac-1",
        title: "Tablou Canvas Bumbac Premium",
        description: "Print de înaltă rezoluție pe pânză din bumbac 100%, textură fină.",
        price: 99,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2845&auto=format&fit=crop",
        category: "Canvas",
        subcategory: "Bumbac"
    },
    {
        id: "canvas-sintetic-1",
        title: "Tablou Canvas Sintetic",
        description: "O opțiune economică și durabilă, culori vibrante.",
        price: 69,
        image: "https://images.unsplash.com/photo-1579783483458-83d02161294e?q=80&w=2897&auto=format&fit=crop",
        category: "Canvas",
        subcategory: "Sintetic"
    },

    // --- TABLOURI ÎNRĂMATE ---
    {
        id: "framed-minimal-1",
        title: "Tablou Înrămat Minimalist",
        description: "Print artă digitală cu ramă din lemn natur.",
        price: 129,
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2874&auto=format&fit=crop",
        category: "Tablouri",
        subcategory: "Înrămate"
    },
    {
        id: "framed-black-1",
        title: "Set 3 Tablouri Abstracte",
        description: "Set decorativ modern pentru living.",
        price: 249,
        image: "https://images.unsplash.com/photo-1544367563-12123d832d34?q=80&w=2940&auto=format&fit=crop",
        category: "Tablouri",
        subcategory: "Seturi"
    },

    // --- VISION BOARD TEMPLATES ---
    {
        id: "vb-career",
        title: "Template Vision Board Carieră",
        description: "Design specializat pentru obiective profesionale.",
        price: 150,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
        category: "Vision Board",
        subcategory: "Carieră"
    },
    {
        id: "vb-travel",
        title: "Template Vision Board Călătorii",
        description: "Inspiră-te pentru următoarea vacanță.",
        price: 150,
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2938&auto=format&fit=crop",
        category: "Vision Board",
        subcategory: "Călătorii"
    },
    {
        id: "vb-love",
        title: "Template Vision Board Relații",
        description: "Manifestă relația ideală.",
        price: 150,
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2940&auto=format&fit=crop",
        category: "Vision Board",
        subcategory: "Dragoste"
    },
    {
        id: "vb-health",
        title: "Template Vision Board Sănătate",
        description: "Focus pe wellness și echilibru.",
        price: 150,
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2940&auto=format&fit=crop",
        category: "Vision Board",
        subcategory: "Sănătate"
    },

    // --- POSTERE ---
    {
        id: "poster-a3",
        title: "Poster Motivational A3",
        description: "Hârtie fotografică premium, finish mat.",
        price: 29,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2944&auto=format&fit=crop",
        category: "Postere",
        subcategory: "A3"
    }
];

export const CATEGORIES_ORDER = ["Vision Board", "Canvas", "Tablouri", "Postere"];
