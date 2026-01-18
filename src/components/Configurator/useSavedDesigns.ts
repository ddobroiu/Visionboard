'use client';

import { useState, useEffect } from 'react';

export function useSavedDesigns() {
    const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDesigns = async (isPublic = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/designs?public=${isPublic}`);
            if (!res.ok) throw new Error('Failed to fetch designs');
            const data = await res.json();
            setSavedDesigns(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { savedDesigns, isLoading, error, fetchDesigns };
}
