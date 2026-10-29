/**
 * Validate that a string is non-empty after trimming.
 */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate that a number is a positive integer.
 */
export function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Validate that a string is a valid hex color (#RRGGBB or #RGB).
 */
export function isValidHexColor(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

/**
 * Validate that a subject name is unique (case-insensitive) among existing names.
 */
export function isUniqueSubjectName(name: string, existingNames: string[]): boolean {
  const normalized = name.trim().toLowerCase();
  return !existingNames.some((n) => n.toLowerCase() === normalized);
}

/**
 * Validate that a date string (YYYY-MM-DD) is a valid date.
 */
export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
