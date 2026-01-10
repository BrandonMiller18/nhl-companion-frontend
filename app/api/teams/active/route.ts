import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8001';
const API_BEARER_TOKEN = process.env.API_BEARER_TOKEN;

export async function GET() {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_BEARER_TOKEN) {
      headers['Authorization'] = `Bearer ${API_BEARER_TOKEN}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/teams/active`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching active teams:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch active teams' },
      { status: 500 }
    );
  }
}

