import { Button } from '../common/Button';
import { formatTimerDisplay, formatDuration } from '../../utils/durationUtils';
import { Coffee, Play, CheckCircle2 } from 'lucide-react';

interface BreakTimerProps {
  breakSeconds: number;
  onEndBreak: () => void;
  onFinish: () => void;
}

export function BreakTimer({ breakSeconds, onEndBreak, onFinish }: BreakTimerProps) {
  return (
    <div className="bg-surface rounded-xl border border-forest/30 shadow-editorial p-6 sm:p-8 max-w-xl mx-auto text-center space-y-6">
      {/* Break Header */}
      <div className="flex flex-col items-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-light text-forest border border-forest/20 mb-3">
          <Coffee className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-semibold tracking-widest text-forest uppercase block mb-0.5">
          Rest Interval
        </span>
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Intentional Break
        </h2>
        <p className="text-xs text-ink-muted mt-1 max-w-sm">
          Study accumulation is paused. Take deep breaths, hydrate, or stretch before resuming.
        </p>
      </div>

      {/* Break Clock */}
      <div className="py-2">
        <div className="font-mono text-6xl sm:text-7xl font-bold tracking-tight text-forest tabular-nums">
          {formatTimerDisplay(breakSeconds)}
        </div>
        <p className="text-xs text-ink-muted mt-2 font-mono">
          Break elapsed: {formatDuration(breakSeconds)}
        </p>
      </div>

      {/* Action Controls */}
      <div className="space-y-2.5 pt-2 max-w-sm mx-auto">
        <Button
          fullWidth
          variant="primary"
          onClick={onEndBreak}
          size="lg"
          icon={<Play className="h-4 w-4 fill-current" />}
        >
          Resume Studying
        </Button>
        <Button
          fullWidth
          variant="secondary"
          onClick={onFinish}
          size="md"
          icon={<CheckCircle2 className="h-4 w-4" />}
        >
          Conclude Session from Break
        </Button>
      </div>
    </div>
  );
}
