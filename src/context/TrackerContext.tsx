// ========================================
// context/TrackerContext.tsx
// Purpose: Shared activity, habit, water, sleep and meal data used by the Dashboard, Tracker,
// Habits, Nutrition and Reports pages. Persisted in localStorage (demo). Swap storage for
// activityService calls when the backend is ready.
// ========================================

// SECTION 1: IMPORTS
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ActivityLog, MealLog, SleepLog, TrackerData } from '../types';
import { buildTrackerSeed } from '../data/trackerSeed';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { todayISO } from '../utils/dates';

// SECTION 2: TYPES AND INTERFACES
interface TrackerContextValue extends TrackerData {
  toggleHabit: (habitId: string, date: string) => void;
  addHabit: (name: string) => void;
  removeHabit: (habitId: string) => void;
  addActivity: (entry: Omit<ActivityLog, 'id'>) => void;
  removeActivity: (id: string) => void;
  addWater: (ml: number) => void;
  addSleep: (entry: SleepLog) => void;
  addMeal: (entry: Omit<MealLog, 'id'>) => void;
  removeMeal: (id: string) => void;
  resetDemoData: () => void;
}

const TrackerContext = createContext<TrackerContextValue | null>(null);
const newId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// SECTION 3: PROVIDER
export function TrackerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useLocalStorage<TrackerData>('fitnova.tracker', buildTrackerSeed);

  const value = useMemo<TrackerContextValue>(() => ({
    ...data,
    // Add the date if missing, remove it if present
    toggleHabit: (habitId, date) => setData((d) => ({ ...d, habits: d.habits.map((h) => h.id !== habitId ? h : { ...h, doneDates: h.doneDates.includes(date) ? h.doneDates.filter((x) => x !== date) : [...h.doneDates, date] }) })),
    addHabit: (name) => setData((d) => ({ ...d, habits: [...d.habits, { id: newId(), name, doneDates: [] }] })),
    removeHabit: (habitId) => setData((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== habitId) })),
    addActivity: (entry) => setData((d) => ({ ...d, activities: [{ ...entry, id: newId() }, ...d.activities] })),
    removeActivity: (id) => setData((d) => ({ ...d, activities: d.activities.filter((a) => a.id !== id) })),
    addWater: (ml) => setData((d) => { const key = todayISO(); return { ...d, water: { ...d.water, [key]: Math.max(0, (d.water[key] ?? 0) + ml) } }; }),
    // One sleep entry per date: replace any existing entry for the same date
    addSleep: (entry) => setData((d) => ({ ...d, sleep: [entry, ...d.sleep.filter((s) => s.date !== entry.date)] })),
    addMeal: (entry) => setData((d) => ({ ...d, meals: [...d.meals, { ...entry, id: newId() }] })),
    removeMeal: (id) => setData((d) => ({ ...d, meals: d.meals.filter((m) => m.id !== id) })),
    resetDemoData: () => setData(buildTrackerSeed()),
  }), [data, setData]);

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

// SECTION 4: HOOK
export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTracker must be used inside <TrackerProvider>');
  return ctx;
}
