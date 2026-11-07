// Purpose: Filter chips and segmented tabs (e.g. Weekly / Monthly). Both are real <button>s.
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={cn('shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition', active ? 'border-accent bg-accent/15 text-accent' : 'border-line text-soft hover:border-accent-muted hover:text-ink')}>
      {children}
    </button>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-panel p-1">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} aria-pressed={value === o}
          className={cn('rounded-lg px-4 py-1.5 text-sm font-medium transition', value === o ? 'bg-raised text-ink shadow-soft' : 'text-soft hover:text-ink')}>
          {o}
        </button>
      ))}
    </div>
  );
}
