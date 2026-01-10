interface GameStateBadgeProps {
  gameState: string;
}

export default function GameStateBadge({ gameState }: GameStateBadgeProps) {
  if (gameState === 'LIVE' || gameState === 'CRIT') {
    return (
      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold animate-pulse shadow-lg shadow-red-500/50">
        🔴 LIVE
      </span>
    );
  }
  
  if (gameState === 'FUT') {
    return (
      <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg shadow-blue-500/50">
        📅 Upcoming
      </span>
    );
  }
  
  if (gameState === 'FINAL' || gameState === 'OFF') {
    return (
      <span className="bg-gray-600 text-white px-4 py-2 rounded-full font-semibold">
        ✓ Final
      </span>
    );
  }
  
  return (
    <span className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full font-semibold">
      {gameState}
    </span>
  );
}

