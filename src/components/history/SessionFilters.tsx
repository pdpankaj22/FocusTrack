import type { Subject } from '../../types';
import { Button } from '../common/Button';
import { X, SlidersHorizontal } from 'lucide-react';

interface SessionFiltersProps {
  from: string;
  to: string;
  subjectId: string;
  minMinutes: string;
  maxMinutes: string;
  subjects: Subject[];
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onSubjectChange: (v: string) => void;
  onMinMinutesChange: (v: string) => void;
  onMaxMinutesChange: (v: string) => void;
  onClear: () => void;
}

export function SessionFilters({
  from,
  to,
  subjectId,
  minMinutes,
  maxMinutes,
  subjects,
  onFromChange,
  onToChange,
  onSubjectChange,
  onMinMinutesChange,
  onMaxMinutesChange,
  onClear,
}: SessionFiltersProps) {
  const hasFilters = Boolean(from || to || subjectId || minMinutes || maxMinutes);

  return (
    <div className="bg-surface rounded-xl border border-border shadow-editorial p-4 sm:p-5 mb-5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-forest" />
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
            Filter Session Log
          </span>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            icon={<X className="h-3 w-3" />}
            className="text-xs text-ink-muted hover:text-ink"
          >
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Date From */}
        <div>
          <label className="block text-[10px] font-medium text-ink-muted uppercase tracking-wider mb-1">
            From Date
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-1.5 text-xs text-ink bg-surface focus:outline-none focus:ring-1 focus:ring-forest font-mono"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-[10px] font-medium text-ink-muted uppercase tracking-wider mb-1">
            To Date
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-1.5 text-xs text-ink bg-surface focus:outline-none focus:ring-1 focus:ring-forest font-mono"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-[10px] font-medium text-ink-muted uppercase tracking-wider mb-1">
            Subject
          </label>
          <select
            value={subjectId}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-1.5 text-xs text-ink bg-surface focus:outline-none focus:ring-1 focus:ring-forest"
          >
            <option value="">All Academic Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min Duration */}
        <div>
          <label className="block text-[10px] font-medium text-ink-muted uppercase tracking-wider mb-1">
            Min Duration (mins)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 15"
            value={minMinutes}
            onChange={(e) => onMinMinutesChange(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-1.5 text-xs text-ink bg-surface focus:outline-none focus:ring-1 focus:ring-forest font-mono"
          />
        </div>

        {/* Max Duration */}
        <div>
          <label className="block text-[10px] font-medium text-ink-muted uppercase tracking-wider mb-1">
            Max Duration (mins)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 60"
            value={maxMinutes}
            onChange={(e) => onMaxMinutesChange(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-1.5 text-xs text-ink bg-surface focus:outline-none focus:ring-1 focus:ring-forest font-mono"
          />
        </div>
      </div>
    </div>
  );
}
