import React, { useState, useEffect } from 'react';
import { FortnightDiet, BioimpedanceRecord, Meal, StrawHatCrewMember } from './types';
import { INITIAL_FORTNIGHT_DIET } from './data/initialDiet';
import { INITIAL_BIOIMPEDANCE_RECORDS } from './data/initialBioimpedance';
import { calculateDietAverageMacros } from './utils/calculations';
import { Navbar } from './components/Navbar';
import { DashboardLuffy } from './components/DashboardLuffy';
import { DietPlanJinbe } from './components/DietPlanJinbe';
import { ShoppingListZoro } from './components/ShoppingListZoro';
import { KitchenSanji } from './components/KitchenSanji';
import { BioimpedanceChopper } from './components/BioimpedanceChopper';
import { MacroCalculatorFranky } from './components/MacroCalculatorFranky';
import { ImportExportUsopp } from './components/ImportExportUsopp';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { 
  subscribeUserDiet, 
  subscribeUserBioRecords, 
  saveUserDiet, 
  saveUserBioRecord, 
  deleteUserBioRecord 
} from './firebase/dbService';
import { testConnection } from './firebase/config';
import { 
  ShieldCheck, 
  Upload, 
  PlusCircle, 
  Database, 
  Check, 
  RotateCcw 
} from 'lucide-react';

function MainApp() {
  const { user, loading: authLoading, isGuest } = useAuth();

  // Estado de la Dieta Quincenal
  const [diet, setDiet] = useState<FortnightDiet>(() => {
    const saved = localStorage.getItem('grand_line_diet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.weekDays && parsed.weekDays.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error al leer dieta guardada', e);
      }
    }
    return INITIAL_FORTNIGHT_DIET;
  });

  // Estado de los Registros de Bioimpedancia
  const [bioRecords, setBioRecords] = useState<BioimpedanceRecord[]>(() => {
    const saved = localStorage.getItem('grand_line_bioimpedance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error al leer bioimpedancia guardada', e);
      }
    }
    return INITIAL_BIOIMPEDANCE_RECORDS;
  });

  // Navegación y Vistas Activas
  const [activeTab, setActiveTab] = useState<StrawHatCrewMember | 'architecture'>('luffy');
  const [activeWeek, setActiveWeek] = useState<1 | 2>(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [triggerAddMealModal, setTriggerAddMealModal] = useState<boolean>(false);
  const [activeCookingMeal, setActiveCookingMeal] = useState<Meal | null>(null);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  // Probar conexión con Firestore al montar
  useEffect(() => {
    testConnection();
  }, []);

  // Sincronización en tiempo real con Firestore
  useEffect(() => {
    if (!user) {
      setIsSynced(false);
      return;
    }

    const unsubDiet = subscribeUserDiet(user.uid, (firestoreDiet) => {
      setDiet(firestoreDiet);
      localStorage.setItem('grand_line_diet', JSON.stringify(firestoreDiet));
      setIsSynced(true);
    });

    const unsubBio = subscribeUserBioRecords(user.uid, (firestoreBio) => {
      setBioRecords(firestoreBio);
      localStorage.setItem('grand_line_bioimpedance', JSON.stringify(firestoreBio));
      setIsSynced(true);
    });

    return () => {
      unsubDiet();
      unsubBio();
    };
  }, [user]);

  // Almacenamiento local de respaldo
  useEffect(() => {
    if (!user) {
      localStorage.setItem('grand_line_diet', JSON.stringify(diet));
    }
  }, [diet, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('grand_line_bioimpedance', JSON.stringify(bioRecords));
    }
  }, [bioRecords, user]);

  // Manejadores
  const handleToggleMealCompleted = async (dayIndex: number, mealId: string) => {
    const updatedWeekDays = [...diet.weekDays];
    const day = updatedWeekDays[dayIndex];
    if (day) {
      day.meals = day.meals.map((m) =>
        m.id === mealId ? { ...m, completed: !m.completed } : m
      );
      const updatedDiet = { ...diet, weekDays: updatedWeekDays };
      setDiet(updatedDiet);

      if (user) {
        await saveUserDiet(user.uid, updatedDiet);
      }
    }
  };

  const handleUpdateDiet = async (newDiet: FortnightDiet) => {
    setDiet(newDiet);
    if (user) {
      await saveUserDiet(user.uid, newDiet);
    }
  };

  const handleAddBioRecord = async (record: BioimpedanceRecord) => {
    const updated = [...bioRecords, record].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setBioRecords(updated);
    if (user) {
      await saveUserBioRecord(user.uid, record);
    }
  };

  const handleDeleteBioRecord = async (id: string) => {
    const updated = bioRecords.filter((r) => r.id !== id);
    setBioRecords(updated);
    if (user) {
      await deleteUserBioRecord(user.uid, id);
    }
  };

  const handleCookMeal = (meal: Meal) => {
    setActiveCookingMeal(meal);
    setActiveTab('sanji');
  };

  // Función para restablecer datos oficiales en español
  const handleResetToSpanishDefaults = async () => {
    if (confirm('¿Restablecer el menú y datos oficiales en español?')) {
      setDiet(INITIAL_FORTNIGHT_DIET);
      setBioRecords(INITIAL_BIOIMPEDANCE_RECORDS);
      localStorage.setItem('grand_line_diet', JSON.stringify(INITIAL_FORTNIGHT_DIET));
      localStorage.setItem('grand_line_bioimpedance', JSON.stringify(INITIAL_BIOIMPEDANCE_RECORDS));
      if (user) {
        await saveUserDiet(user.uid, INITIAL_FORTNIGHT_DIET);
        for (const rec of INITIAL_BIOIMPEDANCE_RECORDS) {
          await saveUserBioRecord(user.uid, rec);
        }
      }
    }
  };

  const dietAverage = calculateDietAverageMacros(diet);

  // Títulos claros de las secciones con sus nombres de personajes
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'luffy':
        return `Panel de Luffy: Semana ${activeWeek}, Día ${selectedDayIndex + 1} (${diet.weekDays[selectedDayIndex]?.dayName || 'Lunes'})`;
      case 'jinbe':
        return `Dieta de Jinbe: Plan Quincenal (Semana ${activeWeek} de 2)`;
      case 'zoro':
        return 'Compra de Zoro: Lista de la Compra Consolidada x2.0';
      case 'sanji':
        return 'Cocina de Sanji: Recetas Paso a Paso & Batch Cooking';
      case 'chopper':
        return 'Clínica de Chopper: Bioimpedancia & Protocolo Hipotiroidismo';
      case 'franky':
        return 'Calculadora de Franky: Gasto Energético & Macros Deterministas';
      case 'usopp':
        return 'Taller de Usopp: Importar / Exportar Dieta y Báscula en CSV';
      case 'architecture':
        return 'Poneglyph de Robin: Esquemas SQL & Modelos de Datos';
      default:
        return 'Dieta Grand Line';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#084C61] flex flex-col items-center justify-center text-white space-y-4 font-sans px-4">
        <div className="w-16 h-16 rounded-full bg-[#DC0F0D] flex items-center justify-center text-white border-4 border-[#FDDF28] animate-bounce shadow-xl">
          <span className="text-3xl font-black">☠</span>
        </div>
        <p className="text-[#FDDF28] font-bold text-sm uppercase tracking-widest text-center">
          Cargando Dieta Grand Line...
        </p>
        <p className="text-xs text-sky-200 text-center">Conectando con la base de datos de la tripulación...</p>
      </div>
    );
  }

  // Si el usuario no ha iniciado sesión ni está en modo invitado
  if (!user && !isGuest) {
    return <AuthScreen />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#084C61] font-sans selection:bg-[#DC0F0D] selection:text-white w-full">
      {/* Barra de Navegación: Lateral en Escritorio / Superior e Inferior en Móvil */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeWeek={activeWeek}
        setActiveWeek={setActiveWeek}
        dailyCalories={dietAverage.calories}
      />

      {/* Área Principal de Contenido a Pantalla Completa */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F4F2E9] shadow-inner pb-16 lg:pb-0">
        {/* Encabezado Superior */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 lg:px-8 shrink-0 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <span className="shrink-0 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#B3480B] text-white text-[9px] sm:text-[10px] font-bold rounded uppercase tracking-wider shadow-2xs">
              Apto Tiroides
            </span>
            <h2 className="text-[#084C61] font-extrabold text-xs sm:text-sm lg:text-base truncate">
              {getHeaderTitle()}
            </h2>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {user && (
              <span className="hidden xl:inline-flex items-center space-x-1 px-2 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Base de Datos</span>
              </span>
            )}

            <button
              onClick={() => setActiveTab('usopp')}
              className="px-2.5 sm:px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] sm:text-xs font-bold rounded shadow-xs transition-all uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 hidden sm:inline" />
              <span>CSV</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('jinbe');
                setTriggerAddMealModal(true);
              }}
              className="px-2.5 sm:px-3.5 py-1.5 bg-[#DC0F0D] hover:bg-red-700 text-white text-[11px] sm:text-xs font-bold rounded shadow-xs transition-all uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
              title="Añadir nueva comida a la dieta"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Añadir Comida</span>
            </button>

            <button
              onClick={handleResetToSpanishDefaults}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-all cursor-pointer"
              title="Restablecer datos originales en español"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Cuerpo Dinámico de la Vista */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === 'luffy' && (
              <DashboardLuffy
                diet={diet}
                selectedDayIndex={selectedDayIndex}
                setSelectedDayIndex={setSelectedDayIndex}
                activeWeek={activeWeek}
                bioRecords={bioRecords}
                onToggleMealCompleted={handleToggleMealCompleted}
                setActiveTab={setActiveTab}
                onCookMeal={handleCookMeal}
              />
            )}

            {activeTab === 'jinbe' && (
              <DietPlanJinbe
                diet={diet}
                onUpdateDiet={handleUpdateDiet}
                activeWeek={activeWeek}
                setActiveWeek={setActiveWeek}
                onCookMeal={handleCookMeal}
                initialOpenAddModal={triggerAddMealModal}
                onModalClosed={() => setTriggerAddMealModal(false)}
              />
            )}

            {activeTab === 'zoro' && (
              <ShoppingListZoro diet={diet} />
            )}

            {activeTab === 'sanji' && (
              <KitchenSanji
                diet={diet}
                activeMeal={activeCookingMeal}
                setActiveMeal={setActiveCookingMeal}
                onMealCompleted={(mealId) => {
                  const dayIdx = diet.weekDays.findIndex((d) =>
                    d.meals.some((m) => m.id === mealId)
                  );
                  if (dayIdx !== -1) {
                    handleToggleMealCompleted(dayIdx, mealId);
                  }
                }}
              />
            )}

            {activeTab === 'chopper' && (
              <BioimpedanceChopper
                records={bioRecords}
                onAddRecord={handleAddBioRecord}
                onDeleteRecord={handleDeleteBioRecord}
              />
            )}

            {activeTab === 'franky' && (
              <MacroCalculatorFranky diet={diet} />
            )}

            {activeTab === 'usopp' && (
              <ImportExportUsopp
                diet={diet}
                onUpdateDiet={handleUpdateDiet}
                bioRecords={bioRecords}
                onUpdateBioRecords={(records) => {
                  setBioRecords(records);
                  if (user) {
                    records.forEach((r) => saveUserBioRecord(user.uid, r));
                  }
                }}
              />
            )}

            {activeTab === 'architecture' && (
              <ArchitectureModal />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
