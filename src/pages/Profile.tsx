// ========================================
// pages/Profile.tsx
// Purpose: View and edit the user's profile and fitness preferences.
// Future endpoint: PUT /users/me
// ========================================

// SECTION 1: IMPORTS
import { useState, type FormEvent } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Feedback';
import { SelectField, TextArea, TextField } from '../components/ui/Field';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Difficulty, User } from '../types';

export default function Profile() {
  useDocumentTitle('Profile');

  // SECTION 3: COMPONENT STATE
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  // A local copy of the form: changes are only saved when "Save changes" is pressed
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', bio: user?.bio ?? '', goal: user?.goal ?? '', level: user?.level ?? 'Beginner', diet: user?.diet ?? 'Vegetarian' });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // SECTION 4: EVENT HANDLERS
  function handleSave(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    setErrors(next);
    if (Object.keys(next).length) return;
    updateUser({ ...form, name: form.name.trim(), level: form.level as Difficulty, diet: form.diet as User['diet'] });
    toast('Profile saved');
  }

  // SECTION 5: UI RENDERING
  return (
    <div className="max-w-3xl">
      <SectionHeading as="h1" title="Profile" text="Keep your details and preferences up to date." />
      <Card className="mb-5 flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-accent-muted/30 text-2xl font-extrabold text-accent">{user?.name.charAt(0).toUpperCase()}</span>
        <div><p className="text-lg font-bold">{user?.name}</p><p className="text-sm text-soft">{user?.email}</p><div className="mt-2"><Badge>{user?.plan === 'free' ? 'Free plan' : user?.plan === 'pro' ? 'Pro plan' : 'Premium plan'}</Badge></div></div>
      </Card>
      <Card>
        <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2" noValidate>
          <TextField label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <SelectField label="Main goal" options={['Build a consistent routine', 'Improve stamina', 'Get stronger', 'Stay flexible and mobile', 'Eat more mindfully']} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          <SelectField label="Experience level" options={['Beginner', 'Intermediate', 'Advanced']} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Difficulty })} />
          <SelectField className="sm:col-span-2" label="Dietary preference" options={['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan']} value={form.diet} onChange={(e) => setForm({ ...form, diet: e.target.value as User['diet'] })} />
          <TextArea className="sm:col-span-2" label="About you" placeholder="Anything you'd like your coach to know" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <div className="flex gap-3 sm:col-span-2"><Button type="submit">Save changes</Button><Button type="button" variant="ghost" onClick={() => { setForm({ name: user?.name ?? '', email: user?.email ?? '', bio: user?.bio ?? '', goal: user?.goal ?? '', level: user?.level ?? 'Beginner', diet: user?.diet ?? 'Vegetarian' }); setErrors({}); }}>Reset</Button></div>
        </form>
      </Card>
    </div>
  );
}
