
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../constants';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/useCartStore';

export const EventDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const event = MOCK_EVENTS.find(e => e.slug === slug);
  const { setEvent, addItem } = useCartStore();

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Evento não encontrado</h2>
          <Button onClick={() => navigate('/eventos')}>Voltar para eventos</Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const shareData = {
      title: event.name,
      text: `Confira este evento na Evelou: ${event.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Erro ao compartilhar:', err));
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Link do evento copiado para a área de transferência!');
    }
  };

  const handleQtyChange = (ticketId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta)
    }));
  };

  const handleCheckout = () => {
    setEvent(event);
    (Object.entries(quantities) as [string, number][]).forEach(([ticketId, qty]) => {
      if (qty > 0) {
        const ticket = event.tickets.find(t => t.id === ticketId);
        if (ticket) addItem(ticket, qty);
      }
    });
    navigate('/checkout');
  };

  const totalSelected = (Object.values(quantities) as number[]).reduce((acc: number, q: number) => acc + q, 0);

  return (
    <div className="pb-20 text-left bg-gray-50/50">
      {/* Banner Superior (Estético) */}
      <div className="relative h-[250px] md:h-[350px]">
        <img src={event.banner} className="w-full h-full object-cover" alt={event.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 via-black/20 to-black/40"></div>
        <div className="absolute top-6 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button 
              onClick={() => navigate(-1)}
              className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-2xl transition-all border border-white/20"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Coluna de Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
              
              {/* Foto de Destaque 100% (Flyer) */}
              <div className="w-full bg-gray-100">
                <img 
                  src={event.thumbnail} 
                  alt="Flyer do Evento" 
                  className="w-full h-auto block"
                />
              </div>

              {/* Informações Estruturadas do Evento */}
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-10 border-b border-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                        {event.category}
                      </span>
                      <button 
                        onClick={handleShare}
                        className="bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors px-4 py-1.5 rounded-xl text-[10px] flex items-center gap-2 font-black uppercase tracking-widest border border-gray-200"
                      >
                        <i className="fa-solid fa-share-nodes"></i>
                        Compartilhar
                      </button>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6">{event.name}</h1>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-lg border border-indigo-100">
                          <i className="fa-regular fa-calendar"></i>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quando</p>
                          <p className="font-bold text-gray-700">{new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
                          <p className="text-sm text-gray-500">Início às {event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-lg border border-emerald-100">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Onde</p>
                          <p className="font-bold text-gray-700 line-clamp-1">{event.location}</p>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-indigo-600 font-bold hover:underline"
                          >
                            Ver no mapa
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-10">
                   <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl font-black text-xs border border-amber-100">
                      <i className="fa-solid fa-star"></i>
                      {event.rating} • {event.reviewsCount} avaliações
                   </div>
                   <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                      <i className="fa-solid fa-shield-check text-lg"></i>
                      Organizador Verificado
                   </div>
                </div>

                <h2 className="text-2xl font-black mb-6 text-gray-900 tracking-tight flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-indigo-600 rounded-full"></span>
                  Sobre este evento
                </h2>
                <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed font-medium text-lg">
                  {event.description.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Perfil do Organizador */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group">
              <div className="relative shrink-0 transition-transform group-hover:scale-105 duration-500">
                <img 
                  src={`https://ui-avatars.com/api/?name=${event.organizerName}&background=6366f1&color=fff&size=200`} 
                  className="w-24 h-24 rounded-[2.5rem] border-4 border-white shadow-2xl"
                  alt=""
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
                   <i className="fa-solid fa-crown text-[10px]"></i>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Realização</p>
                <h3 className="font-black text-3xl text-gray-900 tracking-tight mb-2">{event.organizerName}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Link to={`/organizador-perfil/${event.organizerId}`} className="text-indigo-600 font-black text-xs uppercase hover:underline flex items-center gap-2">
                    Ver perfil completo da produtora <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <Button variant="outline" className="shrink-0 !rounded-2xl !border-indigo-100 hover:!bg-indigo-50 !px-8">Seguir</Button>
            </div>
          </div>

          {/* Lateral de Seleção de Ingressos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black tracking-tight">Ingressos</h3>
                  <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-80">Venda Oficial Evelou</p>
                </div>
                <i className="fa-solid fa-ticket absolute -right-6 -top-6 text-8xl text-white/10 rotate-12"></i>
              </div>
              
              <div className="p-8 space-y-6">
                {event.tickets.map((ticket) => (
                  <div key={ticket.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-gray-900 text-lg leading-tight">{ticket.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${ticket.available < 20 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            {ticket.available < 20 ? `Últimas ${ticket.available} unidades` : `${ticket.available} disponíveis`}
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-indigo-600 text-xl">
                        {ticket.price === 0 ? <span className="text-emerald-500 uppercase text-sm tracking-widest">Grátis</span> : `R$ ${ticket.price.toFixed(2)}`}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 rounded-2xl overflow-hidden p-1.5 border border-gray-100">
                        <button 
                          onClick={() => handleQtyChange(ticket.id, -1)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white hover:bg-rose-50 hover:text-rose-600 text-gray-500 transition shadow-sm active:scale-90"
                        >
                          <i className="fa-solid fa-minus text-[10px]"></i>
                        </button>
                        <span className="px-6 text-lg font-black w-14 text-center text-gray-900">
                          {quantities[ticket.id] || 0}
                        </span>
                        <button 
                          onClick={() => handleQtyChange(ticket.id, 1)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white hover:bg-emerald-50 hover:text-emerald-600 text-gray-500 transition shadow-sm active:scale-90"
                          disabled={(quantities[ticket.id] || 0) >= ticket.available}
                        >
                          <i className="fa-solid fa-plus text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6">
                  <Button 
                    className="w-full !py-6 shadow-2xl shadow-indigo-200 !rounded-[2rem] text-lg font-black uppercase tracking-widest" 
                    size="lg" 
                    disabled={totalSelected === 0}
                    onClick={handleCheckout}
                  >
                    {totalSelected === 0 ? 'Selecione Ingressos' : `Comprar Agora (${totalSelected})`}
                  </Button>
                  
                  <div className="mt-8 pt-8 border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] text-center mb-4">Pagamento Seguro</p>
                    <div className="flex items-center justify-center gap-6 grayscale opacity-40">
                      <i className="fa-brands fa-cc-visa text-2xl"></i>
                      <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                      <i className="fa-solid fa-bolt text-xl" title="PIX"></i>
                      <i className="fa-solid fa-barcode text-xl" title="Boleto"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
