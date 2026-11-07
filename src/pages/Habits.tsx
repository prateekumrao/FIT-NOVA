// ========================================
// pages/Habits.tsx
// Purpose: Create, complete and delete daily habits; see streaks and weekly/monthly completion.
// ========================================

// SECTION 1: IMPORTS
import { useState, type FormEvent } from 'react';
import { Flame, Plus, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Segmented } from '../components/ui/Chip';
import { TextField } from '../components/ui/Field';
import { EmptyState } from '../components/ui/Feedback';
import SectionHeading from '../components/SectionHeading';
import ProgressRing from '../components/ProgressRing';
import { TrendChart } from '../components/charts/ActivityCharts';
import { useTracker } from '../context/TrackerContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { currentStreak, lastNDays, todayISO, weekdayLabel } from '../utils/dates';
import { habitPercent, habitPercentByWeek } from '../utils/stats';
import { cn } from '../utils/cn';

const periods = ['Weekly', 'Monthly'] as const;

export default function Habits() {
  useDocumentTitle('Habit Tracker');

  // SECTION 3: COMPONENT STATE
  const { habits, toggleHabit, addHabit, removeHabit } = useTracker();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<(typeof periods)[number]>('Weekly');

  const week = lastNDays(7);
  const percent = habitPercent(habits, lastNDays(period === 'Weekly' ? 7 : 30));

  // SECTION 4: EVENT HANDLERS
  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 3) { setError('Give your habit a name of at least 3 characters.'); return; }
    if (habits.some((h) => h.name.toLowerCase() === trimmed.toLowerCase())) { setError('You already track a habit with that name.'); return; }
    addHabit(trimmed);
    setName(''); setError('');
    toast('Habit added');
  }

  // SECTION 5: UI RENDERING
  return (
    <div className="space-y-6">
      <SectionHeading as="h1" title="Habit Tracker" text="Tap a day to mark a habit as done. Small, steady habits add up." />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-start" noValidate>
              <TextField className="flex-1" aria-label="New habit" placeholder="e.g. Read for 10 minutes" value={name} onChange={(e) => setName(e.target.value)} error={error} />
              <Button type="submit" icon={<Plus size={16} />}>Add habit</Button>
            </form>
          </Card>
          {habits.length === 0 ? <EmptyState title="No habits yet" text="Add your first habit above to start a streak." /> : habits.map((h) => (
            <Card key={h.id}>
              <div className="flex items-start justify-between gap-3">
                <div><h2 className="font-bold">{h.name}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-soft"><Flame size={14} className="text-accent" />{currentStreak(h.doneDates)}-day streak</p></div>
                <button onClick={() => { removeHabit(h.id); toast('Habit removed'); }} aria-label={`Delete ${h.name}`} className="rounded-lg p-2 text-soft hover:text-red-300"><Trash2 size={16} /></button>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2">
                {week.map((d) => {
                  const done = h.doneDates.includes(d);
                  return (
                    <button key={d} onClick={() => toggleHabit(h.id, d)} aria-pressed={done} aria-label={`${h.name} on ${d}`}
                      className={cn('flex flex-col items-center gap-1 rounded-xl border py-2 text-xs transition', done ? 'border-accent-muted bg-accent/15 text-accent' : 'border-line text-soft hover:border-accent-muted', d === todayISO() && 'ring-1 ring-accent-2/40')}>
                      {weekdayLabel(d)}<span className="text-base">{done ? '✓' : '·'}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-5">
          <Card>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Completion</h2><Segmented options={periods} value={period} onChange={setPeriod} /></div>
            <div className="flex items-center gap-4"><ProgressRing value={percent} label={`${period} habit completion`} /><p className="text-sm text-soft">of check-ins done in the last {period === 'Weekly' ? '7' : '30'} days</p></div>
          </Card>
          <Card>
            <h2 className="mb-1 font-bold">Weekly trend</h2><p className="mb-3 text-sm text-soft">Completion by week</p>
            <TrendChart data={habitPercentByWeek(habits, 4)} height={190} />
          </Card>
        </div>
      </div>
    </div>
  );
}
