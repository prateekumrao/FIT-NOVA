// ========================================
// layouts/AppLayout.tsx
// Purpose: Signed-in shell: collapsible sidebar (desktop/tablet), top bar, and bottom navigation (phones).
// ========================================

// SECTION 1: IMPORTS
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, BarChart3, CheckSquare, Dumbbell, LayoutDashboard, LogOut, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Salad, Settings, Sparkles, User as UserIcon, type LucideIcon } from 'lucide-react';
import Logo from '../components/Logo';
import NotificationsMenu from '../components/NotificationsMenu';
import { Modal } from '../components/ui/Feedback';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/cn';

// SECTION 2: TYPES AND INTERFACES
interface NavItem { label: string; to: string; icon: LucideIcon }

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
  { label: 'AI Coach', to: '/app/coach', icon: Sparkles },
  { label: 'Workouts', to: '/app/workouts', icon: Dumbbell },
  { label: 'Nutrition', to: '/app/nutrition', icon: Salad },
  { label: 'Activity', to: '/app/activity', icon: Activity },
  { label: 'Habits', to: '/app/habits', icon: CheckSquare },
  { label: 'Reports', to: '/app/reports', icon: BarChart3 },
  { label: 'Profile', to: '/app/profile', icon: UserIcon },
  { label: 'Settings', to: '/app/settings', icon: Settings },
];
// The four main items shown in the phone bottom bar (the rest live under "More")
const bottomItems = navItems.slice(0, 3).concat(navItems[4]);

export default function AppLayout() {
  // SECTION 3: COMPONENT STATE
  // Sidebar starts collapsed on tablets (narrower than 1024px) and open on laptops/desktops.
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);
  const [moreOpen, setMoreOpen] = useState(false); // phone "More" sheet
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setMoreOpen(false); window.scrollTo({ top: 0 }); }, [location.pathname]);

  // SECTION 4: EVENT HANDLERS
  function handleLogout() {
    logout();
    toast('You have been logged out');
    navigate('/');
  }

  const linkClass = (isActive: boolean, compact: boolean) =>
    cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition', isActive ? 'bg-raised text-accent' : 'text-soft hover:bg-panel hover:text-ink', compact && 'justify-center');

  // SECTION 5: UI RENDERING
  return (
    <div className="min-h-screen">
      {/* Sidebar: hidden on phones, collapsible on tablet/desktop */}
      <aside className={cn('fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-card/80 p-3 backdrop-blur-xl transition-all duration-300 md:flex', collapsed ? 'w-[76px]' : 'w-64')}>
        <div className={cn('flex h-14 items-center', collapsed ? 'justify-center' : 'px-2')}><Logo to="/app/dashboard" showText={!collapsed} /></div>
        <nav className="mt-4 flex flex-1 flex-col gap-1" aria-label="App">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} title={label} className={({ isActive }) => linkClass(isActive, collapsed)}>
              <Icon size={19} className="shrink-0" />{!collapsed && label}
            </NavLink>
          ))}
        </nav>
        {!collapsed && (
          <Link to="/pricing" className="mb-3 rounded-2xl border border-line bg-gradient-to-br from-raised to-panel p-4 text-sm transition hover:border-accent-muted">
            <p className="font-semibold">{user?.plan === 'free' ? 'Upgrade your plan' : 'Manage your plan'}</p>
            <p className="mt-1 text-xs text-soft">Compare Free, Pro and Premium.</p>
          </Link>
        )}
        <button onClick={handleLogout} title="Log out" className={linkClass(false, collapsed)}><LogOut size={19} />{!collapsed && 'Log out'}</button>
      </aside>

      <div className={cn('transition-all duration-300', collapsed ? 'md:pl-[76px]' : 'md:pl-64')}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-bg/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="hidden h-10 w-10 place-items-center rounded-xl border border-line bg-panel/60 text-soft hover:text-ink md:grid">
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <div className="md:hidden"><Logo to="/app/dashboard" /></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-line px-3 py-1 text-xs text-soft sm:inline">Demo data</span>
            <NotificationsMenu />
            <Link to="/app/profile" aria-label="Your profile" className="grid h-10 w-10 place-items-center rounded-full bg-accent-muted/30 text-sm font-bold text-accent">{user?.name.charAt(0).toUpperCase()}</Link>
          </div>
        </header>

        {/* Extra bottom padding on phones so the bottom bar never covers content */}
        <motion.main key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 md:pb-12">
          <Outlet />
        </motion.main>
      </div>

      {/* Phone bottom navigation */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-card/95 backdrop-blur-xl md:hidden" aria-label="Bottom">
        {bottomItems.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium', isActive ? 'text-accent' : 'text-soft')}><Icon size={20} />{label}</NavLink>
        ))}
        <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-soft"><MoreHorizontal size={20} />More</button>
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="Menu">
        <div className="grid grid-cols-2 gap-2">
          {navItems.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm', isActive ? 'bg-raised text-accent' : 'text-soft')}><Icon size={18} />{label}</NavLink>)}
          <Link to="/pricing" className="col-span-2 rounded-xl border border-line px-4 py-3 text-sm text-soft">Plans and pricing</Link>
          <button onClick={handleLogout} className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-red-400/30 px-4 py-3 text-sm text-red-300"><LogOut size={18} />Log out</button>
        </div>
      </Modal>
    </div>
  );
}
