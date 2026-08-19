import { BioimpedanceRecord, DayDiet, FortnightDiet, Ingredient, Meal, ShoppingItem } from '../types';

export interface DetailedMealMacros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  proteinKcal: number;
  carbsKcal: number;
  fatsKcal: number;
  proteinPct: number;
  carbsPct: number;
  fatsPct: number;
}

// Deterministic & Highly Precise Macro Calculations
export function calculateMealMacros(meal: Meal): DetailedMealMacros {
  if (!meal || !meal.recipe || !meal.recipe.ingredients) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      proteinKcal: 0,
      carbsKcal: 0,
      fatsKcal: 0,
      proteinPct: 0,
      carbsPct: 0,
      fatsPct: 0,
    };
  }

  const rawTotals = meal.recipe.ingredients.reduce(
    (acc, ing) => {
      const p = Number(ing.protein) || 0;
      const c = Number(ing.carbs) || 0;
      const f = Number(ing.fats) || 0;
      // If calories are directly specified use them, else Atwater formula (4-4-9)
      const directKcal = Number(ing.calories);
      const computedKcal = !isNaN(directKcal) && directKcal > 0 ? directKcal : (p * 4 + c * 4 + f * 9);

      return {
        calories: acc.calories + computedKcal,
        protein: acc.protein + p,
        carbs: acc.carbs + c,
        fats: acc.fats + f,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const protein = Math.round(rawTotals.protein * 10) / 10;
  const carbs = Math.round(rawTotals.carbs * 10) / 10;
  const fats = Math.round(rawTotals.fats * 10) / 10;
  const calories = Math.round(rawTotals.calories);

  const proteinKcal = Math.round(protein * 4);
  const carbsKcal = Math.round(carbs * 4);
  const fatsKcal = Math.round(fats * 9);
  const totalMacroKcal = Math.max(1, proteinKcal + carbsKcal + fatsKcal);

  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatsPct = Math.max(0, 100 - proteinPct - carbsPct);

  return {
    calories,
    protein,
    carbs,
    fats,
    proteinKcal,
    carbsKcal,
    fatsKcal,
    proteinPct,
    carbsPct,
    fatsPct,
  };
}

export function calculateDayMacros(day: DayDiet) {
  if (!day || !day.meals) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      proteinKcal: 0,
      carbsKcal: 0,
      fatsKcal: 0,
      proteinPct: 0,
      carbsPct: 0,
      fatsPct: 0,
    };
  }

  const totals = day.meals.reduce(
    (acc, meal) => {
      const m = calculateMealMacros(meal);
      return {
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fats: acc.fats + m.fats,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const protein = Math.round(totals.protein * 10) / 10;
  const carbs = Math.round(totals.carbs * 10) / 10;
  const fats = Math.round(totals.fats * 10) / 10;
  const calories = Math.round(totals.calories);

  const proteinKcal = Math.round(protein * 4);
  const carbsKcal = Math.round(carbs * 4);
  const fatsKcal = Math.round(fats * 9);
  const totalMacroKcal = Math.max(1, proteinKcal + carbsKcal + fatsKcal);

  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatsPct = Math.max(0, 100 - proteinPct - carbsPct);

  return {
    calories,
    protein,
    carbs,
    fats,
    proteinKcal,
    carbsKcal,
    fatsKcal,
    proteinPct,
    carbsPct,
    fatsPct,
  };
}

export function calculateDietAverageMacros(diet: FortnightDiet) {
  if (!diet.weekDays || diet.weekDays.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fats: 0, proteinPct: 0, carbsPct: 0, fatsPct: 0 };
  }
  const totals = diet.weekDays.reduce(
    (acc, day) => {
      const dm = calculateDayMacros(day);
      return {
        calories: acc.calories + dm.calories,
        protein: acc.protein + dm.protein,
        carbs: acc.carbs + dm.carbs,
        fats: acc.fats + dm.fats,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const daysCount = diet.weekDays.length;
  const calories = Math.round(totals.calories / daysCount);
  const protein = Math.round((totals.protein / daysCount) * 10) / 10;
  const carbs = Math.round((totals.carbs / daysCount) * 10) / 10;
  const fats = Math.round((totals.fats / daysCount) * 10) / 10;

  const proteinKcal = Math.round(protein * 4);
  const carbsKcal = Math.round(carbs * 4);
  const fatsKcal = Math.round(fats * 9);
  const totalMacroKcal = Math.max(1, proteinKcal + carbsKcal + fatsKcal);

  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatsPct = Math.max(0, 100 - proteinPct - carbsPct);

  return {
    calories,
    protein,
    carbs,
    fats,
    proteinPct,
    carbsPct,
    fatsPct,
  };
}

// Shopping list consolidation
export function generateShoppingList(
  diet: FortnightDiet,
  multiplier: number = 2,
  customItems: ShoppingItem[] = []
): ShoppingItem[] {
  const map = new Map<string, { name: string; baseAmount: number; unit: string; category: string }>();

  // Consolidate across 7 days
  diet.weekDays.forEach((day) => {
    day.meals.forEach((meal) => {
      meal.recipe.ingredients.forEach((ing) => {
        const key = `${ing.name.trim().toLowerCase()}_${ing.unit}`;
        const existing = map.get(key);
        if (existing) {
          existing.baseAmount += ing.amount;
        } else {
          map.set(key, {
            name: ing.name.trim(),
            baseAmount: ing.amount,
            unit: ing.unit,
            category: ing.category,
          });
        }
      });
    });
  });

  const generatedItems: ShoppingItem[] = Array.from(map.entries()).map(([key, val], index) => ({
    id: `shop-gen-${index}-${key}`,
    name: val.name,
    baseAmount: Math.round(val.baseAmount * 10) / 10,
    unit: val.unit,
    category: val.category,
    multiplier,
    totalAmount: Math.round(val.baseAmount * multiplier * 10) / 10,
    purchased: false,
  }));

  return [...generatedItems, ...customItems];
}

// Bioimpedance Delta comparison
export interface BioDelta {
  weightDiff: number;
  fatPercentDiff: number;
  muscleMassDiff: number;
  visceralDiff: number;
  waterDiff: number;
  bmiDiff: number;
  bmrDiff: number;
  bodyAgeDiff: number;
  daysBetween: number;
  evaluation: {
    status: 'positive' | 'neutral' | 'warning';
    summary: string;
    chopperDiagnosis: string;
  };
}

export function compareBioimpedance(recOld: BioimpedanceRecord, recNew: BioimpedanceRecord): BioDelta {
  const weightDiff = Math.round((recNew.weightKg - recOld.weightKg) * 10) / 10;
  const fatPercentDiff = Math.round((recNew.bodyFatPercent - recOld.bodyFatPercent) * 10) / 10;
  const muscleMassDiff = Math.round((recNew.muscleMassKg - recOld.muscleMassKg) * 10) / 10;
  const visceralDiff = recNew.visceralFatLevel - recOld.visceralFatLevel;
  const waterDiff = Math.round((recNew.bodyWaterPercent - recOld.bodyWaterPercent) * 10) / 10;
  const bmiDiff = Math.round((recNew.bmi - recOld.bmi) * 10) / 10;
  const bmrDiff = recNew.bmrKcal - recOld.bmrKcal;
  const bodyAgeDiff = recNew.bodyAgeYears - recOld.bodyAgeYears;

  const date1 = new Date(recOld.date);
  const date2 = new Date(recNew.date);
  const daysBetween = Math.max(1, Math.round(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)));

  let status: 'positive' | 'neutral' | 'warning' = 'neutral';
  let summary = '';
  let chopperDiagnosis = '';

  if (fatPercentDiff <= -0.5 && muscleMassDiff >= 0) {
    status = 'positive';
    summary = '¡Recomposición corporal estelar! Pérdida de grasa corporal manteniendo o aumentando la masa muscular activa.';
    chopperDiagnosis = `¡Increíble progreso! Has bajado ${Math.abs(fatPercentDiff)}% de grasa mientras tu masa muscular subió +${muscleMassDiff > 0 ? muscleMassDiff : 0} kg. Tu BMR (${recNew.bmrKcal} kcal) está protegido y tu metabolismo tiroideo responde activamente.`;
  } else if (weightDiff < 0 && muscleMassDiff < -0.6) {
    status = 'warning';
    summary = 'Pérdida de peso con sacrificio de masa muscular. Conviene revisar el aporte proteico y entrenamiento de fuerza.';
    chopperDiagnosis = `¡Cuidado marinero! Estás perdiendo masa muscular (-${Math.abs(muscleMassDiff)} kg). En hipotiroidismo el músculo es tu mayor aliado para mantener el metabolismo. Aumenta los huevos camperos, pescados y carnes magras de Sanji.`;
  } else if (weightDiff > 0 && fatPercentDiff <= 0) {
    status = 'positive';
    summary = 'Aumento de peso limpio debido al incremento de masa muscular e hidratación óptima.';
    chopperDiagnosis = `¡Puro poder pirata! El incremento de peso (+${weightDiff} kg) corresponde a músculo esquelético (+${muscleMassDiff} kg). ¡Excelente!`;
  } else {
    status = 'neutral';
    summary = 'Evolución estable. Mantener la constancia en el plan quincenal y la hidratación.';
    chopperDiagnosis = `Valores estables en el período (${daysBetween} días). Continúa con los hábitos saludables y la toma en ayunas de tu medicación.`;
  }

  return {
    weightDiff,
    fatPercentDiff,
    muscleMassDiff,
    visceralDiff,
    waterDiff,
    bmiDiff,
    bmrDiff,
    bodyAgeDiff,
    daysBetween,
    evaluation: { status, summary, chopperDiagnosis },
  };
}

// Deterministic TDEE / BMR Calculator (Mifflin-St Jeor)
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161);
  }
}

export function calculateTDEE(
  bmr: number,
  activityMultiplier: number // 1.2, 1.375, 1.55, 1.725, 1.9
): number {
  return Math.round(bmr * activityMultiplier);
}

// CSV Export & Import for Diet
export function exportDietToCSV(diet: FortnightDiet): string {
  const headers = [
    'Dia_Numero',
    'Dia_Nombre',
    'Tipo_Toma',
    'Hora',
    'Receta_Nombre',
    'Ingrediente_Nombre',
    'Cantidad',
    'Unidad',
    'Categoria',
    'Calorias_kcal',
    'Proteina_g',
    'Carbohidratos_g',
    'Grasas_g',
    'Apto_Tiroides',
    'Nota_Tiroides',
    'Batch_Cooking',
    'Consejo_Batch',
    'Frase_Chef'
  ];

  const rows: string[] = [];
  rows.push(headers.join(','));

  diet.weekDays.forEach((day) => {
    day.meals.forEach((meal) => {
      meal.recipe.ingredients.forEach((ing) => {
        const row = [
          day.dayOfWeek,
          `"${day.dayName}"`,
          `"${meal.type}"`,
          `"${meal.timeSlot}"`,
          `"${meal.recipe.name.replace(/"/g, '""')}"`,
          `"${ing.name.replace(/"/g, '""')}"`,
          ing.amount,
          `"${ing.unit}"`,
          `"${ing.category}"`,
          ing.calories,
          ing.protein,
          ing.carbs,
          ing.fats,
          ing.thyroidFriendly ? 'SI' : 'NO',
          `"${(ing.thyroidNote || '').replace(/"/g, '""')}"`,
          meal.recipe.batchCookable ? 'SI' : 'NO',
          `"${(meal.recipe.batchCookingTip || '').replace(/"/g, '""')}"`,
          `"${(meal.recipe.chefQuote || '').replace(/"/g, '""')}"`
        ];
        rows.push(row.join(','));
      });
    });
  });

  return rows.join('\n');
}

export function parseDietFromCSV(csvContent: string): FortnightDiet {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('El archivo CSV está vacío o no contiene filas de datos.');
  }

  const daysMap = new Map<number, DayDiet>();
  const daysNames = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  for (let d = 1; d <= 7; d++) {
    daysMap.set(d, {
      dayOfWeek: d as any,
      dayName: daysNames[d],
      meals: []
    });
  }

  // Parse lines starting from index 1 (skip header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split CSV handling quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null && matches.length < 20) {
      let val = match[1];
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1).replace(/""/g, '"');
      }
      matches.push(val);
    }

    if (matches.length >= 13) {
      const dayNum = parseInt(matches[0], 10) || 1;
      const dayName = matches[1] || daysNames[dayNum];
      const mealType = (matches[2] || 'lunch') as any;
      const timeSlot = matches[3] || '14:00';
      const recipeName = matches[4] || 'Receta Sin Nombre';
      const ingName = matches[5] || 'Ingrediente';
      const ingAmount = parseFloat(matches[6]) || 100;
      const ingUnit = (matches[7] || 'g') as any;
      const ingCat = (matches[8] || 'verduras') as any;
      const ingKcal = parseFloat(matches[9]) || 100;
      const ingProt = parseFloat(matches[10]) || 0;
      const ingCarbs = parseFloat(matches[11]) || 0;
      const ingFats = parseFloat(matches[12]) || 0;
      const ingThyroid = matches[13]?.toUpperCase() === 'SI';
      const ingThyroidNote = matches[14] || '';
      const batchCookable = matches[15]?.toUpperCase() === 'SI';
      const batchTip = matches[16] || '';
      const chefQuote = matches[17] || '';

      const day = daysMap.get(dayNum);
      if (day) {
        let meal = day.meals.find((m) => m.recipe.name === recipeName && m.timeSlot === timeSlot);
        if (!meal) {
          meal = {
            id: `csv-meal-${dayNum}-${day.meals.length + 1}-${Date.now()}`,
            type: mealType,
            title: recipeName,
            timeSlot: timeSlot,
            completed: false,
            recipe: {
              id: `csv-rec-${dayNum}-${Date.now()}`,
              name: recipeName,
              prepTimeMinutes: 10,
              cookTimeMinutes: 15,
              batchCookable: batchCookable,
              batchCookingTip: batchTip,
              chefQuote: chefQuote,
              ingredients: [],
              instructions: ['Preparar los ingredientes frescos y cocinar según la pauta nutricional.']
            }
          };
          day.meals.push(meal);
        }

        meal.recipe.ingredients.push({
          id: `csv-ing-${Date.now()}-${Math.random()}`,
          name: ingName,
          amount: ingAmount,
          unit: ingUnit,
          category: ingCat,
          calories: ingKcal,
          protein: ingProt,
          carbs: ingCarbs,
          fats: ingFats,
          thyroidFriendly: ingThyroid,
          thyroidNote: ingThyroidNote
        });
      }
    }
  }

  const weekDays = Array.from(daysMap.values());
  return {
    id: `diet-imported-${Date.now()}`,
    name: 'Dieta Grand Line (Importada CSV)',
    createdAt: new Date().toISOString().split('T')[0],
    cycleWeeks: 2,
    weekDays: weekDays
  };
}

// CSV Export & Import for Bioimpedance
export function exportBioimpedanceToCSV(records: BioimpedanceRecord[]): string {
  const headers = [
    'Fecha',
    'Hora',
    'Peso_kg',
    'Grasa_Corporal_pct',
    'Masa_Muscular_kg',
    'Musculo_Esqueletico_pct',
    'Grasa_Visceral_nivel',
    'Grasa_Subcutanea_pct',
    'Agua_Corporal_pct',
    'Masa_Osea_kg',
    'Proteina_pct',
    'BMR_kcal',
    'Edad_Metabolica_anios',
    'IMC',
    'Notas_Clinicas'
  ];

  const rows = [headers.join(',')];

  records.forEach((r) => {
    const row = [
      `"${r.date}"`,
      `"${r.time || '07:30'}"`,
      r.weightKg,
      r.bodyFatPercent,
      r.muscleMassKg,
      r.skeletalMusclePercent,
      r.visceralFatLevel,
      r.subcutaneousFatPercent,
      r.bodyWaterPercent,
      r.boneMassKg,
      r.proteinPercent,
      r.bmrKcal,
      r.bodyAgeYears,
      r.bmi,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

export function parseBioimpedanceFromCSV(csvContent: string): BioimpedanceRecord[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const records: BioimpedanceRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',').map((p) => p.replace(/^"|"$/g, '').trim());
    if (parts.length >= 14) {
      records.push({
        id: `bio-csv-${Date.now()}-${i}`,
        date: parts[0] || new Date().toISOString().split('T')[0],
        time: parts[1] || '07:30',
        weightKg: parseFloat(parts[2]) || 70,
        bodyFatPercent: parseFloat(parts[3]) || 20,
        muscleMassKg: parseFloat(parts[4]) || 50,
        skeletalMusclePercent: parseFloat(parts[5]) || 35,
        visceralFatLevel: parseInt(parts[6], 10) || 5,
        subcutaneousFatPercent: parseFloat(parts[7]) || 15,
        bodyWaterPercent: parseFloat(parts[8]) || 55,
        boneMassKg: parseFloat(parts[9]) || 3.0,
        proteinPercent: parseFloat(parts[10]) || 18,
        bmrKcal: parseInt(parts[11], 10) || 1600,
        bodyAgeYears: parseInt(parts[12], 10) || 28,
        bmi: parseFloat(parts[13]) || 23.5,
        notes: parts[14] || ''
      });
    }
  }

  return records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
