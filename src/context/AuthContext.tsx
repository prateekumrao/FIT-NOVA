// ========================================
// context/AuthContext.tsx
// Purpose: Holds the signed-in user and login/logout actions for the whole app (demo authentication).
// ========================================

// SECTION 1: IMPORTS
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { useLocalStorage } from '../hooks/useLocalStorage';

// SECTION 2: TYPES AND INTERFACES
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (changes: Partial<User>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// SECTION 3: PROVIDER
export function AuthProvider({ children }: { children: ReactNode }) {
  // The user is saved in localStorage so a page refresh keeps you signed in (demo only).
  const [user, setUser] = useLocalStorage<User | null>('fitnova.user', null);

  const login = useCallback(async (email: string, password: string) => {
    setUser(await authService.login(email, password));
  }, [setUser]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setUser(await authService.register(name, email, password));
  }, [setUser]);

  const logout = useCallback(() => setUser(null), [setUser]);

  // Merge partial changes (e.g. { plan: 'pro' }) into the current user
  const updateUser = useCallback((changes: Partial<User>) => {
    setUser((current) => (current ? { ...current, ...changes } : current));
  }, [setUser]);

  // Demo: also clear tracker data. A real app would call DELETE /account.
  const deleteAccount = useCallback(() => {
    localStorage.removeItem('fitnova.tracker');
    setUser(null);
  }, [setUser]);

  const value = useMemo(() => ({ user, login, register, logout, updateUser, deleteAccount }), [user, login, register, logout, updateUser, deleteAccount]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// SECTION 4: HOOK
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
