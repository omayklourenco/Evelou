
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../../constants';
import { Button } from '../../components/ui/Button';

export const CheckInSelection: React.FC = () => {
  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Portaria & Check-in</h1>
          <p className="text-gray-500 mt-1">Selecione o evento para iniciar a conferência de ingressos.</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_EVENTS.map(event => (
            <Link 
              key={event.id} 
              to={`/organizador/checkin/${event.id}`}
              className="group bg-white p-6 rounded-2xl border shadow-sm hover:border-indigo-600 transition-all flex flex-col sm:flex-row items-center gap-6"
            >
              <img src={event.banner} className="w-full sm:w-24 h-24 rounded-xl object-cover" alt="" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">{event.name}</h3>
                <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span><i className="fa-solid fa-ticket mr-1"></i> 145 Vendidos</span>
                  <span><i className="fa-solid fa-user-check mr-1"></i> 82 Presentes</span>
                </div>
              </div>
              <Button size="sm">Abrir Portaria</Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
