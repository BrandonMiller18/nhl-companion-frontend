// ============================================================================
// API Response Models
// ============================================================================

export interface TeamResponse {
  teamId: number;
  teamName: string;
  teamCity: string | null;
  teamAbbrev: string | null;
  teamIsActive: boolean;
  teamLogoUrl: string | null;
}

export interface PlayerResponse {
  playerId: number;
  playerTeamId: number | null;
  playerFirstName: string;
  playerLastName: string;
  playerNumber: number | null;
  playerPosition: string | null;
  playerHeadshotUrl: string | null;
  playerHomeCity: string | null;
  playerHomeCountry: string | null;
}

export interface GameResponse {
  gameId: number;
  gameSeason: number;
  gameType: number;
  gameDateTimeUtc: string;
  gameVenue: string | null;
  gameHomeTeamId: number;
  gameAwayTeamId: number;
  gameState: string;
  gamePeriod: number | null;
  gameClock: string | null;
  gameHomeScore: number;
  gameAwayScore: number;
  gameHomeSOG: number;
  gameAwaySOG: number;
  homeTeamName: string | null;
  homeTeamAbbrev: string | null;
  awayTeamName: string | null;
  awayTeamAbbrev: string | null;
}

export interface PlayResponse {
  playId: number;
  playGameId: number;
  playIndex: number;
  playTeamId: number | null;
  playPrimaryPlayerId: number | null;
  playLosingPlayerId: number | null;
  playSecondaryPlayerId: number | null;
  playTertiaryPlayerId: number | null;
  playPeriod: number;
  playTime: string;
  playTimeReamaining: string;
  playType: string;
  playZone: number | null;
  playXCoord: number | null;
  playYCoord: number | null;
}

export interface GameDetailResponse {
  game: GameResponse;
  plays: PlayResponse[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface ErrorResponse {
  detail: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

// ============================================================================
// Local Types
// ============================================================================

export type GameStatus = 'live' | 'upcoming' | 'completed' | 'none';

export interface TeamWithStatus extends TeamResponse {
  gameStatus: GameStatus;
  game?: GameResponse;
}

export interface LiveGameConfig {
  pollingFrequency: number;
  enableAudio: boolean;
  enableWebhooks: boolean;
  webhookUrl?: string;
}

