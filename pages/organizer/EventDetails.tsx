
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const OrganizerEventDetails: React.FC = () => {
  const { id } = useParams();
  const event = MOCK_EVENTS.find(e => e.id === id) || MOCK_EVENTS[0];

  // Simulação de metadados de moderação
  const hasCorrectionRequest = id === '1'; // Apenas para simular no primeiro evento do mock
  const moderationNote = "A imagem de capa está com baixa resolução. Por favor, envie uma versão em HD para aprovação final e publicação.";

  const metrics = [
    { label: 'Receita Bruta', value: 'R$ 15.400,00', icon: 'fa-money-bill-wave', color: 'text-green-600' },
    { label: 'Ingressos Vendidos', value: '145 / 300', icon: 'fa-ticket', color: 'text-indigo-600' },
    { label: 'Check-in Realizado', value: '82', icon: 'fa-user-check', color: 'text-blue-600' },
    { label: 'Visualizações', value: '1.240', icon: 'fa-eye', color: 'text-amber-600' },
  ];

  return (
    <div className="py-10 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- BANNER DE SOLICITAÇÃO DE EDIÇÃO --- */}
        {hasCorrectionRequest && (
          <div className="mb-10 bg-white border-2 border-amber-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-amber-100/50 animate-in slide-in-from-top-4 duration-700">
            <div className="bg-amber-400 px-8 py-3 flex items-center gap-3">
               <i className="fa-solid fa-triangle-exclamation text-amber-900"></i>
               <span className="text-[10px] font-black text-amber-950 uppercase tracking-[0.2em]">Ação Necessária da Moderação</span>
            </div>
            <div className="p-8 flex flex-col md:flex-row items-center gap-8">
               <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-2">Ajustes pendentes para publicação</h3>
                  <p className="text-gray-600 leading-relaxed italic">
                    "{moderationNote}"
                  </p>
               </div>
               <Link to={`/organizador/eventos/${id}/editar`}>
                 <Button className="!bg-indigo-600 !py-4 px-8 shadow-lg shadow-indigo-100">
                    <i className="fa-solid fa-pen-to-square mr-2"></i> Editar e Re-enviar
                 </Button>
               </Link>
            </div>
          </div>
        )}

        {/* Header with Breadcrumbs */}
        <div className="mb-8">
          <nav className="flex text-sm text-gray-500 mb-4 gap-2">
            <Link to="/organizador/dashboard" className="hover:text-indigo-600">Dashboard</Link>
            <span>/</span>
            <Link to="/organizador/eventos" className="hover:text-indigo-600">Eventos</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{event.name}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <img src={event.banner} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-sm" alt="" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><i className="fa-regular fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <Badge variant={hasCorrectionRequest ? 'warning' : 'success'}>
                    {hasCorrectionRequest ? 'Correção Necessária' : 'Vendas Ativas'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Link to={`/organizador/checkin/${event.id}`} className="flex-1 md:flex-none">
                <Button className="w-full !bg-indigo-900 hover:!bg-black">
                  <i className="fa-solid fa-qrcode mr-2"></i> Abrir Portaria
                </Button>
              </Link>
              <Link to={`/organizador/eventos/${event.id}/editar`} className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full">
                  <i className="fa-solid fa-pen mr-2"></i> Editar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 ${m.color}`}>
                  <i className={`fa-solid ${m.icon} text-lg`}></i>
                </div>
                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{m.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendees List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Lista de Participantes</h3>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm" className="text-xs"><i className="fa-solid fa-file-export mr-1"></i> Exportar</Button>
                </div>
              </div>
              
              <div className="p-4 border-b bg-gray-50/50">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input 
                    type="text" 
                    placeholder="Buscar por nome, email ou ingresso..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                        {['JD', 'MS', 'RL', 'AB', 'PC'][i]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Participante {i + 1}</p>
                        <p className="text-xs text-gray-500">participante{i}@email.com</p>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Tipo</p>
                      <p className="text-sm font-medium">Lote VIP</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div className="hidden sm:block">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Status</p>
                        <Badge variant={i % 2 === 0 ? 'success' : 'info'}>
                          {i % 2 === 0 ? 'Checked-in' : 'Pago'}
                        </Badge>
                      </div>
                      <button className="p-2 text-gray-300 group-hover:text-indigo-600 transition">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t text-center">
                <button className="text-sm font-bold text-indigo-600 hover:underline">Carregar mais participantes</button>
              </div>
            </div>
          </div>

          {/* Quick Actions & Tools */}
          <div className="lg:col-span-1 space-y-6 text-left">
            <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
              <h3 className="font-bold text-lg mb-4">Ações do Evento</h3>
              <div className="space-y-3">
                <Button className="w-full !bg-white/10 !text-white hover:!bg-white/20 border-0">
                  <i className="fa-solid fa-pause mr-2"></i> Pausar Vendas
                </Button>
                <Button className="w-full !bg-white/10 !text-white hover:!bg-white/20 border-0">
                  <i className="fa-solid fa-bullhorn mr-2"></i> Criar Cupom
                </Button>
                <Button className="w-full !bg-white/10 !text-white hover:!bg-white/20 border-0">
                  <i className="fa-solid fa-envelope mr-2"></i> Email para Inscritos
                </Button>
                <hr className="border-white/10 my-4" />
                <Button variant="danger" className="w-full !bg-red-500/20 !text-red-300 hover:!bg-red-500/30 border-0">
                  <i className="fa-solid fa-circle-xmark mr-2"></i> Cancelar Evento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
