import TimezoneSelector from '@/components/TimezoneSelector';

interface PageHeaderProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export default function PageHeader({ timezone, onTimezoneChange }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">NHL Companion</h1>
          <p className="text-gray-600">Today&apos;s NHL Teams and Games</p>
        </div>
        <TimezoneSelector currentTimezone={timezone} onTimezoneChange={onTimezoneChange} />
      </div>
    </header>
  );
}

