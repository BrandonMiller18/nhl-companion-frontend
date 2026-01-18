'use client';

import { useEffect, useState } from 'react';
import { getActiveTeams, getGamesByDate } from '@/lib/api-client';
import { getUserTimezone, loadTimezonePreference, getTeamGameStatus, findTeamGame } from '@/lib/utils';
import { TeamWithStatus } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PageHeader, TeamsGrid } from '@/components/home';

export default function Home() {
  const [teamsWithStatus, setTeamsWithStatus] = useState<TeamWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState<string>('');
  const [isTimezoneInitialized, setIsTimezoneInitialized] = useState(false);

  // Initialize timezone on mount
  useEffect(() => {
    const savedTimezone = loadTimezonePreference();
    if (savedTimezone) {
      setTimezone(savedTimezone);
    } else {
      const detectedTimezone = getUserTimezone();
      setTimezone(detectedTimezone);
    }
    setIsTimezoneInitialized(true);
  }, []);

  // Fetch data when timezone changes (only after initialization)
  useEffect(() => {
    if (!isTimezoneInitialized) return;

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
  }, [timezone, isTimezoneInitialized]);

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
  };

  if (loading) {
    return <LoadingSpinner />;
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
      <PageHeader timezone={timezone} onTimezoneChange={handleTimezoneChange} />
      <TeamsGrid teams={teamsWithStatus} timezone={timezone} />
    </div>
  );
}
