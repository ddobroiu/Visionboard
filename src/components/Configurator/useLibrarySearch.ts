'use client';

import { useState, useEffect } from 'react';
import { LibraryCategory } from '@/lib/libraryAssets';

export function useLibrarySearch(activeTool: string | null) {
    // Pixabay Search State
    const [pixabayQuery, setPixabayQuery] = useState('');
    const [pixabayResults, setPixabayResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pixabayTransparent, setPixabayTransparent] = useState(false);
    const [pixabayOrientation, setPixabayOrientation] = useState<string>('all');
    const [pixabayPage, setPixabayPage] = useState(1);
    const [pixabayError, setPixabayError] = useState<string | null>(null);

    // Vector Search State
    const [vectorQuery, setVectorQuery] = useState('');
    const [vectorResults, setVectorResults] = useState<any[]>([]);
    const [isSearchingVectors, setIsSearchingVectors] = useState(false);
    const [vectorPage, setVectorPage] = useState(1);
    const [vectorError, setVectorError] = useState<string | null>(null);

    const [activeLibraryCategory, setActiveLibraryCategory] = useState<LibraryCategory>('masini');

    const performPixabaySearch = async (query: string, isLoadMore = false, pageNum = 1, type = 'photo') => {
        if (!query) return;

        const setter = type === 'vector' ? setVectorResults : setPixabayResults;
        const loadingSetter = type === 'vector' ? setIsSearchingVectors : setIsSearching;
        const errorSetter = type === 'vector' ? setVectorError : setPixabayError;

        loadingSetter(true);
        errorSetter(null);
        if (!isLoadMore) setter([]); // Show loading state by clearing results

        try {
            const res = await fetch(`/api/pixabay?q=${encodeURIComponent(query)}&transparent=${type === 'vector' ? 'true' : pixabayTransparent}&orientation=${pixabayOrientation}&page=${pageNum}&type=${type}`);
            const data = await res.json();

            if (data.error) {
                errorSetter(data.error);
                return;
            }

            if (data.hits) {
                if (data.hits.length === 0 && isLoadMore) {
                    errorSetter("Nu mai sunt rezultate de afișat.");
                } else {
                    if (isLoadMore) {
                        setter(prev => [...prev, ...data.hits]);
                    } else {
                        setter(data.hits);
                        if (data.hits.length === 0) {
                            errorSetter(`Nu am găsit rezultate pentru "${query}"`);
                        }
                    }
                }
                if (type === 'photo') setActiveLibraryCategory('search' as any);
            }
        } catch (error) {
            console.error('Search error:', error);
            errorSetter("Eroare la comunicarea cu serverul.");
        } finally {
            loadingSetter(false);
        }
    };

    const handleVectorSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setVectorPage(1);
        performPixabaySearch(vectorQuery, false, 1, 'vector');
    };

    const handleLoadMoreVectors = () => {
        const nextPage = vectorPage + 1;
        setVectorPage(nextPage);
        performPixabaySearch(vectorQuery, true, nextPage, 'vector');
    };

    const handleLoadMore = () => {
        const nextPage = pixabayPage + 1;
        setPixabayPage(nextPage);
        performPixabaySearch(pixabayQuery, true, nextPage);
    };

    const handlePixabaySearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setPixabayPage(1);
        performPixabaySearch(pixabayQuery, false, 1);
    };

    // Auto-search when transparency or orientation filter changes
    useEffect(() => {
        if (pixabayQuery) {
            setPixabayPage(1);
            performPixabaySearch(pixabayQuery, false, 1);
        }
    }, [pixabayTransparent, pixabayOrientation]);

    // Initial search for vectors when Elements tool is opened
    useEffect(() => {
        if (activeTool === 'elements' && vectorResults.length === 0 && !vectorQuery) {
            const defaultQuery = 'abstract design';
            setVectorQuery(defaultQuery);
            performPixabaySearch(defaultQuery, false, 1, 'vector');
        }
    }, [activeTool]);

    return {
        pixabayQuery, setPixabayQuery,
        pixabayResults, isSearching,
        pixabayTransparent, setPixabayTransparent,
        pixabayOrientation, setPixabayOrientation,
        pixabayPage, setPixabayPage,
        pixabayError,
        vectorQuery, setVectorQuery,
        vectorResults, isSearchingVectors,
        vectorPage, setVectorPage,
        vectorError,
        activeLibraryCategory, setActiveLibraryCategory,
        performPixabaySearch,
        handleVectorSearch,
        handleLoadMoreVectors,
        handleLoadMore,
        handlePixabaySearch
    };
}
