export interface ConfigElement {
    id: string;
    type: 'image' | 'text';
    content: string; // Used for text content or image URL
    x: number;
    y: number;
    style?: React.CSSProperties;
    // Style props
    fontSize?: number;
    color?: string; // Used for text color OR image tint (via mask)
    fontFamily?: string;
    fontWeight?: string;
    // Common props
    scale?: number;
    borderRadius?: string;
    maskShape?: 'none' | 'rect' | 'circle' | 'heart' | 'star' | 'hexagon' | 'square';
    rotation?: number;
    effect?: 'none' | 'shadow' | 'lift' | 'hollow' | 'splice' | 'echo' | 'glitch' | 'neon' | '3d';
    // Filters
    filters?: {
        brightness?: number;
        contrast?: number;
        grayscale?: number;
        sepia?: number;
        blur?: number;
        hueRotate?: number;
        saturate?: number;
    };
}

export const FONTS = [
    // Sans Serif
    { label: 'Outfit (Modern)', value: 'var(--font-outfit), sans-serif' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Bebas Neue (Solid)', value: 'Bebas Neue, sans-serif' },
    { label: 'Righteous', value: 'Righteous, cursive' },

    // Serif
    { label: 'Playfair Display', value: 'Playfair Display, serif' },
    { label: 'Cinzel (Elegant)', value: 'Cinzel, serif' },
    { label: 'Clasic', value: 'Times New Roman, serif' },

    // Handwritten / Script
    { label: 'Dancing Script', value: 'Dancing Script, cursive' },
    { label: 'Pacifico', value: 'Pacifico, cursive' },
    { label: 'Caveat', value: 'Caveat, cursive' },
    { label: 'Great Vibes', value: 'Great Vibes, cursive' },
    { label: 'Satisfy', value: 'Satisfy, cursive' },
    { label: 'Courgette', value: 'Courgette, cursive' },

    // Decorative
    { label: 'Lobster', value: 'Lobster, display' },
    { label: 'Impact', value: 'Impact, sans-serif' },
    { label: 'Courier', value: 'Courier New, monospace' },
];
