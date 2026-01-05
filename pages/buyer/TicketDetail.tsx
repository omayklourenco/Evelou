
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PURCHASED_TICKETS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const TicketDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = MOCK_PURCHASED_TICKETS.find(t => t.id === id);

  const handleAddToCalendar = () => {
    if (!ticket) return;
    const title = ticket.eventName;
    const dateStr = ticket.eventDate.replace(/-/g, '');
    const details = `Ingresso Evelou: ${ticket.ticketName} - Código: ${ticket.id}`;
    const location = ticket.eventLocation;
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dateStr}T180000Z/${dateStr}T230000Z&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    window.open(googleUrl, '_blank');
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Ingresso não encontrado</h2>
          <Button onClick={() => navigate('/meus-ingressos')}>Voltar para Meus Ingressos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-500">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/meus-ingressos')}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-indigo-600 transition border"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Ingresso Digital</h1>
          <button 
            onClick={handleAddToCalendar}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition border"
            title="Sincronizar com Agenda"
          >
            <i className="fa-regular fa-calendar-plus"></i>
          </button>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-gray-100 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-indigo-600 rounded-b-xl"></div>
          
          <div className="p-8 md:p-10 text-center space-y-8">
            <div>
              <Badge variant="success" className="mb-4">Ingresso Válido</Badge>
              <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{ticket.eventName}</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{ticket.ticketName}</p>
            </div>

            <div className="relative inline-block mx-auto group">
              <div className="p-6 bg-white border-4 border-slate-900 rounded-[2.5rem] shadow-xl relative z-10">
                <div className="w-64 h-64 bg-white flex items-center justify-center">
                  <i className="fa-solid fa-qrcode text-[240px] text-slate-900"></i>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-100 rounded-full -z-0 animate-pulse"></div>
            </div>

            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Apresente este código na entrada</p>

            <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 text-left space-y-4 font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Data do Evento</p>
                  <p className="text-xs font-bold text-gray-800">{new Date(ticket.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Código</p>
                  <p className="text-xs font-mono font-bold text-slate-900">{ticket.id}</p>
                </div>
              </div>
              <hr className="border-gray-200 border-dashed" />
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Titular</p>
                <p className="text-sm font-bold text-gray-800">{ticket.buyerName}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Localização</p>
                <p className="text-xs text-gray-600 leading-relaxed">{ticket.eventLocation}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between px-0 absolute bottom-32 w-full">
            <div className="w-8 h-8 bg-gray-50 rounded-full -ml-4 border-r shadow-inner"></div>
            <div className="flex-1 border-t-2 border-dashed border-gray-100 mt-4 mx-2"></div>
            <div className="w-8 h-8 bg-gray-50 rounded-full -mr-4 border-l shadow-inner"></div>
          </div>

          <div className="p-8 pt-4 space-y-3">
             <Button variant="primary" className="w-full !py-4 rounded-2xl shadow-xl shadow-indigo-100">
                <i className="fa-solid fa-file-pdf mr-2"></i> Baixar Ingresso (PDF)
             </Button>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleAddToCalendar}
                  className="flex items-center justify-center gap-2 py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition shadow-sm border border-indigo-100"
                >
                   <i className="fa-solid fa-calendar-check text-lg"></i> Agenda
                </button>
                <button className="flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition shadow-lg">
                   <i className="fa-brands fa-apple text-lg"></i> Wallet
                </button>
             </div>
          </div>
        </div>

        <div className="mt-10 text-center space-y-4 pb-10">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-8 leading-relaxed">
             Dificuldades no acesso? Procure a equipe de suporte da Evelou no local do evento.
           </p>
           <Link to="/ajuda" className="text-indigo-600 font-black text-xs uppercase hover:underline">
             Central de Ajuda & Suporte
           </Link>
        </div>
      </div>
    </div>
  );
};
