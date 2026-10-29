import { useState } from 'react';
import type { StudySession, Subject } from '../../types';
import { TimerDisplay } from './TimerDisplay';
import { DistractionButton } from './DistractionButton';
import { Button } from '../common/Button';
import { formatTimeDisplay } from '../../utils/dateUtils';
import { formatDuration } from '../../utils/durationUtils';
import { Pause, Play, Coffee, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ActiveSessionProps {
  session: StudySession;
  subject: Subject | undefined;
  elapsedSeconds: number;
  isPaused: boolean;
  isOnBreak: boolean;
  targetReached: boolean;
  onPause: () => void;
  onResume: () => void;
  onStartBreak: () => void;
  onRecordDistraction: (reason?: string) => void;
  onFinish: () => void;
  onDiscard?: () => void;
}

export function ActiveSession({
  session,
  subject,
  elapsedSeconds,
  isPaused,
  isOnBreak,
  targetReached,
  onPause,
  onResume,
  onStartBreak,
  onRecordDistraction,
  onFinish,
  onDiscard,
}: ActiveSessionProps) {
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  // A session with less than 30 seconds has no meaningful elapsed study time
  const isTooShort = elapsedSeconds < 30;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-editorial p-6 sm:p-8 max-w-xl mx-auto space-y-6">
      {/* Target Reached Notification Banner */}
      {targetReached && !isOnBreak && (
        <div className="bg-forest-light border border-forest/20 rounded-md p-3.5 flex items-center justify-between gap-3 animate-fade-in text-forest-dark">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-forest flex-shrink-0" />
            <div>
              <p className="text-xs font-bold leading-tight">Target Duration Achieved</p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Target of {formatDuration(session.targetDurationSeconds)} reached. You may continue studying or conclude.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold bg-surface/80 border border-forest/20 px-2 py-0.5 rounded text-forest">
            COMPLETED
          </span>
        </div>
      )}

      {/* Session Metadata Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full flex-shrink-0 shadow-2xs"
            style={{ backgroundColor: subject?.color ?? '#536747' }}
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink tracking-tight">
              {subject?.name ?? 'General Study'}
            </h2>
            {session.taskTitle ? (
              <p className="text-xs text-ink-muted">{session.taskTitle}</p>
            ) : (
              <p className="text-xs text-ink-faint italic">Focus study block</p>
            )}
          </div>
        </div>

        <div>
          {isPaused ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#FAF3E8] text-[#8C5D24] border border-[#EADBCA] px-2.5 py-1 rounded-md">
              <Pause className="h-3 w-3 fill-current" />
              Paused
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-forest-light text-forest border border-forest/20 px-2.5 py-1 rounded-md">
              <span className="h-1.5 w-1.5 rounded-full bg-forest animate-pulse" />
              Focusing
            </span>
          )}
        </div>
      </div>

      {/* Dominant Timer Display */}
      <div className="py-2 flex justify-center">
        <TimerDisplay
          seconds={elapsedSeconds}
          targetSeconds={session.targetDurationSeconds}
        />
      </div>

      {/* Clean Journal Details Bar */}
      <div className="grid grid-cols-3 gap-2 bg-surface-secondary/70 rounded-md p-3 border border-border text-center text-xs">
        <div>
          <span className="text-[10px] font-medium text-ink-muted uppercase tracking-wider block">Started</span>
          <span className="font-mono font-medium text-ink mt-0.5 block">{formatTimeDisplay(session.startedAt)}</span>
        </div>
        <div>
          <span className="text-[10px] font-medium text-ink-muted uppercase tracking-wider block">Target</span>
          <span className="font-mono font-medium text-ink mt-0.5 block">
            {formatDuration(session.targetDurationSeconds)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-medium text-ink-muted uppercase tracking-wider block">Distractions</span>
          <span className="font-mono font-medium text-ink mt-0.5 block">{session.distractionEvents.length}</span>
        </div>
      </div>

      {/* Primary & Secondary Action Hierarchy */}
      <div className="space-y-2.5 pt-2">
        <div className="grid grid-cols-2 gap-2.5">
          {isPaused ? (
            <Button
              variant="primary"
              size="lg"
              onClick={onResume}
              icon={<Play className="h-4 w-4 fill-current" />}
            >
              Resume Studying
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={onPause}
              disabled={isOnBreak}
              icon={<Pause className="h-4 w-4" />}
            >
              Pause
            </Button>
          )}

          <Button
            variant="secondary"
            size="lg"
            onClick={onStartBreak}
            disabled={isOnBreak || isPaused}
            icon={<Coffee className="h-4 w-4 text-forest" />}
          >
            Take Break
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <DistractionButton
            disabled={isOnBreak || isPaused}
            onRecord={onRecordDistraction}
          />

          <Button
            variant="danger"
            onClick={() => setShowFinishConfirm(true)}
            icon={<CheckCircle2 className="h-4 w-4" />}
          >
            Finish Session
          </Button>
        </div>
      </div>

      {/* Finish Session Confirmation Dialog (Short Session Handling) */}
      {showFinishConfirm && (
        <div className="mt-4 p-4 bg-surface-secondary border border-border rounded-md space-y-3 animate-slide-up">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-ink-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-ink">
                Conclude this study session?
              </p>
              {isTooShort ? (
                <p className="text-xs text-[#8C5D24] bg-[#FAF3E8] p-2.5 rounded border border-[#EADBCA] mt-1.5">
                  Notice: Only {elapsedSeconds}s of study time was logged. You can save it or discard it so it does not distort your journal metrics.
                </p>
              ) : (
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Your elapsed study time ({formatDuration(elapsedSeconds)}) will be saved to your session log.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFinishConfirm(false)}
            >
              Keep Studying
            </Button>

            {isTooShort && onDiscard && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDiscard}
                icon={<XCircle className="h-3.5 w-3.5 text-status-error" />}
                className="text-status-error hover:bg-status-error-bg border border-status-error/20"
              >
                Discard (Don't Save)
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowFinishConfirm(false);
                onFinish();
              }}
            >
              {isTooShort ? 'Save Anyway' : 'Save & Finish'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
