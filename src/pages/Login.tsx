// ========================================
// pages/Login.tsx
// Purpose: Sign-in form with validation, password show/hide, forgot-password view and a demo shortcut.
// Authentication is DEMO ONLY (see services/authService.ts).
// ========================================

// SECTION 1: IMPORTS
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { TextField } from '../components/ui/Field';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// SECTION 2: TYPES AND INTERFACES
interface Errors { email?: string; password?: string }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  useDocumentTitle('Log in');

  // SECTION 3: COMPONENT STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // toggled by the eye button
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false); // true = show the "reset password" form
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/app/dashboard';

  // SECTION 4: EVENT HANDLERS
  /** Check the fields and return an error object (empty when everything is valid). */
  function validate(requirePassword: boolean): Errors {
    const next: Errors = {};
    if (!emailPattern.test(email)) next.email = 'Enter a valid email address.';
    if (requirePassword && password.length < 6) next.password = 'Password must be at least 6 characters.';
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop the browser from reloading the page
    const found = validate(!forgotMode);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      if (forgotMode) {
        await authService.forgotPassword(email);
        toast('If that email exists, a reset link has been sent (demo)');
        setForgotMode(false);
      } else {
        await login(email, password);
        navigate(redirectTo, { replace: true });
      }
    } catch {
      toast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // One-click demo account so reviewers can explore quickly
  async function handleDemo() {
    setLoading(true);
    await login('demo@fitnova.ai', 'demo1234');
    navigate('/app/dashboard', { replace: true });
  }

  // SECTION 5: UI RENDERING
  return (
    <Card>
      <h1 className="text-2xl font-extrabold">{forgotMode ? 'Reset your password' : 'Welcome back'}</h1>
      <p className="mt-1 text-sm text-soft">{forgotMode ? 'Enter your email and we will send a reset link.' : 'Log in to continue your routine.'}</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" icon={<Mail size={16} />} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        {!forgotMode && (
          <TextField label="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="At least 6 characters" icon={<Lock size={16} />}
            value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}
            right={<button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="rounded-lg p-2 text-soft hover:text-ink">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>} />
        )}
        {!forgotMode && <div className="text-right"><button type="button" onClick={() => setForgotMode(true)} className="text-sm text-accent hover:underline">Forgot password?</button></div>}
        <Button type="submit" className="w-full" loading={loading}>{forgotMode ? 'Send reset link' : 'Log in'}</Button>
        {forgotMode ? (
          <Button type="button" variant="ghost" className="w-full" onClick={() => setForgotMode(false)}>Back to log in</Button>
        ) : (
          <Button type="button" variant="secondary" className="w-full" onClick={handleDemo} disabled={loading}>Use demo account</Button>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-soft">New to FitNova? <Link to="/register" className="font-semibold text-accent hover:underline">Create an account</Link></p>
    </Card>
  );
}
