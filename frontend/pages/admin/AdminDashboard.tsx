
import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_EVENTS } from '../../constants';

export const AdminDashboard: React.FC = () => {
  const kpis = [
    { label: 'GMV Global (Mês)', value: 'R$ 845.200,00', icon: 'fa-cart-shopping', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Receita Evelou', value: 'R$ 84.520,00', icon: 'fa-vault', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Eventos Ativos', value: '254', icon: 'fa-calendar-check', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Novos Organizadores', value: '18', icon: 'fa-building-circle-check', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const pendingModeration = [
    { id: '1', title: 'Rave no Deserto 2024', org: 'Techno Records', date: '22/08', status: 'pending' },
    { id: '2', title: 'Workshop UI/UX Pro', label: 'Tech Academy', date: '25/08', status: 'pending' },
    { id: '3', title: 'Palestra: Futuro da IA', label: 'Evelou Edu', date: '30/08', status: 'pending' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard Global</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase font-black tracking-widest">Monitoramento Geral da Plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="!bg-white shadow-sm">
            <i className="fa-solid fa-download mr-2"></i> Relatório Executivo
          </Button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-md transition group">
            <div className={`w-14 h-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition duration-300`}>
              <i className={`fa-solid ${kpi.icon}`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Activity Simulation */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Volume de Transações (24h)</h3>
              <div className="flex gap-2">
                <Badge variant="success">Alta Performance</Badge>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-3 px-2">
              {[40, 60, 45, 90, 65, 80, 55, 70, 85, 40, 30, 95].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                   <div 
                    className="w-full bg-slate-100 rounded-t-xl transition-all duration-700 group-hover:bg-indigo-500 relative" 
                    style={{ height: `${v}%` }}
                   >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold">
                        {v} vds
                     </div>
                   </div>
                   <span className="text-[9px] font-black text-slate-300 mt-3">{i*2}h</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Ações de Segurança Recentes</h3>
              <button className="text-xs font-black text-indigo-600 uppercase hover:underline">Ver Logs</button>
            </div>
            <div className="divide-y">
               {[
                 { action: 'Saque Aprovado', target: 'Org: Festa Mix', val: 'R$ 1.200', user: 'Admin 01', time: 'Há 10 min' },
                 { action: 'Evento Suspenso', target: 'Sorteio Ilegal iPhone', val: '-', user: 'Sistema (IA)', time: 'Há 25 min' },
                 { action: 'Troca de Senha', target: 'Usuário ID #992', val: '-', user: 'Admin 02', time: 'Há 1h' },
               ].map((log, i) => (
                 <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <i className={`fa-solid ${log.action.includes('Aprovado') ? 'fa-check text-emerald-500' : 'fa-triangle-exclamation text-amber-500'}`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{log.action}: {log.target}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Realizado por {log.user}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">{log.time}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{log.val}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-xl font-black mb-2 leading-tight">Fila de Moderação</h3>
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-6">{pendingModeration.length} eventos pendentes</p>
                
                <div className="space-y-4">
                  {pendingModeration.map(item => (
                    <div key={item.id} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-sm truncate pr-2">{item.title}</h4>
                         <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded uppercase">{item.date}</span>
                      </div>
                      <p className="text-[10px] text-indigo-200 uppercase font-black tracking-tighter mb-4">Org: {item.org || 'Parceiro'}</p>
                      <div className="flex gap-2">
                         <button className="flex-1 bg-white text-indigo-900 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-indigo-50 transition">Aprovar</button>
                         <button className="flex-1 bg-red-500/20 text-red-200 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-red-500/40 transition">Negar</button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="w-full mt-6 !text-indigo-200 !border-indigo-800 hover:!bg-white/5 border">Ver Todos na Fila</Button>
             </div>
             <i className="fa-solid fa-shield-heart absolute -right-6 -bottom-6 text-9xl text-white opacity-5 rotate-12"></i>
          </div>

          <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6">Suporte da Plataforma</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                     <span className="text-xs font-bold text-slate-700">6 Tickets Urgentes</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                     <span className="text-xs font-bold text-slate-700">12 Novos Tickets</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
               </div>
            </div>
            <Button variant="outline" className="w-full mt-6" size="sm">Abrir Central SAC</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
