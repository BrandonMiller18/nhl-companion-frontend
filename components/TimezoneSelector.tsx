'use client';

import { getTimezoneAbbreviation, saveTimezonePreference } from '@/lib/utils';

interface TimezoneSelectorProps {
  currentTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const COMMON_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'America/Anchorage', label: 'Alaska Time' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
];

export default function TimezoneSelector({ currentTimezone, onTimezoneChange }: TimezoneSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimezone = event.target.value;
    saveTimezonePreference(newTimezone);
    onTimezoneChange(newTimezone);
  };

  const currentAbbrev = getTimezoneAbbreviation(currentTimezone);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="timezone-select" className="text-sm font-medium text-gray-700">
        Timezone:
      </label>
      <select
        id="timezone-select"
        value={currentTimezone}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {COMMON_TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value} className='text-black'>
            {tz.label}
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-500">({currentAbbrev})</span>
    </div>
  );
}

