import React, { useState } from 'react';
import { BioimpedanceRecord, DayDiet, FortnightDiet, Meal, StrawHatCrewMember } from '../types';
import { calculateDayMacros, calculateMealMacros, generateShoppingList } from '../utils/calculations';
import { MealMacroBreakdown } from './MealMacroBreakdown';
import { WeeklyDietGrid } from './WeeklyDietGrid';
import { 
  Flame, 
  CheckCircle2, 
  Circle, 
  ChefHat, 
  Activity, 
  ShoppingCart, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Award,
  ArrowRight,
  Utensils,
  ChevronDown,
  ChevronUp,
  Beef,
  Wheat,
  Droplets,
  Calendar,
  X
} from 'lucide-react';

interface DashboardLuffyProps {
  diet: FortnightDiet;
  selectedDayIndex: number;
  setSelectedDayIndex: (index: number) => void;
  activeWeek: 1 | 2;
  bioRecords: BioimpedanceRecord[];
  onToggleMealCompleted: (dayIndex: number, mealId: string) => void;
  setActiveTab: (tab: StrawHatCrewMember | 'architecture') => void;
  onCookMeal: (meal: Meal) => void;
}

export const DashboardLuffy: React.FC<DashboardLuffyProps> = ({
  diet,
  selectedDayIndex,
  setSelectedDayIndex,
  activeWeek,
  bioRecords,
  onToggleMealCompleted,
  setActiveTab,
  onCookMeal,
}) => {
  const [expandedMealDetails, setExpandedMealDetails] = useState<string | null>(null);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  const currentDay: DayDiet = diet.weekDays[selectedDayIndex] || diet.weekDays[0];
  const dayMacros = calculateDayMacros(currentDay);
  const latestBio = bioRecords[bioRecords.length - 1];
  const previousBio = bioRecords.length > 1 ? bioRecords[bioRecords.length - 2] : null;

  // Bio deltas
  const weightDelta = previousBio && latestBio ? (latestBio.weightKg - previousBio.weightKg).toFixed(1) : '-0.6';
  const fatDelta = previousBio && latestBio ? (latestBio.bodyFatPercent - previousBio.bodyFatPercent).toFixed(1) : '-0.2';
  const muscleDelta = previousBio && latestBio ? (latestBio.muscleMassKg - previousBio.muscleMassKg).toFixed(1) : '+0.1';

  // Calculate completed meals
  const totalMeals = currentDay.meals.length;
  const completedCount = currentDay.meals.filter((m) => m.completed).length;
  const adherencePercent = totalMeals > 0 ? Math.round((completedCount / totalMeals) * 100) : 0;

  // Macro calorie ratios
  const proteinKcal = dayMacros.protein * 4;
  const carbsKcal = dayMacros.carbs * 4;
  const fatsKcal = dayMacros.fats * 9;
  const totalMacroKcal = Math.max(1, proteinKcal + carbsKcal + fatsKcal);

  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatsPct = Math.round((fatsKcal / totalMacroKcal) * 100);

  // Next upcoming meal
  const nextMeal = currentDay.meals.find((m) => !m.completed) || currentDay.meals[0];

  // Grocery preview items
  const shoppingItems = generateShoppingList(diet, 2.0);
  const produceItems = shoppingItems.filter((i) => i.category === 'verduras').slice(0, 3);
  const proteinItems = shoppingItems.filter((i) => i.category === 'carnes_pescados').slice(0, 2);

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-6 pb-12">
      {/* Barra de Selección de Día y Acceso Rápido a Parrilla Semanal */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-2 space-y-2">
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-xs font-bold text-[#084C61] uppercase tracking-wider flex items-center space-x-1.5">
            <span>📅</span>
            <span>Días de la Semana (Semana {activeWeek})</span>
          </span>
          <button
            onClick={() => setShowWeeklyModal(true)}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-[#084C61] rounded-lg text-xs font-bold transition-all flex items-center space-x-1 border border-amber-200 cursor-pointer"
            title="Abrir Parrilla Semanal Completa"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Parrilla Semanal General</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {diet.weekDays.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const dayMealCount = day.meals.length;
            const dayDoneCount = day.meals.filter((m) => m.completed).length;
            const isAllDone = dayMealCount > 0 && dayMealCount === dayDoneCount;
            const dm = calculateDayMacros(day);

            return (
              <button
                key={day.dayOfWeek}
                id={`day-tab-${idx}`}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex flex-col items-center py-2 px-1 sm:px-2 rounded-lg transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#084C61] text-white shadow-xs font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold opacity-80">
                  {daysOfWeek[idx].slice(0, 3)}
                </span>
                <span className="text-xs sm:text-sm font-black mt-0.5">
                  Día {idx + 1}
                </span>
                <span className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-yellow-300 font-bold' : 'text-slate-500'}`}>
                  {dm.calories} kcal
                </span>
                <div className="mt-1">
                  {isAllDone ? (
                    <span className="text-[10px] text-[#FDDF28] font-bold">★ 100%</span>
                  ) : (
                    <span className={`text-[10px] ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                      {dayDoneCount}/{dayMealCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Principal: 8 Columnas Panel Principal / 4 Columnas Motor Zoro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Macros de Recompensa (Cálculo en Tiempo Real) */}
          <div className="bg-white rounded-xl shadow-xs border-2 border-[#FDDF28]/30 overflow-hidden">
            <div className="bg-[#FDDF28]/10 px-6 py-3 border-b border-[#FDDF28]/30 flex justify-between items-center">
              <h3 className="text-[#B3480B] font-bold uppercase text-xs tracking-wider flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-[#DC0F0D]" />
                <span>Macros de Recompensa Diarios (Cálculo Determinista)</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#084C61] bg-white/80 px-2 py-0.5 rounded border border-[#FDDF28]/40">
                {currentDay.dayName} (Semana {activeWeek})
              </span>
            </div>

            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Calorías */}
              <div className="text-center border-r border-slate-100 last:border-r-0 pr-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Calorías Totales</p>
                <p className="text-2xl font-black text-[#DC0F0D] mt-0.5">{dayMacros.calories}</p>
                <div className="w-full h-1.5 bg-slate-100 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#DC0F0D]" style={{ width: '100%' }}></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">{(dayMacros.calories * 1000).toLocaleString()} Berries</span>
              </div>

              {/* Proteína */}
              <div className="text-center border-r border-slate-100 last:border-r-0 pr-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Proteína</p>
                <p className="text-2xl font-black text-[#0284C7] mt-0.5">{dayMacros.protein}g</p>
                <div className="w-full h-1.5 bg-slate-100 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0284C7]" style={{ width: `${proteinPct}%` }}></div>
                </div>
                <span className="text-[10px] text-sky-600 font-semibold mt-1 block">{proteinPct}% ({Math.round(dayMacros.protein * 4)} kcal)</span>
              </div>

              {/* Carbohidratos */}
              <div className="text-center border-r border-slate-100 last:border-r-0 pr-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Carbohidratos</p>
                <p className="text-2xl font-black text-[#B3480B] mt-0.5">{dayMacros.carbs}g</p>
                <div className="w-full h-1.5 bg-slate-100 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B3480B]" style={{ width: `${carbsPct}%` }}></div>
                </div>
                <span className="text-[10px] text-amber-700 font-semibold mt-1 block">{carbsPct}% ({Math.round(dayMacros.carbs * 4)} kcal)</span>
              </div>

              {/* Grasas */}
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Grasas Saludables</p>
                <p className="text-2xl font-black text-[#FDDF28] mt-0.5">{dayMacros.fats}g</p>
                <div className="w-full h-1.5 bg-slate-100 mt-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FDDF28]" style={{ width: `${fatsPct}%` }}></div>
                </div>
                <span className="text-[10px] text-yellow-700 font-semibold mt-1 block">{fatsPct}% ({Math.round(dayMacros.fats * 9)} kcal)</span>
              </div>
            </div>
          </div>

          {/* 2. Fila Intermedia: Estadísticas Dr. Chopper + Próxima Toma de Sanji */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estadísticas de Bioimpedancia Dr. Chopper */}
            <div className="bg-white rounded-xl shadow-xs p-6 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                <h4 className="text-[#084C61] font-bold text-sm flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span>Estadísticas del Dr. Chopper</span>
                </h4>
                <button
                  onClick={() => setActiveTab('chopper')}
                  className="text-[11px] font-bold text-rose-600 hover:underline"
                >
                  Ver Historial →
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Peso Corporal</span>
                  <span className="font-bold text-[#084C61]">
                    {latestBio ? `${latestBio.weightKg} kg` : '82.4 kg'}
                    <span className="text-[#008000] text-[10px] font-mono ml-1.5 font-bold">
                      {weightDelta} kg
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Grasa Corporal</span>
                  <span className="font-bold text-[#084C61]">
                    {latestBio ? `${latestBio.bodyFatPercent}%` : '20.4%'}
                    <span className="text-[#008000] text-[10px] font-mono ml-1.5 font-bold">
                      {fatDelta}%
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Masa Muscular</span>
                  <span className="font-bold text-[#084C61]">
                    {latestBio ? `${latestBio.muscleMassKg} kg` : '62.1 kg'}
                    <span className="text-[#008000] text-[10px] font-mono ml-1.5 font-bold">
                      {muscleDelta} kg
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Metabolismo Basal (BMR)</span>
                  <span className="font-bold text-[#084C61]">
                    {latestBio ? `${latestBio.bmrKcal} kcal` : '1.745 kcal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Próxima Toma Programada por Sanji */}
            <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-xl shadow-xs p-6 border border-amber-200">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-4">
                <h4 className="text-[#084C61] font-bold text-sm flex items-center space-x-1.5">
                  <ChefHat className="w-4 h-4 text-amber-600" />
                  <span>Próxima Toma de Sanji</span>
                </h4>
                <span className="px-2 py-0.5 bg-[#084C61] text-white text-[10px] font-bold rounded">
                  {nextMeal?.timeSlot || '14:00'}
                </span>
              </div>

              {nextMeal && (
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-12 h-12 bg-white rounded-lg border border-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      🍲
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#084C61] uppercase truncate">
                        {nextMeal.title}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                        {nextMeal.recipe.instructions[0] || 'Receta preparada con ingredientes frescos del mar.'}
                      </p>
                      <div className="mt-1.5 flex items-center space-x-2 text-[10px] font-bold">
                        <span className="text-red-600">{calculateMealMacros(nextMeal).calories} kcal</span>
                        <span className="text-sky-700">• P: {calculateMealMacros(nextMeal).protein}g</span>
                        <span className="text-amber-700">• C: {calculateMealMacros(nextMeal).carbs}g</span>
                        <span className="text-yellow-700">• G: {calculateMealMacros(nextMeal).fats}g</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {nextMeal.recipe.ingredients.length} alimentos
                    </span>
                    <button
                      onClick={() => onCookMeal(nextMeal)}
                      className="px-3 py-1.5 bg-[#084C61] hover:bg-[#0369A1] text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center space-x-1"
                    >
                      <span>Abrir Modo Cocina</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Cronología Diaria de Tomas con Desglose Completo de Macros */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-[#DC0F0D]" />
                <span>Cronología y Macros de Cada Comida ({currentDay.dayName})</span>
              </h3>
              <div className="text-xs font-bold text-slate-500">
                Adherencia: <span className="text-[#084C61] font-black">{adherencePercent}%</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {currentDay.meals.map((meal) => {
                const mealMacros = calculateMealMacros(meal);
                const isExpanded = expandedMealDetails === meal.id;

                return (
                  <div
                    key={meal.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      meal.completed
                        ? 'bg-emerald-50/30 border-emerald-300 text-slate-700'
                        : 'bg-white border-slate-200 hover:border-sky-300 text-slate-900'
                    }`}
                  >
                    {/* Fila Principal de la Comida */}
                    <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <button
                          onClick={() => onToggleMealCompleted(selectedDayIndex, meal.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 focus:outline-none shrink-0"
                          title={meal.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                        >
                          {meal.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#084C61] text-white">
                              {meal.timeSlot}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {meal.type}
                            </span>
                            <span className={`text-sm font-bold ${meal.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {meal.title}
                            </span>
                          </div>

                          {/* Chips Compactos de Macros */}
                          <div className="mt-2">
                            <MealMacroBreakdown meal={meal} compact={true} />
                          </div>
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpandedMealDetails(isExpanded ? null : meal.id)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-[#084C61] bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
                        >
                          <span>{isExpanded ? 'Ocultar' : 'Ver Macros Detallados'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onCookMeal(meal)}
                          className="px-2.5 py-1 bg-[#084C61] hover:bg-[#0369A1] text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Cocinar</span>
                        </button>
                      </div>
                    </div>

                    {/* Desglose Expandido de la Comida */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 bg-slate-50/50">
                        <MealMacroBreakdown meal={meal} showIngredientDetails={true} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha (4 cols): Motor de Compra de Zoro */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col">
            <div className="p-4 border-b bg-slate-50 rounded-t-xl">
              <h3 className="text-xs font-bold text-[#084C61] uppercase flex items-center gap-2">
                <span className="text-[#008000]">⚔️</span> Motor de Compra de Zoro
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Consolidación Quincenal (Cantidades x2.0)</p>
            </div>

            <div className="p-4 space-y-4">
              {/* Sección Verduras / Frutas */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#008000] uppercase tracking-widest">
                  Frutas y Verduras (Verde)
                </p>
                {produceItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-[#008000] text-[#008000] rounded flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-slate-600">
                      {item.totalAmount} {item.unit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sección Proteínas */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#0284C7] uppercase tracking-widest">
                  Proteínas y Pescados (Azul)
                </p>
                {proteinItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-[#0284C7] text-[#0284C7] rounded flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-slate-600">
                      {item.totalAmount} {item.unit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Notificación de Consolidación */}
              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center space-x-1 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Consolidación Quincenal</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Total de {shoppingItems.length} ingredientes calculados para cubrir los 14 días.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 mt-auto">
              <button
                onClick={() => setActiveTab('zoro')}
                className="w-full py-2 bg-white hover:bg-emerald-50 border border-[#008000] text-[#008000] text-[10px] font-bold rounded uppercase tracking-widest transition-all shadow-2xs"
              >
                Ver Lista de la Compra Completa →
              </button>
            </div>
          </div>

          {/* Consejo Clínico de Chopper */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 p-4 space-y-2 shadow-2xs">
            <div className="flex items-center space-x-2 text-rose-900 font-extrabold text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>Pauta Clínica Dr. Chopper</span>
            </div>
            <p className="text-xs text-rose-950 leading-relaxed">
              «¡Para mantener tu metabolismo activo con hipotiroidismo, no saltes las tomas de proteínas magras y asegura tus fuentes de selenio diarias!»
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Parrilla Semanal General */}
      {showWeeklyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#F4F2E9] rounded-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border-2 border-[#084C61] space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-300 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📅</span>
                <div>
                  <h3 className="text-lg font-black text-[#084C61]">
                    Parrilla Semanal General (Semana {activeWeek})
                  </h3>
                  <p className="text-xs text-slate-600">
                    Resumen directo de títulos de cada comida para los 7 días
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWeeklyModal(false)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <WeeklyDietGrid
              diet={diet}
              activeWeek={activeWeek}
              setActiveWeek={() => {}}
              onCookMeal={(meal) => {
                setShowWeeklyModal(false);
                onCookMeal(meal);
              }}
              onSelectDay={(dayIdx) => {
                setSelectedDayIndex(dayIdx);
                setShowWeeklyModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
