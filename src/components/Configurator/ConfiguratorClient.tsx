'use client';

import { useState, useRef } from 'react';
import { Upload, Type, Image as ImageIcon, ShoppingCart, Settings, X, GripHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfigElement {
    id: string;
    type: 'image' | 'text';
    content: string; // URL for image, text content for text
    x: number;
    y: number;
    style?: React.CSSProperties;
}

export default function ConfiguratorClient() {
    const [material, setMaterial] = useState('canvas');
    const [size, setSize] = useState('40x60');

    const [elements, setElements] = useState<ConfigElement[]>([]);
    const [background, setBackground] = useState<string>('#ffffff');
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                addElement('image', url);
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
        };
        setElements([...elements, newElement]);
    };

    const removeElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
    };

    const handleTextChange = (id: string, newText: string) => {
        setElements(elements.map(el => el.id === id ? { ...el, content: newText } : el));
    };

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
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
            </aside>

            {/* Tool Panel (for Background) */}
            {activeTool === 'bg' && (
                <div style={{ width: '200px', borderRight: '1px solid var(--border)', background: 'var(--surface)', padding: '1rem', zIndex: 9 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Culoare Fundal</h3>
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
                </div>
            )}

            {/* Main Canvas Area */}
            <main style={{ flex: 1, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    width: '600px',
                    height: '400px',
                    background: background,
                    transition: 'background 0.3s ease',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {elements.length === 0 && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#cbd5e1', textAlign: 'center', pointerEvents: 'none' }}>
                            <Settings size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <div>Spațiu de Lucru</div>
                            <div style={{ fontSize: '0.875rem' }}>Folosește meniul din stânga</div>
                        </div>
                    )}

                    {elements.map((el) => (
                        <motion.div
                            key={el.id}
                            drag
                            dragMomentum={false}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ position: 'absolute', top: '50%', left: '50%', cursor: 'move' }}
                        >
                            <div className="element-wrapper" style={{ position: 'relative' }}>
                                {el.type === 'text' ? (
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleTextChange(el.id, e.currentTarget.textContent || '')}
                                        style={{
                                            fontSize: '1.5rem', fontWeight: 'bold', padding: '0.5rem',
                                            border: '1px dashed transparent',
                                            minWidth: '100px', textAlign: 'center'
                                        }}
                                        className="editable-text"
                                    >
                                        {el.content}
                                    </div>
                                ) : (
                                    <img src={el.content} alt="uploaded" style={{ maxWidth: '200px', display: 'block' }} />
                                )}

                                <button
                                    onClick={() => removeElement(el.id)}
                                    style={{
                                        position: 'absolute', top: '-10px', right: '-10px',
                                        background: 'white', borderRadius: '50%', width: '20px', height: '20px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer',
                                        padding: 0
                                    }}
                                    className="delete-btn"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Product Options */}
            <aside style={{ width: '320px', borderLeft: '1px solid var(--border)', padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Configurare Produs</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Material</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {['canvas', 'forex', 'acrylic'].map((m) => (
                            <label key={m} style={{
                                display: 'flex', alignItems: 'center', padding: '0.75rem',
                                border: material === m ? '2px solid var(--primary)' : '1px solid var(--border)',
                                borderRadius: 'var(--radius)', cursor: 'pointer',
                                background: material === m ? 'var(--accent)' : 'transparent'
                            }}>
                                <input
                                    type="radio"
                                    name="material"
                                    value={m}
                                    checked={material === m}
                                    onChange={(e) => setMaterial(e.target.value)}
                                    style={{ marginRight: '0.75rem' }}
                                />
                                <span style={{ textTransform: 'capitalize' }}>
                                    {m === 'canvas' && 'Tablou Canvas'}
                                    {m === 'forex' && 'Placă Forex (PVC)'}
                                    {m === 'acrylic' && 'Sticlă Acrilică'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dimensiune (cm)</label>
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                    >
                        <option value="20x30">20x30 cm</option>
                        <option value="30x40">30x40 cm</option>
                        <option value="40x60">40x60 cm</option>
                        <option value="50x70">50x70 cm</option>
                        <option value="70x100">70x100 cm</option>
                    </select>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        <span>Preț:</span>
                        <span>150 Lei</span>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                        <ShoppingCart size={20} style={{ marginRight: '0.5rem' }} />
                        Adaugă în Coș
                    </button>
                </div>

            </aside>

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
      `}</style>
        </div>
    );
}
