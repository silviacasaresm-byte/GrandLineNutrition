import React, { useState } from 'react';
import { FortnightDiet } from '../types';
import { calculateBMR, calculateDietAverageMacros, calculateTDEE } from '../utils/calculations';
import { 
  Calculator, 
  Flame, 
  Sparkles, 
  Activity, 
  Zap, 
  Dumbbell, 
  Target, 
  Award, 
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';

interface MacroCalculatorFrankyProps {
  diet: FortnightDiet;
}

export const MacroCalculatorFranky: React.FC<MacroCalculatorFrankyProps> = ({ diet }) => {
  // Personal inputs
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number | ''>(30);
  const [weightKg, setWeightKg] = useState<number | ''>(75);
  const [heightCm, setHeightCm] = useState<number | ''>(178);
  const [bodyFatPercent, setBodyFatPercent] = useState<number | ''>(22);
  const [activityLevel, setActivityLevel] = useState<number>(1.55); // Moderate
  const [goal, setGoal] = useState<'loss' | 'maintenance' | 'gain'>('loss');
  const [macroSplit, setMacroSplit] = useState<'thyroid_safe' | 'high_protein' | 'balanced'>('thyroid_safe');

  // Calculations
  const numWeight = typeof weightKg === 'number' ? weightKg : 75;
  const numHeight = typeof heightCm === 'number' ? heightCm : 178;
  const numAge = typeof age === 'number' ? age : 30;
  const numBodyFat = typeof bodyFatPercent === 'number' ? bodyFatPercent : 22;

  const bmrMifflin = calculateBMR(numWeight, numHeight, numAge, gender);
  const leanMassKg = numWeight * (1 - numBodyFat / 100);
  const bmrKatch = Math.round(370 + 21.6 * leanMassKg);
  const selectedBmr = bmrMifflin;

  const tdee = calculateTDEE(selectedBmr, activityLevel);

  // Calorie target based on goal
  let targetCalories = tdee;
  if (goal === 'loss') targetCalories = Math.round(tdee * 0.82); // -18% deficit
  if (goal === 'gain') targetCalories = Math.round(tdee * 1.10); // +10% surplus

  // Macro Grams calculation
  let proteinRatio = 0.30;
  let carbsRatio = 0.35;
  let fatsRatio = 0.35;

  if (macroSplit === 'high_protein') {
    proteinRatio = 0.35;
    carbsRatio = 0.40;
    fatsRatio = 0.25;
  } else if (macroSplit === 'balanced') {
    proteinRatio = 0.25;
    carbsRatio = 0.45;
    fatsRatio = 0.30;
  }

  const targetProteinGrams = Math.round((targetCalories * proteinRatio) / 4);
  const targetCarbsGrams = Math.round((targetCalories * carbsRatio) / 4);
  const targetFatsGrams = Math.round((targetCalories * fatsRatio) / 9);

  const dietAverages = calculateDietAverageMacros(diet);
  const calorieDiff = dietAverages.calories - targetCalories;

  return (
    <div className="space-y-6 pb-12">
      {/* Franky SUPER Header */}
      <div className="bg-[#0B44C8] text-white p-6 rounded-2xl shadow-lg border-2 border-[#FDDF28]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-[#FDDF28] border border-[#FDDF28]/30 mb-2">
              <span>🤖 CALCULADORA FRANKY SUPER BOUNTY</span>
              <span>•</span>
              <span>MATEMÁTICA DETERMINISTA PURA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Calculadora de Gasto Calórico & Bounty Macros
            </h1>
            <p className="text-sm text-cyan-100 mt-1 max-w-2xl">
              Fórmulas científicas de Mifflin-St Jeor y Katch-McArdle. Sin suposiciones ni estimaciones arbitrarias.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur p-3 rounded-xl border border-white/20 text-center">
            <span className="text-[10px] text-yellow-300 font-bold uppercase block">Bounty de tu Dieta</span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {(targetCalories * 1000).toLocaleString()} Berries
            </span>
          </div>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-black text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Calculator className="w-5 h-5 text-[#0B44C8]" />
            <span>Parámetros Fisiológicos y Nivel de Actividad</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Género</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full border p-2.5 rounded-lg bg-white font-semibold"
              >
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Edad (Años)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full border p-2.5 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full border p-2.5 rounded-lg font-bold text-blue-700"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Altura (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full border p-2.5 rounded-lg font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Nivel de Actividad Física</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                className="w-full border p-2.5 rounded-lg bg-white font-medium"
              >
                <option value={1.2}>Sedentario (Trabajo de escritorio / poco ejercicio)</option>
                <option value={1.375}>Ligero (1-3 días de entrenamiento / semana)</option>
                <option value={1.55}>Moderado (3-5 días de entrenamiento / semana)</option>
                <option value={1.725}>Intenso (6-7 días de entrenamiento duro)</option>
                <option value={1.9}>Extra Intenso (Entrenamiento pirata doble sesión)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Objetivo Nutricional</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full border p-2.5 rounded-lg bg-white font-bold text-blue-900"
              >
                <option value="loss">Definición / Pérdida de Grasa (-18% déficit)</option>
                <option value="maintenance">Mantenimiento / Recomposición (0% cambio)</option>
                <option value="gain">Ganancia Muscular Magra (+10% superávit)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 text-xs block mb-2">Distribución de Macronutrientes</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMacroSplit('thyroid_safe')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  macroSplit === 'thyroid_safe'
                    ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="block font-black text-sm text-blue-800">✨ Tiroides & Balance</span>
                <span className="text-[11px] text-gray-600">30% P / 35% C / 35% G</span>
              </button>

              <button
                type="button"
                onClick={() => setMacroSplit('high_protein')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  macroSplit === 'high_protein'
                    ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="block font-black text-sm text-blue-800">💪 Alta Proteína (Zoro)</span>
                <span className="text-[11px] text-gray-600">35% P / 40% C / 25% G</span>
              </button>

              <button
                type="button"
                onClick={() => setMacroSplit('balanced')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  macroSplit === 'balanced'
                    ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="block font-black text-sm text-blue-800">⚖️ Estándar Equilibrado</span>
                <span className="text-[11px] text-gray-600">25% P / 45% C / 30% G</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Results & Comparison */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#0B44C8]/40 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-950">
              Resultados Deterministas
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-600 font-semibold">Metabolismo Basal (BMR):</span>
                <span className="text-sm font-black text-gray-900">{selectedBmr} kcal</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-600 font-semibold">Gasto Total Diario (TDEE):</span>
                <span className="text-sm font-black text-gray-900">{tdee} kcal</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-xs text-blue-900 font-extrabold">Objetivo Diario Calculado:</span>
                <span className="text-lg font-black text-blue-700">{targetCalories} kcal</span>
              </div>
            </div>

            {/* Target Macros Distribution */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase block">Macros Objetivo por Día:</span>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <span className="text-[10px] text-blue-700 font-bold block">Proteína</span>
                  <span className="text-base font-black text-blue-900">{targetProteinGrams}g</span>
                  <span className="text-[9px] text-gray-500 block">{(targetProteinGrams / weightKg).toFixed(1)} g/kg</span>
                </div>

                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-amber-700 font-bold block">Carbohidratos</span>
                  <span className="text-base font-black text-amber-900">{targetCarbsGrams}g</span>
                  <span className="text-[9px] text-gray-500 block">Energía limpia</span>
                </div>

                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold block">Grasas</span>
                  <span className="text-base font-black text-emerald-900">{targetFatsGrams}g</span>
                  <span className="text-[9px] text-gray-500 block">Hormonas & AOVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alignment Check with Current Diet Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-600">
              Alineación con tu Dieta Actual
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Media actual de tu menú:</span>
                <span className="font-extrabold text-gray-900">{dietAverages.calories} kcal / día</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Objetivo Franky:</span>
                <span className="font-extrabold text-blue-700">{targetCalories} kcal / día</span>
              </div>
              <div className="flex items-center justify-between font-bold pt-1 border-t border-gray-100">
                <span>Diferencial:</span>
                <span className={Math.abs(calorieDiff) < 100 ? 'text-emerald-600' : 'text-amber-600'}>
                  {calorieDiff > 0 ? `+${calorieDiff}` : calorieDiff} kcal
                </span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg">
              {Math.abs(calorieDiff) < 100 ? (
                <span className="text-emerald-700 font-bold">✅ ¡Tu menú actual está perfectamente alineado con tus objetivos fisiológicos!</span>
              ) : (
                <span>💡 Puedes ajustar las raciones de arroz o aceite en el Plan Quincenal si deseas afinar el balance calórico exacto.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
