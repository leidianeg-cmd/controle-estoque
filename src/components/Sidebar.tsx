import React from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard, 
  X,
  PackageCheck,
  PackagePlus
} from 'lucide-react';
import { TabType, UserProfile } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  onLogout: () => void;
  alertCount: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  alertCount,
  isOpen,
  onClose,
  onOpenProfile,
}) => {
  const menuItems: { id: TabType; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'inventory', label: 'Consulta Rápida', icon: Search },
    { id: 'product-create', label: 'Cadastro de Produtos', icon: PackagePlus },
    { id: 'entries', label: 'Entradas de Estoque', icon: ArrowUpRight },
    { id: 'exits', label: 'Saídas de Estoque', icon: ArrowDownLeft },
    { id: 'alerts', label: 'Reposição & Alertas', icon: Bell, badge: alertCount },
    { id: 'management', label: 'Área Gerencial', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-5 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } shadow-xs`}>
        {/* Top brand & profile */}
        <div className="space-y-5">
          {/* Logo & Close Button (mobile) */}
          <div className="flex items-center justify-between px-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                <PackageCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
                  StockFlow
                </h1>
                <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">Gestão de Estoque</p>
              </div>
            </button>

            <button 
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Card */}
          <div 
            onClick={onOpenProfile}
            className="p-3 bg-slate-50/80 hover:bg-indigo-50/50 border border-slate-100 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors group"
            title="Ver perfil"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-indigo-600">{user.name}</p>
              <p className="text-xs font-semibold text-indigo-600">Perfil: {user.role}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={19} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-600 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Exit Button */}
        <div className="pt-4 border-t border-slate-100 px-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer"
          >
            <LogOut size={18} className="text-rose-500" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>
    </>
  );
};
