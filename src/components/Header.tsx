import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, PlusCircle, Download, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { TabType, UserProfile, Product } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  alertCount: number;
  products: Product[];
  onOpenMobileMenu: () => void;
  onNewMovement: () => void;
  onExport: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  alertCount,
  products,
  onOpenMobileMenu,
  onNewMovement,
  onExport,
  searchQuery,
  setSearchQuery,
  onOpenProfile,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Painel Geral',
          subtitle: new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };
      case 'inventory':
        return {
          title: 'Consulta de Saldo',
          subtitle: 'Visualize e gerencie a quantidade física de produtos em tempo real por corredores e setores',
        };
      case 'product-create':
        return {
          title: 'Cadastro de Produtos',
          subtitle: 'Inclusão de novas mercadorias no catálogo com parametrização de estoque mínimo e custos',
        };
      case 'entries':
        return {
          title: 'Entradas de Estoque',
          subtitle: 'Registro de compras, recebimento de notas e devoluções de fornecedores',
        };
      case 'exits':
        return {
          title: 'Saídas de Estoque',
          subtitle: 'Baixas por vendas, consumo interno e perdas com trava de estoque negativo',
        };
      case 'alerts':
        return {
          title: 'Reposição & Alertas',
          subtitle: 'Acompanhamento de estoque mínimo e previsão de produtos a vencer',
        };
      case 'management':
        return {
          title: 'Área Gerencial',
          subtitle: 'Ajustes manuais com justificativa autorizada, auditoria e limpeza de dados',
        };
      default:
        return { title: 'Estoque', subtitle: '' };
    }
  };

  const info = getTabInfo();

  // Active alerts list for dropdown
  const lowStockItems = products.filter((p) => p.currentStock <= p.minStock);
  const expiringItems = products.filter((p) => {
    if (!p.expiryDate) return false;
    const exp = new Date(p.expiryDate);
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    return exp <= in30;
  });

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 pt-2">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 capitalize tracking-tight">
            {info.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium capitalize first-letter:capitalize">
            {info.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Notifications, Actions */}
      <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
        {/* Quick Search */}
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Buscar produto ou SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'inventory' && activeTab !== 'dashboard') {
                setActiveTab('inventory');
              }
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
          />
        </div>

        {/* Quick Actions */}
        <button
          onClick={onNewMovement}
          title="Nova Movimentação (Entrada/Saída)"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs shadow-indigo-200 transition-colors whitespace-nowrap cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Movimentar</span>
        </button>

        <button
          onClick={onExport}
          title="Exportar Relatório em Excel/CSV"
          className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
        >
          <Download size={18} />
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            title="Notificações e Alertas"
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-2xs transition-colors relative cursor-pointer"
          >
            <Bell size={18} />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {alertCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="font-bold text-sm text-slate-900">Notificações e Alertas</span>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                  {alertCount} pendências
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 text-xs">
                {lowStockItems.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="font-bold text-rose-600 uppercase text-[10px]">Estoque Baixo</p>
                    {lowStockItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveTab('alerts');
                          setIsNotificationsOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-rose-50/60 hover:bg-rose-50 border border-rose-100 flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-500">Saldo: {item.currentStock} un • Mín: {item.minStock} un</p>
                        </div>
                        <AlertTriangle size={15} className="text-rose-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {expiringItems.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <p className="font-bold text-amber-600 uppercase text-[10px]">Vencimento Próximo (PEPS)</p>
                    {expiringItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveTab('alerts');
                          setIsNotificationsOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-50 border border-amber-100 flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-500">Vence em: {item.expiryDate}</p>
                        </div>
                        <Clock size={15} className="text-amber-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {alertCount === 0 && (
                  <div className="py-6 text-center text-slate-400">
                    <p className="text-xs font-semibold text-slate-600">Tudo limpo!</p>
                    <p className="text-[11px]">Nenhum alerta crítico de estoque ou validade pendente.</p>
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setIsNotificationsOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Ver Central de Alertas Completa</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          onClick={onOpenProfile}
          title="Ver perfil de usuário"
          className="cursor-pointer"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 hover:ring-indigo-500/40 shadow-2xs transition-all"
          />
        </button>
      </div>
    </header>
  );
};
