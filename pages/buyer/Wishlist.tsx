
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { MOCK_EVENTS } from '../../constants';
import { Button } from '../../components/ui/Button';

export const Wishlist: React.FC = () => {
  const { favorites, toggleFavorite } = useWishlistStore();
  
  const favoritedEvents = MOCK_EVENTS.filter(e => favorites.includes(e.id));

  return (
    <div className="text-left animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meus Favoritos</h1>
        <p className="text-gray-500 text-sm mt-1">Eventos que você amou e não quer perder.</p>
      </header>

      {favoritedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {favoritedEvents.map(event => (
             <div key={event.id} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 relative flex flex-col sm:flex-row">
                <button 
                  onClick={() => toggleFavorite(event.id)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-rose-500 transition-transform active:scale-75"
                >
                  <i className="fa-solid fa-heart"></i>
                </button>

                <div className="w-full sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden">
                   <img src={event.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                   <div>
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">
                        {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {event.time}
                      </p>
                      <h3 className="font-black text-gray-900 text-lg leading-tight mb-2 line-clamp-1">{event.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase truncate"><i className="fa-solid fa-location-dot text-indigo-300 mr-1"></i> {event.location.split(',')[0]}</p>
                   </div>
                   <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <Link to={`/evento/${event.slug}`} className="flex-1">
                        <Button size="sm" className="w-full !rounded-xl">Comprar Ingressos</Button>
                      </Link>
                   </div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="py-24 bg-white rounded-[3rem] border border-dashed text-center flex flex-col items-center">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-rose-200 mb-6 text-4xl">
             <i className="fa-solid fa-heart-crack"></i>
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">Nada por aqui ainda...</h3>
           <p className="text-gray-500 text-sm max-w-xs mb-8 leading-relaxed font-medium">
             Salve os eventos que você mais gosta clicando no coração para acompanhá-los de perto.
           </p>
           <Link to="/eventos">
             <Button variant="outline">Explorar Eventos</Button>
           </Link>
        </div>
      )}
    </div>
  );
};
