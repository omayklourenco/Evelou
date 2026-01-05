
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from './ui/Button';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600 tracking-tight">Evelou</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/eventos" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                Explorar Eventos
              </Link>
              <Link to="/mobile-app" className="text-gray-500 hover:text-indigo-600 text-sm font-medium flex items-center gap-2">
                <i className="fa-solid fa-mobile-screen-button"></i>
                Baixar App
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/organizador/eventos/novo" className="hidden sm:inline-flex text-sm font-semibold text-gray-700 hover:text-indigo-600">
              Criar evento
            </Link>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link to="/cadastro">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                    <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border shadow-sm" />
                    <span className="hidden sm:inline">{user?.name}</span>
                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      {user?.role === UserRole.BUYER && (
                        <Link to="/meus-ingressos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
                          Meus Ingressos
                        </Link>
                      )}
                      {user?.role === UserRole.ORGANIZER && (
                        <Link to="/organizador/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
                          Dashboard Organizador
                        </Link>
                      )}
                      {user?.role === UserRole.ADMIN && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
                          Painel Admin
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
