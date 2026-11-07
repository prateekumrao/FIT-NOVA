// Purpose: Workout data. Future endpoint: GET /workouts?category=&place=&q=
import type { Exercise } from '../types';
import { demoExercises } from '../data/exercises';
import { USE_DEMO_DATA, delay, request } from './api';

export const workoutService = {
  async list(): Promise<Exercise[]> {
    if (!USE_DEMO_DATA) return request<Exercise[]>('/workouts');
    await delay(500);
    return demoExercises;
  },
};
