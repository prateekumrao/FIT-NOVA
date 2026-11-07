// ========================================
// utils/dates.ts
// Purpose: Small date helpers. All dates are stored as "YYYY-MM-DD" strings (local time).
// ========================================

/** Convert a Date to "YYYY-MM-DD" using the user's local time zone. */
export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** The last `n` days ending today, oldest first, as ISO strings. */
export function lastNDays(n: number): string[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => toISO(addDays(today, i - (n - 1))));
}

export const todayISO = (): string => toISO(new Date());

/** Short weekday label ("Mon") for an ISO date. */
export function weekdayLabel(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

/** Number of consecutive completed days ending today (or yesterday if today is not done yet). */
export function currentStreak(doneDates: string[]): number {
  const set = new Set(doneDates);
  let cursor = new Date();
  if (!set.has(toISO(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (set.has(toISO(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
