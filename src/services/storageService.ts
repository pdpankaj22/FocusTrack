import type { AppData, Subject, StudySession } from '../types';

const STORAGE_KEY = 'focustrack_data';
const SCHEMA_VERSION = 1;

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'subj-cn',
    name: 'Computer Networks',
    color: '#4A6572', // Slate indigo
    createdAt: new Date().toISOString(),
  },
  {
    id: 'subj-ai',
    name: 'Artificial Intelligence',
    color: '#6B5B95', // Muted dusk violet
    createdAt: new Date().toISOString(),
  },
  {
    id: 'subj-se',
    name: 'Software Engineering',
    color: '#536747', // Forest sage
    createdAt: new Date().toISOString(),
  },
  {
    id: 'subj-cs',
    name: 'Cybersecurity',
    color: '#C77B5A', // Muted terracotta
    createdAt: new Date().toISOString(),
  },
  {
    id: 'subj-gs',
    name: 'General Study',
    color: '#847568', // Warm umber
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_DATA: AppData = {
  schemaVersion: SCHEMA_VERSION,
  subjects: DEFAULT_SUBJECTS,
  sessions: [],
  activeSessionId: undefined,
};

function isValidAppData(data: unknown): data is AppData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (typeof d.schemaVersion !== 'number') return false;
  if (!Array.isArray(d.subjects)) return false;
  if (!Array.isArray(d.sessions)) return false;
  return true;
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidAppData(parsed)) return { ...DEFAULT_DATA };
    return parsed;
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to localStorage', e);
  }
}

// Subjects
export function getSubjects(): Subject[] {
  return loadData().subjects;
}

export function saveSubject(subject: Subject): void {
  const data = loadData();
  const idx = data.subjects.findIndex((s) => s.id === subject.id);
  if (idx >= 0) {
    data.subjects[idx] = subject;
  } else {
    data.subjects.push(subject);
  }
  saveData(data);
}

export function deleteSubject(subjectId: string): void {
  const data = loadData();
  data.subjects = data.subjects.filter((s) => s.id !== subjectId);
  saveData(data);
}

// Sessions
export function getSessions(): StudySession[] {
  return loadData().sessions;
}

export function saveSession(session: StudySession): void {
  const data = loadData();
  const idx = data.sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    data.sessions[idx] = session;
  } else {
    data.sessions.push(session);
  }
  saveData(data);
}

export function deleteSession(sessionId: string): void {
  const data = loadData();
  data.sessions = data.sessions.filter((s) => s.id !== sessionId);
  if (data.activeSessionId === sessionId) {
    data.activeSessionId = undefined;
  }
  saveData(data);
}

// Active session tracking
export function getActiveSessionId(): string | undefined {
  return loadData().activeSessionId;
}

export function setActiveSessionId(id: string | undefined): void {
  const data = loadData();
  data.activeSessionId = id;
  saveData(data);
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('focustrack_default_duration');
}

/**
 * Loads realistic, clearly-labeled demo sessions for college viva / demonstration purposes.
 * Keeps sample records strictly labeled as demo data per project requirements.
 */
export function loadSampleDemoData(): void {
  const data = loadData();
  const now = new Date();

  // Helper to make an ISO string at offset days and hours
  const makeTime = (daysAgo: number, hours: number, minutes: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  const demoSessions: StudySession[] = [
    {
      id: 'demo-session-1',
      subjectId: 'subj-cn',
      taskTitle: '[DEMO] TCP/IP Socket Programming Lab',
      targetDurationSeconds: 2700, // 45m
      studyDurationSeconds: 3000, // 50m (met target)
      startedAt: makeTime(0, 9, 30),
      finishedAt: makeTime(0, 10, 25),
      distractionEvents: [
        { id: 'd1', timestamp: makeTime(0, 9, 50), reason: 'Phone notification' }
      ],
      breaks: [
        { id: 'b1', startedAt: makeTime(0, 10, 0), endedAt: makeTime(0, 10, 5), durationSeconds: 300 }
      ],
      pauseIntervals: [],
      status: 'completed',
      createdAt: makeTime(0, 9, 30),
      updatedAt: makeTime(0, 10, 25),
    },
    {
      id: 'demo-session-2',
      subjectId: 'subj-ai',
      taskTitle: '[DEMO] Neural Network Backpropagation Derivations',
      targetDurationSeconds: 3600, // 60m
      studyDurationSeconds: 3600, // 60m
      startedAt: makeTime(0, 14, 0),
      finishedAt: makeTime(0, 15, 10),
      distractionEvents: [],
      breaks: [
        { id: 'b2', startedAt: makeTime(0, 14, 30), endedAt: makeTime(0, 14, 40), durationSeconds: 600 }
      ],
      pauseIntervals: [],
      status: 'completed',
      createdAt: makeTime(0, 14, 0),
      updatedAt: makeTime(0, 15, 10),
    },
    {
      id: 'demo-session-3',
      subjectId: 'subj-se',
      taskTitle: '[DEMO] UML Sequence Diagrams & Design Patterns',
      targetDurationSeconds: 1500, // 25m
      studyDurationSeconds: 1800, // 30m
      startedAt: makeTime(1, 10, 0),
      finishedAt: makeTime(1, 10, 30),
      distractionEvents: [
        { id: 'd2', timestamp: makeTime(1, 10, 15), reason: 'Unrelated browsing' }
      ],
      breaks: [],
      pauseIntervals: [],
      status: 'completed',
      createdAt: makeTime(1, 10, 0),
      updatedAt: makeTime(1, 10, 30),
    },
    {
      id: 'demo-session-4',
      subjectId: 'subj-cs',
      taskTitle: '[DEMO] Cryptography RSA Algorithm & Hashing',
      targetDurationSeconds: 2700, // 45m
      studyDurationSeconds: 2700, // 45m
      startedAt: makeTime(2, 11, 0),
      finishedAt: makeTime(2, 11, 55),
      distractionEvents: [
        { id: 'd3', timestamp: makeTime(2, 11, 20), reason: 'Noise' },
        { id: 'd4', timestamp: makeTime(2, 11, 40), reason: 'Phone' }
      ],
      breaks: [
        { id: 'b3', startedAt: makeTime(2, 11, 25), endedAt: makeTime(2, 11, 35), durationSeconds: 600 }
      ],
      pauseIntervals: [],
      status: 'completed',
      createdAt: makeTime(2, 11, 0),
      updatedAt: makeTime(2, 11, 55),
    },
    {
      id: 'demo-session-5',
      subjectId: 'subj-ai',
      taskTitle: '[DEMO] A* Search and Heuristic Pathfinding',
      targetDurationSeconds: 3600, // 60m
      studyDurationSeconds: 4200, // 70m
      startedAt: makeTime(3, 16, 0),
      finishedAt: makeTime(3, 17, 20),
      distractionEvents: [],
      breaks: [
        { id: 'b4', startedAt: makeTime(3, 16, 40), endedAt: makeTime(3, 16, 50), durationSeconds: 600 }
      ],
      pauseIntervals: [],
      status: 'completed',
      createdAt: makeTime(3, 16, 0),
      updatedAt: makeTime(3, 17, 20),
    },
    {
      id: 'demo-session-6',
      subjectId: 'subj-cn',
      taskTitle: '[DEMO] Routing Algorithms & OSPF Configuration',
      targetDurationSeconds: 1500, // 25m
      studyDurationSeconds: 1500, // 25m
      startedAt: makeTime(4, 15, 0),
      finishedAt: makeTime(4, 15, 25),
      distractionEvents: [],
      breaks: [],
      pauseIntervals: [],
      status: 'completed',
      createdAt: makeTime(4, 15, 0),
      updatedAt: makeTime(4, 15, 25),
    },
    {
      id: 'demo-session-7',
      subjectId: 'subj-gs',
      taskTitle: '[DEMO] Semester 5 Exam Schedule & Revision Planning',
      targetDurationSeconds: 900, // 15m
      studyDurationSeconds: 1200, // 20m
      startedAt: makeTime(5, 18, 0),
      finishedAt: makeTime(5, 18, 20),
      distractionEvents: [
        { id: 'd5', timestamp: makeTime(5, 18, 10), reason: 'Personal interruption' }
      ],
      breaks: [],
      pauseIntervals: [],
      status: 'completed',
      createdAt: makeTime(5, 18, 0),
      updatedAt: makeTime(5, 18, 20),
    }
  ];

  // Merge demo sessions without overriding existing non-demo sessions
  const existingNonDemo = data.sessions.filter((s) => !s.id.startsWith('demo-'));
  data.sessions = [...existingNonDemo, ...demoSessions];
  saveData(data);
}

export function clearDemoSessions(): void {
  const data = loadData();
  data.sessions = data.sessions.filter((s) => !s.id.startsWith('demo-'));
  saveData(data);
}
