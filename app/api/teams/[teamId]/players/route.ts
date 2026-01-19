import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8001';
const API_BEARER_TOKEN = process.env.API_BEARER_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_BEARER_TOKEN) {
      headers['Authorization'] = `Bearer ${API_BEARER_TOKEN}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/players`, {
      headers,
      next: { revalidate: 86400 }, // 24 hours in seconds
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Error fetching team players:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch team players' },
      { status: 500 }
    );
  }
}

