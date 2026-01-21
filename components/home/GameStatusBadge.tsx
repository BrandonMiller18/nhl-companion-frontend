import { GameResponse, GameStatus } from '@/types/api';
import { formatGameTime } from '@/lib/utils';

interface GameStatusBadgeProps {
  gameStatus: GameStatus;
  game?: GameResponse;
  teamId: number;
  timezone: string;
}

export default function GameStatusBadge({ gameStatus, game, teamId, timezone }: GameStatusBadgeProps) {
  if (gameStatus === 'live' && game) {
    return (
      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold text-center">
        <div>🔴 LIVE</div>
        {game.gamePeriod && (
          <div className="text-xs mt-1">
            Period {game.gamePeriod} - {game.gameClock}
          </div>
        )}
      </div>
    );
  }

  if (gameStatus === 'upcoming' && game) {
    return (
      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold text-center">
        <div className="text-sm mt-1">
          🏒 Puck Drop: {formatGameTime(game.gameDateTimeUtc, timezone)}
        </div>
      </div>
    );
  }

  if (gameStatus === 'completed' && game) {
    const isHomeTeam = game.gameHomeTeamId === teamId;
    const teamScore = isHomeTeam ? game.gameHomeScore : game.gameAwayScore;
    const opponentScore = isHomeTeam ? game.gameAwayScore : game.gameHomeScore;

    return (
      <div className="bg-green-800 text-white px-3 py-1 rounded-full text-sm font-semibold text-center">
        <div>✓ Final</div>
        <div className="text-sm mt-1">
          {teamScore} - {opponentScore}
        </div>
      </div>
    );
  }

  return null;
}

