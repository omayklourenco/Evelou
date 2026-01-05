
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password, role });
      if (role === UserRole.ADMIN) navigate('/admin/dashboard');
      else if (role === UserRole.ORGANIZER) navigate('/organizador/dashboard');
      else navigate('/meus-ingressos');
    } catch (err) {
      // Erro já é tratado no store
    }
  };

  const handleQuickLogin = async (quickRole: UserRole) => {
    try {
      await login({ 
        email: `${quickRole.toLowerCase()}@evelou.com`, 
        password: '123456',
        role: quickRole 
      });
      if (quickRole === UserRole.ADMIN) navigate('/admin/dashboard');
      else if (quickRole === UserRole.ORGANIZER) navigate('/organizador/dashboard');
      else navigate('/meus-ingressos');
    } catch (err) {
      // Erro já é tratado no store
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border shadow-xl">
        <div className="text-center">
          <span className="text-4xl font-extrabold text-indigo-600">Evelou</span>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">Acesse sua conta</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de conta
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={UserRole.BUYER}>Comprador</option>
              <option value={UserRole.ORGANIZER}>Organizador</option>
              <option value={UserRole.ADMIN}>Administrador</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg" 
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou teste rapidamente</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full" 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickLogin(UserRole.BUYER)}
            disabled={isLoading}
          >
            <i className="fa-solid fa-user mr-2"></i> Login Rápido: Comprador
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickLogin(UserRole.ORGANIZER)}
            disabled={isLoading}
          >
            <i className="fa-solid fa-briefcase mr-2"></i> Login Rápido: Organizador
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickLogin(UserRole.ADMIN)}
            disabled={isLoading}
          >
            <i className="fa-solid fa-shield mr-2"></i> Login Rápido: Admin
          </Button>
        </div>

        <div className="pt-6 text-center">
          <p className="text-sm text-gray-500">
            Ainda não tem conta?{' '}
            <Link to="/cadastro" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
