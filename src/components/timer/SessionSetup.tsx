import { useState, useEffect } from 'react';
import type { Subject } from '../../types';
import { Button } from '../common/Button';
import { Play, Check, Clock } from 'lucide-react';

const PRESET_DURATIONS = [15, 25, 45, 60];

interface SessionSetupProps {
  subjects: Subject[];
  onStart: (subjectId: string, taskTitle: string, targetDurationSeconds: number) => void;
}

export function SessionSetup({ subjects, onStart }: SessionSetupProps) {
  const activeSubjects = subjects.filter((s) => !s.archivedAt);

  // Read preferred duration from settings (or default to 25)
  const [durationChoice, setDurationChoice] = useState<number | 'custom'>(() => {
    const saved = localStorage.getItem('focustrack_default_duration');
    const val = saved ? Number(saved) : 25;
    return PRESET_DURATIONS.includes(val) ? val : 25;
  });

  // Pre-select 'General Study' or the first available subject so user can start in 1 click
  const [subjectId, setSubjectId] = useState(() => {
    const general = activeSubjects.find((s) => s.name.toLowerCase() === 'general study');
    return general ? general.id : (activeSubjects[0]?.id ?? '');
  });

  useEffect(() => {
    if (!subjectId && activeSubjects.length > 0) {
      const general = activeSubjects.find((s) => s.name.toLowerCase() === 'general study');
      setSubjectId(general ? general.id : activeSubjects[0].id);
    }
  }, [activeSubjects, subjectId]);

  const [taskTitle, setTaskTitle] = useState('');
  const [customMinutes, setCustomMinutes] = useState(30);
  const [errors, setErrors] = useState<{ subject?: string; custom?: string }>({});

  const handleStart = () => {
    const newErrors: typeof errors = {};
    if (!subjectId) newErrors.subject = 'Please select a subject.';
    if (durationChoice === 'custom' && (customMinutes < 1 || customMinutes > 480)) {
      newErrors.custom = 'Please enter a target between 1 and 480 minutes.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const targetSeconds =
      durationChoice === 'custom' ? customMinutes * 60 : durationChoice * 60;
    onStart(subjectId, taskTitle.trim(), targetSeconds);
  };

  const selectedSubject = activeSubjects.find((s) => s.id === subjectId);

  return (
    <div className="bg-surface rounded-xl border border-border shadow-editorial p-6 sm:p-8 max-w-xl mx-auto">
      <div className="border-b border-border/80 pb-5 mb-6 text-center">
        <span className="text-[10px] font-semibold tracking-widest text-ink-muted uppercase block mb-1">
          Study Session Setup
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
          Begin Focused Session
        </h2>
        <p className="text-xs text-ink-muted mt-1.5 max-w-sm mx-auto leading-relaxed">
          Select an academic subject and target duration. The timer continues tracking past your target.
        </p>
      </div>

      {/* Subject Selection */}
      <div className="mb-6">
        <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
          Academic Subject <span className="text-status-error">*</span>
        </label>
        {activeSubjects.length === 0 ? (
          <p className="text-xs text-[#8C5D24] bg-[#FAF3E8] p-3 rounded border border-[#EADBCA]">
            No active subjects found. Add a subject in the Subjects page first.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activeSubjects.map((s) => {
              const isSelected = s.id === subjectId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSubjectId(s.id);
                    setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  className={[
                    'flex items-center gap-2 p-2.5 rounded-md border text-left text-xs transition-all',
                    isSelected
                      ? 'border-forest bg-forest-light text-forest font-semibold ring-1 ring-forest'
                      : 'border-border bg-surface text-ink hover:border-border-strong hover:bg-surface-secondary/50',
                  ].join(' ')}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="truncate flex-1">{s.name}</span>
                  {isSelected && <Check className="h-3 w-3 text-forest flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
        {errors.subject && (
          <p className="mt-1.5 text-xs text-status-error font-medium">{errors.subject}</p>
        )}
      </div>

      {/* Task / Study Objective */}
      <div className="mb-6">
        <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
          Specific Objective <span className="text-ink-faint font-normal normal-case">(optional journal note)</span>
        </label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="e.g. Chapter 4 Practice Problems, Review Lecture Notes..."
          maxLength={100}
          className="w-full rounded-md border border-border bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest transition-colors"
        />
      </div>

      {/* Target Duration Selection */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
            Target Duration
          </label>
          <span className="text-[11px] text-ink-muted">Non-restrictive target</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_DURATIONS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => {
                setDurationChoice(min);
                setErrors((prev) => ({ ...prev, custom: undefined }));
              }}
              className={[
                'py-2 px-2 rounded-md text-xs sm:text-sm font-medium border text-center transition-all font-mono',
                durationChoice === min
                  ? 'bg-forest text-white border-forest shadow-xs font-semibold'
                  : 'bg-surface text-ink border-border hover:border-border-strong hover:bg-surface-secondary',
              ].join(' ')}
            >
              {min}m
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDurationChoice('custom')}
            className={[
              'py-2 px-2 rounded-md text-xs sm:text-sm font-medium border text-center transition-all',
              durationChoice === 'custom'
                ? 'bg-forest text-white border-forest shadow-xs font-semibold'
                : 'bg-surface text-ink border-border hover:border-border-strong hover:bg-surface-secondary',
            ].join(' ')}
          >
            Custom
          </button>
        </div>

        {durationChoice === 'custom' && (
          <div className="mt-3 flex items-center gap-2 bg-surface-secondary p-2.5 rounded-md border border-border">
            <Clock className="h-4 w-4 text-ink-muted ml-1" />
            <input
              type="number"
              min={1}
              max={480}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded border border-border px-2.5 py-1 text-sm text-center font-mono font-semibold bg-surface focus:outline-none focus:ring-1 focus:ring-forest"
            />
            <span className="text-xs font-medium text-ink-muted">minutes target</span>
          </div>
        )}
        {errors.custom && (
          <p className="mt-1.5 text-xs text-status-error font-medium">{errors.custom}</p>
        )}
      </div>

      {/* Primary Action Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        icon={<Play className="h-4 w-4 fill-current" />}
        onClick={handleStart}
        disabled={activeSubjects.length === 0}
        className="py-3 text-base shadow-editorial"
      >
        Start Studying ({durationChoice === 'custom' ? `${customMinutes}m` : `${durationChoice}m`} target)
      </Button>

      {selectedSubject && (
        <p className="text-center text-xs text-ink-muted mt-3">
          Logging under <span className="font-semibold text-ink">{selectedSubject.name}</span>
        </p>
      )}
    </div>
  );
}
