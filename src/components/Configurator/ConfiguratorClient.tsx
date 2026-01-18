'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Upload, Type, Image as ImageIcon, ShoppingCart, Settings, X,
    GripHorizontal, LayoutGrid, Sparkles, Copy, ArrowUp, ArrowDown,
    Box, Eye, Minus, Plus, Square, Circle, Heart, Hexagon, Star, LayoutTemplate, RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { useCart } from '@/components/CartContext';
import { LIBRARY_ASSETS, LibraryCategory } from '@/lib/libraryAssets';
import { VISION_TEMPLATES, VisionTemplate } from '@/lib/templates';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}

interface ConfigElement {
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
    maskShape?: 'rect' | 'circle' | 'heart' | 'star' | 'hexagon';
}

const FONTS = [
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

export default function ConfiguratorClient() {
    const [material, setMaterial] = useState('canvas');
    const [size, setSize] = useState('40x60');
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
    const [viewMode, setViewMode] = useState<'workspace' | '3d'>('workspace');
    const [zoom, setZoom] = useState(1);
    const [elements, setElements] = useState<ConfigElement[]>([]);
    const [background, setBackground] = useState<string>('#ffffff');
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [activeLibraryCategory, setActiveLibraryCategory] = useState<LibraryCategory>('masini');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Pixabay Search State
    const [pixabayQuery, setPixabayQuery] = useState('');
    const [pixabayResults, setPixabayResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pixabayTransparent, setPixabayTransparent] = useState(false);
    const [pixabayOrientation, setPixabayOrientation] = useState<string>('all');
    const [pixabayPage, setPixabayPage] = useState(1);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [pixabayError, setPixabayError] = useState<string | null>(null);

    // Vector Search State
    const [vectorQuery, setVectorQuery] = useState('');
    const [vectorResults, setVectorResults] = useState<any[]>([]);
    const [isSearchingVectors, setIsSearchingVectors] = useState(false);
    const [vectorPage, setVectorPage] = useState(1);
    const [vectorError, setVectorError] = useState<string | null>(null);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, elementId: string | null }>({
        x: 0, y: 0, visible: false, elementId: null
    });

    const { addItem } = useCart();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const bgFileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const modelViewerRef = useRef<any>(null);
    const workspaceContainerRef = useRef<HTMLDivElement>(null);

    // Calcul preț simplist pt demo
    const calculatePrice = () => {
        let base = 100;
        if (material === 'forex') base += 20;
        if (material === 'acrylic') base += 50;

        if (size === '30x40') base += 30;
        if (size === '40x60') base += 60;
        if (size === '50x70') base += 90;
        if (size === '70x100') base += 150;

        return base;
    };

    const price = calculatePrice();

    const handleAddToCart = () => {
        addItem({
            id: `custom-${Date.now()}`,
            title: `Visionboard Personalizat (${material}, ${size})`,
            price: price,
            quantity: 1,
            currency: 'RON',
            metadata: {
                material,
                size,
                elementsCount: elements.length
            }
        });
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                setUploadedImages(prev => [url, ...prev]);
                setActiveLibraryCategory('incarcate' as any);
                setPixabayResults([]); // Close search results to show uploads
                setActiveTool('library'); // Open library to show the upload
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBgUploadClick = () => {
        bgFileInputRef.current?.click();
    };

    const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                setBackground(url);
            };
            reader.readAsDataURL(file);
        }
    };

    const addElement = (type: 'image' | 'text', content: string) => {
        const newElement: ConfigElement = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content,
            x: 0,
            y: 0,
            fontSize: type === 'text' ? 24 : undefined,
            color: type === 'text' ? '#000000' : undefined,
            fontFamily: type === 'text' ? 'var(--font-outfit), sans-serif' : undefined,
            fontWeight: type === 'text' ? 'bold' : undefined,
            scale: 1,
        };
        setElements([...elements, newElement]);
        setSelectedId(newElement.id); // Auto-select new items
        if (type === 'text') setActiveTool('edit-text');
        if (type === 'image') setActiveTool('edit-image');
    };

    const deleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedId === id) {
            setSelectedId(null);
            setActiveTool(null);
        }
    };

    const loadTemplate = (template: VisionTemplate) => {
        setBackground(template.background);
        setOrientation(template.orientation);
        const newElements: ConfigElement[] = template.elements.map(el => ({
            ...el,
            id: Math.random().toString(36).substr(2, 9)
        }));
        setElements(newElements);
        setSelectedId(null);
        setActiveTool(null);
    };

    const handleDragEnd = (id: string, info: any) => {
        // Find the element and update its tracked x/y
        // info.point is absolute, info.offset is relative to start
        // For simplicity with framer motion 'drag', we just let motion handle visual, 
        // but we can track coordinates if we want to save them.
        setElements(prev => prev.map(el => {
            if (el.id === id) {
                return { ...el, x: el.x + info.offset.x / zoom, y: el.y + info.offset.y / zoom };
            }
            return el;
        }));
    };

    // removeElement was here, now replaced by deleteElement

    const handleTextChange = (id: string, newText: string) => {
        setElements(elements.map(el => el.id === id ? { ...el, content: newText } : el));
    };

    useEffect(() => {
        const container = workspaceContainerRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(prev => Math.min(Math.max(0.5, prev + delta), 3));
        };

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => container.removeEventListener('wheel', onWheel);
    }, [zoom]);

    const updateElementStyle = (id: string, property: keyof ConfigElement, value: any) => {
        setElements(elements.map(el => el.id === id ? { ...el, [property]: value } : el));
    };

    // --- 3D TEXTURE GENERATION ---
    const update3DTexture = async () => {
        const viewer = modelViewerRef.current;
        if (!viewer) return;

        try {
            if (!viewer.model) {
                await new Promise(resolve => viewer.addEventListener('load', resolve, { once: true }));
            }

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const res = 1024;
            canvas.width = res;
            canvas.height = res;

            // Background
            ctx.fillStyle = background.startsWith('#') ? background : '#ffffff';
            ctx.fillRect(0, 0, res, res);

            if (!background.startsWith('#')) {
                const bgImg = new Image();
                bgImg.src = background;
                bgImg.crossOrigin = "anonymous";
                await new Promise((r) => { bgImg.onload = r; bgImg.onerror = r; });
                const bgRatio = bgImg.width / bgImg.height;
                let dw, dh, dx, dy;
                if (bgRatio > 1) { dh = res; dw = res * bgRatio; dx = (res - dw) / 2; dy = 0; }
                else { dw = res; dh = res / bgRatio; dx = 0; dy = (res - dh) / 2; }
                ctx.drawImage(bgImg, dx, dy, dw, dh);
            }

            const workspaceW = orientation === 'landscape' ? 600 : 400;
            const scale = res / workspaceW;

            for (const el of elements) {
                ctx.save();
                ctx.translate((el.x + 20) * scale, (el.y + 20) * scale);
                ctx.scale(el.scale || 1, el.scale || 1);

                if (el.type === 'text') {
                    ctx.fillStyle = el.color || '#000000';
                    const fSize = (el.fontSize || 24) * scale;
                    ctx.font = `bold ${fSize}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(el.content, 0, 0);
                } else if (el.type === 'image') {
                    const img = new Image();
                    img.src = el.content;
                    img.crossOrigin = "anonymous";
                    await new Promise((r) => { img.onload = r; img.onerror = r; });
                    const size = 200 * scale; // Standardize size for shapes
                    const imgRatio = img.width / img.height;

                    // Center point for drawing (relative to translated context)
                    const cx = 0;
                    const cy = 0;
                    const r = size / 2;

                    if (el.maskShape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(cx, cy, r, 0, Math.PI * 2);
                        ctx.clip();
                    } else if (el.maskShape === 'heart') {
                        ctx.beginPath();
                        const topY = cy - r * 0.3;
                        ctx.moveTo(cx, cy + r * 0.7);
                        ctx.bezierCurveTo(cx - r, cy - r * 0.5, cx - r * 0.5, cy - r * 1.2, cx, cy - r * 0.5);
                        ctx.bezierCurveTo(cx + r * 0.5, cy - r * 1.2, cx + r, cy - r * 0.5, cx, cy + r * 0.7);
                        ctx.clip();
                    } else if (el.maskShape === 'hexagon') {
                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const angle = (Math.PI / 3) * i;
                            const x = cx + r * Math.cos(angle);
                            const y = cy + r * Math.sin(angle);
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.clip();
                    } else if (el.maskShape === 'star') {
                        ctx.beginPath();
                        for (let i = 0; i < 10; i++) {
                            const angle = (Math.PI / 5) * i;
                            const rad = i % 2 === 0 ? r : r * 0.5;
                            const x = cx + rad * Math.cos(angle - Math.PI / 2);
                            const y = cy + rad * Math.sin(angle - Math.PI / 2);
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.clip();
                    }

                    // Draw image with "cover" logic on the standard canvas size
                    let dw, dh, dx, dy;
                    if (imgRatio > 1) {
                        dh = size;
                        dw = size * imgRatio;
                        dx = -dw / 2;
                        dy = -size / 2;
                    } else {
                        dw = size;
                        dh = size / imgRatio;
                        dx = -size / 2;
                        dy = -dh / 2;
                    }

                    if (el.color) {
                        const tCanvas = document.createElement('canvas');
                        tCanvas.width = img.width; tCanvas.height = img.height;
                        const tCtx = tCanvas.getContext('2d')!;
                        tCtx.fillStyle = el.color; tCtx.fillRect(0, 0, img.width, img.height);
                        tCtx.globalCompositeOperation = 'destination-in'; tCtx.drawImage(img, 0, 0);
                        ctx.drawImage(tCanvas, dx, dy, dw, dh);
                    } else {
                        ctx.drawImage(img, dx, dy, dw, dh);
                    }
                }
                ctx.restore();
            }

            const mCanvas = document.createElement('canvas');
            mCanvas.width = res; mCanvas.height = res;
            const mCtx = mCanvas.getContext('2d')!;
            mCtx.translate(res, 0); mCtx.scale(-1, 1);
            mCtx.drawImage(canvas, 0, 0);

            const blob = await new Promise<Blob | null>(r => mCanvas.toBlob(r, 'image/jpeg', 0.9));
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            if (viewer.model) {
                const tex = await viewer.createTexture(url);
                const mat = viewer.model.materials[0];
                if (mat?.pbrMetallicRoughness) mat.pbrMetallicRoughness.baseColorTexture.setTexture(tex);
                URL.revokeObjectURL(url);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (viewMode === '3d') {
            const timer = setTimeout(update3DTexture, 500);
            return () => clearTimeout(timer);
        }
    }, [elements, background, size, orientation, viewMode]);

    const duplicateElement = (id: string) => {
        const el = elements.find(e => e.id === id);
        if (el) {
            const newElement: ConfigElement = {
                ...el,
                id: Math.random().toString(36).substr(2, 9),
                x: el.x + 20, // Slight offset
                y: el.y + 20,
            };
            setElements([...elements, newElement]);
            setSelectedId(newElement.id);
        }
        setContextMenu({ ...contextMenu, visible: false });
    };

    const bringToFront = (id: string) => {
        const el = elements.find(e => e.id === id);
        if (el) {
            setElements([...elements.filter(e => e.id !== id), el]);
        }
        setContextMenu({ ...contextMenu, visible: false });
    };

    const sendToBack = (id: string) => {
        const el = elements.find(e => e.id === id);
        if (el) {
            setElements([el, ...elements.filter(e => e.id !== id)]);
        }
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleContextMenu = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            elementId: id
        });
        setSelectedId(id);
    };

    // Global click listener to close context menu
    useEffect(() => {
        const handleClick = () => {
            if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [contextMenu.visible]);

    // Auto-search when transparency or orientation filter changes
    useEffect(() => {
        if (pixabayQuery) {
            setPixabayPage(1);
            performPixabaySearch(pixabayQuery, false, 1);
        }
    }, [pixabayTransparent, pixabayOrientation]);

    // Initial search for vectors when Elements tool is opened
    useEffect(() => {
        if (activeTool === 'elements' && vectorResults.length === 0 && !vectorQuery) {
            const defaultQuery = 'abstract design';
            setVectorQuery(defaultQuery);
            performPixabaySearch(defaultQuery, false, 1, 'vector');
        }
    }, [activeTool]);

    const performPixabaySearch = async (query: string, isLoadMore = false, pageNum = 1, type = 'photo') => {
        if (!query) return;

        const setter = type === 'vector' ? setVectorResults : setPixabayResults;
        const loadingSetter = type === 'vector' ? setIsSearchingVectors : setIsSearching;
        const errorSetter = type === 'vector' ? setVectorError : setPixabayError;

        loadingSetter(true);
        errorSetter(null);
        if (!isLoadMore) setter([]); // Show loading state by clearing results

        try {
            const res = await fetch(`/api/pixabay?q=${encodeURIComponent(query)}&transparent=${type === 'vector' ? 'true' : pixabayTransparent}&orientation=${pixabayOrientation}&page=${pageNum}&type=${type}`);
            const data = await res.json();

            if (data.error) {
                errorSetter(data.error);
                return;
            }

            if (data.hits) {
                if (data.hits.length === 0 && isLoadMore) {
                    errorSetter("Nu mai sunt rezultate de afișat.");
                } else {
                    if (isLoadMore) {
                        setter(prev => [...prev, ...data.hits]);
                    } else {
                        setter(data.hits);
                        if (data.hits.length === 0) {
                            errorSetter(`Nu am găsit rezultate pentru "${query}"`);
                        }
                    }
                }
                if (type === 'photo') setActiveLibraryCategory('search' as any);
            }
        } catch (error) {
            console.error('Search error:', error);
            errorSetter("Eroare la comunicarea cu serverul.");
        } finally {
            loadingSetter(false);
        }
    };

    const handleVectorSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setVectorPage(1);
        performPixabaySearch(vectorQuery, false, 1, 'vector');
    };

    const handleLoadMoreVectors = () => {
        const nextPage = vectorPage + 1;
        setVectorPage(nextPage);
        performPixabaySearch(vectorQuery, true, nextPage, 'vector');
    };

    const handleLoadMore = () => {
        const nextPage = pixabayPage + 1;
        setPixabayPage(nextPage);
        performPixabaySearch(pixabayQuery, true, nextPage);
    };

    const handlePixabaySearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setPixabayPage(1);
        performPixabaySearch(pixabayQuery, false, 1);
    };

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            <Script src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" type="module" strategy="afterInteractive" />

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />
            <input
                type="file"
                ref={bgFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleBgFileChange}
            />

            {/* Sidebar Tools */}
            <aside style={{ width: '80px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0', background: 'var(--surface)', zIndex: 10 }}>
                <button className={`tool-btn ${activeTool === 'upload' ? 'active' : ''}`} title="Upload Image" onClick={handleUploadClick}>
                    <Upload size={24} />
                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Upload</span>
                </button>
                <button className={`tool-btn ${activeTool === 'text' ? 'active' : ''}`} title="Add Text" onClick={() => addElement('text', 'Dublu click pentru editare')}>
                    <Type size={24} />
                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Text</span>
                </button>
                <button className={`tool-btn ${activeTool === 'bg' ? 'active' : ''}`} title="Background" onClick={() => setActiveTool(activeTool === 'bg' ? null : 'bg')}>
                    <ImageIcon size={24} />
                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Fundal</span>
                </button>
                <button className={`tool-btn ${activeTool === 'templates' ? 'active' : ''}`} title="Design" onClick={() => setActiveTool(activeTool === 'templates' ? null : 'templates')}>
                    <LayoutTemplate size={24} />
                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Design</span>
                </button>
                <button className={`tool-btn ${activeTool === 'library' ? 'active' : ''}`} title="Library" onClick={() => setActiveTool(activeTool === 'library' ? null : 'library')}>
                    <LayoutGrid size={24} />
                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Bibliotecă</span>
                </button>
                <button className={`tool-btn ${activeTool === 'elements' ? 'active' : ''}`} title="Elements" onClick={() => setActiveTool(activeTool === 'elements' ? null : 'elements')}>
                    <Sparkles size={24} />
                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Elemente</span>
                </button>
            </aside>

            {/* Tool Panel (for Background, Library, Elements, Templates) */}
            {(activeTool === 'bg' || activeTool === 'library' || activeTool === 'elements' || activeTool === 'templates') && (
                <div style={{ width: '300px', borderRight: '1px solid var(--border)', background: 'var(--surface)', padding: '1rem', zIndex: 9, display: 'flex', flexDirection: 'column' }}>

                    {activeTool === 'templates' && (
                        <>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Modele Ready-to-Use</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem', overflowY: 'auto', flex: 1 }} className="hide-scrollbar">
                                {VISION_TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => loadTemplate(t)}
                                        style={{
                                            border: '1px solid var(--border)', background: 'white', padding: '0.5rem', cursor: 'pointer', borderRadius: '12px',
                                            overflow: 'hidden', textAlign: 'left', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '8px'
                                        }}
                                        className="hover:border-primary hover:shadow-md"
                                    >
                                        <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={t.thumbnail} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--foreground)' }}>{t.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTool === 'elements' && (
                        <>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Elemente & Forme</h3>

                            {/* Vector Search Bar */}
                            <form onSubmit={handleVectorSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <input
                                    type="text"
                                    value={vectorQuery}
                                    onChange={(e) => setVectorQuery(e.target.value)}
                                    placeholder="Caută elemente (ex: flori, linii)..."
                                    style={{
                                        flex: 1,
                                        padding: '0.6rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        fontSize: '0.875rem'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={isSearchingVectors}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        borderRadius: '8px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {isSearchingVectors ? '...' : 'Caută'}
                                </button>
                            </form>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
                                {['forme', 'linii', 'flori', 'abstract', 'nature'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            const query = cat.charAt(0).toUpperCase() + cat.slice(1);
                                            setVectorQuery(query);
                                            setVectorPage(1);
                                            performPixabaySearch(query, false, 1, 'vector');
                                        }}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '99px',
                                            border: '1px solid var(--border)',
                                            background: vectorQuery.toLowerCase() === cat.toLowerCase() ? 'var(--primary)' : 'white',
                                            color: vectorQuery.toLowerCase() === cat.toLowerCase() ? 'white' : 'var(--foreground)',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', overflowY: 'auto', flex: 1, paddingBottom: '1rem' }} className="hide-scrollbar">
                                {/* Search Results (Vectors from Pixabay) */}
                                {vectorResults.map(hit => (
                                    <button
                                        key={hit.id}
                                        onClick={() => addElement('image', hit.url)}
                                        style={{
                                            border: '1px solid var(--border)',
                                            borderRadius: '0.5rem',
                                            overflow: 'hidden',
                                            background: 'white',
                                            cursor: 'pointer',
                                            height: '80px',
                                            position: 'relative'
                                        }}
                                        className="hover:shadow-md transition-shadow"
                                    >
                                        <img src={hit.preview} alt={hit.tags} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }} />
                                    </button>
                                ))}

                                {vectorResults.length > 0 && (
                                    <button
                                        onClick={handleLoadMoreVectors}
                                        disabled={isSearchingVectors}
                                        style={{
                                            gridColumn: 'span 3',
                                            padding: '0.75rem',
                                            marginTop: '0.5rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            background: 'white',
                                            color: 'var(--primary)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            marginBottom: '1rem'
                                        }}
                                    >
                                        {isSearchingVectors ? 'Se încarcă...' : 'Încarcă mai multe elemente'}
                                    </button>
                                )}

                                {vectorError && (
                                    <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '1rem', color: 'var(--secondary-foreground)', opacity: 0.6, fontSize: '0.8rem' }}>
                                        {vectorError}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {activeTool === 'bg' && (
                        <>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Imagine & Culoare Fundal</h3>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Imagine de Fundal</label>
                                <button
                                    onClick={handleBgUploadClick}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '2px dashed var(--border)',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--primary)',
                                        fontWeight: 600
                                    }}
                                    className="hover:border-primary transition-colors"
                                >
                                    <Upload size={18} /> Încarcă Poză de Fundal
                                </button>
                                {!background.startsWith('#') && (
                                    <button
                                        onClick={() => setBackground('#ffffff')}
                                        style={{
                                            width: '100%',
                                            marginTop: '0.75rem',
                                            padding: '0.6rem',
                                            fontSize: '0.8rem',
                                            color: 'white',
                                            background: '#ef4444',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                        className="hover:bg-red-600 transition-colors"
                                    >
                                        <X size={14} /> Elimină Imaginea de Fundal
                                    </button>
                                )}
                            </div>

                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Sau alege o culoare</label>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <input
                                    type="color"
                                    value={background.startsWith('#') ? background : '#ffffff'}
                                    onChange={(e) => setBackground(e.target.value)}
                                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px', overflow: 'hidden' }}
                                />
                                <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '4px', padding: '0.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', background: 'white' }}>
                                    {background.startsWith('#') ? background.toUpperCase() : 'IMAGINE'}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#fee2e2', '#fecaca', '#fef3c7', '#dcfce7', '#dbeafe', '#e0e7ff', '#fae8ff', '#f3e8ff', '#000000', '#1e293b'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setBackground(color)}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: color, border: '1px solid var(--border)',
                                            cursor: 'pointer',
                                            boxShadow: background === color ? '0 0 0 2px var(--primary)' : 'none'
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {activeTool === 'library' && (
                        <>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Stickere & Imagini</h3>

                            {/* Pixabay Search Bar */}
                            <form onSubmit={handlePixabaySearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <input
                                    type="text"
                                    value={pixabayQuery}
                                    onChange={(e) => setPixabayQuery(e.target.value)}
                                    placeholder="Caută în Pixabay..."
                                    style={{
                                        flex: 1,
                                        padding: '0.6rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        fontSize: '0.875rem'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        borderRadius: '8px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {isSearching ? '...' : 'Caută'}
                                </button>
                            </form>

                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: pixabayTransparent ? 'var(--accent)' : 'white',
                                    color: pixabayTransparent ? 'var(--primary)' : 'var(--foreground)',
                                    fontWeight: pixabayTransparent ? 700 : 400,
                                    transition: 'all 0.2s'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={pixabayTransparent}
                                        onChange={(e) => setPixabayTransparent(e.target.checked)}
                                        style={{ accentColor: 'var(--primary)' }}
                                    />
                                    <span>Fără fundal (PNG)</span>
                                </label>

                                <select
                                    value={pixabayOrientation}
                                    onChange={(e) => setPixabayOrientation(e.target.value)}
                                    style={{
                                        padding: '0.4rem 0.6rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        fontSize: '0.8rem',
                                        background: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="all">Toate</option>
                                    <option value="horizontal">Landscape</option>
                                    <option value="vertical">Portrait</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
                                <button
                                    onClick={() => setActiveLibraryCategory('incarcate' as any)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '99px',
                                        border: '1px solid var(--border)',
                                        background: activeLibraryCategory === ('incarcate' as any) ? 'var(--primary)' : 'white',
                                        color: activeLibraryCategory === ('incarcate' as any) ? 'white' : 'var(--foreground)',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        fontWeight: activeLibraryCategory === ('incarcate' as any) ? 700 : 400
                                    }}
                                >
                                    Încărcate ({uploadedImages.length})
                                </button>
                                {['masini', 'familie', 'bani', 'travel', 'citate'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            const query = cat.charAt(0).toUpperCase() + cat.slice(1);
                                            setPixabayQuery(query);
                                            setPixabayPage(1);
                                            performPixabaySearch(query, false, 1);
                                        }}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '99px',
                                            border: '1px solid var(--border)',
                                            background: pixabayQuery.toLowerCase() === cat.toLowerCase() ? 'var(--primary)' : 'white',
                                            color: pixabayQuery.toLowerCase() === cat.toLowerCase() ? 'white' : 'var(--foreground)',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </button>
                                ))}
                                {pixabayResults.length > 0 && (
                                    <button
                                        onClick={() => setActiveLibraryCategory('search' as any)}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '99px',
                                            border: '1px solid var(--border)',
                                            background: activeLibraryCategory === ('search' as any) ? 'var(--primary)' : 'white',
                                            color: activeLibraryCategory === ('search' as any) ? 'white' : 'var(--foreground)',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Rezultate Căutare
                                    </button>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
                                {(activeLibraryCategory as any) === 'incarcate' ? (
                                    uploadedImages.length > 0 ? (
                                        uploadedImages.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => addElement('image', url)}
                                                style={{
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '0.5rem',
                                                    overflow: 'hidden',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    height: '100px',
                                                    position: 'relative'
                                                }}
                                                className="hover:shadow-md transition-shadow"
                                            >
                                                <img src={url} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </button>
                                        ))
                                    ) : (
                                        <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', color: 'var(--secondary-foreground)', opacity: 0.6 }}>
                                            Nu ai încărcat nicio poză încă.
                                        </div>
                                    )
                                ) : pixabayResults.length > 0 ? (
                                    <>
                                        {pixabayResults.map(hit => (
                                            <button
                                                key={hit.id}
                                                onClick={() => addElement('image', hit.url)}
                                                style={{
                                                    border: '1px solid var(--border)',
                                                    borderRadius: '0.5rem',
                                                    overflow: 'hidden',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    height: '100px',
                                                    position: 'relative'
                                                }}
                                                className="hover:shadow-md transition-shadow"
                                            >
                                                <img src={hit.preview} alt={hit.tags} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isSearching}
                                            style={{
                                                gridColumn: 'span 2',
                                                padding: '0.75rem',
                                                marginTop: '0.5rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                background: 'white',
                                                color: 'var(--primary)',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                marginBottom: '1rem'
                                            }}
                                        >
                                            {isSearching ? 'Se încarcă...' : 'Încarcă mai multe rezultate'}
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', color: 'var(--secondary-foreground)', opacity: 0.6 }}>
                                        {pixabayError || (pixabayQuery ? `Nu am găsit rezultate pentru "${pixabayQuery}"` : "Căutați sau selectați o categorie.")}
                                    </div>
                                )}

                                {pixabayError && pixabayResults.length > 0 && (
                                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '1rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                                        {pixabayError}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Text Edit Panel (Activates when text selected or tool active) */}
            {activeTool === 'edit-text' && selectedId && elements.find(e => e.id === selectedId)?.type === 'text' && (
                <div style={{ width: '250px', borderRight: '1px solid var(--border)', background: 'var(--surface)', padding: '1rem', zIndex: 9 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Editare Text</h3>

                    {(() => {
                        const el = elements.find(e => e.id === selectedId)!;
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Culoare */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Culoare</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="color"
                                            value={el.color || '#000000'}
                                            onChange={(e) => updateElementStyle(el.id, 'color', e.target.value)}
                                            style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                                        />
                                        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '4px', padding: '0.5rem', fontSize: '0.9rem' }}>
                                            {el.color}
                                        </div>
                                    </div>
                                </div>

                                {/* Text Scale / Zoom */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Mărește / Micșorează Text: {Math.round((el.scale || 1) * 100)}%</label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="4"
                                        step="0.1"
                                        value={el.scale || 1}
                                        onChange={(e) => updateElementStyle(el.id, 'scale', parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                                    />
                                </div>

                                {/* Font Size */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Mărime Font Excată: {el.fontSize}px</label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="120"
                                        value={el.fontSize || 24}
                                        onChange={(e) => updateElementStyle(el.id, 'fontSize', parseInt(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                {/* Font Family */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Font</label>
                                    <select
                                        value={el.fontFamily}
                                        onChange={(e) => updateElementStyle(el.id, 'fontFamily', e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                                    >
                                        {FONTS.map(f => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Buttons */}
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setSelectedId(null)}
                                    style={{ marginTop: '1rem', fontSize: '0.8rem' }}
                                >
                                    Închide Editarea
                                </button>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Image Edit Panel */}
            {activeTool === 'edit-image' && selectedId && elements.find(e => e.id === selectedId)?.type === 'image' && (
                <div style={{ width: '250px', borderRight: '1px solid var(--border)', background: 'var(--surface)', padding: '1rem', zIndex: 9 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Editare Imagine</h3>

                    {(() => {
                        const el = elements.find(e => e.id === selectedId)!;
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Mărime (Scale) */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Mărime (Scale): {Math.round((el.scale || 1) * 100)}%</label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.05"
                                        value={el.scale || 1}
                                        onChange={(e) => updateElementStyle(el.id, 'scale', parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                                    />
                                </div>

                                {/* Color Picker for Images (Tints/Masks) */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Culoare Element (pentru SVG/Vectori)</label>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <input
                                            type="color"
                                            value={el.color || '#000000'}
                                            onChange={(e) => updateElementStyle(el.id, 'color', e.target.value)}
                                            style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px', overflow: 'hidden' }}
                                        />
                                        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '4px', padding: '0.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', background: 'white' }}>
                                            {el.color && el.color.startsWith('#') ? el.color.toUpperCase() : (el.color ? 'PERSONALIZAT' : 'ORIGINAL')}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        {/* Reset/Original Button */}
                                        <button
                                            onClick={() => updateElementStyle(el.id, 'color', undefined)}
                                            style={{
                                                width: '32px', height: '32px', borderRadius: '4px',
                                                border: '1px solid var(--border)', background: 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', fontSize: '0.6rem', fontWeight: 'bold',
                                                boxShadow: !el.color ? '0 0 0 2px var(--primary)' : 'none'
                                            }}
                                            title="Original"
                                        >
                                            ORIG
                                        </button>
                                        {['#000000', '#7c3aed', '#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#ffffff', '#ec4899', '#8b5cf6'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => updateElementStyle(el.id, 'color', c)}
                                                style={{
                                                    width: '32px', height: '32px', borderRadius: '4px',
                                                    background: c, border: '1px solid var(--border)',
                                                    cursor: 'pointer',
                                                    boxShadow: el.color === c ? '0 0 0 2px var(--primary)' : 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                        * Sfat: Aplică o culoare pentru a crea o siluetă sau "ORIG" pentru culorile native.
                                    </div>
                                </div>

                                {/* Formă Imagine (Enhanced) */}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Formă Imagine</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {[
                                            { id: 'rect', label: 'Pătrat', icon: <Square size={14} /> },
                                            { id: 'circle', label: 'Cerc', icon: <Circle size={14} /> },
                                            { id: 'heart', label: 'Inimă', icon: <Heart size={14} /> },
                                            { id: 'hexagon', label: 'Hexagon', icon: <Hexagon size={14} /> },
                                            { id: 'star', label: 'Stea', icon: <Star size={14} /> }
                                        ].map(shape => (
                                            <button
                                                key={shape.id}
                                                onClick={() => updateElementStyle(el.id, 'maskShape', shape.id as any)}
                                                style={{
                                                    padding: '0.5rem', borderRadius: '8px',
                                                    border: (el.maskShape || 'rect') === shape.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                    background: (el.maskShape || 'rect') === shape.id ? 'var(--accent)' : 'white',
                                                    cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                                                }}
                                            >
                                                {shape.icon}
                                                {shape.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                                    Sfat: Poți trage elementul oriunde în spațiul de lucru.
                                </div>

                                <button
                                    className="btn btn-outline"
                                    onClick={() => setSelectedId(null)}
                                    style={{ marginTop: '1rem', fontSize: '0.8rem' }}
                                >
                                    Închide Editarea
                                </button>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Image Edit Panel (shared for uploaded and vectors) */}

            {/* Main Canvas Area */}
            <main
                ref={workspaceContainerRef}
                onClick={() => { setSelectedId(null); setActiveTool(null); }}
                style={{
                    flex: 1,
                    background: '#f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'auto',
                    padding: '100px' // Overscroll area
                }}
            >
                {/* Zoom Controls */}
                <div style={{
                    position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                    background: 'white', padding: '0.5rem', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    zIndex: 200, border: '1px solid var(--border)'
                }}>
                    <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))} style={{ padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', background: '#f8fafc', border: '1px solid #e2e8f0' }}><Minus size={16} /></button>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, minWidth: '3.5rem', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(prev => Math.min(3, prev + 0.1))} style={{ padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', background: '#f8fafc', border: '1px solid #e2e8f0' }}><Plus size={16} /></button>
                    <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
                    <button onClick={() => setZoom(1)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'var(--accent)', border: 'none', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>RESET</button>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem' }}>Scroll</div>
                </div>

                <div
                    ref={canvasRef}
                    style={{
                        width: orientation === 'landscape' ? '600px' : '400px',
                        height: orientation === 'landscape' ? '400px' : '600px',
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center',
                        background: viewMode === 'workspace'
                            ? (background.startsWith('data:') || background.startsWith('http') ? `url(${background})` : background)
                            : 'white',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: viewMode === 'workspace' ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '8px'
                    }}
                >
                    {elements.length === 0 && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#cbd5e1', textAlign: 'center', pointerEvents: 'none' }}>
                            <Settings size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <div>Spațiu de Lucru</div>
                            <div style={{ fontSize: '0.875rem' }}>Folosește meniul din stânga</div>
                        </div>
                    )}

                    {viewMode === 'workspace' ? (
                        elements.map((el, index) => (
                            <motion.div
                                key={el.id}
                                drag
                                dragMomentum={false}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: el.scale || 1, opacity: 1 }}
                                onDragEnd={(e, info) => handleDragEnd(el.id, info)}
                                onContextMenu={(e) => handleContextMenu(e, el.id)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(el.id);
                                    if (el.type === 'text') setActiveTool('edit-text');
                                    if (el.type === 'image') setActiveTool('edit-image');
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    zIndex: selectedId === el.id ? 1000 : index,
                                    touchAction: 'none'
                                }}
                            >
                                <div
                                    className={`element-wrapper ${selectedId === el.id ? 'selected' : ''}`}
                                    style={{
                                        position: 'relative',
                                        border: selectedId === el.id ? '2px solid var(--primary)' : '2px solid transparent',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        transition: 'border-color 0.2s',
                                        cursor: 'move'
                                    }}
                                >
                                    {selectedId === el.id && (
                                        <>
                                            {/* Corner Resize Handles */}
                                            {['nw', 'ne', 'sw', 'se'].map((corner) => (
                                                <motion.div
                                                    key={corner}
                                                    drag
                                                    dragMomentum={false}
                                                    onDrag={(e, info) => {
                                                        const delta = (corner.includes('e') ? info.delta.x : -info.delta.x) / 100;
                                                        updateElementStyle(el.id, 'scale', Math.max(0.1, (el.scale || 1) + delta));
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: corner.includes('n') ? -8 : 'auto',
                                                        bottom: corner.includes('s') ? -8 : 'auto',
                                                        left: corner.includes('w') ? -8 : 'auto',
                                                        right: corner.includes('e') ? -8 : 'auto',
                                                        width: 16, height: 16, background: 'white',
                                                        border: '2px solid var(--primary)', borderRadius: '50%',
                                                        cursor: corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize',
                                                        zIndex: 110, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            ))}

                                            {/* Global Delete Button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                                                style={{
                                                    position: 'absolute', top: -20, right: -20, width: 24, height: 24,
                                                    borderRadius: '50%', background: '#ef4444', color: 'white',
                                                    border: '2px solid white', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', cursor: 'pointer', zIndex: 110,
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                                className="hover:bg-red-600 transition-colors"
                                                title="Șterge element"
                                            >
                                                <X size={14} strokeWidth={3} />
                                            </button>

                                            {/* Drag Label */}
                                            <div style={{
                                                position: 'absolute', top: '-32px', left: '50%', transform: 'translateX(-50%)',
                                                background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '4px',
                                                cursor: 'grabbing', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px',
                                                fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 11, whiteSpace: 'nowrap'
                                            }}>
                                                <GripHorizontal size={14} /> TRAGE SĂ MUȚI
                                            </div>
                                        </>
                                    )}
                                    {el.type === 'text' ? (
                                        <div
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleTextChange(el.id, e.currentTarget.textContent || '')}
                                            style={{
                                                fontSize: `${el.fontSize || 24}px`,
                                                color: el.color || '#000000',
                                                fontFamily: el.fontFamily || 'inherit',
                                                fontWeight: 'bold', padding: '0.5rem',
                                                border: selectedId === el.id ? '2px dashed var(--primary)' : '1px dashed transparent',
                                                minWidth: '50px', textAlign: 'center', whiteSpace: 'nowrap', lineHeight: 1.2,
                                                pointerEvents: selectedId === el.id ? 'auto' : 'none',
                                                cursor: selectedId === el.id ? 'text' : 'move'
                                            }}
                                            className="editable-text"
                                        >
                                            {el.content}
                                        </div>
                                    ) : (
                                        el.color ? (
                                            <div style={{
                                                width: '200px', height: '200px', backgroundColor: el.color,
                                                WebkitMaskImage: `url(${el.content})`, maskImage: `url(${el.content})`,
                                                WebkitMaskSize: 'contain', maskSize: 'contain',
                                                WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                                                WebkitMaskPosition: 'center', maskPosition: 'center',
                                                clipPath: (el.maskShape === 'circle') ? 'circle(50%)' :
                                                    (el.maskShape === 'heart') ? 'path("M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z")' :
                                                        (el.maskShape === 'hexagon') ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                                                            (el.maskShape === 'star') ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
                                            }} />
                                        ) : (
                                            <img
                                                src={el.content}
                                                alt="uploaded"
                                                draggable="false"
                                                style={{
                                                    width: (el.maskShape && el.maskShape !== 'rect') ? '200px' : 'auto',
                                                    height: (el.maskShape && el.maskShape !== 'rect') ? '200px' : 'auto',
                                                    maxWidth: '300px',
                                                    display: 'block',
                                                    pointerEvents: 'none',
                                                    userSelect: 'none',
                                                    objectFit: 'cover',
                                                    clipPath: (el.maskShape === 'circle') ? 'circle(50% at 50% 50%)' :
                                                        (el.maskShape === 'heart') ? 'path("M100 171.6L20.8 88.3C4.2 71.1 0 49.3 0 29.5 0 9.7 13.1 0 29.1 0 45.1 0 54.5 11.8 62.5 24.1 70.3 36.4 74.3 43.1 82.5 43.1S94.7 36.4 102.5 24.1C110.5 11.8 119.9 0 135.9 0 151.8 0 165 9.7 165 29.5 165 49.3 160.8 71.1 144.2 88.3L65 171.6")' :
                                                            (el.maskShape === 'hexagon') ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                                                                (el.maskShape === 'star') ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#f8fafc', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
                            <model-viewer
                                key={`3d-${orientation}-${size}`}
                                ref={modelViewerRef}
                                src={orientation === 'landscape' ? "/products/canvas/canvas_landscape.glb" : "/products/canvas/canvas_portret.glb"}
                                alt="3D Preview"
                                shadow-intensity="1"
                                camera-controls
                                auto-rotate
                                tone-mapping="neutral"
                                style={{ width: '100%', height: '100%', background: '#f8fafc' }}
                            />
                            {/* Manual Refresh Button if it doesn't load automatically */}
                            <button
                                onClick={update3DTexture}
                                style={{
                                    position: 'absolute', bottom: 20, right: 20,
                                    background: 'rgba(255,255,255,0.8)', border: '1px solid #cbd5e1',
                                    padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                                }}
                            >
                                <Sparkles size={14} /> Reîmprospătează 3D
                            </button>
                        </div>
                    )}
                </div>
            </main>


            {/* Product Options */}
            <aside style={{ width: '320px', borderLeft: '1px solid var(--border)', padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Configurare Produs</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Material</label>
                    <select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', background: 'white' }}
                    >
                        <option value="canvas">Tablou Canvas</option>
                        <option value="forex">Placă Forex (PVC)</option>
                        <option value="acrylic">Sticlă Acrilică</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Orientare</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setOrientation('landscape')}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)',
                                border: orientation === 'landscape' ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: orientation === 'landscape' ? 'var(--accent)' : 'white',
                                fontWeight: orientation === 'landscape' ? 700 : 400,
                                cursor: 'pointer'
                            }}
                        >
                            Landscape
                        </button>
                        <button
                            onClick={() => setOrientation('portrait')}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)',
                                border: orientation === 'portrait' ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: orientation === 'portrait' ? 'var(--accent)' : 'white',
                                fontWeight: orientation === 'portrait' ? 700 : 400,
                                cursor: 'pointer'
                            }}
                        >
                            Portrait
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dimensiune (cm)</label>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', background: 'white' }}
                    >
                        <option value="20x30">20x30 cm</option>
                        <option value="30x40">30x40 cm</option>
                        <option value="40x60">40x60 cm</option>
                        <option value="50x70">50x70 cm</option>
                        <option value="70x100">70x100 cm</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Previzualizare</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {/* 3D Preview Box */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setViewMode('3d'); }}
                            style={{
                                width: '100%',
                                height: '140px',
                                padding: 0,
                                background: '#f1f5f9',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: viewMode === '3d' ? '3px solid var(--primary)' : '2px solid #e2e8f0',
                                position: 'relative',
                                transition: 'all 0.2s',
                                boxShadow: viewMode === '3d' ? '0 0 0 2px rgba(var(--primary-rgb), 0.2)' : 'none'
                            }}
                        >
                            <model-viewer
                                key={`sidebar-3d-${orientation}`}
                                src={orientation === 'landscape' ? "/products/canvas/canvas_landscape.glb" : "/products/canvas/canvas_portret.glb"}
                                alt="3D Visionboard"
                                shadow-intensity="1"
                                auto-rotate
                                tone-mapping="neutral"
                                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                            />
                            <div style={{
                                position: 'absolute', bottom: 8, right: 8,
                                background: 'white', padding: '4px 8px', borderRadius: '4px',
                                fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                color: 'var(--foreground)'
                            }}>
                                <Box size={12} /> VIZUALIZARE 3D
                            </div>
                        </button>

                        {/* 2D Mini Preview */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setViewMode('workspace'); }}
                            style={{
                                width: '100%',
                                height: '80px',
                                padding: 0,
                                background: background.startsWith('#') ? background : '#ffffff',
                                backgroundImage: !background.startsWith('#') ? `url(${background})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: viewMode === 'workspace' ? '3px solid var(--primary)' : '2px solid #e2e8f0',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                boxShadow: viewMode === 'workspace' ? '0 0 0 2px rgba(var(--primary-rgb), 0.2)' : 'none'
                            }}
                        >
                            <div style={{ transform: 'scale(0.15)', pointerEvents: 'none', position: 'relative', width: orientation === 'landscape' ? '600px' : '400px', height: orientation === 'landscape' ? '400px' : '600px' }}>
                                {elements.map(el => (
                                    <div key={el.id} style={{
                                        position: 'absolute',
                                        left: (el.x + 20),
                                        top: (el.y + 20),
                                        width: '100px',
                                        height: '20px',
                                        background: el.color || '#cbd5e1',
                                        opacity: 0.6,
                                        borderRadius: '4px'
                                    }} />
                                ))}
                            </div>
                            <div style={{
                                position: 'absolute', bottom: 8, right: 8,
                                background: 'white', padding: '4px 8px', borderRadius: '4px',
                                fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                color: 'var(--foreground)'
                            }}>
                                <Eye size={12} /> EDITOR (2D)
                            </div>
                        </button>
                    </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        <span>Preț:</span>
                        <span>{price} Lei</span>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={handleAddToCart}>
                        <ShoppingCart size={20} style={{ marginRight: '0.5rem' }} />
                        Adaugă în Coș
                    </button>
                </div>
            </aside>

            {/* Context Menu */}
            {
                contextMenu.visible && (
                    <div style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        background: 'white',
                        border: '1px solid var(--border)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        zIndex: 1000,
                        minWidth: '160px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                    }}>
                        <button
                            onClick={() => duplicateElement(contextMenu.elementId!)}
                            style={{ padding: '0.5rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px' }}
                            className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <Copy size={14} />
                            Duplică Element
                        </button>
                        <button
                            onClick={() => bringToFront(contextMenu.elementId!)}
                            style={{ padding: '0.5rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px' }}
                            className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <ArrowUp size={14} />
                            Adu în față
                        </button>
                        <button
                            onClick={() => sendToBack(contextMenu.elementId!)}
                            style={{ padding: '0.5rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px' }}
                            className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <ArrowDown size={14} />
                            Trimite în spate
                        </button>
                        <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                        <button
                            onClick={() => deleteElement(contextMenu.elementId!)}
                            style={{ padding: '0.5rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px', color: '#ef4444' }}
                            className="hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                            <X size={14} />
                            Șterge Element
                        </button>
                    </div>
                )
            }

            <style jsx>{`
        .tool-btn {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--secondary-foreground);
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .tool-btn:hover, .tool-btn.active {
          background: var(--secondary);
          color: var(--primary);
        }
        .element-wrapper:hover .editable-text {
            border-color: var(--primary) !important;
        }
        .element-wrapper .delete-btn {
            opacity: 0;
            transition: opacity 0.2s;
        }
        .element-wrapper:hover .delete-btn {
            opacity: 1;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
        </div >
    );
}
