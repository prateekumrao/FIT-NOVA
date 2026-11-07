// ========================================
// data/coachReplies.ts
// Purpose: MOCK AI Coach replies chosen by keyword. services/coachService.ts calls this in demo mode.
// When the real AI API is ready, delete this file's usage and call POST /api/coach/chat instead.
// ========================================

export const suggestedQuestions = [
  'Plan a 3-day beginner workout week',
  'How much protein is in dal and paneer?',
  'How can I build a morning walking habit?',
  'What helps with muscle soreness?',
  'How much water should I drink?',
];

const replies: Array<{ keys: string[]; text: string }> = [
  { keys: ['plan', 'week', 'beginner', 'routine'],
    text: 'Here is a simple beginner week:\n\nMon: 20 min brisk walk + bodyweight squats, incline push-ups, plank (2 rounds)\nWed: 25 min easy cycling or walking + mobility (cat-cow, hip circles)\nFri: Full-body round (squats, rows, plank) + 10 min stretching\n\nRest on other days, light walking is fine. Increase one thing at a time, such as an extra round or 5 more minutes.' },
  { keys: ['protein', 'dal', 'paneer', 'diet', 'food', 'eat'],
    text: 'Rough estimates: a katori of cooked dal gives about 9 g protein, 100 g paneer about 18 g, a glass of milk about 8 g and a katori of chana about 9 g. Combining dal with roti or rice at the same meal gives a fuller range of amino acids. Needs vary by person, so a registered dietitian can personalise this.' },
  { keys: ['walk', 'habit', 'morning', 'consistent', 'motivat'],
    text: 'Try making the habit tiny: put your shoes by the door and walk for just 10 minutes at the same time every day. Tie it to something you already do, like after your morning tea. Track it in the Habit Tracker and protect the streak, not the pace.' },
  { keys: ['sore', 'soreness', 'recovery', 'pain'],
    text: 'Mild soreness after new exercise is common. Gentle walking, mobility work, enough sleep and water usually help. Sharp pain, swelling or pain that lasts more than a few days should be checked by a healthcare professional.' },
  { keys: ['water', 'hydrate', 'drink'],
    text: 'Many adults aim for roughly 2 to 3 litres of fluids a day, but needs depend on weather, activity and body size. Pale-yellow urine and not feeling thirsty are simple signals. You can log glasses in the Activity Tracker.' },
  { keys: ['sleep', 'tired', 'rest'],
    text: 'Most adults do well with 7 to 9 hours. A steady bedtime, dim lights and no screens for 30 minutes before bed can help. Log your sleep in the tracker to spot your own pattern.' },
];

const fallback = 'Great question. I can help with beginner workouts, simple meal ideas, habits, water and sleep. Try asking something like "Plan a 3-day beginner workout week". This is a demo response, and the real AI Coach will be connected later.';

/** Pick the first reply whose keywords appear in the user's message. */
export function getMockReply(message: string): string {
  const lower = message.toLowerCase();
  const match = replies.find((r) => r.keys.some((k) => lower.includes(k)));
  return match ? match.text : fallback;
}
