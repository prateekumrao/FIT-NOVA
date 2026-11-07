// ========================================
// components/ui/Button.tsx
// Purpose: The one button used everywhere. Renders a <button>, a router <Link> (to="/x") or an <a> (href).
// ========================================
import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: string; // internal navigation
  href?: string; // external link
  icon?: ReactNode;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-bg hover:bg-accent-2 shadow-soft',
  secondary: 'border border-line bg-panel/60 text-ink hover:border-accent-muted hover:bg-panel',
  ghost: 'text-soft hover:bg-panel hover:text-ink',
  danger: 'border border-red-400/30 text-red-300 hover:bg-red-400/10',
};
const sizes: Record<Size, string> = { sm: 'h-9 px-3.5 text-sm', md: 'h-11 px-5 text-sm', lg: 'h-12 px-7 text-base' };

export default function Button({ variant = 'primary', size = 'md', to, href, icon, loading, className, children, disabled, ...rest }: ButtonProps) {
  const classes = cn('inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50', variants[variant], sizes[size], className);
  const content = (<>{loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : icon}{children}</>);
  if (to) return <Link to={to} className={classes}>{content}</Link>;
  if (href) return <a href={href} className={classes} target="_blank" rel="noreferrer">{content}</a>;
  return <button className={classes} disabled={disabled || loading} {...rest}>{content}</button>;
}
