// Purpose: Bell icon + dropdown listing notifications. Clicking one marks it read.
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';
import { cn } from '../utils/cn';

export default function NotificationsMenu() {
  const { notifications, unread, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false); // whether the dropdown is visible

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label={`Notifications, ${unread} unread`} aria-expanded={open}
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-panel/60 text-soft transition hover:text-ink">
        <Bell size={18} />
        {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />}
      </button>
      {open && (
        <>
          {/* Invisible full-screen layer: clicking anywhere outside closes the menu */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-card p-2 shadow-soft">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-sm font-semibold">Notifications</p>
              <button onClick={markAllRead} className="text-xs text-accent hover:underline">Mark all read</button>
            </div>
            {notifications.map((n) => (
              <button key={n.id} onClick={() => markRead(n.id)} className="flex w-full gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-panel">
                <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-line' : 'bg-accent')} />
                <span><span className="block text-sm font-medium">{n.title}</span><span className="block text-xs text-soft">{n.body}</span><span className="mt-0.5 block text-[11px] text-soft/70">{n.time}</span></span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
