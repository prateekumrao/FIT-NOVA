// ========================================
// layouts/MarketingLayout.tsx
// Purpose: Navbar + footer wrapper for public pages (Home, Pricing, About, Contact, Privacy, Terms).
// ========================================

// SECTION 1: IMPORTS
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

// SECTION 2: TYPES AND INTERFACES
const navLinks = [
  { label: 'Features', to: '/#features' },
  { label: 'AI Coach', to: '/#coach' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const footerGroups = [
  { title: 'Product', links: [['Features', '/#features'], ['AI Coach', '/#coach'], ['Pricing', '/pricing'], ['FAQ', '/#faq']] },
  { title: 'Company', links: [['About us', '/about'], ['Contact', '/contact']] },
  { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms and Conditions', '/terms']] },
];

const socials = [['X', 'https://x.com'], ['LinkedIn', 'https://www.linkedin.com'], ['Instagram', 'https://www.instagram.com'], ['YouTube', 'https://www.youtube.com']];

export default function MarketingLayout() {
  // SECTION 3: COMPONENT STATE
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu visibility
  const [scrolled, setScrolled] = useState(false); // adds a border to the navbar after scrolling
  const { user } = useAuth();
  const location = useLocation();

  // Scroll to the "#section" in the URL, or to the top on a normal page change
  useEffect(() => {
    setMenuOpen(false);
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50); return; }
    }
    window.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // SECTION 5: UI RENDERING
  return (
    <div className="flex min-h-screen flex-col">
      <header className={cn('sticky top-0 z-50 transition', scrolled || menuOpen ? 'border-b border-line bg-bg/85 backdrop-blur-xl' : 'border-b border-transparent')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <NavLink key={l.label} to={l.to} className={({ isActive }) => cn('rounded-lg px-3.5 py-2 text-sm font-medium transition hover:text-ink', isActive && !l.to.includes('#') ? 'text-ink' : 'text-soft')}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? <Button to="/app/dashboard" size="sm">Open dashboard</Button> : (<><Button to="/login" variant="ghost" size="sm">Log in</Button><Button to="/register" size="sm">Get started</Button></>)}
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-line text-soft md:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line md:hidden" aria-label="Mobile">
              <div className="flex flex-col gap-1 px-5 py-4">
                {navLinks.map((l) => <Link key={l.label} to={l.to} className="rounded-lg px-3 py-3 text-soft hover:bg-panel hover:text-ink">{l.label}</Link>)}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {user ? <Button to="/app/dashboard" className="col-span-2">Open dashboard</Button> : (<><Button to="/login" variant="secondary">Log in</Button><Button to="/register">Get started</Button></>)}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Page content. The key makes each page fade in when the route changes */}
      <motion.main key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex-1">
        <Outlet />
      </motion.main>

      <footer className="border-t border-line bg-card/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-soft">Your Fitness. Your Intelligence. Educational fitness and wellness guidance, powered by AI.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-xs text-soft transition hover:border-accent-muted hover:text-ink">{name}</a>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerGroups.map((g) => (
              <div key={g.title}>
                <p className="mb-3 text-sm font-semibold">{g.title}</p>
                <ul className="space-y-2">{g.links.map(([label, to]) => <li key={label}><Link to={to} className="text-sm text-soft transition hover:text-ink">{label}</Link></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-line px-5 py-5 text-center text-xs text-soft">© {new Date().getFullYear()} FitNova AI. General educational information only, not medical advice.</div>
      </footer>
    </div>
  );
}
