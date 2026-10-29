export type SessionStatus = 'active' | 'paused' | 'on_break' | 'completed';

export interface Subject {
  id: string;
  name: string;
  color: string; // hex color
  createdAt: string; // ISO 8601
  archivedAt?: string;
}

export interface DistractionEvent {
  id: string;
  timestamp: string;
  reason?: string;
}

export interface BreakRecord {
  id: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
}

export interface PauseInterval {
  id: string;
  startedAt: string;
  endedAt?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  taskTitle: string;
  targetDurationSeconds: number;
  startedAt: string;
  finishedAt?: string;
  studyDurationSeconds?: number;
  distractionEvents: DistractionEvent[];
  breaks: BreakRecord[];
  pauseIntervals: PauseInterval[];
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  schemaVersion: number;
  subjects: Subject[];
  sessions: StudySession[];
  activeSessionId?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface DateRange {
  from: string;
  to: string;
}

export type AnalyticsRange = 'last7days' | 'last30days' | 'alltime';

export interface DailyStudyData {
  date: string; // YYYY-MM-DD
  hours: number;
  sessions: number;
}

export interface SubjectStats {
  subject: Subject;
  totalSeconds: number;
  sessionCount: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalStudySeconds: number;
  avgDailyStudySeconds: number;
  totalSessions: number;
  avgSessionSeconds: number;
  totalBreakSeconds: number;
  totalDistractions: number;
}
