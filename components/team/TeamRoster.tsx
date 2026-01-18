import { PlayerResponse } from '@/types/api';
import PlayerCard from './PlayerCard';

interface TeamRosterProps {
  players: PlayerResponse[];
}

export default function TeamRoster({ players }: TeamRosterProps) {
  const activePlayers = players.filter(player => player.playerIsActive === 1);

  return (
    <div className="bg-white/5 border rounded-lg shadow-lg p-8 mt-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Roster</h2>
      
      {activePlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePlayers.map(player => (
            <PlayerCard key={player.playerId} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No roster information available</p>
        </div>
      )}
    </div>
  );
}

