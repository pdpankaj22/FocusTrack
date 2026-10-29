import { useState, useEffect, useRef, useCallback } from 'react';
import type { StudySession } from '../types';
import {
  createSession as createSessionService,
  pauseSession as pauseSessionService,
  resumeSession as resumeSessionService,
  startBreak as startBreakService,
  endBreak as endBreakService,
  recordDistraction as recordDistractionService,
  finishSession as finishSessionService,
  discardActiveSession as discardActiveSessionService,
  getActiveSession,
} from '../services/sessionService';

function getElapsedStudySeconds(session: StudySession): number {
  const now = Date.now();
  const start = new Date(session.startedAt).getTime();
  let totalMs = now - start;

  for (const pause of session.pauseIntervals) {
    if (pause.endedAt) {
      totalMs -= new Date(pause.endedAt).getTime() - new Date(pause.startedAt).getTime();
    } else {
      totalMs -= now - new Date(pause.startedAt).getTime();
    }
  }

  for (const brk of session.breaks) {
    if (brk.endedAt) {
      totalMs -= new Date(brk.endedAt).getTime() - new Date(brk.startedAt).getTime();
    } else {
      totalMs -= now - new Date(brk.startedAt).getTime();
    }
  }

  return Math.max(0, Math.floor(totalMs / 1000));
}

function getElapsedBreakSeconds(session: StudySession): number {
  const openBreak = session.breaks.find((b) => !b.endedAt);
  if (!openBreak) return 0;
  return Math.floor((Date.now() - new Date(openBreak.startedAt).getTime()) / 1000);
}

export interface StudyTimerState {
  session: StudySession | null;
  elapsedSeconds: number;
  breakSeconds: number;
  isActive: boolean;
  isPaused: boolean;
  isOnBreak: boolean;
  targetReached: boolean;
  startSession: (subjectId: string, taskTitle: string, targetDurationSeconds: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  startBreak: () => void;
  endBreak: () => void;
  recordDistraction: (reason?: string) => void;
  finishSession: () => StudySession | null;
  discardSession: () => void;
  dismissSummary: () => void;
  completedSession: StudySession | null;
}

export function useStudyTimer(): StudyTimerState {
  const [session, setSession] = useState<StudySession | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [completedSession, setCompletedSession] = useState<StudySession | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load active session on mount
  useEffect(() => {
    const active = getActiveSession();
    if (active && active.status !== 'completed') {
      setSession(active);
      setElapsedSeconds(getElapsedStudySeconds(active));
      setBreakSeconds(getElapsedBreakSeconds(active));
    }
  }, []);

  // Set up interval to update elapsed time
  useEffect(() => {
    if (session && session.status !== 'completed') {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(getElapsedStudySeconds(session));
        setBreakSeconds(getElapsedBreakSeconds(session));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session]);

  const startSession = useCallback(
    (subjectId: string, taskTitle: string, targetDurationSeconds: number) => {
      const newSession = createSessionService(subjectId, taskTitle, targetDurationSeconds);
      setSession(newSession);
      setElapsedSeconds(0);
      setBreakSeconds(0);
      setCompletedSession(null);
    },
    []
  );

  const pauseSession = useCallback(() => {
    if (!session) return;
    const updated = pauseSessionService(session);
    setSession(updated);
  }, [session]);

  const resumeSession = useCallback(() => {
    if (!session) return;
    const updated = resumeSessionService(session);
    setSession(updated);
  }, [session]);

  const startBreak = useCallback(() => {
    if (!session) return;
    const updated = startBreakService(session);
    setSession(updated);
    setBreakSeconds(0);
  }, [session]);

  const endBreak = useCallback(() => {
    if (!session) return;
    const updated = endBreakService(session);
    setSession(updated);
    setBreakSeconds(0);
  }, [session]);

  const recordDistraction = useCallback(
    (reason?: string) => {
      if (!session) return;
      const updated = recordDistractionService(session, reason);
      setSession(updated);
    },
    [session]
  );

  const finishSession = useCallback((): StudySession | null => {
    if (!session) return null;
    const completed = finishSessionService(session);
    setCompletedSession(completed);
    setSession(null);
    setElapsedSeconds(0);
    setBreakSeconds(0);
    return completed;
  }, [session]);

  const discardSession = useCallback(() => {
    if (!session) return;
    discardActiveSessionService(session);
    setSession(null);
    setElapsedSeconds(0);
    setBreakSeconds(0);
  }, [session]);

  const dismissSummary = useCallback(() => {
    setCompletedSession(null);
  }, []);

  const isActive = session !== null && session.status === 'active';
  const isPaused = session !== null && session.status === 'paused';
  const isOnBreak = session !== null && session.status === 'on_break';
  const targetReached = session !== null && elapsedSeconds >= session.targetDurationSeconds;

  return {
    session,
    elapsedSeconds,
    breakSeconds,
    isActive,
    isPaused,
    isOnBreak,
    targetReached,
    startSession,
    pauseSession,
    resumeSession,
    startBreak,
    endBreak,
    recordDistraction,
    finishSession,
    discardSession,
    dismissSummary,
    completedSession,
  };
}
