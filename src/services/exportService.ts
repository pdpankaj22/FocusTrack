import type { StudySession, Subject } from '../types';
import { toLocalDateString, formatTimeDisplay } from '../utils/dateUtils';
import { formatDuration } from '../utils/durationUtils';

function escapeCsvValue(val: string | number | boolean | undefined | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function rowToCsv(values: (string | number | boolean | undefined | null)[]): string {
  return values.map(escapeCsvValue).join(',');
}

export function exportSessionsToCSV(
  sessions: StudySession[],
  subjects: Subject[],
  filterLabel?: string
): void {
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));
  const completed = sessions.filter((s) => s.status === 'completed');

  if (completed.length === 0) {
    throw new Error('No completed study sessions to export.');
  }

  // Exact columns as specified in requirements
  const header = [
    'Session ID',
    'Subject',
    'Task title',
    'Date',
    'Start time',
    'End time',
    'Study duration in seconds',
    'Study duration in minutes',
    'Break duration in seconds',
    'Distraction count',
    'Target duration',
    'Target reached',
  ];

  const rows = completed.map((s) => {
    const subjectName = subjectMap.get(s.subjectId) ?? 'General Study';
    const date = toLocalDateString(new Date(s.startedAt));
    const startTime = formatTimeDisplay(s.startedAt);
    const endTime = s.finishedAt ? formatTimeDisplay(s.finishedAt) : '';
    const studyDurationSec = s.studyDurationSeconds ?? 0;
    const studyDurationMin = (studyDurationSec / 60).toFixed(1);
    const breakDurationSec = s.breaks.reduce((sum, b) => sum + (b.durationSeconds ?? 0), 0);
    const distractionCount = s.distractionEvents.length;
    const targetDurationFormatted = formatDuration(s.targetDurationSeconds);
    const targetReached = studyDurationSec >= s.targetDurationSeconds ? 'Yes' : 'No';

    return rowToCsv([
      s.id,
      subjectName,
      s.taskTitle || '',
      date,
      startTime,
      endTime,
      studyDurationSec,
      studyDurationMin,
      breakDurationSec,
      distractionCount,
      targetDurationFormatted,
      targetReached,
    ]);
  });

  const csv = [rowToCsv(header), ...rows].join('\r\n');
  const dateStr = toLocalDateString(new Date());
  const filename = filterLabel
    ? `focustrack-sessions-${filterLabel}-${dateStr}.csv`
    : `focustrack-sessions-${dateStr}.csv`;

  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

export function exportProductivitySummaryText(
  sessions: StudySession[],
  subjects: Subject[],
  dateRangeLabel: string
): void {
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));
  const completed = sessions.filter((s) => s.status === 'completed');

  const totalStudySeconds = completed.reduce((sum, s) => sum + (s.studyDurationSeconds ?? 0), 0);
  const totalBreakSeconds = completed.reduce(
    (sum, s) => sum + s.breaks.reduce((bSum, b) => bSum + (b.durationSeconds ?? 0), 0),
    0
  );
  const totalDistractions = completed.reduce((sum, s) => sum + s.distractionEvents.length, 0);
  const avgSessionSeconds = completed.length > 0 ? Math.round(totalStudySeconds / completed.length) : 0;

  // Most studied subject
  const subjectSeconds = new Map<string, number>();
  for (const s of completed) {
    subjectSeconds.set(s.subjectId, (subjectSeconds.get(s.subjectId) ?? 0) + (s.studyDurationSeconds ?? 0));
  }
  let mostStudiedName = 'None';
  let maxSec = 0;
  for (const [id, sec] of subjectSeconds) {
    if (sec > maxSec) {
      maxSec = sec;
      mostStudiedName = subjectMap.get(id) ?? 'Unknown';
    }
  }

  const lines: string[] = [
    '==================================================',
    '       FOCUSTRACK — STUDY SESSION ANALYZER        ',
    '            Productivity Summary Report           ',
    '==================================================',
    `Report Period: ${dateRangeLabel}`,
    `Generated On:  ${new Date().toLocaleString()}`,
    '',
    '--------------------------------------------------',
    '1. EXECUTIVE METRICS',
    '--------------------------------------------------',
    `Total Completed Study Time:  ${formatDuration(totalStudySeconds)}`,
    `Total Completed Sessions:    ${completed.length}`,
    `Average Session Duration:    ${formatDuration(avgSessionSeconds)}`,
    `Total Intentional Rest Time: ${formatDuration(totalBreakSeconds)}`,
    `Total Recorded Distractions: ${totalDistractions}`,
    `Top Subject Focus:           ${mostStudiedName} (${formatDuration(maxSec)})`,
    '',
    '--------------------------------------------------',
    '2. RECORDED SESSIONS BREAKDOWN',
    '--------------------------------------------------',
  ];

  if (completed.length === 0) {
    lines.push('No completed study sessions found for this period.');
  } else {
    completed.forEach((s, idx) => {
      const subjectName = subjectMap.get(s.subjectId) ?? 'General Study';
      const date = toLocalDateString(new Date(s.startedAt));
      const startTime = formatTimeDisplay(s.startedAt);
      const endTime = s.finishedAt ? formatTimeDisplay(s.finishedAt) : 'N/A';
      const duration = formatDuration(s.studyDurationSeconds ?? 0);
      const breaks = s.breaks.length;
      const distractions = s.distractionEvents.length;
      const targetMet = (s.studyDurationSeconds ?? 0) >= s.targetDurationSeconds ? 'Target Met' : 'Target Not Reached';

      lines.push(
        `#${idx + 1} [${date}] ${subjectName}`,
        `    Task:         ${s.taskTitle || '(None specified)'}`,
        `    Time:         ${startTime} - ${endTime}`,
        `    Duration:     ${duration} (${targetMet})`,
        `    Breaks:       ${breaks}`,
        `    Distractions: ${distractions}`,
        ''
      );
    });
  }

  lines.push(
    '==================================================',
    'FocusTrack: "Understand your time. Improve your focus."',
    'BSc Computer Science TYCS Semester 5 Mini-Project'
  );

  const filename = `focustrack-summary-${toLocalDateString(new Date())}.txt`;
  downloadFile(lines.join('\r\n'), filename, 'text/plain;charset=utf-8;');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
