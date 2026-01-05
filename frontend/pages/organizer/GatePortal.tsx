
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const GatePortal: React.FC = () => {
  const { id } = useParams();
  const event = MOCK_EVENTS.find(e => e.id === id) || MOCK_EVENTS[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGate, setSelectedGate] = useState('Portão Principal');
  const [lastScanResult, setLastScanResult] = useState<{status: 'success' | 'error', name: string} | null>(null);
  
  // Mock check-in data
  const [attendees, setAttendees] = useState([
    { id: '1', name: 'João Silva', email: 'joao@email.com', ticket: 'VIP #001', checkedIn: true, time: '18:42', gate: 'Portão Principal' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', ticket: 'Geral #045', checkedIn: false, time: null, gate: null },
    { id: '3', name: 'Ricardo Lemos', email: 'ric@email.com', ticket: 'Geral #046', checkedIn: false, time: null, gate: null },
    { id: '4', name: 'Ana Beatriz', email: 'ana@email.com', ticket: 'VIP #002', checkedIn: true, time: '18:30', gate: 'Entrada VIP' },
    { id: '5', name: 'Paulo Costa', email: 'paulo@email.com', ticket: 'Geral #047', checkedIn: false, time: null, gate: null },
  ]);

  // Limpa o feedback visual após 3 segundos
  useEffect(() => {
    if (lastScanResult) {
      const timer = setTimeout(() => setLastScanResult(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastScanResult]);

  const toggleCheckIn = (id: string) => {
    const attendee = attendees.find(a => a.id === id);
    if (!attendee) return;

    if (!attendee.checkedIn) {
      setLastScanResult({ status: 'success', name: attendee.name });
      setAttendees(prev => prev.map(a => a.id === id ? { 
        ...a, 
        checkedIn: true, 
        time: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        gate: selectedGate
      } : a));
    } else {
      // Se já estava feito, aqui poderia ser um erro ou "desfazer"
      if(confirm(`O participante ${attendee.name} já entrou. Deseja cancelar o check-in?`)) {
        setAttendees(prev => prev.map(a => a.id === id ? { ...a, checkedIn: false, time: null, gate: null } : a));
      }
    }
  };

  const filtered = attendees.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.ticket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = attendees.filter(a => a.checkedIn).length;

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-white">
      {/* Header Portaria (Dark Mode) */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <Link to="/organizador/checkin" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition shadow-inner">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="text-xl font-black tracking-tight">{event.name}</h1>
            <div className="flex items-center gap-3 mt-1">
               <select 
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value)}
                className="bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg outline-none cursor-pointer hover:bg-indigo-500 transition"
               >
                 <option>Portão Principal</option>
                 <option>Entrada VIP</option>
                 <option>Estacionamento</option>
                 <option>Staff/Backstage</option>
               </select>
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistema em Tempo Real</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="text-center">
             <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Ritmo de Entrada</p>
             <p className="text-xl font-black text-indigo-400">12 <span className="text-xs font-medium">pax/min</span></p>
           </div>
           <div className="text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-tighter">Ocupação Atual</p>
             <div className="flex items-center gap-3">
                <p className="text-xl font-black text-white">{checkedInCount} / {attendees.length}</p>
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500" style={{ width: `${(checkedInCount/attendees.length * 100)}%` }}></div>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Search & List Section */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900/50">
          <div className="p-6 border-b border-slate-800">
            <div className="relative group">
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-xl"></i>
              <input 
                type="text" 
                placeholder="Pesquisar por Nome, CPF ou Código do Ingresso..." 
                className="w-full pl-16 pr-6 py-5 bg-slate-800 border-2 border-slate-700 rounded-3xl text-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-white transition-all placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800 scrollbar-hide">
            {filtered.length > 0 ? filtered.map((person) => (
              <div key={person.id} className="p-6 flex items-center justify-between hover:bg-slate-800/40 transition group">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-all shadow-xl ${person.checkedIn ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-white">{person.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{person.ticket}</span>
                       {person.checkedIn && (
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                           <i className="fa-solid fa-clock"></i> Entrou às {person.time} via {person.gate}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleCheckIn(person.id)}
                  className={`
                    px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95
                    ${person.checkedIn 
                      ? 'bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40'}
                  `}
                >
                  {person.checkedIn ? <><i className="fa-solid fa-check mr-2"></i> Liberado</> : 'Confirmar Entrada'}
                </button>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-700">
                <i className="fa-solid fa-user-slash text-6xl mb-4 opacity-10"></i>
                <p className="font-black uppercase tracking-widest">Nenhum resultado para "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Scanner Preview Section */}
        <div className="lg:w-[400px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-8 border-b border-slate-800 relative">
             {/* Scanner Box */}
             <div className="w-full aspect-square bg-black rounded-[3rem] border-2 border-dashed border-slate-700 mb-8 flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
                {lastScanResult ? (
                   <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center animate-in zoom-in duration-300 ${lastScanResult.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      <i className={`fa-solid ${lastScanResult.status === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} text-7xl mb-4`}></i>
                      <h4 className="text-2xl font-black uppercase tracking-tighter">{lastScanResult.status === 'success' ? 'AUTORIZADO' : 'ERRO'}</h4>
                      <p className="font-bold opacity-80 mt-2">{lastScanResult.name}</p>
                   </div>
                ) : (
                  <>
                    <i className="fa-solid fa-camera text-5xl text-slate-800 mb-4"></i>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] px-8 text-center leading-relaxed">Posicione o QR Code no centro da câmera</p>
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-[scan_3s_infinite]"></div>
                  </>
                )}
             </div>
             
             <div className="flex gap-3">
               <Button className="flex-1 !bg-slate-800 hover:!bg-slate-700 !border-0 font-black text-[10px] uppercase tracking-widest"><i className="fa-solid fa-bolt mr-2 text-indigo-400"></i> Lanterna</Button>
               <Button className="flex-1 !bg-slate-800 hover:!bg-slate-700 !border-0 font-black text-[10px] uppercase tracking-widest"><i className="fa-solid fa-camera-rotate mr-2 text-indigo-400"></i> Trocar</Button>
             </div>
          </div>

          <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
            <h3 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.3em] mb-8">Fluxo Recente</h3>
            <div className="space-y-6">
              {attendees.filter(a => a.checkedIn).reverse().slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center justify-between animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <div>
                      <p className="text-sm font-black text-white">{a.name}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase">{a.gate}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-8 bg-slate-950 border-t border-slate-800">
             <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black text-slate-500 uppercase">Status Global</p>
                <Badge variant="success" className="!bg-emerald-500/10 !text-emerald-500 !border-emerald-500/20">Sincronizado</Badge>
             </div>
             <p className="text-[10px] text-slate-600 leading-relaxed italic">
               Dica: Use o atalho **[ESPAÇO]** para abrir a busca rápida durante a operação.
             </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0.2; }
          50% { top: 90%; opacity: 1; }
          100% { top: 10%; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};
