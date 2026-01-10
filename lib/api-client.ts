import {
  TeamResponse,
  GameResponse,
  GameDetailResponse,
  HealthResponse,
  ErrorResponse,
  PlayerResponse,
} from '@/types/api';

/**
 * Base fetch function for API calls
 * Calls Next.js API routes which handle server-side authentication
 * Works in both client and server components
 */
async function apiFetch<T>(endpoint: string): Promise<T> {
  // Determine if we're on the server or client
  const isServer = typeof window === 'undefined';
  
  // On the server, use full URL to localhost
  // On the client, use relative URL
  const baseUrl = isServer ? 'http://localhost:3000' : '';
  const url = `${baseUrl}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store', // Disable caching for real-time data
    });
    
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        detail: 'An unexpected error occurred',
      }));
      
      if (response.status === 401) {
        throw new Error('Authentication failed: Invalid or missing bearer token');
      } else if (response.status === 404) {
        throw new Error(errorData.detail || 'Resource not found');
      } else if (response.status === 422) {
        throw new Error(errorData.detail || 'Invalid request parameters');
      } else if (response.status === 500) {
        throw new Error('Server error: Please try again later');
      } else {
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error: Unable to connect to API');
  }
}

/**
 * Get all active NHL teams
 * Calls Next.js API route which proxies to backend with authentication
 */
export async function getActiveTeams(): Promise<TeamResponse[]> {
  return apiFetch<TeamResponse[]>('/api/teams/active');
}

/**
 * Get games for a specific date in a timezone
 * Calls Next.js API route which proxies to backend with authentication
 * @param date - Optional date in YYYY-MM-DD format. If not provided, returns today's games.
 * @param timezone - Optional IANA timezone string (e.g., 'America/New_York'). Defaults to Eastern if not provided.
 */
export async function getGamesByDate(date?: string, timezone?: string): Promise<GameResponse[]> {
  const params = new URLSearchParams();
  
  if (date) {
    params.append('date', date);
  }
  
  if (timezone) {
    params.append('timezone', timezone);
  }
  
  const queryString = params.toString();
  const endpoint = queryString ? `/api/games?${queryString}` : '/api/games';
  
  return apiFetch<GameResponse[]>(endpoint);
}

/**
 * Get all players for a specific team
 * Calls Next.js API route which proxies to backend with authentication
 * @param teamId - The team ID
 */
export async function getTeamPlayers(teamId: number): Promise<PlayerResponse[]> {
  return apiFetch<PlayerResponse[]>(`/api/teams/${teamId}/players`);
}

/**
 * Get game details with play-by-play data
 * Calls Next.js API route which proxies to backend with authentication
 * @param gameId - The game ID
 */
export async function getGameDetail(gameId: number): Promise<GameDetailResponse> {
  return apiFetch<GameDetailResponse>(`/api/games/${gameId}`);
}

/**
 * Get player details by player ID
 * Calls Next.js API route which proxies to backend with authentication
 * @param playerId - The player ID
 */
export async function getPlayerById(playerId: number): Promise<PlayerResponse> {
  return apiFetch<PlayerResponse>(`/api/players/${playerId}`);
}

