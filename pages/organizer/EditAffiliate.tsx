
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_EVENTS } from '../../constants';

export const EditAffiliate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Simulando dados vindo de API
  const [formData, setFormData] = useState({
    name: 'Rodrigo Promotor',
    email: 'rodrigo@eventos.com',
    code: 'RODRIGO10',
    commission: 5,
    status: 'active',
    eventRestriction: 'all',
    selectedEvents: [] as string[]
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Cadastro do afiliado atualizado com sucesso!');
      navigate('/organizador/afiliados');
    }, 1200);
  };

  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1";
  const inputClasses = "w-full px-5 py-4 rounded-2xl border border-gray-200 bg-slate-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-bold";

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link to="/organizador/afiliados" className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2 hover:underline flex items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i> Voltar para Lista
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Editar Afiliado</h1>
            <p className="text-gray-500 text-sm mt-1">Ajuste configurações específicas para este parceiro.</p>
          </div>
          <div className="flex gap-2">
             <Badge variant={formData.status === 'active' ? 'success' : 'gray'} className="!px-4 !py-2 uppercase font-black tracking-widest">
               Status: {formData.status === 'active' ? 'Ativo' : 'Pausado'}
             </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border shadow-sm p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Nome do Afiliado</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className={inputClasses} 
                  />
                </div>
                <div>
                  <label className={labelClasses}>E-mail de Contato</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className={inputClasses} 
                  />
                </div>
                <div>
                  <label className={labelClasses}>Código Ref (Personalizado)</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className={`${inputClasses} font-mono`} 
                  />
                </div>
                <div>
                  <label className={labelClasses}>Comissão (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={formData.commission}
                      onChange={e => setFormData({...formData, commission: Number(e.target.value)})}
                      className={inputClasses} 
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-indigo-300">%</span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <label className={labelClasses}>Restrição de Eventos</label>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit mb-6">
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, eventRestriction: 'all'})}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition ${formData.eventRestriction === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                   >
                     Global (Todos)
                   </button>
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, eventRestriction: 'selected'})}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition ${formData.eventRestriction === 'selected' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                   >
                     Eventos Específicos
                   </button>
                </div>

                {formData.eventRestriction === 'selected' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
                    {MOCK_EVENTS.map(ev => (
                      <label key={ev.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-100 transition group">
                         <div className="flex items-center gap-3">
                            <img src={ev.banner} className="w-8 h-8 rounded-lg object-cover" />
                            <span className="text-xs font-bold text-gray-700">{ev.name}</span>
                         </div>
                         <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600" />
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t flex flex-col sm:flex-row gap-4">
                 <Button variant="danger" type="button" className="flex-1 !bg-rose-50 !text-rose-600 !border-rose-100 border hover:!bg-rose-100">Suspender Afiliado</Button>
                 <Button isLoading={loading} type="submit" className="flex-[2] shadow-xl shadow-indigo-100">Salvar Alterações</Button>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                   <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6">Resumo Geral</h3>
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Vendas Totais</p>
                        <p className="text-3xl font-black">154</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Total Comissionado</p>
                        <p className="text-3xl font-black text-emerald-400">R$ 840,50</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Taxa de Conversão</p>
                        <p className="text-3xl font-black">4.2%</p>
                      </div>
                   </div>
                </div>
                <i className="fa-solid fa-medal absolute -right-6 -bottom-6 text-9xl text-white opacity-5 rotate-12"></i>
             </div>

             <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                <h4 className="font-black text-indigo-900 text-xs uppercase tracking-widest mb-4">Nota Interna</h4>
                <p className="text-xs text-indigo-800 leading-relaxed font-medium italic">
                  "Promotor com alto engajamento em eventos universitários. Manter comissão de 5% enquanto volume for superior a 100 vendas/mês."
                </p>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
