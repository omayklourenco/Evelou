
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

export const OrganizerLayout: React.FC<OrganizerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock de notificações recentes para o dropdown
  const recentNotifications = [
    { id: '1', title: 'Nova Venda!', msg: 'Ingresso VIP vendido para João Silva.', time: 'Há 2 min', type: 'sale', read: false },
    { id: '2', title: 'Evento Aprovado', msg: 'Seu evento "Rave no Deserto" está online.', time: 'Há 1 hora', type: 'system', read: false },
    { id: '3', title: 'Saque Concluído', msg: 'R$ 1.200,00 transferidos para sua conta.', time: 'Ontem', type: 'finance', read: true },
  ];

  const menuItems = [
    { name: 'Dashboard', path: '/organizador/dashboard', icon: 'fa-chart-pie' },
    { name: 'Meus Eventos', path: '/organizador/eventos', icon: 'fa-calendar-days' },
    { name: 'Portaria (Check-in)', path: '/organizador/checkin', icon: 'fa-qrcode' },
    { name: 'Vendas', path: '/organizador/vendas', icon: 'fa-ticket' },
    { name: 'Cupons', path: '/organizador/cupons', icon: 'fa-tags' },
    { name: 'Afiliados', path: '/organizador/afiliados', icon: 'fa-users-line' },
    { name: 'Relatórios', path: '/organizador/relatorios', icon: 'fa-chart-line' },
    { name: 'Financeiro', path: '/organizador/financeiro', icon: 'fa-wallet' },
    { name: 'Configurações', path: '/organizador/configuracoes', icon: 'fa-gear' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo area */}
          <div className="p-6 flex items-center gap-3">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-e text-xs"></i>
              </div>
              Evelou
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/organizador/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                      : 'hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <i className={`fa-solid ${item.icon} text-lg ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}></i>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-slate-500"></i>
              <span className="font-medium">Sair da Conta</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden text-left">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 relative z-30">
          <button 
            className="p-2 lg:hidden text-slate-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>

          <div className="flex-1 px-4 hidden sm:block">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Painel do Organizador</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown Container */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-slate-500 relative transition-all ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                <i className="fa-solid fa-bell"></i>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Dropdown Menu */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Notificações</h4>
                    <button className="text-[10px] font-black text-indigo-600 hover:underline">Lidas</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y">
                    {recentNotifications.map((notif) => (
                      <div key={notif.id} className={`p-5 flex gap-4 hover:bg-gray-50 transition cursor-pointer relative ${!notif.read ? 'bg-indigo-50/20' : ''}`}>
                        {!notif.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          notif.type === 'sale' ? 'bg-emerald-50 text-emerald-600' :
                          notif.type === 'finance' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          <i className={`fa-solid ${
                            notif.type === 'sale' ? 'fa-ticket' :
                            notif.type === 'finance' ? 'fa-wallet' : 'fa-circle-info'
                          }`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-gray-900 leading-tight mb-1">{notif.title}</p>
                          <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{notif.msg}</p>
                          <p className="text-[9px] font-bold text-gray-300 mt-2 uppercase tracking-tighter">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link 
                    to="/organizador/notificacoes" 
                    className="block py-4 text-center text-xs font-black text-indigo-600 bg-gray-50 hover:bg-indigo-50 transition-colors uppercase tracking-widest border-t"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    Ver Todas Notificações
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">Organizador</p>
              </div>
              <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full border shadow-sm" />
            </div>
          </div>
        </header>

        {/* Content wrapper */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};
