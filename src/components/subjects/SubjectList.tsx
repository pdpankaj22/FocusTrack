import { useState } from 'react';
import type { Subject, StudySession } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDurationCompact } from '../../utils/durationUtils';
import { Pencil, Archive, Trash2 } from 'lucide-react';

interface SubjectListProps {
  subjects: Subject[];
  sessions: StudySession[];
  onEdit: (subject: Subject) => void;
  onArchive: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
}

export function SubjectList({ subjects, sessions, onEdit, onArchive, onDelete }: SubjectListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Compute stats per subject
  const statsMap = new Map<string, { totalSeconds: number; sessionCount: number }>();
  for (const session of sessions) {
    if (session.status === 'completed') {
      const cur = statsMap.get(session.subjectId) ?? { totalSeconds: 0, sessionCount: 0 };
      statsMap.set(session.subjectId, {
        totalSeconds: cur.totalSeconds + (session.studyDurationSeconds ?? 0),
        sessionCount: cur.sessionCount + 1,
      });
    }
  }

  const active = subjects.filter((s) => !s.archivedAt);
  const archived = subjects.filter((s) => s.archivedAt);

  const renderSubject = (subject: Subject) => {
    const stats = statsMap.get(subject.id) ?? { totalSeconds: 0, sessionCount: 0 };
    const hasSessions = stats.sessionCount > 0;

    return (
      <div
        key={subject.id}
        className="flex items-center gap-3.5 p-4 bg-surface rounded-xl border border-border shadow-editorial hover:border-border-strong transition-all"
      >
        <span
          className="h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-mono font-bold"
          style={{ backgroundColor: subject.color }}
        >
          {subject.name.charAt(0)}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{subject.name}</p>
          <p className="text-xs text-ink-muted font-mono mt-0.5">
            {stats.sessionCount} session{stats.sessionCount !== 1 ? 's' : ''} ·{' '}
            <span className="font-semibold text-ink">{formatDurationCompact(stats.totalSeconds)}</span>
          </p>
        </div>

        <div className="flex items-center gap-1">
          {!subject.archivedAt && (
            <>
              <button
                onClick={() => onEdit(subject)}
                className="p-1.5 rounded text-ink-muted hover:text-forest hover:bg-forest-light transition-colors"
                title="Edit / Rename Subject"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {hasSessions ? (
                <button
                  onClick={() => onArchive(subject)}
                  className="p-1.5 rounded text-ink-muted hover:text-[#B47A35] hover:bg-[#FAF3E8] transition-colors"
                  title="Archive Subject (Retains history records)"
                >
                  <Archive className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setDeleteId(subject.id)}
                  className="p-1.5 rounded text-ink-muted hover:text-status-error hover:bg-status-error-bg transition-colors"
                  title="Delete Subject"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-ink-muted pb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider">Active Subjects ({active.length})</span>
        </div>
        {active.map(renderSubject)}
      </div>

      {archived.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/80">
          <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-3">
            Archived Subjects ({archived.length})
          </p>
          <div className="space-y-3 opacity-60">
            {archived.map(renderSubject)}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
        }}
        title="Delete Subject"
        message="This subject has no recorded sessions. Are you sure you want to permanently delete it?"
        confirmLabel="Delete Subject"
        variant="danger"
      />
    </>
  );
}
