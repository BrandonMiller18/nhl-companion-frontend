'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { validateWebhookUrl } from '@/lib/utils';

interface WatchGameModalProps {
  gameId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function WatchGameModal({ gameId, isOpen, onClose }: WatchGameModalProps) {
  const isTestMode = process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true';
  const router = useRouter();
  const [pollingFrequency, setPollingFrequency] = useState(3);
  const [enableAudio, setEnableAudio] = useState(false);
  const [enableWebhooks, setEnableWebhooks] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate polling frequency
    if (pollingFrequency < 3) {
      setError('Polling frequency must be at least 3 seconds');
      return;
    }

    // Validate webhook URL if webhooks are enabled
    if (enableWebhooks) {
      if (!webhookUrl.trim()) {
        setError('Webhook URL is required when webhooks are enabled');
        return;
      }
      if (!validateWebhookUrl(webhookUrl)) {
        setError('Webhook URL must be a valid HTTPS URL');
        return;
      }
    }

    // Build URL params
    const params = new URLSearchParams({
      freq: pollingFrequency.toString(),
      audio: enableAudio.toString(),
      webhooks: enableWebhooks.toString(),
    });

    if (enableWebhooks && webhookUrl) {
      params.append('webhookUrl', webhookUrl);
    }
    
    if (isTestMode) {
      params.append('test', 'true');
    }

    // Navigate to live page
    router.push(`/live/${gameId}?${params.toString()}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-black font-bold">Watch Game Live</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Polling Frequency */}
          <div>
            <label htmlFor="pollingFrequency" className="block text-sm font-semibold text-black mb-2">
              Polling Frequency (seconds)
            </label>
            <input
              type="number"
              id="pollingFrequency"
              min="3"
              value={pollingFrequency}
              onChange={(e) => setPollingFrequency(parseInt(e.target.value) || 3)}
              className="w-full px-3 py-2 border border-gray-600 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <p className="text-xs text-gray-800 mt-1">Minimum: 3 seconds</p>
          </div>

          {/* Enable Audio */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableAudio"
              checked={enableAudio}
              onChange={(e) => setEnableAudio(e.target.checked)}
              className="w-4 h-4 border-gray-600 bg-gray-700 rounded focus:ring-blue-500"
            />
            <label htmlFor="enableAudio" className="ml-2 text-sm font-medium text-black">
              Enable audio alerts
            </label>
          </div>

          {/* Enable Webhooks */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableWebhooks"
              checked={enableWebhooks}
              onChange={(e) => setEnableWebhooks(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-600 bg-gray-700 rounded focus:ring-blue-500"
            />
            <label htmlFor="enableWebhooks" className="ml-2 text-sm font-medium text-black">
              Enable webhooks
            </label>
          </div>

          {/* Webhook URL (conditional) */}
          {enableWebhooks && (
            <div>
              <label htmlFor="webhookUrl" className="block text-sm font-semibold text-black mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                id="webhookUrl"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://example.com/webhook"
                className="w-full px-3 py-2 border border-gray-600 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-800 mt-1">Must be a valid HTTPS URL</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-red-800 rounded-md text-red-800 hover:text-white hover:bg-red-800 font-medium transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-white font-medium transition-all hover:shadow-lg hover:shadow-green-600/50 hover:text-green-800 hover:border-green-800 hover:border hover:border-solid hover:border-color-green-800 hover:cursor-pointer"
            >
              Start Watching
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

