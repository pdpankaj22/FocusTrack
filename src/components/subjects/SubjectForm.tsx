import React, { useState, useEffect } from 'react';
import type { Subject } from '../../types';
import { Button } from '../common/Button';
import { isNonEmpty, isUniqueSubjectName } from '../../utils/validation';

const PRESET_COLORS = [
  '#536747', // Forest sage
  '#C77B5A', // Muted terracotta
  '#4A6572', // Slate indigo
  '#6B5B95', // Dusk violet
  '#847568', // Warm umber
  '#606C38', // Olive moss
  '#B65F53', // Muted rust
  '#3D4035', // Deep charcoal
];

interface SubjectFormProps {
  existingSubjects: Subject[];
  editSubject?: Subject | null;
  onSave: (name: string, color: string) => void;
  onCancel?: () => void;
}

export function SubjectForm({ existingSubjects, editSubject, onSave, onCancel }: SubjectFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editSubject) {
      setName(editSubject.name);
      setColor(editSubject.color);
    } else {
      setName('');
      setColor(PRESET_COLORS[0]);
    }
    setError('');
  }, [editSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNonEmpty(name)) {
      setError('Subject title is required.');
      return;
    }
    const existingNames = existingSubjects
      .filter((s) => s.id !== editSubject?.id)
      .map((s) => s.name);
    if (!isUniqueSubjectName(name, existingNames)) {
      setError('A subject with this title already exists.');
      return;
    }
    onSave(name.trim(), color);
    setName('');
    setColor(PRESET_COLORS[0]);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border shadow-editorial p-5 sm:p-6 space-y-4">
      <div className="border-b border-border/80 pb-3">
        <h3 className="font-serif text-base font-semibold text-ink">
          {editSubject ? 'Edit Academic Subject' : 'Add New Subject'}
        </h3>
        <p className="text-xs text-ink-muted mt-0.5">
          Categorize your focus sessions under study domains.
        </p>
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
          Subject Name <span className="text-status-error">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          placeholder="e.g. Distributed Systems..."
          maxLength={50}
          className={[
            'w-full rounded-md border px-3 py-2 text-sm text-ink bg-surface',
            'focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest transition-colors',
            error ? 'border-status-error' : 'border-border',
          ].join(' ')}
        />
        {error && <p className="mt-1 text-xs text-status-error font-medium">{error}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
          Color Marker
        </label>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={[
                'h-7 w-7 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-forest',
                color === c ? 'ring-2 ring-offset-2 ring-ink scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100',
              ].join(' ')}
              style={{ backgroundColor: c }}
              title={c}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 pt-2">
        <Button type="submit" variant="primary" size="sm">
          {editSubject ? 'Update Subject' : 'Create Subject'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
