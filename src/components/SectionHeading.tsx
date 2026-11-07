// Purpose: Page and section titles with a short description, used on public and app pages.
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface Props { title: string; text?: string; center?: boolean; action?: ReactNode; as?: 'h1' | 'h2' }

export default function SectionHeading({ title, text, center, action, as: Tag = 'h2' }: Props) {
  return (
    <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', center && 'mx-auto max-w-2xl flex-col items-center text-center')}>
      <div>
        <Tag className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</Tag>
        {text && <p className="mt-3 max-w-xl text-soft">{text}</p>}
      </div>
      {action}
    </div>
  );
}
