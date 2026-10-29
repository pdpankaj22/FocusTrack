import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubjects } from '../services/storageService';
import { getCompletedSessions } from '../services/sessionService';
import {
  getTodayStats,
  getWeeklyStudySeconds,
  getWeeklyChartData,
  getSubjectStats,
} from '../services/analyticsService';
import { WeeklyStudyChart } from '../components/dashboard/WeeklyStudyChart';
import { SubjectBreakdown } from '../components/dashboard/SubjectBreakdown';
import { RecentSessions } from '../components/dashboard/RecentSessions';
import { Button } from '../components/common/Button';
import { formatDurationCompact } from '../utils/durationUtils';
import { Play, HelpCircle, Calendar, CheckCircle2 } from 'lucide-react';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good evening';
}

function getMotivationalMessage(sessionCount: number): string {
  if (sessionCount === 0) {
    return 'Ready for deep focus today? Set a quiet target and begin your first session.';
  } else if (sessionCount === 1) {
    return 'First session logged today. Deliberate practice compounds quickly.';
  } else if (sessionCount < 4) {
    return 'Strong momentum today. Maintain rhythm and respect your rest intervals.';
  } else {
    return 'Outstanding productivity recorded. Be sure to balance focus with restful recovery.';
  }
}

export function DashboardPage() {
  const navigate = useNavigate();
  const subjects = useMemo(() => getSubjects(), []);
  const sessions = useMemo(() => getCompletedSessions(), []);

  const [showScoreTooltip, setShowScoreTooltip] = useState(false);

  const { totalSeconds: todaySeconds, sessionCount, focusScore } = useMemo(
    () => getTodayStats(sessions),
    [sessions]
  );
  const weeklySeconds = useMemo(() => getWeeklyStudySeconds(sessions), [sessions]);
  const weeklyChartData = useMemo(() => getWeeklyChartData(sessions), [sessions]);
  const subjectStats = useMemo(
    () => getSubjectStats(sessions, subjects, 'last7days'),
    [sessions, subjects]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted font-medium mb-1">
            <Calendar className="h-3.5 w-3.5 text-forest" />
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 font-serif italic max-w-xl">
            {getMotivationalMessage(sessionCount)}
          </p>
        </div>

        <div className="self-start sm:self-auto">
          <Button
            variant="primary"
            size="md"
            icon={<Play className="h-4 w-4 fill-current" />}
            onClick={() => navigate('/timer')}
            className="shadow-editorial"
          >
            Start Studying
          </Button>
        </div>
      </div>

      {/* Asymmetric Editorial Study Summary Banner (Replaces generic 4 identical cards) */}
      <div className="bg-surface rounded-xl border border-border shadow-editorial p-6 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Hero: Today's Total Study Time */}
          <div className="lg:col-span-5 pr-0 lg:pr-6 lg:border-r border-border/70">
            <span className="text-[11px] font-semibold tracking-wider text-ink-muted uppercase block mb-1">
              Today's Recorded Focus
            </span>
            <div className="font-serif text-4xl sm:text-5xl font-semibold text-ink tracking-tight tabular-nums">
              {formatDurationCompact(todaySeconds)}
            </div>
            <p className="text-xs text-ink-muted mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-forest flex-shrink-0" />
              <span>
                {sessionCount === 0
                  ? 'No study sessions completed yet today'
                  : `${sessionCount} session${sessionCount !== 1 ? 's' : ''} completed today`}
              </span>
            </p>
          </div>

          {/* Supporting Metrics: Focus Score, Weekly Total, Sessions */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/70">
            {/* Focus Score */}
            <div className="relative">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">
                  Focus Score
                </span>
                <button
                  type="button"
                  onClick={() => setShowScoreTooltip(!showScoreTooltip)}
                  onMouseEnter={() => setShowScoreTooltip(true)}
                  onMouseLeave={() => setShowScoreTooltip(false)}
                  className="text-ink-faint hover:text-ink-muted"
                  aria-label="Focus Score Information"
                >
                  <HelpCircle className="h-3 w-3" />
                </button>
              </div>

              {showScoreTooltip && (
                <div className="absolute left-0 bottom-full mb-2 w-56 p-2.5 bg-ink text-surface text-[11px] rounded-md shadow-editorial-lg z-20 leading-relaxed">
                  Calculated as: <code>max(0, 100 - (distractions × 10))</code>. Duration-weighted average of today's completed sessions based on manually recorded distractions.
                </div>
              )}

              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-ink tabular-nums">
                  {focusScore !== null ? `${focusScore}%` : '—'}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">
                {focusScore === null ? 'No sessions today' : 'Distraction-adjusted'}
              </p>
            </div>

            {/* Weekly Study Time */}
            <div>
              <span className="text-[11px] font-medium tracking-wide text-ink-muted uppercase block mb-1">
                Weekly Total
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-ink tabular-nums">
                {formatDurationCompact(weeklySeconds)}
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">Mon – Sun calendar</p>
            </div>

            {/* Daily Sessions Count */}
            <div>
              <span className="text-[11px] font-medium tracking-wide text-ink-muted uppercase block mb-1">
                Sessions
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-ink tabular-nums">
                {sessionCount}
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">Finished today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyStudyChart data={weeklyChartData} />
        <SubjectBreakdown stats={subjectStats} />
      </div>

      {/* Recent Study Sessions Table */}
      <RecentSessions sessions={sessions} subjects={subjects} />
    </div>
  );
}
