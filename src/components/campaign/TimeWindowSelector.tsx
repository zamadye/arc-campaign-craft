import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TimeWindow = '24h' | '1week' | '1month' | 'none';

interface TimeWindowSelectorProps {
  value: TimeWindow;
  onChange: (window: TimeWindow) => void;
}

const timeWindows = [
  { value: '24h' as TimeWindow, label: '24 hours', description: 'Complete within a day' },
  { value: '1week' as TimeWindow, label: '1 week', description: 'Complete within a week' },
  { value: '1month' as TimeWindow, label: '1 month', description: 'Complete within a month' },
  { value: 'none' as TimeWindow, label: 'No deadline', description: 'Complete anytime' },
];

export const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <label className="text-sm font-medium">Time Window</label>
        <span className="text-xs text-muted-foreground">(optional)</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {timeWindows.map((window) => (
          <button
            key={window.value}
            type="button"
            onClick={() => onChange(window.value)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 text-center",
              value === window.value
                ? "bg-primary/20 border-2 border-primary"
                : "bg-secondary/50 border-2 border-transparent hover:border-border"
            )}
          >
            <span className="text-sm font-medium">{window.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeWindowSelector;
