
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_EVENTS, CATEGORIES } from '../constants';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useWishlistStore } from '../stores/useWishlistStore';

export const ExploreEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'online' | 'presencial'>('all');
  const { toggleFavorite, isFavorite } = useWishlistStore();

  // Lógica de filtragem aprimorada: Nome, Organizador e Localização
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        event.name.toLowerCase().includes(searchLower) || 
        event.organizerName.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === 'Todas' || event.category === selectedCategory;
      
      const isFree = event.tickets.some(t => t.price === 0);
      const matchesPrice = priceFilter === 'all' || 
                          (priceFilter === 'free' && isFree) || 
                          (priceFilter === 'paid' && !isFree);
      
      const matchesFormat = formatFilter === 'all' || 
                           (formatFilter === 'online' && event.isOnline) || 
                           (formatFilter === 'presencial' && !event.isOnline);

      return matchesSearch && matchesCategory && matchesPrice && matchesFormat;
    });
  }, [searchTerm, selectedCategory, priceFilter, formatFilter]);

  const handleShare = (e: React.MouseEvent, event: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: event.name,
      text: `Confira este evento na Evelou: ${event.name}`,
      url: `${window.location.origin}/#/evento/${event.slug}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Erro ao compartilhar:', err));
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Link do evento copiado para a área de transferência!');
    }
  };

  const filterButtonClasses = (isActive: boolean) => `
    px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2
    ${isActive 
      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
      : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'}
  `;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header / Search Area */}
      <section className="bg-white border-b pt-12 pb-8 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-left">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Explorar Eventos</h1>
              <p className="text-gray-500 mt-2 font-medium">Descubra as melhores experiências perto de você.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Evento, organizador ou cidade..." 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mt-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {['Todas', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={filterButtonClasses(selectedCategory === cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="lg:w-64 shrink-0 space-y-8 text-left">
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Investimento</h3>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'free', label: 'Gratuitos' },
                  { id: 'paid', label: 'Pagos' }
                ].map(p => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceFilter === p.id}
                      onChange={() => setPriceFilter(p.id as any)}
                      className="w-5 h-5 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-bold transition ${priceFilter === p.id ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Local / Formato</h3>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'Qualquer formato' },
                  { id: 'presencial', label: 'Presencial' },
                  { id: 'online', label: 'Online / Streaming' }
                ].map(f => (
                  <label key={f.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="format" 
                      checked={formatFilter === f.id}
                      onChange={() => setFormatFilter(f.id as any)}
                      className="w-5 h-5 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-bold transition ${formatFilter === f.id ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                      {f.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 bg-indigo-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-indigo-100">
               <h4 className="font-black text-sm mb-2 relative z-10">Crie seu Evento</h4>
               <p className="text-[10px] text-indigo-200 leading-relaxed mb-4 relative z-10">Transforme sua ideia em experiência real com a Evelou.</p>
               <Link to="/organizador/eventos/novo">
                <Button variant="secondary" size="sm" className="w-full !py-2.5 !text-[10px] uppercase font-black relative z-10">Começar Agora</Button>
               </Link>
               <i className="fa-solid fa-rocket absolute -right-4 -bottom-4 text-6xl text-white/10 rotate-12"></i>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
               <p className="text-sm font-bold text-gray-500">
                 Mostrando <span className="text-indigo-600">{filteredEvents.length}</span> eventos encontrados
               </p>
               <select className="bg-transparent text-xs font-bold text-gray-500 outline-none cursor-pointer">
                 <option>Mais Relevantes</option>
                 <option>Data (Mais Próximos)</option>
                 <option>Preço (Menor p/ Maior)</option>
               </select>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col sm:flex-row relative"
                  >
                    {/* Action Buttons (Fav & Share) */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleFavorite(event.id); }}
                        title="Favoritar"
                        className={`w-9 h-9 rounded-xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center transition-all active:scale-75 ${isFavorite(event.id) ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}
                      >
                        <i className={`fa-solid fa-heart ${isFavorite(event.id) ? 'animate-pulse' : ''}`}></i>
                      </button>
                      <button 
                        onClick={(e) => handleShare(e, event)}
                        title="Compartilhar"
                        className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all active:scale-75"
                      >
                        <i className="fa-solid fa-share-nodes text-xs"></i>
                      </button>
                    </div>

                    <Link to={`/evento/${event.slug}`} className="contents">
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden shrink-0">
                        <img 
                          src={event.thumbnail} 
                          alt={event.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-1 text-left">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                               {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {event.time}
                             </p>
                          </div>
                          <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {event.name}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-4 font-medium">
                            <i className="fa-solid fa-location-dot text-indigo-400"></i> {event.location}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">A partir de</span>
                             <span className="text-lg font-black text-gray-900">
                               {event.tickets[0].price === 0 ? (
                                 <span className="text-emerald-600">Grátis</span>
                               ) : (
                                 `R$ ${event.tickets[0].price.toFixed(2)}`
                               )}
                             </span>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <i className="fa-solid fa-arrow-right"></i>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 text-center flex flex-col items-center animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6 text-3xl">
                  <i className="fa-solid fa-calendar-xmark"></i>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Nenhum evento por aqui... ainda!</h3>
                <p className="text-gray-500 text-sm max-w-xs mb-8 leading-relaxed font-medium">
                  Não encontramos eventos com esses filtros. Tente ajustar sua busca ou limpar as categorias.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Todas');
                    setPriceFilter('all');
                    setFormatFilter('all');
                  }}
                >
                  Limpar todos os filtros
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
