import React from 'react';
import { Square, Circle, Heart, Hexagon, Star, Image as ImageIcon, X } from 'lucide-react';
import { ConfigElement, FONTS } from './Configurator.types';

interface PropertiesPanelProps {
    activeTool: string | null;
    selectedId: string | null;
    elements: ConfigElement[];
    updateElementStyle: (id: string, property: keyof ConfigElement, value: any) => void;
    setSelectedId: (id: string | null) => void;
    deleteElement: (id: string) => void;
    setActiveTool: (tool: string | null) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    activeTool,
    selectedId,
    elements,
    updateElementStyle,
    setSelectedId,
    setActiveTool
}) => {

    const handleClose = () => {
        setActiveTool(null);
        setSelectedId(null);
    };

    const renderHeader = (title: string) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 600 }}>{title}</h3>
            <button
                onClick={handleClose}
                className="mobile-close-btn"
                style={{
                    border: 'none',
                    background: '#f1f5f9',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: '#64748b'
                }}
            >
                <X size={20} />
            </button>
        </div>
    );

    // Helper to find selected element
    const el = selectedId ? elements.find(e => e.id === selectedId) : null;

    if (!el || !selectedId) return null;

    const panelStyle: React.CSSProperties = {
        width: '100%',
        background: 'transparent',
        padding: '0',
        zIndex: 9,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flex: 1
    };

    if (activeTool === 'edit-text' && el.type === 'text') {
        return (
            <div style={panelStyle}>
                {renderHeader('Editare Text')}
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

                    {/* Text Scale */}
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

                    {/* Text Effects */}
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Efecte Text</label>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem' }}>
                            {[
                                {
                                    category: "Basic", effects: [
                                        { id: 'none', label: 'Normal' },
                                        { id: 'shadow', label: 'Shadow' },
                                        { id: 'lift', label: 'Lift' },
                                    ]
                                },
                                {
                                    category: "Luminoase / Glow", effects: [
                                        { id: 'neon', label: 'Neon' },
                                        { id: 'glow', label: 'Glow' },
                                        { id: 'soft-glow', label: 'Soft' },
                                        { id: 'outer-glow', label: 'Outer' },
                                    ]
                                },
                                {
                                    category: "Colorate", effects: [
                                        { id: 'gradient-sunset', label: 'Sunset' },
                                        { id: 'gradient-ocean', label: 'Ocean' },
                                        { id: 'rainbow', label: 'Rainbow' },
                                        { id: 'duotone', label: 'Duotone' },
                                    ]
                                },
                                {
                                    category: "Contur / Stroke", effects: [
                                        { id: 'outline', label: 'Outline' },
                                        { id: 'double-outline', label: 'Double' },
                                        { id: 'hollow', label: 'Hollow' },
                                    ]
                                },
                                {
                                    category: "3D / Depth", effects: [
                                        { id: '3d', label: '3D' },
                                        { id: 'extruded', label: 'Hrană' },
                                        { id: 'shadow-stack', label: 'Stack' },
                                        { id: 'long-shadow', label: 'Long' },
                                    ]
                                },
                                {
                                    category: "Fun", effects: [
                                        { id: 'bubble', label: 'Bubble' },
                                        { id: 'candy', label: 'Candy' },
                                        { id: 'cartoon', label: 'Cartoon' },
                                    ]
                                },
                                {
                                    category: "Glam & Retro", effects: [
                                        { id: 'glass', label: 'Glass' },
                                        { id: 'metallic', label: 'Metal' },
                                        { id: 'gold', label: 'Gold' },
                                        { id: 'retro', label: 'Retro' },
                                        { id: 'vaporwave', label: 'Vapor' },
                                        { id: 'cyberpunk', label: 'Cyber' },
                                    ]
                                }
                            ].map(group => (
                                <div key={group.category} style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--secondary-foreground)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>{group.category}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                                        {group.effects.map(eff => (
                                            <button
                                                key={eff.id}
                                                onClick={() => updateElementStyle(el.id, 'effect', eff.id as any)}
                                                className={`effect-${eff.id}`}
                                                style={{
                                                    padding: '0.4rem 0.2rem',
                                                    borderRadius: '4px',
                                                    border: (el.effect || 'none') === eff.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                    background: '#f8fafc',
                                                    fontSize: '0.65rem',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis'
                                                }}
                                                title={eff.label}
                                            >
                                                {eff.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rotation */}
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Rotație: {el.rotation || 0}°</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={el.rotation || 0}
                            onChange={(e) => updateElementStyle(el.id, 'rotation', parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>

                    <button
                        className="btn btn-outline"
                        onClick={() => setSelectedId(null)}
                        style={{ marginTop: '1rem', fontSize: '0.8rem' }}
                    >
                        Închide Editarea
                    </button>
                </div>
            </div>
        );
    }

    if (activeTool === 'edit-image' && el.type === 'image') {
        return (
            <div style={panelStyle}>
                {renderHeader('Editare Imagine')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Size */}
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

                    {/* Rotation */}
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Rotație: {el.rotation || 0}°</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={el.rotation || 0}
                            onChange={(e) => updateElementStyle(el.id, 'rotation', parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>

                    {/* Tints - Show for SVGs, PNGs (icons), or if already colorized */}
                    {(el.content.toLowerCase().endsWith('.svg') ||
                        el.content.toLowerCase().endsWith('.png') ||
                        el.content.startsWith('data:image/svg+xml') ||
                        el.content.startsWith('data:image/png') ||
                        el.color) && (
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
                        )}

                    {/* Mask Shapes */}
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Formă Imagine</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            {[
                                { id: 'none', label: 'Original', icon: <ImageIcon size={14} /> },
                                { id: 'square', label: 'Pătrat', icon: <Square size={14} /> },
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
                                        border: (el.maskShape || 'none') === shape.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        background: (el.maskShape || 'none') === shape.id ? 'var(--accent)' : 'white',
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

                    {/* Filters - Hide if color picker is shown */}
                    {!(el.content.toLowerCase().endsWith('.svg') ||
                        el.content.toLowerCase().endsWith('.png') ||
                        el.content.startsWith('data:image/svg+xml') ||
                        el.content.startsWith('data:image/png') ||
                        el.color) && (
                            <div>
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Filtre Imagine</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Brightness */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Luminozitate</label>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{Math.round((el.filters?.brightness ?? 1) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="2" step="0.1"
                                            value={el.filters?.brightness ?? 1}
                                            onChange={(e) => updateElementStyle(el.id, 'filters', { ...el.filters, brightness: parseFloat(e.target.value) })}
                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                        />
                                    </div>

                                    {/* Contrast */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Contrast</label>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{Math.round((el.filters?.contrast ?? 1) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="2" step="0.1"
                                            value={el.filters?.contrast ?? 1}
                                            onChange={(e) => updateElementStyle(el.id, 'filters', { ...el.filters, contrast: parseFloat(e.target.value) })}
                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                        />
                                    </div>

                                    {/* Saturation */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Saturație</label>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{Math.round((el.filters?.saturate ?? 1) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="3" step="0.1"
                                            value={el.filters?.saturate ?? 1}
                                            onChange={(e) => updateElementStyle(el.id, 'filters', { ...el.filters, saturate: parseFloat(e.target.value) })}
                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                        />
                                    </div>

                                    {/* Grayscale */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Alb-Negru</label>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{Math.round((el.filters?.grayscale ?? 0) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={el.filters?.grayscale ?? 0}
                                            onChange={(e) => updateElementStyle(el.id, 'filters', { ...el.filters, grayscale: parseFloat(e.target.value) })}
                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                        />
                                    </div>

                                    {/* Sepia */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Sepia</label>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{Math.round((el.filters?.sepia ?? 0) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={el.filters?.sepia ?? 0}
                                            onChange={(e) => updateElementStyle(el.id, 'filters', { ...el.filters, sepia: parseFloat(e.target.value) })}
                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                        />
                                    </div>

                                    {/* Blur */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Blur</label>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{el.filters?.blur ?? 0}px</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="20" step="1"
                                            value={el.filters?.blur ?? 0}
                                            onChange={(e) => updateElementStyle(el.id, 'filters', { ...el.filters, blur: parseInt(e.target.value) })}
                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => updateElementStyle(el.id, 'filters', undefined)}
                                        style={{
                                            padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)',
                                            background: 'white', fontSize: '0.7rem', cursor: 'pointer', marginTop: '0.5rem'
                                        }}
                                    >
                                        Resetează Filtrele
                                    </button>
                                </div>
                            </div>
                        )}

                    <button
                        className="btn btn-outline"
                        onClick={() => setSelectedId(null)}
                        style={{ marginTop: '1rem', fontSize: '0.8rem' }}
                    >
                        Închide Editarea
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .mobile-close-btn {
                    display: none;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 768px) {
                    .mobile-close-btn {
                        display: flex;
                    }
                }
            `}</style>
            {null}
        </>
    );
};
