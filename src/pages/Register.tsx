// ========================================
// pages/Register.tsx
// Purpose: Sign-up form with validation, password toggle and required privacy/terms acceptance.
// ========================================

// SECTION 1: IMPORTS
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { TextField } from '../components/ui/Field';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// SECTION 2: TYPES AND INTERFACES
interface Errors { name?: string; email?: string; password?: string; confirm?: string; terms?: string }

export default function Register() {
  useDocumentTitle('Create account');

  // SECTION 3: COMPONENT STATE
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [accepted, setAccepted] = useState(false); // privacy + terms checkbox
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // SECTION 4: EVENT HANDLERS
  // Returns a function that updates one field, so each input needs only one line
  const setField = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate(): Errors {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    if (!accepted) next.terms = 'Please accept the Privacy Policy and Terms to continue.';
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    await register(form.name, form.email, form.password);
    navigate('/onboarding', { replace: true }); // new users continue to onboarding
  }

  // SECTION 5: UI RENDERING
  return (
    <Card>
      <h1 className="text-2xl font-extrabold">Create your account</h1>
      <p className="mt-1 text-sm text-soft">Free to start. No payment details needed.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <TextField label="Full name" autoComplete="name" icon={<User size={16} />} value={form.name} onChange={setField('name')} error={errors.name} />
        <TextField label="Email" type="email" autoComplete="email" icon={<Mail size={16} />} value={form.email} onChange={setField('email')} error={errors.email} />
        <TextField label="Password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" icon={<Lock size={16} />} value={form.password} onChange={setField('password')} error={errors.password}
          right={<button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="rounded-lg p-2 text-soft hover:text-ink">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>} />
        <TextField label="Confirm password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" icon={<Lock size={16} />} value={form.confirm} onChange={setField('confirm')} error={errors.confirm} />
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-soft">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-[#98BE9C]" />
            <span>I agree to the <Link to="/terms" target="_blank" className="text-accent underline">Terms and Conditions</Link> and <Link to="/privacy" target="_blank" className="text-accent underline">Privacy Policy</Link>.</span>
          </label>
          {errors.terms && <p className="mt-1.5 text-xs text-red-300" role="alert">{errors.terms}</p>}
        </div>
        <Button type="submit" className="w-full" loading={loading}>Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-soft">Already have an account? <Link to="/login" className="font-semibold text-accent hover:underline">Log in</Link></p>
    </Card>
  );
}
