import React, { useState } from 'react';
import type { StudySession, Subject } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatDuration } from '../../utils/durationUtils';
import { formatTimeDisplay, toLocalDateString } from '../../utils/dateUtils';
import { calcSessionFocusScore } from '../../utils/focusScore';
import { updateSessionTask } from '../../services/sessionService';
import { Pencil } from 'lucide-react';

interface SessionDetailsProps {
  session: StudySession | null;
  subjects: Subject[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: StudySession) => void;
}

export function SessionDetails({ session, subjects, isOpen, onClose, onUpdate }: SessionDetailsProps) {
  const [editingTask, setEditingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');

  if (!session) return null;

  const subject = subjects.find((s) => s.id === session.subjectId);
  const focusScore = calcSessionFocusScore(session);
  const totalBreakSeconds = session.breaks.reduce((sum, b) => sum + (b.durationSeconds ?? 0), 0);

  const handleSaveTask = () => {
    const updated = updateSessionTask(session, taskTitle, subjectId || session.subjectId);
    onUpdate(updated);
    setEditingTask(false);
  };

  const startEdit = () => {
    setTaskTitle(session.taskTitle);
    setSubjectId(session.subjectId);
    setEditingTask(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Record Details" maxWidth="lg">
      <div className="space-y-5 text-sm text-ink">
        {/* Basic info grid */}
        <div className="grid grid-cols-2 gap-3.5 p-4 bg-surface-secondary/50 rounded-md border border-border">
          <InfoRow label="Subject">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: subject?.color ?? '#536747' }} />
              <span className="font-medium text-ink">{subject?.name ?? 'General Study'}</span>
            </div>
          </InfoRow>
          <InfoRow label="Date">{toLocalDateString(new Date(session.startedAt))}</InfoRow>
          <InfoRow label="Start Time">{formatTimeDisplay(session.startedAt)}</InfoRow>
          <InfoRow label="End Time">
            {session.finishedAt ? formatTimeDisplay(session.finishedAt) : '—'}
          </InfoRow>
          <InfoRow label="Study Duration">
            <span className="font-mono font-semibold text-ink">{formatDuration(session.studyDurationSeconds ?? 0)}</span>
          </InfoRow>
          <InfoRow label="Target Duration">
            <span className="font-mono">{formatDuration(session.targetDurationSeconds)}</span>
          </InfoRow>
          <InfoRow label="Focus Score">
            <span className={['font-mono font-bold', focusScore >= 80 ? 'text-forest' : focusScore >= 50 ? 'text-[#B47A35]' : 'text-status-error'].join(' ')}>
              {focusScore}%
            </span>
          </InfoRow>
          <InfoRow label="Break Time">
            <span className="font-mono">{formatDuration(totalBreakSeconds)}</span>
          </InfoRow>
        </div>

        {/* Task / Objective Editor */}
        <div className="p-4 bg-surface rounded-md border border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">
              Study Objective / Note
            </span>
            {!editingTask && (
              <button
                onClick={startEdit}
                className="text-xs text-forest flex items-center gap-1 hover:underline font-medium"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
            )}
          </div>
          {editingTask ? (
            <div className="space-y-2 mt-2">
              <div>
                <label className="block text-[10px] text-ink-muted uppercase mb-1">Reassign Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full rounded border border-border px-3 py-1.5 text-xs bg-surface focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  {subjects.filter((s) => !s.archivedAt).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-ink-muted uppercase mb-1">Objective</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full rounded border border-border px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-forest bg-surface"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={handleSaveTask}>Save Changes</Button>
                <Button size="sm" variant="secondary" onClick={() => setEditingTask(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-ink">{session.taskTitle || <span className="text-ink-faint italic">No specific objective logged</span>}</p>
          )}
        </div>

        {/* Breaks List */}
        {session.breaks.length > 0 && (
          <div className="p-4 bg-surface-secondary/40 rounded-md border border-border">
            <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
              Break Records ({session.breaks.length})
            </p>
            <ul className="space-y-1 text-xs">
              {session.breaks.map((b, i) => (
                <li key={b.id} className="flex justify-between font-mono text-[11px] text-ink-muted">
                  <span>Break #{i + 1} ({formatTimeDisplay(b.startedAt)} – {b.endedAt ? formatTimeDisplay(b.endedAt) : 'ongoing'})</span>
                  <span className="font-semibold text-ink">{formatDuration(b.durationSeconds ?? 0)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Distraction Events List */}
        {session.distractionEvents.length > 0 && (
          <div className="p-4 bg-surface-secondary/40 rounded-md border border-border">
            <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
              Distraction Events ({session.distractionEvents.length})
            </p>
            <ul className="space-y-1 text-xs">
              {session.distractionEvents.map((d) => (
                <li key={d.id} className="flex justify-between text-xs text-ink-muted">
                  <span>{d.reason ?? 'Unspecified reason'}</span>
                  <span className="font-mono text-[11px] text-ink-faint">{formatTimeDisplay(d.timestamp)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-[10px] font-medium text-ink-muted uppercase tracking-wider block mb-0.5">{label}</span>
      <div className="text-xs font-medium text-ink">{children}</div>
    </div>
  );
}
