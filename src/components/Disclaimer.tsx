// Purpose: Reusable safety/educational notice shown near AI, nutrition and workout content.
import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-line bg-panel/60 p-3 text-xs leading-relaxed text-soft">
      <ShieldCheck size={15} className="mt-0.5 shrink-0 text-accent-muted" />
      <span>{children ?? 'FitNova AI shares general educational information, not medical advice. Check with a qualified professional before changing your exercise or diet.'}</span>
    </p>
  );
}
