'use client';

import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { CanvasElement } from './CanvasElement';
import { ZoomControls } from './ZoomControls';
import { ConfigElement } from './Configurator.types';

interface WorkspaceProps {
    orientation: 'landscape' | 'portrait';
    elements: ConfigElement[];
    background: string;
    viewMode: 'workspace' | '3d';
    zoom: number;
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    setActiveTool: (tool: string | null) => void;
    handleDragEnd: (id: string, info: any) => void;
    handleContextMenu: (e: React.MouseEvent, id: string) => void;
    updateElementStyle: (id: string, property: keyof ConfigElement, value: any) => void;
    deleteElement: (id: string) => void;
    handleTextChange: (id: string, newText: string) => void;
    isMobile: boolean;
    modelViewerRef: React.RefObject<any>;
    size: string;
    update3DTexture: () => void;
    workspaceContainerRef: React.RefObject<HTMLDivElement | null>;
    setZoom: (v: number | ((prev: number) => number)) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
    orientation,
    elements,
    background,
    viewMode,
    zoom,
    setZoom,
    selectedId,
    setSelectedId,
    setActiveTool,
    handleDragEnd,
    handleContextMenu,
    updateElementStyle,
    deleteElement,
    handleTextChange,
    isMobile,
    modelViewerRef,
    size,
    update3DTexture,
    workspaceContainerRef
}) => {
    return (
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
                padding: isMobile ? '1rem' : '100px',
                paddingLeft: isMobile ? 0 : '400px',
            }}
        >
            <ZoomControls zoom={zoom} setZoom={setZoom} isMobile={isMobile} />
            <div
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
                        <CanvasElement
                            key={el.id}
                            el={el}
                            index={index}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                            setActiveTool={setActiveTool}
                            handleDragEnd={handleDragEnd}
                            handleContextMenu={handleContextMenu}
                            updateElementStyle={updateElementStyle}
                            deleteElement={deleteElement}
                            handleTextChange={handleTextChange}
                            isMobile={isMobile}
                        />
                    ))
                ) : (
                    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#f8fafc', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
                        {/* @ts-ignore */}
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
    );
};
