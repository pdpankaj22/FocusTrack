import React from 'react';
import type { StudySession, Subject } from '../../types';
import { Button } from '../common/Button';
import { formatDuration } from '../../utils/durationUtils';
import { formatTimeDisplay, toLocalDateString } from '../../utils/dateUtils';
import { calcSessionFocusScore } from '../../utils/focusScore';
import { CheckCircle2, Timer, Coffee, AlertCircle, Target, ArrowRight } from 'lucide-react';

interface SessionSummaryProps {
  session: StudySession;
  subject: Subject | undefined;
  onStartNew: () => void;
}

export function SessionSummary({ session, subject, onStartNew }: SessionSummaryProps) {
  const focusScore = calcSessionFocusScore(session);
  const totalBreakSeconds = session.breaks.reduce((sum, b) => sum + (b.durationSeconds ?? 0), 0);
  const achieved =
    (session.studyDurationSeconds ?? 0) >= session.targetDurationSeconds;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-editorial p-6 sm:p-8 max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center pb-5 border-b border-border/80">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest-light text-forest border border-forest/20 mb-3">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-semibold tracking-widest text-ink-muted uppercase block mb-0.5">
          Session Concluded
        </span>
        <h2 className="font-serif text-2xl font-semibold text-ink">Study Summary Logged</h2>
        <p className="text-xs text-ink-muted mt-1">
          {toLocalDateString(new Date(session.startedAt))} · {formatTimeDisplay(session.startedAt)}
          {session.finishedAt ? ` – ${formatTimeDisplay(session.finishedAt)}` : ''}
        </p>

        {subject && (
          <div className="inline-flex items-center gap-2 mt-2.5 px-2.5 py-1 rounded bg-surface-secondary text-xs text-ink border border-border">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: subject.color }} />
            <span className="font-medium">{subject.name}</span>
            {session.taskTitle && (
              <>
                <span className="text-ink-faint">•</span>
                <span className="text-ink-muted truncate max-w-xs">{session.taskTitle}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Grid of Journal Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryTile
          icon={<Timer className="h-4 w-4 text-forest" />}
          label="Study Duration"
          value={formatDuration(session.studyDurationSeconds ?? 0)}
        />
        <SummaryTile
          icon={<Target className="h-4 w-4 text-ink-muted" />}
          label="Target"
          value={formatDuration(session.targetDurationSeconds)}
          subvalue={achieved ? 'Target Achieved' : 'Below Target'}
          subvalueColor={achieved ? 'text-forest' : 'text-terracotta'}
        />
        <SummaryTile
          icon={<Coffee className="h-4 w-4 text-ink-muted" />}
          label="Rest & Breaks"
          value={formatDuration(totalBreakSeconds)}
          subvalue={`${session.breaks.length} break interval(s)`}
        />
        <SummaryTile
          icon={<AlertCircle className="h-4 w-4 text-[#B47A35]" />}
          label="Distractions"
          value={String(session.distractionEvents.length)}
          subvalue={session.distractionEvents.length === 0 ? 'Zero distractions' : 'Logged triggers'}
        />
      </div>

      {/* Focus Score Card */}
      <div className="flex items-center justify-between p-4 rounded-md border border-border bg-surface-secondary/50">
        <div>
          <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block">
            Focus Score
          </span>
          <p className="text-xs text-ink-muted mt-0.5">
            Deduction: 10 pts per distraction
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-3xl font-bold text-ink tabular-nums">
            {focusScore}%
          </span>
        </div>
      </div>

      {/* Distraction Trail (if any) */}
      {session.distractionEvents.length > 0 && (
        <div className="p-3.5 bg-surface-secondary/40 rounded-md border border-border">
          <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
            Recorded Distraction Events ({session.distractionEvents.length})
          </p>
          <ul className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin text-xs">
            {session.distractionEvents.map((d) => (
              <li key={d.id} className="flex items-center justify-between text-ink-muted">
                <span className="text-ink font-medium">{d.reason ?? 'Unspecified distraction'}</span>
                <span className="font-mono text-[11px] text-ink-faint">{formatTimeDisplay(d.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action to Start New Session */}
      <Button
        fullWidth
        variant="primary"
        onClick={onStartNew}
        size="lg"
        icon={<ArrowRight className="h-4 w-4" />}
      >
        Start Another Session
      </Button>
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  value,
  subvalue,
  subvalueColor = 'text-ink-muted',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subvalue?: string;
  subvalueColor?: string;
}) {
  return (
    <div className="p-3.5 rounded-md border border-border bg-surface shadow-2xs">
      <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-1">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-mono text-lg font-semibold text-ink tabular-nums">{value}</p>
      {subvalue && <p className={['text-[11px] mt-0.5 font-medium', subvalueColor].join(' ')}>{subvalue}</p>}
    </div>
  );
}
