import { PlayResponse, PlayerResponse } from '@/types/api';
import PlayCard from './PlayCard';

interface PlayFeedProps {
  plays: PlayResponse[];
  newPlayIds: Set<number>;
  playerCache: Map<number, PlayerResponse>;
}

export default function PlayFeed({ plays, newPlayIds, playerCache }: PlayFeedProps) {
  return (
    <div className="bg-white/5 rounded-lg shadow-2xl p-8 border">
      <h2 className="text-2xl font-bold mb-6 text-white">Major Events</h2>
      
      {plays.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white scrollbar-track-gray-800/50 hover:scrollbar-thumb-white/70">
          {plays.map((play) => (
            <PlayCard
              key={play.playId}
              play={play}
              isNew={newPlayIds.has(play.playId)}
              playerCache={playerCache}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-gray-400">No major events yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Goals, penalties, and period changes will appear here
          </p>
        </div>
      )}
    </div>
  );
}

