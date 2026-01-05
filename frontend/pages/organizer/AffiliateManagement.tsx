
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Affiliate } from '../../types';
import { MOCK_EVENTS } from '../../constants';

export const AffiliateManagement: React.FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isGlobalRulesModalOpen, setIsGlobalRulesModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState({
    defaultCommission: 5,
    cookieDays: 30,
    autoApprove: false
  });

  // Mock Affiliates
  const [affiliates, setAffiliates] = useState<Affiliate[]>([
    { 
      id: '1', 
      name: 'Rodrigo Promotor', 
      email: 'rodrigo@eventos.com', 
      code: 'RODRIGO10', 
      commission: 5, 
      salesCount: 154, 
      totalEarned: 840.50, 
      totalPaid: 500.00,
      status: 'active',
      allowedEventIds: [] 
    },
    { 
      id: '2', 
      name: 'Juliana Festas', 
      email: 'juh@social.com', 
      code: 'JULIANA', 
      commission: 8, 
      salesCount: 88, 
      totalEarned: 1250.00, 
      totalPaid: 1250.00,
      status: 'active',
      allowedEventIds: ['1'] 
    },
  ]);

  const handleCopyLink = (affiliate: Affiliate) => {
    const link = `${window.location.origin}/?ref=${affiliate.code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(affiliate.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    code: '',
    commission: 5,
    eventRestriction: 'all', // 'all' or 'selected'
    selectedEvents: [] as string[]
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newAffiliate: Affiliate = {
        id: Math.random().toString(36).substr(2, 9),
        name: inviteForm.name,
        email: inviteForm.email,
        code: inviteForm.code.toUpperCase(),
        commission: inviteForm.commission,
        salesCount: 0,
        totalEarned: 0,
        totalPaid: 0,
        status: 'active',
        allowedEventIds: inviteForm.eventRestriction === 'all' ? [] : inviteForm.selectedEvents
      };
      setAffiliates([newAffiliate, ...affiliates]);
      setLoading(false);
      setIsInviteModalOpen(false);
      setInviteForm({ name: '', email: '', code: '', commission: 5, eventRestriction: 'all', selectedEvents: [] });
    }, 1500);
  };

  const handleGlobalSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsGlobalRulesModalOpen(false);
      alert('Regras globais de afiliados atualizadas!');
    }, 1200);
  };

  const toggleEventSelection = (eventId: string) => {
    setInviteForm(prev => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(eventId)
        ? prev.selectedEvents.filter(id => id !== eventId)
        : [...prev.selectedEvents, eventId]
    }));
  };

  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1";
  const inputClasses = "w-full px-5 py-4 rounded-2xl border border-gray-200 bg-slate-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-bold";

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Programa de Afiliados</h1>
            <p className="text-gray-500 text-sm mt-1">Recrute promotores e escale suas vendas através de parceiros.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsGlobalRulesModalOpen(true)}>
              <i className="fa-solid fa-gear mr-2"></i> Regras Globais
            </Button>
            <Button onClick={() => setIsInviteModalOpen(true)} className="shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-user-plus mr-2"></i> Recrutar Afiliado
            </Button>
          </div>
        </header>

        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
              <p className={labelClasses}>Total de Afiliados</p>
              <h4 className="text-2xl font-black text-gray-900">{affiliates.length}</h4>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
              <p className={labelClasses}>Total Gerado</p>
              <h4 className="text-2xl font-black text-indigo-600">R$ {affiliates.reduce((acc, a) => acc + a.totalEarned, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
              <p className={labelClasses}>Total Pago</p>
              <h4 className="text-2xl font-black text-emerald-600">R$ {affiliates.reduce((acc, a) => acc + a.totalPaid, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
              <p className={labelClasses}>A Pagar (Pendente)</p>
              <h4 className="text-2xl font-black text-amber-600">R$ {affiliates.reduce((acc, a) => acc + (a.totalEarned - a.totalPaid), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                 <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Afiliado / Código</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Permissão</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Vendas</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acumulado</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Pago</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right text-rose-500">Pendente</th>
                    <th className="px-8 py-5"></th>
                 </tr>
              </thead>
              <tbody className="divide-y">
                 {affiliates.map(af => {
                   const pending = af.totalEarned - af.totalPaid;
                   return (
                   <tr key={af.id} className="hover:bg-gray-50 transition group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${af.name}&background=random`} className="w-10 h-10 rounded-xl" alt="" />
                            <div>
                               <p className="font-bold text-gray-900">{af.name}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-mono text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{af.code}</span>
                                  <button 
                                    onClick={() => handleCopyLink(af)}
                                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded transition ${copiedId === af.id ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                  >
                                    <i className={`fa-solid ${copiedId === af.id ? 'fa-check' : 'fa-link'}`}></i>
                                    {copiedId === af.id ? 'Copiado' : 'Link'}
                                  </button>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                         {af.allowedEventIds.length === 0 ? (
                           <Badge variant="success">GLOBAL</Badge>
                         ) : (
                           <div className="flex flex-col items-center">
                              <Badge variant="gray">RESTRITO</Badge>
                              <span className="text-[9px] font-black text-gray-400 mt-1 uppercase">{af.allowedEventIds.length} EVENTO(S)</span>
                           </div>
                         )}
                      </td>
                      <td className="px-8 py-5 text-center font-black text-gray-900">
                         {af.salesCount}
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-gray-900">
                         R$ {af.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-emerald-600">
                         R$ {af.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-5 text-right font-black text-rose-500">
                         R$ {pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/organizador/afiliados/${af.id}/editar`} className="p-2.5 text-gray-400 hover:text-indigo-600 transition bg-white border rounded-xl shadow-sm">
                              <i className="fa-solid fa-pen-to-square"></i>
                            </Link>
                            <Link to={`/organizador/afiliados/${af.id}/analise`} className="p-2.5 text-indigo-600 transition bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm" title="Ver Relatório e Pagar">
                              <i className="fa-solid fa-chart-line"></i>
                            </Link>
                         </div>
                      </td>
                   </tr>
                 )})}
              </tbody>
           </table>
        </div>
      </div>

      {/* Modal: Regras Globais */}
      <Modal 
        isOpen={isGlobalRulesModalOpen} 
        onClose={() => setIsGlobalRulesModalOpen(false)} 
        title="Regras Globais de Afiliados"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsGlobalRulesModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleGlobalSave} isLoading={loading}>Salvar Alterações</Button>
          </>
        }
      >
        <div className="space-y-6 text-left">
           <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
              <i className="fa-solid fa-wand-magic-sparkles text-indigo-600 mt-1"></i>
              <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                Estas regras serão applied automaticamente para novos parceiros recrutados que não tiverem comissões personalizadas.
              </p>
           </div>

           <div className="space-y-4">
              <div>
                 <label className={labelClasses}>Comissão Padrão (%)</label>
                 <div className="relative">
                    <input 
                      type="number" 
                      value={globalSettings.defaultCommission} 
                      onChange={e => setGlobalSettings({...globalSettings, defaultCommission: Number(e.target.value)})}
                      className={inputClasses} 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-indigo-400/50 pointer-events-none">%</span>
                 </div>
              </div>

              <div>
                 <label className={labelClasses}>Duração do Cookie (Dias)</label>
                 <div className="relative">
                    <input 
                      type="number" 
                      value={globalSettings.cookieDays} 
                      onChange={e => setGlobalSettings({...globalSettings, cookieDays: Number(e.target.value)})}
                      className={inputClasses} 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-indigo-400/50 pointer-events-none">Dias</span>
                 </div>
                 <p className="text-[9px] text-gray-400 mt-1.5 uppercase font-bold tracking-tighter">Tempo que a indicação permanece válida após o clique.</p>
              </div>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border cursor-pointer group">
                 <div>
                    <p className="text-sm font-bold text-gray-700">Auto-Aprovação</p>
                    <p className="text-[10px] text-gray-400 font-medium">Aprovar parceiros automaticamente ao solicitarem via link público.</p>
                 </div>
                 <input 
                   type="checkbox" 
                   checked={globalSettings.autoApprove} 
                   onChange={e => setGlobalSettings({...globalSettings, autoApprove: e.target.checked})}
                   className="w-6 h-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                 />
              </label>
           </div>
        </div>
      </Modal>

      {/* Modal: Recrutar Afiliado */}
      <Modal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        title="Recrutar Afiliado"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsInviteModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleInvite} isLoading={loading} className="shadow-lg shadow-indigo-100">Gerar Link</Button>
          </>
        }
      >
        <div className="space-y-6 text-left p-1">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className={labelClasses}>Nome do Afiliado</label>
                 <input 
                  type="text" 
                  placeholder="Ex: Lucas Influencer" 
                  className={inputClasses}
                  value={inviteForm.name}
                  onChange={e => setInviteForm({...inviteForm, name: e.target.value})}
                 />
              </div>
              <div>
                 <label className={labelClasses}>E-mail</label>
                 <input 
                  type="email" 
                  placeholder="parceiro@email.com" 
                  className={inputClasses}
                  value={inviteForm.email}
                  onChange={e => setInviteForm({...inviteForm, email: e.target.value})}
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className={labelClasses}>Código Ref (Link)</label>
                 <input 
                  type="text" 
                  placeholder="LUCAS10" 
                  className={`${inputClasses} uppercase font-mono`}
                  value={inviteForm.code}
                  onChange={e => setInviteForm({...inviteForm, code: e.target.value})}
                 />
              </div>
              <div>
                 <label className={labelClasses}>Comissão (%)</label>
                 <div className="relative">
                    <input 
                      type="number" 
                      className={inputClasses}
                      value={inviteForm.commission}
                      onChange={e => setInviteForm({...inviteForm, commission: Number(e.target.value)})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-indigo-400/50 pointer-events-none">%</span>
                 </div>
              </div>
           </div>

           <hr className="border-gray-100" />

           <div>
              <label className={labelClasses}>Escopo de Vendas</label>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit mb-4">
                 <button 
                  onClick={() => setInviteForm({...inviteForm, eventRestriction: 'all'})}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition ${inviteForm.eventRestriction === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                 >
                   Todos Eventos
                 </button>
                 <button 
                  onClick={() => setInviteForm({...inviteForm, eventRestriction: 'selected'})}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition ${inviteForm.eventRestriction === 'selected' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                 >
                   Restringir
                 </button>
              </div>

              {inviteForm.eventRestriction === 'selected' && (
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide border rounded-2xl p-2 bg-slate-50/50 animate-in slide-in-from-top-2">
                   {MOCK_EVENTS.map(ev => (
                     <label key={ev.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-transparent hover:border-indigo-100 cursor-pointer group">
                        <div className="flex items-center gap-3">
                           <img src={ev.banner} className="w-8 h-8 rounded-lg object-cover" />
                           <span className="text-xs font-bold text-gray-700">{ev.name}</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={inviteForm.selectedEvents.includes(ev.id)}
                          onChange={() => toggleEventSelection(ev.id)}
                          className="w-5 h-5 rounded border-gray-300 text-indigo-600" 
                        />
                     </label>
                   ))}
                </div>
              )}
           </div>
        </div>
      </Modal>
    </div>
  );
};
