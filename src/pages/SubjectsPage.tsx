import { useState, useCallback } from 'react';
import type { Subject } from '../types';
import { loadData, saveSubject, deleteSubject } from '../services/storageService';
import { getAllSessions } from '../services/sessionService';
import { PageHeader } from '../components/layout/PageHeader';
import { SubjectForm } from '../components/subjects/SubjectForm';
import { SubjectList } from '../components/subjects/SubjectList';
import { useToast } from '../components/common/ToastContainer';

function generateId(): string {
  return `subj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function SubjectsPage() {
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>(() => loadData().subjects);
  const sessions = getAllSessions();
  const [editSubject, setEditSubject] = useState<Subject | null>(null);

  const handleSave = useCallback(
    (name: string, color: string) => {
      if (editSubject) {
        const updated: Subject = { ...editSubject, name, color };
        saveSubject(updated);
        setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setEditSubject(null);
        showToast('Subject updated.', 'success');
      } else {
        const newSubject: Subject = {
          id: generateId(),
          name,
          color,
          createdAt: new Date().toISOString(),
        };
        saveSubject(newSubject);
        setSubjects((prev) => [...prev, newSubject]);
        showToast('Subject created successfully.', 'success');
      }
    },
    [editSubject, showToast]
  );

  const handleArchive = useCallback(
    (subject: Subject) => {
      const updated: Subject = { ...subject, archivedAt: new Date().toISOString() };
      saveSubject(updated);
      setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      showToast(`"${subject.name}" archived (historical logs preserved).`, 'info');
    },
    [showToast]
  );

  const handleDelete = useCallback(
    (subjectId: string) => {
      deleteSubject(subjectId);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      showToast('Subject removed.', 'success');
    },
    [showToast]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Academic Subjects"
        subtitle="Manage subject domains, color markers, and track study allocations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <SubjectForm
            existingSubjects={subjects}
            editSubject={editSubject}
            onSave={handleSave}
            onCancel={editSubject ? () => setEditSubject(null) : undefined}
          />
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <SubjectList
            subjects={subjects}
            sessions={sessions}
            onEdit={(s) => setEditSubject(s)}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
