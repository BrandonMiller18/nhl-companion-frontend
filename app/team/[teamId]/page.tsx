'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getActiveTeams, getGamesByDate, getTeamPlayers } from '@/lib/api-client';
import { getUserTimezone, loadTimezonePreference, findTeamGame, getFullTeamName, formatGameTime, formatPlayerPosition } from '@/lib/utils';
import { TeamResponse, GameResponse, PlayerResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import WatchGameModal from '@/components/WatchGameModal';

export default function TeamPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const teamIdNum = parseInt(teamId, 10);
  
  // Test mode - allows watching any game for testing (controlled by environment variable)
  const isTestMode = process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true';

  const [team, setTeam] = useState<TeamResponse | null>(null);
  const [todaysGame, setTodaysGame] = useState<GameResponse | null>(null);
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState<string>('America/New_York');
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);

  // Initialize timezone on mount
  useEffect(() => {
    const savedTimezone = loadTimezonePreference();
    if (savedTimezone) {
      setTimezone(savedTimezone);
    } else {
      const detectedTimezone = getUserTimezone();
      setTimezone(detectedTimezone);
    }
  }, []);

  // Fetch team data immediately on mount to get logo for loading spinner
  useEffect(() => {
    const fetchTeamForLogo = async () => {
      try {
        const teams = await getActiveTeams();
        const foundTeam = teams.find(t => t.teamId === teamIdNum) || null;
        setTeam(foundTeam);
        if (!foundTeam) {
          setError('Team not found');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading team for logo:', err);
      }
    };

    fetchTeamForLogo();
  }, [teamIdNum]);

  // Fetch remaining data when timezone changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch today's games and players in parallel
        const [todaysGames, teamPlayers] = await Promise.all([
          getGamesByDate(undefined, timezone), // No date = today in timezone
          getTeamPlayers(teamIdNum),
        ]);

        // Find today's game for this team
        const game = findTeamGame(teamIdNum, todaysGames) || null;
        setTodaysGame(game);
        
        // Set players
        setPlayers(teamPlayers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load team data');
        console.error('Error loading team:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a team (or confirmed it doesn't exist)
    if (team || error) {
      fetchData();
    }
  }, [teamIdNum, timezone, team, error]);

  if (loading) {
    return (
      <LoadingSpinner teamLogoUrl={team?.teamLogoUrl ?? undefined} message="Loading team data..." />
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen p-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Teams
        </Link>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p className="font-bold">Error</p>
          <p>{error || 'Team not found'}</p>
        </div>
      </div>
    );
  }

  // Determine if team is home or away
  const isHomeTeam = todaysGame?.gameHomeTeamId === teamIdNum;
  const opponentTeamId = isHomeTeam ? todaysGame?.gameAwayTeamId : todaysGame?.gameHomeTeamId;
  const opponentName = isHomeTeam ? todaysGame?.awayTeamName : todaysGame?.homeTeamName;
  const opponentAbbrev = isHomeTeam ? todaysGame?.awayTeamAbbrev : todaysGame?.homeTeamAbbrev;
  const teamScore = isHomeTeam ? todaysGame?.gameHomeScore : todaysGame?.gameAwayScore;
  const opponentScore = isHomeTeam ? todaysGame?.gameAwayScore : todaysGame?.gameHomeScore;

  return (
    <div className="min-h-screen p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Teams
      </Link>

      {/* Team Header */}
      <div className="bg-white/5 border rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center gap-6">
          {team.teamLogoUrl ? (
            <Image
              src={team.teamLogoUrl}
              alt={`${team.teamName} logo`}
              width={120}
              height={120}
              className="object-contain"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {team.teamAbbrev || '?'}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {getFullTeamName(team.teamCity, team.teamName)}
            </h1>
            <p className="text-xl text-white/70">{team.teamAbbrev}</p>
          </div>
        </div>
      </div>

      {/* Game Information */}
      <div className="bg-white/5 border rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Today&apos;s Game</h2>

        {todaysGame ? (
          <div className="space-y-6">
            {/* Game Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">Status:</span>
                {todaysGame.gameState === 'LIVE' || todaysGame.gameState === 'CRIT' ? (
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                    🔴 LIVE
                  </span>
                ) : todaysGame.gameState === 'FUT' ? (
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
                    📅 Upcoming
                  </span>
                ) : todaysGame.gameState === 'FINAL' || todaysGame.gameState === 'OFF' ? (
                  <span className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold">
                    ✓ Final
                  </span>
                ) : (
                  <span className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-semibold">
                    {todaysGame.gameState}
                  </span>
                )}
              </div>
              
              {/* Watch Game Button - Only show for live, critical, or upcoming games (or in test mode) */}
              {(todaysGame.gameState === 'LIVE' || todaysGame.gameState === 'CRIT' || todaysGame.gameState === 'FUT' || isTestMode) && (
                <button
                  onClick={() => setIsWatchModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors hover:cursor-pointer"
                >
                  Watch Game
                </button>
              )}
            </div>

            {/* Matchup */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Matchup</h3>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-lg font-semibold mb-2">
                    {isHomeTeam ? team.teamAbbrev : opponentAbbrev}
                  </p>
                  <p className="text-4xl font-bold">{isHomeTeam ? teamScore : opponentScore}</p>
                  <p className="text-sm text-white/70 mt-2">
                    Home
                  </p>
                </div>

                <div className="text-center px-8">
                  <p className="text-2xl font-bold text-white/70">vs</p>
                </div>

                <div className="text-center flex-1">
                  <p className="text-lg font-semibold mb-2">
                    {isHomeTeam ? opponentAbbrev : team.teamAbbrev}
                  </p>
                  <p className="text-4xl font-bold">{isHomeTeam ? opponentScore : teamScore}</p>
                  <p className="text-sm text-white/70 mt-2">
                    Away
                  </p>
                </div>
              </div>
            </div>

            {/* Game Details */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="text-xl font-semibold mb-4">Game Details</h3>
              
              {todaysGame.gameVenue && (
                <div className="flex gap-2">
                  <span className="font-semibold">Venue:</span>
                  <span>{todaysGame.gameVenue}</span>
                </div>
              )}

              <div className="flex gap-2">
                <span className="font-semibold">Game ID:</span>
                <span>{todaysGame.gameId}</span>
              </div>

              {todaysGame.gamePeriod !== null && (
                <div className="flex gap-2">
                  <span className="font-semibold">Period:</span>
                  <span>{todaysGame.gamePeriod}</span>
                </div>
              )}

              {todaysGame.gameClock && (
                <div className="flex gap-2">
                  <span className="font-semibold">Clock:</span>
                  <span>{todaysGame.gameClock}</span>
                </div>
              )}

              <div className="flex gap-2">
                <span className="font-semibold">Shots on Goal:</span>
                <span>
                  {isHomeTeam ? team.teamAbbrev : opponentAbbrev}: {isHomeTeam ? todaysGame.gameHomeSOG : todaysGame.gameAwaySOG}
                  {' | '}
                  {isHomeTeam ? opponentAbbrev : team.teamAbbrev}: {isHomeTeam ? todaysGame.gameAwaySOG : todaysGame.gameHomeSOG}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="font-semibold">Game Time:</span>
                <span>{formatGameTime(todaysGame.gameDateTimeUtc, timezone)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-white/70 italic">No game scheduled today</p>
          </div>
        )}
      </div>

      {/* Roster Section */}
      <div className="bg-white/5 border rounded-lg shadow-lg p-8 mt-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Roster</h2>
        
        {players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map(player => (
              <div key={player.playerId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No roster information available</p>
          </div>
        )}
      </div>

      {/* Watch Game Modal */}
      {todaysGame && (
        <WatchGameModal
          gameId={todaysGame.gameId}
          isOpen={isWatchModalOpen}
          onClose={() => setIsWatchModalOpen(false)}
        />
      )}
    </div>
  );
}

