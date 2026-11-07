// ========================================
// pages/Contact.tsx
// Purpose: Contact form, feedback form with star rating, business email placeholder and social links.
// Future endpoints: POST /contact and POST /feedback (see services/contactService.ts)
// ========================================

// SECTION 1: IMPORTS
import { useState, type FormEvent } from 'react';
import { Mail, Star } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TextArea, TextField } from '../components/ui/Field';
import { contactService } from '../services/contactService';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../utils/cn';

const socials = [['X', 'https://x.com'], ['LinkedIn', 'https://www.linkedin.com'], ['Instagram', 'https://www.instagram.com'], ['YouTube', 'https://www.youtube.com']];

export default function Contact() {
  useDocumentTitle('Contact us');

  // SECTION 3: COMPONENT STATE
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'message', string>>>({});
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState(0); // 1-5 stars, 0 = not chosen
  const [comment, setComment] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);

  // SECTION 4: EVENT HANDLERS
  async function handleContact(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) next.message = 'Please write at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    await contactService.sendMessage(form);
    setSending(false);
    setForm({ name: '', email: '', message: '' });
    toast('Message sent. We will reply soon (demo)');
  }

  async function handleFeedback(e: FormEvent) {
    e.preventDefault();
    if (rating === 0) { toast('Please choose a star rating first'); return; }
    setFeedbackSending(true);
    await contactService.sendFeedback({ rating, comment });
    setFeedbackSending(false);
    setRating(0); setComment('');
    toast('Thank you for your feedback');
  }

  // SECTION 5: UI RENDERING
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <SectionHeading as="h1" title="Contact us" text="Questions, partnerships or ideas? We would love to hear from you." />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="mb-4 font-bold">Send a message</h2>
          <form onSubmit={handleContact} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            </div>
            <TextArea label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} />
            <Button type="submit" loading={sending}>Send message</Button>
          </form>
        </Card>
        <div className="space-y-5">
          <Card>
            <h2 className="font-bold">Business enquiries</h2>
            <a href="mailto:hello@fitnova.example" className="mt-3 flex items-center gap-2 text-sm text-accent hover:underline"><Mail size={16} />hello@fitnova.example</a>
            <p className="mt-1 text-xs text-soft">Placeholder address. Replace with your real business email.</p>
            <div className="mt-5 flex flex-wrap gap-2">{socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-xs text-soft transition hover:border-accent-muted hover:text-ink">{n}</a>)}</div>
          </Card>
          <Card>
            <h2 className="mb-3 font-bold">Quick feedback</h2>
            <form onSubmit={handleFeedback}>
              <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRating(n)} className="rounded-lg p-1"><Star size={24} className={cn('transition', n <= rating ? 'fill-accent text-accent' : 'text-line')} /></button>)}
              </div>
              <TextArea className="mt-3" aria-label="Feedback comment" placeholder="What can we improve?" value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button type="submit" variant="secondary" className="mt-3" loading={feedbackSending}>Send feedback</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
