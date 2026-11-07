// Purpose: Activity, habit, water and sleep data. Future endpoints: GET/POST /activity, /habits, /water, /sleep
// The demo keeps everything in the browser (see context/TrackerContext.tsx), so this file is the
// place to swap in real API calls: load data on login and POST each change.
import type { TrackerData } from '../types';
import { buildTrackerSeed } from '../data/trackerSeed';
import { USE_DEMO_DATA, request } from './api';

export const activityService = {
  async load(): Promise<TrackerData> {
    if (!USE_DEMO_DATA) return request<TrackerData>('/activity/summary');
    return buildTrackerSeed();
  },
  async save(data: TrackerData): Promise<void> {
    if (!USE_DEMO_DATA) await request<void>('/activity/sync', { method: 'PUT', body: JSON.stringify(data) });
  },
};
