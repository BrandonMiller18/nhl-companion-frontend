import { PlayResponse, PlayerResponse } from '@/types/api';
import { formatPlayDescription } from '@/lib/utils';
import PlayerInfo from './PlayerInfo';

interface PlayCardProps {
  play: PlayResponse;
  isNew: boolean;
  playerCache: Map<number, PlayerResponse>;
}

export default function PlayCard({ play, isNew, playerCache }: PlayCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-250 transform ${
        isNew
          ? 'bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 border-yellow-500 shadow-lg shadow-yellow-500/20 scale-105 animate-pulse'
          : 'bg-white/5 border-white/70 hover:bg-white/10 hover:border-white/10'
      }`}
    >
      <div className="flex flex-col items-start">
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between w-full">
          <div className="font-semibold text-white flex-1 flex items-center justify-between">
            
            <p className="text-white text-sm sm:text-lg">{formatPlayDescription(play)}</p>
            
          </div>
          <div className="md:min-w-70">{play.playPrimaryPlayerId && (
              <PlayerInfo playerId={play.playPrimaryPlayerId} playerCache={playerCache} />
            )}</div>
        </div>
        
        {!play.playType.includes('period') && !play.playType.includes('end') && (
          <p className="text-sm text-gray-400 mt-3 md:mt-1 ml-1">
            {'Period ' + play.playPeriod + ' - ' + play.playTimeReamaining + ' remaining'}          
          </p>
        )}

        {isNew && (
          <span className="ml-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded animate-bounce">
            NEW
          </span>
        )}
      </div>
    </div>
  );
}

