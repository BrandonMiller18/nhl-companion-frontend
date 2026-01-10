import { LiveGameConfig } from '@/types/api';

interface ConfigInfoProps {
  config: LiveGameConfig;
}

export default function ConfigInfo({ config }: ConfigInfoProps) {
  return (
    <div className="mt-6 bg-white/5 rounded-lg shadow-lg p-4 text-sm text-white border">
      <h3 className="font-semibold text-white mb-2">Configuration</h3>
      <ul className="space-y-1 text-white/70">
        <li>• Polling: Every {config.pollingFrequency} seconds</li>
        <li>• Audio Alerts: {config.enableAudio ? 'Enabled' : 'Disabled'}</li>
        <li>• Webhooks: {config.enableWebhooks ? 'Enabled' : 'Disabled'}</li>
        {config.enableWebhooks && config.webhookUrl && (
          <li className="text-xs">• Webhook URL: {config.webhookUrl}</li>
        )}
      </ul>
    </div>
  );
}

