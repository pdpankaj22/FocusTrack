import { useNavigate } from 'react-router-dom';
import type { StudySession, Subject } from '../../types';
import { toLocalDateString, formatTimeDisplay } from '../../utils/dateUtils';
import { formatDurationCompact } from '../../utils/durationUtils';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { Clock3, ArrowRight, Check } from 'lucide-react';

interface RecentSessionsProps {
  sessions: StudySession[];
  subjects: Subject[];
}

export function RecentSessions({ sessions, subjects }: RecentSessionsProps) {
  const navigate = useNavigate();
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const recent = sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-surface rounded-xl border border-border shadow-editorial overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
        <div>
          <h3 className="font-serif text-base font-semibold text-ink">Recent Study Sessions</h3>
          <p className="text-xs text-ink-muted">Audit trail of completed study records</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/history')}
          icon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          View full log
        </Button>
      </div>

      {recent.length === 0 ? (
        <div className="p-8">
          <EmptyState
            icon={<Clock3 className="h-5 w-5 text-ink-muted" />}
            title="No study records logged yet"
            description="Start a focus session from the timer to record and analyze your academic progress."
            action={
              <Button size="sm" onClick={() => navigate('/timer')}>
                Start First Session
              </Button>
            }
          />
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {recent.map((session) => {
            const subject = subjectMap.get(session.subjectId);
            const targetAchieved =
              (session.studyDurationSeconds ?? 0) >= session.targetDurationSeconds;
            const distractionCount = session.distractionEvents.length;

            return (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3.5 hover:bg-surface-secondary/40 transition-colors gap-3"
              >
                {/* Subject and title */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: subject?.color ?? '#536747' }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {subject?.name ?? 'General Study'}
                    </p>
                    <p className="text-xs text-ink-muted truncate flex items-center gap-1.5 mt-0.5">
                      <span className="text-ink/80">{session.taskTitle || 'Focused Study'}</span>
                      <span>•</span>
                      <span>{toLocalDateString(new Date(session.startedAt))}</span>
                      <span>•</span>
                      <span>{formatTimeDisplay(session.startedAt)}</span>
                    </p>
                  </div>
                </div>

                {/* Metrics badges & status */}
                <div className="flex items-center gap-3 flex-wrap self-end sm:self-center">
                  {/* Distractions badge */}
                  <span
                    className={[
                      'inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-mono font-medium',
                      distractionCount === 0
                        ? 'bg-surface text-ink-muted border-border'
                        : 'bg-[#FAF3E8] text-[#8C5D24] border-[#EADBCA]',
                    ].join(' ')}
                  >
                    {distractionCount} {distractionCount === 1 ? 'distraction' : 'distractions'}
                  </span>

                  {/* Target status badge */}
                  <span
                    className={[
                      'inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border font-medium',
                      targetAchieved
                        ? 'bg-forest-light text-forest border-forest/20'
                        : 'bg-surface text-ink-muted border-border',
                    ].join(' ')}
                  >
                    {targetAchieved ? (
                      <>
                        <Check className="h-3 w-3 text-forest" />
                        <span>Target met</span>
                      </>
                    ) : (
                      <span>Completed</span>
                    )}
                  </span>

                  {/* Duration display */}
                  <span className="font-mono text-sm font-semibold text-ink min-w-16 text-right tabular-nums">
                    {formatDurationCompact(session.studyDurationSeconds ?? 0)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
