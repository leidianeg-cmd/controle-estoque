import React, { useState } from 'react';
import { 
  PackagePlus, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Boxes,
  Barcode,
  RefreshCw
} from 'lucide-react';
import { Product } from '../types';

interface ProductFormViewProps {
  onSaveProduct: (product: Omit<Product, 'id'>) => void;
  recentProducts: Product[];
  onNavigateToInventory: () => void;
}

export const ProductFormView: React.FC<ProductFormViewProps> = ({
  onSaveProduct,
  recentProducts,
  onNavigateToInventory,
}) => {
  const [sku, setSku] = useState(`PRD-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Mercearia');
  const [unit, setUnit] = useState('un');
  const [location, setLocation] = useState('Corredor A');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(10);
  const [expiryDate, setExpiryDate] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto generate new SKU
  const handleRegenerateSku = () => {
    const letters = ['PRD', 'EST', 'ALM', 'MERC', 'BEB'];
    const prefix = letters[Math.floor(Math.random() * letters.length)];
    setSku(`${prefix}-${Math.floor(100 + Math.random() * 900)}`);
  };

  // Calculate profit margin
  const profitMargin = sellingPrice > 0 && costPrice > 0 
    ? (((sellingPrice - costPrice) / costPrice) * 100).toFixed(1)
    : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProduct({
      sku,
      name,
      category,
      unit,
      location,
      costPrice,
      sellingPrice,
      currentStock,
      minStock,
      expiryDate: expiryDate || undefined,
    });

    setSuccessMessage(`Produto "${name}" cadastrado com sucesso com saldo inicial de ${currentStock} ${unit}!`);

    // Reset fields
    setName('');
    setCostPrice(0);
    setSellingPrice(0);
    setCurrentStock(0);
    setMinStock(10);
    setExpiryDate('');
    handleRegenerateSku();

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <PackagePlus size={28} className="stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cadastro de Produtos</h2>
            <p className="text-sm text-slate-500 font-medium">
              Cadastre novas mercadorias no inventário físico conforme requisito RF01
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToInventory}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>Ver Tabela de Saldo</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fade-in shadow-xs">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Form (7 cols) and Live Preview Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registration Form Card */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: SKU & Categoria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Código SKU / Barras
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateSku}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw size={11} /> Gerar Novo
                  </button>
                </div>
                <div className="relative">
                  <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 font-medium focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option>Mercearia</option>
                  <option>Laticínios</option>
                  <option>Matinais</option>
                  <option>Óleos & Temperos</option>
                  <option>Massas & Farináceos</option>
                  <option>Bebidas</option>
                  <option>Hortifrúti</option>
                  <option>Higiene & Limpeza</option>
                </select>
              </div>
            </div>

            {/* Row 2: Nome do Produto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nome Completo do Produto
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Arroz Tipo 1 Especial 5kg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Row 3: Localização & Unidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Localização Física
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Corredor A, Prateleira 2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unidade de Medida
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="un">Unidade (un)</option>
                  <option value="cx">Caixa (cx)</option>
                  <option value="kg">Quilo (kg)</option>
                  <option value="pct">Pacote (pct)</option>
                  <option value="L">Litro (L)</option>
                  <option value="fardo">Fardo (fardo)</option>
                </select>
              </div>
            </div>

            {/* Row 4: Preços & Margem */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preço de Custo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={costPrice || ''}
                  placeholder="0,00"
                  onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preço de Venda (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={sellingPrice || ''}
                  placeholder="0,00"
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Margem de Lucro
                </label>
                <div className="px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm font-extrabold text-indigo-700 flex items-center justify-between">
                  <span>+{profitMargin}%</span>
                  <span className="text-xs font-semibold text-indigo-500">
                    R$ {(sellingPrice - costPrice > 0 ? (sellingPrice - costPrice) : 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 5: Estoque & Validade */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Estoque Inicial ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={currentStock}
                  onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Estoque Mínimo (Alerta)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={minStock}
                  onChange={(e) => setMinStock(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Data de Validade
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PackagePlus size={18} />
                <span>Salvar e Adicionar ao Estoque</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <span>Pré-visualização do Item</span>
            </h3>

            {/* Simulated Table Row / Product Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-100/70 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-100 shadow-2xs">
                  {sku}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  currentStock <= 0
                    ? 'bg-rose-100 text-rose-700'
                    : currentStock <= minStock
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {currentStock <= 0 ? 'Sem Estoque' : `${currentStock} ${unit}`}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {name || 'Nome do Produto (Digite ao lado)'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{category}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Local</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    {location}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Preço de Venda</span>
                  <span className="font-black text-slate-900 text-sm">
                    R$ {sellingPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {expiryDate && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                  <Calendar size={12} className="text-slate-400" />
                  <span>Vence em: {new Date(expiryDate).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
              <p className="font-bold">Regras do Sistema:</p>
              <p className="text-[11px] text-slate-600">• O estoque mínimo garante avisos preventivos na aba <strong>Reposição & Alertas</strong>.</p>
              <p className="text-[11px] text-slate-600">• As saídas respeitam o limite de <strong>{currentStock} {unit}</strong> disponível (Trava RN01).</p>
            </div>
          </div>

          {/* Quick Counter of items */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Boxes size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Cadastrados</p>
                <p className="text-lg font-black text-slate-900">{recentProducts.length} itens</p>
              </div>
            </div>

            <button
              onClick={onNavigateToInventory}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Consultar Tudo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
