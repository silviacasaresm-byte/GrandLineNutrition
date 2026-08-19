export type MealType = 'breakfast' | 'mid_morning' | 'lunch' | 'snack' | 'dinner';

export interface Ingredient {
  id: string;
  name: string;
  amount: number; // in grams, ml or units
  unit: 'g' | 'ml' | 'ud' | 'cucharada' | 'rebanada' | 'taza';
  category: 'verduras' | 'frutas' | 'carnes_pescados' | 'lacteos_huevos' | 'legumbres_cereales' | 'grasas_aceites' | 'especias_otros';
  calories: number; // kcal for this specific amount
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  thyroidFriendly?: boolean; // Hypothyroidism flag
  thyroidNote?: string; // Cooking or nutrient recommendation
}

export interface Recipe {
  id: string;
  name: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: Ingredient[];
  instructions: string[];
  batchCookable: boolean;
  batchCookingTip?: string;
  thyroidSafeCookingTip?: string;
  chefQuote?: string; // Sanji quote
}

export interface Meal {
  id: string;
  type: MealType;
  title: string;
  timeSlot: string; // e.g. "08:30", "14:00"
  recipe: Recipe;
  completed?: boolean;
}

export interface DayDiet {
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1=Lunes, 7=Domingo
  dayName: string;
  meals: Meal[];
  notes?: string;
}

export interface FortnightDiet {
  id: string;
  name: string;
  createdAt: string;
  cycleWeeks: 2;
  weekDays: DayDiet[]; // 7 days template duplicated for the 14-day cycle
}

export interface BioimpedanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  weightKg: number;
  bmi: number;
  bodyFatPercent: number;
  subcutaneousFatPercent: number;
  visceralFatLevel: number; // 1 to 50
  bodyWaterPercent: number;
  skeletalMusclePercent: number;
  muscleMassKg: number;
  boneMassKg: number;
  proteinPercent: number;
  bmrKcal: number;
  bodyAgeYears: number;
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  baseAmount: number;
  unit: string;
  category: string;
  multiplier: number;
  totalAmount: number;
  purchased: boolean;
  isCustom?: boolean;
}

export interface ThyroidGuideline {
  foodName: string;
  type: 'recommended' | 'caution_cook' | 'avoid';
  category: string;
  benefitOrReason: string;
  keyNutrient: string;
  cookingRule?: string;
}

export type StrawHatCrewMember = 
  | 'luffy' 
  | 'zoro' 
  | 'nami' 
  | 'usopp' 
  | 'sanji' 
  | 'chopper' 
  | 'robin' 
  | 'franky' 
  | 'brook' 
  | 'jinbe';
