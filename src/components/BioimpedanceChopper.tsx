import React, { useState } from 'react';
import { BioimpedanceRecord } from '../types';
import { compareBioimpedance } from '../utils/calculations';
import { THYROID_GUIDELINES, CHOPPER_MEDICAL_TIPS } from '../data/hypothyroidismGuide';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Activity, 
  Plus, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  HeartPulse, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Flame, 
  Droplet, 
  Dna,
  ArrowRight
} from 'lucide-react';

interface BioimpedanceChopperProps {
  records: BioimpedanceRecord[];
  onAddRecord: (record: BioimpedanceRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const BioimpedanceChopper: React.FC<BioimpedanceChopperProps> = ({
  records,
  onAddRecord,
  onDeleteRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'charts' | 'compare' | 'thyroid'>('history');

  // Comparison selectors
  const [compOldId, setCompOldId] = useState<string>(records[0]?.id || '');
  const [compNewId, setCompNewId] = useState<string>(records[records.length - 1]?.id || '');

  // Add Record Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('07:30');
  const [weightKg, setWeightKg] = useState<number | ''>(75.0);
  const [bmi, setBmi] = useState<number | ''>(24.5);
  const [bodyFatPercent, setBodyFatPercent] = useState<number | ''>(23.5);
  const [subcutaneousFatPercent, setSubcutaneousFatPercent] = useState<number | ''>(19.5);
  const [visceralFatLevel, setVisceralFatLevel] = useState<number | ''>(6);
  const [bodyWaterPercent, setBodyWaterPercent] = useState<number | ''>(54.0);
  const [skeletalMusclePercent, setSkeletalMusclePercent] = useState<number | ''>(34.0);
  const [muscleMassKg, setMuscleMassKg] = useState<number | ''>(55.0);
  const [boneMassKg, setBoneMassKg] = useState<number | ''>(3.1);
  const [proteinPercent, setProteinPercent] = useState<number | ''>(17.0);
  const [bmrKcal, setBmrKcal] = useState<number | ''>(1720);
  const [bodyAgeYears, setBodyAgeYears] = useState<number | ''>(30);
  const [notes, setNotes] = useState('');

  // Thyroid guide search filter
  const [thyroidSearch, setThyroidSearch] = useState('');
  const [thyroidFilter, setThyroidFilter] = useState<'all' | 'recommended' | 'caution_cook' | 'avoid'>('all');

  const latestRecord = records[records.length - 1];

  const handleSaveNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec: BioimpedanceRecord = {
      id: `bio-${Date.now()}`,
      date,
      time,
      weightKg: Number(weightKg),
      bmi: Number(bmi),
      bodyFatPercent: Number(bodyFatPercent),
      subcutaneousFatPercent: Number(subcutaneousFatPercent),
      visceralFatLevel: Number(visceralFatLevel),
      bodyWaterPercent: Number(bodyWaterPercent),
      skeletalMusclePercent: Number(skeletalMusclePercent),
      muscleMassKg: Number(muscleMassKg),
      boneMassKg: Number(boneMassKg),
      proteinPercent: Number(proteinPercent),
      bmrKcal: Number(bmrKcal),
      bodyAgeYears: Number(bodyAgeYears),
      notes,
    };
    onAddRecord(newRec);
    setIsModalOpen(false);
  };

  // Find records for comparison
  const recOld = records.find((r) => r.id === compOldId) || records[0];
  const recNew = records.find((r) => r.id === compNewId) || records[records.length - 1];
  const delta = recOld && recNew ? compareBioimpedance(recOld, recNew) : null;

  // Filter thyroid guidelines
  const filteredGuidelines = THYROID_GUIDELINES.filter((g) => {
    const matchFilter = thyroidFilter === 'all' || g.type === thyroidFilter;
    const matchSearch = g.foodName.toLowerCase().includes(thyroidSearch.toLowerCase()) ||
      g.keyNutrient.toLowerCase().includes(thyroidSearch.toLowerCase()) ||
      g.category.toLowerCase().includes(thyroidSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Chopper Medical Themed Header */}
      <div className="bg-[#f43f5e] text-white p-6 rounded-2xl shadow-lg border-2 border-[#FDDF28]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-[#FDDF28] border border-[#FDDF28]/30 mb-2">
              <span>🩺 CLÍNICA MÉDICA DEL DR. TONY TONY CHOPPER</span>
              <span>•</span>
              <span>BIOIMPEDANCIA & SALUD TIROIDEA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Registro Corporal de Bioimpedancia & Guía de Salud
            </h1>
            <p className="text-sm text-rose-100 mt-1 max-w-2xl">
              Captura las 12 métricas de tu báscula inteligente, analiza diferenciales de progreso y consulta las pautas nutricionales para hipotiroidismo.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-white text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-black shadow-md flex items-center space-x-2 self-start md:self-center transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nueva Pesada</span>
          </button>
        </div>
      </div>

      {/* Subnavigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
            activeTab === 'history' ? 'bg-[#09086E] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Historial de Lecturas ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
            activeTab === 'charts' ? 'bg-[#09086E] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Gráficas Temporales</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
            activeTab === 'compare' ? 'bg-[#09086E] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Dna className="w-3.5 h-3.5" />
          <span>Comparador de 2 Fechas (Δ Delta)</span>
        </button>

        <button
          onClick={() => setActiveTab('thyroid')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
            activeTab === 'thyroid' ? 'bg-[#f43f5e] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Guía Hipotiroidismo</span>
        </button>
      </div>

      {/* TAB 1: HISTORY TABLE */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Latest Metric Highlight Cards */}
          {latestRecord && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Peso Corporal</span>
                <div className="text-xl font-black text-gray-900 mt-0.5">{latestRecord.weightKg} kg</div>
                <span className="text-[10px] text-gray-400">IMC {latestRecord.bmi}</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">% Grasa Corporal</span>
                <div className="text-xl font-black text-rose-600 mt-0.5">{latestRecord.bodyFatPercent}%</div>
                <span className="text-[10px] text-gray-400">Subcutánea {latestRecord.subcutaneousFatPercent}%</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Masa Muscular</span>
                <div className="text-xl font-black text-blue-600 mt-0.5">{latestRecord.muscleMassKg} kg</div>
                <span className="text-[10px] text-gray-400">Esquelético {latestRecord.skeletalMusclePercent}%</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Grasa Visceral</span>
                <div className="text-xl font-black text-amber-600 mt-0.5">Nivel {latestRecord.visceralFatLevel}</div>
                <span className="text-[10px] text-emerald-600 font-bold">Rango Saludable (1-9)</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Agua Corporal</span>
                <div className="text-xl font-black text-cyan-600 mt-0.5">{latestRecord.bodyWaterPercent}%</div>
                <span className="text-[10px] text-gray-400">Proteína {latestRecord.proteinPercent}%</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase">BMR Basal</span>
                <div className="text-xl font-black text-purple-600 mt-0.5">{latestRecord.bmrKcal} kcal</div>
                <span className="text-[10px] text-gray-400">Edad Corporal: {latestRecord.bodyAgeYears} años</span>
              </div>
            </div>
          )}

          {/* Full History Records Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900">
                Historial Completo de Bioimpedancia (12 Parámetros de Báscula)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-3">Fecha</th>
                    <th className="py-3 px-3">Peso (kg)</th>
                    <th className="py-3 px-3">IMC</th>
                    <th className="py-3 px-3">% Grasa</th>
                    <th className="py-3 px-3">G. Visceral</th>
                    <th className="py-3 px-3">Músculo (kg)</th>
                    <th className="py-3 px-3">% Músculo</th>
                    <th className="py-3 px-3">% Agua</th>
                    <th className="py-3 px-3">BMR (kcal)</th>
                    <th className="py-3 px-3">Edad Corp.</th>
                    <th className="py-3 px-3">Notas</th>
                    <th className="py-3 px-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-50/80">
                      <td className="py-3 px-3 font-bold text-gray-900 whitespace-nowrap">{rec.date}</td>
                      <td className="py-3 px-3 font-black text-gray-900">{rec.weightKg}</td>
                      <td className="py-3 px-3 text-gray-700">{rec.bmi}</td>
                      <td className="py-3 px-3 font-bold text-rose-600">{rec.bodyFatPercent}%</td>
                      <td className="py-3 px-3 text-amber-700 font-medium">Nv. {rec.visceralFatLevel}</td>
                      <td className="py-3 px-3 font-bold text-blue-600">{rec.muscleMassKg}</td>
                      <td className="py-3 px-3 text-blue-700">{rec.skeletalMusclePercent}%</td>
                      <td className="py-3 px-3 text-cyan-700 font-medium">{rec.bodyWaterPercent}%</td>
                      <td className="py-3 px-3 font-bold text-purple-700">{rec.bmrKcal}</td>
                      <td className="py-3 px-3 text-gray-700">{rec.bodyAgeYears} a</td>
                      <td className="py-3 px-3 text-gray-500 max-w-xs truncate">{rec.notes || '-'}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onDeleteRecord(rec.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Eliminar pesada"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHARTS */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* Weight & Muscle Mass Evolution */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-gray-900">
              Evolución Temporal: Peso Corporal (kg) vs Masa Muscular (kg)
            </h3>
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="weightKg" name="Peso (kg)" stroke="#DC0F0D" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="muscleMassKg" name="Masa Muscular (kg)" stroke="#0B44C8" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Body Fat % vs Body Water % */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-gray-900">
              Composición Corporal: % Grasa Corporal vs % Agua
            </h3>
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="bodyFatPercent" name="% Grasa Corporal" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="bodyWaterPercent" name="% Agua Corporal" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPARISON ENGINE */}
      {activeTab === 'compare' && delta && (
        <div className="space-y-6">
          {/* Selectors */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                Lectura Base A (Fecha Anterior):
              </label>
              <select
                value={compOldId}
                onChange={(e) => setCompOldId(e.target.value)}
                className="w-full text-xs font-bold border border-gray-300 rounded-lg p-2.5 bg-white"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.date} - {r.weightKg} kg ({r.bodyFatPercent}% grasa)
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center justify-center p-2 rounded-full bg-gray-100 text-gray-600">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">
                Lectura Actual B (Fecha Posterior):
              </label>
              <select
                value={compNewId}
                onChange={(e) => setCompNewId(e.target.value)}
                className="w-full text-xs font-bold border border-gray-300 rounded-lg p-2.5 bg-white"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.date} - {r.weightKg} kg ({r.bodyFatPercent}% grasa)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chopper Diagnostic Banner */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-300 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-rose-900 font-extrabold text-sm uppercase">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>Diagnóstico Médico del Dr. Chopper</span>
            </div>
            <p className="text-sm text-rose-950 font-bold leading-relaxed">
              {delta.evaluation.chopperDiagnosis}
            </p>
            <div className="text-xs text-rose-800 font-medium">
              Lapso evaluado: <strong>{delta.daysBetween} días</strong> entre lecturas.
            </div>
          </div>

          {/* Delta Comparison Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Weight Delta */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Diferencial de Peso</span>
              <div className="text-2xl font-black mt-1 flex items-center space-x-1">
                <span className={delta.weightDiff <= 0 ? 'text-emerald-600' : 'text-amber-600'}>
                  {delta.weightDiff > 0 ? `+${delta.weightDiff}` : delta.weightDiff} kg
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                {recOld.weightKg} kg → {recNew.weightKg} kg
              </div>
            </div>

            {/* Fat Percent Delta */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Diferencial % Grasa</span>
              <div className="text-2xl font-black mt-1 flex items-center space-x-1">
                <span className={delta.fatPercentDiff <= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {delta.fatPercentDiff > 0 ? `+${delta.fatPercentDiff}` : delta.fatPercentDiff}%
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                {recOld.bodyFatPercent}% → {recNew.bodyFatPercent}%
              </div>
            </div>

            {/* Muscle Mass Delta */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Δ Masa Muscular</span>
              <div className="text-2xl font-black mt-1 flex items-center space-x-1">
                <span className={delta.muscleMassDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {delta.muscleMassDiff > 0 ? `+${delta.muscleMassDiff}` : delta.muscleMassDiff} kg
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                {recOld.muscleMassKg} kg → {recNew.muscleMassKg} kg
              </div>
            </div>

            {/* BMR Delta */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Δ Gasto BMR</span>
              <div className="text-2xl font-black mt-1 flex items-center space-x-1">
                <span className={delta.bmrDiff >= 0 ? 'text-emerald-600' : 'text-amber-600'}>
                  {delta.bmrDiff > 0 ? `+${delta.bmrDiff}` : delta.bmrDiff} kcal
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                {recOld.bmrKcal} → {recNew.bmrKcal} kcal
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THYROID CLINICAL GUIDE */}
      {activeTab === 'thyroid' && (
        <div className="space-y-6">
          {/* Medical Tips Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHOPPER_MEDICAL_TIPS.map((tip, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs space-y-2">
                <h4 className="text-sm font-black text-rose-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>{tip.title}</span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {tip.content}
                </p>
              </div>
            ))}
          </div>

          {/* Search & Category Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Buscar alimento o nutriente (ej. Selenio, Brócoli, Nueces)..."
                value={thyroidSearch}
                onChange={(e) => setThyroidSearch(e.target.value)}
                className="flex-1 text-xs border border-gray-300 rounded-lg p-2.5 font-medium"
              />
              <div className="flex space-x-1 overflow-x-auto">
                <button
                  onClick={() => setThyroidFilter('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                    thyroidFilter === 'all' ? 'bg-[#09086E] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setThyroidFilter('recommended')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                    thyroidFilter === 'recommended' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  ✨ Favorecen
                </button>
                <button
                  onClick={() => setThyroidFilter('caution_cook')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                    thyroidFilter === 'caution_cook' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  ⚠️ Cocer Bociógenos
                </button>
                <button
                  onClick={() => setThyroidFilter('avoid')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                    thyroidFilter === 'avoid' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800'
                  }`}
                >
                  🚫 Evitar / Separar
                </button>
              </div>
            </div>

            {/* Food Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {filteredGuidelines.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-1.5 ${
                    item.type === 'recommended'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : item.type === 'caution_cook'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-extrabold text-gray-900">{item.foodName}</h5>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.type === 'recommended'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.type === 'caution_cook'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.type === 'recommended' && '✨ Recomendado'}
                      {item.type === 'caution_cook' && '⚠️ Requiere Cocción'}
                      {item.type === 'avoid' && '🚫 Precaución / Separar'}
                    </span>
                  </div>
                  <div className="text-xs text-blue-900 font-bold">
                    Nutriente Clave: {item.keyNutrient}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {item.benefitOrReason}
                  </p>
                  {item.cookingRule && (
                    <div className="text-xs text-gray-800 font-semibold bg-white/80 p-2 rounded border border-gray-200">
                      🍳 <strong>Pauta de Cocina:</strong> {item.cookingRule}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add New Bioimpedance Log */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveNewRecord} className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-rose-600" />
                <span>Registrar Datos de Báscula Inteligente (12 Métricas)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border p-2 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Hora</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border p-2 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg font-black text-rose-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">IMC</label>
                <input
                  type="number"
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">% Grasa Corporal</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFatPercent}
                  onChange={(e) => setBodyFatPercent(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg font-bold text-red-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">% Grasa Subcutánea</label>
                <input
                  type="number"
                  step="0.1"
                  value={subcutaneousFatPercent}
                  onChange={(e) => setSubcutaneousFatPercent(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Grasa Visceral (1-50)</label>
                <input
                  type="number"
                  value={visceralFatLevel}
                  onChange={(e) => setVisceralFatLevel(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  className="w-full border p-2 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">% Agua Corporal</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyWaterPercent}
                  onChange={(e) => setBodyWaterPercent(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg text-cyan-700 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">% Músculo Esquelético</label>
                <input
                  type="number"
                  step="0.1"
                  value={skeletalMusclePercent}
                  onChange={(e) => setSkeletalMusclePercent(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg text-blue-700 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Masa Muscular (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={muscleMassKg}
                  onChange={(e) => setMuscleMassKg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg font-black text-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Masa Ósea (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={boneMassKg}
                  onChange={(e) => setBoneMassKg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">% Proteína</label>
                <input
                  type="number"
                  step="0.1"
                  value={proteinPercent}
                  onChange={(e) => setProteinPercent(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">BMR (kcal)</label>
                <input
                  type="number"
                  value={bmrKcal}
                  onChange={(e) => setBmrKcal(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  className="w-full border p-2 rounded-lg font-bold text-purple-700"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Edad Corporal (años)</label>
                <input
                  type="number"
                  value={bodyAgeYears}
                  onChange={(e) => setBodyAgeYears(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 text-xs block mb-1">Notas Clínicas / Sensaciones</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Medición en ayunas tras tomar Eutirox. Sensación de buena energía."
                rows={2}
                className="w-full border p-2 rounded-lg text-xs"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-[#f43f5e] text-white hover:bg-rose-700 rounded-lg shadow-md"
              >
                Guardar Pesada
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
