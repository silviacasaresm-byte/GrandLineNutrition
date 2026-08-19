import { Ingredient } from '../types';
import { FoodDatabaseItem } from './foods/types';
import { MEATS_DATABASE } from './foods/meats';
import { FISH_SEAFOOD_DATABASE } from './foods/fishSeafood';
import { DAIRY_EGGS_DATABASE } from './foods/dairyEggs';
import { GRAINS_TUBERS_DATABASE } from './foods/grainsTubers';
import { LEGUMES_DATABASE } from './foods/legumes';
import { VEGETABLES_DATABASE } from './foods/vegetables';
import { FRUITS_DATABASE } from './foods/fruits';
import { NUTS_OILS_DATABASE } from './foods/nutsOils';
import { CONDIMENTS_EXTRAS_DATABASE } from './foods/condimentsExtras';

export type { FoodDatabaseItem } from './foods/types';

/**
 * Base de datos mundial de alimentos exhaustiva para cálculo de calorías y macronutrientes.
 */
export const SPANISH_NUTRITION_DATABASE: FoodDatabaseItem[] = [
  ...MEATS_DATABASE,
  ...FISH_SEAFOOD_DATABASE,
  ...DAIRY_EGGS_DATABASE,
  ...GRAINS_TUBERS_DATABASE,
  ...LEGUMES_DATABASE,
  ...VEGETABLES_DATABASE,
  ...FRUITS_DATABASE,
  ...NUTS_OILS_DATABASE,
  ...CONDIMENTS_EXTRAS_DATABASE,
];

/**
 * Normaliza términos para búsquedas flexibles sin tildes ni mayúsculas.
 */
function normalizeSearchTerm(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Busca coincidencias en la base de datos de nutrición.
 */
export function searchFoodDatabase(query: string): FoodDatabaseItem[] {
  if (!query || query.trim().length === 0) {
    return SPANISH_NUTRITION_DATABASE.slice(0, 30);
  }

  const cleanQuery = normalizeSearchTerm(query);
  const words = cleanQuery.split(/\s+/).filter(Boolean);

  return SPANISH_NUTRITION_DATABASE.filter((item) => {
    const cleanName = normalizeSearchTerm(item.name);
    const cleanAliases = item.aliases.map(normalizeSearchTerm);

    // Coincidencia exacta o contiene en nombre o alias
    if (cleanName.includes(cleanQuery)) return true;
    if (cleanAliases.some((a) => a.includes(cleanQuery))) return true;

    // Coincidencia por todas las palabras clave
    return words.every((w) => cleanName.includes(w) || cleanAliases.some((a) => a.includes(w)));
  });
}

/**
 * Calcula determinísticamente los macronutrientes y calorías
 * según el alimento seleccionado, la cantidad y la unidad.
 */
export function computeAutoMacros(
  foodItem: FoodDatabaseItem,
  amount: number,
  unit: 'g' | 'ml' | 'ud' | 'cucharada'
): {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: Ingredient['category'];
  thyroidFriendly: boolean;
  thyroidNote?: string;
} {
  const safeAmount = Math.max(0, isNaN(amount) ? 0 : amount);
  let p = 0;
  let c = 0;
  let f = 0;
  let directKcal = 0;

  if (unit === 'ud' && foodItem.perUnit) {
    p = foodItem.perUnit.protein * safeAmount;
    c = foodItem.perUnit.carbs * safeAmount;
    f = foodItem.perUnit.fats * safeAmount;
    directKcal = foodItem.perUnit.calories * safeAmount;
  } else if (unit === 'cucharada' && foodItem.perTablespoon) {
    p = foodItem.perTablespoon.protein * safeAmount;
    c = foodItem.perTablespoon.carbs * safeAmount;
    f = foodItem.perTablespoon.fats * safeAmount;
    directKcal = foodItem.perTablespoon.calories * safeAmount;
  } else {
    // Por gramos o ml (proporcional a 100g)
    const factor = safeAmount / 100;
    p = foodItem.per100g.protein * factor;
    c = foodItem.per100g.carbs * factor;
    f = foodItem.per100g.fats * factor;
    directKcal = foodItem.per100g.calories * factor;
  }

  // Redondeo exacto
  const roundedProt = Math.round(p * 10) / 10;
  const roundedCarbs = Math.round(c * 10) / 10;
  const roundedFats = Math.round(f * 10) / 10;
  const roundedKcal = directKcal > 0 ? Math.round(directKcal) : Math.round(roundedProt * 4 + roundedCarbs * 4 + roundedFats * 9);

  return {
    calories: roundedKcal,
    protein: roundedProt,
    carbs: roundedCarbs,
    fats: roundedFats,
    category: foodItem.category,
    thyroidFriendly: foodItem.thyroidFriendly,
    thyroidNote: foodItem.thyroidNote,
  };
}
