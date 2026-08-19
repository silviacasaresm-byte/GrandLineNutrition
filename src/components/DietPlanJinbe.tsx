import React, { useState, useEffect } from 'react';
import { DayDiet, FortnightDiet, Ingredient, Meal, MealType, Recipe } from '../types';
import { calculateDayMacros, calculateMealMacros } from '../utils/calculations';
import { 
  SPANISH_NUTRITION_DATABASE, 
  FoodDatabaseItem, 
  searchFoodDatabase, 
  computeAutoMacros 
} from '../utils/nutritionDatabase';
import { MealMacroBreakdown } from './MealMacroBreakdown';
import { WeeklyDietGrid } from './WeeklyDietGrid';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ChefHat, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Check, 
  X, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Flame,
  Beef,
  Wheat,
  Droplets,
  ShieldCheck,
  LayoutGrid,
  ListFilter,
  CheckCircle2
} from 'lucide-react';

interface DietPlanJinbeProps {
  diet: FortnightDiet;
  onUpdateDiet: (updatedDiet: FortnightDiet) => void;
  activeWeek: 1 | 2;
  setActiveWeek: (w: 1 | 2) => void;
  onCookMeal: (meal: Meal) => void;
  initialOpenAddModal?: boolean;
  onModalClosed?: () => void;
}

export const DietPlanJinbe: React.FC<DietPlanJinbeProps> = ({
  diet,
  onUpdateDiet,
  activeWeek,
  setActiveWeek,
  onCookMeal,
  initialOpenAddModal,
  onModalClosed,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'weekly'>('day');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);

  // Modal State for Adding/Editing Meal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<{ dayIndex: number; meal: Meal | null }>({ dayIndex: 0, meal: null });
  const [targetDayIndex, setTargetDayIndex] = useState<number>(0);

  // Form Entry Mode: 'detailed' (by ingredients) vs 'quick' (direct macro totals)
  const [inputMode, setInputMode] = useState<'detailed' | 'quick'>('detailed');

  // Form states
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [mealTimeSlot, setMealTimeSlot] = useState('14:00');
  const [recipeName, setRecipeName] = useState('');
  const [prepMinutes, setPrepMinutes] = useState<number | ''>(10);
  const [cookMinutes, setCookMinutes] = useState<number | ''>(15);
  const [batchCookable, setBatchCookable] = useState(true);
  const [chefQuote, setChefQuote] = useState('');
  const [thyroidTip, setThyroidTip] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>(['']);

  // Quick Direct Macros (for 'quick' mode)
  const [quickCalories, setQuickCalories] = useState<number | ''>(450);
  const [quickProtein, setQuickProtein] = useState<number | ''>(35);
  const [quickCarbs, setQuickCarbs] = useState<number | ''>(40);
  const [quickFats, setQuickFats] = useState<number | ''>(12);

  // Validation error state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New ingredient temporary row & Auto-Calculation
  const [tempIngName, setTempIngName] = useState('');
  const [tempIngAmount, setTempIngAmount] = useState<number | ''>(100);
  const [tempIngUnit, setTempIngUnit] = useState<'g' | 'ml' | 'ud' | 'cucharada'>('g');
  const [tempIngCategory, setTempIngCategory] = useState<'verduras' | 'frutas' | 'carnes_pescados' | 'lacteos_huevos' | 'legumbres_cereales' | 'grasas_aceites' | 'especias_otros'>('carnes_pescados');
  const [tempIngKcal, setTempIngKcal] = useState<number | ''>(150);
  const [tempIngProt, setTempIngProt] = useState<number | ''>(25);
  const [tempIngCarbs, setTempIngCarbs] = useState<number | ''>(0);
  const [tempIngFats, setTempIngFats] = useState<number | ''>(4);
  const [tempIngThyroid, setTempIngThyroid] = useState(true);
  const [tempIngThyroidNote, setTempIngThyroidNote] = useState('');
  
  // Auto-calculation metadata
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodDatabaseItem | null>(null);
  const [foodSuggestions, setFoodSuggestions] = useState<FoodDatabaseItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoCalculatedBadge, setAutoCalculatedBadge] = useState(false);

  // Función para seleccionar un alimento de la base de datos nutricional
  const handleSelectFoodItem = (item: FoodDatabaseItem, customAmount?: number, customUnit?: 'g' | 'ml' | 'ud' | 'cucharada') => {
    setSelectedFoodItem(item);
    setTempIngName(item.name);
    const amount = customAmount ?? item.defaultAmount;
    const unit = customUnit ?? item.defaultUnit;
    setTempIngAmount(amount);
    setTempIngUnit(unit);

    const calculated = computeAutoMacros(item, amount, unit);
    setTempIngKcal(calculated.calories);
    setTempIngProt(calculated.protein);
    setTempIngCarbs(calculated.carbs);
    setTempIngFats(calculated.fats);
    setTempIngCategory(calculated.category);
    setTempIngThyroid(calculated.thyroidFriendly);
    setTempIngThyroidNote(calculated.thyroidNote || '');
    
    setShowSuggestions(false);
    setAutoCalculatedBadge(true);
    setTimeout(() => setAutoCalculatedBadge(false), 2500);
  };

  // Al escribir el nombre del ingrediente
  const handleIngNameInputChange = (value: string) => {
    setTempIngName(value);
    if (value.trim().length >= 1) {
      const results = searchFoodDatabase(value);
      setFoodSuggestions(results);
      setShowSuggestions(results.length > 0);

      // Si hay una coincidencia exacta de nombre o alias, auto-completar macros
      const exactMatch = results.find(
        (r) =>
          r.name.toLowerCase() === value.trim().toLowerCase() ||
          r.aliases.some((a) => a.toLowerCase() === value.trim().toLowerCase())
      );
      if (exactMatch) {
        setSelectedFoodItem(exactMatch);
        const safeAmount = tempIngAmount === '' ? 100 : Number(tempIngAmount);
        const calculated = computeAutoMacros(exactMatch, safeAmount, tempIngUnit);
        setTempIngKcal(calculated.calories);
        setTempIngProt(calculated.protein);
        setTempIngCarbs(calculated.carbs);
        setTempIngFats(calculated.fats);
        setTempIngCategory(calculated.category);
        setTempIngThyroid(calculated.thyroidFriendly);
        setTempIngThyroidNote(calculated.thyroidNote || '');
        setAutoCalculatedBadge(true);
      }
    } else {
      setFoodSuggestions(searchFoodDatabase(''));
      setShowSuggestions(true);
    }
  };

  // Al cambiar la cantidad numérica del ingrediente
  const handleIngAmountChange = (newAmount: number | '') => {
    setTempIngAmount(newAmount);
    if (selectedFoodItem && newAmount !== '') {
      const calculated = computeAutoMacros(selectedFoodItem, Number(newAmount), tempIngUnit);
      setTempIngKcal(calculated.calories);
      setTempIngProt(calculated.protein);
      setTempIngCarbs(calculated.carbs);
      setTempIngFats(calculated.fats);
    }
  };

  // Al cambiar la unidad del ingrediente
  const handleIngUnitChange = (newUnit: 'g' | 'ml' | 'ud' | 'cucharada') => {
    setTempIngUnit(newUnit);
    if (selectedFoodItem && tempIngAmount !== '') {
      const calculated = computeAutoMacros(selectedFoodItem, Number(tempIngAmount), newUnit);
      setTempIngKcal(calculated.calories);
      setTempIngProt(calculated.protein);
      setTempIngCarbs(calculated.carbs);
      setTempIngFats(calculated.fats);
    }
  };

  // Auto open modal if requested externally
  useEffect(() => {
    if (initialOpenAddModal) {
      openAddMealModal(selectedDayIndex);
    }
  }, [initialOpenAddModal]);

  const currentDay = diet.weekDays[selectedDayIndex] || diet.weekDays[0];
  const dayMacros = calculateDayMacros(currentDay);

  // Live computed macros for ingredients in the modal
  const liveModalMacros = inputMode === 'quick' 
    ? {
        calories: Number(quickCalories) || 0,
        protein: Number(quickProtein) || 0,
        carbs: Number(quickCarbs) || 0,
        fats: Number(quickFats) || 0,
      }
    : ingredients.reduce(
        (acc, ing) => {
          const p = Number(ing.protein) || 0;
          const c = Number(ing.carbs) || 0;
          const f = Number(ing.fats) || 0;
          const directKcal = Number(ing.calories);
          const kcal = !isNaN(directKcal) && directKcal > 0 ? directKcal : (p * 4 + c * 4 + f * 9);
          return {
            calories: acc.calories + kcal,
            protein: acc.protein + p,
            carbs: acc.carbs + c,
            fats: acc.fats + f,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

  const openAddMealModal = (dayIdx: number, defaultType: MealType = 'lunch', defaultTime: string = '14:00') => {
    setValidationError(null);
    setEditingMeal({ dayIndex: dayIdx, meal: null });
    setTargetDayIndex(dayIdx);
    setMealType(defaultType);
    setMealTimeSlot(defaultTime);
    setRecipeName('');
    setInputMode('detailed');
    setPrepMinutes(10);
    setCookMinutes(15);
    setBatchCookable(true);
    setChefQuote('¡Un plato cocinado con el corazón de Sanji!');
    setThyroidTip('Apto para función tiroidea y rico en nutrientes esenciales.');
    
    // Plantilla inicial de ingredientes lista para editar o añadir
    setIngredients([
      {
        id: `ing-${Date.now()}-1`,
        name: 'Pechuga de Pollo / Pavo',
        amount: 150,
        unit: 'g',
        category: 'carnes_pescados',
        calories: 165,
        protein: 34,
        carbs: 0,
        fats: 3.2,
        thyroidFriendly: true,
        thyroidNote: 'Proteína magra con tirosina, esencial para la síntesis tiroidea.',
      },
      {
        id: `ing-${Date.now()}-2`,
        name: 'Arroz Integral o Patata Cocida',
        amount: 120,
        unit: 'g',
        category: 'legumbres_cereales',
        calories: 130,
        protein: 3,
        carbs: 28,
        fats: 0.8,
        thyroidFriendly: true,
      },
      {
        id: `ing-${Date.now()}-3`,
        name: 'Aceite de Oliva Virgen Extra (AOVE)',
        amount: 10,
        unit: 'ml',
        category: 'grasas_aceites',
        calories: 90,
        protein: 0,
        carbs: 0,
        fats: 10,
        thyroidFriendly: true,
      }
    ]);
    setInstructions([
      'Cocinar la proteína a la plancha a fuego medio con el AOVE.',
      'Acompañar con la guarnición caliente y emplatar.'
    ]);
    setIsModalOpen(true);
  };

  const openEditMealModal = (dayIdx: number, meal: Meal) => {
    setValidationError(null);
    setEditingMeal({ dayIndex: dayIdx, meal });
    setTargetDayIndex(dayIdx);
    setMealType(meal.type);
    setMealTimeSlot(meal.timeSlot);
    setRecipeName(meal.recipe.name);
    setInputMode('detailed');
    setPrepMinutes(meal.recipe.prepTimeMinutes);
    setCookMinutes(meal.recipe.cookTimeMinutes);
    setBatchCookable(meal.recipe.batchCookable);
    setChefQuote(meal.recipe.chefQuote || '');
    setThyroidTip(meal.recipe.thyroidSafeCookingTip || '');
    setIngredients([...meal.recipe.ingredients]);
    setInstructions(meal.recipe.instructions.length ? [...meal.recipe.instructions] : ['']);
    setIsModalOpen(true);
  };

  const handleAddIngredient = () => {
    if (!tempIngName.trim()) {
      setValidationError('Por favor, indica el nombre del ingrediente antes de agregarlo.');
      return;
    }
    setValidationError(null);

    const safeAmount = typeof tempIngAmount === 'number' ? tempIngAmount : (parseFloat(String(tempIngAmount)) || 100);
    const safeKcal = typeof tempIngKcal === 'number' ? tempIngKcal : (parseFloat(String(tempIngKcal)) || 0);
    const safeProt = typeof tempIngProt === 'number' ? tempIngProt : (parseFloat(String(tempIngProt)) || 0);
    const safeCarbs = typeof tempIngCarbs === 'number' ? tempIngCarbs : (parseFloat(String(tempIngCarbs)) || 0);
    const safeFats = typeof tempIngFats === 'number' ? tempIngFats : (parseFloat(String(tempIngFats)) || 0);

    const calculatedKcal = safeKcal > 0 ? safeKcal : Math.round(safeProt * 4 + safeCarbs * 4 + safeFats * 9);

    const newIng: Ingredient = {
      id: `ing-${Date.now()}-${Math.random()}`,
      name: tempIngName.trim(),
      amount: safeAmount,
      unit: tempIngUnit,
      category: tempIngCategory,
      calories: calculatedKcal,
      protein: safeProt,
      carbs: safeCarbs,
      fats: safeFats,
      thyroidFriendly: tempIngThyroid,
      thyroidNote: tempIngThyroidNote,
    };
    setIngredients([...ingredients, newIng]);
    setTempIngName('');
    setTempIngAmount(100);
    setTempIngKcal(150);
    setTempIngProt(20);
    setTempIngCarbs(0);
    setTempIngFats(4);
    setTempIngThyroid(true);
    setTempIngThyroidNote('');
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const handleSaveMeal = () => {
    const trimmedTitle = recipeName.trim();
    if (!trimmedTitle) {
      setValidationError('⚠️ Por favor, escribe el nombre del plato o comida.');
      return;
    }

    setValidationError(null);

    let finalIngredients = [...ingredients];

    // Si está en modo rápido o la lista de ingredientes está vacía, creamos un ingrediente base consolidado
    if (inputMode === 'quick' || finalIngredients.length === 0) {
      const p = inputMode === 'quick' ? quickProtein : 25;
      const c = inputMode === 'quick' ? quickCarbs : 30;
      const f = inputMode === 'quick' ? quickFats : 10;
      const kcal = inputMode === 'quick' ? quickCalories : (p * 4 + c * 4 + f * 9);

      finalIngredients = [
        {
          id: `ing-${Date.now()}-main`,
          name: trimmedTitle,
          amount: 1,
          unit: 'ud',
          category: 'carnes_pescados',
          calories: kcal,
          protein: p,
          carbs: c,
          fats: f,
          thyroidFriendly: true,
          thyroidNote: 'Porción completa calculada.',
        }
      ];
    }

    const newRecipe: Recipe = {
      id: editingMeal.meal ? editingMeal.meal.recipe.id : `rec-${Date.now()}`,
      name: trimmedTitle,
      prepTimeMinutes: prepMinutes || 10,
      cookTimeMinutes: cookMinutes || 15,
      batchCookable,
      batchCookingTip: chefQuote || 'Apto para conservación en nevera.',
      thyroidSafeCookingTip: thyroidTip || 'Cocinado óptimo para la asimilación de nutrientes.',
      chefQuote: chefQuote || '¡Servido caliente con el toque maestro de Sanji!',
      ingredients: finalIngredients,
      instructions: instructions.filter((i) => i.trim().length > 0).length > 0
        ? instructions.filter((i) => i.trim().length > 0)
        : ['Preparar y cocinar los ingredientes a la plancha o vapor.'],
    };

    const newMeal: Meal = {
      id: editingMeal.meal ? editingMeal.meal.id : `meal-${Date.now()}`,
      type: mealType,
      title: trimmedTitle,
      timeSlot: mealTimeSlot.trim() || '14:00',
      recipe: newRecipe,
      completed: editingMeal.meal ? editingMeal.meal.completed : false,
    };

    const updatedWeekDays = [...diet.weekDays];
    const targetDay = { ...updatedWeekDays[targetDayIndex] };

    if (editingMeal.meal && editingMeal.dayIndex === targetDayIndex) {
      // Edit in place
      targetDay.meals = targetDay.meals.map((m) => (m.id === editingMeal.meal?.id ? newMeal : m));
    } else {
      // Remove from original day if moved to another day
      if (editingMeal.meal && editingMeal.dayIndex !== targetDayIndex) {
        const oldDay = { ...updatedWeekDays[editingMeal.dayIndex] };
        oldDay.meals = oldDay.meals.filter((m) => m.id !== editingMeal.meal?.id);
        updatedWeekDays[editingMeal.dayIndex] = oldDay;
      }
      // Add to new day
      targetDay.meals = [...targetDay.meals, newMeal];
    }

    // Sort meals by timeSlot
    targetDay.meals.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    updatedWeekDays[targetDayIndex] = targetDay;

    const newFortnightDiet = {
      ...diet,
      weekDays: updatedWeekDays,
    };

    onUpdateDiet(newFortnightDiet);
    setSelectedDayIndex(targetDayIndex);
    setIsModalOpen(false);

    if (onModalClosed) {
      onModalClosed();
    }

    // Mostrar mensaje de éxito
    setSuccessToast(`¡"${trimmedTitle}" añadida correctamente a ${diet.weekDays[targetDayIndex]?.dayName || 'la dieta'}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDeleteMeal = (dayIdx: number, mealId: string) => {
    const updatedWeekDays = [...diet.weekDays];
    const targetDay = { ...updatedWeekDays[dayIdx] };
    const mealToDelete = targetDay.meals.find(m => m.id === mealId);
    targetDay.meals = targetDay.meals.filter((m) => m.id !== mealId);
    updatedWeekDays[dayIdx] = targetDay;
    onUpdateDiet({
      ...diet,
      weekDays: updatedWeekDays,
    });
    setSuccessToast(`Toma "${mealToDelete?.title || ''}" eliminada.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Success Notification Banner */}
      {successToast && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between animate-fadeIn transition-all">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Jinbe Banner */}
      <div className="bg-[#084C61] text-white rounded-2xl p-5 sm:p-6 shadow-md border-2 border-[#FDDF28]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌊</span>
              <h1 className="text-xl sm:text-2xl font-black text-[#FDDF28] uppercase tracking-wide">
                Plan Quincenal de Jinbe & Macros Exactos
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-2xl">
              Gestiona y personaliza las comidas de los 7 días. Añade tus propios platos con cálculo automático y exacto de calorías y macronutrientes.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Botón Principal para Añadir Comida */}
            <button
              id="btn-add-meal-main"
              onClick={() => openAddMealModal(selectedDayIndex)}
              className="px-4 py-2 bg-[#DC0F0D] hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center space-x-1.5 uppercase tracking-wider cursor-pointer transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>+ Añadir Comida</span>
            </button>

            {/* Selector de Semana */}
            <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-white/20">
              <button
                onClick={() => setActiveWeek(1)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeWeek === 1 ? 'bg-[#DC0F0D] text-white shadow' : 'text-amber-200 hover:text-white'
                }`}
              >
                Semana 1
              </button>
              <button
                onClick={() => setActiveWeek(2)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeWeek === 2 ? 'bg-[#DC0F0D] text-white shadow' : 'text-amber-200 hover:text-white'
                }`}
              >
                Semana 2
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher: Day View vs Weekly Overview */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('day')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              viewMode === 'day'
                ? 'bg-[#084C61] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Vista Detallada por Día</span>
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              viewMode === 'weekly'
                ? 'bg-[#084C61] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-yellow-500" />
            <span>Vista Semanal General</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openAddMealModal(selectedDayIndex)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Añadir Plato</span>
          </button>
        </div>
      </div>

      {viewMode === 'weekly' ? (
        <WeeklyDietGrid
          diet={diet}
          activeWeek={activeWeek}
          setActiveWeek={setActiveWeek}
          onCookMeal={onCookMeal}
          onSelectDay={(dayIdx) => {
            setSelectedDayIndex(dayIdx);
            setViewMode('day');
          }}
        />
      ) : (
        <>
          {/* Day Selector */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-2">
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {diet.weekDays.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                const dm = calculateDayMacros(day);

                return (
                  <button
                    key={day.dayOfWeek}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`flex flex-col items-center py-2.5 px-1 rounded-lg transition-all cursor-pointer ${
                      isSelected ? 'bg-[#084C61] text-white shadow-md font-bold' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-xs uppercase font-bold">{day.dayName.slice(0, 3)}</span>
                    <span className="text-sm sm:text-base font-black">Día {day.dayOfWeek}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-yellow-300 font-bold' : 'text-gray-500'}`}>
                      {dm.calories} kcal
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Header & Macro Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-black text-gray-900">
                  {currentDay.dayName} (Semana {activeWeek})
                </h2>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {currentDay.meals.length} tomas programadas
                </span>
              </div>
              {currentDay.notes && (
                <p className="text-xs text-gray-600 mt-1 italic">
                  «{currentDay.notes}»
                </p>
              )}
            </div>

            {/* Day Macros Summary */}
            <div className="flex items-center flex-wrap gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <div className="font-extrabold text-gray-900 flex items-center space-x-1">
                <Flame className="w-4 h-4 text-red-600" />
                <span className="text-red-600 font-black text-sm">{dayMacros.calories}</span>
                <span className="text-slate-500 font-bold">kcal</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="text-blue-700 font-bold flex items-center space-x-1">
                <Beef className="w-3.5 h-3.5 text-blue-500" />
                <span>P: {dayMacros.protein}g ({dayMacros.proteinPct}%)</span>
              </div>
              <div className="text-amber-800 font-bold flex items-center space-x-1">
                <Wheat className="w-3.5 h-3.5 text-amber-600" />
                <span>C: {dayMacros.carbs}g ({dayMacros.carbsPct}%)</span>
              </div>
              <div className="text-yellow-800 font-bold flex items-center space-x-1">
                <Droplets className="w-3.5 h-3.5 text-yellow-600" />
                <span>G: {dayMacros.fats}g ({dayMacros.fatsPct}%)</span>
              </div>
            </div>
          </div>

          {/* Meals List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-gray-900">
                Recetas y Desglose de Macros de {currentDay.dayName}
              </h3>
              <button
                onClick={() => openAddMealModal(selectedDayIndex)}
                className="px-3.5 py-2 bg-[#DC0F0D] hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Toma / Receta</span>
              </button>
            </div>

            {currentDay.meals.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center space-y-3">
                <p className="text-gray-500 text-sm">No hay tomas registradas para {currentDay.dayName}.</p>
                <button
                  onClick={() => openAddMealModal(selectedDayIndex)}
                  className="px-4 py-2 bg-[#084C61] text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir la Primera Comida de este Día</span>
                </button>
              </div>
            ) : (
              currentDay.meals.map((meal) => {
                const isExpanded = expandedMealId === meal.id;

                return (
                  <div
                    key={meal.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden transition-all hover:border-sky-300"
                  >
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="px-2.5 py-1 rounded bg-[#084C61] text-white text-xs font-black self-start">
                          {meal.timeSlot}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-500 uppercase">
                              {meal.type}
                            </span>
                            {meal.recipe.batchCookable && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                                📦 Batch Cookable
                              </span>
                            )}
                            <span className="text-[10px] text-gray-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{meal.recipe.prepTimeMinutes + meal.recipe.cookTimeMinutes} min</span>
                            </span>
                          </div>
                          <h4 className="text-base font-extrabold text-gray-900 mt-0.5">
                            {meal.title}
                          </h4>

                          {/* Compact Macro Badge Component */}
                          <div className="mt-2">
                            <MealMacroBreakdown meal={meal} compact={true} />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => {
                            onCookMeal(meal);
                          }}
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                          title="Cocinar con Sanji"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Cocinar</span>
                        </button>
                        <button
                          onClick={() => openEditMealModal(selectedDayIndex, meal)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                          title="Editar toma"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(selectedDayIndex, meal.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                          title="Eliminar toma"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"
                          title={isExpanded ? 'Ocultar detalles' : 'Ver ingredientes y receta'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Recipe & Detailed Macro Breakdown */}
                    {isExpanded && (
                      <div className="p-4 bg-gray-50/70 border-t border-gray-100 space-y-4">
                        {/* Full Macro & Calorie Breakdown */}
                        <MealMacroBreakdown meal={meal} compact={false} />

                        {/* Ingredients List */}
                        <div>
                          <h5 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                            Ingredientes ({meal.recipe.ingredients.length})
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {meal.recipe.ingredients.map((ing) => (
                              <div
                                key={ing.id}
                                className="p-2 bg-white rounded-lg border border-gray-200 text-xs flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-bold text-gray-900">{ing.name}</div>
                                  <div className="text-[10px] text-gray-500">
                                    {ing.amount} {ing.unit} • {ing.calories} kcal
                                  </div>
                                </div>
                                {ing.thyroidFriendly && (
                                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200" title="Apto tiroides">
                                    ✓ Tiroides
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Instructions */}
                        {meal.recipe.instructions && meal.recipe.instructions.length > 0 && (
                          <div>
                            <h5 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                              Paso a Paso de Cocinado
                            </h5>
                            <ol className="list-decimal list-inside space-y-1 text-xs text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                              {meal.recipe.instructions.map((step, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Chef quote & Batch tip */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {meal.recipe.batchCookingTip && (
                            <div className="bg-blue-50 text-blue-900 p-2.5 rounded-lg border border-blue-200">
                              <span className="font-extrabold text-blue-700">📦 Batch Tip: </span>
                              <span>{meal.recipe.batchCookingTip}</span>
                            </div>
                          )}
                          {meal.recipe.thyroidSafeCookingTip && (
                            <div className="bg-rose-50 text-rose-900 p-2.5 rounded-lg border border-rose-200">
                              <span className="font-extrabold text-rose-700">🩺 Dr. Chopper: </span>
                              <span>{meal.recipe.thyroidSafeCookingTip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Modal para Añadir / Editar Comida con Validación Clara y Dos Modos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border-2 border-[#09086E] space-y-5">
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#DC0F0D] flex items-center justify-center text-white font-bold">
                  🍴
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#09086E]">
                    {editingMeal.meal ? 'Editar Comida / Receta' : 'Añadir Nueva Comida a la Dieta'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Calculador determinista de calorías y macronutrientes
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onModalClosed) onModalClosed();
                }}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensaje de Validación de Error si falta algún dato */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Selector de Modo: Ingredientes Detallados vs Macros Rápidos */}
            <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold">
              <button
                type="button"
                onClick={() => setInputMode('detailed')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  inputMode === 'detailed'
                    ? 'bg-white text-[#09086E] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Modo 1: Desglose por Ingredientes (Recomendado)
              </button>
              <button
                type="button"
                onClick={() => setInputMode('quick')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  inputMode === 'quick'
                    ? 'bg-white text-[#09086E] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Modo 2: Registro Rápido (Macros Directos)
              </button>
            </div>

            {/* Resumen de Macros en Vivo */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3.5 rounded-xl border border-blue-200 flex items-center justify-between flex-wrap gap-2 text-xs shadow-2xs">
              <span className="font-extrabold text-[#09086E] uppercase tracking-wider text-[11px]">
                Totales de esta Comida:
              </span>
              <div className="flex items-center space-x-3 font-mono font-black text-xs sm:text-sm">
                <span className="text-red-600 bg-white px-2 py-0.5 rounded shadow-2xs border border-red-100">
                  🔥 {Math.round(liveModalMacros.calories)} kcal
                </span>
                <span className="text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs border border-blue-100">
                  🥩 P: {Math.round(liveModalMacros.protein * 10) / 10}g
                </span>
                <span className="text-amber-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-amber-100">
                  🌾 C: {Math.round(liveModalMacros.carbs * 10) / 10}g
                </span>
                <span className="text-yellow-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-yellow-100">
                  💧 G: {Math.round(liveModalMacros.fats * 10) / 10}g
                </span>
              </div>
            </div>

            {/* Campos Principales de la Comida */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black text-gray-800 mb-1">
                  Nombre del Plato / Comida <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => {
                    setRecipeName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Ej. Pechuga de Pollo a la Plancha con Arroz y Verduras"
                  className="w-full text-sm font-bold border-2 border-gray-300 focus:border-[#09086E] rounded-xl p-2.5 transition-colors"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Día Asignado</label>
                  <select
                    value={targetDayIndex}
                    onChange={(e) => setTargetDayIndex(parseInt(e.target.value, 10))}
                    className="w-full text-xs font-bold border border-gray-300 rounded-lg p-2 bg-white"
                  >
                    {diet.weekDays.map((d, i) => (
                      <option key={d.dayOfWeek} value={i}>
                        {d.dayName} (Día {d.dayOfWeek})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Toma</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as MealType)}
                    className="w-full text-xs font-bold border border-gray-300 rounded-lg p-2 bg-white"
                  >
                    <option value="breakfast">☕ Desayuno</option>
                    <option value="mid_morning">🍎 Media Mañana</option>
                    <option value="lunch">🍲 Comida / Almuerzo</option>
                    <option value="snack">🥪 Merienda</option>
                    <option value="dinner">🥗 Cena</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Horario Programado</label>
                  <input
                    type="text"
                    value={mealTimeSlot}
                    onChange={(e) => setMealTimeSlot(e.target.value)}
                    placeholder="14:00"
                    className="w-full text-xs font-mono font-bold border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            {/* MODO 2: ENTRADA DIRECTA DE MACROS */}
            {inputMode === 'quick' && (
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Configura los valores directos de esta comida</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Calorías (kcal)</label>
                    <input
                      type="number"
                      value={quickCalories}
                      onChange={(e) => setQuickCalories(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full border p-2 rounded-lg font-black text-red-600 text-sm mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Proteínas (g)</label>
                    <input
                      type="number"
                      value={quickProtein}
                      onChange={(e) => setQuickProtein(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full border p-2 rounded-lg font-black text-blue-700 text-sm mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Carbohidratos (g)</label>
                    <input
                      type="number"
                      value={quickCarbs}
                      onChange={(e) => setQuickCarbs(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full border p-2 rounded-lg font-black text-amber-700 text-sm mt-1 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700">Grasas (g)</label>
                    <input
                      type="number"
                      value={quickFats}
                      onChange={(e) => setQuickFats(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full border p-2 rounded-lg font-black text-yellow-700 text-sm mt-1 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODO 1: CONSTRUCTOR DE INGREDIENTES */}
            {inputMode === 'detailed' && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-gray-900 uppercase">
                    Ingredientes del Plato ({ingredients.length})
                  </h4>
                  <span className="text-[11px] text-gray-500 font-medium">Suma automática de calorías</span>
                </div>

                {/* Lista de Ingredientes Agregados */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {ingredients.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2 text-center">
                      No hay ingredientes añadidos. Agrega uno abajo o guarda para usar los valores rápidos.
                    </p>
                  ) : (
                    ingredients.map((ing) => (
                      <div key={ing.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200 text-xs shadow-2xs">
                        <div>
                          <span className="font-black text-gray-900">{ing.name}</span>
                          <span className="text-gray-500 ml-1">({ing.amount} {ing.unit})</span>
                          {ing.thyroidFriendly && (
                            <span className="ml-1.5 text-[9px] px-1 bg-emerald-50 text-emerald-700 font-bold rounded">
                              ✓ Tiroides
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-700 font-mono text-[11px]">
                            <strong>{ing.calories}</strong> kcal | P:{ing.protein}g C:{ing.carbs}g G:{ing.fats}g
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(ing.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            title="Eliminar ingrediente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Formulario para Agregar Nuevo Ingrediente */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#09086E] uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Añadir Ingrediente (Cálculo Automático)</span>
                    </span>
                    {autoCalculatedBadge && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full animate-bounce">
                        ✨ ¡Macros calculados automáticamente!
                      </span>
                    )}
                  </div>

                  {/* Atajos Rápidos de Alimentos Populares */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-500 font-bold">
                        Catálogo de Alimentos (Haz clic para seleccionar o busca abajo):
                      </span>
                      <span className="text-[10px] text-blue-700 font-bold font-mono">
                        {SPANISH_NUTRITION_DATABASE.length} alimentos
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                      {SPANISH_NUTRITION_DATABASE.slice(0, 16).map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          onClick={() => handleSelectFoodItem(food)}
                          className="shrink-0 px-2 py-1 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <span>{food.icon}</span>
                          <span>{food.name.split('/')[0].split('(')[0].trim()}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input de Nombre con Autocompletado */}
                  <div className="relative">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="col-span-2 relative">
                        <input
                          type="text"
                          placeholder="Escribe cualquier alimento (ej. Pollo, Salmón, Arroz, Lentejas, Aguacate, Plátano...)"
                          value={tempIngName}
                          onChange={(e) => handleIngNameInputChange(e.target.value)}
                          onFocus={() => {
                            setFoodSuggestions(searchFoodDatabase(tempIngName));
                            setShowSuggestions(true);
                          }}
                          className="w-full border-2 border-gray-300 focus:border-[#09086E] p-2 rounded-lg font-bold text-gray-900 bg-white"
                        />

                        {/* Desplegable de Sugerencias Nutricionales */}
                        {showSuggestions && foodSuggestions.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white rounded-xl shadow-xl border border-gray-200 max-h-48 overflow-y-auto divide-y divide-gray-100">
                            {foodSuggestions.map((food) => (
                              <div
                                key={food.id}
                                onClick={() => handleSelectFoodItem(food)}
                                className="p-2 hover:bg-amber-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-base">{food.icon || '🍽️'}</span>
                                  <div>
                                    <div className="font-bold text-gray-900">{food.name}</div>
                                    <div className="text-[10px] text-gray-500">
                                      Por 100g: {food.per100g.calories} kcal • P:{food.per100g.protein}g C:{food.per100g.carbs}g G:{food.per100g.fats}g
                                    </div>
                                  </div>
                                </div>
                                {food.thyroidFriendly && (
                                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">
                                    ✓ Tiroides
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <input
                          type="number"
                          placeholder="Cantidad"
                          value={tempIngAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleIngAmountChange(val === '' ? '' : parseFloat(val));
                          }}
                          className="w-full border-2 border-gray-300 focus:border-[#09086E] p-2 rounded-lg font-black text-gray-900"
                        />
                      </div>

                      <div>
                        <select
                          value={tempIngUnit}
                          onChange={(e) => handleIngUnitChange(e.target.value as any)}
                          className="w-full border-2 border-gray-300 focus:border-[#09086E] p-2 rounded-lg bg-white font-bold text-gray-800"
                        >
                          <option value="g">Gramos (g)</option>
                          <option value="ml">Mililitros (ml)</option>
                          <option value="ud">Unidad (ud)</option>
                          <option value="cucharada">Cucharada</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Campos de Macros Calculados (Editables si se desea ajuste manual) */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold mb-1 flex items-center justify-between">
                      <span>Valores Calculados para {tempIngAmount || 0} {tempIngUnit}:</span>
                      <span className="text-blue-600 font-normal">Puedes ajustarlos manualmente si lo deseas</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-gray-600 font-black">Kcal</label>
                        <input
                          type="number"
                          value={tempIngKcal}
                          onChange={(e) => setTempIngKcal(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-full border p-1 rounded font-black text-red-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 font-black">Proteína (g)</label>
                        <input
                          type="number"
                          value={tempIngProt}
                          onChange={(e) => setTempIngProt(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-full border p-1 rounded font-black text-blue-700 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 font-black">Carbos (g)</label>
                        <input
                          type="number"
                          value={tempIngCarbs}
                          onChange={(e) => setTempIngCarbs(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-full border p-1 rounded font-black text-amber-700 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-600 font-black">Grasa (g)</label>
                        <input
                          type="number"
                          value={tempIngFats}
                          onChange={(e) => setTempIngFats(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-full border p-1 rounded font-black text-yellow-700 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="w-full py-2 bg-[#09086E] text-white hover:bg-blue-900 rounded-xl text-xs font-black cursor-pointer transition-transform hover:scale-[1.01] shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Añadir {tempIngName ? `"${tempIngName}"` : 'este ingrediente'} al plato</span>
                  </button>
                </div>
              </div>
            )}

            {/* Acciones de Guardar / Cancelar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onModalClosed) onModalClosed();
                }}
                className="px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-save-meal-submit"
                onClick={handleSaveMeal}
                className="px-6 py-2.5 text-xs font-black bg-[#DC0F0D] text-white hover:bg-red-700 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 uppercase tracking-wider flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Comida en la Dieta</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
