// ========================================
// pages/Workouts.tsx
// Purpose: Searchable, filterable exercise library with details modal and "save to my plan".
// Data comes from services/workoutService.ts (demo list today, FastAPI later).
// ========================================

// SECTION 1: IMPORTS
import { useEffect, useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { TextField } from '../components/ui/Field';
import { Badge, EmptyState, Modal, Skeleton } from '../components/ui/Feedback';
import IconByName from '../components/IconByName';
import Disclaimer from '../components/Disclaimer';
import SectionHeading from '../components/SectionHeading';
import { workoutService } from '../services/workoutService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Exercise } from '../types';

// SECTION 2: TYPES AND INTERFACES
const filters = ['All', 'Beginner', 'Strength', 'Cardio', 'Flexibility', 'Mobility', 'Home', 'Gym', 'Saved'] as const;
type Filter = (typeof filters)[number];

/** Does this exercise match the selected chip? */
function matchesFilter(ex: Exercise, filter: Filter, saved: string[]): boolean {
  switch (filter) {
    case 'All': return true;
    case 'Beginner': return ex.difficulty === 'Beginner';
    case 'Home': case 'Gym': return ex.place === filter;
    case 'Saved': return saved.includes(ex.id);
    default: return ex.category === filter;
  }
}

export default function Workouts() {
  useDocumentTitle('Workout Library');

  // SECTION 3: COMPONENT STATE
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(''); // search text
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<Exercise | null>(null); // exercise open in the modal
  const [saved, setSaved] = useLocalStorage<string[]>('fitnova.savedWorkouts', []);
  const { toast } = useToast();

  // Load the library once. This is where the real API call happens later.
  useEffect(() => { workoutService.list().then((list) => { setExercises(list); setLoading(false); }); }, []);

  // Apply search + filter
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((e) => matchesFilter(e, filter, saved) && (!q || `${e.name} ${e.muscle} ${e.equipment}`.toLowerCase().includes(q)));
  }, [exercises, query, filter, saved]);

  // SECTION 4: EVENT HANDLERS
  function toggleSaved(ex: Exercise) {
    const isSaved = saved.includes(ex.id);
    setSaved(isSaved ? saved.filter((id) => id !== ex.id) : [...saved, ex.id]);
    toast(isSaved ? `Removed ${ex.name} from your plan` : `Saved ${ex.name} to your plan`);
  }

  // SECTION 5: UI RENDERING
  return (
    <div>
      <SectionHeading as="h1" title="Workout Library" text="Find exercises by muscle, equipment or difficulty." />
      <TextField aria-label="Search exercises" placeholder="Search by name, muscle or equipment" icon={<Search size={16} />} value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xl" />
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f === 'Saved' ? `Saved (${saved.length})` : f}</Chip>)}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-64" />)}</div>
        ) : visible.length === 0 ? (
          <EmptyState title="No exercises found" text="Try a different search or clear the filters." action={<Button variant="secondary" onClick={() => { setQuery(''); setFilter('All'); }}>Clear filters</Button>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((ex) => (
              <Card key={ex.id} interactive padded={false} className="flex flex-col overflow-hidden">
                {/* Thumbnail: gradient + icon, so no external images are needed */}
                <div className="relative grid h-32 place-items-center bg-gradient-to-br from-raised via-panel to-card"><IconByName name={ex.icon} size={40} className="text-accent-2" strokeWidth={1.5} />
                  <button onClick={() => toggleSaved(ex)} aria-label={saved.includes(ex.id) ? 'Remove from plan' : 'Save to plan'} aria-pressed={saved.includes(ex.id)} className="absolute right-3 top-3 rounded-lg bg-bg/60 p-2 text-accent backdrop-blur">{saved.includes(ex.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2"><h3 className="font-bold">{ex.name}</h3><Badge tone="neutral">{ex.difficulty}</Badge></div>
                  <p className="mt-2 text-sm text-soft">Target: {ex.muscle}</p>
                  <p className="text-sm text-soft">Equipment: {ex.equipment}</p>
                  <p className="mt-1 text-xs text-soft/80">{ex.category} · {ex.place}</p>
                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => setSelected(ex)}>View steps and safety</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8"><Disclaimer>Exercises are general educational content. Stop if something hurts, and speak with a qualified professional if you have an injury or health condition.</Disclaimer></div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
        {selected && (
          <div>
            <div className="mb-4 flex flex-wrap gap-2"><Badge>{selected.category}</Badge><Badge tone="neutral">{selected.difficulty}</Badge><Badge tone="neutral">{selected.place}</Badge></div>
            <p className="text-sm text-soft">Target: {selected.muscle}. Equipment: {selected.equipment}.</p>
            <h3 className="mb-2 mt-5 text-sm font-bold">How to do it</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-soft">{selected.instructions.map((s) => <li key={s}>{s}</li>)}</ol>
            <h3 className="mb-2 mt-5 text-sm font-bold">Safety tip</h3>
            <p className="rounded-xl border border-line bg-panel p-3 text-sm text-soft">{selected.safety}</p>
            <Button className="mt-6 w-full" onClick={() => toggleSaved(selected)}>{saved.includes(selected.id) ? 'Remove from my plan' : 'Save to my plan'}</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
