
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard Global', path: '/admin/dashboard', icon: 'fa-chart-pie' },
    { name: 'Moderador de Eventos', path: '/admin/eventos', icon: 'fa-shield-halved' },
    { name: 'Usuários & Contas', path: '/admin/usuarios', icon: 'fa-users-gear' },
    { name: 'Financeiro Plataforma', path: '/admin/financeiro', icon: 'fa-vault' },
    { name: 'Configurações de Taxas', path: '/admin/configuracoes', icon: 'fa-sliders' },
    { name: 'Logs do Sistema', path: '/admin/logs', icon: 'fa-terminal' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-left">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-400 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/40">
                <i className="fa-solid fa-crown text-sm"></i>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tighter block">EVELOU</span>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Admin Portal</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/50' 
                      : 'hover:bg-slate-900 hover:text-slate-100'}
                  `}
                >
                  <i className={`fa-solid ${item.icon} text-lg ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'}`}></i>
                  <span className="font-bold text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 mt-auto">
             <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistema Online</span>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold">
                      <span>API Latency</span>
                      <span className="text-emerald-400">24ms</span>
                   </div>
                   <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[15%] h-full bg-emerald-500"></div>
                   </div>
                </div>
             </div>
             <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="mt-4 flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-bold"
            >
              <i className="fa-solid fa-power-off"></i> Sair do Admin
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8">
          <button className="lg:hidden p-2" onClick={() => setIsSidebarOpen(true)}>
            <i className="fa-solid fa-bars-staggered text-xl"></i>
          </button>
          
          <div className="relative w-96 hidden md:block">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
            <input 
              type="text" 
              placeholder="Buscar por Pedido, CPF ou Evento..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-4 border-r pr-6">
               <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition">
                 <i className="fa-solid fa-bell"></i>
               </button>
               <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition">
                 <i className="fa-solid fa-gear"></i>
               </button>
            </div>
            <div className="flex items-center gap-3">
               <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-tight">Admin Principal</p>
                  <p className="text-[10px] font-black text-indigo-600 uppercase">SuperUser</p>
               </div>
               <img src={user?.avatar} className="w-10 h-10 rounded-xl object-cover border-2 border-slate-100" alt="" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
