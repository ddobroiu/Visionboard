'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ConfigElement } from './Configurator.types';

interface CanvasElementProps {
    el: ConfigElement;
    index: number;
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    setActiveTool: (tool: string | null) => void;
    handleDragEnd: (id: string, info: any) => void;
    handleContextMenu: (e: React.MouseEvent, id: string) => void;
    updateElementStyle: (id: string, property: keyof ConfigElement, value: any) => void;
    deleteElement: (id: string) => void;
    handleTextChange: (id: string, newText: string) => void;
    isMobile: boolean;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
    el,
    index,
    selectedId,
    setSelectedId,
    setActiveTool,
    handleDragEnd,
    handleContextMenu,
    updateElementStyle,
    deleteElement,
    handleTextChange,
    isMobile
}) => {
    return (
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
                x: el.x,
                y: el.y,
                zIndex: selectedId === el.id ? 1000 : index,
                touchAction: 'none',
                rotate: el.rotation || 0,
                transformOrigin: 'center center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
                                onPointerDown={(e) => e.stopPropagation()}
                                style={{
                                    position: 'absolute',
                                    top: corner.includes('n') ? -8 : 'auto',
                                    bottom: corner.includes('s') ? -8 : 'auto',
                                    left: corner.includes('w') ? -8 : 'auto',
                                    right: corner.includes('e') ? -8 : 'auto',
                                    width: 24, height: 24, background: 'white',
                                    border: '2px solid var(--primary)', borderRadius: '50%',
                                    cursor: corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize',
                                    zIndex: 110, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            />
                        ))}

                        {/* Global Delete Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute', top: isMobile ? -30 : -20, right: isMobile ? -30 : -20, width: isMobile ? 36 : 24, height: isMobile ? 36 : 24,
                                borderRadius: '50%', background: '#ef4444', color: 'white',
                                border: '2px solid white', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', cursor: 'pointer', zIndex: 110,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            className="hover:bg-red-600 transition-colors"
                            title="ș˜terge element"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
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
                        className={`editable-text effect-${el.effect || 'none'}`}
                    >
                        {el.content}
                    </div>
                ) : (
                    <div style={{
                        filter: el.filters ? [
                            el.filters.brightness !== undefined ? `brightness(${el.filters.brightness})` : '',
                            el.filters.contrast !== undefined ? `contrast(${el.filters.contrast})` : '',
                            el.filters.saturate !== undefined ? `saturate(${el.filters.saturate})` : '',
                            el.filters.grayscale !== undefined ? `grayscale(${el.filters.grayscale})` : '',
                            el.filters.sepia !== undefined ? `sepia(${el.filters.sepia})` : '',
                            el.filters.blur !== undefined ? `blur(${el.filters.blur}px)` : '',
                            el.filters.hueRotate !== undefined ? `hue-rotate(${el.filters.hueRotate}deg)` : '',
                        ].join(' ') : 'none'
                    }}>
                        {el.color ? (
                            <div style={{
                                width: '200px', height: '200px', backgroundColor: el.color,
                                WebkitMaskImage: el.maskShape === 'heart'
                                    ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`
                                    : `url(${el.content})`,
                                WebkitMaskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                maskImage: el.maskShape === 'heart'
                                    ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`
                                    : `url(${el.content})`,
                                maskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                clipPath: (el.maskShape === 'circle') ? 'circle(50%)' :
                                    (el.maskShape === 'hexagon') ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                                        (el.maskShape === 'star') ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none',
                            }} />
                        ) : (
                            <img
                                src={el.content}
                                alt="uploaded"
                                draggable="false"
                                style={{
                                    width: (el.maskShape && el.maskShape !== 'none') ? '200px' : 'auto',
                                    height: (el.maskShape && el.maskShape !== 'none') ? '200px' : 'auto',
                                    maxWidth: '300px',
                                    display: 'block',
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                    objectFit: (el.maskShape && el.maskShape !== 'none') ? 'cover' : 'contain',
                                    clipPath: (el.maskShape === 'circle') ? 'circle(50% at 50% 50%)' :
                                        (el.maskShape === 'hexagon') ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                                            (el.maskShape === 'star') ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none',
                                    WebkitMaskImage: el.maskShape === 'heart' ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")` : 'none',
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    maskImage: el.maskShape === 'heart' ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")` : 'none',
                                    maskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
