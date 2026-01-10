export default function TestModeBanner() {
  return (
    <div className="mb-4 bg-purple-900/30 border-2 border-purple-500 text-purple-200 px-4 py-3 rounded-lg backdrop-blur-sm">
      <p className="font-bold">🧪 Test Mode Active</p>
      <p className="text-sm">Game data is being simulated for testing purposes. Scores and plays will change randomly.</p>
    </div>
  );
}

