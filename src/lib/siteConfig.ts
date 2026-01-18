import {
    Image as ImageIcon,
    Tag,
    Facebook,
    Instagram,
    Linkedin,
    ShieldCheck,
    TrendingUp,
    Layers,
} from "lucide-react";

export const siteConfig = {
    name: "Visionboard",
    url: "https://visionboard.ro",
    ogImage: "https://visionboard.ro/og.jpg",
    description:
        "Transformă-ți visurile în realitate! Creează propriul vision board și comandă-l fizic pe suport premium.",
    links: {
        twitter: "https://twitter.com/visionboard",
        facebook: "https://www.facebook.com/visionboard",
    },

    headerNav: [
        {
            label: "Creează",
            href: "/configurator",
        },
        {
            label: "Produse",
            href: "/produse",
        },
        {
            label: "Contact",
            href: "/contact",
        },
    ],

    footerNav: [
        {
            title: "Companie",
            items: [
                { title: "Despre Noi", href: "/despre-noi" },
                { title: "Contact", href: "/contact" },
            ],
        },
        {
            title: "Legal",
            items: [
                { title: "Termeni & Condiții", href: "/termeni" },
                { title: "Confidențialitate", href: "/confidentialitate" },
                { title: "Politica Cookies", href: "/politica-cookies" },
            ],
        },
        {
            title: "Suport",
            items: [
                { title: "Livrare & Retur", href: "/livrare" },
                { title: "Urmărește Comanda", href: "/urmareste-comanda" },
            ],
        },
    ],

    socialLinks: [
        { title: "Facebook", href: "https://www.facebook.com/visionboard", icon: Facebook },
        { title: "Instagram", href: "https://www.instagram.com/visionboard/", icon: Instagram },
    ],
};

export type SiteConfig = typeof siteConfig;
