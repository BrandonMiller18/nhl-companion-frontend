'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getActiveTeams, getGamesByDate } from '@/lib/api-client';
import { getUserTimezone, loadTimezonePreference, getTeamGameStatus, getFullTeamName, findTeamGame, formatGameTime } from '@/lib/utils';
import { TeamWithStatus } from '@/types/api';
import TimezoneSelector from '@/components/TimezoneSelector';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [teamsWithStatus, setTeamsWithStatus] = useState<TeamWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState<string>('America/New_York');

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

  // Fetch data when timezone changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch active teams and today's games in the selected timezone
        const [teams, todaysGames] = await Promise.all([
          getActiveTeams(),
          getGamesByDate(undefined, timezone), // No date = today in timezone
        ]);

        // Add game status to each team
        const teamsWithGameStatus = teams.map(team => {
          const gameStatus = getTeamGameStatus(team.teamId, todaysGames);
          const game = findTeamGame(team.teamId, todaysGames);
          return {
            ...team,
            gameStatus,
            game,
          };
        });

        setTeamsWithStatus(teamsWithGameStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load teams');
        console.error('Error loading teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timezone]);

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
  };

  if (loading) {
    return (
     <LoadingSpinner />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">NHL Companion</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">NHL Companion</h1>
            <p className="text-gray-600">Today&apos;s NHL Teams and Games</p>
          </div>
          <TimezoneSelector currentTimezone={timezone} onTimezoneChange={handleTimezoneChange} />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teamsWithStatus.map(team => (
          <Link
            key={team.teamId}
            href={`/team/${team.teamId}`}
            className="bg-white/5 relative border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:bg-black  overflow-hidden group min-h-[280px] flex items-center justify-center"
          >
            {/* Background Logo - expands on hover */}
            {team.teamLogoUrl && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none mb-15">
                <Image
                  src={team.teamLogoUrl}
                  alt={`${team.teamName} background logo`}
                  width={400}
                  height={400}
                  className="object-contain w-full h-full scale-75 group-hover:scale-100 transition-transform duration-300"
                />
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center gap-4 w-full h-full">
              {/* Team Logo - hidden on hover */}
              <div className="group-hover:opacity-0 group-hover:scale-0 transition-all duration-300">
                {team.teamLogoUrl ? (
                  <Image
                    src={team.teamLogoUrl}
                    alt={`${team.teamName} logo`}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {team.teamAbbrev || '?'}
                    </span>
                  </div>
                )}
              </div>

              {/* Team Name - hidden on hover */}
              <div className="text-center group-hover:opacity-0 group-hover:scale-0 transition-all duration-300">
                <h2 className="font-bold text-lg text-white">
                  {getFullTeamName(team.teamCity, team.teamName)}
                </h2>
                <p className="text-sm text-gray-500">{team.teamAbbrev}</p>
              </div>

              {/* Game Status Badge - stays at bottom */}
              <div className="w-full mt-auto">
                {team.gameStatus === 'live' && team.game && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold text-center">
                    <div>🔴 LIVE</div>
                    {team.game.gamePeriod && (
                      <div className="text-xs mt-1">
                        Period {team.game.gamePeriod} - {team.game.gameClock}
                      </div>
                    )}
                  </div>
                )}
                {team.gameStatus === 'upcoming' && team.game && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold text-center">
                    <div className="text-sm mt-1">
                      🏒 Puck Drop: {formatGameTime(team.game.gameDateTimeUtc, timezone)}
                    </div>
                  </div>
                )}
                {team.gameStatus === 'completed' && team.game && (
                  <div className="bg-green-800 text-white px-3 py-1 rounded-full text-sm font-semibold text-center">
                    <div>✓ Final</div>
                    <div className="text-sm mt-1">
                      {team.game.gameHomeTeamId === team.teamId 
                        ? `${team.game.gameHomeScore} - ${team.game.gameAwayScore}`
                        : `${team.game.gameAwayScore} - ${team.game.gameHomeScore}`}
                    </div>
                  </div>
                )}
                {team.gameStatus === 'none' && (
                  <div className="bg-gray-500 text-white font-bold px-3 py-1 rounded-full text-sm text-center">
                    ❌ No game today
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {teamsWithStatus.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-8">No teams found</p>
      )}
    </div>
  );
}
