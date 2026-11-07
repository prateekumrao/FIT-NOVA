// ========================================
// pages/Onboarding.tsx
// Purpose: Four-step setup (goal, level, food preference, language). Saved to the demo user profile.
// Future endpoint: PUT /users/me/preferences
// ========================================

// SECTION 1: IMPORTS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Difficulty, User } from '../types';

// SECTION 2: TYPES AND INTERFACES
const goals = ['Build a consistent routine', 'Improve stamina', 'Get stronger', 'Stay flexible and mobile', 'Eat more mindfully'];
const levels: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const diets: User['diet'][] = ['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan'];
const languages = ['English', 'Hindi'];

export default function Onboarding() {
  useDocumentTitle('Set up your profile');

  // SECTION 3: COMPONENT STATE
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0..3
  const [goal, setGoal] = useState(goals[0]);
  const [level, setLevel] = useState<Difficulty>('Beginner');
  const [diet, setDiet] = useState<User['diet']>('Vegetarian');
  const [language, setLanguage] = useState('English');

  // SECTION 4: EVENT HANDLERS
  function finish() {
    updateUser({ goal, level, diet, language, onboarded: true });
    navigate('/app/dashboard', { replace: true });
  }

  const titles = ['What is your main goal?', 'How would you describe your experience?', 'Any food preference?', 'Pick your language'];
  const total = titles.length;

  // SECTION 5: UI RENDERING
  return (
    <Card>
      <p className="text-sm text-soft">Hi {user?.name.split(' ')[0]}, step {step + 1} of {total}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-panel" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold">{titles[step]}</h1>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {step === 0 && goals.map((g) => <Chip key={g} active={goal === g} onClick={() => setGoal(g)}>{g}</Chip>)}
        {step === 1 && levels.map((l) => <Chip key={l} active={level === l} onClick={() => setLevel(l)}>{l}</Chip>)}
        {step === 2 && diets.map((d) => <Chip key={d} active={diet === d} onClick={() => setDiet(d)}>{d}</Chip>)}
        {step === 3 && languages.map((l) => <Chip key={l} active={language === l} onClick={() => setLanguage(l)}>{l}</Chip>)}
      </div>
      {step === 3 && <p className="mt-4 text-xs text-soft">Hindi is saved as a preference for now. Translated content is part of the roadmap.</p>}
      <div className="mt-8 flex justify-between gap-3">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
        {step < total - 1 ? <Button onClick={() => setStep((s) => s + 1)}>Continue</Button> : <Button onClick={finish}>Finish setup</Button>}
      </div>
    </Card>
  );
}
