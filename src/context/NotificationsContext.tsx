// ========================================
// context/NotificationsContext.tsx
// Purpose: Shared notification list so the bell menu and the Dashboard stay in sync (demo data).
// Future endpoint: GET /notifications, PATCH /notifications/read
// ========================================
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { AppNotification } from '../types';
import { demoNotifications } from '../data/trackerSeed';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Value {
  notifications: AppNotification[];
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}
const Ctx = createContext<Value | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>('fitnova.notifications', demoNotifications);
  const value = useMemo<Value>(() => ({
    notifications,
    unread: notifications.filter((n) => !n.read).length,
    markRead: (id) => setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllRead: () => setNotifications((list) => list.map((n) => ({ ...n, read: true }))),
  }), [notifications, setNotifications]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotifications(): Value {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}
