# FocusTrack — Study Session Analyzer

> *"Understand your time. Improve your focus."*

**Academic Project:** BSc Computer Science (TYCS) — Semester 5 Mini-Project  
**Domain:** Web Application Development, Productivity Analytics, Client-Side Architecture  

---

## 1. Executive Summary & Abstract

**FocusTrack** is a client-side web application designed to help students track, analyze, and optimize their academic study habits. Unlike traditional generic stopwatches, FocusTrack separates active study time from intentional rest intervals (breaks) and tracks self-reported distractions in real time. 

The application calculates a transparent, rule-based **Focus Score**, visualizes daily and weekly study patterns using interactive charts, categorizes study time by subject, and exports complete audit trails as CSV spreadsheets and formatted text reports—all without requiring server infrastructure or user account creation.

---

## 2. Key Features & Objectives

1. **Precision Focus Timer**:
   - Timestamp-differential timing using `Date.now()` prevents drift caused by tab throttling, backgrounding, or system sleep.
   - Preserves state across page reloads and browser restarts.
2. **Subject Categorization**:
   - Manage academic subjects with distinct color codings (Computer Networks, Artificial Intelligence, Software Engineering, Cybersecurity, General Study).
   - Duplicate prevention (case-insensitive, whitespace-trimmed) and safe archival without losing historical metrics.
3. **Rest & Break Tracking**:
   - Separate break timers record pauses and rest intervals, isolating study time from relaxation time.
4. **Distraction Logging**:
   - One-click logging of common distractions (*Phone, Social media, Noise, Unrelated browsing, Personal interruption, Other*) with optional notes.
5. **Rule-Based Focus Score**:
   - Mathematically defined penalty model: $\text{Focus Score} = \max(0, 100 - \min(100, \text{Distractions} \times 10))$.
   - Daily weighted average based on individual session study durations.
6. **Analytics & Interactive Charts**:
   - 7-day weekly overview bar charts.
   - Long-term study trends over 7 days, 30 days, or all time.
   - Subject distribution and breakdown bars.
   - Automated rule-based productivity insights without external AI APIs.
7. **Study History & Multi-Criteria Filtering**:
   - Filter by date range, subject, and minimum/maximum session duration.
   - Detailed modal inspects pause intervals, individual breaks, and distraction timestamps.
   - In-place editing of task titles and subject assignments.
8. **Data Persistence & Portability**:
   - Schema-versioned browser `localStorage`.
   - Comprehensive CSV export with exact session IDs, durations, breaks, and distraction counts.
   - Human-readable productivity summary report text export (`.txt`).
   - Demonstration Mode with sample academic records for viva presentation.

---

## 3. Technology Stack & Design System

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 19 (TypeScript) | Declarative UI, strong component modularity, strict type safety. |
| **Build Tool** | Vite | Ultra-fast HMR and optimized production bundling. |
| **Routing** | React Router v7 | Seamless client-side navigation between views. |
| **Styling** | Tailwind CSS v3 | Design-token-driven styling, responsive layouts, and modern typography. |
| **Typography** | Lora (Serif) + Inter (Sans) + JetBrains Mono | Editorial typography hierarchy with tabular numbers. |
| **Icons** | Lucide React | Lightweight, accessible, consistent icon library. |
| **Data Viz** | Recharts | Responsive SVG charts (BarChart, AreaChart) styled with warm earth tones. |
| **Storage** | Browser `localStorage` | Fast, zero-configuration local persistence with schema versioning. |

### 3.1 Design System: Editorial Minimalism × Modern Study Journal
FocusTrack replaces generic SaaS blue dashboards with a warm, calm, academic journal aesthetic:
* **Canvas Background**: `#F6F5F0` (warm ivory)
* **Surfaces**: `#FFFFFF` (primary cards), `#EFEEE7` (secondary panels & sidebar)
* **Typography**: `#252720` (charcoal primary), `#77796F` (muted secondary)
* **Accents**: `#536747` (forest green action), `#E7EBE1` (soft sage background), `#C77B5A` (muted terracotta)
* **Borders & Dividers**: `#E2E1D9` (warm subtle border)

---

## 4. System Architecture & Algorithms

### 4.1 Timing Algorithm (Timestamp Differentials)
Standard browser timers (`setInterval` with counters) drift significantly due to JavaScript event loop throttling and operating system power-saving sleep states. FocusTrack calculates elapsed time by taking the difference between timestamps:

$$\text{Elapsed Study Time} = (T_{\text{current}} - T_{\text{start}}) - \sum \Delta T_{\text{pauses}} - \sum \Delta T_{\text{breaks}}$$

Where:
- $\Delta T_{\text{pauses}}$ represents all completed pause intervals (or the active pause if currently paused).
- $\Delta T_{\text{breaks}}$ represents all completed break intervals (or the active break if currently on break).
- The `setInterval` hook runs strictly to trigger UI re-renders, not to track elapsed time.

### 4.2 Focus Score Formulation
Focus score is an indicator derived strictly from manually logged distractions:

$$\text{Penalty} = \min(100, \text{Distraction Count} \times 10)$$
$$\text{Session Focus Score} = \max(0, 100 - \text{Penalty})$$

For the daily dashboard aggregate, sessions are weighted by duration:

$$\text{Daily Focus Score} = \frac{\sum_{i=1}^n (\text{Focus Score}_i \times \text{Duration}_i)}{\sum_{i=1}^n \text{Duration}_i}$$

---

## 5. Application Structure & File Organization

```
src/
├── components/
│   ├── analytics/        # AnalyticsCards, StudyTrendChart, ProductivityInsights
│   ├── common/           # Button, Modal, EmptyState, ConfirmDialog, Toast, Badge
│   ├── dashboard/        # SummaryCard, WeeklyStudyChart, SubjectBreakdown, RecentSessions
│   ├── history/          # SessionTable, SessionFilters, SessionDetails
│   ├── layout/           # AppLayout, Sidebar, MobileNavigation, PageHeader
│   ├── subjects/         # SubjectForm, SubjectList
│   └── timer/            # SessionSetup, TimerDisplay, ActiveSession, BreakTimer, DistractionButton, SessionSummary
├── hooks/
│   ├── useLocalStorage.ts
│   └── useStudyTimer.ts  # Master timestamp timer hook & state machine
├── pages/
│   ├── DashboardPage.tsx
│   ├── TimerPage.tsx
│   ├── HistoryPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── SubjectsPage.tsx
│   └── SettingsPage.tsx
├── services/
│   ├── analyticsService.ts # Mathematical and grouping calculations
│   ├── exportService.ts    # RFC 4180 CSV & summary report generator
│   ├── sessionService.ts   # Session state mutations & duration logic
│   └── storageService.ts   # localStorage schema persistence & demo generator
├── utils/
│   ├── dateUtils.ts        # Local timezone date formatting & calendar ranges
│   ├── durationUtils.ts    # Compact & human-readable duration formatters
│   ├── focusScore.ts       # Mathematical score models
│   └── validation.ts       # Input & duplicate subject validation
├── types/
│   └── index.ts            # Core TypeScript interfaces
├── App.tsx                 # Route declarations & layout wiring
└── main.tsx                # React DOM entry point with Toast Provider
```

---

## 6. Getting Started & Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository / navigate to project root
cd "Vijay mini project"

# Install all dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build & Verification
```bash
npm run build
```
Build output is generated in the `dist/` directory, ready for static deployment to Vercel, Netlify, or GitHub Pages.

---

## 7. College Project Demonstration (Viva Guide)

1. **Dashboard**: Navigate to Home. Notice the real-time greeting, motivational message, and clean empty states when no data exists.
2. **Settings**: Go to Settings. Click **"Load Sample Demo Sessions"**. This seeds realistic academic records (e.g. *Computer Networks Socket Programming Lab*, *Neural Network Backprop*) across the past 5 days.
3. **Review Analytics**: Navigate to Analytics. Inspect the 7-day study trend area chart, subject breakdown, and rule-based insights.
4. **Interactive Timer**: Open Focus Timer.
   - Start a 25-minute session under *Artificial Intelligence*.
   - Click **Take Break**; notice the emerald break timer and study-time freeze. Click **Resume Studying**.
   - Click **Record Distraction**; select *Phone*. Notice distraction counter increments.
   - Click **Finish Session**; observe the comprehensive Session Summary card and Focus Score calculation.
5. **Study History & CSV Export**: Go to History. Filter by subject or duration, view complete session details, and click **Export CSV** to download your spreadsheet.
6. **Reset**: Return to Settings and click **Reset All Stored Data** to cleanly reset to a blank slate with defaults.

---

## 8. Academic Integrity & Project Disclaimer
FocusTrack does not use external paid APIs, AI generation APIs, or remote databases. All calculations and insights are rule-based, deterministic, and executed locally on the client machine.
