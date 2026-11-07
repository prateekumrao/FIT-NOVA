// ========================================
// components/ui/Field.tsx
// Purpose: Form controls (TextField, SelectField, TextArea, Toggle) with labels and error messages.
// ========================================
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

const control = 'w-full rounded-xl border bg-panel px-4 text-sm text-ink placeholder:text-soft/60 transition focus:border-accent-2 focus:outline-none focus:ring-2 focus:ring-accent-2/20';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  right?: ReactNode; // e.g. the password show/hide button
}

export function TextField({ label, error, icon, right, className, ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-soft">{label}</label>}
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-soft">{icon}</span>}
        <input id={id} aria-invalid={!!error} className={cn(control, 'h-11', error ? 'border-red-400/60' : 'border-line', icon && 'pl-10', right && 'pr-11')} {...rest} />
        {right && <span className="absolute right-2 top-1/2 -translate-y-1/2">{right}</span>}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-300" role="alert">{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
}

export function SelectField({ label, options, className, ...rest }: SelectFieldProps) {
  const id = useId();
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-soft">{label}</label>}
      <select id={id} className={cn(control, 'h-11 border-line')} {...rest}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className, ...rest }: TextAreaProps) {
  const id = useId();
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-soft">{label}</label>}
      <textarea id={id} className={cn(control, 'min-h-28 py-3', error ? 'border-red-400/60' : 'border-line')} {...rest} />
      {error && <p className="mt-1.5 text-xs text-red-300" role="alert">{error}</p>}
    </div>
  );
}

/** On/off switch used on the Settings page. */
export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-soft">{hint}</p>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full border transition', checked ? 'border-accent-2 bg-accent-2/40' : 'border-line bg-panel')}>
        <span className={cn('absolute top-0.5 rounded-full transition-all', checked ? 'left-[22px] bg-accent' : 'left-0.5 bg-soft')} style={{ height: 18, width: 18 }} />
      </button>
    </div>
  );
}
