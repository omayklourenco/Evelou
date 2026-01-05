
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_EVENTS } from '../../constants';

export const OrganizerReputation: React.FC = () => {
  const { id } = useParams();
  
  // Dados simulados do organizador
  const organizer = {
    id: id || 'ORG-882',
    name: 'Evelou Produções S.A',
    email: 'contato@evelou.com',
    joinedAt: '2022-03-15',
    score: 94,
    level: 'Diamante',
    totalGmv: 1250400.00,
    activeEvents: 8,
    disputeRate: 0.05,
    kycStatus: 'verified'
  };

  const auditLogs = [
    { date: '2024-05-10', admin: 'Admin João', note: 'Verificação anual de documentos concluída. Tudo OK.' },
    { date: '2024-02-22', admin: 'Sistema', note: 'Alcançou a marca de R$ 1M em vendas. Badge Diamante aplicado.' },
    { date: '2023-11-05', admin: 'Admin Ana', note: 'Investigação de pico de vendas no evento "Rave 2023". Comportamento legítimo.' },
  ];

  return (
    <div className="animate-in fade-in duration-500 text-left">
      <header className="mb-8">
        <nav className="flex text-[10px] font-black uppercase tracking-widest text-slate-400 gap-2 mb-4">
          <Link to="/admin/dashboard" className="hover:text-indigo-600">Admin</Link>
          <span>/</span>
          <Link to="/admin/eventos" className="hover:text-indigo-600">Eventos</Link>
          <span>/</span>
          <span className="text-slate-900">Reputação</span>
        </nav>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={`https://ui-avatars.com/api/?name=${organizer.name}&background=6366f1&color=fff&size=128`} 
                className="w-24 h-24 rounded-[2.5rem] border-4 border-white shadow-xl object-cover" 
                alt="" 
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                <i className="fa-solid fa-check text-sm"></i>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{organizer.name}</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">{organizer.email} • ID: {organizer.id}</p>
              <div className="flex gap-2 mt-4">
                <Badge variant="success">Parceiro Verificado</Badge>
                <Badge variant="info">Nível {organizer.level}</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none !bg-white">
              <i className="fa-solid fa-envelope mr-2"></i> Notificar
            </Button>
            <Button variant="danger" className="flex-1 md:flex-none">
              <i className="fa-solid fa-ban mr-2"></i> Suspender
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Trust Score Card */}
          <div className="bg-white p-8 rounded-[3rem] border shadow-sm relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="relative w-40 h-40 shrink-0">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                     <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                     <circle className="text-indigo-600" strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (organizer.score / 100) * 251.2} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-slate-900">{organizer.score}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Score</span>
                   </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Saúde da Conta: Excelente</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Este organizador mantém uma taxa de estorno abaixo de 0.1% e possui histórico de eventos com 98% de check-in concluído.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Movimentado</p>
                      <p className="text-lg font-black text-slate-900">R$ {organizer.totalGmv.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Membro Desde</p>
                      <p className="text-lg font-black text-slate-900">Março 2022</p>
                    </div>
                  </div>
                </div>
             </div>
             <i className="fa-solid fa-award absolute -right-10 -bottom-10 text-[15rem] text-slate-50 opacity-50 rotate-12"></i>
          </div>

          {/* Events History */}
          <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Histórico de Eventos</h3>
              <Badge variant="gray">{MOCK_EVENTS.length} Eventos Totais</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-4">
                    <img src={event.banner} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <h4 className="font-bold text-slate-900">{event.name}</h4>
                      <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()} • {event.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">R$ 15.420</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase">Sucesso</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Audit Timeline */}
          <div className="bg-slate-950 rounded-[3rem] p-8 text-slate-300 shadow-2xl">
             <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-8">Dossiê Administrativo</h3>
             <div className="space-y-8 relative">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-800"></div>
                {auditLogs.map((log, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    <div className="text-xs">
                      <p className="text-slate-500 font-bold mb-1">{log.date} • {log.admin}</p>
                      <p className="text-slate-200 leading-relaxed italic">"{log.note}"</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-10 py-3 rounded-2xl border border-slate-800 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition">
               Adicionar Nota Interna
             </button>
          </div>

          {/* Quick Configs */}
          <div className="bg-white rounded-[3rem] p-8 border shadow-sm">
             <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Configurações de Taxa</h3>
             <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Taxa de Serviço Atual</p>
                   <div className="flex justify-between items-end">
                      <p className="text-3xl font-black text-indigo-900">8.5%</p>
                      <button className="text-[10px] font-black text-indigo-600 underline uppercase tracking-tighter mb-1">Ajustar</button>
                   </div>
                   <p className="text-[9px] text-indigo-400 mt-2">Reduzida em 1.5% por ser parceiro Diamante.</p>
                </div>

                <div className="space-y-3 pt-4">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="text-xs font-bold text-slate-600">Liberação Antecipada</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600" />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <span className="text-xs font-bold text-slate-600">Selo de Verificado</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600" />
                  </label>
                </div>
             </div>
          </div>

          {/* Support Info */}
          <div className="bg-amber-50 rounded-[3rem] p-8 border border-amber-100 text-center">
             <i className="fa-solid fa-triangle-exclamation text-3xl text-amber-500 mb-4"></i>
             <h4 className="font-bold text-amber-900 text-sm mb-2">Atenção com Disputas</h4>
             <p className="text-xs text-amber-800 leading-relaxed">
               Este organizador teve 2 disputas abertas nos últimos 30 dias. Ambas foram resolvidas a favor do vendedor.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
