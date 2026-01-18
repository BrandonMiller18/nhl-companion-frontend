interface GameMatchupProps {
  homeTeamAbbrev: string;
  homeScore: number;
  awayTeamAbbrev: string;
  awayScore: number;
}

export default function GameMatchup({
  homeTeamAbbrev,
  homeScore,
  awayTeamAbbrev,
  awayScore,
}: GameMatchupProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">Matchup</h3>
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <p className="text-lg font-semibold mb-2">{homeTeamAbbrev}</p>
          <p className="text-4xl font-bold">{homeScore}</p>
          <p className="text-sm text-white/70 mt-2">Home</p>
        </div>

        <div className="text-center px-8">
          <p className="text-2xl font-bold text-white/70">vs</p>
        </div>

        <div className="text-center flex-1">
          <p className="text-lg font-semibold mb-2">{awayTeamAbbrev}</p>
          <p className="text-4xl font-bold">{awayScore}</p>
          <p className="text-sm text-white/70 mt-2">Away</p>
        </div>
      </div>
    </div>
  );
}

