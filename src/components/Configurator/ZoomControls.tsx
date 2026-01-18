'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ZoomControlsProps {
    zoom: number;
    setZoom: (zoom: number | ((prev: number) => number)) => void;
    isMobile: boolean;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, setZoom, isMobile }) => {
    return (
        <div style={{
            position: 'absolute', bottom: isMobile ? '80px' : '2rem', left: '50%', transform: 'translateX(-50%)',
            background: 'white', padding: '0.5rem', borderRadius: '12px',
            display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            zIndex: 200, border: '1px solid var(--border)'
        }}>
            <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                style={{ padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
                <Minus size={16} />
            </button>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, minWidth: '3.5rem', textAlign: 'center' }}>
                {Math.round(zoom * 100)}%
            </span>
            <button
                onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                style={{ padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
                <Plus size={16} />
            </button>
            <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }} />
            <button
                onClick={() => setZoom(1)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', background: 'var(--accent)', border: 'none', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}
            >
                RESET
            </button>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem' }}>Scroll</div>
        </div>
    );
};
