'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { VISION_TEMPLATES } from '@/lib/templates';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { LibraryPanel } from './LibraryPanel';
import { ProductSidebar } from './ProductSidebar';
import { Workspace } from './Workspace';
import { MobileNav } from './MobileNav';
import { ContextMenu } from './ContextMenu';
import { useLibrarySearch } from './useLibrarySearch';
import { use3DPreview } from './use3DPreview';
import { useConfigurator } from './useConfigurator';
import { useFileUpload } from './useFileUpload';
import { useSavedDesigns } from './useSavedDesigns';

export default function ConfiguratorClient() {
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === 'admin';
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const {
        material, setMaterial,
        size, setSize,
        orientation, setOrientation,
        viewMode, setViewMode,
        zoom, setZoom,
        elements,
        background, setBackground,
        activeTool, setActiveTool,
        selectedId, setSelectedId,
        contextMenu,
        workspaceContainerRef,
        price,
        handleAddToCart,
        addElement,
        deleteElement,
        loadTemplate,
        handleDragEnd,
        handleTextChange,
        updateElementStyle,
        duplicateElement,
        bringToFront,
        sendToBack,
        handleContextMenu,
        setContextMenu
    } = useConfigurator();

    const modelViewerRef = useRef<any>(null);

    const { update3DTexture } = use3DPreview(
        modelViewerRef,
        elements,
        background,
        orientation,
        viewMode,
        size
    );

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const {
        pixabayQuery, setPixabayQuery,
        pixabayResults, setPixabayResults,
        isSearching,
        pixabayTransparent, setPixabayTransparent,
        pixabayOrientation, setPixabayOrientation,
        pixabayError,
        vectorQuery, setVectorQuery,
        vectorResults, setVectorResults,
        isSearchingVectors,
        vectorError,
        activeLibraryCategory, setActiveLibraryCategory,
        performPixabaySearch,
        handleVectorSearch,
        handleLoadMoreVectors,
        handleLoadMore,
        handlePixabaySearch,
        setVectorPage,
        setPixabayPage
    } = useLibrarySearch(activeTool);

    const {
        fileInputRef,
        bgFileInputRef,
        handleUploadClick,
        handleFileChange,
        handleBgUploadClick,
        handleBgFileChange
    } = useFileUpload(setUploadedImages, setPixabayResults, setActiveTool, setBackground);

    const { savedDesigns, isLoading: isLoadingSaved, fetchDesigns } = useSavedDesigns();

    const [showMobileSettings, setShowMobileSettings] = useState(false);

    const handleSaveTemplate = async () => {
        const name = prompt("Nume Template (Admin):");
        if (!name) return;

        try {
            const res = await fetch('/api/designs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    isPublic: true,
                    data: {
                        elements,
                        background,
                        orientation,
                        size,
                        material
                    }
                })
            });

            if (res.ok) {
                alert("Template salvat cu succes!");
            } else {
                alert("Eroare la salvare (Forbidden?).");
            }
        } catch (e) {
            console.error(e);
            alert("Eroare la salvare.");
        }
    };

    const toolPanelStyle: React.CSSProperties = isMobile ? {
        position: 'fixed',
        left: 0,
        bottom: '60px',
        width: '100%',
        height: '50vh',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '1rem',
        zIndex: 19,
        display: (activeTool === 'bg' || activeTool === 'library' || activeTool === 'elements' || activeTool === 'templates' || activeTool === 'upload' || !!selectedId) ? 'flex' : 'none',
        flexDirection: 'column',
        boxShadow: '0 -5px 15px -3px rgba(0,0,0,0.1)',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
    } : {
        position: 'absolute',
        left: '80px',
        top: 0,
        bottom: 0,
        width: '300px',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '1rem',
        zIndex: 9,
        display: (activeTool === 'bg' || activeTool === 'library' || activeTool === 'elements' || activeTool === 'templates' || activeTool === 'upload' || !!selectedId) ? 'flex' : 'none',
        flexDirection: 'column',
        boxShadow: '10px 0 15px -3px rgba(0,0,0,0.05)'
    };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', overflow: 'hidden', position: 'relative' }}>
            <Script src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" type="module" strategy="afterInteractive" />

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />
            <input
                type="file"
                ref={bgFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleBgFileChange}
            />

            <Toolbar
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                addElement={addElement}
                isMobile={isMobile}
            />

            <div style={toolPanelStyle}>
                <LibraryPanel
                    activeTool={activeTool}
                    uploadedImages={uploadedImages}
                    addElement={addElement}
                    handleUploadClick={handleUploadClick}
                    VISION_TEMPLATES={VISION_TEMPLATES}
                    loadTemplate={loadTemplate}
                    vectorQuery={vectorQuery}
                    setVectorQuery={setVectorQuery}
                    handleVectorSearch={handleVectorSearch}
                    isSearchingVectors={isSearchingVectors}
                    vectorResults={vectorResults}
                    handleLoadMoreVectors={handleLoadMoreVectors}
                    vectorError={vectorError}
                    handleBgUploadClick={handleBgUploadClick}
                    background={background}
                    setBackground={setBackground}
                    pixabayQuery={pixabayQuery}
                    setPixabayQuery={setPixabayQuery}
                    handlePixabaySearch={handlePixabaySearch}
                    isSearching={isSearching}
                    pixabayTransparent={pixabayTransparent}
                    setPixabayTransparent={setPixabayTransparent}
                    pixabayOrientation={pixabayOrientation}
                    setPixabayOrientation={setPixabayOrientation}
                    pixabayResults={pixabayResults}
                    handleLoadMore={handleLoadMore}
                    pixabayError={pixabayError}
                    activeLibraryCategory={activeLibraryCategory}
                    setActiveLibraryCategory={setActiveLibraryCategory}
                    performPixabaySearch={performPixabaySearch}
                    setVectorPage={setVectorPage}
                    setPixabayPage={setPixabayPage}
                    savedDesigns={savedDesigns}
                    isLoadingSaved={isLoadingSaved}
                    fetchDesigns={fetchDesigns}
                />

                {selectedId && (
                    <PropertiesPanel
                        activeTool={activeTool}
                        selectedId={selectedId}
                        elements={elements}
                        updateElementStyle={updateElementStyle}
                        setSelectedId={setSelectedId}
                        deleteElement={deleteElement}
                    />
                )}
            </div>

            <Workspace
                orientation={orientation}
                elements={elements}
                background={background}
                viewMode={viewMode}
                zoom={zoom}
                setZoom={setZoom}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                setActiveTool={setActiveTool}
                handleDragEnd={handleDragEnd}
                handleContextMenu={handleContextMenu}
                updateElementStyle={updateElementStyle}
                deleteElement={deleteElement}
                handleTextChange={handleTextChange}
                isMobile={isMobile}
                modelViewerRef={modelViewerRef}
                size={size}
                update3DTexture={update3DTexture}
                workspaceContainerRef={workspaceContainerRef}
            />

            <MobileNav
                isMobile={isMobile}
                viewMode={viewMode}
                setViewMode={setViewMode}
                setShowMobileSettings={setShowMobileSettings}
                showMobileSettings={showMobileSettings}
            />

            <ProductSidebar
                isMobile={isMobile}
                showMobileSettings={showMobileSettings}
                orientation={orientation}
                setOrientation={setOrientation}
                size={size}
                setSize={setSize}
                material={material}
                setMaterial={setMaterial}
                viewMode={viewMode}
                setViewMode={setViewMode}
                background={background}
                elements={elements}
                price={price}
                handleAddToCart={handleAddToCart}
                isAdmin={isAdmin}
                handleSaveTemplate={handleSaveTemplate}
                setShowMobileSettings={setShowMobileSettings}
            />

            <ContextMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                elementId={contextMenu.elementId}
                duplicateElement={duplicateElement}
                bringToFront={bringToFront}
                sendToBack={sendToBack}
                deleteElement={deleteElement}
                onClose={() => setContextMenu({ ...contextMenu, visible: false })}
            />

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
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
