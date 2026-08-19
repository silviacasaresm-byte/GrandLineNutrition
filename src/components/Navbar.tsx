import React, { useState } from 'react';
import { StrawHatCrewMember } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  Sparkles, 
  LogOut, 
  Database 
} from 'lucide-react';

interface NavbarProps {
  activeTab: StrawHatCrewMember | 'architecture';
  setActiveTab: (tab: StrawHatCrewMember | 'architecture') => void;
  activeWeek: 1 | 2;
  setActiveWeek: (week: 1 | 2) => void;
  dailyCalories: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeWeek,
  setActiveWeek,
  dailyCalories,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isGuest, logout } = useAuth();

  const navItems: { 
    id: StrawHatCrewMember | 'architecture'; 
    label: string; 
    shortLabel: string;
    crewName: string; 
    iconText: string;
    borderAccent: string; 
    hoverBorder: string;
  }[] = [
    { id: 'luffy', label: 'Panel de Luffy', shortLabel: 'Luffy', crewName: 'Luffy', iconText: '🏠', borderAccent: 'border-[#DC0F0D]', hoverBorder: 'hover:border-[#DC0F0D]' },
    { id: 'jinbe', label: 'Dieta de Jinbe', shortLabel: 'Jinbe', crewName: 'Jinbe', iconText: '🧭', borderAccent: 'border-[#B3480B]', hoverBorder: 'hover:border-[#B3480B]' },
    { id: 'zoro', label: 'Compra de Zoro', shortLabel: 'Zoro', crewName: 'Zoro', iconText: '⚔️', borderAccent: 'border-[#008000]', hoverBorder: 'hover:border-[#008000]' },
    { id: 'sanji', label: 'Cocina de Sanji', shortLabel: 'Sanji', crewName: 'Sanji', iconText: '🍴', borderAccent: 'border-[#0284C7]', hoverBorder: 'hover:border-[#0284C7]' },
    { id: 'chopper', label: 'Clínica de Chopper', shortLabel: 'Chopper', crewName: 'Chopper', iconText: '🩺', borderAccent: 'border-[#FB7185]', hoverBorder: 'hover:border-[#FB7185]' },
    { id: 'franky', label: 'Calculadora de Franky', shortLabel: 'Franky', crewName: 'Franky', iconText: '⚙️', borderAccent: 'border-[#0099B8]', hoverBorder: 'hover:border-[#0099B8]' },
    { id: 'usopp', label: 'Taller de Usopp', shortLabel: 'Usopp', crewName: 'Usopp', iconText: '🎯', borderAccent: 'border-[#FDDF28]', hoverBorder: 'hover:border-[#FDDF28]' },
    { id: 'architecture', label: 'Poneglyph de Robin', shortLabel: 'Robin', crewName: 'Robin', iconText: '📖', borderAccent: 'border-[#800080]', hoverBorder: 'hover:border-[#800080]' },
  ];

  const displayName = user?.displayName || (isGuest ? 'Modo Local / Invitado' : user?.email?.split('@')[0] || 'Capitán Pirata');

  return (
    <>
      {/* Barra Superior Móvil */}
      <div className="lg:hidden bg-[#084C61] border-b border-white/10 text-white px-3 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div 
          onClick={() => setActiveTab('luffy')}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#DC0F0D] flex items-center justify-center text-white border-2 border-[#FDDF28] shadow-xs shrink-0">
            <span className="font-bold text-sm">☠</span>
          </div>
          <div>
            <h1 className="text-[#FDDF28] font-bold text-xs uppercase tracking-wider leading-tight">
              Dieta Grand Line
            </h1>
            <span className="text-[9px] text-sky-200">Semana {activeWeek} de 2</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Selector de Semana */}
          <div className="bg-black/30 p-0.5 rounded-lg border border-white/20 flex text-[11px]">
            <button
              onClick={() => setActiveWeek(1)}
              className={`px-2 py-0.5 rounded font-bold ${
                activeWeek === 1 ? 'bg-[#DC0F0D] text-white' : 'text-sky-200'
              }`}
            >
              S1
            </button>
            <button
              onClick={() => setActiveWeek(2)}
              className={`px-2 py-0.5 rounded font-bold ${
                activeWeek === 2 ? 'bg-[#DC0F0D] text-white' : 'text-sky-200'
              }`}
            >
              S2
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            aria-label="Abrir menú de tripulación"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#084C61] border-b border-white/10 text-white px-4 py-3 space-y-1 shadow-xl sticky top-12 z-40">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all border-l-4 ${
                  isActive
                    ? `bg-white/15 text-white ${item.borderAccent}`
                    : `text-white/70 hover:bg-white/5 border-transparent ${item.hoverBorder}`
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 text-center text-sm">{item.iconText}</span>
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono text-white/80">
                  {item.crewName}
                </span>
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
            <span className="truncate max-w-[150px] font-semibold">{displayName}</span>
            <button
              onClick={() => logout()}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold shadow-xs"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Barra de Navegación Inferior para Móviles (Bottom Tab Bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#084C61]/95 backdrop-blur-md border-t border-white/20 px-1 py-1 shadow-2xl flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all min-w-[54px] ${
                isActive
                  ? 'bg-white/20 text-[#FDDF28] font-bold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span className="text-base leading-none">{item.iconText}</span>
              <span className="text-[9px] mt-0.5 font-bold tracking-tight truncate max-w-[56px]">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-white/70 hover:text-white min-w-[54px]"
        >
          <span className="text-base leading-none">⚡</span>
          <span className="text-[9px] mt-0.5 font-bold tracking-tight">Más</span>
        </button>
      </div>

      {/* Barra Lateral para Escritorio (Desktop Sidebar) */}
      <aside className="hidden lg:flex w-64 border-r border-white/10 flex-col bg-[#084C61] shrink-0 sticky top-0 h-screen select-none">
        {/* Encabezado */}
        <div 
          onClick={() => setActiveTab('luffy')}
          className="p-5 flex items-center gap-3 border-b border-white/10 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#DC0F0D] flex items-center justify-center text-white border-2 border-[#FDDF28] shadow-md group-hover:scale-105 transition-transform">
            <span className="font-bold text-xl">☠</span>
          </div>
          <div>
            <h1 className="text-[#FDDF28] font-black text-sm uppercase leading-tight tracking-widest">
              Grand Line<br/>Diet System
            </h1>
            <span className="text-[10px] text-sky-200 uppercase font-semibold tracking-wider flex items-center space-x-1">
              <Database className="w-2.5 h-2.5 text-yellow-300" />
              <span>Base de Datos Activa</span>
            </span>
          </div>
        </div>

        {/* Enlaces de Navegación con Nombres de Secciones Claras */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all text-left border-l-4 ${
                  isActive
                    ? `bg-white/15 text-white ${item.borderAccent} shadow-xs`
                    : `text-white/70 hover:bg-white/5 border-transparent ${item.hoverBorder}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center text-sm">{item.iconText}</span>
                  <span className="tracking-wide">{item.label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-[#DC0F0D] text-white font-black' : 'bg-black/30 text-white/60'
                }`}>
                  {item.crewName}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Ciclo Quincenal y Resumen de Calorías */}
        <div className="px-4 py-3 bg-black/20 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/60 font-semibold">Ciclo Quincenal:</span>
            <div className="bg-[#052e3b] p-0.5 rounded border border-white/20 flex text-[10px]">
              <button
                onClick={() => setActiveWeek(1)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  activeWeek === 1 ? 'bg-[#DC0F0D] text-white' : 'text-sky-200 hover:text-white'
                }`}
              >
                Semana 1
              </button>
              <button
                onClick={() => setActiveWeek(2)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  activeWeek === 2 ? 'bg-[#DC0F0D] text-white' : 'text-sky-200 hover:text-white'
                }`}
              >
                Semana 2
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/80 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
            <span className="text-yellow-300 font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Media Menú:</span>
            </span>
            <span className="font-mono font-black text-white">{dailyCalories} kcal</span>
          </div>
        </div>

        {/* Perfil de Usuario y Botón de Salir */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#FDDF28] border border-white flex items-center justify-center text-sm shadow-sm shrink-0">
              👒
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
                {isGuest ? 'Invitado' : 'Usuario'}
              </p>
              <p className="text-xs text-white font-black truncate" title={user?.email || displayName}>
                {displayName}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600/80 text-white/80 hover:text-white transition-all shrink-0"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
