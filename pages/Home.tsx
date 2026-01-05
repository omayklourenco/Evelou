
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_EVENTS, CATEGORIES } from '../constants';
import { Button } from '../components/ui/Button';
import { useWishlistStore } from '../stores/useWishlistStore';

export const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toggleFavorite, isFavorite } = useWishlistStore();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-indigo-900 h-[600px] flex items-center overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/hero/1920/1080" className="w-full h-full object-cover" alt="Hero background" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl mx-auto text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Descubra os melhores <span className="text-indigo-400 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">momentos</span> da sua cidade.
            </h1>
            <p className="text-xl text-indigo-100 mb-10 leading-relaxed opacity-90 max-w-2xl mx-auto">
              Encontre shows, palestras, workshops e muito mais. Evelou é a sua nova maneira de viver experiências inesquecíveis.
            </p>
            
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Nome do evento, cidade ou categoria"
                  className="w-full pl-11 pr-4 py-3 text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400 text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="lg" className="md:w-auto rounded-xl">Buscar Eventos</Button>
            </div>

            <div className="mt-8 flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-indigo-300 opacity-60">
              <span className="flex items-center gap-2"><i className="fa-solid fa-shield-check"></i> 100% Seguro</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-bolt"></i> Receba na hora</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-star"></i> Melhor suporte</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat}
                className="whitespace-nowrap px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-all font-medium"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 text-left">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Eventos em Destaque</h2>
              <p className="text-gray-500 mt-2">Confira o que está bombando nos próximos dias.</p>
            </div>
            <Link to="/eventos" className="text-indigo-600 font-semibold hover:underline">
              Ver todos <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(event.id); }}
                  className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center transition-all active:scale-75 ${isFavorite(event.id) ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'}`}
                >
                  <i className={`fa-solid fa-heart ${isFavorite(event.id) ? 'animate-pulse' : ''}`}></i>
                </button>

                <Link to={`/evento/${event.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={event.thumbnail} 
                      alt={event.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-[10px] font-black text-indigo-600 uppercase shadow-sm">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-black text-indigo-600 mb-2 uppercase tracking-widest">
                      {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {event.time}
                    </p>
                    <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-6 font-medium">
                      <i className="fa-solid fa-location-dot text-indigo-400"></i> {event.location}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">A partir de</span>
                        <span className="text-lg font-black text-gray-900">
                          {event.tickets[0].price === 0 ? <span className="text-emerald-600">Grátis</span> : `R$ ${event.tickets[0].price.toFixed(2)}`}
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
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 bg-indigo-50 border-y text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Experiência Mobile</span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-4 mb-6 leading-tight">
                Seus ingressos e gestão de eventos sempre com você.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Com o app Evelou, você acessa seus ingressos offline, recebe notificações em tempo real e, se for organizador, faz o check-in dos participantes usando apenas a câmera do celular.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <a href="#" className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition shadow-lg">
                  <i className="fa-brands fa-apple text-3xl"></i>
                  <div className="text-left">
                    <p className="text-[10px] uppercase opacity-70">Disponível na</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </a>
                <a href="#" className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-800 transition shadow-lg">
                  <i className="fa-brands fa-google-play text-2xl"></i>
                  <div className="text-left">
                    <p className="text-[10px] uppercase opacity-70">Disponível no</p>
                    <p className="text-sm font-bold">Google Play</p>
                  </div>
                </a>
              </div>

              <div className="flex items-center gap-6 p-4 bg-white rounded-2xl border shadow-sm max-w-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border">
                  <i className="fa-solid fa-qrcode text-4xl text-gray-800"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Abra o simulador</p>
                  <Link to="/mobile-app" className="text-indigo-600 font-semibold text-sm hover:underline">Testar versão mobile agora &rarr;</Link>
                </div>
              </div>
            </div>

            <div className="flex-1 relative flex justify-center">
              {/* Phone Mockup Frame */}
              <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[50px] border-[8px] border-gray-800 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20"></div>
                <img 
                  src="https://picsum.photos/seed/mobile1/600/1200" 
                  className="w-full h-full object-cover opacity-80" 
                  alt="App interface" 
                />
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                   <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                     <i className="fa-solid fa-circle-play text-5xl text-white mb-4"></i>
                     <p className="text-white font-bold">Veja o App em ação</p>
                   </div>
                </div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute -z-10 top-20 -right-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -z-10 bottom-20 -left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <i className="fa-solid fa-ticket text-[300px] rotate-[-20deg]"></i>
            </div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">Crie seu próprio evento agora mesmo!</h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-lg">
                Seja um workshop online ou um mega festival, a Evelou tem as ferramentas certas para você vender mais e gerenciar tudo em um só lugar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/organizador/eventos/novo">
                  <Button variant="secondary" size="lg">Começar Gratuitamente</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="!border-white !text-white hover:!bg-white/10">Saiba mais</Button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 hidden md:block">
              <img 
                src="https://picsum.photos/seed/dashboard/600/400" 
                alt="Dashboard preview" 
                className="rounded-2xl shadow-2xl border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
