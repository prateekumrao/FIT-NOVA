// ========================================
// data/foods.ts
// Purpose: DEMO food library with Indian foods. All numbers are rough ESTIMATES for education.
// Replace with GET /api/nutrition/foods (PostgreSQL-backed) later.
// ========================================
import type { Food } from '../types';

export const demoFoods: Food[] = [
  { id: 'f1', name: 'Roti (whole wheat)', category: 'Staples', diet: 'Veg', serving: '1 medium roti (40 g)', calories: 120, protein: 3.5, carbs: 22, fat: 2.5, fiber: 3 },
  { id: 'f2', name: 'Cooked white rice', category: 'Staples', diet: 'Veg', serving: '1 cup (150 g)', calories: 200, protein: 4, carbs: 44, fat: 0.4, fiber: 0.6 },
  { id: 'f3', name: 'Brown rice', category: 'Staples', diet: 'Veg', serving: '1 cup (150 g)', calories: 215, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5 },
  { id: 'f4', name: 'Dal (toor, cooked)', category: 'Pulses & Legumes', diet: 'Veg', serving: '1 katori (150 g)', calories: 150, protein: 9, carbs: 22, fat: 3, fiber: 5 },
  { id: 'f5', name: 'Moong dal (cooked)', category: 'Pulses & Legumes', diet: 'Veg', serving: '1 katori (150 g)', calories: 140, protein: 10, carbs: 20, fat: 2, fiber: 5 },
  { id: 'f6', name: 'Chana (boiled chickpeas)', category: 'Pulses & Legumes', diet: 'Veg', serving: '1 katori (100 g)', calories: 165, protein: 9, carbs: 27, fat: 2.6, fiber: 7.5 },
  { id: 'f7', name: 'Rajma (cooked)', category: 'Pulses & Legumes', diet: 'Veg', serving: '1 katori (150 g)', calories: 190, protein: 12, carbs: 32, fat: 2, fiber: 9 },
  { id: 'f8', name: 'Paneer', category: 'Dairy', diet: 'Veg', serving: '100 g', calories: 265, protein: 18, carbs: 3, fat: 20, fiber: 0 },
  { id: 'f9', name: 'Milk (toned)', category: 'Dairy', diet: 'Veg', serving: '1 glass (250 ml)', calories: 150, protein: 8, carbs: 12, fat: 8, fiber: 0 },
  { id: 'f10', name: 'Curd / dahi', category: 'Dairy', diet: 'Veg', serving: '1 katori (150 g)', calories: 90, protein: 5, carbs: 7, fat: 4.5, fiber: 0 },
  { id: 'f11', name: 'Mixed vegetable sabzi', category: 'Vegetables', diet: 'Veg', serving: '1 katori (150 g)', calories: 110, protein: 3, carbs: 14, fat: 5, fiber: 4 },
  { id: 'f12', name: 'Palak (spinach, cooked)', category: 'Vegetables', diet: 'Veg', serving: '1 katori (100 g)', calories: 55, protein: 3.5, carbs: 6, fat: 2.5, fiber: 3 },
  { id: 'f13', name: 'Banana', category: 'Fruits', diet: 'Veg', serving: '1 medium (120 g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3 },
  { id: 'f14', name: 'Apple', category: 'Fruits', diet: 'Veg', serving: '1 medium (180 g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
  { id: 'f15', name: 'Papaya', category: 'Fruits', diet: 'Veg', serving: '1 cup (140 g)', calories: 60, protein: 0.7, carbs: 15, fat: 0.2, fiber: 2.5 },
  { id: 'f16', name: 'Boiled egg', category: 'Protein', diet: 'Non-veg', serving: '1 large egg', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0 },
  { id: 'f17', name: 'Chicken curry (home style)', category: 'Protein', diet: 'Non-veg', serving: '1 katori (150 g)', calories: 230, protein: 22, carbs: 6, fat: 13, fiber: 1 },
  { id: 'f18', name: 'Fish curry', category: 'Protein', diet: 'Non-veg', serving: '1 katori (150 g)', calories: 190, protein: 20, carbs: 5, fat: 10, fiber: 1 },
  { id: 'f19', name: 'Poha', category: 'Snacks', diet: 'Veg', serving: '1 plate (150 g)', calories: 250, protein: 5, carbs: 42, fat: 7, fiber: 3 },
  { id: 'f20', name: 'Roasted chana', category: 'Snacks', diet: 'Veg', serving: '30 g handful', calories: 110, protein: 6, carbs: 18, fat: 2, fiber: 5 },
];

export const foodCategories = ['All', 'Staples', 'Pulses & Legumes', 'Dairy', 'Vegetables', 'Fruits', 'Protein', 'Snacks'] as const;
