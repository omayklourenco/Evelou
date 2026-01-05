
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_EVENTS } from '../../constants';

export const OrganizerEventsList: React.FC = () => {
  const [filter, setFilter] = useState('todos');

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Eventos</h1>
            <p className="text-gray-500 text-sm mt-1">Gerencie seus eventos publicados e rascunhos.</p>
          </div>
          <Link to="/organizador/eventos/novo">
            <Button>
              <i className="fa-solid fa-plus mr-2"></i> Criar Novo Evento
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-2xl border shadow-sm mb-8 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-1">
            {['todos', 'publicados', 'rascunhos', 'encerrados'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Buscar evento..." 
              className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 text-sm bg-gray-50"
            />
          </div>
        </div>

        {/* Events Table/List */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evento</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vendas</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {MOCK_EVENTS.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={event.banner} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{event.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">{event.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={event.status === 'published' ? 'success' : 'gray'}>
                        {event.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">145 / 300</span>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: '48%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{event.time}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link to={`/organizador/eventos/${event.id}`}>
                          <button className="p-2 text-gray-400 hover:text-indigo-600 transition" title="Ver detalhes">
                            <i className="fa-solid fa-chart-line"></i>
                          </button>
                        </Link>
                        <Link to={`/organizador/eventos/${event.id}/editar`}>
                          <button className="p-2 text-gray-400 hover:text-indigo-600 transition" title="Editar">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
