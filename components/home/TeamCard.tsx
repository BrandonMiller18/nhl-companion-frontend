import Link from 'next/link';
import Image from 'next/image';
import { TeamWithStatus } from '@/types/api';
import { getFullTeamName } from '@/lib/utils';
import GameStatusBadge from './GameStatusBadge';

interface TeamCardProps {
  team: TeamWithStatus;
  timezone: string;
}

export default function TeamCard({ team, timezone }: TeamCardProps) {
  return (
    <Link
      href={`/team/${team.teamId}`}
      className="bg-white/5 relative border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:bg-black overflow-hidden group min-h-[280px] flex items-center justify-center"
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
          <GameStatusBadge
            gameStatus={team.gameStatus}
            game={team.game}
            teamId={team.teamId}
            timezone={timezone}
          />
        </div>
      </div>
    </Link>
  );
}

