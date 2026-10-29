/**
 * Format seconds as a human-readable duration string.
 * Examples:
 *   0 → "0 minutes"
 *   45 → "45 seconds"
 *   90 → "1 minute 30 seconds"
 *   3600 → "1 hour"
 *   3661 → "1 hour 1 minute"
 *   7320 → "2 hours 2 minutes"
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 minutes';
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''}`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  if (hours === 0 && secs > 0) {
    parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
  }

  return parts.join(' ');
}

/**
 * Format seconds as "HH:MM:SS" for large timer display.
 */
export function formatTimerDisplay(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':');
}

/**
 * Format seconds as compact: "1h 30m" or "45m" or "30s"
 */
export function formatDurationCompact(seconds: number): string {
  if (seconds <= 0) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

/**
 * Convert seconds to decimal hours (for charts)
 */
export function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 100) / 100;
}
