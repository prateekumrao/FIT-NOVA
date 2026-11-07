// ========================================
// hooks/useLocalStorage.ts
// Purpose: Like useState, but the value is saved in the browser (localStorage) and restored on reload.
// ========================================
import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved) as T;
    } catch {
      /* ignore corrupt data and fall back to the initial value */
    }
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });

  // Save every time the value changes
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be full or blocked */ }
  }, [key, value]);

  return [value, setValue] as const;
}
