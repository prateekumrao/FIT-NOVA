// Purpose: Food and nutrition data. Future endpoints: GET /nutrition/foods, POST /nutrition/meals
import type { Food } from '../types';
import { demoFoods } from '../data/foods';
import { USE_DEMO_DATA, delay, request } from './api';

export const nutritionService = {
  async listFoods(): Promise<Food[]> {
    if (!USE_DEMO_DATA) return request<Food[]>('/nutrition/foods');
    await delay(500);
    return demoFoods;
  },
};
