'use client';

import React from 'react';
import { Box, ShoppingCart } from 'lucide-react';

interface MobileNavProps {
    isMobile: boolean;
    viewMode: 'workspace' | '3d';
    setViewMode: (v: 'workspace' | '3d') => void;
    setShowMobileSettings: (v: boolean) => void;
    showMobileSettings: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
    isMobile,
    viewMode,
    setViewMode,
    setShowMobileSettings,
    showMobileSettings
}) => {
    if (!isMobile) return null;

    return (
        <>
            {/* Floating 3D Toggle */}
            <button
                onClick={() => setViewMode(viewMode === 'workspace' ? '3d' : 'workspace')}
                style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'white', padding: '0.6rem 1rem', borderRadius: '99px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid var(--border)',
                    zIndex: 40, fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px'
                }}
            >
                <Box size={16} /> {viewMode === 'workspace' ? 'Vezi 3D' : 'Vezi 2D'}
            </button>

            {/* Floating Settings/Order Button (bottom right above zoom) */}
            <button
                onClick={() => setShowMobileSettings(true)}
                style={{
                    position: 'absolute', top: '1rem', right: '110px',
                    background: 'var(--primary)', color: 'white', padding: '0.6rem 1rem', borderRadius: '99px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: 'none',
                    zIndex: 40, fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px'
                }}
            >
                <ShoppingCart size={16} /> Comandă
            </button>

            {/* Overlay for Settings */}
            {showMobileSettings && (
                <div
                    onClick={() => setShowMobileSettings(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
                />
            )}
        </>
    );
};
