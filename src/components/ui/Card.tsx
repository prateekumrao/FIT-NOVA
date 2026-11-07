// Purpose: Rounded surface used for every panel. `interactive` adds a gentle hover lift.
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padded?: boolean;
}

export default function Card({ interactive, padded = true, className, ...rest }: CardProps) {
  return <div className={cn('rounded-2xl border border-line bg-card shadow-soft', padded && 'p-5 sm:p-6', interactive && 'transition duration-300 hover:-translate-y-0.5 hover:border-accent-muted/60', className)} {...rest} />;
}
