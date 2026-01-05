
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_EVENTS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Event } from '../../types';

export const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.organizerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(e => e.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedEvents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="animate-in fade-in duration-500 text-left">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Eventos na Plataforma</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase font-black tracking-widest">Controle de Qualidade e Moderação</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              type="text" 
              placeholder="Buscar por Evento ou Org..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </header>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {[
           { label: 'Eventos Ativos', val: '254', color: 'text-emerald-600', icon: 'fa-globe' },
           { label: 'Aguardando Aprovação', val: '12', color: 'text-amber-600', icon: 'fa-hourglass-half' },
           { label: 'Denúncias Graves', val: '3', color: 'text-red-600', icon: 'fa-triangle-exclamation' },
           { label: 'GMV Estimado', val: 'R$ 1.2M', color: 'text-indigo-600', icon: 'fa-chart-line' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-5 rounded-3xl border shadow-sm border-slate-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-slate-50 ${stat.color} flex items-center justify-center text-xl`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-xl font-black text-slate-900 leading-tight">{stat.val}</h4>
              </div>
           </div>
         ))}
      </div>

      {/* Bulk Actions Bar */}
      {selectedEvents.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-600 rounded-2xl flex items-center justify-between text-white shadow-xl shadow-indigo-200 animate-in slide-in-from-top-4 duration-300">
           <div className="flex items-center gap-4">
             <span className="text-sm font-black uppercase tracking-widest">{selectedEvents.length} selecionados</span>
             <div className="h-6 w-px bg-white/20"></div>
           </div>
           <div className="flex gap-2">
             <Button variant="ghost" size="sm" className="!text-white hover:!bg-white/10 border border-white/20">
               <i className="fa-solid fa-star mr-2"></i> Destacar Todos
             </Button>
             <Button variant="ghost" size="sm" className="!text-white hover:!bg-white/10 border border-white/20">
               <i className="fa-solid fa-ban mr-2"></i> Suspender Seleção
             </Button>
             <button onClick={() => setSelectedEvents([])} className="ml-4 text-xs font-bold hover:underline">Cancelar</button>
           </div>
        </div>
      )}

      {/* Table Content */}
      <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-8 py-5 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                  />
                </th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evento & Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organizador</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vendas</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredEvents.length > 0 ? filteredEvents.map(event => (
                <tr key={event.id} className={`hover:bg-slate-50/80 transition group ${selectedEvents.includes(event.id) ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-8 py-5">
                    <input 
                      type="checkbox" 
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => toggleSelectOne(event.id)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                    />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img src={event.banner} className="w-14 h-14 rounded-2xl object-cover border shadow-sm" alt="" />
                        {Math.random() > 0.7 && (
                          <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-white rounded-full flex items-center justify-center border-2 border-white animate-pulse" title="Alta tração de vendas">
                            <i className="fa-solid fa-fire text-[10px]"></i>
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition">{event.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Score:</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <div key={s} className={`w-2.5 h-1 rounded-full ${s <= 4 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <p className="font-bold text-slate-700">{event.organizerName}</p>
                      <Link to={`/admin/organizador/${event.organizerId}/reputacao`} className="text-[10px] font-black text-indigo-500 hover:underline uppercase tracking-tighter w-fit">Ver Reputação</Link>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <p className="font-black text-slate-900">R$ {(Math.random() * 50000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                    <p className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block uppercase tracking-tighter">Repasse Ativo</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Badge variant={event.status === 'published' ? 'success' : 'gray'}>
                      {event.status === 'published' ? 'Online' : event.status === 'draft' ? 'Rascunho' : 'Cancelado'}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => navigate(`/admin/eventos/${event.id}/auditoria`)}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition shadow-sm" 
                        title="Auditar Evento"
                      >
                         <i className="fa-solid fa-magnifying-glass-chart text-xs"></i>
                       </button>
                       <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition shadow-sm" title="Suspender">
                         <i className="fa-solid fa-ban text-xs"></i>
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <i className="fa-solid fa-calendar-xmark text-4xl mb-4"></i>
                      <p className="font-bold">Nenhum evento encontrado para esta busca.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
