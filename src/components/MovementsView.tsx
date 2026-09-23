import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  PackageCheck,
  Tag
} from 'lucide-react';
import { Product, StockMovement } from '../types';

interface MovementsViewProps {
  type: 'entry' | 'exit';
  products: Product[];
  movements: StockMovement[];
  onRegisterMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => { success: boolean; message?: string };
}

export const MovementsView: React.FC<MovementsViewProps> = ({
  type,
  products,
  movements,
  onRegisterMovement,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [batch, setBatch] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setFeedback({ type: 'error', message: 'Selecione um produto da lista.' });
      return;
    }

    if (quantity <= 0) {
      setFeedback({ type: 'error', message: 'A quantidade deve ser maior que zero.' });
      return;
    }

    // RN01: Trava de Estoque Negativo
    if (type === 'exit' && quantity > selectedProduct.currentStock) {
      setFeedback({
        type: 'error',
        message: `Regra RN01 (Trava de Estoque Negativo): Não é possível dar baixa de ${quantity} un. Saldo disponível em estoque: ${selectedProduct.currentStock} un.`,
      });
      return;
    }

    const res = onRegisterMovement({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      type,
      quantity,
      reason: reason || (type === 'entry' ? 'Recebimento de Mercadoria' : 'Saída para Venda/Consumo'),
      user: 'Carlos Souza',
      batch: batch || (type === 'entry' ? `LOTE-${Date.now().toString().slice(-4)}` : undefined),
    });

    if (res.success) {
      setFeedback({
        type: 'success',
        message: `${type === 'entry' ? 'Entrada' : 'Saída'} de ${quantity} un de "${selectedProduct.name}" registrada com sucesso!`,
      });
      setQuantity(1);
      setReason('');
      setBatch('');
    } else {
      setFeedback({ type: 'error', message: res.message || 'Erro ao processar movimentação.' });
    }
  };

  const filteredHistory = movements.filter((m) => m.type === type);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Form Card (5 cols) */}
      <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs h-fit">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            type === 'entry' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {type === 'entry' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {type === 'entry' ? 'Nova Entrada de Estoque' : 'Nova Baixa de Estoque'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {type === 'entry' ? 'Soma unidades ao inventário físico' : 'Subtrai com verificação de saldo'}
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
          {/* Select Product */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Produto
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setFeedback(null);
              }}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">Selecione o produto...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} - {p.name} (Saldo: {p.currentStock} un)
                </option>
              ))}
            </select>
          </div>

          {/* Product Details Hint Card */}
          {selectedProduct && (
            <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Localização física:</span>
                <span className="font-bold text-indigo-700">{selectedProduct.location}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Saldo Atual:</span>
                <span className={`font-bold ${selectedProduct.currentStock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {selectedProduct.currentStock} unidades
                </span>
              </div>
              {selectedProduct.expiryDate && (
                <div className="flex justify-between text-slate-600">
                  <span>Validade cadastrada:</span>
                  <span className="font-medium text-slate-700">{selectedProduct.expiryDate}</span>
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Quantidade ({selectedProduct?.unit || 'unidades'})
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Optional batch for entry */}
          {type === 'entry' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Número do Lote / NF (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: LT-2026-X ou NF 10423"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Motivo / Observação
            </label>
            <input
              type="text"
              placeholder={type === 'entry' ? 'Ex: Compra de Distribuidora' : 'Ex: Venda balcão, requisição interna ou perda'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all cursor-pointer ${
              type === 'entry'
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {type === 'entry' ? 'Confirmar Entrada' : 'Confirmar Saída'}
          </button>
        </form>
      </div>

      {/* History Table (7 cols) */}
      <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Histórico de {type === 'entry' ? 'Entradas' : 'Saídas'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">Últimas movimentações registradas</p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Total: {filteredHistory.length} registros
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Data/Hora</th>
                  <th className="py-3 px-3">Produto</th>
                  <th className="py-3 px-3 text-center">Quantidade</th>
                  <th className="py-3 px-3">Motivo</th>
                  <th className="py-3 px-3 text-right">Usuário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-slate-500 font-mono whitespace-nowrap">
                        {m.date}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{m.productName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.sku}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full font-bold ${
                          type === 'entry' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {type === 'entry' ? `+${m.quantity}` : `-${m.quantity}`} un
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                        {m.reason}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-medium">
                        {m.user}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Nenhuma movimentação deste tipo encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
