// ========================================
// pages/ActivityTracker.tsx
// Purpose: Daily activity log, walking/running records, workout history, water, sleep,
// weekly/monthly summaries and a calendar. Data lives in context/TrackerContext.tsx (demo).
// ========================================

// SECTION 1: IMPORTS
import { useMemo, useState, type FormEvent } from 'react';
import { Droplets, Footprints, Moon, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Segmented } from '../components/ui/Chip';
import { SelectField, TextField } from '../components/ui/Field';
import SectionHeading from '../components/SectionHeading';
import ActivityCalendar from '../components/ActivityCalendar';
import { BarsChart } from '../components/charts/ActivityCharts';
import { useTracker } from '../context/TrackerContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { lastNDays, todayISO } from '../utils/dates';
import { minutesByDay, minutesByWeek } from '../utils/stats';
import type { ActivityType } from '../types';

// SECTION 2: TYPES AND INTERFACES
const activityTypes: ActivityType[] = ['Walk', 'Run', 'Workout', 'Cycling', 'Yoga'];
const distanceTypes: ActivityType[] = ['Walk', 'Run', 'Cycling'];
const periods = ['Weekly', 'Monthly'] as const;
const WATER_GOAL_ML = 2500;

export default function ActivityTracker() {
  useDocumentTitle('Activity Tracker');

  // SECTION 3: COMPONENT STATE
  const { activities, addActivity, removeActivity, water, addWater, sleep, addSleep } = useTracker();
  const { toast } = useToast();
  const [period, setPeriod] = useState<(typeof periods)[number]>('Weekly');
  const [selectedDate, setSelectedDate] = useState(todayISO()); // day chosen on the calendar
  const [form, setForm] = useState({ type: 'Walk' as ActivityType, minutes: '30', distance: '', date: todayISO(), note: '' });
  const [formError, setFormError] = useState('');
  const [sleepForm, setSleepForm] = useState({ bedtime: '22:30', hours: '7.5' });

  const waterToday = water[todayISO()] ?? 0;
  const chartData = useMemo(() => (period === 'Weekly' ? minutesByDay(activities, lastNDays(7)) : minutesByWeek(activities, 4)), [activities, period]);
  const periodDays = lastNDays(period === 'Weekly' ? 7 : 28);
  const inPeriod = activities.filter((a) => periodDays.includes(a.date));
  const totalMinutes = inPeriod.reduce((s, a) => s + a.minutes, 0);
  const totalKm = inPeriod.filter((a) => a.type === 'Walk' || a.type === 'Run').reduce((s, a) => s + (a.distanceKm ?? 0), 0);
  const dayLogs = activities.filter((a) => a.date === selectedDate);
  const records = [...activities].filter((a) => a.type === 'Walk' || a.type === 'Run').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const workoutHistory = [...activities].filter((a) => a.type === 'Workout').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const prettyDate = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  // SECTION 4: EVENT HANDLERS
  function handleAddActivity(e: FormEvent) {
    e.preventDefault();
    const minutes = Number(form.minutes);
    if (!minutes || minutes < 1 || minutes > 600) { setFormError('Enter minutes between 1 and 600.'); return; }
    setFormError('');
    addActivity({ date: form.date, type: form.type, minutes, distanceKm: distanceTypes.includes(form.type) && form.distance ? Number(form.distance) : undefined, note: form.note || undefined });
    toast(`${form.type} logged`);
    setForm((f) => ({ ...f, distance: '', note: '' }));
  }

  function handleSaveSleep(e: FormEvent) {
    e.preventDefault();
    const hours = Number(sleepForm.hours);
    if (!hours || hours < 1 || hours > 14) { toast('Enter sleep hours between 1 and 14'); return; }
    addSleep({ date: todayISO(), bedtime: sleepForm.bedtime, hours });
    toast('Sleep saved');
  }

  // SECTION 5: UI RENDERING
  return (
    <div className="space-y-6">
      <SectionHeading as="h1" title="Activity Tracker" text="Log your day and see weekly and monthly trends. Demo data is pre-filled." />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-bold">{period} summary</h2><p className="text-sm text-soft">{totalMinutes} active minutes · {totalKm.toFixed(1)} km walked or run</p></div>
            <Segmented options={periods} value={period} onChange={setPeriod} />
          </div>
          <BarsChart data={chartData} />
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-bold"><Droplets size={17} className="text-accent" />Water today</h2>
          <p className="mt-3 text-3xl font-extrabold">{(waterToday / 1000).toFixed(2)} L <span className="text-sm font-medium text-soft">of {WATER_GOAL_ML / 1000} L</span></p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel"><div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${Math.min(100, (waterToday / WATER_GOAL_ML) * 100)}%` }} /></div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Button size="sm" variant="secondary" onClick={() => addWater(-250)} disabled={waterToday === 0}>-250 ml</Button>
            <Button size="sm" onClick={() => { addWater(250); toast('Added 250 ml'); }}>+250 ml</Button>
            <Button size="sm" onClick={() => { addWater(500); toast('Added 500 ml'); }}>+500 ml</Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">Log an activity</h2>
          <form onSubmit={handleAddActivity} className="grid gap-4 sm:grid-cols-2" noValidate>
            <SelectField label="Type" options={activityTypes} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ActivityType })} />
            <TextField label="Minutes" type="number" min={1} value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} error={formError} />
            {distanceTypes.includes(form.type) && <TextField label="Distance (km, optional)" type="number" step="0.1" min={0} value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} />}
            <TextField label="Date" type="date" max={todayISO()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <TextField className="sm:col-span-2" label="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <Button type="submit" className="sm:col-span-2">Add to log</Button>
          </form>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 font-bold"><Moon size={17} className="text-accent" />Sleep routine</h2>
          <form onSubmit={handleSaveSleep} className="mt-4 grid grid-cols-2 gap-4">
            <TextField label="Bedtime" type="time" value={sleepForm.bedtime} onChange={(e) => setSleepForm({ ...sleepForm, bedtime: e.target.value })} />
            <TextField label="Hours slept" type="number" step="0.5" min={1} max={14} value={sleepForm.hours} onChange={(e) => setSleepForm({ ...sleepForm, hours: e.target.value })} />
            <Button type="submit" variant="secondary" className="col-span-2">Save last night's sleep</Button>
          </form>
          <ul className="mt-4 divide-y divide-line text-sm">
            {sleep.slice(0, 4).map((s) => <li key={s.date} className="flex justify-between py-2.5"><span>{prettyDate(s.date)}</span><span className="text-soft">{s.hours} h · bed {s.bedtime}</span></li>)}
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">Calendar</h2>
          <ActivityCalendar activeDates={Array.from(new Set(activities.map((a) => a.date)))} selected={selectedDate} onSelect={setSelectedDate} />
        </Card>
        <Card>
          <h2 className="font-bold">{selectedDate === todayISO() ? 'Today' : prettyDate(selectedDate)}</h2>
          {dayLogs.length === 0 ? <p className="mt-4 text-sm text-soft">No activity logged for this day. Use the form above to add one.</p> : (
            <ul className="mt-3 divide-y divide-line">
              {dayLogs.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span><span className="font-medium">{a.type}</span> · {a.minutes} min{a.distanceKm ? ` · ${a.distanceKm} km` : ''}{a.note && <span className="block text-xs text-soft">{a.note}</span>}</span>
                  <button onClick={() => { removeActivity(a.id); toast('Entry removed'); }} aria-label="Delete entry" className="rounded-lg p-2 text-soft hover:text-red-300"><Trash2 size={15} /></button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 flex items-center gap-2 font-bold"><Footprints size={17} className="text-accent" />Walking and running records</h2>
          <ul className="divide-y divide-line text-sm">{records.map((a) => <li key={a.id} className="flex justify-between py-2.5"><span>{prettyDate(a.date)} · {a.type}</span><span className="text-soft">{a.distanceKm ?? '–'} km · {a.minutes} min</span></li>)}</ul>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">Workout history</h2>
          <ul className="divide-y divide-line text-sm">{workoutHistory.length === 0 ? <li className="py-2.5 text-soft">No workouts logged yet.</li> : workoutHistory.map((a) => <li key={a.id} className="flex justify-between py-2.5"><span>{prettyDate(a.date)}</span><span className="text-soft">{a.minutes} min</span></li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
