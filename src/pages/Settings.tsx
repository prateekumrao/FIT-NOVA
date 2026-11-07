// ========================================
// pages/Settings.tsx
// Purpose: Preferences, notifications, privacy, subscription, data export, logout and account deletion.
// Settings are stored in localStorage (demo). Future endpoint: PUT /users/me/settings
// ========================================

// SECTION 1: IMPORTS
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { SelectField, TextField, Toggle } from '../components/ui/Field';
import { Badge, Modal } from '../components/ui/Feedback';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { useTracker } from '../context/TrackerContext';
import { useToast } from '../context/ToastContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { downloadFile } from '../utils/download';
import type { User } from '../types';

// SECTION 2: TYPES AND INTERFACES
interface SettingsState {
  workoutPlace: string;
  weeklyDays: string;
  notifyWorkout: boolean;
  notifyHabits: boolean;
  notifyWeekly: boolean;
  notifyUpdates: boolean;
  shareUsage: boolean;
  saveCoachHistory: boolean;
  publicProfile: boolean;
}
const defaults: SettingsState = { workoutPlace: 'Home and gym', weeklyDays: '3', notifyWorkout: true, notifyHabits: true, notifyWeekly: true, notifyUpdates: false, shareUsage: false, saveCoachHistory: true, publicProfile: false };
const tabs = ['Preferences', 'Notifications', 'Privacy', 'Subscription', 'Data and account'] as const;

export default function Settings() {
  useDocumentTitle('Settings');

  // SECTION 3: COMPONENT STATE
  const { user, updateUser, logout, deleteAccount } = useAuth();
  const tracker = useTracker();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]>('Preferences');
  const [settings, setSettings] = useLocalStorage<SettingsState>('fitnova.settings', defaults);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState(''); // the user must type DELETE

  // SECTION 4: EVENT HANDLERS
  /** Update one setting, e.g. set('notifyHabits', false) */
  function set<K extends keyof SettingsState>(key: K, value: SettingsState[K]) { setSettings((s) => ({ ...s, [key]: value })); }

  function exportData() {
    const { habits, activities, water, sleep, meals } = tracker;
    downloadFile('fitnova-data-export.json', JSON.stringify({ exportedAt: new Date().toISOString(), note: 'Demo data', profile: user, settings, habits, activities, water, sleep, meals }, null, 2), 'application/json');
    toast('Data export downloaded');
  }

  function handleDelete() {
    deleteAccount();
    navigate('/');
  }

  // SECTION 5: UI RENDERING
  return (
    <div className="max-w-3xl">
      <SectionHeading as="h1" title="Settings" text="Control your preferences, privacy and data." />
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">{tabs.map((t) => <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>)}</div>

      {tab === 'Preferences' && (
        <Card className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Language" options={['English', 'Hindi']} value={user?.language ?? 'English'} onChange={(e) => { updateUser({ language: e.target.value }); toast('Language preference saved'); }} />
          <SelectField label="Dietary preference" options={['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan']} value={user?.diet ?? 'Vegetarian'} onChange={(e) => { updateUser({ diet: e.target.value as User['diet'] }); toast('Dietary preference saved'); }} />
          <SelectField label="Where do you prefer to work out?" options={['Home', 'Gym', 'Home and gym']} value={settings.workoutPlace} onChange={(e) => { set('workoutPlace', e.target.value); toast('Fitness preference saved'); }} />
          <SelectField label="Workout days per week" options={['2', '3', '4', '5', '6']} value={settings.weeklyDays} onChange={(e) => { set('weeklyDays', e.target.value); toast('Fitness preference saved'); }} />
          <p className="text-xs text-soft sm:col-span-2">Hindi is stored as a preference. Translated content is on the roadmap.</p>
        </Card>
      )}

      {tab === 'Notifications' && (
        <Card className="divide-y divide-line !py-2">
          <Toggle label="Workout reminders" hint="A gentle nudge on your workout days" checked={settings.notifyWorkout} onChange={(v) => set('notifyWorkout', v)} />
          <Toggle label="Habit reminders" hint="Evening reminder for unfinished habits" checked={settings.notifyHabits} onChange={(v) => set('notifyHabits', v)} />
          <Toggle label="Weekly report" hint="Summary of your week" checked={settings.notifyWeekly} onChange={(v) => set('notifyWeekly', v)} />
          <Toggle label="Product updates" hint="News about new features" checked={settings.notifyUpdates} onChange={(v) => set('notifyUpdates', v)} />
        </Card>
      )}

      {tab === 'Privacy' && (
        <Card className="divide-y divide-line !py-2">
          <Toggle label="Save AI Coach conversations" hint="Keep chat history so you can revisit it" checked={settings.saveCoachHistory} onChange={(v) => set('saveCoachHistory', v)} />
          <Toggle label="Share anonymous usage data" hint="Helps improve FitNova AI" checked={settings.shareUsage} onChange={(v) => set('shareUsage', v)} />
          <Toggle label="Public profile" hint="Let other members see your name" checked={settings.publicProfile} onChange={(v) => set('publicProfile', v)} />
          <p className="py-4 text-xs text-soft">Read our <Link to="/privacy" className="text-accent underline">Privacy Policy</Link> for details.</p>
        </Card>
      )}

      {tab === 'Subscription' && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="text-sm text-soft">Current plan</p><p className="mt-1 flex items-center gap-2 text-xl font-bold capitalize">{user?.plan}<Badge>Demo</Badge></p></div>
            <div className="flex gap-3">
              <Button to="/pricing">Change plan</Button>
              <Button variant="danger" disabled={user?.plan === 'free'} onClick={() => { updateUser({ plan: 'free' }); toast('Switched to the Free plan (demo)'); }}>Cancel subscription</Button>
            </div>
          </div>
          <p className="mt-5 text-xs text-soft">No real payments are connected. This screen only changes the demo account.</p>
        </Card>
      )}

      {tab === 'Data and account' && (
        <div className="space-y-5">
          <Card>
            <h2 className="font-bold">Export your data</h2>
            <p className="mt-1 text-sm text-soft">Download your profile, settings and tracking data as a JSON file.</p>
            <Button variant="secondary" className="mt-4" onClick={exportData}>Export data</Button>
          </Card>
          <Card>
            <h2 className="font-bold">Reset demo data</h2>
            <p className="mt-1 text-sm text-soft">Restore the original sample activity, habits and meals.</p>
            <Button variant="secondary" className="mt-4" onClick={() => { tracker.resetDemoData(); toast('Demo data restored'); }}>Reset demo data</Button>
          </Card>
          <Card>
            <h2 className="font-bold">Session</h2>
            <Button variant="secondary" className="mt-4" onClick={() => { logout(); toast('You have been logged out'); navigate('/'); }}>Log out</Button>
          </Card>
          <Card className="border-red-400/20">
            <h2 className="font-bold text-red-300">Delete account</h2>
            <p className="mt-1 text-sm text-soft">This removes your profile and all tracking data from this browser. It cannot be undone.</p>
            <Button variant="danger" className="mt-4" onClick={() => setDeleteOpen(true)}>Delete my account</Button>
          </Card>
        </div>
      )}

      <Modal open={deleteOpen} onClose={() => { setDeleteOpen(false); setConfirmText(''); }} title="Delete your account?">
        <p className="text-sm text-soft">Type <strong className="text-ink">DELETE</strong> to confirm. Your data will be erased.</p>
        <TextField className="mt-4" aria-label="Type DELETE to confirm" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        <div className="mt-5 flex justify-end gap-3"><Button variant="ghost" onClick={() => { setDeleteOpen(false); setConfirmText(''); }}>Cancel</Button><Button variant="danger" disabled={confirmText !== 'DELETE'} onClick={handleDelete}>Delete account</Button></div>
      </Modal>
    </div>
  );
}
