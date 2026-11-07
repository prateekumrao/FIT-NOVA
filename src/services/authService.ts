// ========================================
// services/authService.ts
// Purpose: Login / register / password reset. DEMO ONLY: any valid email + 6+ char password works.
// Future endpoints (FastAPI): POST /auth/login, POST /auth/register, POST /auth/forgot-password
// ========================================
import type { User } from '../types';
import { USE_DEMO_DATA, delay, request } from './api';

function buildDemoUser(email: string, name?: string): User {
  const fallbackName = email.split('@')[0].replace(/[._-]/g, ' ');
  return {
    id: 'demo-user', name: name?.trim() || fallbackName.replace(/\b\w/g, (c) => c.toUpperCase()), email,
    bio: '', plan: 'free', goal: 'Build a consistent routine', level: 'Beginner', diet: 'Vegetarian', language: 'English', onboarded: false,
  };
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    if (!USE_DEMO_DATA) return request<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    await delay();
    // Demo accounts are marked onboarded so the dashboard opens straight away.
    return { ...buildDemoUser(email), onboarded: true };
  },
  async register(name: string, email: string, password: string): Promise<User> {
    if (!USE_DEMO_DATA) return request<User>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    await delay();
    return buildDemoUser(email, name);
  },
  async forgotPassword(email: string): Promise<void> {
    if (!USE_DEMO_DATA) { await request<void>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }); return; }
    await delay();
  },
};
