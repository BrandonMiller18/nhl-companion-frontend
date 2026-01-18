import { TeamWithStatus } from '@/types/api';
import TeamCard from './TeamCard';

interface TeamsGridProps {
  teams: TeamWithStatus[];
  timezone: string;
}

export default function TeamsGrid({ teams, timezone }: TeamsGridProps) {
  if (teams.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">No teams found</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {teams.map(team => (
        <TeamCard key={team.teamId} team={team} timezone={timezone} />
      ))}
    </div>
  );
}

