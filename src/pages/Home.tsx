// ========================================
// pages/Home.tsx
// Purpose: Public landing page: hero, features, AI Coach intro, workouts + nutrition, how it works,
// pricing, sample testimonials, FAQ and final call to action.
// ========================================

// SECTION 1: IMPORTS
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, Flame, Footprints, Send, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SectionHeading from '../components/SectionHeading';
import IconByName from '../components/IconByName';
import PricingCards from '../components/PricingCards';
import ProgressRing from '../components/ProgressRing';
import { Badge } from '../components/ui/Feedback';
import { faqs, features, steps, testimonials } from '../data/marketing';
import { demoExercises } from '../data/exercises';
import { demoFoods } from '../data/foods';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../utils/cn';

// SECTION 2: HERO VISUAL
/** A stylised preview of the product built from plain HTML (no stock photos needed). */
function HeroVisual() {
  const bars = [42, 68, 55, 80, 62, 90, 74];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-8 -z-10 rounded-full bg-accent-muted/10 blur-3xl" />
      <Card className="bg-gradient-to-b from-raised to-card">
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-soft">This week</p><p className="text-2xl font-extrabold">212 active minutes</p></div>
          <ProgressRing value={78} size={72} label="Weekly goal" />
        </div>
        <div className="mt-6 flex h-28 items-end gap-2" aria-hidden="true">
          {bars.map((h, i) => <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.3 + i * 0.07, duration: 0.7 }} className="flex-1 rounded-t-lg bg-accent-2/70" />)}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-soft">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className="flex-1 text-center">{d}</span>)}</div>
      </Card>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="absolute -bottom-8 -left-4 w-64 rounded-2xl border border-line bg-panel p-4 shadow-soft sm:-left-10">
        <p className="flex items-center gap-2 text-xs font-semibold text-accent"><Sparkles size={14} />AI Coach</p>
        <p className="mt-1.5 text-sm text-soft">A 10-minute walk after dinner is a gentle way to keep your streak today.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="absolute -right-2 -top-5 flex items-center gap-2 rounded-2xl border border-line bg-panel px-4 py-3 shadow-soft sm:-right-8">
        <Flame size={18} className="text-accent" /><div><p className="text-sm font-bold">12-day streak</p><p className="text-[11px] text-soft">Sample data</p></div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  useDocumentTitle('Your Fitness. Your Intelligence.');

  // SECTION 3: COMPONENT STATE
  const [openFaq, setOpenFaq] = useState<number | null>(0); // which FAQ answer is expanded

  // SECTION 4: EVENT HANDLERS
  // Smoothly scroll to the features section when "Explore Features" is pressed
  const scrollToFeatures = () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });

  // SECTION 5: UI RENDERING
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-2 lg:pt-24">
        <div>
          <Badge>AI fitness and wellness</Badge>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">Your Fitness. Your Intelligence.</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-soft">FitNova AI brings an AI coach, a workout library, Indian food nutrition and simple daily tracking into one calm place, so healthy habits feel easier to keep.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to="/register" size="lg" icon={<ArrowRight size={18} />}>Get Started</Button>
            <Button variant="secondary" size="lg" onClick={scrollToFeatures}>Explore Features</Button>
          </div>
          <p className="mt-6 text-xs text-soft">No payment needed. Demo build with sample data.</p>
        </div>
        <HeroVisual />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8">
        <SectionHeading center title="Everything for a steady routine" text="Six focused tools that work together, without the clutter." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} interactive>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent"><IconByName name={f.icon} size={21} /></span>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Coach introduction */}
      <section id="coach" className="scroll-mt-20 border-y border-line bg-card/40">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading title="Meet Nova, your AI Coach" text="Ask in everyday language. Nova explains workouts, suggests simple meal ideas and helps you build habits, always with safety in mind." />
            <ul className="space-y-3 text-sm text-soft">
              <li>Plan a beginner week in seconds</li>
              <li>Understand protein in dal, paneer and chana</li>
              <li>Get gentle reminders about water, sleep and recovery</li>
            </ul>
            <Button to="/register" className="mt-8">Try the AI Coach</Button>
          </div>
          <Card className="space-y-4 bg-panel/50">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-accent px-4 py-3 text-sm text-bg">Plan a 3-day beginner workout week</div>
            <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-line bg-card px-4 py-3 text-sm text-soft">Mon: brisk walk and bodyweight squats. Wed: easy cycling and mobility. Fri: a full-body round and stretching. Rest in between.</div>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-3 text-sm text-soft/70"><span className="flex-1">Ask Nova anything...</span><Send size={16} /></div>
          </Card>
        </div>
      </section>

      {/* Workouts and nutrition */}
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-24 sm:px-8 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-raised to-card">
          <h3 className="text-2xl font-bold">Workouts for every level</h3>
          <p className="mt-2 text-sm text-soft">Strength, cardio, flexibility and mobility, at home or in the gym.</p>
          <ul className="mt-6 space-y-2">
            {demoExercises.slice(0, 4).map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 px-4 py-3">
                <IconByName name={e.icon} size={18} className="text-accent" /><span className="flex-1 text-sm font-medium">{e.name}</span><span className="text-xs text-soft">{e.difficulty}</span>
              </li>
            ))}
          </ul>
          <Button to="/register" variant="secondary" className="mt-6">Browse the library</Button>
        </Card>
        <Card className="bg-gradient-to-br from-raised to-card">
          <h3 className="text-2xl font-bold">Nutrition made familiar</h3>
          <p className="mt-2 text-sm text-soft">Estimated nutrition for everyday Indian foods.</p>
          <ul className="mt-6 space-y-2">
            {demoFoods.slice(3, 7).map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-xl border border-line bg-panel/60 px-4 py-3">
                <span className="flex-1 text-sm font-medium">{f.name}</span><span className="text-xs text-soft">{f.protein} g protein</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-soft">Sample estimates per serving.</p>
          <Button to="/register" variant="secondary" className="mt-4">Explore foods</Button>
        </Card>
      </section>

      {/* How it works: this IS a sequence, so numbering is meaningful */}
      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <SectionHeading center title="How it works" text="From sign-up to your first weekly report in four steps." />
          <ol className="grid gap-5 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-card p-6">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-sm font-bold text-accent">{i + 1}</span>
                <h3 className="mt-4 font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHeading center title="Simple, honest pricing" text="Start free and upgrade only when you want more." />
        <PricingCards />
      </section>

      {/* Testimonials */}
      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <SectionHeading center title="What early users say" text="Sample content for design purposes. These are not real customers." />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <p className="leading-relaxed">“{t.text}”</p>
                <div className="mt-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-accent-muted/30 text-sm font-bold text-accent">{t.name.slice(-1)}</span><div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-soft">{t.role}</p></div></div>
                <p className="mt-4 text-[11px] text-soft/70">Sample testimonial</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-24 sm:px-8">
        <SectionHeading center title="Frequently asked questions" />
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className="rounded-2xl border border-line bg-card">
                <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                  {f.q}<ChevronDown size={18} className={cn('shrink-0 text-soft transition', open && 'rotate-180')} />
                </button>
                <AnimatePresence initial={false}>
                  {open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-soft">{f.a}</p></motion.div>}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final call to action */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="rounded-3xl border border-line bg-gradient-to-br from-raised via-card to-card px-6 py-16 text-center">
          <Footprints className="mx-auto text-accent" size={28} />
          <h2 className="mx-auto mt-5 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">Start with one small step today</h2>
          <p className="mx-auto mt-3 max-w-md text-soft">Create a free account and set up your routine in under two minutes.</p>
          <Button to="/register" size="lg" className="mt-8">Get Started</Button>
        </div>
      </section>
    </div>
  );
}
