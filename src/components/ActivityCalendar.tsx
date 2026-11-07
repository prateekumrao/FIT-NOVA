// ========================================
// components/ActivityCalendar.tsx
// Purpose: Month calendar. Days with logged activity show a dot; clicking a day selects it.
// ========================================
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toISO, todayISO } from '../utils/dates';
import { cn } from '../utils/cn';

interface Props {
  activeDates: string[]; // dates that have at least one activity
  selected: string;
  onSelect: (iso: string) => void;
}

export default function ActivityCalendar({ activeDates, selected, onSelect }: Props) {
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); }); // first day of the visible month

  const firstWeekday = month.getDay(); // 0 = Sunday: number of empty cells before day 1
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<string | null> = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(month.getFullYear(), month.getMonth(), i + 1)))];
  const shift = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));
  const today = todayISO();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-bold">{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        <div className="flex gap-1">
          <button onClick={() => shift(-1)} aria-label="Previous month" className="rounded-lg p-2 text-soft hover:bg-panel hover:text-ink"><ChevronLeft size={18} /></button>
          <button onClick={() => shift(1)} aria-label="Next month" className="rounded-lg p-2 text-soft hover:bg-panel hover:text-ink"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-soft">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="py-1">{d}</span>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((iso, i) => iso === null ? <span key={i} /> : (
          <button key={iso} onClick={() => onSelect(iso)} aria-label={iso} aria-pressed={selected === iso}
            className={cn('relative grid aspect-square place-items-center rounded-xl text-sm transition', selected === iso ? 'bg-accent text-bg font-bold' : 'hover:bg-panel', iso === today && selected !== iso && 'border border-accent-muted')}>
            {Number(iso.slice(8))}
            {activeDates.includes(iso) && <span className={cn('absolute bottom-1.5 h-1 w-1 rounded-full', selected === iso ? 'bg-bg' : 'bg-accent')} />}
          </button>
        ))}
      </div>
    </div>
  );
}
