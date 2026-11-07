// Purpose: Subscription plans. Future endpoints: GET /subscriptions/plans, POST /subscriptions/checkout.
// IMPORTANT: no real payment is implemented. Payments must be handled by a PCI-compliant provider on the backend.
import type { Plan, PlanId } from '../types';
import { plans } from '../data/marketing';
import { USE_DEMO_DATA, delay, request } from './api';

export const subscriptionService = {
  async listPlans(): Promise<Plan[]> {
    if (!USE_DEMO_DATA) return request<Plan[]>('/subscriptions/plans');
    return plans;
  },
  async changePlan(planId: PlanId): Promise<PlanId> {
    if (!USE_DEMO_DATA) { await request<void>('/subscriptions/change', { method: 'POST', body: JSON.stringify({ planId }) }); return planId; }
    await delay(500);
    return planId;
  },
};
