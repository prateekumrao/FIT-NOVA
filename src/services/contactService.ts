// Purpose: Contact and feedback forms. Future endpoints: POST /contact, POST /feedback
import { USE_DEMO_DATA, delay, request } from './api';

export const contactService = {
  async sendMessage(payload: { name: string; email: string; message: string }): Promise<void> {
    if (!USE_DEMO_DATA) { await request<void>('/contact', { method: 'POST', body: JSON.stringify(payload) }); return; }
    await delay(700);
  },
  async sendFeedback(payload: { rating: number; comment: string }): Promise<void> {
    if (!USE_DEMO_DATA) { await request<void>('/feedback', { method: 'POST', body: JSON.stringify(payload) }); return; }
    await delay(700);
  },
};
