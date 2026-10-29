import type { StudySession, DistractionEvent, BreakRecord, PauseInterval } from '../types';
import { saveSession, deleteSession, getSessions, getActiveSessionId, setActiveSessionId } from './storageService';
import { toLocalDateString } from '../utils/dateUtils';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Calculate study duration excluding pauses and breaks (using timestamps).
 */
export function calculateStudyDuration(session: StudySession): number {
  const end = session.finishedAt ? new Date(session.finishedAt).getTime() : Date.now();
  const start = new Date(session.startedAt).getTime();
  let totalMs = end - start;

  for (const pause of session.pauseIntervals) {
    if (pause.endedAt) {
      totalMs -= new Date(pause.endedAt).getTime() - new Date(pause.startedAt).getTime();
    }
  }
  for (const brk of session.breaks) {
    if (brk.endedAt) {
      totalMs -= new Date(brk.endedAt).getTime() - new Date(brk.startedAt).getTime();
    }
  }
  return Math.max(0, Math.floor(totalMs / 1000));
}

/**
 * Get the local calendar date (YYYY-MM-DD) of a session.
 */
export function getSessionLocalDate(session: StudySession): string {
  return toLocalDateString(new Date(session.startedAt));
}

export function createSession(
  subjectId: string,
  taskTitle: string,
  targetDurationSeconds: number
): StudySession {
  const now = new Date().toISOString();
  const session: StudySession = {
    id: generateId(),
    subjectId,
    taskTitle,
    targetDurationSeconds,
    startedAt: now,
    distractionEvents: [],
    breaks: [],
    pauseIntervals: [],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
  saveSession(session);
  setActiveSessionId(session.id);
  return session;
}

export function pauseSession(session: StudySession): StudySession {
  const now = new Date().toISOString();
  const pause: PauseInterval = {
    id: generateId(),
    startedAt: now,
  };
  const updated: StudySession = {
    ...session,
    status: 'paused',
    pauseIntervals: [...session.pauseIntervals, pause],
    updatedAt: now,
  };
  saveSession(updated);
  return updated;
}

export function resumeSession(session: StudySession): StudySession {
  const now = new Date().toISOString();
  const pauseIntervals = session.pauseIntervals.map((p) => {
    if (!p.endedAt) {
      return { ...p, endedAt: now };
    }
    return p;
  });
  const updated: StudySession = {
    ...session,
    status: 'active',
    pauseIntervals,
    updatedAt: now,
  };
  saveSession(updated);
  return updated;
}

export function startBreak(session: StudySession): StudySession {
  const now = new Date().toISOString();
  const breakRecord: BreakRecord = {
    id: generateId(),
    startedAt: now,
  };
  const updated: StudySession = {
    ...session,
    status: 'on_break',
    breaks: [...session.breaks, breakRecord],
    updatedAt: now,
  };
  saveSession(updated);
  return updated;
}

export function endBreak(session: StudySession): StudySession {
  const now = new Date().toISOString();
  const breaks = session.breaks.map((b) => {
    if (!b.endedAt) {
      const durationSeconds = Math.floor(
        (new Date(now).getTime() - new Date(b.startedAt).getTime()) / 1000
      );
      return { ...b, endedAt: now, durationSeconds };
    }
    return b;
  });
  const updated: StudySession = {
    ...session,
    status: 'active',
    breaks,
    updatedAt: now,
  };
  saveSession(updated);
  return updated;
}

export function recordDistraction(session: StudySession, reason?: string): StudySession {
  const now = new Date().toISOString();
  const event: DistractionEvent = {
    id: generateId(),
    timestamp: now,
    reason,
  };
  const updated: StudySession = {
    ...session,
    distractionEvents: [...session.distractionEvents, event],
    updatedAt: now,
  };
  saveSession(updated);
  return updated;
}

export function finishSession(session: StudySession): StudySession {
  const now = new Date().toISOString();
  // Close any open pause
  const pauseIntervals = session.pauseIntervals.map((p) =>
    p.endedAt ? p : { ...p, endedAt: now }
  );
  // Close any open break
  const breaks = session.breaks.map((b) => {
    if (!b.endedAt) {
      const durationSeconds = Math.floor(
        (new Date(now).getTime() - new Date(b.startedAt).getTime()) / 1000
      );
      return { ...b, endedAt: now, durationSeconds };
    }
    return b;
  });

  const withClosed: StudySession = {
    ...session,
    pauseIntervals,
    breaks,
    finishedAt: now,
  };
  const studyDurationSeconds = calculateStudyDuration(withClosed);

  const updated: StudySession = {
    ...withClosed,
    status: 'completed',
    studyDurationSeconds,
    updatedAt: now,
  };
  saveSession(updated);
  setActiveSessionId(undefined);
  return updated;
}

export function updateSessionTask(session: StudySession, taskTitle: string, subjectId: string): StudySession {
  const updated: StudySession = {
    ...session,
    taskTitle,
    subjectId,
    updatedAt: new Date().toISOString(),
  };
  saveSession(updated);
  return updated;
}

export function getActiveSession(): StudySession | null {
  const id = getActiveSessionId();
  if (!id) return null;
  const sessions = getSessions();
  return sessions.find((s) => s.id === id) ?? null;
}

export function removeSession(sessionId: string): void {
  deleteSession(sessionId);
}

export function discardActiveSession(session: StudySession): void {
  deleteSession(session.id);
  setActiveSessionId(undefined);
}

export function getAllSessions(): StudySession[] {
  return getSessions();
}

export function getCompletedSessions(): StudySession[] {
  return getSessions().filter((s) => s.status === 'completed');
}
