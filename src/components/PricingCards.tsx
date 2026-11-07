// ========================================
// components/PricingCards.tsx
// Purpose: The three plan cards, used on the landing page and the Pricing page.
// No payment is processed: choosing a plan only updates the demo account.
// ========================================
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { plans } from '../data/marketing';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { subscriptionService } from '../services/subscriptionService';
import type { PlanId } from '../types';
import Button from './ui/Button';
import { Badge } from './ui/Feedback';
import { cn } from '../utils/cn';
import { useState } from 'react';

export default function PricingCards() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<PlanId | null>(null); // which plan button is loading

  // Signed-out visitors go to Register; signed-in users switch plan (demo)
  async function choosePlan(id: PlanId) {
    if (!user) { navigate('/register'); return; }
    setBusy(id);
    const next = await subscriptionService.changePlan(id);
    updateUser({ plan: next });
    setBusy(null);
    toast(`Switched to the ${plans.find((p) => p.id === id)?.name} plan (demo)`);
  }

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const current = user?.plan === plan.id;
          return (
            <div key={plan.id} className={cn('relative flex flex-col rounded-3xl border p-7', plan.highlight ? 'border-accent-muted bg-gradient-to-b from-raised to-card shadow-soft' : 'border-line bg-card')}>
              {plan.highlight && <span className="absolute -top-3 left-7"><Badge>Most chosen</Badge></span>}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-soft">{plan.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1"><span className="text-4xl font-extrabold">{plan.price === 0 ? '₹0' : `₹${plan.price}`}</span><span className="text-sm text-soft">/month</span></p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => <li key={f} className="flex gap-2.5 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-accent" />{f}</li>)}
              </ul>
              <Button className="mt-8" variant={plan.highlight ? 'primary' : 'secondary'} disabled={current} loading={busy === plan.id} onClick={() => choosePlan(plan.id)}>
                {current ? 'Current plan' : plan.price === 0 ? 'Start free' : `Choose ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-center text-xs text-soft">Prices are illustrative. No payment is taken in this demo.</p>
    </div>
  );
}
