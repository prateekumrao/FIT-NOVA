// ========================================
// pages/Dashboard.tsx
// Purpose: Overview of the week: activity, habits, water, workout history, notifications and quick actions.
// All numbers are computed from the DEMO tracker data in context/TrackerContext.tsx.
// ========================================

// SECTION 1: IMPORTS
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, Circle, Droplets, Dumbbell, Flame, Plus, Salad, Sparkles, Timer } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Feedback';
import ProgressRing from '../components/ProgressRing';
import { BarsChart } from '../components/charts/ActivityCharts';
import { useAuth } from '../context/AuthContext';
import { useTracker } from '../context/TrackerContext';
import { useNotifications } from '../context/NotificationsContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { currentStreak, lastNDays, todayISO, weekdayLabel } from '../utils/dates';

const WATER_GOAL_ML = 2500;

export default function Dashboard() {
  useDocumentTitle('Dashboard');

  // SECTION 3: COMPONENT STATE
  const { user } = useAuth();
  const { activities, habits, water, toggleHabit, addWater } = useTracker();
  const { notifications } = useNotifications();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true); // short fake loading time to show skeletons

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Derived numbers (recomputed only when data changes)
  const stats = useMemo(() => {
    const week = lastNDays(7);
    const weekData = week.map((d) => ({ label: weekdayLabel(d), value: activities.filter((a) => a.date === d).reduce((sum, a) => sum + a.minutes, 0) }));
    const weekMinutes = weekData.reduce((s, d) => s + d.value, 0);
    const weekSessions = activities.filter((a) => week.includes(a.date)).length;
    const activeDays = Array.from(new Set(activities.map((a) => a.date)));
    const sorted = [...activities].sort((a, b) => b.date.localeCompare(a.date));
    return { weekData, weekMinutes, weekSessions, streak: currentStreak(activeDays), recent: sorted.slice(0, 5), workouts: sorted.filter((a) => a.type === 'Workout').slice(0, 3) };
  }, [activities]);

  const today = todayISO();
  const doneToday = habits.filter((h) => h.doneDates.includes(today)).length;
  const habitPercent = habits.length ? (doneToday / habits.length) * 100 : 0;
  const waterToday = water[today] ?? 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // SECTION 4: EVENT HANDLERS
  function handleAddWater() { addWater(250); toast('Added 250 ml of water'); }

  // SECTION 5: UI RENDERING
  if (loading) {
    return (<div className="space-y-5"><Skeleton className="h-16 w-72" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}</div><Skeleton className="h-72" /></div>);
  }

  const summary = [
    { label: 'Active minutes (7 days)', value: stats.weekMinutes, icon: Timer },
    { label: 'Sessions this week', value: stats.weekSessions, icon: Dumbbell },
    { label: 'Active-day streak', value: `${stats.streak} days`, icon: Flame },
    { label: 'Water today', value: `${(waterToday / 1000).toFixed(2)} L`, icon: Droplets },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{greeting}, {user?.name.split(' ')[0]}</h1>
          <p className="mt-1 text-soft">Here is how your week is going. Figures below are demo data.</p>
        </div>
        <Button to="/app/activity" icon={<Plus size={16} />}>Log activity</Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map(({ label, value, icon: Icon }) => (
          <Card key={label} interactive><Icon size={20} className="text-accent" /><p className="mt-4 text-3xl font-extrabold">{value}</p><p className="mt-1 text-sm text-soft">{label}</p></Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-bold">Weekly activity</h2>
          <p className="mb-4 text-sm text-soft">Active minutes per day</p>
          <BarsChart data={stats.weekData} />
        </Card>
        <Card>
          <h2 className="font-bold">Today's habits</h2>
          <div className="my-4 flex items-center gap-4"><ProgressRing value={habitPercent} label="Habits done today" /><p className="text-sm text-soft">{doneToday} of {habits.length} habits done</p></div>
          <ul className="space-y-1">
            {habits.slice(0, 4).map((h) => {
              const done = h.doneDates.includes(today);
              return (
                <li key={h.id}>
                  <button onClick={() => toggleHabit(h.id, today)} aria-pressed={done} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition hover:bg-panel">
                    {done ? <CheckCircle2 size={18} className="text-accent" /> : <Circle size={18} className="text-soft" />}<span className={done ? 'text-soft line-through' : ''}>{h.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-bold">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={handleAddWater} className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 p-4 text-left transition hover:border-accent-muted"><Droplets className="text-accent" size={20} /><span><span className="block text-sm font-semibold">Add a glass of water</span><span className="text-xs text-soft">+250 ml, goal {WATER_GOAL_ML / 1000} L</span></span></button>
            <Link to="/app/nutrition" className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 p-4 transition hover:border-accent-muted"><Salad className="text-accent" size={20} /><span><span className="block text-sm font-semibold">Log a meal</span><span className="text-xs text-soft">Pick from the food library</span></span></Link>
            <Link to="/app/workouts" className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 p-4 transition hover:border-accent-muted"><Dumbbell className="text-accent" size={20} /><span><span className="block text-sm font-semibold">Find a workout</span><span className="text-xs text-soft">Home and gym options</span></span></Link>
            <Link to="/app/habits" className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 p-4 transition hover:border-accent-muted"><CheckCircle2 className="text-accent" size={20} /><span><span className="block text-sm font-semibold">Review habits</span><span className="text-xs text-soft">Keep your streaks alive</span></span></Link>
          </div>
          <Link to="/app/coach" className="mt-3 flex items-center gap-4 rounded-xl border border-accent-muted/40 bg-gradient-to-r from-raised to-panel p-4 transition hover:border-accent-muted">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent"><Sparkles size={20} /></span>
            <span><span className="block font-semibold">Ask your AI Coach</span><span className="text-sm text-soft">Get a plan, a meal idea or a habit tip.</span></span>
          </Link>
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Bell size={16} className="text-accent" />Notifications</h2>
          <ul className="space-y-3">
            {notifications.map((n) => <li key={n.id} className="text-sm"><p className="font-medium">{n.title}</p><p className="text-xs text-soft">{n.body}</p></li>)}
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-bold">Recent activity</h2>
          <ul className="divide-y divide-line">
            {stats.recent.map((a) => <li key={a.id} className="flex items-center justify-between py-3 text-sm"><span>{a.type}{a.distanceKm ? ` · ${a.distanceKm} km` : ''}</span><span className="text-soft">{a.minutes} min · {new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></li>)}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">Workout history</h2>
          {stats.workouts.length === 0 ? <p className="text-sm text-soft">No workouts logged yet.</p> : (
            <ul className="divide-y divide-line">
              {stats.workouts.map((a) => <li key={a.id} className="flex items-center justify-between py-3 text-sm"><span className="flex items-center gap-2"><Dumbbell size={15} className="text-accent" />Workout</span><span className="text-soft">{a.minutes} min · {new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></li>)}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
