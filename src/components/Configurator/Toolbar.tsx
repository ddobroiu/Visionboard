import React from 'react';
import { Upload, Type, Image as ImageIcon, LayoutGrid, Sparkles, LayoutTemplate } from 'lucide-react';

interface ToolbarProps {
    activeTool: string | null;
    setActiveTool: (tool: string | null) => void;
    addElement: (type: 'image' | 'text', content: string) => void;
    isMobile: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, setActiveTool, addElement, isMobile }) => {

    // Extracted logic for sidebar style
    const sidebarStyle: React.CSSProperties = isMobile ? {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.5rem',
        background: 'var(--surface)',
        zIndex: 20,
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60px',
        borderTop: '1px solid var(--border)'
    } : {
        width: '80px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
        background: 'var(--surface)',
        zIndex: 10
    };

    return (
        <aside style={sidebarStyle}>
            <button className={`tool-btn ${activeTool === 'upload' ? 'active' : ''}`} title="Upload Image" onClick={() => setActiveTool(activeTool === 'upload' ? null : 'upload')}>
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
            <button className={`tool-btn ${activeTool === 'templates' ? 'active' : ''}`} title="Design" onClick={() => setActiveTool(activeTool === 'templates' ? null : 'templates')}>
                <LayoutTemplate size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Design</span>
            </button>
            <button className={`tool-btn ${activeTool === 'library' ? 'active' : ''}`} title="Library" onClick={() => setActiveTool(activeTool === 'library' ? null : 'library')}>
                <LayoutGrid size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Bibliotecă</span>
            </button>
            <button className={`tool-btn ${activeTool === 'elements' ? 'active' : ''}`} title="Elements" onClick={() => setActiveTool(activeTool === 'elements' ? null : 'elements')}>
                <Sparkles size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Elemente</span>
            </button>

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
                @media (max-width: 768px) {
                    .tool-btn {
                        width: auto;
                        height: 100%;
                        margin-bottom: 0;
                        padding: 0 0.5rem;
                    }
                }
            `}</style>
        </aside>
    );
};
