
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CATEGORIES } from '../../constants';

export const MyProfile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'interests' | 'security'>('info');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 99999-8888',
    cpf: '123.456.789-00',
    birthDate: '1995-05-15'
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Show', 'Festa']);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateUser({ name: formData.name, email: formData.email });
      setLoading(false);
      alert('Perfil atualizado com sucesso!');
    }, 1500);
  };

  const toggleInterest = (cat: string) => {
    setSelectedInterests(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block";
  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300 text-sm";

  return (
    <div className="text-left animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meu Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie suas informações e preferências de conta.</p>
      </header>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-8 p-1 bg-gray-200/50 rounded-2xl w-fit">
        {[
          { id: 'info', label: 'Dados Pessoais' },
          { id: 'interests', label: 'Interesses' },
          { id: 'security', label: 'Segurança' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'info' && (
            <form onSubmit={handleSave} className="bg-white rounded-[2rem] border shadow-sm p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                <div className="relative group">
                  <img src={user?.avatar} className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl object-cover" alt="" />
                  <button type="button" className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition cursor-pointer">
                    <i className="fa-solid fa-camera text-xs"></i>
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-black text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
                  <Badge variant="success">Perfil Verificado</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClasses}>Nome Completo</label>
                  <input 
                    type="text" 
                    className={inputClasses} 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelClasses}>E-mail</label>
                  <input 
                    type="email" 
                    className={inputClasses} 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Celular / WhatsApp</label>
                  <input 
                    type="text" 
                    className={inputClasses} 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelClasses}>CPF</label>
                  <input 
                    type="text" 
                    className={`${inputClasses} bg-gray-50 cursor-not-allowed`} 
                    value={formData.cpf} 
                    disabled 
                  />
                </div>
                <div>
                  <label className={labelClasses}>Data de Nascimento</label>
                  <input 
                    type="date" 
                    className={inputClasses} 
                    value={formData.birthDate}
                    onChange={e => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <Button isLoading={loading} type="submit">Salvar Alterações</Button>
              </div>
            </form>
          )}

          {activeTab === 'interests' && (
            <div className="bg-white rounded-[2rem] border shadow-sm p-8 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-black text-gray-900 mb-2">Seus Interesses</h3>
              <p className="text-gray-500 text-sm mb-8">Personalize sua experiência selecionando os tipos de eventos que você mais gosta.</p>
              
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map(cat => {
                  const isSelected = selectedInterests.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleInterest(cat)}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                        isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">Recomendações Inteligentes</h4>
                  <p className="text-xs text-indigo-800 leading-relaxed mt-1">
                    Com base nos seus interesses, nossa inteligência artificial irá priorizar eventos de {selectedInterests.join(', ')} na sua página inicial.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-[2rem] border shadow-sm p-8 animate-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Segurança</h3>
                <p className="text-gray-500 text-sm mb-8">Gerencie suas credenciais e proteção de conta.</p>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className={labelClasses}>Nova Senha</label>
                    <input type="password" className={inputClasses} placeholder="••••••••" />
                  </div>
                  <div>
                    <label className={labelClasses}>Confirmar Nova Senha</label>
                    <input type="password" className={inputClasses} placeholder="••••••••" />
                  </div>
                  <Button variant="outline">Alterar Senha</Button>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <h4 className="font-bold text-red-600 text-sm mb-2">Zona de Perigo</h4>
                <p className="text-xs text-gray-500 mb-6">Ao encerrar sua conta, todos os seus dados e histórico de ingressos serão removidos permanentemente.</p>
                <Button variant="ghost" className="!text-red-600 hover:!bg-red-50 !border-red-100 border">Encerrar minha conta Evelou</Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Membro desde 2024</p>
              <h4 className="text-2xl font-black mb-2">Comprador Bronze</h4>
              <p className="text-xs text-indigo-100 leading-relaxed mb-6">Você já viveu 12 experiências incríveis com a Evelou. Faltam 3 para se tornar Prata!</p>
              
              <div className="w-full h-2 bg-indigo-800 rounded-full mb-2 overflow-hidden">
                <div className="w-[80%] h-full bg-white rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">
                <span>12 Eventos</span>
                <span>15 Eventos</span>
              </div>
            </div>
            <i className="fa-solid fa-crown absolute -right-6 -bottom-6 text-9xl text-white opacity-5 rotate-12"></i>
          </div>

          <div className="bg-white rounded-[2rem] border shadow-sm p-8">
            <h3 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-widest">Privacidade</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-gray-600">Receber e-mails de marketing</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-gray-600">Compartilhar perfil público</span>
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
