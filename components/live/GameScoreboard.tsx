import { GameResponse } from '@/types/api';
import GameStateBadge from './GameStateBadge';

interface GameScoreboardProps {
  gameData: GameResponse;
  scoreChangeAnimation: 'home' | 'away' | null;
}

export default function GameScoreboard({ gameData, scoreChangeAnimation }: GameScoreboardProps) {
  return (
    <div className="bg-white/5 text-white rounded-lg shadow-2xl p-8 mb-6 border">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Live Game</h1>
        <GameStateBadge gameState={gameData.gameState} />
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-3 gap-8 items-center text-center">
        {/* Home Team */}
        <div className="space-y-2">
          <p className="text-xl font-semibold text-white">{gameData.homeTeamAbbrev}</p>
          <p className={`text-6xl font-bold text-white transition-all duration-500 ${
            scoreChangeAnimation === 'home' ? 'scale-125 text-green-400' : ''
          }`}>
            {gameData.gameHomeScore}
          </p>
          <p className="text-sm text-white/70">Home</p>
        </div>

        {/* Period & Clock */}
        <div className="space-y-2">
          {gameData.gamePeriod !== null && (
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white/70">
                Period {gameData.gamePeriod}
              </p>
              {gameData.gameClock && (
                <p className="text-xl font-bold text-red-400 transition-all duration-300">
                  {gameData.gameClock}
                </p>
              )}
            </div>
          )}
          <p className="text-sm text-white/70">
            SOG: {gameData.gameHomeSOG} - {gameData.gameAwaySOG}
          </p>
        </div>

        {/* Away Team */}
        <div className="space-y-2">
          <p className="text-xl font-semibold text-white">{gameData.awayTeamAbbrev}</p>
          <p className={`text-6xl font-bold text-white transition-all duration-500 ${
            scoreChangeAnimation === 'away' ? 'scale-125 text-green-400' : ''
          }`}>
            {gameData.gameAwayScore}
          </p>
          <p className="text-sm text-white/70">Away</p>
        </div>
      </div>

      {/* Game Info */}
      <div className="mt-6 pt-6 border-t border-white/70 text-center text-sm text-white/50">
        <p>{gameData.gameVenue}</p>
        <p className="mt-1">Game ID: {gameData.gameId}</p>
      </div>
    </div>
  );
}

