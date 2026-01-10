import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8001';
const API_BEARER_TOKEN = process.env.API_BEARER_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;

    const url = `${API_BASE_URL}/api/games/${gameId}`;
    console.log(`[Game Detail API] Fetching from: ${url}`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_BEARER_TOKEN) {
      headers['Authorization'] = `Bearer ${API_BEARER_TOKEN}`;
    }

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    console.log(`[Game Detail API] Response status: ${response.status}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error(`[Game Detail API] Error response:`, error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log(`[Game Detail API] Received game ${gameId} with ${data.plays?.length || 0} plays`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Game Detail API] Error fetching game detail:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch game detail' },
      { status: 500 }
    );
  }
}

