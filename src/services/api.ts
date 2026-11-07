// ========================================
// services/api.ts
// Purpose: One shared HTTP helper for the future FastAPI backend.
// All service files (authService, coachService, ...) call `request()` when demo mode is OFF.
// SECURITY: never put API keys here. Cloud AI keys live only on the FastAPI server.
// ========================================

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

/** Demo mode is ON unless .env sets VITE_USE_DEMO=false. */
export const USE_DEMO_DATA: boolean = import.meta.env.VITE_USE_DEMO !== 'false';

/** Pretend the network takes a moment, so loading states can be seen in demo mode. */
export const delay = (ms = 600): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic JSON request. The login token (issued by the backend) is sent as a Bearer header.
 * Example: const plans = await request<Plan[]>('/subscriptions/plans');
 */
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('fitnova.token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return (await response.json()) as T;
}
