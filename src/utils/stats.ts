// ========================================
// utils/stats.ts
// Purpose: Turns raw tracker data into chart-ready numbers for the Activity and Reports pages.
// Keeping math here (not inside components) makes it easy to test and to replace with API data later.
// ========================================
import type { ActivityLog, Habit } from '../types';
import type { ChartPoint } from '../components/charts/ActivityCharts';
import { lastNDays, weekdayLabel } from './dates';

/** Active minutes for each given day. */
export function minutesByDay(activities: ActivityLog[], days: string[]): ChartPoint[] {
  return days.map((d) => ({ label: weekdayLabel(d), value: activities.filter((a) => a.date === d).reduce((s, a) => s + a.minutes, 0) }));
}

/** Split the last `weeks` weeks into 7-day buckets (oldest first). */
function weekBuckets(weeks: number): string[][] {
  const days = lastNDays(weeks * 7);
  return Array.from({ length: weeks }, (_, i) => days.slice(i * 7, i * 7 + 7));
}

export function minutesByWeek(activities: ActivityLog[], weeks: number): ChartPoint[] {
  return weekBuckets(weeks).map((days, i) => ({ label: `Wk ${i + 1}`, value: activities.filter((a) => days.includes(a.date)).reduce((s, a) => s + a.minutes, 0) }));
}

/** Number of logged sessions per week (workout consistency). */
export function sessionsByWeek(activities: ActivityLog[], weeks: number): ChartPoint[] {
  return weekBuckets(weeks).map((days, i) => ({ label: `Wk ${i + 1}`, value: activities.filter((a) => days.includes(a.date)).length }));
}

/** Percentage of (habit × day) check-ins completed across the given days. */
export function habitPercent(habits: Habit[], days: string[]): number {
  if (!habits.length) return 0;
  const done = habits.reduce((sum, h) => sum + days.filter((d) => h.doneDates.includes(d)).length, 0);
  return Math.round((done / (habits.length * days.length)) * 100);
}

export function habitPercentByWeek(habits: Habit[], weeks: number): ChartPoint[] {
  return weekBuckets(weeks).map((days, i) => ({ label: `Wk ${i + 1}`, value: habitPercent(habits, days) }));
}
