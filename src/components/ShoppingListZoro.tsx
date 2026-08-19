import React, { useState, useMemo } from 'react';
import { FortnightDiet, ShoppingItem } from '../types';
import { generateShoppingList } from '../utils/calculations';
import { 
  ShoppingCart, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Printer, 
  Copy, 
  Check, 
  RotateCcw, 
  Trash2,
  PackageCheck,
  Tag
} from 'lucide-react';

interface ShoppingListZoroProps {
  diet: FortnightDiet;
}

export const ShoppingListZoro: React.FC<ShoppingListZoroProps> = ({ diet }) => {
  const [multiplier, setMultiplier] = useState<number>(2); // Default to Fortnight (x2)
  const [customItems, setCustomItems] = useState<ShoppingItem[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // Add Custom Item Form
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('ud');
  const [newItemCategory, setNewItemCategory] = useState('verduras');

  // Consolidated items with current multiplier
  const consolidatedList = useMemo(() => {
    const list = generateShoppingList(diet, multiplier, customItems);
    return list.map((item) => ({
      ...item,
      purchased: purchasedIds.has(item.id),
    }));
  }, [diet, multiplier, customItems, purchasedIds]);

  const togglePurchased = (id: string) => {
    const next = new Set(purchasedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setPurchasedIds(next);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ShoppingItem = {
      id: `custom-shop-${Date.now()}`,
      name: newItemName.trim(),
      baseAmount: newItemAmount,
      unit: newItemUnit,
      category: newItemCategory,
      multiplier,
      totalAmount: newItemAmount * multiplier,
      purchased: false,
      isCustom: true,
    };

    setCustomItems([...customItems, newItem]);
    setNewItemName('');
    setNewItemAmount(1);
    setIsAddingItem(false);
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems(customItems.filter((i) => i.id !== id));
    if (purchasedIds.has(id)) {
      const next = new Set(purchasedIds);
      next.delete(id);
      setPurchasedIds(next);
    }
  };

  const resetAllPurchased = () => {
    setPurchasedIds(new Set());
  };

  // Group by Supermarket Aisles
  const categories = [
    { key: 'verduras_frutas', label: '🥦 Verduras y Frutas Frescas (Zoro)', filter: (c: string) => c === 'verduras' || c === 'frutas' },
    { key: 'carnes_pescados', label: '🥩 Carnicería y Pescadería del All Blue', filter: (c: string) => c === 'carnes_pescados' },
    { key: 'lacteos_huevos', label: '🥚 Lácteos, Huevos y Fermentos', filter: (c: string) => c === 'lacteos_huevos' },
    { key: 'legumbres_cereales', label: '🌾 Despensa de Nami: Legumbres, Arroz y Cereales', filter: (c: string) => c === 'legumbres_cereales' },
    { key: 'grasas_aceites', label: '🫒 Grasas Esenciales y Aceite de Oliva', filter: (c: string) => c === 'grasas_aceites' },
    { key: 'especias_otros', label: '🧂 Especias, Hierbas y Despensa General', filter: (c: string) => c === 'especias_otros' || !['verduras', 'frutas', 'carnes_pescados', 'lacteos_huevos', 'legumbres_cereales', 'grasas_aceites'].includes(c) },
  ];

  const totalItemsCount = consolidatedList.length;
  const purchasedCount = consolidatedList.filter((i) => i.purchased).length;
  const progressPct = totalItemsCount > 0 ? Math.round((purchasedCount / totalItemsCount) * 100) : 0;

  const copyToClipboard = () => {
    let text = `🏴‍☠️ LISTA DE LA COMPRA DE ZORO (Ciclo x${multiplier} ${multiplier === 2 ? 'Quincenal' : multiplier === 1 ? 'Semanal' : 'Mensual'})\n\n`;
    categories.forEach((cat) => {
      const itemsInCat = consolidatedList.filter((i) => cat.filter(i.category));
      if (itemsInCat.length > 0) {
        text += `\n[ ${cat.label} ]\n`;
        itemsInCat.forEach((item) => {
          text += `${item.purchased ? '✅' : '▫️'} ${item.name}: ${item.totalAmount} ${item.unit}\n`;
        });
      }
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Zoro Themed Header */}
      <div className="bg-[#008000] text-white p-6 rounded-2xl shadow-lg border-2 border-[#FDDF28]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-[#FDDF28] border border-[#FDDF28]/30 mb-2">
              <span>⚔️ LISTA DE LA COMPRA DE ZORO</span>
              <span>•</span>
              <span>MOTOR MATEMÁTICO DETERMINISTA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Aprovisionamiento Quincenal del Thousand Sunny
            </h1>
            <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
              Consolidación automática de todos los ingredientes de la semana multiplicados por 2 para el ciclo quincenal completo.
            </p>
          </div>

          {/* Fortnight Multiplier Selector */}
          <div className="bg-black/40 p-2 rounded-xl border border-white/20 flex flex-col items-center">
            <span className="text-[11px] text-yellow-300 font-bold mb-1">Multiplicador de Compra</span>
            <div className="flex space-x-1">
              <button
                onClick={() => setMultiplier(1)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  multiplier === 1 ? 'bg-[#DC0F0D] text-white shadow' : 'text-emerald-200 hover:text-white'
                }`}
              >
                x1 (1 Semana)
              </button>
              <button
                onClick={() => setMultiplier(2)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  multiplier === 2 ? 'bg-[#DC0F0D] text-white shadow' : 'text-emerald-200 hover:text-white'
                }`}
              >
                x2 (Quincenal)
              </button>
              <button
                onClick={() => setMultiplier(4)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  multiplier === 4 ? 'bg-[#DC0F0D] text-white shadow' : 'text-emerald-200 hover:text-white'
                }`}
              >
                x4 (1 Mes)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Quick Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Progress */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>Progreso en el Supermercado: {purchasedCount} de {totalItemsCount} comprados</span>
            <span className="text-emerald-700 font-black">{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <button
            onClick={() => setIsAddingItem(true)}
            className="px-3 py-1.5 bg-[#09086E] text-white hover:bg-blue-900 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#FDDF28]" />
            <span>Añadir Extra</span>
          </button>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold flex items-center space-x-1.5"
            title="Copiar lista de texto para WhatsApp"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold flex items-center space-x-1.5"
            title="Imprimir lista (Brook Style)"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
          <button
            onClick={resetAllPurchased}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg"
            title="Desmarcar todos"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Custom Item Modal */}
      {isAddingItem && (
        <form onSubmit={handleAddCustomItem} className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-emerald-900 uppercase">
              Añadir Artículo Extra a la Lista de Compra
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              placeholder="Nombre (ej. Papel de hornear, Sal yodada)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="border border-emerald-300 bg-white p-2 rounded col-span-2 font-semibold"
              required
            />
            <input
              type="number"
              min="0.1"
              step="any"
              placeholder="Cantidad base"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(parseFloat(e.target.value) || 1)}
              className="border border-emerald-300 bg-white p-2 rounded"
            />
            <input
              type="text"
              placeholder="Unidad (g, ml, ud, bote)"
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="border border-emerald-300 bg-white p-2 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="text-xs border border-emerald-300 bg-white p-2 rounded"
            >
              <option value="verduras">Verduras y Frutas</option>
              <option value="carnes_pescados">Carnes y Pescados</option>
              <option value="lacteos_huevos">Lácteos y Huevos</option>
              <option value="legumbres_cereales">Legumbres y Granos</option>
              <option value="grasas_aceites">Grasas y Aceites</option>
              <option value="especias_otros">Especias y Varios</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 text-white rounded text-xs font-bold hover:bg-emerald-800"
            >
              Guardar Artículo
            </button>
          </div>
        </form>
      )}

      {/* Grouped Aisles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const itemsInCat = consolidatedList.filter((i) => cat.filter(i.category));
          if (itemsInCat.length === 0) return null;

          const catPurchasedCount = itemsInCat.filter((i) => i.purchased).length;

          return (
            <div
              key={cat.key}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-black text-gray-900">
                  {cat.label}
                </h3>
                <span className="text-xs text-gray-500 font-semibold">
                  {catPurchasedCount}/{itemsInCat.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {itemsInCat.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => togglePurchased(item.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                      item.purchased
                        ? 'bg-gray-50 border-gray-200 opacity-60 text-gray-400'
                        : 'bg-white border-gray-100 hover:border-emerald-300 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.purchased ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                      <span className={`text-xs font-bold ${item.purchased ? 'line-through' : ''}`}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.totalAmount} {item.unit}
                      </span>
                      {item.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustomItem(item.id);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
