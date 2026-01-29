import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8001';
const API_BEARER_TOKEN = process.env.API_BEARER_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const timezone = searchParams.get('timezone');

    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (timezone) params.append('timezone', timezone);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_BASE_URL}/api/games?${queryString}`
      : `${API_BASE_URL}/api/games`;

    console.log(`[Games API] Fetching from: ${url}`);
    const fetchStart = Date.now();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_BEARER_TOKEN) {
      headers['Authorization'] = `Bearer ${API_BEARER_TOKEN}`;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 10 }, // 1 minute in seconds
    });

    const fetchDuration = Date.now() - fetchStart;
    console.log(`[Games API] Response status: ${response.status}, fetch duration: ${fetchDuration}ms`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error(`[Games API] Error response:`, error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log(`[Games API] Received ${Array.isArray(data) ? data.length : 'non-array'} games`);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('[Games API] Error fetching games:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

