'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getActiveTeams, getGamesByDate, getTeamPlayers } from '@/lib/api-client';
import { getUserTimezone, loadTimezonePreference, findTeamGame } from '@/lib/utils';
import { TeamResponse, GameResponse, PlayerResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import WatchGameModal from '@/components/WatchGameModal';
import { TeamHeader, TodaysGame, TeamRoster } from '@/components/team';

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

  return (
    <div className="min-h-screen p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Teams
      </Link>

      <TeamHeader team={team} />

      <TodaysGame
        game={todaysGame}
        teamId={teamIdNum}
        teamAbbrev={team.teamAbbrev || ''}
        timezone={timezone}
        isTestMode={isTestMode}
        onWatchGame={() => setIsWatchModalOpen(true)}
      />

      <TeamRoster players={players} />

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

