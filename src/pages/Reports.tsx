// ========================================
// pages/Reports.tsx
// Purpose: Personal trend reports (activity, consistency, habits), milestones and report download.
// Focus is on your own habits over time, never on body comparisons.
// ========================================

// SECTION 1: IMPORTS
import { useMemo, useState } from 'react';
import { Download, Trophy } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Segmented } from '../components/ui/Chip';
import { SelectField } from '../components/ui/Field';
import SectionHeading from '../components/SectionHeading';
import { BarsChart, TrendChart } from '../components/charts/ActivityCharts';
import { useTracker } from '../context/TrackerContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { currentStreak, lastNDays } from '../utils/dates';
import { habitPercent, habitPercentByWeek, minutesByDay, minutesByWeek, sessionsByWeek } from '../utils/stats';
import { downloadFile } from '../utils/download';

const periods = ['Weekly', 'Monthly'] as const;
const WATER_GOAL_ML = 2500;

export default function Reports() {
  useDocumentTitle('Progress Reports');

  // SECTION 3: COMPONENT STATE
  const { activities, habits, water } = useTracker();
  const { user } = useAuth();
  const { toast } = useToast();
  const [period, setPeriod] = useState<(typeof periods)[number]>('Weekly');
  const [format, setFormat] = useState('Text summary (.txt)'); // download format

  const weeks = period === 'Weekly' ? 1 : 4;
  const days = lastNDays(weeks * 7);

  const data = useMemo(() => {
    const activeDates = Array.from(new Set(activities.map((a) => a.date)));
    const inPeriod = activities.filter((a) => days.includes(a.date));
    return {
      activityChart: period === 'Weekly' ? minutesByDay(activities, days) : minutesByWeek(activities, 4),
      consistency: sessionsByWeek(activities, 4),
      habitTrend: habitPercentByWeek(habits, 4),
      minutes: inPeriod.reduce((s, a) => s + a.minutes, 0),
      sessions: inPeriod.length,
      habitPct: habitPercent(habits, days),
      streak: currentStreak(activeDates),
      totalMinutes: activities.reduce((s, a) => s + a.minutes, 0),
      totalSessions: activities.length,
      waterDays: Object.values(water).filter((ml) => ml >= WATER_GOAL_ML).length,
    };
  }, [activities, habits, water, period]); // eslint-disable-line react-hooks/exhaustive-deps

  // Milestones: each has a current value and a target. Achieved when current >= target.
  const milestones = [
    { title: 'First 500 active minutes', current: data.totalMinutes, target: 500 },
    { title: '20 logged sessions', current: data.totalSessions, target: 20 },
    { title: '7-day active streak', current: data.streak, target: 7 },
    { title: 'Hit your water goal on 10 days', current: data.waterDays, target: 10 },
  ];

  // SECTION 4: EVENT HANDLERS
  /** Builds the report in the browser and downloads it. A real backend could return a PDF instead. */
  function handleDownload() {
    const title = `FitNova AI ${period.toLowerCase()} report`;
    if (format.includes('CSV')) {
      const rows = ['date,type,minutes,distance_km', ...activities.filter((a) => days.includes(a.date)).map((a) => `${a.date},${a.type},${a.minutes},${a.distanceKm ?? ''}`)];
      downloadFile(`fitnova-${period.toLowerCase()}-report.csv`, rows.join('\n'), 'text/csv');
    } else {
      const text = [title, `Prepared for: ${user?.name}`, '(Demo data)', '', `Active minutes: ${data.minutes}`, `Sessions: ${data.sessions}`, `Habit completion: ${data.habitPct}%`, `Current active-day streak: ${data.streak} days`, '', 'This report is general information and not medical advice.'].join('\n');
      downloadFile(`fitnova-${period.toLowerCase()}-report.txt`, text);
    }
    toast('Report downloaded');
  }

  // SECTION 5: UI RENDERING
  return (
    <div className="space-y-6">
      <SectionHeading as="h1" title="Progress Reports" text="Your own activity and habit trends. Based on demo data."
        action={<Segmented options={periods} value={period} onChange={setPeriod} />} />

      <div className="grid gap-5 sm:grid-cols-3">
        {[['Active minutes', data.minutes], ['Sessions', data.sessions], ['Habit completion', `${data.habitPct}%`]].map(([label, value]) => (
          <Card key={label}><p className="text-sm text-soft">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p><p className="mt-1 text-xs text-soft">{period === 'Weekly' ? 'Last 7 days' : 'Last 4 weeks'}</p></Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card><h2 className="font-bold">{period} activity</h2><p className="mb-4 text-sm text-soft">Active minutes</p><BarsChart data={data.activityChart} /></Card>
        <Card><h2 className="font-bold">Workout consistency</h2><p className="mb-4 text-sm text-soft">Sessions logged per week</p><BarsChart data={data.consistency} unit="sessions" /></Card>
        <Card><h2 className="font-bold">Habit completion</h2><p className="mb-4 text-sm text-soft">Percent of check-ins done each week</p><TrendChart data={data.habitTrend} /></Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-bold"><Trophy size={17} className="text-accent" />Personal milestones</h2>
          <ul className="space-y-4">
            {milestones.map((m) => {
              const pct = Math.min(100, (m.current / m.target) * 100);
              return (
                <li key={m.title}>
                  <div className="mb-1.5 flex justify-between text-sm"><span>{m.title}</span><span className="text-soft">{pct >= 100 ? 'Reached' : `${m.current} / ${m.target}`}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-panel"><div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${pct}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="font-bold">Download report</h2>
        <p className="mt-1 text-sm text-soft">Save your {period.toLowerCase()} summary to keep or share with a coach.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <SelectField className="sm:w-64" label="Format" options={['Text summary (.txt)', 'Spreadsheet (.csv)']} value={format} onChange={(e) => setFormat(e.target.value)} />
          <Button onClick={handleDownload} icon={<Download size={16} />}>Download report</Button>
        </div>
      </Card>
    </div>
  );
}
