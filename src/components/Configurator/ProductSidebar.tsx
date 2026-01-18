'use client';

import React from 'react';
import { ShoppingCart, Settings, Box, Eye, X } from 'lucide-react';
import Script from 'next/script';
import { ConfigElement } from './Configurator.types';

interface ProductSidebarProps {
    isMobile: boolean;
    showMobileSettings: boolean;
    orientation: 'landscape' | 'portrait';
    setOrientation: (v: 'landscape' | 'portrait') => void;
    size: string;
    setSize: (v: string) => void;
    material: string;
    setMaterial: (v: string) => void;
    viewMode: 'workspace' | '3d';
    setViewMode: (v: 'workspace' | '3d') => void;
    background: string;
    elements: ConfigElement[];
    price: number;
    handleAddToCart: () => void;
    isAdmin: boolean;
    handleSaveTemplate: () => void;
    setShowMobileSettings: (v: boolean) => void;
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
    isMobile,
    showMobileSettings,
    orientation,
    setOrientation,
    size,
    setSize,
    material,
    setMaterial,
    viewMode,
    setViewMode,
    background,
    elements,
    price,
    handleAddToCart,
    isAdmin,
    handleSaveTemplate,
    setShowMobileSettings
}) => {
    return (
        <aside style={{
            width: isMobile ? '100%' : '350px',
            height: isMobile ? 'auto' : '100%',
            overflowY: 'auto',
            borderLeft: isMobile ? 'none' : '1px solid var(--border)',
            padding: '1.5rem',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: isMobile ? 1002 : 10,
            position: isMobile ? 'fixed' : 'relative',
            bottom: 0,
            right: 0,
            transform: isMobile && !showMobileSettings ? 'translateY(100%)' : 'none',
            transition: 'transform 0.3s ease-out',
            borderTopLeftRadius: isMobile ? '1rem' : 0,
            borderTopRightRadius: isMobile ? '1rem' : 0,
            boxShadow: isMobile ? '0 -10px 25px -5px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
            {isMobile && (
                <button onClick={() => setShowMobileSettings(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X />
                </button>
            )}

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
                        {/* @ts-ignore */}
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
                {isAdmin && (
                    <button
                        className="btn btn-outline"
                        style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}
                        onClick={handleSaveTemplate}
                    >
                        <Settings size={20} style={{ marginRight: '0.5rem' }} />
                        Salvează Template
                    </button>
                )}
            </div>
        </aside>
    );
};
