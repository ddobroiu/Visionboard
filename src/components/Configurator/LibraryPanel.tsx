'use client';

import React from 'react';
import { Upload, X, Search } from 'lucide-react';
import { VisionTemplate } from '@/lib/templates';
import { LibraryCategory } from '@/lib/libraryAssets';

interface LibraryPanelProps {
    activeTool: string | null;
    uploadedImages: string[];
    addElement: (type: 'image' | 'text', content: string) => void;
    handleUploadClick: () => void;
    VISION_TEMPLATES: VisionTemplate[];
    loadTemplate: (t: VisionTemplate) => void;
    vectorQuery: string;
    setVectorQuery: (v: string) => void;
    handleVectorSearch: (e: React.FormEvent) => void;
    isSearchingVectors: boolean;
    vectorResults: any[];
    handleLoadMoreVectors: () => void;
    vectorError: string | null;
    handleBgUploadClick: () => void;
    background: string;
    setBackground: (v: string) => void;
    pixabayQuery: string;
    setPixabayQuery: (v: string) => void;
    handlePixabaySearch: (e: React.FormEvent) => void;
    isSearching: boolean;
    pixabayTransparent: boolean;
    setPixabayTransparent: (v: boolean) => void;
    pixabayOrientation: string;
    setPixabayOrientation: (v: string) => void;
    pixabayResults: any[];
    handleLoadMore: () => void;
    pixabayError: string | null;
    activeLibraryCategory: LibraryCategory;
    setActiveLibraryCategory: (v: LibraryCategory) => void;
    performPixabaySearch: (query: string, isLoadMore: boolean, pageNum: number, type?: string) => void;
    setVectorPage: (v: number) => void;
    setPixabayPage: (v: number) => void;
}

export const LibraryPanel: React.FC<LibraryPanelProps> = ({
    activeTool,
    uploadedImages,
    addElement,
    handleUploadClick,
    VISION_TEMPLATES,
    loadTemplate,
    vectorQuery,
    setVectorQuery,
    handleVectorSearch,
    isSearchingVectors,
    vectorResults,
    handleLoadMoreVectors,
    vectorError,
    handleBgUploadClick,
    background,
    setBackground,
    pixabayQuery,
    setPixabayQuery,
    handlePixabaySearch,
    isSearching,
    pixabayTransparent,
    setPixabayTransparent,
    pixabayOrientation,
    setPixabayOrientation,
    pixabayResults,
    handleLoadMore,
    pixabayError,
    activeLibraryCategory,
    setActiveLibraryCategory,
    performPixabaySearch,
    setVectorPage,
    setPixabayPage
}) => {
    if (!activeTool || !['upload', 'templates', 'elements', 'bg', 'library'].includes(activeTool)) {
        return null;
    }

    return (
        <>
            {activeTool === 'upload' && (
                <>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Încărcare Imagini</h3>
                    <button className="tool-btn-full" onClick={handleUploadClick}>
                        <Upload size={20} />
                        <span>Încarcă Imagine Nouă</span>
                    </button>

                    <div style={{ paddingBottom: '1rem', fontWeight: 600, fontSize: '0.9rem' }}>Imaginile tale ({uploadedImages.length})</div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', overflowY: 'auto', flex: 1 }} className="hide-scrollbar">
                        {uploadedImages.length > 0 ? (
                            uploadedImages.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => addElement('image', url)}
                                    className="library-item"
                                    style={{ height: '100px' }}
                                >
                                    <img src={url} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))
                        ) : (
                            <div className="empty-state">
                                Nu ai încărcat nicio poză încă.
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTool === 'templates' && (
                <>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Modele Ready-to-Use</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem', overflowY: 'auto', flex: 1 }} className="hide-scrollbar">
                        {VISION_TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => loadTemplate(t)}
                                className="template-card"
                            >
                                <div className="template-thumb">
                                    <img src={t.thumbnail} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="template-info">
                                    <div className="template-name">{t.name}</div>
                                    <div className="template-desc">{t.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}

            {activeTool === 'elements' && (
                <>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Elemente & Forme</h3>

                    <form onSubmit={handleVectorSearch} className="search-form">
                        <input
                            type="text"
                            value={vectorQuery}
                            onChange={(e) => setVectorQuery(e.target.value)}
                            placeholder="Caută elemente (ex: flori, linii)..."
                            className="search-input"
                        />
                        <button type="submit" disabled={isSearchingVectors} className="search-submit">
                            {isSearchingVectors ? '...' : <Search size={18} />}
                        </button>
                    </form>

                    <div className="chip-container">
                        {['forme', 'linii', 'flori', 'abstract', 'nature'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    const query = cat.charAt(0).toUpperCase() + cat.slice(1);
                                    setVectorQuery(query);
                                    setVectorPage(1);
                                    performPixabaySearch(query, false, 1, 'vector');
                                }}
                                className={`chip ${vectorQuery.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', overflowY: 'auto', flex: 1, paddingBottom: '1rem' }} className="hide-scrollbar">
                        {vectorResults.map(hit => (
                            <button
                                key={hit.id}
                                onClick={() => addElement('image', hit.url)}
                                className="library-item"
                                style={{ height: '80px' }}
                            >
                                <img src={hit.preview} alt={hit.tags} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }} />
                            </button>
                        ))}

                        {vectorResults.length > 0 && (
                            <button
                                onClick={handleLoadMoreVectors}
                                disabled={isSearchingVectors}
                                className="load-more-btn"
                                style={{ gridColumn: 'span 3' }}
                            >
                                {isSearchingVectors ? 'Se încarcă...' : 'Încarcă mai multe elemente'}
                            </button>
                        )}

                        {vectorError && (
                            <div className="error-message" style={{ gridColumn: 'span 3' }}>
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
                        <label className="input-label">Imagine de Fundal</label>
                        <button onClick={handleBgUploadClick} className="upload-btn-dashed">
                            <Upload size={18} /> Încarcă Poză de Fundal
                        </button>
                        {!background.startsWith('#') && (
                            <button onClick={() => setBackground('#ffffff')} className="remove-bg-btn">
                                <X size={14} /> Elimină Imaginea de Fundal
                            </button>
                        )}
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <label className="input-label">Sau alege o culoare</label>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <input
                            type="color"
                            value={background.startsWith('#') ? background : '#ffffff'}
                            onChange={(e) => setBackground(e.target.value)}
                            className="color-picker-input-small"
                        />
                        <div className="color-hex-display">
                            {background.startsWith('#') ? background.toUpperCase() : 'IMAGINE'}
                        </div>
                    </div>

                    <div className="color-swatches-grid">
                        {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#fee2e2', '#fecaca', '#fef3c7', '#dcfce7', '#dbeafe', '#e0e7ff', '#fae8ff', '#f3e8ff', '#000000', '#1e293b'].map(color => (
                            <button
                                key={color}
                                onClick={() => setBackground(color)}
                                className={`color-swatch ${background === color ? 'active' : ''}`}
                                style={{ background: color }}
                            />
                        ))}
                    </div>
                </>
            )}

            {activeTool === 'library' && (
                <>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>Stickere & Imagini</h3>

                    <form onSubmit={handlePixabaySearch} className="search-form">
                        <input
                            type="text"
                            value={pixabayQuery}
                            onChange={(e) => setPixabayQuery(e.target.value)}
                            placeholder="Caută în Pixabay..."
                            className="search-input"
                        />
                        <button type="submit" disabled={isSearching} className="search-submit">
                            {isSearching ? '...' : <Search size={18} />}
                        </button>
                    </form>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label className={`toggle-btn ${pixabayTransparent ? 'active' : ''}`}>
                            <input
                                type="checkbox"
                                checked={pixabayTransparent}
                                onChange={(e) => setPixabayTransparent(e.target.checked)}
                                style={{ display: 'none' }}
                            />
                            <span>Fără fundal (PNG)</span>
                        </label>

                        <select
                            value={pixabayOrientation}
                            onChange={(e) => setPixabayOrientation(e.target.value)}
                            className="select-input"
                        >
                            <option value="all">Toate</option>
                            <option value="horizontal">Landscape</option>
                            <option value="vertical">Portrait</option>
                        </select>
                    </div>

                    <div className="chip-container">
                        {['masini', 'familie', 'bani', 'travel', 'citate'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    const query = cat.charAt(0).toUpperCase() + cat.slice(1);
                                    setPixabayQuery(query);
                                    setPixabayPage(1);
                                    performPixabaySearch(query, false, 1);
                                }}
                                className={`chip ${pixabayQuery.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                        {pixabayResults.length > 0 && (
                            <button
                                onClick={() => setActiveLibraryCategory('search' as any)}
                                className={`chip ${activeLibraryCategory === ('search' as any) ? 'active' : ''}`}
                                style={{ fontWeight: 'bold' }}
                            >
                                Rezultate Căutare
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
                        {pixabayResults.length > 0 ? (
                            <>
                                {pixabayResults.map(hit => (
                                    <button
                                        key={hit.id}
                                        onClick={() => addElement('image', hit.url)}
                                        className="library-item"
                                        style={{ height: '100px' }}
                                    >
                                        <img src={hit.preview} alt={hit.tags} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isSearching}
                                    className="load-more-btn"
                                    style={{ gridColumn: 'span 2' }}
                                >
                                    {isSearching ? 'Se încarcă...' : 'Încarcă mai multe rezultate'}
                                </button>
                            </>
                        ) : (
                            <div className="empty-state">
                                {pixabayError || (pixabayQuery ? `Nu am găsit rezultate pentru "${pixabayQuery}"` : "Căutați sau selectați o categorie.")}
                            </div>
                        )}

                        {pixabayError && pixabayResults.length > 0 && (
                            <div className="error-message" style={{ gridColumn: 'span 2' }}>
                                {pixabayError}
                            </div>
                        )}
                    </div>
                </>
            )}

            <style jsx>{`
                .tool-btn-full {
                    width: 100%;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 0.75rem;
                    background: var(--primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: opacity 0.2s;
                }
                .tool-btn-full:hover { opacity: 0.9; }

                .library-item {
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    overflow: hidden;
                    background: white;
                    cursor: pointer;
                    position: relative;
                    padding: 0;
                    transition: shadow 0.2s;
                }
                .library-item:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }

                .empty-state {
                    grid-column: span 2;
                    text-align: center;
                    padding: 2rem;
                    color: var(--secondary-foreground);
                    opacity: 0.6;
                    font-size: 0.9rem;
                }

                .template-card {
                    border: 1px solid var(--border);
                    background: white;
                    padding: 0.5rem;
                    cursor: pointer;
                    border-radius: 12px;
                    overflow: hidden;
                    text-align: left;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .template-card:hover { 
                    border-color: var(--primary);
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                .template-thumb {
                    width: 100%;
                    height: 140px;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .template-name { fontWeight: 700; fontSize: 0.9rem; color: var(--foreground); }
                .template-desc { fontSize: 0.75rem; color: #64748b; }

                .search-form { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
                .search-input {
                    flex: 1;
                    padding: 0.6rem;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    background: white;
                    font-size: 0.875rem;
                }
                .search-submit {
                    padding: 0.6rem 1rem;
                    border-radius: 8px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chip-container {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    overflow-x: auto;
                    padding-bottom: 0.5rem;
                }
                .chip {
                    padding: 0.4rem 0.8rem;
                    border-radius: 99px;
                    border: 1px solid var(--border);
                    background: white;
                    font-size: 0.8rem;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                .chip.active { background: var(--primary); color: white; }

                .load-more-btn {
                    padding: 0.75rem;
                    margin-top: 0.5rem;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    background: white;
                    color: var(--primary);
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.875rem;
                    margin-bottom: 1rem;
                }

                .error-message {
                    text-align: center;
                    padding: 1rem;
                    color: var(--secondary-foreground);
                    opacity: 0.6;
                    font-size: 0.8rem;
                }

                .input-label { display: block; fontSize: 0.875rem; fontWeight: 600; margin-bottom: 0.5rem; }
                
                .upload-btn-dashed {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 8px;
                    border: 2px dashed var(--border);
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--primary);
                    font-weight: 600;
                }
                .remove-bg-btn {
                    width: 100%;
                    margin-top: 0.75rem;
                    padding: 0.6rem;
                    font-size: 0.8rem;
                    color: white;
                    background: #ef4444;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .color-picker-input-small {
                    width: 40px;
                    height: 40px;
                    padding: 0;
                    border: none;
                    cursor: pointer;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .color-hex-display {
                    flex: 1;
                    border: 1px solid var(--border);
                    border-radius: 4px;
                    padding: 0.5rem;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    background: white;
                }

                .color-swatches-grid { display: grid; gridTemplateColumns: repeat(4, 1fr); gap: 0.5rem; }
                .color-swatch { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border); cursor: pointer; }
                .color-swatch.active { box-shadow: 0 0 0 2px var(--primary); }

                .toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    padding: 0.4rem 0.8rem;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    background: white;
                    transition: all 0.2s;
                }
                .toggle-btn.active { background: var(--accent); color: var(--primary); font-weight: 700; }

                .select-input {
                    padding: 0.4rem 0.6rem;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    font-size: 0.8rem;
                    background: white;
                    cursor: pointer;
                }

                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
};
