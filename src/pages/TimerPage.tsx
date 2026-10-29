import { useCallback, useMemo, useState } from 'react';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { getSubjects } from '../services/storageService';
import { SessionSetup } from '../components/timer/SessionSetup';
import { ActiveSession } from '../components/timer/ActiveSession';
import { BreakTimer } from '../components/timer/BreakTimer';
import { SessionSummary } from '../components/timer/SessionSummary';
import { useToast } from '../components/common/ToastContainer';

export function TimerPage() {
  const { showToast } = useToast();
  const subjects = useMemo(() => getSubjects(), []);
  const [, forceUpdate] = useState(0);

  const timer = useStudyTimer();

  const handleStart = useCallback(
    (subjectId: string, taskTitle: string, targetDurationSeconds: number) => {
      timer.startSession(subjectId, taskTitle, targetDurationSeconds);
      showToast('Focus session started.', 'success');
      forceUpdate((n) => n + 1);
    },
    [timer, showToast]
  );

  const handleFinish = useCallback(() => {
    timer.finishSession();
    showToast('Session completed and recorded.', 'success');
    forceUpdate((n) => n + 1);
  }, [timer, showToast]);

  const handleDiscard = useCallback(() => {
    timer.discardSession();
    showToast('Session discarded without saving.', 'info');
    forceUpdate((n) => n + 1);
  }, [timer, showToast]);

  const handleRecordDistraction = useCallback(
    (reason?: string) => {
      timer.recordDistraction(reason);
      showToast('Distraction event recorded.', 'warning');
    },
    [timer, showToast]
  );

  const handleStartBreak = useCallback(() => {
    timer.startBreak();
    showToast('Break timer started.', 'info');
  }, [timer, showToast]);

  const handleEndBreak = useCallback(() => {
    timer.endBreak();
    showToast('Resuming study session.', 'success');
  }, [timer, showToast]);

  const subject = useMemo(
    () => subjects.find((s) => s.id === timer.session?.subjectId),
    [subjects, timer.session]
  );

  const summarySubject = useMemo(
    () => subjects.find((s) => s.id === timer.completedSession?.subjectId),
    [subjects, timer.completedSession]
  );

  // Show summary after finish
  if (timer.completedSession) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <SessionSummary
          session={timer.completedSession}
          subject={summarySubject}
          onStartNew={() => {
            timer.dismissSummary();
            forceUpdate((n) => n + 1);
          }}
        />
      </div>
    );
  }

  // No active session: show setup
  if (!timer.session) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <SessionSetup subjects={subjects} onStart={handleStart} />
      </div>
    );
  }

  // On break: show break timer
  if (timer.isOnBreak) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <BreakTimer
          breakSeconds={timer.breakSeconds}
          onEndBreak={handleEndBreak}
          onFinish={handleFinish}
        />
      </div>
    );
  }

  // Active study session
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <ActiveSession
        session={timer.session}
        subject={subject}
        elapsedSeconds={timer.elapsedSeconds}
        isPaused={timer.isPaused}
        isOnBreak={timer.isOnBreak}
        targetReached={timer.targetReached}
        onPause={timer.pauseSession}
        onResume={timer.resumeSession}
        onStartBreak={handleStartBreak}
        onRecordDistraction={handleRecordDistraction}
        onFinish={handleFinish}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
