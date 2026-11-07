// ========================================
// pages/Nutrition.tsx
// Purpose: Food library (with Indian foods), nutrition facts and a daily meal log.
// All nutrition values are DEMO ESTIMATES. Data: services/nutritionService.ts.
// ========================================

// SECTION 1: IMPORTS
import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, Search, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Chip, Segmented } from '../components/ui/Chip';
import { SelectField, TextField } from '../components/ui/Field';
import { Badge, EmptyState, Modal, Skeleton } from '../components/ui/Feedback';
import Disclaimer from '../components/Disclaimer';
import SectionHeading from '../components/SectionHeading';
import { foodCategories } from '../data/foods';
import { nutritionService } from '../services/nutritionService';
import { useTracker } from '../context/TrackerContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { todayISO } from '../utils/dates';
import type { Food, MealLog, MealType } from '../types';

// SECTION 2: TYPES AND INTERFACES
const dietOptions = ['All', 'Veg', 'Non-veg'] as const;
const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
interface LoggedMeal { meal: MealLog; food: Food }

export default function Nutrition() {
  useDocumentTitle('Nutrition');

  // SECTION 3: COMPONENT STATE
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof foodCategories)[number]>('All');
  const [diet, setDiet] = useState<(typeof dietOptions)[number]>('All');
  const [selected, setSelected] = useState<Food | null>(null); // food open in the facts modal
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState<MealType>('Lunch');
  const { meals, addMeal, removeMeal } = useTracker();
  const { toast } = useToast();

  useEffect(() => { nutritionService.listFoods().then((list) => { setFoods(list); setLoading(false); }); }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foods.filter((f) => (category === 'All' || f.category === category) && (diet === 'All' || f.diet === diet) && (!q || f.name.toLowerCase().includes(q)));
  }, [foods, query, category, diet]);

  // Today's meals joined with food details (meals whose food is not loaded yet are skipped)
  const todaysMeals: LoggedMeal[] = meals.filter((m) => m.date === todayISO()).flatMap((m) => {
    const food = foods.find((f) => f.id === m.foodId);
    return food ? [{ meal: m, food }] : [];
  });
  const totals = todaysMeals.reduce((t, { meal, food }) => ({ cal: t.cal + food.calories * meal.servings, p: t.p + food.protein * meal.servings, c: t.c + food.carbs * meal.servings, f: t.f + food.fat * meal.servings }), { cal: 0, p: 0, c: 0, f: 0 });
  const macroSum = totals.p + totals.c + totals.f || 1;

  // SECTION 4: EVENT HANDLERS
  function openFood(food: Food) { setSelected(food); setServings(1); }

  function logMeal() {
    if (!selected) return;
    addMeal({ date: todayISO(), meal: mealType, foodId: selected.id, servings });
    toast(`Logged ${servings} × ${selected.name} for ${mealType.toLowerCase()}`);
    setSelected(null);
  }

  // SECTION 5: UI RENDERING
  return (
    <div>
      <SectionHeading as="h1" title="Nutrition and Food Library" text="Explore everyday Indian foods and log what you eat. Values are estimates for learning." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div>
          <TextField aria-label="Search foods" placeholder="Search dal, roti, paneer..." icon={<Search size={16} />} value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xl" />
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">{foodCategories.map((c) => <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>)}</div>
          <div className="mt-4"><Segmented options={dietOptions} value={diet} onChange={setDiet} /></div>

          <div className="mt-6">
            {loading ? <div className="grid gap-4 sm:grid-cols-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36" />)}</div> : visible.length === 0 ? (
              <EmptyState title="No foods found" text="Try another search, category or diet filter." action={<Button variant="secondary" onClick={() => { setQuery(''); setCategory('All'); setDiet('All'); }}>Clear filters</Button>} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {visible.map((f) => (
                  <Card key={f.id} interactive>
                    <div className="flex items-start justify-between gap-2"><h3 className="font-bold">{f.name}</h3><Badge tone={f.diet === 'Veg' ? 'sage' : 'neutral'}>{f.diet}</Badge></div>
                    <p className="mt-1 text-xs text-soft">{f.serving} · about {f.calories} kcal</p>
                    <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      {[['Protein', f.protein], ['Carbs', f.carbs], ['Fat', f.fat]].map(([label, value]) => <div key={label} className="rounded-xl bg-panel py-2"><dt className="text-soft">{label}</dt><dd className="mt-0.5 text-sm font-bold">{value} g</dd></div>)}
                    </dl>
                    <Button size="sm" variant="secondary" className="mt-4 w-full" onClick={() => openFood(f)}>Nutrition facts and log</Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Meal log */}
        <Card className="h-fit xl:sticky xl:top-24">
          <h2 className="font-bold">Today's meal log</h2>
          <p className="mt-1 text-xs text-soft">Estimated totals</p>
          <p className="mt-4 text-3xl font-extrabold">{Math.round(totals.cal)} <span className="text-base font-medium text-soft">kcal</span></p>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-panel" aria-hidden="true">
            <div className="bg-accent" style={{ width: `${(totals.p / macroSum) * 100}%` }} /><div className="bg-accent-2/70" style={{ width: `${(totals.c / macroSum) * 100}%` }} /><div className="bg-accent-muted/60" style={{ width: `${(totals.f / macroSum) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-soft">Protein {totals.p.toFixed(0)} g · Carbs {totals.c.toFixed(0)} g · Fat {totals.f.toFixed(0)} g</p>
          {todaysMeals.length === 0 ? <p className="mt-5 text-sm text-soft">Nothing logged yet. Pick a food to add it.</p> : (
            <ul className="mt-5 divide-y divide-line">
              {todaysMeals.map(({ meal, food }) => (
                <li key={meal.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                  <span><span className="block font-medium">{food.name}</span><span className="text-xs text-soft">{meal.meal} · {meal.servings} serving{meal.servings > 1 ? 's' : ''}</span></span>
                  <button onClick={() => { removeMeal(meal.id); toast('Meal removed'); }} aria-label={`Remove ${food.name}`} className="rounded-lg p-2 text-soft hover:text-red-300"><Trash2 size={15} /></button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <div className="mt-8"><Disclaimer>Nutrition values are rough estimates and vary with recipe and portion size. For personal diet advice, consult a registered dietitian.</Disclaimer></div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
        {selected && (
          <div>
            <p className="text-sm text-soft">Per {selected.serving} (estimate)</p>
            <table className="mt-4 w-full text-sm">
              <tbody className="divide-y divide-line">
                {[['Calories', `${Math.round(selected.calories * servings)} kcal`], ['Protein', `${(selected.protein * servings).toFixed(1)} g`], ['Carbohydrates', `${(selected.carbs * servings).toFixed(1)} g`], ['Fat', `${(selected.fat * servings).toFixed(1)} g`], ['Fibre', `${(selected.fiber * servings).toFixed(1)} g`]].map(([k, v]) => <tr key={k}><td className="py-2.5 text-soft">{k}</td><td className="py-2.5 text-right font-semibold">{v}</td></tr>)}
              </tbody>
            </table>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1.5 text-sm font-medium text-soft">Servings</p>
                <div className="flex h-11 items-center justify-between rounded-xl border border-line bg-panel px-1">
                  <button onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="Fewer servings" className="grid h-9 w-9 place-items-center rounded-lg text-soft hover:text-ink"><Minus size={15} /></button>
                  <span className="font-semibold">{servings}</span>
                  <button onClick={() => setServings((s) => Math.min(10, s + 1))} aria-label="More servings" className="grid h-9 w-9 place-items-center rounded-lg text-soft hover:text-ink"><Plus size={15} /></button>
                </div>
              </div>
              <SelectField label="Meal" options={mealTypes} value={mealType} onChange={(e) => setMealType(e.target.value as MealType)} />
            </div>
            <Button className="mt-6 w-full" onClick={logMeal}>Log this meal</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
