
import React, { useState } from 'react';
import { MOCK_PURCHASED_TICKETS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TicketStatus, PurchasedTicket } from '../../types';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export const MyTickets: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdParam = searchParams.get('pedido');

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'valid' | 'used'>('valid');
  const [searchTerm, setSearchTerm] = useState('');

  const tickets = MOCK_PURCHASED_TICKETS.filter(t => {
    // Filtro por ID do Pedido (Vindo da URL)
    const matchesOrder = !orderIdParam || t.orderId === orderIdParam;
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'valid' && t.status === TicketStatus.VALID) || 
                         (filter === 'used' && t.status === TicketStatus.USED);
    
    const matchesSearch = t.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesOrder && matchesFilter && matchesSearch;
  });

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Solicitação de transferência enviada! O destinatário receberá um e-mail para aceitar o ingresso.');
    setIsTransferModalOpen(false);
  };

  const clearOrderFilter = () => {
    searchParams.delete('pedido');
    setSearchParams(searchParams);
  };

  return (
    <div className="text-left animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meus Ingressos</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie suas experiências e prepare-se para os eventos.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
             <input 
              type="text" 
              placeholder="Buscar ingresso..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-48 lg:w-64"
             />
           </div>
        </div>
      </header>

      {/* active order filter indicator */}
      {orderIdParam && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">
                <i className="fa-solid fa-filter"></i>
             </div>
             <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase">Mostrando ingressos do pedido</p>
                <p className="text-xs font-bold text-indigo-900">#{orderIdParam}</p>
             </div>
          </div>
          <button 
            onClick={clearOrderFilter}
            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
          >
            Ver todos ingressos
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-gray-200/50 rounded-2xl w-fit">
        {[
          { id: 'valid', label: 'Próximos' },
          { id: 'used', label: 'Histórico' },
          { id: 'all', label: 'Todos' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickets.length > 0 ? tickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className="bg-white rounded-[2rem] border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row group"
          >
            {/* Ticket Left Section */}
            <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-dashed border-gray-200 relative">
              {/* Decorative Half Circles for the "Tear" look */}
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border shadow-inner"></div>
              
              <div className="flex justify-between items-start mb-4">
                <Badge variant={ticket.status === TicketStatus.VALID ? 'success' : 'gray'}>
                  {ticket.status === TicketStatus.VALID ? 'Válido' : 'Utilizado'}
                </Badge>
                <span className="text-[10px] font-black text-gray-300 tracking-widest uppercase">{ticket.id}</span>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
                {ticket.eventName}
              </h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <i className="fa-regular fa-calendar-check text-indigo-500 w-4"></i>
                  {new Date(ticket.eventDate).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <i className="fa-solid fa-location-dot text-indigo-500 w-4"></i>
                  {ticket.eventLocation}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-900 font-bold mt-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  {ticket.ticketName} • {ticket.buyerName}
                </div>
              </div>
            </div>
            
            {/* Ticket Right Section (Actions/QR Trigger) */}
            <div className="w-full md:w-48 bg-gray-50/50 p-6 flex flex-col justify-center items-center gap-4">
              <button 
                onClick={() => navigate(`/ingresso/${ticket.id}`)}
                className="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center text-indigo-600 hover:border-indigo-600 hover:scale-105 transition-all shadow-sm"
              >
                <i className="fa-solid fa-qrcode text-3xl"></i>
              </button>
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ações</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsTransferModalOpen(true)}
                    title="Transferir Ingresso"
                    className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition"
                  >
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                  </button>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.eventLocation)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver no Mapa"
                    className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition"
                  >
                    <i className="fa-solid fa-route text-xs"></i>
                  </a>
                  <Link 
                    to="/ajuda"
                    title="Ajuda"
                    className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition"
                  >
                    <i className="fa-solid fa-circle-question text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed text-center flex flex-col items-center animate-in fade-in zoom-in-95">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6 text-4xl">
               <i className="fa-solid fa-ticket-simple"></i>
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Sua estante de experiências está vazia</h3>
             <p className="text-gray-500 text-sm max-w-xs mb-8 leading-relaxed font-medium">
               Você ainda não possui ingressos {filter === 'valid' ? 'ativos' : 'nesta categoria'}. Que tal descobrir algo novo hoje?
             </p>
             <Link to="/eventos">
               <Button>Explorar Próximos Eventos</Button>
             </Link>
          </div>
        )}
      </div>

      {/* Modal: Transferir Ingresso */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Transferir Ingresso"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsTransferModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleTransfer}>Confirmar Transferência</Button>
          </>
        }
      >
        <div className="space-y-6 text-left">
          <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
            <i className="fa-solid fa-circle-info text-indigo-600 mt-1"></i>
            <p className="text-xs text-indigo-800 leading-relaxed">
              O destinatário receberá um convite por e-mail. O ingresso só sairá da sua conta quando ele aceitar a transferência.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">E-mail do novo titular</label>
              <input 
                type="email" 
                placeholder="amigo@exemplo.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Confirmar E-mail</label>
              <input 
                type="email" 
                placeholder="amigo@exemplo.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
          </form>

          <div className="pt-4 border-t">
            <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-tighter">
              Atenção: Esta ação não pode ser desfeita após o aceite.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
