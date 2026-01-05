
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../constants';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/useAuthStore';

export const OrganizerProfile: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  
  // No mundo real, buscaríamos pelo ID. 
  // Aqui simulamos que se o ID for o do usuário logado (ou se for o mock fixo), mostramos o status real.
  const organizerName = "Evelou Produções"; 
  const organizerEvents = MOCK_EVENTS.filter(e => e.organizerName === organizerName);
  
  // Se for o organizador logado, usamos o isVerified do store. Se não, assumimos true para o mock fixo.
  const isVerified = user?.id === id ? user?.isVerified : true;

  const stats = [
    { label: 'Eventos Realizados', value: '42', icon: 'fa-calendar-check' },
    { label: 'Seguidores', value: '1.2k', icon: 'fa-users' },
    { label: 'Nota Média', value: '4.9', icon: 'fa-star' },
    { label: 'Membro Desde', value: '2022', icon: 'fa-award' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-500 text-left">
      {/* Cover & Profile Header */}
      <section className="relative">
        <div className="h-64 md:h-80 bg-slate-900 overflow-hidden relative">
           <div className="absolute inset-0 opacity-30">
              <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Cover" />
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative -mt-20 z-10">
          <div className="flex flex-col md:flex-row items-end gap-6 md:gap-10">
            <div className="relative group">
              <img 
                src={`https://ui-avatars.com/api/?name=${organizerName}&background=6366f1&color=fff&size=200`} 
                className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] border-8 border-white shadow-2xl bg-white object-cover" 
                alt={organizerName} 
              />
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg animate-bounce" title="Organizador Verificado">
                  <i className="fa-solid fa-shield-check text-lg"></i>
                </div>
              )}
            </div>
            
            <div className="flex-1 mb-4">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">{organizerName}</h1>
                {isVerified && <Badge variant="success">Verificado</Badge>}
              </div>
              <p className="text-slate-400 font-medium flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-indigo-400"></i> São Paulo, SP • Sócio-parceiro Evelou
              </p>
            </div>

            <div className="flex gap-2 mb-4 w-full md:w-auto">
              <Button className="flex-1 md:flex-none shadow-xl shadow-indigo-500/20 px-8">
                <i className="fa-solid fa-plus mr-2"></i> Seguir
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none !bg-white/10 !text-white !border-white/20 backdrop-blur-md hover:!bg-white/20">
                <i className="fa-solid fa-share-nodes"></i>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar / Info */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm text-center group hover:border-indigo-600 transition duration-300">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i className={`fa-solid ${s.icon} text-sm`}></i>
                  </div>
                  <p className="text-xl font-black text-gray-900">{s.value}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>

            {/* About Section */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Sobre a Produtora</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium mb-8">
                A {organizerName} é referência em experiências musicais e corporativas de alta tecnologia no Brasil. Com mais de 10 anos de estrada, focamos em entregar o melhor para o fã e resultados impecáveis para nossos parceiros.
              </p>
              
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Canais Oficiais</h4>
                 <div className="flex gap-3">
                   <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition"><i className="fa-brands fa-instagram text-lg"></i></a>
                   <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition"><i className="fa-brands fa-linkedin text-lg"></i></a>
                   <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition"><i className="fa-solid fa-globe text-lg"></i></a>
                 </div>
              </div>
            </div>
          </aside>

          {/* Events List */}
          <main className="lg:col-span-8 space-y-10">
             <div className="flex items-center justify-between border-b pb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Eventos Publicados</h2>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100">Ativos</button>
                   <button className="px-4 py-2 bg-white text-gray-500 border rounded-xl text-xs font-bold hover:bg-gray-50">Encerrados</button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {organizerEvents.map((event) => (
                  <Link 
                    key={event.id} 
                    to={`/evento/${event.slug}`}
                    className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.banner} 
                        alt={event.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-xl text-[9px] font-black text-indigo-600 uppercase shadow-sm">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">
                        {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {event.time}
                      </p>
                      <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {event.name}
                      </h3>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-lg font-black text-gray-900">
                          {event.tickets[0].price === 0 ? <span className="text-emerald-600">Grátis</span> : `R$ ${event.tickets[0].price.toFixed(2)}`}
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <i className="fa-solid fa-arrow-right"></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};
