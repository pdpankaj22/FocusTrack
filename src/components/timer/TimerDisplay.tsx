import { formatTimerDisplay } from '../../utils/durationUtils';

interface TimerDisplayProps {
  seconds: number;
  targetSeconds: number;
  isBreak?: boolean;
}

export function TimerDisplay({ seconds, targetSeconds, isBreak = false }: TimerDisplayProps) {
  const progress = Math.min((seconds / Math.max(targetSeconds, 1)) * 100, 100);
  const exceeded = seconds >= targetSeconds;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-4">
      {/* Editorial Clock Display */}
      <div className="font-mono text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-ink tabular-nums select-none mb-4">
        {formatTimerDisplay(seconds)}
      </div>

      {/* Restrained Progress Indicator */}
      {!isBreak && (
        <div className="w-full px-2">
          <div className="flex justify-between items-center text-xs text-ink-muted mb-2 font-mono">
            <span>Target Progress</span>
            <span className="tabular-nums font-medium text-ink">
              {Math.round((seconds / Math.max(targetSeconds, 1)) * 100)}%
              {exceeded && <span className="text-terracotta ml-1.5 font-sans text-[11px]">(Goal reached)</span>}
            </span>
          </div>

          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div
              className={[
                'h-full rounded-full transition-all duration-700 ease-out',
                exceeded ? 'bg-terracotta' : 'bg-forest',
              ].join(' ')}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
