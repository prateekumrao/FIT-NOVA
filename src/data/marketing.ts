// ========================================
// data/marketing.ts
// Purpose: Copy for the public pages (features, plans, FAQ, sample testimonials).
// Plans can later come from GET /api/subscriptions/plans. Prices are illustrative.
// ========================================
import type { Plan } from '../types';

export const plans: Plan[] = [
  { id: 'free', name: 'Free', price: 0, blurb: 'Start building healthy habits.',
    features: ['Basic fitness library', 'Limited AI Coach', 'Basic activity tracking'] },
  { id: 'pro', name: 'Pro', price: 199, blurb: 'For people who want guidance every day.', highlight: true,
    features: ['Higher AI usage', 'Nutrition education', 'Advanced activity reports', 'Personal preferences'] },
  { id: 'premium', name: 'Premium', price: 299, blurb: 'The complete FitNova experience.',
    features: ['Everything in Pro', 'Voice AI features', 'More detailed insights', 'Additional learning content'] },
];

export const features = [
  { icon: 'Sparkles', title: 'AI Fitness Coach', text: 'Ask questions about workouts, habits and food in plain language and get clear, educational answers.' },
  { icon: 'Dumbbell', title: 'Workout Library', text: 'Home and gym exercises with step-by-step instructions and safety tips for every level.' },
  { icon: 'Salad', title: 'Indian Food Library', text: 'Dal, roti, paneer, chana and more with estimated protein, carbs and fat.' },
  { icon: 'Activity', title: 'Activity Tracking', text: 'Log walks, runs, workouts, water and sleep in a few taps.' },
  { icon: 'CheckCircle2', title: 'Habit Tracker', text: 'Build streaks with small daily habits that fit your routine.' },
  { icon: 'LineChart', title: 'Progress Reports', text: 'See weekly and monthly trends in your own activity. No body comparisons.' },
];

export const steps = [
  { title: 'Tell us about you', text: 'Pick your goal, experience level and food preferences in a short setup.' },
  { title: 'Get guidance', text: 'Chat with the AI Coach and browse workouts and foods that suit you.' },
  { title: 'Track the basics', text: 'Log activity, water, sleep and habits each day.' },
  { title: 'Review your trends', text: 'Open weekly and monthly reports and celebrate your milestones.' },
];

/** SAMPLE testimonials. They are placeholder content, not real customers. */
export const testimonials = [
  { name: 'Sample User A', role: 'Beginner, Pune', text: 'The habit streaks made walking every morning feel easy to keep up.' },
  { name: 'Sample User B', role: 'Home workouts, Jaipur', text: 'I liked that the exercise cards explain safety tips before I start.' },
  { name: 'Sample User C', role: 'Vegetarian, Lucknow', text: 'Seeing protein in everyday dal and paneer portions was genuinely useful.' },
];

export const faqs = [
  { q: 'Is FitNova AI a replacement for a doctor or trainer?', a: 'No. FitNova AI provides general educational information. Please speak with a qualified professional before changing your exercise or diet, especially if you have a health condition.' },
  { q: 'Is the data on this site real?', a: 'This build uses clearly labelled demo data. Real accounts, AI responses and payments will be added when the backend is connected.' },
  { q: 'Do you support Indian foods?', a: 'Yes. The food library includes common Indian foods such as dal, roti, rice, chana, paneer, milk, vegetables and fruits, with estimated nutrition values.' },
  { q: 'Can I use it on my phone?', a: 'Yes. The layout adapts to desktop, tablet, Android and iPhone screens.' },
  { q: 'How much does it cost?', a: 'The Free plan costs nothing. Pro is illustrated at ₹199/month and Premium at ₹299/month. Prices may change before launch.' },
];
