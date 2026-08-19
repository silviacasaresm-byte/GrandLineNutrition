import React, { useState } from 'react';
import { Meal, Ingredient } from '../types';
import { calculateMealMacros, DetailedMealMacros } from '../utils/calculations';
import { Flame, Beef, Wheat, Droplets, ChevronDown, ChevronUp, ShieldCheck, AlertCircle } from 'lucide-react';

interface MealMacroBreakdownProps {
  meal: Meal;
  showIngredientDetails?: boolean;
  compact?: boolean;
}

export const MealMacroBreakdown: React.FC<MealMacroBreakdownProps> = ({
  meal,
  showIngredientDetails = false,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(showIngredientDetails);
  const macros: DetailedMealMacros = calculateMealMacros(meal);

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
          {/* Calorías */}
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-extrabold border border-red-200">
            <Flame className="w-3 h-3 text-red-500" />
            <span>{macros.calories} kcal</span>
          </span>

          {/* Proteína */}
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
            <Beef className="w-3 h-3 text-blue-500" />
            <span>P: {macros.protein}g ({macros.proteinPct}%)</span>
          </span>

          {/* Carbohidratos */}
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
            <Wheat className="w-3 h-3 text-amber-600" />
            <span>C: {macros.carbs}g ({macros.carbsPct}%)</span>
          </span>

          {/* Grasas */}
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-yellow-50 text-yellow-800 font-bold border border-yellow-300">
            <Droplets className="w-3 h-3 text-yellow-600" />
            <span>G: {macros.fats}g ({macros.fatsPct}%)</span>
          </span>
        </div>

        {/* Barra Proporcional de Macronutrientes */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="bg-[#0B44C8] transition-all"
            style={{ width: `${macros.proteinPct}%` }}
            title={`Proteína: ${macros.proteinPct}%`}
          />
          <div
            className="bg-[#B3480B] transition-all"
            style={{ width: `${macros.carbsPct}%` }}
            title={`Carbohidratos: ${macros.carbsPct}%`}
          />
          <div
            className="bg-[#FDDF28] transition-all"
            style={{ width: `${macros.fatsPct}%` }}
            title={`Grasas: ${macros.fatsPct}%`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-3.5 space-y-3">
      {/* Cabecera de Macros de la Comida */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {/* Calorías */}
        <div className="bg-white p-2.5 rounded-lg border border-red-100 shadow-2xs">
          <div className="flex items-center justify-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider text-red-600">
            <Flame className="w-3 h-3 text-red-500" />
            <span>Calorías</span>
          </div>
          <p className="text-lg font-black text-red-600 mt-0.5">{macros.calories}</p>
          <span className="text-[10px] text-slate-400 font-medium">kcal totales</span>
        </div>

        {/* Proteínas */}
        <div className="bg-white p-2.5 rounded-lg border border-blue-100 shadow-2xs">
          <div className="flex items-center justify-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
            <Beef className="w-3 h-3 text-blue-500" />
            <span>Proteínas</span>
          </div>
          <p className="text-lg font-black text-blue-700 mt-0.5">{macros.protein}g</p>
          <span className="text-[10px] text-blue-600 font-semibold">{macros.proteinPct}% ({macros.proteinKcal} kcal)</span>
        </div>

        {/* Carbohidratos */}
        <div className="bg-white p-2.5 rounded-lg border border-amber-100 shadow-2xs">
          <div className="flex items-center justify-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
            <Wheat className="w-3 h-3 text-amber-600" />
            <span>Carbohidratos</span>
          </div>
          <p className="text-lg font-black text-amber-800 mt-0.5">{macros.carbs}g</p>
          <span className="text-[10px] text-amber-700 font-semibold">{macros.carbsPct}% ({macros.carbsKcal} kcal)</span>
        </div>

        {/* Grasas */}
        <div className="bg-white p-2.5 rounded-lg border border-yellow-200 shadow-2xs">
          <div className="flex items-center justify-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider text-yellow-800">
            <Droplets className="w-3 h-3 text-yellow-600" />
            <span>Grasas</span>
          </div>
          <p className="text-lg font-black text-yellow-800 mt-0.5">{macros.fats}g</p>
          <span className="text-[10px] text-yellow-700 font-semibold">{macros.fatsPct}% ({macros.fatsKcal} kcal)</span>
        </div>
      </div>

      {/* Barra de Distribución Energética */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
          <span>Distribución de Macronutrientes</span>
          <span>Prot {macros.proteinPct}% | Carb {macros.carbsPct}% | Gras {macros.fatsPct}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="bg-[#0B44C8] transition-all"
            style={{ width: `${macros.proteinPct}%` }}
          />
          <div
            className="bg-[#B3480B] transition-all"
            style={{ width: `${macros.carbsPct}%` }}
          />
          <div
            className="bg-[#FDDF28] transition-all"
            style={{ width: `${macros.fatsPct}%` }}
          />
        </div>
      </div>

      {/* Desglose por Ingrediente Botón / Tabla */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-[#09086E] py-1 px-2 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
        >
          <span>Desglose por Ingrediente ({meal.recipe.ingredients.length} alimentos)</span>
          <div className="flex items-center space-x-1 text-[11px] text-slate-500">
            <span>{isExpanded ? 'Ocultar' : 'Ver detalle'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-2 overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Alimento</th>
                  <th className="py-2 px-2 text-right">Porción</th>
                  <th className="py-2 px-2 text-right text-red-600">Kcal</th>
                  <th className="py-2 px-2 text-right text-blue-700">Prot</th>
                  <th className="py-2 px-2 text-right text-amber-700">Carb</th>
                  <th className="py-2 px-2 text-right text-yellow-700">Grasa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meal.recipe.ingredients.map((ing) => (
                  <tr key={ing.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-3 font-semibold text-slate-800 flex items-center space-x-1.5">
                      <span>{ing.name}</span>
                      {ing.thyroidFriendly === false && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold" title="Requiere cocción adecuada para tiroides">
                          ⚠️ Cocer
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 px-2 text-right text-slate-600 whitespace-nowrap font-mono">
                      {ing.amount} {ing.unit}
                    </td>
                    <td className="py-1.5 px-2 text-right font-black text-red-600 font-mono">
                      {ing.calories}
                    </td>
                    <td className="py-1.5 px-2 text-right font-bold text-blue-700 font-mono">
                      {ing.protein}g
                    </td>
                    <td className="py-1.5 px-2 text-right font-bold text-amber-700 font-mono">
                      {ing.carbs}g
                    </td>
                    <td className="py-1.5 px-2 text-right font-bold text-yellow-700 font-mono">
                      {ing.fats}g
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                <tr>
                  <td className="py-2 px-3 uppercase text-[10px] tracking-wider text-slate-700">
                    Total Comida
                  </td>
                  <td className="py-2 px-2 text-right text-slate-500 font-mono text-[10px]">
                    {meal.recipe.ingredients.reduce((sum, i) => sum + (i.unit === 'g' ? i.amount : 0), 0)}g
                  </td>
                  <td className="py-2 px-2 text-right text-red-600 font-black font-mono">
                    {macros.calories}
                  </td>
                  <td className="py-2 px-2 text-right text-blue-700 font-black font-mono">
                    {macros.protein}g
                  </td>
                  <td className="py-2 px-2 text-right text-amber-700 font-black font-mono">
                    {macros.carbs}g
                  </td>
                  <td className="py-2 px-2 text-right text-yellow-700 font-black font-mono">
                    {macros.fats}g
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
