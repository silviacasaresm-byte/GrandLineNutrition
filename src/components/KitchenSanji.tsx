import React, { useState, useEffect } from 'react';
import { FortnightDiet, Meal } from '../types';
import { calculateMealMacros } from '../utils/calculations';
import { MealMacroBreakdown } from './MealMacroBreakdown';
import { 
  ChefHat, 
  Flame, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  Box, 
  UtensilsCrossed 
} from 'lucide-react';

interface KitchenSanjiProps {
  diet: FortnightDiet;
  activeMeal: Meal | null;
  setActiveMeal: (meal: Meal | null) => void;
  onMealCompleted: (mealId: string) => void;
}

export const KitchenSanji: React.FC<KitchenSanjiProps> = ({
  diet,
  activeMeal,
  setActiveMeal,
  onMealCompleted,
}) => {
  const [kitchenMode, setKitchenMode] = useState<'day_to_day' | 'batch_cooking'>('day_to_day');

  // Fallback to first meal if none selected
  const currentMeal: Meal = activeMeal || diet.weekDays[0]?.meals[0];

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Handle timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play soft audio alert
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        console.log('Audio alert context note');
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimerWithMinutes = (mins: number) => {
    setTimerSeconds(mins * 60);
    setIsTimerRunning(true);
  };

  const toggleStep = (stepIndex: number) => {
    const next = new Set(completedSteps);
    if (next.has(stepIndex)) {
      next.delete(stepIndex);
    } else {
      next.add(stepIndex);
    }
    setCompletedSteps(next);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentMealMacros = currentMeal ? calculateMealMacros(currentMeal) : { calories: 0, protein: 0, carbs: 0, fats: 0 };

  return (
    <div className="space-y-6 pb-12">
      {/* Sanji Themed Header */}
      <div className="bg-[#0000FF] text-white p-6 rounded-2xl shadow-lg border-2 border-[#FDDF28]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-[#FDDF28] border border-[#FDDF28]/30 mb-2">
              <span>🍳 COCINA DE ALL BLUE DE SANJI</span>
              <span>•</span>
              <span>CHEF DE LOS SOMBREROS DE PAJA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Cocina Saludable Paso a Paso & Batch Cooking
            </h1>
            <p className="text-sm text-blue-100 mt-1 max-w-2xl">
              «¡El arte de la cocina reside en respetar cada ingrediente y nutrir a la tripulación con la más alta calidad!»
            </p>
          </div>

          {/* Kitchen Mode Switcher */}
          <div className="bg-black/40 p-1.5 rounded-xl border border-white/20 flex space-x-1">
            <button
              onClick={() => setKitchenMode('day_to_day')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                kitchenMode === 'day_to_day'
                  ? 'bg-[#DC0F0D] text-white shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Modo Día a Día</span>
            </button>
            <button
              onClick={() => setKitchenMode('batch_cooking')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                kitchenMode === 'batch_cooking'
                  ? 'bg-[#DC0F0D] text-white shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Modo Batch Cooking</span>
            </button>
          </div>
        </div>
      </div>

      {kitchenMode === 'day_to_day' ? (
        /* DAY TO DAY COOKING MODE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Recipe Card (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meal Selector Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Receta Activa:</span>
              <select
                value={currentMeal?.id}
                onChange={(e) => {
                  const found = diet.weekDays
                    .flatMap((d) => d.meals)
                    .find((m) => m.id === e.target.value);
                  if (found) {
                    setActiveMeal(found);
                    setCompletedSteps(new Set());
                  }
                }}
                className="text-xs font-bold text-[#09086E] border border-gray-300 rounded-lg p-2 bg-white max-w-xs"
              >
                {diet.weekDays.map((d) => (
                  <optgroup key={d.dayOfWeek} label={`Día ${d.dayOfWeek} - ${d.dayName}`}>
                    {d.meals.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.timeSlot} - {m.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Recipe Details Box */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase">
                  <span>{currentMeal.type}</span>
                  <span>•</span>
                  <span>Hora: {currentMeal.timeSlot}</span>
                  <span>•</span>
                  <span>{currentMeal.recipe.prepTimeMinutes + currentMeal.recipe.cookTimeMinutes} min totales</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mt-1">
                  {currentMeal.recipe.name}
                </h2>
                <div className="mt-3">
                  <MealMacroBreakdown meal={currentMeal} />
                </div>
              </div>

              {/* Sanji Quote & Thyroid Note */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-blue-50 text-blue-900 p-3 rounded-xl border border-blue-200 text-xs">
                  <div className="font-extrabold text-blue-800 flex items-center space-x-1 mb-1">
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Chef Sanji:</span>
                  </div>
                  <p className="italic leading-relaxed">
                    «{currentMeal.recipe.chefQuote || '¡Cocinar con precisión es el deber inquebrantable de un verdadero cocinero del mar!'}»
                  </p>
                </div>

                {currentMeal.recipe.thyroidSafeCookingTip && (
                  <div className="bg-rose-50 text-rose-900 p-3 rounded-xl border border-rose-200 text-xs">
                    <div className="font-extrabold text-rose-800 flex items-center space-x-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Clave Hipotiroidismo (Chopper):</span>
                    </div>
                    <p className="leading-relaxed">
                      {currentMeal.recipe.thyroidSafeCookingTip}
                    </p>
                  </div>
                )}
              </div>

              {/* Ingredients List */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2.5">
                  Ingredientes Exactos para Esta Ración
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentMeal.recipe.ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="font-bold text-gray-900">{ing.name}</span>
                      </div>
                      <span className="font-black px-2 py-0.5 bg-white rounded border border-gray-200 text-gray-700">
                        {ing.amount} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Cooking Checklist */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2.5">
                  Pasos de Preparación
                </h3>
                <div className="space-y-2.5">
                  {currentMeal.recipe.instructions.map((inst, index) => {
                    const isDone = completedSteps.has(index);
                    return (
                      <div
                        key={index}
                        onClick={() => toggleStep(index)}
                        className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-300 text-gray-500'
                            : 'bg-white border-gray-200 hover:border-blue-400 text-gray-800'
                        }`}
                      >
                        <button className="mt-0.5 text-gray-400">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                          )}
                        </button>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-gray-400 mr-2">Paso {index + 1}:</span>
                          <span className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through' : ''}`}>
                            {inst}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Interactive Kitchen Timer & Shortcuts */}
          <div className="space-y-6">
            {/* Sanji's Kitchen Countdown Timer */}
            <div className="bg-white rounded-2xl border-2 border-[#0000FF]/30 p-6 shadow-sm text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-blue-900">
                <Timer className="w-4 h-4 text-blue-600" />
                <span>Temporizador de Cocina de Sanji</span>
              </div>

              {/* Display */}
              <div className="py-4">
                <div className="text-5xl font-black font-mono tracking-tight text-gray-900">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="text-[11px] font-semibold text-gray-400 mt-1">
                  {isTimerRunning ? '¡En cocción activa!' : timerSeconds === 0 ? 'Listo para programar' : 'En pausa'}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-[#DC0F0D] hover:bg-red-700 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Pausar' : 'Iniciar'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                  title="Reiniciar a cero"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Tiempos Rápidos de Cocción:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => startTimerWithMinutes(3)}
                    className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold"
                  >
                    3 min
                  </button>
                  <button
                    onClick={() => startTimerWithMinutes(5)}
                    className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold"
                  >
                    5 min
                  </button>
                  <button
                    onClick={() => startTimerWithMinutes(10)}
                    className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold"
                  >
                    10 min
                  </button>
                  <button
                    onClick={() => startTimerWithMinutes(15)}
                    className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold"
                  >
                    15 min
                  </button>
                </div>
              </div>
            </div>

            {/* Batch Cooking Callout */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
                <Box className="w-4 h-4 text-blue-600" />
                <span>¿Día de Preparación en Bloque?</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                Dedica 90 minutos el domingo para tener listas las proteínas marinadas, verduras vaporizadas e hidratos de toda la quincena.
              </p>
              <button
                onClick={() => setKitchenMode('batch_cooking')}
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Abrir Guía de Batch Cooking →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* BATCH COOKING STATIC STRUCTURAL GUIDE */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                📦
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Protocolo de Batch Cooking Quincenal de Sanji
                </h2>
                <p className="text-xs text-gray-600">
                  Guía secuencial estática para cocinar 1 vez y alimentarte durante 14 días con frescura y seguridad metabólica.
                </p>
              </div>
            </div>

            {/* Sequence steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
              {/* Step 1: Base Grains */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-blue-900 uppercase">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Carbohidratos Base</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Cocción Simultánea de Granos y Tubérculos</h4>
                <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                  <li><strong>Arroz Integral / Jazmín:</strong> Hervir 400g. Enfriar y repartir en 4 tuppers.</li>
                  <li><strong>Quinoa Real:</strong> Cocer 250g con caldo suave (12 min).</li>
                  <li><strong>Boniatos y Patatas:</strong> Hornear enteros con piel a 200°C (35 min).</li>
                </ul>
              </div>

              {/* Step 2: Roasted & Steamed Greens */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-900 uppercase">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Verduras & Neutralización</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Vaporizado y Desactivación de Bociógenos</h4>
                <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                  <li><strong>Brócoli y Coliflor:</strong> Vaporizar obligatoriamente {'>'}10 min para tiroides.</li>
                  <li><strong>Pimientos Rojos:</strong> Asar en tiras al horno con un hilo de AOVE.</li>
                  <li><strong>Judías Verdes:</strong> Cocer al dente y enfriar en agua con hielo.</li>
                </ul>
              </div>

              {/* Step 3: Proteins & Portions */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-900 uppercase">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Proteínas y Cremas</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Marinados y Porcionado en Tuppers</h4>
                <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                  <li><strong>Pechugas de Pollo / Pavo:</strong> Marinar en crudo con limón y especias.</li>
                  <li><strong>Crema de Calabaza:</strong> Preparar 1.5 litros para cenas rápidas.</li>
                  <li><strong>Huevos Duros:</strong> Cocer 6 huevos camperos (aguanta 7 días en nevera con cáscara).</li>
                </ul>
              </div>
            </div>

            {/* Storage & Shelf-Life Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
              <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider mb-2">
                🧊 Reglas de Almacenamiento Seguro para la Quincena
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="font-bold text-gray-900 block">Días 1 a 4</span>
                  <span className="text-gray-600">Refrigeración a 4°C en tuppers de vidrio herméticos.</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="font-bold text-gray-900 block">Días 5 a 14</span>
                  <span className="text-gray-600">Congelar porciones individuales rotuladas con fecha.</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="font-bold text-gray-900 block">Descongelación</span>
                  <span className="text-gray-600">Bajar a la nevera 24h antes del consumo.</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="font-bold text-gray-900 block">Pescados Frescos</span>
                  <span className="text-gray-600">Cocinar al momento o congelar el lomo en crudo.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
