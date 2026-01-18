interface GameStatusBadgeProps {
  gameState: string;
}

export default function GameStatusBadge({ gameState }: GameStatusBadgeProps) {
  if (gameState === 'LIVE' || gameState === 'CRIT') {
    return (
      <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
        🔴 LIVE
      </span>
    );
  }
  
  if (gameState === 'FUT') {
    return (
      <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
        📅 Upcoming
      </span>
    );
  }
  
  if (gameState === 'FINAL' || gameState === 'OFF') {
    return (
      <span className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold">
        ✓ Final
      </span>
    );
  }
  
  return (
    <span className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-semibold">
      {gameState}
    </span>
  );
}

