import { GameResponse, GameStatus } from '@/types/api';

const TIMEZONE_STORAGE_KEY = 'nhl-companion-timezone';

/**
 * Returns today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets the user's timezone from the browser
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Error detecting timezone:', error);
    return 'America/New_York'; // Default to Eastern
  }
}

/**
 * Formats a UTC datetime string to 12-hour format in the specified timezone
 * @param utcDateTimeString - ISO datetime string in UTC (e.g., "2024-01-15T19:00:00" or "2024-01-15T19:00:00Z")
 * @param timezone - IANA timezone string (e.g., "America/New_York")
 * @returns Formatted time string (e.g., "7:00 PM")
 */
export function formatGameTime(utcDateTimeString: string, timezone: string): string {
  try {
    // Ensure the datetime string is treated as UTC by appending 'Z' if not present
    let dateString = utcDateTimeString;
    if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('T00:00:00-')) {
      dateString = dateString + 'Z';
    }
    
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting game time:', error);
    return 'TBD';
  }
}

/**
 * Gets the timezone offset display (e.g., "EST", "PST")
 * @param timezone - IANA timezone string
 * @returns Short timezone abbreviation
 */
export function getTimezoneAbbreviation(timezone: string): string {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    return timeZonePart?.value || timezone;
  } catch (error) {
    console.error('Error getting timezone abbreviation:', error);
    return timezone;
  }
}

/**
 * Saves the user's timezone preference to localStorage
 */
export function saveTimezonePreference(timezone: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TIMEZONE_STORAGE_KEY, timezone);
  }
}

/**
 * Loads the user's timezone preference from localStorage
 * Returns null if not set
 */
export function loadTimezonePreference(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TIMEZONE_STORAGE_KEY);
  }
  return null;
}

/**
 * Determines the game status for a team given an array of games
 * @param teamId - The team ID to check
 * @param games - Array of games to search through
 * @returns The game status: 'live', 'upcoming', 'completed', or 'none'
 */
export function getTeamGameStatus(teamId: number, games: GameResponse[]): GameStatus {
  const teamGame = findTeamGame(teamId, games);
  
  if (!teamGame) {
    return 'none';
  }
  
  const state = teamGame.gameState;
  
  if (state === 'LIVE' || state === 'CRIT') {
    return 'live';
  }
  
  if (state === 'FUT' || state === 'PRE') {
    return 'upcoming';
  }
  
  if (state === 'FINAL' || state === 'OFF') {
    return 'completed';
  }
  
  return 'none';
}

/**
 * Finds today's game for a specific team
 * @param teamId - The team ID to find a game for
 * @param games - Array of games to search through
 * @returns The game if found, undefined otherwise
 */
export function findTeamGame(teamId: number, games: GameResponse[]): GameResponse | undefined {
  return games.find(
    game => game.gameHomeTeamId === teamId || game.gameAwayTeamId === teamId
  );
}

/**
 * Gets the full team name (City + Name)
 * @param teamCity - The team's city
 * @param teamName - The team's name
 * @returns The full team name
 */
export function getFullTeamName(teamCity: string | null, teamName: string): string {
  if (teamCity) {
    return `${teamCity} ${teamName}`;
  }
  return teamName;
}

/**
 * Formats player position abbreviations
 * @param position - The position code (e.g., 'L', 'R', 'C', 'D', 'G')
 * @returns Formatted position string
 */
export function formatPlayerPosition(position: string | null): string {
  if (!position) return 'N/A';
  
  const positionMap: { [key: string]: string } = {
    'L': 'Left Wing',
    'R': 'Right Wing',
    'C': 'Center',
    'D': 'Defense',
    'G': 'Goalie',
  };
  
  return positionMap[position.toUpperCase()] || position;
}

/**
 * Checks if a play type is a major event (goal, penalty, or period change)
 * @param playType - The play type string
 * @returns True if the play is a major event
 */
export function isMajorPlay(playType: string): boolean {
  const majorPlayTypes = [
    'goal',
    'penalty',
    'period-start',
    'period-end',
    'period-official',
    'game-end',
  ];
  
  return majorPlayTypes.some(type => 
    playType.toLowerCase() === type.toLowerCase()
  );
}

/**
 * Formats a play into a human-readable description
 * @param play - The play response object
 * @returns Formatted play description string
 */
export function formatPlayDescription(play: any): string {
  const playType = play.playType || 'Unknown';
  const period = play.playPeriod;
  const time = play.playTime || 'Unknown';
  
  // Basic format: "Period X - Time: Play Type"
  let description = `Period ${period} - ${time}: ${playType}`;
  
  // Add more context based on play type
  if (playType.toLowerCase().includes('goal')) {
    description = `🚨 GOAL! - Period ${period} at ${time}`;
  } else if (playType.toLowerCase().includes('penalty')) {
    description = `⚠️ Penalty - Period ${period} at ${time}`;
  } else if (playType.toLowerCase().includes('period-start')) {
    description = `🏒 Period ${period} Started`;
  } else if (playType.toLowerCase().includes('period-end')) {
    description = `⏱️ Period ${period} Ended`;
  } else if (playType.toLowerCase().includes('game-end')) {
    description = `🏁 Game Ended`;
  }
  
  return description;
}


export function formatGameDisplayPeriod(period: number, inIntermission: boolean): number | string {
  
  if (!inIntermission && period == 1) {
    return '1st Period';
  }
  if (!inIntermission && period == 2) {
    return '2nd Period';
  }
  if (!inIntermission && period == 3) {
    return '3rd Period';
  }
  
  if (inIntermission && period == 1) {
    return '1st Intermission';
  }
  if (inIntermission && period == 2) {
    return '2nd Intermission';
  }
  if (inIntermission && period == 3) {
    return 'End of Reg';
  }

  return 'OT';
}



/**
 * Validates a webhook URL (must be HTTPS)
 * @param url - The URL to validate
 * @returns True if the URL is valid HTTPS
 */
export function validateWebhookUrl(url: string): boolean {
  if (!url || url.trim() === '') {
    return false;
  }
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

