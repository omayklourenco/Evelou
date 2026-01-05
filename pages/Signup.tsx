
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
import { UserRole } from '../types';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de criação de conta
    setTimeout(() => {
      setLoading(false);
      login(role); // Loga automaticamente após o cadastro (simulação)
      if (role === UserRole.ORGANIZER) navigate('/organizador/dashboard');
      else navigate('/');
    }, 2000);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 text-sm";
  const labelClasses = "text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block";

  return (
    <div className="min-h-screen bg-white flex">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-center p-20 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover" 
            alt="Event background" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-indigo-600/40"></div>
        
        <div className="relative z-10 text-left">
          <Link to="/" className="text-3xl font-black tracking-tighter mb-12 block">EVELOU</Link>
          <h2 className="text-5xl font-black leading-tight mb-6">
            Sua porta de entrada para <br />
            <span className="text-indigo-300 underline decoration-indigo-400">experiências incríveis.</span>
          </h2>
          <p className="text-xl text-indigo-100 max-w-md leading-relaxed mb-12">
            Junte-se a maior comunidade de eventos e viva momentos que ficarão guardados para sempre.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                <i className="fa-solid fa-ticket"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg">Acesso Imediato</h4>
                <p className="text-sm text-indigo-200">Compre ingressos em segundos com Pix ou Cartão.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg">Segurança Total</h4>
                <p className="text-sm text-indigo-200">Tecnologia antifraude e ingressos nominais com QR Code.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-20 right-20 flex justify-between items-center text-xs font-bold text-indigo-300 uppercase tracking-widest">
          <span>&copy; 2024 Evelou Ingressos</span>
          <div className="flex gap-4">
            <Link to="/privacidade" className="hover:text-white transition">Privacidade</Link>
            <Link to="/termos" className="hover:text-white transition">Termos</Link>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 animate-in slide-in-from-right-4 duration-500">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Crie sua conta</h1>
            <p className="text-gray-500 mt-2">Escolha seu perfil e comece agora mesmo.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6 text-left">
            {/* Role Selection Tabs */}
            <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setRole(UserRole.BUYER)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  role === UserRole.BUYER ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <i className="fa-solid fa-user mr-2"></i> Sou Comprador
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.ORGANIZER)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  role === UserRole.ORGANIZER ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <i className="fa-solid fa-briefcase mr-2"></i> Sou Organizador
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Nome Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: João da Silva"
                  className={inputClasses}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className={labelClasses}>E-mail</label>
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  className={inputClasses}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Senha</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className={inputClasses}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Confirmar Senha</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className={inputClasses}
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                required
                className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.terms}
                onChange={e => setFormData({...formData, terms: e.target.checked})}
              />
              <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition">
                Eu li e aceito os <Link to="/termos" target="_blank" className="text-indigo-600 font-bold hover:underline">Termos de Uso</Link> e a <Link to="/privacidade" target="_blank" className="text-indigo-600 font-bold hover:underline">Política de Privacidade</Link> da Evelou.
              </span>
            </label>

            <Button 
              className="w-full !py-4 shadow-xl shadow-indigo-100" 
              size="lg" 
              isLoading={loading}
              type="submit"
            >
              Criar minha conta gratuita
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase font-bold text-gray-300"><span className="bg-white px-4 tracking-[0.3em]">Ou cadastre-se com</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-bold text-sm text-gray-600">
                 <i className="fa-brands fa-google text-red-500"></i> Google
               </button>
               <button type="button" className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-bold text-sm text-gray-600">
                 <i className="fa-brands fa-facebook text-blue-600"></i> Facebook
               </button>
            </div>

            <p className="text-center text-sm text-gray-500 pt-6">
              Já possui uma conta? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Fazer Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
