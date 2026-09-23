import React, { useState } from 'react';
import { 
  ShieldCheck, 
  History, 
  Trash2, 
  RefreshCcw, 
  AlertCircle, 
  CheckCircle2, 
  Database,
  Lock
} from 'lucide-react';
import { Product, StockMovement } from '../types';

interface ManagementViewProps {
  products: Product[];
  onManualAdjustment: (productId: string, newStock: number, reason: string) => boolean;
  movements: StockMovement[];
  onClearAllData: () => void;
  onLoadSampleData: () => void;
}

export const ManagementView: React.FC<ManagementViewProps> = ({
  products,
  onManualAdjustment,
  movements,
  onClearAllData,
  onLoadSampleData,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [newStock, setNewStock] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setNewStock(prod.currentStock);
    }
    setFeedback(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setFeedback({ type: 'error', message: 'Selecione um produto para ajuste.' });
      return;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      setFeedback({
        type: 'error',
        message: 'Regra RN03: Justificativa obrigatória (mínimo de 5 caracteres) para ajustes manuais gerenciais.',
      });
      return;
    }

    const success = onManualAdjustment(selectedProduct.id, newStock, reason);
    if (success) {
      setFeedback({
        type: 'success',
        message: `Estoque de "${selectedProduct.name}" atualizado de ${selectedProduct.currentStock} para ${newStock} un com sucesso.`,
      });
      setReason('');
    }
  };

  const auditAdjustments = movements.filter((m) => m.reason.includes('Ajuste Manual'));

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Adjustment Form */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Ajuste Manual Autorizado</h3>
              <p className="text-xs text-slate-400 font-medium">
                Conformidade com a Regra RN03 do Escopo
              </p>
            </div>
          </div>

          {feedback && (
            <div className={`mb-5 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2.5 ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
              <div>{feedback.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Selecione o Produto
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Escolha um item...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} - {p.name} (Atual: {p.currentStock} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Saldo no Sistema:</span>
                  <span className="font-bold text-slate-800">{selectedProduct.currentStock} {selectedProduct.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Localização física:</span>
                  <span className="font-semibold text-slate-700">{selectedProduct.location}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nova Quantidade Física Contada
              </label>
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Justificativa Obrigatória (RN03)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Auditoria e contagem física na prateleira; avaria de embalagem; conferência de inventário."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              Gravar Ajuste Gerencial
            </button>
          </form>
        </div>

        {/* Audit Log */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <History size={22} className="text-slate-400" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">Histórico de Auditoria Gerencial</h3>
                <p className="text-xs text-slate-400 font-medium">Registro imutável de alterações manuais</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Data</th>
                    <th className="py-3 px-3">Produto</th>
                    <th className="py-3 px-3">Justificativa</th>
                    <th className="py-3 px-3 text-right">Responsável</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {auditAdjustments.length > 0 ? (
                    auditAdjustments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-slate-500 font-mono">{a.date}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{a.productName}</td>
                        <td className="py-3 px-3 text-slate-600 italic">{a.reason}</td>
                        <td className="py-3 px-3 text-right font-medium text-indigo-700">{a.user}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        Nenhum ajuste manual realizado até o momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Database Management Controls Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <Database size={22} className="text-indigo-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Gestão de Dados & Banco de Dados</h3>
            <p className="text-xs text-slate-400 font-medium">Controle de estado, limpeza e restauração de dados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Clear all data */}
          <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/40 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                <Trash2 size={16} className="text-rose-600" />
                <span>Zerar Todo o Estoque (Limpeza Total)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Remove todos os produtos e movimentações registradas, permitindo iniciar um inventário 100% do zero.
              </p>
            </div>
            <button
              type="button"
              onClick={onClearAllData}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer self-start"
            >
              Zerar Todos os Dados
            </button>
          </div>

          {/* Load sample data */}
          <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                <RefreshCcw size={16} className="text-indigo-600" />
                <span>Carregar Dados de Demonstração</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Recarrega os dados de teste do StockFlow (Leite Integral, Arroz, Café, Feijão, etc.) para testes rápidos.
              </p>
            </div>
            <button
              type="button"
              onClick={onLoadSampleData}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer self-start"
            >
              Restaurar Dados de Exemplo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
