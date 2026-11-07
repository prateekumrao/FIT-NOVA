// ========================================
// context/ToastContext.tsx
// Purpose: Small confirmation messages ("Saved") shown at the bottom of the screen.
// Usage: const { toast } = useToast(); toast('Habit added');
// ========================================
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface ToastItem { id: number; text: string }
const ToastContext = createContext<{ toast: (text: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  // Add a toast and remove it automatically after 2.8 seconds
  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setItems((list) => [...list, { id, text }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 md:bottom-6" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="pointer-events-auto flex items-center gap-2 rounded-xl border border-line bg-raised px-4 py-2.5 text-sm shadow-soft">
              <CheckCircle2 size={16} className="text-accent" /> {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
