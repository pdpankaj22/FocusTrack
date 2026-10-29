import { useState } from 'react';
import type { StudySession, Subject } from '../../types';
import { toLocalDateString, formatTimeDisplay } from '../../utils/dateUtils';
import { formatDurationCompact } from '../../utils/durationUtils';
import { calcSessionFocusScore } from '../../utils/focusScore';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { Eye, Trash2, Clock3 } from 'lucide-react';

interface SessionTableProps {
  sessions: StudySession[];
  subjects: Subject[];
  onView: (session: StudySession) => void;
  onDelete: (sessionId: string) => void;
}

export function SessionTable({ sessions, subjects, onView, onDelete }: SessionTableProps) {
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-8 shadow-editorial">
        <EmptyState
          icon={<Clock3 className="h-6 w-6 text-ink-muted" />}
          title="No study records found"
          description="Adjust your date/subject filters or start a focus session to record new activity."
        />
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-border bg-surface shadow-editorial overflow-hidden">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-secondary/60">
              <th className="px-4 py-3 text-left font-semibold text-ink-muted uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-muted uppercase tracking-wider">Objective</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-muted uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-muted uppercase tracking-wider">Interval</th>
              <th className="px-4 py-3 text-left font-semibold text-ink-muted uppercase tracking-wider">Duration</th>
              <th className="px-4 py-3 text-center font-semibold text-ink-muted uppercase tracking-wider">Breaks</th>
              <th className="px-4 py-3 text-center font-semibold text-ink-muted uppercase tracking-wider">Distractions</th>
              <th className="px-4 py-3 text-center font-semibold text-ink-muted uppercase tracking-wider">Focus</th>
              <th className="px-4 py-3 text-right font-semibold text-ink-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {sorted.map((session) => {
              const subject = subjectMap.get(session.subjectId);
              const score = calcSessionFocusScore(session);

              return (
                <tr key={session.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: subject?.color ?? '#536747' }}
                      />
                      <span className="font-medium text-ink">
                        {subject?.name ?? 'General Study'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-[180px]">
                    <span className="text-ink-muted truncate block">
                      {session.taskTitle || <span className="text-ink-faint italic">—</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-ink-muted whitespace-nowrap font-mono text-[11px]">
                    {toLocalDateString(new Date(session.startedAt))}
                  </td>
                  <td className="px-4 py-3.5 text-ink-muted whitespace-nowrap font-mono text-[11px]">
                    {formatTimeDisplay(session.startedAt)} – {session.finishedAt ? formatTimeDisplay(session.finishedAt) : '—'}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-ink whitespace-nowrap tabular-nums">
                    {formatDurationCompact(session.studyDurationSeconds ?? 0)}
                  </td>
                  <td className="px-4 py-3.5 text-ink-muted text-center font-mono">
                    {session.breaks.length}
                  </td>
                  <td className="px-4 py-3.5 text-ink-muted text-center font-mono">
                    {session.distractionEvents.length}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-semibold text-ink">
                    <span className={score >= 80 ? 'text-forest' : score >= 50 ? 'text-[#B47A35]' : 'text-status-error'}>
                      {score}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(session)}
                        className="p-1 rounded text-ink-muted hover:text-forest hover:bg-forest-light transition-colors"
                        title="View session details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(session.id)}
                        className="p-1 rounded text-ink-muted hover:text-status-error hover:bg-status-error-bg transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-3">
        {sorted.map((session) => {
          const subject = subjectMap.get(session.subjectId);
          const score = calcSessionFocusScore(session);

          return (
            <div
              key={session.id}
              className="bg-surface rounded-xl border border-border p-4 shadow-editorial space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: subject?.color ?? '#536747' }}
                  />
                  <span className="font-medium text-sm text-ink truncate">
                    {subject?.name ?? 'General Study'}
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold text-ink tabular-nums">
                  {formatDurationCompact(session.studyDurationSeconds ?? 0)}
                </span>
              </div>

              {session.taskTitle && (
                <p className="text-xs text-ink-muted">{session.taskTitle}</p>
              )}

              <div className="flex items-center justify-between text-xs text-ink-muted pt-2 border-t border-border/60">
                <span className="font-mono text-[11px]">
                  {toLocalDateString(new Date(session.startedAt))} · {formatTimeDisplay(session.startedAt)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px]">
                    Focus: <strong className={score >= 80 ? 'text-forest' : 'text-[#B47A35]'}>{score}%</strong>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onView(session)}
                      className="p-1 text-ink-muted hover:text-forest"
                      title="Inspect"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(session.id)}
                      className="p-1 text-ink-muted hover:text-status-error"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
        }}
        title="Delete Session Record"
        message="Are you sure you want to delete this study record? This will permanently remove its duration from your dashboard metrics and analytics."
        confirmLabel="Delete Record"
        variant="danger"
      />
    </>
  );
}
