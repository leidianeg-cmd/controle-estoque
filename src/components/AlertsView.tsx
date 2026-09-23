import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  MapPin, 
  ShieldAlert,
  Package
} from 'lucide-react';
import { Product } from '../types';

interface AlertsViewProps {
  products: Product[];
  onRestock: (product: Product) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  products,
  onRestock,
}) => {
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  // Low stock products
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStock);

  // Expiring products (within 30 days or already expired)
  const expiringProducts = products.filter((p) => {
    if (!p.expiryDate) return false;
    const exp = new Date(p.expiryDate);
    return exp <= thirtyDaysFromNow;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Central de Alertas & Reposição</h2>
            <p className="text-xs text-slate-500 font-medium">
              Monitoramento automatizado de segurança para evitar ruptura de estoque e perdas por validade
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-2xl text-center">
            <span className="text-xs text-rose-500 font-bold block uppercase">Estoque Baixo</span>
            <span className="text-lg font-black text-rose-700">{lowStockProducts.length} itens</span>
          </div>
          <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl text-center">
            <span className="text-xs text-amber-500 font-bold block uppercase">Validade Crítica</span>
            <span className="text-lg font-black text-amber-700">{expiringProducts.length} itens</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Estoque Baixo / Ruptura */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <AlertTriangle className="text-rose-500" size={20} />
              <h3 className="text-lg font-bold text-slate-900">Itens Abaixo do Mínimo</h3>
            </div>

            <div className="space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/80 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                          {p.sku}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Local: <span className="font-semibold text-slate-700">{p.location}</span> • Mínimo recomendado: <span className="font-semibold text-slate-700">{p.minStock} un</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-rose-600 mb-1">
                        {p.currentStock <= 0 ? 'Sem estoque' : `${p.currentStock} un restantes`}
                      </div>
                      <button
                        onClick={() => onRestock(p)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        <ArrowUpRight size={13} />
                        <span>Repor</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Tudo em ordem!</p>
                  <p className="text-xs">Nenhum produto está abaixo do estoque mínimo no momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Vencimento Próximo (PEPS / FIFO) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Clock className="text-amber-500" size={20} />
              <h3 className="text-lg font-bold text-slate-900">Vencimento Próximo (Atenção PEPS)</h3>
            </div>

            <div className="space-y-3">
              {expiringProducts.length > 0 ? (
                expiringProducts.map((p) => {
                  const isExpired = new Date(p.expiryDate!) < today;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                        isExpired
                          ? 'bg-rose-50/70 border-rose-200'
                          : 'bg-amber-50/60 border-amber-200/70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                            {p.sku}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Corredor: <span className="font-semibold">{p.location}</span> • Saldo a desovar: <span className="font-bold">{p.currentStock} un</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-1 ${
                          isExpired ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {isExpired ? 'VENCIDO' : `Validade: ${p.expiryDate}`}
                        </span>
                        <p className="text-[10px] text-slate-500">Priorizar saída (PEPS)</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Validades em dia!</p>
                  <p className="text-xs">Nenhum lote com vencimento nos próximos 30 dias.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
