import React, { useState } from 'react';
import { FortnightDiet, Meal, DayDiet } from '../types';
import { 
  Calendar, 
  Printer, 
  Copy, 
  Check, 
  ChefHat, 
  Clock, 
  Flame, 
  Sparkles,
  LayoutGrid,
  Columns,
  Plus
} from 'lucide-react';

interface WeeklyDietGridProps {
  diet: FortnightDiet;
  activeWeek: 1 | 2;
  setActiveWeek: (week: 1 | 2) => void;
  onCookMeal?: (meal: Meal) => void;
  onSelectDay?: (dayIndex: number) => void;
}

export const WeeklyDietGrid: React.FC<WeeklyDietGridProps> = ({
  diet,
  activeWeek,
  setActiveWeek,
  onCookMeal,
  onSelectDay,
}) => {
  const [viewStyle, setViewStyle] = useState<'table' | 'columns'>('table');
  const [copied, setCopied] = useState(false);

  const mealSlots: { type: Meal['type']; label: string; icon: string; defaultTime: string }[] = [
    { type: 'breakfast', label: 'Desayuno', icon: '☕', defaultTime: '08:30' },
    { type: 'mid_morning', label: 'Media Mañana', icon: '🍎', defaultTime: '11:30' },
    { type: 'lunch', label: 'Comida / Almuerzo', icon: '🍲', defaultTime: '14:00' },
    { type: 'snack', label: 'Merienda', icon: '🥪', defaultTime: '17:30' },
    { type: 'dinner', label: 'Cena', icon: '🥗', defaultTime: '21:00' },
  ];

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Copy plain text summary of the whole week
  const handleCopyWeeklySummary = () => {
    let text = `📅 MENÚ SEMANAL GENERAL (Semana ${activeWeek} de 2)\n\n`;
    diet.weekDays.forEach((day, idx) => {
      text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `📍 ${day.dayName.toUpperCase()} (Día ${idx + 1})\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      mealSlots.forEach((slot) => {
        const meal = day.meals.find((m) => m.type === slot.type);
        if (meal) {
          text += `  • [${meal.timeSlot}] ${slot.label}: ${meal.title}\n`;
        }
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">📅</span>
            <h2 className="text-lg font-black text-[#09086E]">
              Vista Semanal General
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Parrilla completa de lunes a domingo para consultar tu menú completo de un vistazo.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Selector de Semana */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex text-xs">
            <button
              onClick={() => setActiveWeek(1)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeWeek === 1 ? 'bg-[#DC0F0D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana 1
            </button>
            <button
              onClick={() => setActiveWeek(2)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeWeek === 2 ? 'bg-[#DC0F0D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana 2
            </button>
          </div>

          {/* Toggle Formato Tabla / Columnas */}
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewStyle('table')}
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-all ${
                viewStyle === 'table' ? 'bg-white text-[#09086E] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista en Tabla Matriz"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Matriz</span>
            </button>
            <button
              onClick={() => setViewStyle('columns')}
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-all ${
                viewStyle === 'columns' ? 'bg-white text-[#09086E] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista en Columnas por Día"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Columnas</span>
            </button>
          </div>

          {/* Botón Copiar Texto */}
          <button
            onClick={handleCopyWeeklySummary}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border border-slate-200 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Menú'}</span>
          </button>

          {/* Botón Imprimir */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-[#09086E] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Parrilla</span>
          </button>
        </div>
      </div>

      {/* VISTA 1: TABLA MATRIZ (7 DÍAS x 5 TOMAS) */}
      {viewStyle === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#09086E] text-white">
                  <th className="py-3.5 px-3 font-black text-xs uppercase tracking-wider w-36 border-r border-white/10 text-center">
                    Toma / Horario
                  </th>
                  {diet.weekDays.map((day, idx) => (
                    <th
                      key={day.dayOfWeek}
                      className="py-3.5 px-3 font-black text-xs uppercase tracking-wider text-center border-r border-white/10 last:border-r-0"
                    >
                      <div className="text-yellow-300 font-extrabold text-sm">{day.dayName}</div>
                      <span className="text-[10px] text-blue-200 font-medium">Día {day.dayOfWeek}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mealSlots.map((slot, slotIdx) => (
                  <tr
                    key={slot.type}
                    className={slotIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                  >
                    {/* Cabecera de Fila (Tipo de Toma) */}
                    <td className="py-3 px-3 border-r border-slate-200 bg-slate-100/70">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{slot.icon}</span>
                        <div>
                          <div className="font-extrabold text-xs text-[#09086E] leading-tight">
                            {slot.label}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-medium">
                            {slot.defaultTime}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Celdas por Cada Día */}
                    {diet.weekDays.map((day, dayIdx) => {
                      const meal = day.meals.find((m) => m.type === slot.type) || day.meals[slotIdx];

                      if (!meal) {
                        return (
                          <td
                            key={day.dayOfWeek}
                            className="py-3 px-2 border-r border-slate-100 last:border-r-0 text-center align-middle"
                          >
                            <button
                              type="button"
                              onClick={() => onSelectDay && onSelectDay(dayIdx)}
                              className="text-[11px] text-slate-400 hover:text-[#09086E] hover:bg-amber-50 px-2 py-1 rounded-md border border-dashed border-slate-200 transition-colors inline-flex items-center space-x-0.5 cursor-pointer"
                              title={`Añadir comida para ${day.dayName}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>Añadir</span>
                            </button>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={day.dayOfWeek}
                          className="py-2.5 px-2.5 border-r border-slate-100 last:border-r-0 align-top transition-colors hover:bg-amber-50/40"
                        >
                          <div className="flex flex-col h-full justify-between gap-1 group">
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                                <span className="font-mono font-bold text-slate-500">{meal.timeSlot}</span>
                                {meal.recipe.batchCookable && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-blue-50 text-blue-700 font-bold" title="Apto Batch Cooking">
                                    📦
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-slate-900 leading-snug group-hover:text-[#09086E] transition-colors">
                                {meal.title}
                              </p>
                            </div>

                            {/* Acciones rápidas al hover */}
                            {onCookMeal && (
                              <div className="pt-1 mt-auto flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => onCookMeal(meal)}
                                  className="text-[10px] text-slate-400 hover:text-red-600 font-bold flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title="Ver receta / Cocinar"
                                >
                                  <ChefHat className="w-3 h-3" />
                                  <span>Cocinar</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 2: COLUMNAS TIPO TARJETA POR CADA DÍA */}
      {viewStyle === 'columns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {diet.weekDays.map((day, dayIdx) => (
            <div
              key={day.dayOfWeek}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col"
            >
              {/* Cabecera del Día */}
              <div 
                onClick={() => onSelectDay && onSelectDay(dayIdx)}
                className="bg-[#09086E] text-white p-2.5 text-center cursor-pointer hover:bg-blue-900 transition-colors"
              >
                <h4 className="text-xs font-black uppercase text-yellow-300">
                  {day.dayName}
                </h4>
                <span className="text-[10px] text-blue-200">Día {day.dayOfWeek}</span>
              </div>

              {/* Lista de Títulos de Comidas */}
              <div className="p-2 space-y-2 flex-1 flex flex-col justify-between divide-y divide-slate-100">
                {mealSlots.map((slot) => {
                  const meal = day.meals.find((m) => m.type === slot.type);
                  if (!meal) return null;

                  return (
                    <div key={meal.id} className="pt-2 first:pt-0 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span className="flex items-center space-x-1 text-[#09086E]">
                          <span>{slot.icon}</span>
                          <span>{slot.label}</span>
                        </span>
                        <span className="font-mono text-slate-500">{meal.timeSlot}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {meal.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
