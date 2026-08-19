import React, { useState } from 'react';
import { BioimpedanceRecord, FortnightDiet } from '../types';
import { exportBioimpedanceToCSV, exportDietToCSV, parseBioimpedanceFromCSV, parseDietFromCSV } from '../utils/calculations';
import { INITIAL_FORTNIGHT_DIET } from '../data/initialDiet';
import { INITIAL_BIOIMPEDANCE_RECORDS } from '../data/initialBioimpedance';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Sparkles, 
  FileText,
  FileCode,
  FileCheck
} from 'lucide-react';

interface ImportExportUsoppProps {
  diet: FortnightDiet;
  onUpdateDiet: (diet: FortnightDiet) => void;
  bioRecords: BioimpedanceRecord[];
  onUpdateBioRecords: (records: BioimpedanceRecord[]) => void;
}

export const ImportExportUsopp: React.FC<ImportExportUsoppProps> = ({
  diet,
  onUpdateDiet,
  bioRecords,
  onUpdateBioRecords,
}) => {
  const [dietCsvInput, setDietCsvInput] = useState('');
  const [bioCsvInput, setBioCsvInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownloadDietCSV = () => {
    const csvContent = exportDietToCSV(diet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dieta_one_piece_quincenal_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage({ type: 'success', text: 'Dieta exportada exitosamente a archivo CSV.' });
  };

  const handleDownloadBioCSV = () => {
    const csvContent = exportBioimpedanceToCSV(bioRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bioimpedancia_chopper_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage({ type: 'success', text: 'Historial de bioimpedancia exportado exitosamente a CSV.' });
  };

  const handleImportDietCSV = () => {
    try {
      if (!dietCsvInput.trim()) {
        setStatusMessage({ type: 'error', text: 'Por favor pega el contenido CSV en el cuadro de texto.' });
        return;
      }
      const parsedDiet = parseDietFromCSV(dietCsvInput);
      onUpdateDiet(parsedDiet);
      setDietCsvInput('');
      setStatusMessage({ type: 'success', text: '¡Dieta semanal importada correctamente desde el CSV!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error al procesar CSV: ${err.message || 'Formato inválido'}` });
    }
  };

  const handleImportBioCSV = () => {
    try {
      if (!bioCsvInput.trim()) {
        setStatusMessage({ type: 'error', text: 'Por favor pega el contenido CSV en el cuadro de texto.' });
        return;
      }
      const parsedRecords = parseBioimpedanceFromCSV(bioCsvInput);
      if (parsedRecords.length === 0) {
        throw new Error('No se detectaron filas válidas de bioimpedancia.');
      }
      onUpdateBioRecords(parsedRecords);
      setBioCsvInput('');
      setStatusMessage({ type: 'success', text: `¡Se importaron ${parsedRecords.length} registros de báscula con éxito!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error al procesar CSV de báscula: ${err.message}` });
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('¿Restablecer la dieta y bioimpedancia a los valores iniciales de la tripulación?')) {
      onUpdateDiet(INITIAL_FORTNIGHT_DIET);
      onUpdateBioRecords(INITIAL_BIOIMPEDANCE_RECORDS);
      setStatusMessage({ type: 'success', text: 'Se han restaurado los datos oficiales de los Sombreros de Paja.' });
    }
  };

  const handleDietFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDietCsvInput(text);
    };
    reader.readAsText(file);
  };

  const handleBioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setBioCsvInput(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Usopp Header */}
      <div className="bg-[#FDDF28] text-gray-900 p-6 rounded-2xl shadow-lg border-2 border-[#09086E] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-black/10 px-3 py-1 rounded-full text-xs font-black text-[#09086E] border border-black/20 mb-2">
              <span>🎯 IMPORTADOR & EXPORTADOR CSV DE USOPP</span>
              <span>•</span>
              <span>PARSER DETERMINISTA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#09086E]">
              Gestión de Datos, Plantillas CSV & Backups
            </h1>
            <p className="text-sm text-gray-800 mt-1 max-w-2xl font-medium">
              Carga tu dieta semanal o registros de báscula mediante hojas de cálculo (.csv), descarga copias de seguridad y restaura configuraciones.
            </p>
          </div>

          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 bg-[#09086E] text-white hover:bg-blue-950 rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 self-start md:self-center transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer Dieta Oficial</span>
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-red-50 text-red-900 border border-red-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
      )}

      {/* Two Column Grid: Diet CSV + Bioimpedance CSV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diet CSV Manager */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-[#DC0F0D]" />
              <span>Dieta Semanal (CSV)</span>
            </h3>
            <button
              onClick={handleDownloadDietCSV}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC0F0D] rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-red-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar CSV Actual</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Subir Archivo .CSV o Pegar Texto
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleDietFileUpload}
                className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-[#DC0F0D] hover:file:bg-red-100 mb-2 cursor-pointer"
              />
              <textarea
                value={dietCsvInput}
                onChange={(e) => setDietCsvInput(e.target.value)}
                placeholder="Pega aquí el contenido CSV con cabeceras: Dia_Numero, Dia_Nombre, Tipo_Toma, Hora, Receta_Nombre, Ingrediente_Nombre, Cantidad, Unidad, Categoria, Calorias_kcal, Proteinas_g, Carbohidratos_g, Grasas_g, Apto_Tiroides..."
                rows={6}
                className="w-full text-xs font-mono border border-gray-300 rounded-lg p-2.5 bg-gray-50"
              ></textarea>
            </div>

            <button
              onClick={handleImportDietCSV}
              className="w-full py-2.5 bg-[#DC0F0D] text-white hover:bg-red-700 rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Procesar e Importar Dieta Semanal</span>
            </button>
          </div>
        </div>

        {/* Bioimpedance CSV Manager */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Bioimpedancia & Báscula (CSV)</span>
            </h3>
            <button
              onClick={handleDownloadBioCSV}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-rose-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar CSV Báscula</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Subir Archivo .CSV de Báscula o Pegar Texto
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleBioFileUpload}
                className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 mb-2 cursor-pointer"
              />
              <textarea
                value={bioCsvInput}
                onChange={(e) => setBioCsvInput(e.target.value)}
                placeholder="Pega aquí el contenido CSV de báscula: Fecha, Hora, Peso_kg, IMC, Grasa_Corporal_Porcentaje, Grasa_Subcutanea_Porcentaje, Grasa_Visceral_Nivel, Agua_Corporal_Porcentaje, Musculo_Esqueletico_Porcentaje, Masa_Muscular_kg, Masa_Osea_kg, Proteina_Porcentaje, BMR_kcal, Edad_Corporal_Anios, Notas"
                rows={6}
                className="w-full text-xs font-mono border border-gray-300 rounded-lg p-2.5 bg-gray-50"
              ></textarea>
            </div>

            <button
              onClick={handleImportBioCSV}
              className="w-full py-2.5 bg-[#f43f5e] text-white hover:bg-rose-700 rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Procesar e Importar Registros de Báscula</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
