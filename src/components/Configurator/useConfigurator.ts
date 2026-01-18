'use client';

import { useState, useEffect, useRef } from 'react';
import { ConfigElement } from './Configurator.types';
import { useCart } from '@/components/CartContext';
import { VisionTemplate } from '@/lib/templates';

export function useConfigurator() {
    const [material, setMaterial] = useState('canvas');
    const [size, setSize] = useState('40x60');
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
    const [viewMode, setViewMode] = useState<'workspace' | '3d'>('workspace');
    const [zoom, setZoom] = useState(1);
    const [elements, setElements] = useState<ConfigElement[]>([]);
    const [background, setBackground] = useState<string>('#ffffff');
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, elementId: string | null }>({
        x: 0, y: 0, visible: false, elementId: null
    });

    const { addItem } = useCart();
    const workspaceContainerRef = useRef<HTMLDivElement>(null);

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
            rotation: 0,
        };
        setElements([...elements, newElement]);
        setSelectedId(newElement.id);
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
        setElements(prev => prev.map(el => {
            if (el.id === id) {
                return { ...el, x: el.x + info.offset.x / zoom, y: el.y + info.offset.y / zoom };
            }
            return el;
        }));
    };

    const handleTextChange = (id: string, newText: string) => {
        setElements(elements.map(el => el.id === id ? { ...el, content: newText } : el));
    };

    const updateElementStyle = (id: string, property: keyof ConfigElement, value: any) => {
        setElements(elements.map(el => el.id === id ? { ...el, [property]: value } : el));
    };

    const duplicateElement = (id: string) => {
        const el = elements.find(e => e.id === id);
        if (el) {
            const newElement: ConfigElement = {
                ...el,
                id: Math.random().toString(36).substr(2, 9),
                x: el.x + 20,
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

    useEffect(() => {
        const handleClick = () => {
            if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [contextMenu.visible]);

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

    return {
        material, setMaterial,
        size, setSize,
        orientation, setOrientation,
        viewMode, setViewMode,
        zoom, setZoom,
        elements, setElements,
        background, setBackground,
        activeTool, setActiveTool,
        selectedId, setSelectedId,
        contextMenu, setContextMenu,
        workspaceContainerRef,
        price,
        handleAddToCart,
        addElement,
        deleteElement,
        loadTemplate,
        handleDragEnd,
        handleTextChange,
        updateElementStyle,
        duplicateElement,
        bringToFront,
        sendToBack,
        handleContextMenu
    };
}
