/**
 * Returns YYYY-MM-DD in local time for a given Date or ISO string
 */
export function toLocalDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date as YYYY-MM-DD in local time
 */
export function todayString(): string {
  return toLocalDateString(new Date());
}

/**
 * Returns the Monday and Sunday of the current week as YYYY-MM-DD strings
 */
export function currentWeekBounds(): { monday: string; sunday: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun,1=Mon,...
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    monday: toLocalDateString(monday),
    sunday: toLocalDateString(sunday),
  };
}

/**
 * Returns an array of YYYY-MM-DD strings for each day of the current week (Mon–Sun)
 */
export function currentWeekDays(): string[] {
  const { monday } = currentWeekBounds();
  const days: string[] = [];
  const start = new Date(monday + 'T00:00:00');
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(toLocalDateString(d));
  }
  return days;
}

/**
 * Format a date string for display: "Mon, Jan 1 2024"
 */
export function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a Date or ISO string to time: "3:45 PM"
 */
export function formatTimeDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * Abbreviate weekday: Mon, Tue, Wed, Thu, Fri, Sat, Sun
 */
export function weekdayShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Get N past days as YYYY-MM-DD (including today), descending from today
 */
export function lastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(toLocalDateString(d));
  }
  return days;
}

/**
 * Compare two YYYY-MM-DD strings. Returns negative if a < b.
 */
export function compareDateStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
