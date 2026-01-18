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
    onClose
}) => {
    if (!visible || !elementId) return null;

    return (
        <div style={{
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
        }}>
            <button
                onClick={() => { duplicateElement(elementId); onClose(); }}
                style={{ padding: '0.5rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px' }}
                className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
            >
                <Copy size={14} />
                Duplică Element
            </button>
            <button
                onClick={() => { bringToFront(elementId); onClose(); }}
                style={{ padding: '0.5rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px' }}
                className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
            >
                <ArrowUp size={14} />
                Adu în față
            </button>
            <button
                onClick={() => { sendToBack(elementId); onClose(); }}
                style={{ padding: '0.5rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px' }}
                className="hover:bg-accent hover:text-primary transition-colors flex items-center gap-2"
            >
                <ArrowDown size={14} />
                Trimite în spate
            </button>
            <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }} />
            <button
                onClick={() => { deleteElement(elementId); onClose(); }}
                style={{ padding: '0.5rem 0.75rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', borderRadius: '4px', color: '#ef4444' }}
                className="hover:bg-red-50 transition-colors flex items-center gap-2"
            >
                <X size={14} />
                ț˜terge Element
            </button>
        </div>
    );
};
