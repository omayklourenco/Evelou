
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_EVENTS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const EventAudit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = MOCK_EVENTS.find(e => e.id === id) || MOCK_EVENTS[0];
  
  const [moderationNote, setModerationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = (type: 'approve' | 'suspend' | 'request_edit') => {
    if (type === 'request_edit' && !moderationNote) {
      alert('Por favor, descreva o que o organizador precisa ajustar antes de solicitar a edição.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      let msg = '';
      if (type === 'approve') msg = 'Evento aprovado com sucesso!';
      else if (type === 'suspend') msg = 'Evento suspenso. Organizador notificado.';
      else msg = 'Solicitação de edição enviada ao organizador.';
      
      alert(msg);
      setIsSubmitting(false);
      navigate('/admin/eventos');
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 text-left">
      <header className="mb-8">
        <nav className="flex text-[10px] font-black uppercase tracking-widest text-slate-400 gap-2 mb-4">
          <Link to="/admin/dashboard" className="hover:text-indigo-600 transition">Admin</Link>
          <span>/</span>
          <Link to="/admin/eventos" className="hover:text-indigo-600 transition">Eventos</Link>
          <span>/</span>
          <span className="text-slate-900 uppercase">Auditoria de Evento</span>
        </nav>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={event.banner} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-xl" alt="" />
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{event.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={event.status === 'published' ? 'success' : 'gray'}>
                  {event.status === 'published' ? 'Publicado' : 'Rascunho'}
                </Badge>
                <span className="text-xs font-bold text-slate-400">ID: EVT-{event.id}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none !bg-white" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button variant="primary" className="flex-1 md:flex-none shadow-lg shadow-indigo-100" onClick={() => handleAction('approve')} isLoading={isSubmitting}>
              <i className="fa-solid fa-check mr-2"></i> Aprovar Evento
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Info Card */}
          <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 border-b pb-4">Conteúdo do Evento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</p>
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                     <i className="fa-solid fa-tags text-xs"></i>
                   </div>
                   <span className="font-bold text-slate-900">{event.category}</span>
                 </div>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Localização</p>
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                     <i className="fa-solid fa-location-dot text-xs"></i>
                   </div>
                   <span className="font-bold text-slate-900">{event.location}</span>
                 </div>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data & Horário</p>
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                     <i className="fa-solid fa-calendar text-xs"></i>
                   </div>
                   <span className="font-bold text-slate-900">{new Date(event.date).toLocaleDateString()} às {event.time}</span>
                 </div>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Organizador</p>
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                     <i className="fa-solid fa-building text-xs"></i>
                   </div>
                   <Link to={`/admin/organizador/${event.organizerId}/reputacao`} className="font-bold text-indigo-600 hover:underline">{event.organizerName}</Link>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição Completa</p>
               <div className="p-6 bg-slate-50 rounded-3xl text-sm text-slate-600 leading-relaxed italic border border-slate-100">
                 {event.description}
               </div>
            </div>

            {/* Ticket Types in Audit */}
            <div className="mt-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Estrutura de Ingressos</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.tickets.map(t => (
                    <div key={t.id} className="p-5 border rounded-3xl bg-white hover:border-indigo-100 transition">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900">{t.name}</h4>
                          <span className="text-xs font-black text-indigo-600">R$ {t.price.toFixed(2)}</span>
                       </div>
                       <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          <span>Qtd: {t.quantity}</span>
                          <span>Plataforma: R$ {(t.price * 0.1).toFixed(2)}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Activity Logs for this Event */}
          <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
             <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
               <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Histórico de Alterações</h3>
             </div>
             <div className="divide-y text-sm">
                {[
                  { user: 'Org: ' + event.organizerName, action: 'Evento criado e enviado para revisão', time: 'Há 2 dias' },
                  { user: 'Admin Sistema', action: 'Thumbnail alterada para melhor visibilidade', time: 'Há 1 dia' },
                  { user: 'Org: ' + event.organizerName, action: 'Descrição atualizada', time: 'Há 5 horas' },
                ].map((log, i) => (
                  <div key={i} className="px-8 py-4 flex justify-between items-center hover:bg-slate-50/50 transition">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <p className="font-medium text-slate-700">{log.action}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">{log.user}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.time}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Risk Score Widget */}
          <div className="bg-slate-950 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Análise de Risco (IA)</p>
                <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-8 border-emerald-500/20 shadow-inner mb-6 relative">
                   <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent -rotate-45"></div>
                   <span className="text-4xl font-black text-emerald-400">98</span>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Score Seguro</span>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-xs text-slate-400 justify-center">
                      <i className="fa-solid fa-check-double text-emerald-500"></i>
                      <span>Organizador Diamante</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-400 justify-center">
                      <i className="fa-solid fa-check-double text-emerald-500"></i>
                      <span>Preço dentro da média</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-400 justify-center">
                      <i className="fa-solid fa-check-double text-emerald-500"></i>
                      <span>Sem denúncias</span>
                   </div>
                </div>
             </div>
             <i className="fa-solid fa-shield-virus absolute -right-6 -bottom-6 text-9xl text-white opacity-5"></i>
          </div>

          {/* Moderation Controls */}
          <div className="bg-white rounded-[3rem] p-8 border shadow-sm">
             <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6 text-center">Central de Decisão</h3>
             
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nota Interna / Motivo</label>
                   <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
                    placeholder="Descreva o motivo da suspensão ou as edições necessárias."
                    value={moderationNote}
                    onChange={(e) => setModerationNote(e.target.value)}
                   ></textarea>
                </div>

                <div className="space-y-3 pt-2">
                   <Button className="w-full !py-4 shadow-xl shadow-indigo-100" onClick={() => handleAction('approve')} isLoading={isSubmitting}>
                     Aprovar Conteúdo
                   </Button>
                   <Button variant="danger" className="w-full !py-4" onClick={() => handleAction('suspend')} isLoading={isSubmitting}>
                     Suspender Evento
                   </Button>
                   <Button 
                    variant="outline" 
                    className={`w-full !py-4 border-slate-200 text-slate-500 ${moderationNote ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}`}
                    onClick={() => handleAction('request_edit')}
                    isLoading={isSubmitting}
                   >
                     Solicitar Edição
                   </Button>
                </div>
             </div>
          </div>

          {/* User History Widget */}
          <div className="bg-indigo-50 rounded-[3rem] p-8 border border-indigo-100 text-center">
             <i className="fa-solid fa-circle-user text-3xl text-indigo-300 mb-4"></i>
             <h4 className="font-bold text-indigo-900 text-sm mb-2">Histórico do Organizador</h4>
             <p className="text-xs text-indigo-800 leading-relaxed mb-6">
               Este organizador já realizou 15 eventos conosco, todos com checkout finalizado com sucesso.
             </p>
             <Link to={`/admin/organizador/${event.organizerId}/reputacao`} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver Perfil Completo</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
