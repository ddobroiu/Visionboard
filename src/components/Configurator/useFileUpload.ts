'use client';

import { useRef, useState } from 'react';

export function useFileUpload(
    setUploadedImages: (fn: (prev: string[]) => string[]) => void,
    setPixabayResults: (res: any[]) => void,
    setActiveTool: (tool: string | null) => void,
    setBackground: (bg: string) => void
) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bgFileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                setUploadedImages(prev => [url, ...prev]);
                setPixabayResults([]); // Close search results to show uploads
                setActiveTool('upload'); // Open library to show the upload
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBgUploadClick = () => {
        bgFileInputRef.current?.click();
    };

    const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                setBackground(url);
            };
            reader.readAsDataURL(file);
        }
    };

    return {
        fileInputRef,
        bgFileInputRef,
        handleUploadClick,
        handleFileChange,
        handleBgUploadClick,
        handleBgFileChange
    };
}
