import type { SubjectStats } from '../../types';
import { formatDurationCompact } from '../../utils/durationUtils';

interface SubjectBreakdownProps {
  stats: SubjectStats[];
}

export function SubjectBreakdown({ stats }: SubjectBreakdownProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-editorial flex flex-col justify-between">
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-border/60">
        <div>
          <h3 className="font-serif text-base font-semibold text-ink">Subject Distribution</h3>
          <p className="text-xs text-ink-muted mt-0.5">Recorded study time allocation</p>
        </div>
        <span className="text-xs text-ink-muted font-medium">
          {stats.length} subject{stats.length !== 1 ? 's' : ''}
        </span>
      </div>

      {stats.length === 0 ? (
        <div className="py-12 text-center my-auto">
          <p className="font-serif text-sm text-ink-muted italic">No subject data recorded yet.</p>
          <p className="text-xs text-ink-faint mt-1">Start a study session to begin tracking subjects.</p>
        </div>
      ) : (
        <div className="space-y-3.5 my-auto">
          {stats.map(({ subject, totalSeconds, percentage }) => (
            <div key={subject.id} className="group">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="font-medium text-ink truncate group-hover:text-forest transition-colors">
                    {subject.name}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 text-ink-muted font-mono">
                  <span>{formatDurationCompact(totalSeconds)}</span>
                  <span className="w-8 text-right font-medium text-ink">{percentage}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: subject.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
