import React, { useState } from 'react';
import { 
  Code, 
  Database, 
  FileSpreadsheet, 
  Layers, 
  Copy, 
  Check, 
  Sparkles, 
  Palette,
  Terminal,
  Activity
} from 'lucide-react';

export const ArchitectureModal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'sql_json' | 'csv_specs' | 'math_formulas' | 'wireframes' | 'palette'>('sql_json');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sqlSchemaCode = `-- =========================================================================
-- ESQUEMA RELACIONAL POSTGRESQL: GRAND LINE NUTRITION (ONE PIECE DIET APP)
-- Arquitectura de Datos Determinista (Sin IA)
-- =========================================================================

-- 1. Tabla de Usuarios / Tripulación
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    crew_role VARCHAR(50) DEFAULT 'Captain',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Planes Quincenales
CREATE TABLE fortnight_diets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    cycle_weeks INT DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Días de la Semana (1 = Lunes, 7 = Domingo)
CREATE TABLE diet_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fortnight_diet_id UUID REFERENCES fortnight_diets(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    day_name VARCHAR(20) NOT NULL,
    notes TEXT
);

-- 4. Tomas / Comidas del Día
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diet_day_id UUID REFERENCES diet_days(id) ON DELETE CASCADE,
    meal_type VARCHAR(30) NOT NULL CHECK (meal_type IN ('breakfast', 'mid_morning', 'lunch', 'snack', 'dinner')),
    time_slot VARCHAR(10) NOT NULL, -- e.g. '08:30', '14:00'
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

-- 5. Recetas y Métodos de Cocina
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_id UUID UNIQUE REFERENCES meals(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    prep_time_minutes INT DEFAULT 10,
    cook_time_minutes INT DEFAULT 15,
    batch_cookable BOOLEAN DEFAULT TRUE,
    batch_cooking_tip TEXT,
    thyroid_safe_cooking_tip TEXT,
    chef_quote TEXT
);

-- 6. Ingredientes de la Receta
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    amount NUMERIC(8,2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'g', 'ml', 'ud', 'cucharada'
    category VARCHAR(50) NOT NULL, -- 'verduras', 'carnes_pescados', 'lacteos_huevos', etc.
    calories NUMERIC(8,2) NOT NULL,
    protein_g NUMERIC(8,2) NOT NULL,
    carbs_g NUMERIC(8,2) NOT NULL,
    fats_g NUMERIC(8,2) NOT NULL,
    thyroid_friendly BOOLEAN DEFAULT TRUE,
    thyroid_note TEXT
);

-- 7. Historial de Báscula y Bioimpedancia (12 Métricas Clínicas Dr. Chopper)
CREATE TABLE bioimpedance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    measurement_time TIME WITHOUT TIME ZONE DEFAULT '07:30:00',
    weight_kg NUMERIC(5,2) NOT NULL,
    bmi NUMERIC(4,2) NOT NULL,
    body_fat_percent NUMERIC(4,2) NOT NULL,
    subcutaneous_fat_percent NUMERIC(4,2) NOT NULL,
    visceral_fat_level INT NOT NULL CHECK (visceral_fat_level BETWEEN 1 AND 50),
    body_water_percent NUMERIC(4,2) NOT NULL,
    skeletal_muscle_percent NUMERIC(4,2) NOT NULL,
    muscle_mass_kg NUMERIC(5,2) NOT NULL,
    bone_mass_kg NUMERIC(4,2) NOT NULL,
    protein_percent NUMERIC(4,2) NOT NULL,
    bmr_kcal INT NOT NULL,
    body_age_years INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de consulta rápida
CREATE INDEX idx_bioimpedance_date ON bioimpedance_records(measurement_date ASC);
CREATE INDEX idx_diet_days ON diet_days(fortnight_diet_id, day_of_week);`;

  const jsonSchemaCode = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OnePieceDietFortnightSchema",
  "type": "object",
  "required": ["id", "name", "cycleWeeks", "weekDays"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "createdAt": { "type": "string", "format": "date" },
    "cycleWeeks": { "type": "integer", "const": 2 },
    "weekDays": {
      "type": "array",
      "minItems": 7,
      "maxItems": 7,
      "items": {
        "type": "object",
        "required": ["dayOfWeek", "dayName", "meals"],
        "properties": {
          "dayOfWeek": { "type": "integer", "minimum": 1, "maximum": 7 },
          "dayName": { "type": "string" },
          "notes": { "type": "string" },
          "meals": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "type", "title", "timeSlot", "recipe"],
              "properties": {
                "id": { "type": "string" },
                "type": { "enum": ["breakfast", "mid_morning", "lunch", "snack", "dinner"] },
                "title": { "type": "string" },
                "timeSlot": { "type": "string" },
                "completed": { "type": "boolean" },
                "recipe": {
                  "type": "object",
                  "required": ["id", "name", "ingredients", "instructions"],
                  "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "prepTimeMinutes": { "type": "number" },
                    "cookTimeMinutes": { "type": "number" },
                    "batchCookable": { "type": "boolean" },
                    "chefQuote": { "type": "string" },
                    "thyroidSafeCookingTip": { "type": "string" },
                    "ingredients": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["id", "name", "amount", "unit", "calories", "protein", "carbs", "fats"],
                        "properties": {
                          "id": { "type": "string" },
                          "name": { "type": "string" },
                          "amount": { "type": "number" },
                          "unit": { "type": "string" },
                          "category": { "type": "string" },
                          "calories": { "type": "number" },
                          "protein": { "type": "number" },
                          "carbs": { "type": "number" },
                          "fats": { "type": "number" },
                          "thyroidFriendly": { "type": "boolean" },
                          "thyroidNote": { "type": "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

  return (
    <div className="space-y-6 pb-12">
      {/* Robin / Architecture Header */}
      <div className="bg-[#800080] text-white p-6 rounded-2xl shadow-lg border-2 border-[#FDDF28]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-[#FDDF28] border border-[#FDDF28]/30 mb-2">
              <span>📜 ARQUITECTURA TÉCNICA & PONEGLYPH DE NICO ROBIN</span>
              <span>•</span>
              <span>SISTEMA DETERMINISTA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Especificación Técnica, Modelos de Datos & UX Wireframes
            </h1>
            <p className="text-sm text-purple-100 mt-1 max-w-2xl">
              Documentación técnica exhaustiva para el equipo de desarrollo: Schemas SQL, JSON, especificaciones de cabeceras CSV, fórmulas matemáticas y sistema de diseño One Piece.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm flex flex-wrap gap-1">
        <button
          onClick={() => setActiveSection('sql_json')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
            activeSection === 'sql_json' ? 'bg-[#800080] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Esquemas SQL & JSON</span>
        </button>

        <button
          onClick={() => setActiveSection('csv_specs')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
            activeSection === 'csv_specs' ? 'bg-[#800080] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Especificación CSV</span>
        </button>

        <button
          onClick={() => setActiveSection('math_formulas')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
            activeSection === 'math_formulas' ? 'bg-[#800080] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Fórmulas Deterministas</span>
        </button>

        <button
          onClick={() => setActiveSection('palette')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
            activeSection === 'palette' ? 'bg-[#800080] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Paleta Sombreros de Paja</span>
        </button>
      </div>

      {/* SECTION 1: SQL & JSON SCHEMAS */}
      {activeSection === 'sql_json' && (
        <div className="space-y-6">
          {/* SQL PostgreSQL Block */}
          <div className="bg-gray-900 text-gray-100 rounded-2xl p-5 shadow-sm space-y-3 border border-gray-800">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-xs font-bold text-yellow-400 font-mono">schema.sql (PostgreSQL DDL)</span>
              <button
                onClick={() => copyToClipboard(sqlSchemaCode, 'sql')}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 font-mono flex items-center space-x-1"
              >
                {copiedCode === 'sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === 'sql' ? 'Copiado' : 'Copiar SQL'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto p-2 text-gray-300 leading-relaxed max-h-96 scrollbar-thin">
              {sqlSchemaCode}
            </pre>
          </div>

          {/* JSON Schema Block */}
          <div className="bg-gray-900 text-gray-100 rounded-2xl p-5 shadow-sm space-y-3 border border-gray-800">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-xs font-bold text-cyan-400 font-mono">diet_schema.json (JSON Schema Draft-07)</span>
              <button
                onClick={() => copyToClipboard(jsonSchemaCode, 'json')}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 font-mono flex items-center space-x-1"
              >
                {copiedCode === 'json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === 'json' ? 'Copiado' : 'Copiar JSON Schema'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto p-2 text-gray-300 leading-relaxed max-h-80 scrollbar-thin">
              {jsonSchemaCode}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 2: CSV SPECIFICATIONS */}
      {activeSection === 'csv_specs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900">
              1. Cabeceras y Tipos de Datos para el CSV de Dieta Semanal
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200 rounded-lg">
                <thead className="bg-gray-100 font-bold text-gray-700">
                  <tr>
                    <th className="p-2.5">Columna</th>
                    <th className="p-2.5">Tipo</th>
                    <th className="p-2.5">Ejemplo</th>
                    <th className="p-2.5">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  <tr><td className="p-2 font-mono font-bold">Dia_Numero</td><td>Entero (1-7)</td><td>1</td><td>1=Lunes, 7=Domingo</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Dia_Nombre</td><td>String</td><td>Lunes</td><td>Nombre legible</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Tipo_Toma</td><td>Enum</td><td>lunch</td><td>breakfast, mid_morning, lunch, snack, dinner</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Hora</td><td>String (HH:MM)</td><td>14:00</td><td>Hora programada</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Receta_Nombre</td><td>String</td><td>Pechuga con Arroz</td><td>Título de la receta</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Ingrediente_Nombre</td><td>String</td><td>Arroz Jazmín</td><td>Nombre del ingrediente</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Cantidad</td><td>Numérico</td><td>150</td><td>Cantidad en la ración</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Unidad</td><td>String</td><td>g</td><td>g, ml, ud, cucharada</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Categoria</td><td>Enum</td><td>legumbres_cereales</td><td>Sección de supermercado</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Calorias_kcal</td><td>Numérico</td><td>195</td><td>Aporte calórico</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Proteinas_g</td><td>Numérico</td><td>4.2</td><td>Gramos de proteína</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Carbohidratos_g</td><td>Numérico</td><td>43.5</td><td>Gramos de hidratos</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Grasas_g</td><td>Numérico</td><td>0.5</td><td>Gramos de grasas</td></tr>
                  <tr><td className="p-2 font-mono font-bold">Apto_Tiroides</td><td>Boolean (SI/NO)</td><td>SI</td><td>Flag para hipotiroidismo</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900">
              2. Cabeceras para el CSV de Báscula y Bioimpedancia (12 Métricas)
            </h3>
            <div className="p-3 bg-gray-50 rounded-xl font-mono text-xs text-gray-800 border border-gray-200 overflow-x-auto">
              Fecha,Hora,Peso_kg,IMC,Grasa_Corporal_Porcentaje,Grasa_Subcutanea_Porcentaje,Grasa_Visceral_Nivel,Agua_Corporal_Porcentaje,Musculo_Esqueletico_Porcentaje,Masa_Muscular_kg,Masa_Osea_kg,Proteina_Porcentaje,BMR_kcal,Edad_Corporal_Anios,Notas
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DETERMINISTIC MATH FORMULAS */}
      {activeSection === 'math_formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Gasto Metabólico Basal (Mifflin-St Jeor)</span>
            </h3>
            <div className="text-xs bg-gray-50 p-3 rounded-xl font-mono text-gray-800 border border-gray-200 space-y-1">
              <div><strong>Hombres:</strong> BMR = (10 × peso_kg) + (6.25 × altura_cm) - (5 × edad) + 5</div>
              <div><strong>Mujeres:</strong> BMR = (10 × peso_kg) + (6.25 × altura_cm) - (5 × edad) - 161</div>
            </div>
            <p className="text-xs text-gray-600">
              Fórmula con mayor validación clínica frente a calorimetría indirecta en sujetos con variaciones tiroideas.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Multiplicador Quincenal de la Compra</span>
            </h3>
            <div className="text-xs bg-gray-50 p-3 rounded-xl font-mono text-gray-800 border border-gray-200 space-y-1">
              <div>Cantidad_Total(ingrediente) = ∑ [ Cantidad(ingrediente, dia_1..7) ] × Multiplicador</div>
              <div>Factor Quincenal = 2.0 (14 días consecutivos)</div>
            </div>
            <p className="text-xs text-gray-600">
              Agrupación por clave normalizada (<code>nombre_unit</code>) para consolidar artículos repetidos en diferentes días.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3 md:col-span-2">
            <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Evaluación de Recomposición Corporal de Doctor Chopper (Δ Delta)</span>
            </h3>
            <div className="text-xs bg-gray-50 p-3 rounded-xl font-mono text-gray-800 border border-gray-200 space-y-1">
              <div>Δ Peso = Peso_Actual - Peso_Anterior</div>
              <div>Δ % Grasa = % Grasa_Actual - % Grasa_Anterior</div>
              <div>Δ Masa Muscular = Músculo_kg_Actual - Músculo_kg_Anterior</div>
              <div><strong>Condición de Éxito Óptimo:</strong> Δ % Grasa ≤ -0.5% Y Δ Masa Muscular ≥ 0.0 kg</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PALETTE MAPPING */}
      {activeSection === 'palette' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-900">
            Mapeo Oficial de Colores de la Tripulación de Sombreros de Paja
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-center">
              <div className="w-8 h-8 rounded-full bg-[#DC0F0D] mx-auto mb-1 border-2 border-white shadow"></div>
              <span className="font-bold block text-gray-900">Luffy</span>
              <span className="text-[10px] text-gray-500 font-mono">#DC0F0D (Rojo)</span>
              <span className="text-[10px] text-red-700 block font-semibold">Dashboard Principal</span>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-center">
              <div className="w-8 h-8 rounded-full bg-[#008000] mx-auto mb-1 border-2 border-white shadow"></div>
              <span className="font-bold block text-gray-900">Zoro</span>
              <span className="text-[10px] text-gray-500 font-mono">#008000 (Verde)</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">Lista de la Compra</span>
            </div>

            <div className="p-3 rounded-xl border border-blue-200 bg-blue-50 text-center">
              <div className="w-8 h-8 rounded-full bg-[#0000FF] mx-auto mb-1 border-2 border-white shadow"></div>
              <span className="font-bold block text-gray-900">Sanji</span>
              <span className="text-[10px] text-gray-500 font-mono">#0000FF (Azul Real)</span>
              <span className="text-[10px] text-blue-700 block font-semibold">Cocina & Batch</span>
            </div>

            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-center">
              <div className="w-8 h-8 rounded-full bg-[#f43f5e] mx-auto mb-1 border-2 border-white shadow"></div>
              <span className="font-bold block text-gray-900">Chopper</span>
              <span className="text-[10px] text-gray-500 font-mono">#f43f5e (Rosa)</span>
              <span className="text-[10px] text-rose-700 block font-semibold">Bioimpedancia & Salud</span>
            </div>

            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-center">
              <div className="w-8 h-8 rounded-full bg-[#C86400] mx-auto mb-1 border-2 border-white shadow"></div>
              <span className="font-bold block text-gray-900">Jinbe</span>
              <span className="text-[10px] text-gray-500 font-mono">#C86400 (Ocre)</span>
              <span className="text-[10px] text-amber-700 block font-semibold">Plan Quincenal</span>
            </div>

            <div className="p-3 rounded-xl border border-cyan-200 bg-cyan-50 text-center">
              <div className="w-8 h-8 rounded-full bg-[#0B44C8] mx-auto mb-1 border-2 border-white shadow"></div>
              <span className="font-bold block text-gray-900">Franky</span>
              <span className="text-[10px] text-gray-500 font-mono">#0B44C8 (Azul Impacto)</span>
              <span className="text-[10px] text-cyan-700 block font-semibold">Bounty Macros</span>
            </div>

            <div className="p-3 rounded-xl border border-yellow-200 bg-yellow-50 text-center">
              <div className="w-8 h-8 rounded-full bg-[#FDDF28] mx-auto mb-1 border-2 border-white shadow"></div>
              <span className="font-bold block text-gray-900">Usopp</span>
              <span className="text-[10px] text-gray-500 font-mono">#FDDF28 (Amarillo)</span>
              <span className="text-[10px] text-yellow-800 block font-semibold">Importación CSV</span>
            </div>

            <div className="p-3 rounded-xl border border-purple-200 bg-purple-50 text-center">
              <div className="w-8 h-8 rounded-full bg-[#800080] mx-auto mb-1 border-2 border-white shadow"></div>
              <span className="font-bold block text-gray-900">Robin</span>
              <span className="text-[10px] text-gray-500 font-mono">#800080 (Púrpura)</span>
              <span className="text-[10px] text-purple-700 block font-semibold">Arquitectura & SQL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
