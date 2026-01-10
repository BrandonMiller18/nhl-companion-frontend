import { GameResponse, PlayResponse } from '@/types/api';

/**
 * Simulates game changes for test mode
 * This function randomly updates scores, advances the clock, and generates new plays
 * to simulate a live game environment for testing purposes.
 */
export function simulateGameChanges(
  game: GameResponse,
  playsList: PlayResponse[],
  gameId: number
): { game: GameResponse; playsList: PlayResponse[] } {
  // Randomly update scores (20% chance each poll)
  const updatedGame = { ...game };
  if (Math.random() < 0.2) {
    if (Math.random() < 0.5) {
      updatedGame.gameHomeScore += 1;
    } else {
      updatedGame.gameAwayScore += 1;
    }
  }

  // Simulate period progression
  if (updatedGame.gamePeriod === null) {
    updatedGame.gamePeriod = 1;
    updatedGame.gameClock = '20:00';
  } else {
    // Randomly advance clock
    const [mins, secs] = (updatedGame.gameClock || '20:00').split(':').map(Number);
    let totalSecs = mins * 60 + secs - Math.floor(Math.random() * 30);
    if (totalSecs < 0) {
      totalSecs = 1200; // Reset to 20:00
      updatedGame.gamePeriod = Math.min(updatedGame.gamePeriod + 1, 3);
    }
    const newMins = Math.floor(totalSecs / 60);
    const newSecs = totalSecs % 60;
    updatedGame.gameClock = `${newMins}:${newSecs.toString().padStart(2, '0')}`;
  }

  // Simulate new plays (30% chance)
  const updatedPlays = [...playsList];
  if (Math.random() < 0.3) {
    const playTypes = ['goal', 'penalty'];
    const randomType = playTypes[Math.floor(Math.random() * playTypes.length)];
    const newPlay: PlayResponse = {
      playId: Date.now() + Math.random(),
      playGameId: gameId,
      playIndex: updatedPlays.length,
      playTeamId: Math.random() < 0.5 ? game.gameHomeTeamId : game.gameAwayTeamId,
      playPrimaryPlayerId: null,
      playLosingPlayerId: null,
      playSecondaryPlayerId: null,
      playTertiaryPlayerId: null,
      playPeriod: updatedGame.gamePeriod || 1,
      playTime: updatedGame.gameClock || '20:00',
      playTimeReamaining: updatedGame.gameClock || '20:00',
      playType: randomType,
      playZone: null,
      playXCoord: null,
      playYCoord: null,
    };
    updatedPlays.push(newPlay);
  }

  // Set game to LIVE if not already
  if (updatedGame.gameState !== 'LIVE') {
    updatedGame.gameState = 'LIVE';
  }

  return { game: updatedGame, playsList: updatedPlays };
}

