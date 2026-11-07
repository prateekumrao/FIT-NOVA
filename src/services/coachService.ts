// ========================================
// services/coachService.ts
// Purpose: Sends a message to the AI Coach and returns the reply.
// Future endpoint: POST /coach/chat -> FastAPI -> cloud AI API (the key stays on the server).
// ========================================
import type { ChatMessage } from '../types';
import { getMockReply } from '../data/coachReplies';
import { USE_DEMO_DATA, delay, request } from './api';

export const coachService = {
  /** `history` lets the real backend keep context. The demo ignores it. */
  async sendMessage(text: string, history: ChatMessage[]): Promise<string> {
    if (!USE_DEMO_DATA) {
      const data = await request<{ reply: string }>('/coach/chat', { method: 'POST', body: JSON.stringify({ message: text, history }) });
      return data.reply;
    }
    await delay(1400); // simulate "thinking" so the typing indicator is visible
    return getMockReply(text);
  },
};
