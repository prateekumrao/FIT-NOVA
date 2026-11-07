// ========================================
// types/index.ts
// Purpose: Shared TypeScript types. The backend (FastAPI + PostgreSQL) should return data in these shapes.
// ========================================

export type PlanId = 'free' | 'pro' | 'premium';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

/** The signed-in person. Demo auth keeps this in localStorage. */
export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  plan: PlanId;
  goal: string;
  level: Difficulty;
  diet: 'Vegetarian' | 'Non-vegetarian' | 'Vegan' | 'Eggetarian';
  language: string;
  onboarded: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Strength' | 'Cardio' | 'Flexibility' | 'Mobility';
  place: 'Home' | 'Gym';
  muscle: string;
  difficulty: Difficulty;
  equipment: string;
  icon: string; // key into the icon map in components/IconByName.tsx
  instructions: string[];
  safety: string;
}

export interface Food {
  id: string;
  name: string;
  category: 'Staples' | 'Pulses & Legumes' | 'Dairy' | 'Vegetables' | 'Fruits' | 'Protein' | 'Snacks';
  diet: 'Veg' | 'Non-veg';
  serving: string;
  calories: number; // kcal per serving (estimate)
  protein: number; // grams per serving (estimate)
  carbs: number;
  fat: number;
  fiber: number;
}

export type ActivityType = 'Walk' | 'Run' | 'Workout' | 'Cycling' | 'Yoga';
export interface ActivityLog {
  id: string;
  date: string; // YYYY-MM-DD
  type: ActivityType;
  minutes: number;
  distanceKm?: number;
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  doneDates: string[]; // dates (YYYY-MM-DD) on which the habit was completed
}

export interface SleepLog {
  date: string;
  bedtime: string; // "22:30"
  hours: number;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
export interface MealLog {
  id: string;
  date: string;
  meal: MealType;
  foodId: string;
  servings: number;
}

/** Everything the tracker pages read and write. One object keeps localStorage simple. */
export interface TrackerData {
  habits: Habit[];
  activities: ActivityLog[];
  water: Record<string, number>; // date -> millilitres
  sleep: SleepLog[];
  meals: MealLog[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // INR per month (illustrative)
  blurb: string;
  features: string[];
  highlight?: boolean;
}
