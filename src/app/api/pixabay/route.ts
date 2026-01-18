import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const transparent = searchParams.get('transparent') === 'true';
    const orientation = searchParams.get('orientation') || 'all';
    const apiKey = process.env.PIXABAY_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Pixabay API key not configured' }, { status: 500 });
    }

    if (!query) {
        return NextResponse.json({ hits: [] });
    }

    const transparentParam = transparent ? '&colors=transparent' : '';
    const orientationParam = orientation !== 'all' ? `&orientation=${orientation}` : '';

    try {
        // Try Romanian search first as the site is in Romanian
        const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=100&safesearch=true&lang=ro${transparentParam}${orientationParam}`);
        let data = await response.json();

        // If no results in Romanian, try English search as a fallback
        if (!data.hits || data.hits.length === 0) {
            const fallbackResponse = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=100&safesearch=true${transparentParam}${orientationParam}`);
            data = await fallbackResponse.json();
        }

        // Return only the necessary fields to the client
        const formattedHits = (data.hits || []).map((hit: any) => ({
            id: hit.id.toString(),
            url: hit.webformatURL,
            preview: hit.previewURL,
            tags: hit.tags
        }));

        return NextResponse.json({ hits: formattedHits });
    } catch (error) {
        console.error('Pixabay search error:', error);
        return NextResponse.json({ error: 'Failed to fetch images from Pixabay' }, { status: 500 });
    }
}
