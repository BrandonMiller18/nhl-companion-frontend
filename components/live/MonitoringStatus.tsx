import Link from 'next/link';

interface MonitoringStatusProps {
  isMonitoring: boolean;
  pollingFrequency: number;
  onStopMonitoring: () => void;
}

export default function MonitoringStatus({ 
  isMonitoring, 
  pollingFrequency, 
  onStopMonitoring 
}: MonitoringStatusProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
        ← Back to Teams
      </Link>
      
      <div className="flex items-center gap-4">
        {isMonitoring ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
              <span className="text-sm font-medium text-gray-300">
                Monitoring (every {pollingFrequency}s)
              </span>
            </div>
            <button
              onClick={onStopMonitoring}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all hover:shadow-lg hover:shadow-red-500/50"
            >
              Stop Monitoring
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-400">Monitoring Stopped</span>
          </div>
        )}
      </div>
    </div>
  );
}

