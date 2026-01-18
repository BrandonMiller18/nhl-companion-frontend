import Image from 'next/image';
import { PlayerResponse } from '@/types/api';
import { formatPlayerPosition } from '@/lib/utils';

interface PlayerCardProps {
  player: PlayerResponse;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Player Headshot */}
        {player.playerHeadshotUrl ? (
          <Image
            src={player.playerHeadshotUrl}
            alt={`${player.playerFirstName} ${player.playerLastName}`}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white/70">
              {player.playerNumber || '?'}
            </span>
          </div>
        )}
        
        {/* Player Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg">
                {player.playerFirstName} {player.playerLastName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
                <span className="font-semibold">#{player.playerNumber || 'N/A'}</span>
                <span>•</span>
                <span>{formatPlayerPosition(player.playerPosition)}</span>
              </div>
            </div>
          </div>
          
          {/* Hometown */}
          {(player.playerHomeCity || player.playerHomeCountry) && (
            <div className="text-sm text-white/70 mt-2">
              {player.playerHomeCity && player.playerHomeCountry 
                ? `${player.playerHomeCity}, ${player.playerHomeCountry}`
                : player.playerHomeCity || player.playerHomeCountry}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

