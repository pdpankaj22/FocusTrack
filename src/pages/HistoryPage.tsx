import { useState, useMemo, useCallback } from 'react';
import { getAllSessions, removeSession } from '../services/sessionService';
import { getSubjects, saveSession } from '../services/storageService';
import { exportSessionsToCSV, exportProductivitySummaryText } from '../services/exportService';
import { SessionTable } from '../components/history/SessionTable';
import { SessionFilters } from '../components/history/SessionFilters';
import { SessionDetails } from '../components/history/SessionDetails';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/ToastContainer';
import type { StudySession } from '../types';
import { toLocalDateString } from '../utils/dateUtils';
import { formatDuration } from '../utils/durationUtils';
import { Download, FileText } from 'lucide-react';

export function HistoryPage() {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<StudySession[]>(() =>
    getAllSessions().filter((s) => s.status === 'completed')
  );
  const subjects = useMemo(() => getSubjects(), []);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [minMinutes, setMinMinutes] = useState('');
  const [maxMinutes, setMaxMinutes] = useState('');
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const day = toLocalDateString(new Date(s.startedAt));
      if (from && day < from) return false;
      if (to && day > to) return false;
      if (subjectFilter && s.subjectId !== subjectFilter) return false;

      const durationMinutes = (s.studyDurationSeconds ?? 0) / 60;
      if (minMinutes !== '' && durationMinutes < Number(minMinutes)) return false;
      if (maxMinutes !== '' && durationMinutes > Number(maxMinutes)) return false;

      return true;
    });
  }, [sessions, from, to, subjectFilter, minMinutes, maxMinutes]);

  const totalFilteredStudySeconds = useMemo(() => {
    return filtered.reduce((sum, s) => sum + (s.studyDurationSeconds ?? 0), 0);
  }, [filtered]);

  const handleDelete = useCallback(
    (id: string) => {
      removeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showToast('Session record deleted.', 'success');
    },
    [showToast]
  );

  const handleUpdate = useCallback(
    (updated: StudySession) => {
      saveSession(updated);
      setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setSelectedSession(updated);
      showToast('Session record updated.', 'success');
    },
    [showToast]
  );

  const handleExportCSV = () => {
    try {
      exportSessionsToCSV(filtered, subjects, 'filtered');
      showToast(`Exported ${filtered.length} session(s) to CSV.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'No sessions to export.', 'error');
    }
  };

  const handleExportSummary = () => {
    try {
      let label = 'All Filtered History';
      if (from || to) label = `${from || 'start'} to ${to || 'today'}`;
      exportProductivitySummaryText(filtered, subjects, label);
      showToast('Exported summary report to text file.', 'success');
    } catch {
      showToast('Failed to export summary.', 'error');
    }
  };

  const handleClear = () => {
    setFrom('');
    setTo('');
    setSubjectFilter('');
    setMinMinutes('');
    setMaxMinutes('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <span className="text-[10px] font-semibold tracking-widest text-ink-muted uppercase block mb-1">
            Academic Journal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
            Study History & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Showing <strong className="font-mono text-ink">{filtered.length}</strong> of{' '}
            <strong className="font-mono text-ink">{sessions.length}</strong> recorded sessions{' '}
            {filtered.length > 0 && (
              <span>
                • Total filtered focus:{' '}
                <strong className="font-mono text-forest">{formatDuration(totalFilteredStudySeconds)}</strong>
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="h-3.5 w-3.5" />}
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            title="Export filtered records as a CSV spreadsheet"
          >
            Export CSV
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={<FileText className="h-3.5 w-3.5" />}
            onClick={handleExportSummary}
            disabled={filtered.length === 0}
            className="border border-border text-ink"
            title="Download plain text productivity summary"
          >
            Summary (.txt)
          </Button>
        </div>
      </div>

      {/* Filter Control Group */}
      <SessionFilters
        from={from}
        to={to}
        subjectId={subjectFilter}
        minMinutes={minMinutes}
        maxMinutes={maxMinutes}
        subjects={subjects}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubjectChange={setSubjectFilter}
        onMinMinutesChange={setMinMinutes}
        onMaxMinutesChange={setMaxMinutes}
        onClear={handleClear}
      />

      {/* Responsive Session Table / Cards */}
      <SessionTable
        sessions={filtered}
        subjects={subjects}
        onView={(s) => setSelectedSession(s)}
        onDelete={handleDelete}
      />

      {/* Session Details Modal */}
      <SessionDetails
        session={selectedSession}
        subjects={subjects}
        isOpen={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
