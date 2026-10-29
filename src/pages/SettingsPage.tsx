import { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/ToastContainer';
import { exportSessionsToCSV } from '../services/exportService';
import { getAllSessions } from '../services/sessionService';
import {
  getSubjects,
  resetAllData,
  loadSampleDemoData,
  clearDemoSessions,
} from '../services/storageService';
import { Download, Trash2, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';

const DEFAULT_DURATIONS = [15, 25, 45, 60];

export function SettingsPage() {
  const { showToast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState(() => {
    const saved = localStorage.getItem('focustrack_default_duration');
    return saved ? Number(saved) : 25;
  });

  const handleExport = () => {
    try {
      const sessions = getAllSessions();
      const subjects = getSubjects();
      exportSessionsToCSV(sessions, subjects);
      showToast('Study history exported to CSV spreadsheet.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to export data.', 'error');
    }
  };

  const handleReset = () => {
    resetAllData();
    showToast('All data has been reset to defaults.', 'warning');
    setTimeout(() => window.location.reload(), 800);
  };

  const handleLoadDemo = () => {
    loadSampleDemoData();
    showToast('Loaded 7 sample study records for viva evaluation.', 'success');
    setTimeout(() => window.location.reload(), 800);
  };

  const handleClearDemo = () => {
    clearDemoSessions();
    showToast('Sample demo sessions cleared.', 'info');
    setTimeout(() => window.location.reload(), 800);
  };

  const handleDefaultDuration = (minutes: number) => {
    setDefaultDuration(minutes);
    localStorage.setItem('focustrack_default_duration', String(minutes));
    showToast(`Default target duration set to ${minutes} minutes.`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Settings & System Journal"
        subtitle="App preferences, local storage administration, and academic project specifications"
      />

      {/* Default Duration Configuration */}
      <section className="bg-surface rounded-xl border border-border shadow-editorial p-6">
        <h2 className="font-serif text-base font-semibold text-ink mb-1">Default Session Target</h2>
        <p className="text-xs text-ink-muted mb-4">
          Preselects this target when you configure a study session in the timer.
        </p>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_DURATIONS.map((min) => (
            <button
              key={min}
              onClick={() => handleDefaultDuration(min)}
              className={[
                'px-4 py-2 rounded-md text-xs sm:text-sm font-mono border transition-all',
                defaultDuration === min
                  ? 'bg-forest text-white border-forest shadow-xs font-semibold'
                  : 'bg-surface text-ink border-border hover:border-border-strong hover:bg-surface-secondary',
              ].join(' ')}
            >
              {min} minutes
            </button>
          ))}
        </div>
      </section>

      {/* Demonstration / Viva Mode */}
      <section className="bg-surface rounded-xl border border-border shadow-editorial p-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-forest" />
          <h2 className="font-serif text-base font-semibold text-ink">Project Demonstration Mode (Viva / Evaluation)</h2>
        </div>
        <p className="text-xs text-ink-muted mb-4 leading-relaxed">
          For college presentation and faculty evaluation, populate realistic study records (clearly tagged with <code>[DEMO]</code>) across subjects like Computer Networks and AI to demonstrate live charts, analytics, and session logs without waiting hours.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="subtle"
            size="sm"
            icon={<Sparkles className="h-3.5 w-3.5 text-forest" />}
            onClick={handleLoadDemo}
          >
            Load Sample Demo Sessions
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearDemo}
          >
            Clear Demo Records
          </Button>
        </div>
      </section>

      {/* Local Storage & Export Administration */}
      <section className="bg-surface rounded-xl border border-border shadow-editorial p-6">
        <h2 className="font-serif text-base font-semibold text-ink mb-1">Data Management & Privacy</h2>
        <p className="text-xs text-ink-muted mb-4">
          All data is strictly persisted in your browser's local storage (no remote servers or third-party accounts).
        </p>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface-secondary/50 rounded-md border border-border gap-3">
            <div>
              <p className="text-sm font-medium text-ink">Export Entire History to CSV</p>
              <p className="text-xs text-ink-muted">Download all sessions as a structured spreadsheet</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="h-3.5 w-3.5" />}
              onClick={handleExport}
              className="self-start sm:self-auto"
            >
              Export CSV
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-status-error-bg/60 rounded-md border border-status-error/20 gap-3">
            <div>
              <p className="text-sm font-medium text-status-error">Reset All Stored Data</p>
              <p className="text-xs text-status-error/80">Permanently clears sessions, custom subjects, and restores factory defaults</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={() => setShowResetConfirm(true)}
              className="self-start sm:self-auto"
            >
              Reset All
            </Button>
          </div>
        </div>
      </section>

      {/* College Project Architecture & Academic Specifications */}
      <section className="bg-surface rounded-xl border border-border shadow-editorial p-6 space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-forest" />
          <h2 className="font-serif text-base font-semibold text-ink">Academic Project Specifications</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3 bg-surface-secondary/40 rounded-md border border-border space-y-1">
            <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block">Course & Degree</span>
            <p className="font-medium text-ink">BSc Computer Science (TYCS) — Semester 5</p>
            <p className="text-ink-muted text-[11px]">Mini-Project: Web Application Development</p>
          </div>

          <div className="p-3 bg-surface-secondary/40 rounded-md border border-border space-y-1">
            <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block">Architecture Pattern</span>
            <p className="font-medium text-ink">Client-Side Single Page Application (SPA)</p>
            <p className="text-ink-muted text-[11px]">React 19, TypeScript, Tailwind CSS, Recharts</p>
          </div>

          <div className="p-3 bg-surface-secondary/40 rounded-md border border-border space-y-1">
            <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block">Timing Algorithm</span>
            <p className="font-medium text-ink">Timestamp Differentials (<code>Date.now()</code>)</p>
            <p className="text-ink-muted text-[11px]">Isolates pauses and breaks across sleep/tab throttle</p>
          </div>

          <div className="p-3 bg-surface-secondary/40 rounded-md border border-border space-y-1">
            <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider block">Focus Score Model</span>
            <p className="font-medium text-ink"><code>Score = max(0, 100 - min(100, Distractions × 10))</code></p>
            <p className="text-ink-muted text-[11px]">Duration-weighted daily average aggregate</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-muted pt-2 border-t border-border/60">
          <CheckCircle2 className="h-4 w-4 text-forest flex-shrink-0" />
          <span>Compliant with TYCS Semester 5 criteria: Zero external backend reliance, offline-first client storage, fully responsive.</span>
        </div>
      </section>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset All Stored Data"
        message="This will permanently delete all your recorded study sessions, custom subjects, and stored preferences. This action cannot be reversed. Are you sure you want to proceed?"
        confirmLabel="Yes, Reset Everything"
        variant="danger"
      />
    </div>
  );
}
