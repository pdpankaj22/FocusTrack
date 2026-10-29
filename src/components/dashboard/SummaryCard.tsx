import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBg?: string;
  subtitle?: string;
  tooltip?: string;
}

export function SummaryCard({
  title,
  value,
  icon,
  subtitle,
  tooltip,
}: SummaryCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-editorial">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">{title}</p>
          {tooltip && (
            <div className="relative">
              <button
                type="button"
                className="text-ink-faint hover:text-ink-muted focus:outline-none"
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Info"
              >
                <HelpCircle className="h-3 w-3" />
              </button>
              {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 p-2 bg-ink text-surface text-[11px] rounded shadow-editorial-lg z-20 leading-relaxed text-center">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        {icon && <div className="text-ink-muted">{icon}</div>}
      </div>
      <p className="font-mono text-2xl font-bold text-ink tracking-tight tabular-nums">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-ink-muted">{subtitle}</p>}
    </div>
  );
}
