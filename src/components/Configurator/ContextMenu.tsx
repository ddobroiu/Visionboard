'use client';

import React from 'react';
import { Copy, ArrowUp, ArrowDown, X } from 'lucide-react';

interface ContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
    elementId: string | null;
    duplicateElement: (id: string) => void;
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;
    deleteElement: (id: string) => void;
    onClose: () => void;
    isMobile: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    visible,
    x,
    y,
    elementId,
    duplicateElement,
    bringToFront,
    sendToBack,
    deleteElement,
    onClose,
    isMobile
}) => {
    if (!visible || !elementId) return null;

    const desktopStyle: React.CSSProperties = {
        position: 'fixed',
        top: y,
        left: x,
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
    };

    const mobileStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '70px', // Above the bottom toolbar
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        borderRadius: '16px',
        padding: '0.75rem',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const containerStyle = isMobile ? mobileStyle : desktopStyle;

    return (
        <div style={containerStyle}>
            {isMobile ? (
                <>
                    <button onClick={() => { duplicateElement(elementId); onClose(); }} style={mobileBtnStyle} title="Duplică ">
                        <Copy size={20} />
                    </button>
                    <button onClick={() => { bringToFront(elementId); onClose(); }} style={mobileBtnStyle} title="Adu în față">
                        <ArrowUp size={20} />
                    </button>
                    <button onClick={() => { sendToBack(elementId); onClose(); }} style={mobileBtnStyle} title="Trimite în spate">
                        <ArrowDown size={20} />
                    </button>
                    <button onClick={() => { deleteElement(elementId); onClose(); }} style={{ ...mobileBtnStyle, color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }} title="ș˜terge">
                        <X size={20} />
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={() => { duplicateElement(elementId); onClose(); }}
                        style={desktopBtnStyle}
                        className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <Copy size={14} />
                        Duplică Element
                    </button>
                    <button
                        onClick={() => { bringToFront(elementId); onClose(); }}
                        style={desktopBtnStyle}
                        className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <ArrowUp size={14} />
                        Adu în față
                    </button>
                    <button
                        onClick={() => { sendToBack(elementId); onClose(); }}
                        style={desktopBtnStyle}
                        className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <ArrowDown size={14} />
                        Trimite în spate
                    </button>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
                    <button
                        onClick={() => { deleteElement(elementId); onClose(); }}
                        style={{ ...desktopBtnStyle, color: '#ef4444' }}
                        className="hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                        <X size={14} />
                        ș˜terge Element
                    </button>
                </>
            )}
        </div>
    );
};

const desktopBtnStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    borderRadius: '4px',
    width: '100%'
};

const mobileBtnStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--foreground)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};
