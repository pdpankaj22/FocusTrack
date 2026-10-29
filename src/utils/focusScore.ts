import type { StudySession } from '../types';

/**
 * Calculate focus score for a single session.
 * score = max(0, 100 - min(100, distractionCount * 10))
 */
export function calcSessionFocusScore(session: StudySession): number {
  const count = session.distractionEvents.length;
  return Math.max(0, 100 - Math.min(100, count * 10));
}

/**
 * Calculate today's duration-weighted focus score from a list of completed sessions.
 * Returns null if there are no sessions.
 */
export function calcWeightedFocusScore(sessions: StudySession[]): number | null {
  if (sessions.length === 0) return null;

  let totalWeightedScore = 0;
  let totalDuration = 0;

  for (const session of sessions) {
    const duration = session.studyDurationSeconds ?? 0;
    const score = calcSessionFocusScore(session);
    totalWeightedScore += score * duration;
    totalDuration += duration;
  }

  if (totalDuration === 0) {
    // All sessions have 0 duration - simple average
    return Math.round(
      sessions.reduce((sum, s) => sum + calcSessionFocusScore(s), 0) / sessions.length
    );
  }

  return Math.round(totalWeightedScore / totalDuration);
}
