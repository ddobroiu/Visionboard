'use client';

import { useEffect } from 'react';
import { ConfigElement } from './Configurator.types';

export function use3DPreview(
    modelViewerRef: React.RefObject<any>,
    elements: ConfigElement[],
    background: string,
    orientation: 'landscape' | 'portrait',
    viewMode: 'workspace' | '3d',
    size: string
) {
    const update3DTexture = async () => {
        const viewer = modelViewerRef.current;
        if (!viewer) return;

        try {
            if (!viewer.model) {
                await new Promise(resolve => viewer.addEventListener('load', resolve, { once: true }));
            }

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const res = 1024;
            canvas.width = res;
            canvas.height = res;

            // Background
            ctx.fillStyle = background.startsWith('#') ? background : '#ffffff';
            ctx.fillRect(0, 0, res, res);

            if (!background.startsWith('#')) {
                const bgImg = new Image();
                bgImg.src = background;
                bgImg.crossOrigin = "anonymous";
                await new Promise((r) => { bgImg.onload = r; bgImg.onerror = r; });
                const bgRatio = bgImg.width / bgImg.height;
                let dw, dh, dx, dy;
                if (bgRatio > 1) { dh = res; dw = res * bgRatio; dx = (res - dw) / 2; dy = 0; }
                else { dw = res; dh = res / bgRatio; dx = 0; dy = (res - dh) / 2; }
                ctx.drawImage(bgImg, dx, dy, dw, dh);
            }

            const workspaceW = orientation === 'landscape' ? 600 : 400;
            const scale = res / workspaceW;

            for (const el of elements) {
                ctx.save();
                ctx.translate((el.x + 20) * scale, (el.y + 20) * scale);
                ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
                ctx.scale(el.scale || 1, el.scale || 1);

                if (el.type === 'text') {
                    ctx.fillStyle = el.color || '#000000';
                    const fSize = (el.fontSize || 24) * scale;
                    ctx.font = `bold ${fSize}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(el.content, 0, 0);
                } else if (el.type === 'image') {
                    const img = new Image();
                    img.src = el.content;
                    img.crossOrigin = "anonymous";
                    await new Promise((r) => { img.onload = r; img.onerror = r; });
                    const size = 200 * scale; // Standardize size for shapes
                    const imgRatio = img.width / img.height;

                    // Center point for drawing (relative to translated context)
                    const cx = 0;
                    const cy = 0;
                    const r = size / 2;

                    if (el.maskShape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(cx, cy, r, 0, Math.PI * 2);
                        ctx.clip();
                    } else if (el.maskShape === 'heart') {
                        ctx.beginPath();
                        ctx.moveTo(cx, cy + r * 0.75);
                        ctx.bezierCurveTo(cx - r * 1.2, cy - r * 0.3, cx - r * 0.5, cy - r * 1.1, cx, cy - r * 0.3);
                        ctx.bezierCurveTo(cx + r * 0.5, cy - r * 1.1, cx + r * 1.2, cy - r * 0.3, cx, cy + r * 0.75);
                        ctx.clip();
                    } else if (el.maskShape === 'hexagon') {
                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const angle = (Math.PI / 3) * i;
                            const x = cx + r * Math.cos(angle);
                            const y = cy + r * Math.sin(angle);
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.clip();
                    } else if (el.maskShape === 'star') {
                        ctx.beginPath();
                        for (let i = 0; i < 10; i++) {
                            const angle = (Math.PI / 5) * i;
                            const rad = i % 2 === 0 ? r : r * 0.5;
                            const x = cx + rad * Math.cos(angle - Math.PI / 2);
                            const y = cy + rad * Math.sin(angle - Math.PI / 2);
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.clip();
                    }

                    // Draw image
                    let dw, dh, dx, dy;
                    const standardSize = 200 * scale;

                    if (el.maskShape === 'none' || !el.maskShape) {
                        // Original aspect ratio
                        if (imgRatio > 1) {
                            dw = standardSize;
                            dh = standardSize / imgRatio;
                        } else {
                            dh = standardSize;
                            dw = standardSize * imgRatio;
                        }
                        dx = -dw / 2;
                        dy = -dh / 2;
                    } else {
                        // Square box (cover logic) for all shapes including 'square'
                        if (imgRatio > 1) {
                            dh = standardSize;
                            dw = standardSize * imgRatio;
                            dx = -dw / 2;
                            dy = -standardSize / 2;
                        } else {
                            dw = standardSize;
                            dh = standardSize / imgRatio;
                            dx = -standardSize / 2;
                            dy = -dh / 2;
                        }
                    }

                    if (el.filters) {
                        ctx.filter = [
                            el.filters.brightness !== undefined ? `brightness(${el.filters.brightness})` : '',
                            el.filters.contrast !== undefined ? `contrast(${el.filters.contrast})` : '',
                            el.filters.saturate !== undefined ? `saturate(${el.filters.saturate})` : '',
                            el.filters.grayscale !== undefined ? `grayscale(${el.filters.grayscale})` : '',
                            el.filters.sepia !== undefined ? `sepia(${el.filters.sepia})` : '',
                            el.filters.blur !== undefined ? `blur(${el.filters.blur * scale}px)` : '',
                        ].join(' ');
                    }

                    if (el.color) {
                        const tCanvas = document.createElement('canvas');
                        tCanvas.width = img.width; tCanvas.height = img.height;
                        const tCtx = tCanvas.getContext('2d')!;
                        tCtx.fillStyle = el.color; tCtx.fillRect(0, 0, img.width, img.height);
                        tCtx.globalCompositeOperation = 'destination-in'; tCtx.drawImage(img, 0, 0);
                        ctx.drawImage(tCanvas, dx, dy, dw, dh);
                    } else {
                        ctx.drawImage(img, dx, dy, dw, dh);
                    }
                    ctx.filter = 'none';
                }
                ctx.restore();
            }

            const mCanvas = document.createElement('canvas');
            mCanvas.width = res; mCanvas.height = res;
            const mCtx = mCanvas.getContext('2d')!;
            mCtx.translate(res, 0); mCtx.scale(-1, 1);
            mCtx.drawImage(canvas, 0, 0);

            const blob = await new Promise<Blob | null>(r => mCanvas.toBlob(r, 'image/jpeg', 0.9));
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            if (viewer.model) {
                const tex = await viewer.createTexture(url);
                const mat = viewer.model.materials[0];
                if (mat?.pbrMetallicRoughness) mat.pbrMetallicRoughness.baseColorTexture.setTexture(tex);
                URL.revokeObjectURL(url);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (viewMode === '3d') {
            const timer = setTimeout(update3DTexture, 500);
            return () => clearTimeout(timer);
        }
    }, [elements, background, size, orientation, viewMode]);

    return { update3DTexture };
}
