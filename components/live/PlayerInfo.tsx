import { useEffect, useState } from 'react';
import { getPlayerById } from '@/lib/api-client';
import { PlayerResponse } from '@/types/api';
import { formatPlayerPosition } from '@/lib/utils';
import Image from 'next/image';

interface PlayerInfoProps {
  playerId: number | null;
  playerCache: Map<number, PlayerResponse>;
}

export default function PlayerInfo({ playerId, playerCache }: PlayerInfoProps) {
  const [player, setPlayer] = useState<PlayerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) {
      setPlayer(null);
      return;
    }

    // Check cache
    if (playerCache.has(playerId)) {
      setPlayer(playerCache.get(playerId)!);
      return;
    }

    // Fetch player data
    setLoading(true);
    getPlayerById(playerId)
      .then(data => {
        setPlayer(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Failed to fetch player ${playerId}:`, err);
        setLoading(false);
      });
  }, [playerId, playerCache]);

  if (!playerId) return null;
  if (loading) {
    return (
      <div className="flex items-center gap-3 mt-2">
        <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    );
  }
  if (!player) return null;

  return (
    <div className="flex items-center gap-3 md:mt-3 pt-3">
      {player.playerHeadshotUrl ? (
        <Image
          src={player.playerHeadshotUrl}
          alt={`${player.playerFirstName} ${player.playerLastName}`}
          className="w-12 h-12 rounded-full bg-white/5 object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none';
          }}
          width={25}
          height={25}
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/50 font-bold">
          {player.playerFirstName[0]}{player.playerLastName[0]}
        </div>
      )}
      <div className="flex-1">
        <p className="text-white font-medium">
          {player.playerFirstName} {player.playerLastName}
          {player.playerNumber && (
            <span className="ml-2 text-white/70">#{player.playerNumber}</span>
          )}
        </p>
        {player.playerPosition && (
          <p className="text-xs text-white/50">{formatPlayerPosition(player.playerPosition)}</p>
        )}
      </div>
    </div>
  );
}

