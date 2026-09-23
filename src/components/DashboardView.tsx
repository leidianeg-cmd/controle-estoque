import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  Wallet, 
  ArrowUpRight, 
  MoreVertical, 
  ShoppingBag,
  Sparkles,
  PackagePlus,
  ArrowRight
} from 'lucide-react';
import { Product, StockMovement, TabType } from '../types';

interface DashboardViewProps {
  products: Product[];
  movements: StockMovement[];
  onNavigate: (tab: TabType) => void;
  onSelectProduct?: (product: Product) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  movements,
  onNavigate,
}) => {
  const [selectedSellerIndex, setSelectedSellerIndex] = useState<number>(0);
  const [chartPeriod, setChartPeriod] = useState<string>('Setembro, 2026');

  // Calculate totals
  const totalStockUnits = products.reduce((acc, p) => acc + p.currentStock, 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.currentStock * p.sellingPrice), 0);
  const totalEntries = movements.filter(m => m.type === 'entry').reduce((acc, m) => acc + m.quantity, 0);
  const totalExits = movements.filter(m => m.type === 'exit').reduce((acc, m) => acc + m.quantity, 0);

  // Group by categories
  const categoriesCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + (p.currentStock * p.sellingPrice);
    return acc;
  }, {} as Record<string, number>);

  const categoryEntries = Object.entries(categoriesCount);

  // Chart dummy data for week
  const daysOfWeek = [
    { day: 'SEG', val: 980, height: 45 },
    { day: 'TER', val: 1450, height: 70 },
    { day: 'QUA', val: 1730, height: 85, tooltip: true },
    { day: 'QUI', val: 1100, height: 55 },
    { day: 'SEX', val: 1350, height: 65 },
    { day: 'SÁB', val: 890, height: 40 },
    { day: 'DOM', val: 420, height: 20 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Top KPI Cards (All Clickable!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Entradas Realizadas */}
        <div 
          onClick={() => onNavigate('entries')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
          title="Ver Entradas de Estoque"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                Entradas do Mês
              </p>
              <p className="text-[11px] text-slate-400">Total acumulado</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{totalEntries.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">un</span></h3>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={13} /> {totalEntries > 0 ? '+10%' : '0%'}
            </span>
          </div>
        </div>

        {/* Card 2: Saídas & Expedição */}
        <div 
          onClick={() => onNavigate('exits')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
          title="Ver Saídas de Estoque"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Saídas de Estoque
              </p>
              <p className="text-[11px] text-slate-400">Expedição e vendas</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Truck size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{totalExits.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">un</span></h3>
            <span className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
              <TrendingDown size={13} /> {totalExits > 0 ? '-5%' : '0%'}
            </span>
          </div>
        </div>

        {/* Card 3: Valor Total em Estoque (Vibrant Blue Card) */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-gradient-to-br from-indigo-600 to-blue-600 p-5 rounded-3xl text-white shadow-lg shadow-indigo-200/50 flex flex-col justify-between relative overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
          title="Consultar Tabela de Saldos"
        >
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between z-10">
            <div>
              <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">Patrimônio em Estoque</p>
              <p className="text-[11px] text-indigo-200">Preço de venda estimado</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xs group-hover:scale-105 transition-transform">
              <Wallet size={22} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between z-10">
            <h3 className="text-2xl font-black text-white">
              R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className="flex items-center gap-1 text-xs font-bold text-white bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
              <TrendingUp size={13} /> +8%
            </span>
          </div>
        </div>

        {/* Card 4: Donut de Eficiência / Giro */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
          title="Ver inventário completo"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unidades Físicas</p>
              <p className="text-[11px] text-slate-400">Total em prateleira</p>
            </div>
            <MoreVertical size={16} className="text-slate-400" />
          </div>

          <div className="flex items-center justify-around mt-3">
            {/* SVG Mini Donut */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-indigo-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-600"
                  strokeDasharray={`${Math.min(100, Math.max(15, totalStockUnits))}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-extrabold text-slate-800 leading-none">{totalStockUnits}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Itens</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span className="text-slate-600 font-medium">Cadastrados ({products.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <span className="text-slate-600 font-medium">Movimentações ({movements.length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* If no products registered yet, show Clean Onboarding Banner */}
      {products.length === 0 && (
        <div className="bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-indigo-500/5 border border-indigo-100 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="text-indigo-600" size={20} />
              <span>Base de dados limpa e pronta para uso!</span>
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Você limpou os dados anteriores. Clique no botão ao lado ou use a opção <strong>Cadastro de Produtos</strong> no menu lateral para começar a registrar seus produtos reais.
            </p>
          </div>
          <button
            onClick={() => onNavigate('product-create')}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PackagePlus size={18} />
            <span>Cadastrar Primeiro Produto</span>
          </button>
        </div>
      )}

      {/* Analytics Chart Row (Line Chart) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Histórico de Movimentações</h3>
            <p className="text-xs text-slate-400 font-medium">Fluxo de volume transacionado por dia da semana</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option>Setembro, 2026</option>
              <option>Agosto, 2026</option>
              <option>Julho, 2026</option>
            </select>
          </div>
        </div>

        {/* Interactive Smooth Line Chart with Tooltip */}
        <div className="relative pt-6 pb-2">
          <div className="relative h-56 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="700" y2="190" stroke="#F1F5F9" strokeWidth="1" />

              {/* Area fill */}
              <path
                d="M 0 140 C 60 140, 70 80, 116 80 C 170 80, 180 30, 233 30 C 290 30, 310 110, 350 110 C 400 110, 420 60, 466 60 C 520 60, 540 130, 583 130 C 630 130, 660 170, 700 170 L 700 200 L 0 200 Z"
                fill="url(#lineGradient)"
              />

              {/* Smooth line */}
              <path
                d="M 0 140 C 60 140, 70 80, 116 80 C 170 80, 180 30, 233 30 C 290 30, 310 110, 350 110 C 400 110, 420 60, 466 60 C 520 60, 540 130, 583 130 C 630 130, 660 170, 700 170"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <circle cx="233" cy="30" r="6" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="3" className="shadow-md" />
            </svg>

            {/* Tooltip */}
            <div className="absolute left-[30%] top-[0%] -translate-x-1/2 bg-indigo-50/95 backdrop-blur-xs border border-indigo-100 rounded-2xl px-3.5 py-1.5 shadow-xs text-center">
              <span className="text-xs font-bold text-indigo-700 block">R$ 1.730</span>
              <span className="text-[10px] text-slate-400 block font-medium">14/09/2026</span>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {daysOfWeek.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Best Sellers (Left) and Sales by Category (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Best Seller Table with Highlighted Item (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mais Movimentados</h3>
              <p className="text-xs text-slate-400 font-medium">Itens de maior demanda no inventário</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Ver todos ({products.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {products.length > 0 ? (
              products.slice(0, 4).map((item, idx) => {
                const isSelected = selectedSellerIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedSellerIndex(idx)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-200/50 transform scale-[1.01]'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {item.sku.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {item.name}
                        </h4>
                        <p className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {item.location} • Saldo: {item.currentStock} {item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <span className={`text-xs block ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>Preço</span>
                        <span className="text-sm font-bold">R$ {item.sellingPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className={`text-xs block ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>Total</span>
                        <span className="text-sm font-bold">R$ {(item.currentStock * item.sellingPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Package size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Nenhum produto cadastrado</p>
                <p className="text-[11px]">Os produtos que você cadastrar aparecerão em destaque aqui.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sales by Category Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Distribuição por Categoria</h3>
              <p className="text-xs text-slate-400 font-medium">Proporção do valor de estoque</p>
            </div>
            <MoreVertical size={16} className="text-slate-400" />
          </div>

          {/* Donut Chart */}
          <div className="relative w-48 h-48 mx-auto my-2 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-pink-500"
                strokeDasharray="60, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-500"
                strokeDasharray="28, 100"
                strokeDashoffset="-60"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600"
                strokeDasharray="12, 100"
                strokeDashoffset="-88"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-base font-black text-slate-900 leading-tight">
                R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Total Avaliado</span>
            </div>
          </div>

          {/* Breakdown legend */}
          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100">
            <div>
              <span className="text-xs font-bold text-pink-500 block">60%</span>
              <span className="text-[10px] text-slate-500 font-medium">Mercearia</span>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-500 block">28%</span>
              <span className="text-[10px] text-slate-500 font-medium">Grãos/Óleos</span>
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 block">12%</span>
              <span className="text-[10px] text-slate-500 font-medium">Outros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
