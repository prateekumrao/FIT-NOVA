// ========================================
// components/IconByName.tsx
// Purpose: Data files store icon NAMES as strings (easy to send from an API). This maps a name to a Lucide icon.
// ========================================
import { Activity, Bike, CheckCircle2, Dumbbell, Flower2, Footprints, HeartPulse, LineChart, Mountain, PersonStanding, Salad, Sparkles, Timer, Waves, type LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

const icons: Record<string, ComponentType<LucideProps>> = {
  Activity, Bike, CheckCircle2, Dumbbell, Flower2, Footprints, HeartPulse, LineChart, Mountain, PersonStanding, Salad, Sparkles, Timer, Waves,
};

export default function IconByName({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name] ?? Activity; // fall back to a generic icon for unknown names
  return <Icon {...props} />;
}
