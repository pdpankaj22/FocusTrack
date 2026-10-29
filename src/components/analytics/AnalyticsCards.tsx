import type { AnalyticsSummary } from '../../types';
import { formatDuration } from '../../utils/durationUtils';
import { Clock, Calendar, BarChart2, Timer, Coffee, AlertCircle } from 'lucide-react';

interface AnalyticsCardsProps {
  summary: AnalyticsSummary;
}

export function AnalyticsCards({ summary }: AnalyticsCardsProps) {
  const cards = [
    {
      title: 'Total Study Time',
      value: formatDuration(summary.totalStudySeconds),
      subtext: 'Accumulated in selected window',
      icon: <Clock className="h-4 w-4 text-forest" />,
    },
    {
      title: 'Avg Daily Study Time',
      value: formatDuration(summary.avgDailyStudySeconds),
      subtext: 'Total ÷ calendar days (incl. zero-days)',
      icon: <Calendar className="h-4 w-4 text-forest" />,
    },
    {
      title: 'Total Sessions',
      value: String(summary.totalSessions),
      subtext: 'Finished study blocks',
      icon: <BarChart2 className="h-4 w-4 text-forest" />,
    },
    {
      title: 'Avg Session Duration',
      value: formatDuration(summary.avgSessionSeconds),
      subtext: 'Average length per session',
      icon: <Timer className="h-4 w-4 text-forest" />,
    },
    {
      title: 'Total Break Time',
      value: formatDuration(summary.totalBreakSeconds),
      subtext: 'Intentional rest periods',
      icon: <Coffee className="h-4 w-4 text-ink-muted" />,
    },
    {
      title: 'Total Distractions',
      value: String(summary.totalDistractions),
      subtext: 'Manually logged triggers',
      icon: <AlertCircle className="h-4 w-4 text-terracotta" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-surface rounded-xl border border-border p-4 shadow-editorial flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider truncate">
              {card.title}
            </span>
            <div className="flex-shrink-0">{card.icon}</div>
          </div>
          <div>
            <p className="font-mono text-lg sm:text-xl font-bold text-ink tabular-nums leading-tight">
              {card.value}
            </p>
            <p className="text-[10px] text-ink-muted mt-1 leading-snug line-clamp-1">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
