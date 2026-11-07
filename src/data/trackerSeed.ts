// ========================================
// data/trackerSeed.ts
// Purpose: DEMO starting data for activity, habits, water, sleep and meals.
// Dates are generated relative to today so charts and the calendar always look current.
// ========================================
import type { ActivityLog, ActivityType, AppNotification, TrackerData } from '../types';
import { addDays, toISO } from '../utils/dates';

const types: ActivityType[] = ['Walk', 'Workout', 'Run', 'Yoga', 'Cycling'];

/** Build a deterministic (not random) 30-day history so the demo is stable between reloads. */
export function buildTrackerSeed(): TrackerData {
  const today = new Date();
  const activities: ActivityLog[] = [];
  const water: Record<string, number> = {};
  const sleep: TrackerData['sleep'] = [];

  for (let i = 0; i < 30; i++) {
    const date = toISO(addDays(today, -i));
    if (i % 3 !== 2) {
      const type = types[i % types.length];
      activities.push({
        id: `a${i}`, date, type,
        minutes: 20 + ((i * 7) % 5) * 10,
        distanceKm: type === 'Walk' || type === 'Run' || type === 'Cycling' ? Number((1.5 + (i % 4) * 0.8).toFixed(1)) : undefined,
        note: 'Demo entry',
      });
    }
    water[date] = 1250 + ((i * 3) % 5) * 250;
    if (i < 10) sleep.push({ date, bedtime: i % 2 ? '23:00' : '22:30', hours: 6 + ((i * 3) % 5) * 0.5 + 0.5 });
  }

  const habitNames = ['Drink 8 glasses of water', '10-minute morning walk', 'Stretch before bed', 'Eat a fruit or vegetable'];
  const habits = habitNames.map((name, idx) => ({
    id: `h${idx + 1}`,
    name,
    doneDates: Array.from({ length: 30 }, (_, i) => i).filter((i) => (i * (idx + 2) + idx) % 4 !== 0).map((i) => toISO(addDays(today, -i))),
  }));

  return {
    habits,
    activities,
    water,
    sleep,
    meals: [
      { id: 'm1', date: toISO(today), meal: 'Breakfast', foodId: 'f19', servings: 1 },
      { id: 'm2', date: toISO(today), meal: 'Lunch', foodId: 'f4', servings: 1 },
      { id: 'm3', date: toISO(today), meal: 'Lunch', foodId: 'f1', servings: 2 },
    ],
  };
}

/** DEMO notifications. Real ones would come from GET /api/notifications. */
export const demoNotifications: AppNotification[] = [
  { id: 'n1', title: 'Keep your streak going', body: 'Complete one more habit today to extend your streak.', time: '2h ago', read: false },
  { id: 'n2', title: 'Weekly report ready', body: 'Your activity summary for this week is available.', time: 'Yesterday', read: false },
  { id: 'n3', title: 'New mobility routine', body: 'A 10-minute desk-friendly mobility routine was added.', time: '2 days ago', read: true },
];
