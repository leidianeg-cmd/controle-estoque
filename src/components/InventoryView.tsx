import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus,
  Trash2, 
  Edit3, 
  X,
  FileSpreadsheet,
  Printer,
  PackagePlus,
  PackageCheck
} from 'lucide-react';
import { Product } from '../types';

interface InventoryViewProps {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onQuickStockChange: (productId: string, delta: number) => void;
  onExportExcel: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  searchQuery,
  setSearchQuery,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onQuickStockChange,
  onExportExcel,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filter products by search query
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Render badge based on stock level
  const renderStockBadge = (stock: number, minStock: number, unit: string) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs">
          Sem estoque
        </span>
      );
    }
    if (stock <= minStock) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
          {stock} {unit} <span className="text-[10px] ml-1 font-normal opacity-80">(Baixo)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
        {stock} {unit}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Banner with Icon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Search size={28} className="stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Consulta de Saldo</h2>
            <p className="text-sm text-slate-500 font-medium">
              Visualize e gerencie a quantidade física de produtos em tempo real por corredores e setores
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          <button
            onClick={onExportExcel}
            title="Baixar planilha formatada"
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Planilha Excel</span>
          </button>
          <button
            onClick={() => window.print()}
            title="Imprimir relatório"
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer size={15} />
          </button>
          <button
            onClick={onAddProduct}
            title="Cadastrar nova mercadoria"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Cadastrar Produto</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Filtro Rápido de Inventário
          </label>
          <span className="text-xs text-slate-400 font-medium">
            {filteredProducts.length} de {products.length} itens encontrados
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
          <input
            type="text"
            placeholder="Filtrar por nome, SKU, categoria ou corredor..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full cursor-pointer"
              title="Limpar pesquisa"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40">
                <th className="py-4 px-6 w-12 text-slate-400 font-semibold">#</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Nome do Produto</th>
                <th className="py-4 px-6 text-center">Saldo Atual</th>
                <th className="py-4 px-6">Localização</th>
                <th className="py-4 px-6 text-right">Preço de Venda</th>
                <th className="py-4 px-6 text-center w-36">Ajuste / Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p, index) => {
                  const globalIndex = (currentPage - 1) * itemsPerPage + index;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* # Index */}
                      <td className="py-4.5 px-6 font-mono text-slate-400 text-xs">
                        {globalIndex}
                      </td>

                      {/* SKU */}
                      <td className="py-4.5 px-6 font-bold text-slate-800 tracking-tight font-mono text-xs">
                        {p.sku}
                      </td>

                      {/* Nome do Produto */}
                      <td className="py-4.5 px-6">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.category}</div>
                      </td>

                      {/* Saldo Atual (Pill Badges) */}
                      <td className="py-4.5 px-6 text-center">
                        {renderStockBadge(p.currentStock, p.minStock, p.unit || 'un')}
                      </td>

                      {/* Localização (Map Pin) */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <MapPin size={14} className="text-slate-400" />
                          <span>{p.location}</span>
                        </div>
                      </td>

                      {/* Preço de Venda */}
                      <td className="py-4.5 px-6 text-right font-bold text-slate-900 font-mono">
                        R$ {p.sellingPrice.toFixed(2).replace('.', ',')}
                      </td>

                      {/* Ações com botões de entrada/saída rápida */}
                      <td className="py-4.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick Add */}
                          <button
                            onClick={() => onQuickStockChange(p.id, 1)}
                            title="Entrada rápida (+1)"
                            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>

                          {/* Quick Minus */}
                          <button
                            onClick={() => onQuickStockChange(p.id, -1)}
                            disabled={p.currentStock <= 0}
                            title={p.currentStock <= 0 ? "Estoque zerado" : "Baixa rápida (-1)"}
                            className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEditProduct(p)}
                            title="Editar dados"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            title="Excluir mercadoria"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <PackagePlus size={36} className="mx-auto text-slate-300 mb-3" />
                    {searchQuery ? (
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Nenhum produto encontrado para "{searchQuery}"</p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          Limpar pesquisa
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base font-bold text-slate-800">O inventário está vazio</p>
                        <p className="text-xs text-slate-500 mt-1 mb-4">Comece cadastrando seu primeiro produto agora mesmo.</p>
                        <button
                          onClick={onAddProduct}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                        >
                          <Plus size={15} />
                          <span>Cadastrar Primeiro Produto</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <p>
            Mostrando <span className="font-bold text-slate-800">{filteredProducts.length}</span> produtos cadastrados
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
