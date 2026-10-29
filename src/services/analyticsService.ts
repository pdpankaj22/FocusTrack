import type { StudySession, Subject, AnalyticsRange, DailyStudyData, SubjectStats, AnalyticsSummary } from '../types';
import { toLocalDateString, lastNDays } from '../utils/dateUtils';
import { calcWeightedFocusScore } from '../utils/focusScore';

function getSessionsForRange(sessions: StudySession[], range: AnalyticsRange): StudySession[] {
  const completed = sessions.filter((s) => s.status === 'completed');
  if (range === 'alltime') return completed;

  const n = range === 'last7days' ? 7 : 30;
  const days = new Set(lastNDays(n));
  return completed.filter((s) => days.has(toLocalDateString(new Date(s.startedAt))));
}

export function getAnalyticsSummary(
  sessions: StudySession[],
  range: AnalyticsRange
): AnalyticsSummary {
  const filtered = getSessionsForRange(sessions, range);

  const totalStudySeconds = filtered.reduce((sum, s) => sum + (s.studyDurationSeconds ?? 0), 0);
  const totalSessions = filtered.length;
  const avgSessionSeconds = totalSessions > 0 ? Math.round(totalStudySeconds / totalSessions) : 0;

  const totalBreakSeconds = filtered.reduce(
    (sum, s) => sum + s.breaks.reduce((bs, b) => bs + (b.durationSeconds ?? 0), 0),
    0
  );
  const totalDistractions = filtered.reduce((sum, s) => sum + s.distractionEvents.length, 0);

  // Days in range with at least one session
  const uniqueDays = new Set(filtered.map((s) => toLocalDateString(new Date(s.startedAt))));
  const dayCount = range === 'alltime' ? Math.max(1, uniqueDays.size) : (range === 'last7days' ? 7 : 30);
  const avgDailyStudySeconds = Math.round(totalStudySeconds / dayCount);

  return {
    totalStudySeconds,
    avgDailyStudySeconds,
    totalSessions,
    avgSessionSeconds,
    totalBreakSeconds,
    totalDistractions,
  };
}

export function getDailyStudyData(
  sessions: StudySession[],
  range: AnalyticsRange
): DailyStudyData[] {
  const filtered = getSessionsForRange(sessions, range);
  const n = range === 'last7days' ? 7 : range === 'last30days' ? 30 : null;

  // Build day keys
  let dayKeys: string[];
  if (n !== null) {
    dayKeys = lastNDays(n);
  } else {
    // All time: span from first session date to today
    const today = toLocalDateString(new Date());
    if (filtered.length === 0) return [];
    const sortedDates = filtered
      .map((s) => toLocalDateString(new Date(s.startedAt)))
      .sort();
    const startDate = new Date(sortedDates[0] + 'T00:00:00');
    const endDate = new Date(today + 'T00:00:00');
    dayKeys = [];
    const cur = new Date(startDate);
    while (cur <= endDate) {
      dayKeys.push(toLocalDateString(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }

  // Group sessions by day
  const dayMap = new Map<string, { seconds: number; count: number }>();
  for (const s of filtered) {
    const day = toLocalDateString(new Date(s.startedAt));
    const existing = dayMap.get(day) ?? { seconds: 0, count: 0 };
    dayMap.set(day, {
      seconds: existing.seconds + (s.studyDurationSeconds ?? 0),
      count: existing.count + 1,
    });
  }

  return dayKeys.map((day) => {
    const entry = dayMap.get(day);
    return {
      date: day,
      hours: entry ? Math.round((entry.seconds / 3600) * 100) / 100 : 0,
      sessions: entry?.count ?? 0,
    };
  });
}

export function getSubjectStats(
  sessions: StudySession[],
  subjects: Subject[],
  range: AnalyticsRange
): SubjectStats[] {
  const filtered = getSessionsForRange(sessions, range);
  const total = filtered.reduce((sum, s) => sum + (s.studyDurationSeconds ?? 0), 0);

  const subjectMap = new Map<string, { seconds: number; count: number }>();
  for (const s of filtered) {
    const existing = subjectMap.get(s.subjectId) ?? { seconds: 0, count: 0 };
    subjectMap.set(s.subjectId, {
      seconds: existing.seconds + (s.studyDurationSeconds ?? 0),
      count: existing.count + 1,
    });
  }

  const stats: SubjectStats[] = [];
  for (const subject of subjects) {
    const entry = subjectMap.get(subject.id);
    if (!entry) continue;
    stats.push({
      subject,
      totalSeconds: entry.seconds,
      sessionCount: entry.count,
      percentage: total > 0 ? Math.round((entry.seconds / total) * 100) : 0,
    });
  }

  return stats.sort((a, b) => b.totalSeconds - a.totalSeconds);
}

export function getTodayStats(sessions: StudySession[]) {
  const today = toLocalDateString(new Date());
  const todaySessions = sessions.filter(
    (s) => s.status === 'completed' && toLocalDateString(new Date(s.startedAt)) === today
  );
  const totalSeconds = todaySessions.reduce((sum, s) => sum + (s.studyDurationSeconds ?? 0), 0);
  const focusScore = calcWeightedFocusScore(todaySessions);
  return { totalSeconds, sessionCount: todaySessions.length, focusScore };
}

export function getWeeklyStudySeconds(sessions: StudySession[]): number {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return sessions
    .filter((s) => {
      if (s.status !== 'completed') return false;
      const t = new Date(s.startedAt).getTime();
      return t >= monday.getTime() && t <= sunday.getTime();
    })
    .reduce((sum, s) => sum + (s.studyDurationSeconds ?? 0), 0);
}

export function getWeeklyChartData(sessions: StudySession[]) {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = toLocalDateString(d);
    const daySessions = sessions.filter(
      (s) => s.status === 'completed' && toLocalDateString(new Date(s.startedAt)) === dateStr
    );
    const seconds = daySessions.reduce((sum, s) => sum + (s.studyDurationSeconds ?? 0), 0);
    return { day: label, hours: Math.round((seconds / 3600) * 100) / 100 };
  });
}

export function getProductivityInsights(
  sessions: StudySession[],
  subjects: Subject[],
  range: AnalyticsRange
): string[] {
  const filtered = getSessionsForRange(sessions, range);
  const insights: string[] = [];

  if (filtered.length === 0) {
    insights.push('Start a study session to see your productivity insights.');
    return insights;
  }

  // Total study time
  const totalSeconds = filtered.reduce((sum, s) => sum + (s.studyDurationSeconds ?? 0), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);
  insights.push(`You have studied for ${totalHours} hours in the selected period.`);

  // Best subject
  const subjectSeconds = new Map<string, number>();
  for (const s of filtered) {
    subjectSeconds.set(s.subjectId, (subjectSeconds.get(s.subjectId) ?? 0) + (s.studyDurationSeconds ?? 0));
  }
  let bestSubjectId = '';
  let bestSeconds = 0;
  for (const [id, secs] of subjectSeconds) {
    if (secs > bestSeconds) { bestSeconds = secs; bestSubjectId = id; }
  }
  if (bestSubjectId) {
    const sub = subjects.find((s) => s.id === bestSubjectId);
    if (sub) {
      insights.push(`Your most studied subject is "${sub.name}" with ${(bestSeconds / 3600).toFixed(1)} hours.`);
    }
  }

  // Average distractions per session
  const totalDistractions = filtered.reduce((sum, s) => sum + s.distractionEvents.length, 0);
  const avgDistractions = (totalDistractions / filtered.length).toFixed(1);
  if (totalDistractions === 0) {
    insights.push('Excellent focus! You had zero distractions in your sessions.');
  } else {
    insights.push(`You averaged ${avgDistractions} distractions per session. Aim to reduce this for better focus.`);
  }

  // Average session length
  const avgSessionMins = Math.round(totalSeconds / filtered.length / 60);
  if (avgSessionMins >= 45) {
    insights.push(`Great endurance! Your average session length is ${avgSessionMins} minutes.`);
  } else {
    insights.push(`Your average session length is ${avgSessionMins} minutes. Consider longer focused sessions for deeper learning.`);
  }

  // Break ratio
  const totalBreakSeconds = filtered.reduce(
    (sum, s) => sum + s.breaks.reduce((bs, b) => bs + (b.durationSeconds ?? 0), 0),
    0
  );
  if (totalSeconds > 0) {
    const breakRatio = Math.round((totalBreakSeconds / (totalSeconds + totalBreakSeconds)) * 100);
    if (breakRatio > 30) {
      insights.push(`Breaks account for ${breakRatio}% of your study time. Consider the Pomodoro technique for better balance.`);
    } else if (totalBreakSeconds > 0) {
      insights.push(`You take healthy breaks — ${breakRatio}% of your time includes intentional rest.`);
    }
  }

  return insights.slice(0, 5);
}
