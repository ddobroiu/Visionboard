
export interface TemplateElement {
    type: 'image' | 'text';
    content: string;
    x: number;
    y: number;
    scale?: number;
    color?: string;
    fontFamily?: string;
    fontWeight?: string;
    maskShape?: 'rect' | 'circle' | 'heart' | 'star' | 'hexagon';
}

export interface VisionTemplate {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    background: string;
    elements: TemplateElement[];
    orientation: 'landscape' | 'portrait';
}

export const VISION_TEMPLATES: VisionTemplate[] = [
    {
        id: 'success-mindset',
        name: 'Success Mindset',
        description: 'Focus on wealth and achievement',
        thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&q=80',
        background: '#0f172a',
        orientation: 'landscape',
        elements: [
            {
                type: 'text',
                content: 'DREAM BIG',
                x: 300,
                y: 50,
                scale: 2,
                color: '#ffffff',
                fontFamily: 'Bebas Neue, sans-serif'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80',
                x: 100,
                y: 150,
                scale: 0.8,
                maskShape: 'circle'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
                x: 400,
                y: 150,
                scale: 0.8,
                maskShape: 'rect'
            },
            {
                type: 'text',
                content: 'ACTION IS KEY',
                x: 300,
                y: 350,
                scale: 1.2,
                color: '#3b82f6',
                fontFamily: 'Montserrat, sans-serif'
            }
        ]
    },
    {
        id: 'travel-goals',
        name: 'World Explorer',
        description: 'Plan your next big adventure',
        thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80',
        background: '#f8fafc',
        orientation: 'landscape',
        elements: [
            {
                type: 'text',
                content: 'EXPLORE',
                x: 300,
                y: 60,
                scale: 2.5,
                color: '#0f172a',
                fontFamily: 'Righteous, cursive'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80',
                x: 50,
                y: 150,
                scale: 0.6,
                maskShape: 'hexagon'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
                x: 250,
                y: 150,
                scale: 0.6,
                maskShape: 'hexagon'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80',
                x: 450,
                y: 150,
                scale: 0.6,
                maskShape: 'hexagon'
            }
        ]
    },
    {
        id: 'luxury-cars',
        name: 'Drive Your Dreams',
        description: 'Fast cars and luxury lifestyle',
        thumbnail: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=200&q=80',
        background: '#000000',
        orientation: 'portrait',
        elements: [
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1583121274602-3e2820c698d9?w=400&q=80',
                x: 200,
                y: 100,
                scale: 0.7,
                maskShape: 'star'
            },
            {
                type: 'text',
                content: 'BORN TO WIN',
                x: 200,
                y: 350,
                scale: 1.8,
                color: '#f59e0b',
                fontFamily: 'Bebas Neue, sans-serif'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=400&q=80',
                x: 200,
                y: 500,
                scale: 0.7,
                maskShape: 'rect'
            }
        ]
    },
    {
        id: 'health-fitness',
        name: 'Healthy Lifestyle',
        description: 'Transformation and energy',
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80',
        background: '#ffffff',
        orientation: 'landscape',
        elements: [
            {
                type: 'text',
                content: 'POWER & ENERGY',
                x: 300,
                y: 50,
                scale: 1.5,
                color: '#10b981',
                fontFamily: 'Montserrat, sans-serif'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
                x: 150,
                y: 150,
                scale: 0.6,
                maskShape: 'circle'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
                x: 350,
                y: 200,
                scale: 0.6,
                maskShape: 'heart'
            },
            {
                type: 'text',
                content: 'NO EXCUSES',
                x: 300,
                y: 350,
                scale: 1.2,
                color: '#000000',
                fontFamily: 'Bebas Neue, sans-serif'
            }
        ]
    },
    {
        id: 'business-growth',
        name: 'CEO Mindset',
        description: 'Leadership and global impact',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=80',
        background: '#0f172a',
        orientation: 'landscape',
        elements: [
            {
                type: 'text',
                content: 'STRATEGIZE',
                x: 150,
                y: 80,
                scale: 1.2,
                color: '#ffffff',
                fontFamily: 'var(--font-outfit), sans-serif'
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
                x: 300,
                y: 200,
                scale: 0.9,
                maskShape: 'hexagon'
            },
            {
                type: 'text',
                content: 'DOMINATE THE MARKET',
                x: 300,
                y: 340,
                scale: 1.4,
                color: '#f59e0b',
                fontFamily: 'Montserrat, sans-serif'
            }
        ]
    }
];
