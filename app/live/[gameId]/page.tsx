'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getGameDetail, getPlayerById } from '@/lib/api-client';
import { isMajorPlay, formatPlayDescription } from '@/lib/utils';
import { simulateGameChanges } from '@/lib/game-simulation';
import { GameResponse, PlayResponse, LiveGameConfig, PlayerResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  TestModeBanner,
  MonitoringStatus,
  GameScoreboard,
  PlayFeed,
  ConfigInfo,
} from '@/components/live';

export default function LiveGamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameId = parseInt(params.gameId as string, 10);

  // Parse config from URL params
  const config: LiveGameConfig = {
    pollingFrequency: parseInt(searchParams.get('freq') || '3', 10),
    enableAudio: searchParams.get('audio') === 'true',
    enableWebhooks: searchParams.get('webhooks') === 'true',
    webhookUrl: searchParams.get('webhookUrl') || undefined,
  };
  
  // Test mode - simulates live game changes
  const isTestMode = searchParams.get('test') === 'true';

  // State
  const [gameData, setGameData] = useState<GameResponse | null>(null);
  const [plays, setPlays] = useState<PlayResponse[]>([]);
  const [majorPlays, setMajorPlays] = useState<PlayResponse[]>([]);
  const [lastPlayIndex, setLastPlayIndex] = useState<number>(-1);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPlayIds, setNewPlayIds] = useState<Set<number>>(new Set());
  const [previousHomeScore, setPreviousHomeScore] = useState<number>(0);
  const [previousAwayScore, setPreviousAwayScore] = useState<number>(0);
  const [scoreChangeAnimation, setScoreChangeAnimation] = useState<'home' | 'away' | null>(null);
  const [playerCache, setPlayerCache] = useState<Map<number, PlayerResponse>>(new Map());

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Request permissions on mount
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    // Request wake lock
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          console.log('Wake lock acquired');
          
          wakeLockRef.current.addEventListener('release', () => {
            console.log('Wake lock released');
          });
        } catch (err) {
          console.error('Failed to acquire wake lock:', err);
        }
      }
    };

    requestWakeLock();

    // Cleanup wake lock on unmount
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  // Fetch player data for a play
  const fetchPlayerData = useCallback(async (playerId: number): Promise<PlayerResponse | null> => {
    // Check cache first
    if (playerCache.has(playerId)) {
      return playerCache.get(playerId)!;
    }

    try {
      const player = await getPlayerById(playerId);
      // Update cache
      setPlayerCache(prev => new Map(prev).set(playerId, player));
      return player;
    } catch (err) {
      console.error(`Failed to fetch player ${playerId}:`, err);
      return null;
    }
  }, [playerCache]);

  // Fetch game data
  const fetchGameData = useCallback(async () => {
    try {
      const data = await getGameDetail(gameId);
      
      // Apply test mode simulation
      const { game: simulatedGame, playsList: simulatedPlays } = isTestMode
        ? simulateGameChanges(data.game, data.plays, gameId)
        : { game: data.game, playsList: data.plays };
      
      // Detect score changes for animation
      if (gameData) {
        if (simulatedGame.gameHomeScore > gameData.gameHomeScore) {
          setScoreChangeAnimation('home');
          setTimeout(() => setScoreChangeAnimation(null), 2000);
        } else if (simulatedGame.gameAwayScore > gameData.gameAwayScore) {
          setScoreChangeAnimation('away');
          setTimeout(() => setScoreChangeAnimation(null), 2000);
        }
      }
      
      setPreviousHomeScore(simulatedGame.gameHomeScore);
      setPreviousAwayScore(simulatedGame.gameAwayScore);
      setGameData(simulatedGame);
      setPlays(simulatedPlays);

      // Filter major plays
      const major = simulatedPlays.filter(play => isMajorPlay(play.playType));
      
      // Detect new plays
      const currentMaxIndex = Math.max(...simulatedPlays.map(p => p.playIndex), -1);
      if (lastPlayIndex >= 0 && currentMaxIndex > lastPlayIndex) {
        const newPlays = major.filter(play => play.playIndex > lastPlayIndex);
        
        // Add new play IDs for animation
        const newIds = new Set(newPlayIds);
        newPlays.forEach(play => newIds.add(play.playId));
        setNewPlayIds(newIds);
        
        // Remove animation after 3 seconds
        setTimeout(() => {
          setNewPlayIds(new Set());
        }, 3000);

        // Send notifications for new plays
        if ('Notification' in window && Notification.permission === 'granted') {
          newPlays.forEach(play => {
            new Notification('NHL Companion', {
              body: formatPlayDescription(play),
              icon: '/favicon.ico',
            });
          });
        }
      }
      
      setMajorPlays(major.reverse()); // Newest first
      setLastPlayIndex(currentMaxIndex);

      // Fetch player data for major plays
      const uniquePlayerIds = new Set<number>();
      major.forEach(play => {
        if (play.playPrimaryPlayerId && !playerCache.has(play.playPrimaryPlayerId)) {
          uniquePlayerIds.add(play.playPrimaryPlayerId);
        }
      });

      // Fetch all unique players in parallel
      if (uniquePlayerIds.size > 0) {
        Promise.all(
          Array.from(uniquePlayerIds).map(playerId => fetchPlayerData(playerId))
        ).catch(err => console.error('Error fetching player data:', err));
      }

      // Check if game is over (skip in test mode)
      if (!isTestMode && (simulatedGame.gameState === 'FINAL' || simulatedGame.gameState === 'OFF')) {
        setIsMonitoring(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }

      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch game data');
      console.error('Error fetching game data:', err);
      setLoading(false);
    }
  }, [gameId, lastPlayIndex, newPlayIds, isTestMode, playerCache, fetchPlayerData, gameData]);

  // Initial fetch
  useEffect(() => {
    fetchGameData();
  }, []);

  // Set up polling
  useEffect(() => {
    if (!isMonitoring) return;

    intervalRef.current = setInterval(() => {
      fetchGameData();
    }, config.pollingFrequency * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring, config.pollingFrequency, fetchGameData]);

  // Stop monitoring handler
  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading game data..." />;
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen p-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Teams
        </Link>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p className="font-bold">Error</p>
          <p>{error || 'Game not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-black">
      <div className="max-w-6xl mx-auto">
        {isTestMode && <TestModeBanner />}
        
        <MonitoringStatus
          isMonitoring={isMonitoring}
          pollingFrequency={config.pollingFrequency}
          onStopMonitoring={handleStopMonitoring}
        />

        <GameScoreboard
          gameData={gameData}
          scoreChangeAnimation={scoreChangeAnimation}
        />

        <PlayFeed
          plays={majorPlays}
          newPlayIds={newPlayIds}
          playerCache={playerCache}
        />

        <ConfigInfo config={config} />
      </div>
    </div>
  );
}

