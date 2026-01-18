import Image from 'next/image';
import { TeamResponse } from '@/types/api';
import { getFullTeamName } from '@/lib/utils';

interface TeamHeaderProps {
  team: TeamResponse;
}

export default function TeamHeader({ team }: TeamHeaderProps) {
  return (
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
  );
}

