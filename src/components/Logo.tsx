// Purpose: FitNova AI logo (SVG mark + wordmark). Used in the navbar, sidebar, auth pages and footer.
import { Link } from 'react-router-dom';

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="#B7D8B8" strokeOpacity="0.4" />
      <path d="M16 5l2.2 8.8L27 16l-8.8 2.2L16 27l-2.2-8.8L5 16l8.8-2.2z" fill="#B7D8B8" />
    </svg>
  );
}

export default function Logo({ to = '/', showText = true }: { to?: string; showText?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label="FitNova AI home">
      <LogoMark />
      {showText && <span className="text-lg font-extrabold tracking-tight">FitNova <span className="text-accent">AI</span></span>}
    </Link>
  );
}
