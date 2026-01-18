'use client';

import { useSession } from "next-auth/react";

import { useState, useRef, useEffect } from 'react';
import {
    Upload, Type, Image as ImageIcon, ShoppingCart, X,
    GripHorizontal, LayoutGrid, Sparkles,
    Box, Eye, Square, Circle, Heart, Hexagon, Star, LayoutTemplate, RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { useCart } from '@/components/CartContext';
import { LIBRARY_ASSETS, LibraryCategory } from '@/lib/libraryAssets';
import { VISION_TEMPLATES, VisionTemplate } from '@/lib/templates';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { LibraryPanel } from './LibraryPanel';
import { ProductSidebar } from './ProductSidebar';
import { CanvasElement } from './CanvasElement';
import { ZoomControls } from './ZoomControls';
import { ContextMenu } from './ContextMenu';
import { Workspace } from './Workspace';
import { MobileNav } from './MobileNav';
import { useLibrarySearch } from './useLibrarySearch';
import { use3DPreview } from './use3DPreview';
import { ConfigElement, FONTS } from './Configurator.types';




export default function ConfiguratorClient() {
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === 'admin';
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const [showMobileSettings, setShowMobileSettings] = useState(false);

    const {
        pixabayQuery, setPixabayQuery,
        pixabayResults, isSearching,
        pixabayTransparent, setPixabayTransparent,
        pixabayOrientation, setPixabayOrientation,
        pixabayPage, setPixabayPage,
        pixabayError,
        vectorQuery, setVectorQuery,
        vectorResults, isSearchingVectors,
        vectorPage, setVectorPage,
        vectorError,
        activeLibraryCategory, setActiveLibraryCategory,
        performPixabaySearch,
        handleVectorSearch,
        handleLoadMoreVectors,
        handleLoadMore,
        handlePixabaySearch
    } = useLibrarySearch(activeTool);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, elementId: string | null }>({
        x: 0, y: 0, visible: false, elementId: null
    });

    const { addItem } = useCart();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const bgFileInputRef = useRef<HTMLInputElement>(null);
    const modelViewerRef = useRef<any>(null);
    const workspaceContainerRef = useRef<HTMLDivElement>(null);// Calcul preț simplist pt demo
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

                setPixabayResults([]); // Close search results to show uploads
                setActiveTool('upload'); // Open library to show the upload
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
            rotation: 0, // Default rotation
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
                ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
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

    const sidebarStyle: React.CSSProperties = isMobile ? {
        width: '100%',
        height: '60px',
        borderTop: '1px solid var(--border)',
        borderRight: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.5rem',
        background: 'var(--surface)',
        zIndex: 20,
        position: 'fixed',
        bottom: 0,
        left: 0
    } : {
        width: '80px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
        background: 'var(--surface)',
        zIndex: 10
    };

    const toolPanelStyle: React.CSSProperties = isMobile ? {
        position: 'fixed',
        left: 0,
        bottom: '60px',
        width: '100%',
        height: '50vh',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '1rem',
        zIndex: 19,
        display: (activeTool === 'bg' || activeTool === 'library' || activeTool === 'elements' || activeTool === 'templates' || activeTool === 'upload') ? 'flex' : 'none',
        flexDirection: 'column',
        boxShadow: '0 -5px 15px -3px rgba(0,0,0,0.1)',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
    } : {
        position: 'absolute',
        left: '80px',
        top: 0,
        bottom: 0,
        width: '300px',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '1rem',
        zIndex: 9,
        display: (activeTool === 'bg' || activeTool === 'library' || activeTool === 'elements' || activeTool === 'templates' || activeTool === 'upload') ? 'flex' : 'none',
        flexDirection: 'column',
        boxShadow: '10px 0 15px -3px rgba(0,0,0,0.05)'
    };


    const handleSaveTemplate = async () => {
        const name = prompt("Nume Template (Admin):");
        if (!name) return;

        try {
            const res = await fetch('/api/designs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    isPublic: true,
                    data: {
                        elements,
                        background,
                        orientation,
                        size,
                        material
                    }
                })
            });

            if (res.ok) {
                alert("Template salvat cu succes!");
            } else {
                alert("Eroare la salvare (Forbidden?).");
            }
        } catch (e) {
            console.error(e);
            alert("Eroare la salvare.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', overflow: 'hidden', position: 'relative' }}>
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
            <Toolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                addElement={addElement}
                isMobile={isMobile}
            />

            <div style={toolPanelStyle}>
                <LibraryPanel
                    activeTool={activeTool}
                    uploadedImages={uploadedImages}
                    addElement={addElement}
                    handleUploadClick={handleUploadClick}
                    VISION_TEMPLATES={VISION_TEMPLATES}
                    loadTemplate={loadTemplate}
                    vectorQuery={vectorQuery}
                    setVectorQuery={setVectorQuery}
                    handleVectorSearch={handleVectorSearch}
                    isSearchingVectors={isSearchingVectors}
                    vectorResults={vectorResults}
                    handleLoadMoreVectors={handleLoadMoreVectors}
                    vectorError={vectorError}
                    handleBgUploadClick={handleBgUploadClick}
                    background={background}
                    setBackground={setBackground}
                    pixabayQuery={pixabayQuery}
                    setPixabayQuery={setPixabayQuery}
                    handlePixabaySearch={handlePixabaySearch}
                    isSearching={isSearching}
                    pixabayTransparent={pixabayTransparent}
                    setPixabayTransparent={setPixabayTransparent}
                    pixabayOrientation={pixabayOrientation}
                    setPixabayOrientation={setPixabayOrientation}
                    pixabayResults={pixabayResults}
                    handleLoadMore={handleLoadMore}
                    pixabayError={pixabayError}
                    activeLibraryCategory={activeLibraryCategory}
                    setActiveLibraryCategory={setActiveLibraryCategory}
                    performPixabaySearch={performPixabaySearch}
                    setVectorPage={setVectorPage}
                    setPixabayPage={setPixabayPage}
                />
            </div>
            {/* Properties Panel (Text & Image Editing) */}
            <PropertiesPanel
                activeTool={activeTool}
                selectedId={selectedId}
                elements={elements}
                updateElementStyle={updateElementStyle}
                setSelectedId={setSelectedId}
                deleteElement={deleteElement}
            />

            {/* Image Edit Panel (shared for uploaded and vectors) */}

            {/* Main Canvas Area */}
            <Workspace
                orientation={orientation}
                elements={elements}
                background={background}
                viewMode={viewMode}
                zoom={zoom}
                setZoom={setZoom}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                setActiveTool={setActiveTool}
                handleDragEnd={handleDragEnd}
                handleContextMenu={handleContextMenu}
                updateElementStyle={updateElementStyle}
                deleteElement={deleteElement}
                handleTextChange={handleTextChange}
                isMobile={isMobile}
                modelViewerRef={modelViewerRef}
                size={size}
                update3DTexture={update3DTexture}
                workspaceContainerRef={workspaceContainerRef}
            />


            {/* Product Options */}
            <MobileNav
                isMobile={isMobile}
                viewMode={viewMode}
                setViewMode={setViewMode}
                setShowMobileSettings={setShowMobileSettings}
                showMobileSettings={showMobileSettings}
            />
            <ProductSidebar
                isMobile={isMobile}
                showMobileSettings={showMobileSettings}
                orientation={orientation}
                setOrientation={setOrientation}
                size={size}
                setSize={setSize}
                material={material}
                setMaterial={setMaterial}
                viewMode={viewMode}
                setViewMode={setViewMode}
                background={background}
                elements={elements}
                price={price}
                handleAddToCart={handleAddToCart}
                isAdmin={isAdmin}
                handleSaveTemplate={handleSaveTemplate}
                setShowMobileSettings={setShowMobileSettings}
            />

            {/* Context Menu */}
            <ContextMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                elementId={contextMenu.elementId}
                duplicateElement={duplicateElement}
                bringToFront={bringToFront}
                sendToBack={sendToBack}
                deleteElement={deleteElement}
                onClose={() => setContextMenu({ ...contextMenu, visible: false })}
            />

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























