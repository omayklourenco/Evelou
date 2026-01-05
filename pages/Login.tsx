
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleLogin = (role: UserRole) => {
    login(role);
    if (role === UserRole.ADMIN) navigate('/admin/dashboard');
    else if (role === UserRole.ORGANIZER) navigate('/organizador/dashboard');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border shadow-xl">
        <div className="text-center">
          <span className="text-4xl font-extrabold text-indigo-600">Evelou</span>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">Acesse sua conta</h2>
          <p className="mt-2 text-sm text-gray-500">Selecione como deseja entrar (Apenas para demonstração)</p>
        </div>
        
        <div className="space-y-4">
           <Button className="w-full" size="lg" onClick={() => handleLogin(UserRole.BUYER)}>
             <i className="fa-solid fa-user mr-2"></i> Entrar como Comprador
           </Button>
           <Button className="w-full" variant="secondary" size="lg" onClick={() => handleLogin(UserRole.ORGANIZER)}>
             <i className="fa-solid fa-briefcase mr-2"></i> Entrar como Organizador
           </Button>
           <Button className="w-full" variant="outline" size="lg" onClick={() => handleLogin(UserRole.ADMIN)}>
             <i className="fa-solid fa-shield mr-2"></i> Acesso Administrativo
           </Button>
        </div>

        <div className="pt-6 text-center">
          <p className="text-sm text-gray-500">
            Ainda não tem conta? <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
};
