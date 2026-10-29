import { BookOpen } from 'lucide-react';

interface ProductivityInsightsProps {
  insights: string[];
}

export function ProductivityInsights({ insights }: ProductivityInsightsProps) {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-editorial p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/60">
        <BookOpen className="h-4 w-4 text-forest" />
        <div>
          <h3 className="font-serif text-base font-semibold text-ink">Analytical Observations</h3>
          <p className="text-xs text-ink-muted">Data-derived insights from your completed sessions</p>
        </div>
      </div>

      <ul className="space-y-3">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-ink leading-relaxed">
            <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded bg-surface-secondary text-ink font-mono text-xs font-semibold border border-border mt-0.5">
              {i + 1}
            </span>
            <span className="flex-1">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
