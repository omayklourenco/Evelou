
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CATEGORIES, MOCK_EVENTS } from '../../constants';
import { TicketType } from '../../types';

export const EditEvent: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // No mundo real, buscaríamos da API. Aqui pegamos do mock.
  const eventData = MOCK_EVENTS.find(e => e.id === id) || MOCK_EVENTS[0];

  // State for tickets management
  const [tickets, setTickets] = useState<TicketType[]>(eventData.tickets);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);

  // Modal Form State
  const [ticketForm, setTicketForm] = useState({
    name: '',
    price: 0,
    quantity: 0
  });

  const steps = [
    { number: 1, title: 'Dados Básicos' },
    { number: 2, title: 'Ingressos' },
    { number: 3, title: 'Revisão' },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Evento e lotes atualizados com sucesso!');
      navigate(`/organizador/eventos/${id}`);
    }, 1500);
  };

  const openTicketModal = (ticket?: TicketType) => {
    if (ticket) {
      setEditingTicket(ticket);
      setTicketForm({
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity
      });
    } else {
      setEditingTicket(null);
      setTicketForm({ name: '', price: 0, quantity: 0 });
    }
    setIsTicketModalOpen(true);
  };

  const handleSaveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicket) {
      setTickets(prev => prev.map(t => t.id === editingTicket.id ? { 
        ...t, 
        name: ticketForm.name, 
        price: ticketForm.price, 
        quantity: ticketForm.quantity,
        available: ticketForm.quantity // Simplificação: assume que todos estão disponíveis ao editar quantidade total
      } : t));
    } else {
      const newTicket: TicketType = {
        id: Math.random().toString(36).substr(2, 9),
        name: ticketForm.name,
        price: ticketForm.price,
        quantity: ticketForm.quantity,
        available: ticketForm.quantity
      };
      setTickets(prev => [...prev, newTicket]);
    }
    setIsTicketModalOpen(false);
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm('Tem certeza que deseja remover este lote? Vendas já realizadas podem ser afetadas.')) {
      setTickets(prev => prev.filter(t => t.id !== ticketId));
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400";
  const labelClasses = "text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center text-left">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Evento</h1>
            <p className="text-gray-500">Editando: <span className="font-semibold text-indigo-600">{eventData.name}</span></p>
          </div>
          <Link to={`/organizador/eventos/${id}`}>
            <button className="text-gray-400 hover:text-gray-600 font-bold text-sm">Cancelar</button>
          </Link>
        </div>

        {/* Stepper Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0 -translate-y-1/2"></div>
            {steps.map((s) => (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= s.number ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-2 text-gray-400'
                }`}>
                  {step > s.number ? <i className="fa-solid fa-check"></i> : s.number}
                </div>
                <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${step === s.number ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-white rounded-3xl border shadow-xl p-8 md:p-12 text-left">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-gray-900">Informações Gerais</h2>
              
              {/* Media Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                   <label className={labelClasses}>Imagem de Destaque (1:1)</label>
                   <div className="mt-2 relative aspect-square border-2 border-indigo-100 rounded-3xl overflow-hidden group">
                      <img src={`https://picsum.photos/seed/highlight${id}/400/400`} className="w-full h-full object-cover" alt="Destaque" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="sm" variant="secondary" className="!rounded-xl">Alterar</Button>
                      </div>
                   </div>
                   <p className="mt-2 text-[10px] text-gray-400 font-bold italic">Ideal: 800x800px</p>
                </div>
                <div className="md:col-span-2">
                   <label className={labelClasses}>Imagem de Capa (Banner)</label>
                   <div className="mt-2 relative aspect-[21/9] border-2 border-indigo-100 rounded-3xl overflow-hidden group">
                      <img src={eventData.banner} className="w-full h-full object-cover" alt="Banner" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="sm" variant="secondary" className="!rounded-xl">Alterar Capa</Button>
                      </div>
                   </div>
                   <p className="mt-2 text-[10px] text-gray-400 font-bold italic">Ideal: 1920x820px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClasses}>Nome do Evento</label>
                  <input 
                    type="text" 
                    defaultValue={eventData.name}
                    className={inputClasses} 
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Categoria</label>
                  <select defaultValue={eventData.category} className={inputClasses}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Data</label>
                  <input 
                    type="date" 
                    defaultValue={eventData.date}
                    className={inputClasses} 
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClasses}>Local ou Link</label>
                  <input 
                    type="text" 
                    defaultValue={eventData.location}
                    className={inputClasses} 
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClasses}>Descrição Detalhada</label>
                  <textarea 
                    rows={6} 
                    defaultValue={eventData.description}
                    className={inputClasses}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Gerenciar Lotes</h2>
                <Button size="sm" variant="outline" onClick={() => openTicketModal()}>
                  <i className="fa-solid fa-plus mr-2"></i> Adicionar Lote
                </Button>
              </div>
              
              <div className="space-y-4">
                {tickets.length > 0 ? tickets.map((ticket) => (
                  <div key={ticket.id} className="p-6 border border-gray-200 rounded-2xl flex justify-between items-center bg-white shadow-sm hover:border-indigo-200 transition group">
                    <div>
                      <h4 className="font-bold text-gray-900">{ticket.name}</h4>
                      <p className="text-sm text-gray-500">
                        {ticket.price === 0 ? <span className="text-emerald-600 font-bold">Grátis</span> : `R$ ${ticket.price.toFixed(2)}`} • {ticket.quantity} unidades totais
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openTicketModal(ticket)}
                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center border"
                      >
                        <i className="fa-solid fa-pen text-sm"></i>
                      </button>
                      <button 
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center border"
                      >
                        <i className="fa-solid fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">Nenhum lote configurado. Adicione um para começar a vender.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-2xl font-bold text-gray-900">Revisar Alterações</h2>
              
              <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                <img src={eventData.banner} className="w-full h-48 object-cover" alt="" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{eventData.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-2"><i className="fa-regular fa-calendar text-indigo-500"></i> {new Date(eventData.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><i className="fa-solid fa-location-dot text-indigo-500"></i> {eventData.location}</span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumo de Ingressos</p>
                    {tickets.map(t => (
                      <div key={t.id} className="flex justify-between items-center py-2 border-b last:border-0">
                         <span className="text-sm font-bold text-gray-700">{t.name}</span>
                         <span className="text-sm font-black text-indigo-600">{t.price === 0 ? 'Grátis' : `R$ ${t.price.toFixed(2)}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
                <i className="fa-solid fa-circle-info text-amber-500 mt-1"></i>
                <div>
                  <h4 className="font-bold text-amber-900">Confirmação de Atualização</h4>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Ao salvar, as novas regras de ingressos e informações do evento entrarão em vigor imediatamente na página de vendas pública.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 pt-8 border-t flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setStep(s => s - 1)} 
              disabled={step === 1}
            >
              Anterior
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)}>Próximo Passo</Button>
            ) : (
              <Button isLoading={loading} onClick={handleSave}>Salvar Alterações</Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add/Edit Ticket */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title={editingTicket ? "Editar Lote" : "Novo Lote de Ingressos"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsTicketModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTicket}>{editingTicket ? "Atualizar Lote" : "Criar Lote"}</Button>
          </>
        }
      >
        <form className="space-y-6 text-left" onSubmit={handleSaveTicket}>
          <div>
            <label className={labelClasses}>Nome do Lote</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Lote 1 - Promocional"
              className={inputClasses}
              value={ticketForm.name}
              onChange={e => setTicketForm({...ticketForm, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Preço (R$)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className={`${inputClasses} pl-12`}
                  value={ticketForm.price}
                  onChange={e => setTicketForm({...ticketForm, price: parseFloat(e.target.value)})}
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-400 font-medium">Use 0 para ingressos gratuitos.</p>
            </div>
            <div>
              <label className={labelClasses}>Quantidade Total</label>
              <input 
                type="number" 
                required
                placeholder="Ex: 100"
                className={inputClasses}
                value={ticketForm.quantity}
                onChange={e => setTicketForm({...ticketForm, quantity: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
             <p className="text-[10px] text-indigo-800 font-bold uppercase leading-tight">
               Dica: Se você diminuir a quantidade total para um valor menor do que o já vendido, as vendas serão interrompidas automaticamente.
             </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};
