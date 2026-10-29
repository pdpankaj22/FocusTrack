import { useState, useMemo } from 'react';
import { getAllSessions } from '../services/sessionService';
import { getSubjects } from '../services/storageService';
import {
  getAnalyticsSummary,
  getDailyStudyData,
  getSubjectStats,
  getProductivityInsights,
} from '../services/analyticsService';
import { exportProductivitySummaryText } from '../services/exportService';
import { AnalyticsCards } from '../components/analytics/AnalyticsCards';
import { StudyTrendChart } from '../components/analytics/StudyTrendChart';
import { ProductivityInsights } from '../components/analytics/ProductivityInsights';
import { SubjectBreakdown } from '../components/dashboard/SubjectBreakdown';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/ToastContainer';
import type { AnalyticsRange } from '../types';
import { FileText } from 'lucide-react';

const RANGES: { label: string; value: AnalyticsRange }[] = [
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days', value: 'last30days' },
  { label: 'All Time', value: 'alltime' },
];

export function AnalyticsPage() {
  const { showToast } = useToast();
  const [range, setRange] = useState<AnalyticsRange>('last7days');
  const sessions = useMemo(() => getAllSessions(), []);
  const subjects = useMemo(() => getSubjects(), []);

  const summary = useMemo(() => getAnalyticsSummary(sessions, range), [sessions, range]);
  const dailyData = useMemo(() => getDailyStudyData(sessions, range), [sessions, range]);
  const subjectStats = useMemo(
    () => getSubjectStats(sessions, subjects, range),
    [sessions, subjects, range]
  );
  const insights = useMemo(
    () => getProductivityInsights(sessions, subjects, range),
    [sessions, subjects, range]
  );

  const rangeLabel = RANGES.find((r) => r.value === range)?.label ?? 'Last 7 Days';

  const handleExportSummary = () => {
    try {
      exportProductivitySummaryText(sessions, subjects, rangeLabel);
      showToast(`Exported ${rangeLabel} productivity report (.txt).`, 'success');
    } catch {
      showToast('Failed to export summary report.', 'error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <span className="text-[10px] font-semibold tracking-widest text-ink-muted uppercase block mb-1">
            Data & Analysis
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
            Productivity Analytics
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Deterministic computations derived from {sessions.filter((s) => s.status === 'completed').length} completed sessions
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Range Selector Pill Group */}
          <div className="inline-flex rounded-md p-1 bg-surface-secondary border border-border shadow-2xs">
            {RANGES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setRange(value)}
                className={[
                  'px-3 py-1 text-xs font-medium rounded transition-all',
                  range === value
                    ? 'bg-surface text-forest font-semibold shadow-2xs border border-border/60'
                    : 'text-ink-muted hover:text-ink',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<FileText className="h-3.5 w-3.5" />}
            onClick={handleExportSummary}
            title="Download plain text analysis summary"
          >
            Export Report (.txt)
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <AnalyticsCards summary={summary} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudyTrendChart data={dailyData} />
        <SubjectBreakdown stats={subjectStats} />
      </div>

      {/* Data Observations */}
      <ProductivityInsights insights={insights} />
    </div>
  );
}
