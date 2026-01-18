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
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute', top: isMobile ? -25 : -20, right: isMobile ? -25 : -20, width: isMobile ? 32 : 24, height: isMobile ? 32 : 24,
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
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
