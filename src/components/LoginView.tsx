import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldAlert, 
  Zap,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { PREDEFINED_USERS } from '../mockData';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInput = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Validação de credenciais pré-configuradas
    const foundUser = PREDEFINED_USERS.find((u) => {
      const matchLogin = u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput;
      const matchPass = u.password === cleanPass;
      return matchLogin && matchPass;
    });

    if (foundUser) {
      onLogin({
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar,
      });
    } else {
      setErrorMessage('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* Left Column: Brand & Hero Showcase */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] bg-gradient-to-br from-[#3B42C4] via-[#2F34A8] to-[#1E216B] p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg overflow-hidden">
            <PackageCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">StockFlow</h1>
            <p className="text-[10px] tracking-widest uppercase font-bold text-indigo-200 mt-0.5">
              GESTÃO DE ESTOQUE
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 my-auto py-8 max-w-lg">
          <h2 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white mb-4">
            Simplifique o controle do seu estoque de ponta a ponta
          </h2>
          <p className="text-sm xl:text-base text-indigo-100/90 leading-relaxed mb-8">
            Monitore movimentações físicas, gerencie setores e receba alertas inteligentes em tempo real.
          </p>

          {/* Floating Mock Cards */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-xl shadow-indigo-950/20 max-w-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-white">Leite Integral 1L</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-400 text-emerald-950">
                  59 un
                </span>
              </div>
              <p className="text-xs text-indigo-200 mb-2 font-medium">LT-001 • Corredor A</p>
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-200/90 border-t border-white/10 pt-2 font-medium">
                <Zap size={13} className="text-amber-300" />
                <span>Estoque atualizado por Carlos Souza</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-xl shadow-indigo-950/20 max-w-sm ml-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-white">Feijão Carioca Seleciona...</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-amber-950">
                  8 un
                </span>
              </div>
              <p className="text-xs text-indigo-200 mb-2 font-medium">FL-088 • Corredor B</p>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-200 border-t border-white/10 pt-2 font-medium">
                <ShieldAlert size={13} className="text-amber-300" />
                <span>Alerta de reposição ativado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-indigo-200/70 font-medium">
          © 2026 StockFlow. Eficiência logística para o seu negócio.
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 md:p-14">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex lg:hidden items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <PackageCheck size={24} />
              </div>
              <span className="font-black text-xl text-slate-900">StockFlow</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Acesse a plataforma
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Insira suas credenciais cadastradas para continuar.
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 font-semibold animate-shake">
              <AlertCircle size={17} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail ou Usuário */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                E-mail Corporativo ou Usuário
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="exemplo@empresa.com.br"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-20 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md cursor-pointer"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {/* Lembrar dispositivo */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span>Lembrar dispositivo</span>
              </label>
              <span className="text-slate-400 text-[11px]">
                Ambiente Seguro (SSL)
              </span>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer group mt-2"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
