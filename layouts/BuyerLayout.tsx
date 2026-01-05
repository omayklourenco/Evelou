
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

interface BuyerLayoutProps {
  children: React.ReactNode;
}

export const BuyerLayout: React.FC<BuyerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Meus Ingressos', path: '/meus-ingressos', icon: 'fa-ticket' },
    { name: 'Meus Favoritos', path: '/meus-favoritos', icon: 'fa-heart' },
    { name: 'Meus Pedidos', path: '/meus-pedidos', icon: 'fa-receipt' },
    { name: 'Afiliados', path: '/meus-afiliados', icon: 'fa-users-line' },
    { name: 'Meu Perfil', path: '/meu-perfil', icon: 'fa-user-gear' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600">Evelou</Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm font-medium text-gray-600">Olá, {user?.name.split(' ')[0]}</span>
            <img src={user?.avatar} className="w-8 h-8 rounded-full border" alt="" />
          </div>
        </div>
      </header>

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {menuItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                location.pathname === item.path ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-500'
              }`}
            >
              <i className={`fa-solid ${item.icon} mr-2`}></i> {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-gray-500 hover:bg-white hover:text-indigo-600'}
                  `}
                >
                  <i className={`fa-solid ${item.icon} text-lg`}></i>
                  {item.name}
                </Link>
              );
            })}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all mt-8 text-left"
            >
              <i className="fa-solid fa-right-from-bracket text-lg"></i>
              Sair da Conta
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
