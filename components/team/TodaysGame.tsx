import { GameResponse } from '@/types/api';
import GameStatusBadge from './GameStatusBadge';
import GameMatchup from './GameMatchup';
import GameDetails from './GameDetails';

interface TodaysGameProps {
  game: GameResponse | null;
  teamId: number;
  teamAbbrev: string;
  timezone: string;
  isTestMode: boolean;
  onWatchGame: () => void;
}

export default function TodaysGame({
  game,
  teamId,
  teamAbbrev,
  timezone,
  isTestMode,
  onWatchGame,
}: TodaysGameProps) {
  if (!game) {
    return (
      <div className="bg-white/5 border rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Today&apos;s Game</h2>
        <div className="text-center py-8">
          <p className="text-xl text-white/70 italic">No game scheduled today</p>
        </div>
      </div>
    );
  }

  const isHomeTeam = game.gameHomeTeamId === teamId;
  const opponentAbbrev = isHomeTeam ? game.awayTeamAbbrev : game.homeTeamAbbrev;
  const homeTeamAbbrev = isHomeTeam ? teamAbbrev : opponentAbbrev;
  const awayTeamAbbrev = isHomeTeam ? opponentAbbrev : teamAbbrev;
  const homeScore = game.gameHomeScore;
  const awayScore = game.gameAwayScore;

  const canWatchGame = 
    game.gameState === 'LIVE' || 
    game.gameState === 'CRIT' || 
    game.gameState === 'FUT' || 
    isTestMode;

  return (
    <div className="bg-white/5 border rounded-lg shadow-lg p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Today&apos;s Game</h2>

      <div className="space-y-6">
        {/* Game Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">Status:</span>
            <GameStatusBadge gameState={game.gameState} />
          </div>
          
          {/* Watch Game Button */}
          {canWatchGame && (
            <button
              onClick={onWatchGame}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors hover:cursor-pointer"
            >
              Watch Game
            </button>
          )}
        </div>

        {/* Matchup */}
        <GameMatchup
          homeTeamAbbrev={homeTeamAbbrev || ''}
          homeScore={homeScore}
          awayTeamAbbrev={awayTeamAbbrev || ''}
          awayScore={awayScore}
        />

        {/* Game Details */}
        <GameDetails
          game={game}
          timezone={timezone}
          isHomeTeam={isHomeTeam}
          teamAbbrev={teamAbbrev}
          opponentAbbrev={opponentAbbrev || ''}
        />
      </div>
    </div>
  );
}

