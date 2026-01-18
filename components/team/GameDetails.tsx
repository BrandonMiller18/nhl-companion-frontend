import { GameResponse } from '@/types/api';
import { formatGameTime } from '@/lib/utils';

interface GameDetailsProps {
  game: GameResponse;
  timezone: string;
  isHomeTeam: boolean;
  teamAbbrev: string;
  opponentAbbrev: string;
}

export default function GameDetails({
  game,
  timezone,
  isHomeTeam,
  teamAbbrev,
  opponentAbbrev,
}: GameDetailsProps) {
  return (
    <div className="border-t pt-6 space-y-3">
      <h3 className="text-xl font-semibold mb-4">Game Details</h3>
      
      {game.gameVenue && (
        <div className="flex gap-2">
          <span className="font-semibold">Venue:</span>
          <span>{game.gameVenue}</span>
        </div>
      )}

      <div className="flex gap-2">
        <span className="font-semibold">Game ID:</span>
        <span>{game.gameId}</span>
      </div>

      {game.gamePeriod !== null && (
        <div className="flex gap-2">
          <span className="font-semibold">Period:</span>
          <span>{game.gamePeriod}</span>
        </div>
      )}

      {game.gameClock && (
        <div className="flex gap-2">
          <span className="font-semibold">Clock:</span>
          <span>{game.gameClock}</span>
        </div>
      )}

      <div className="flex gap-2">
        <span className="font-semibold">Shots on Goal:</span>
        <span>
          {isHomeTeam ? teamAbbrev : opponentAbbrev}: {isHomeTeam ? game.gameHomeSOG : game.gameAwaySOG}
          {' | '}
          {isHomeTeam ? opponentAbbrev : teamAbbrev}: {isHomeTeam ? game.gameAwaySOG : game.gameHomeSOG}
        </span>
      </div>

      <div className="flex gap-2">
        <span className="font-semibold">Game Time:</span>
        <span>{formatGameTime(game.gameDateTimeUtc, timezone)}</span>
      </div>
    </div>
  );
}

