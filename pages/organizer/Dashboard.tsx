
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../stores/useAuthStore';
import { StripeStatus } from '../../types';
import { MOCK_EVENTS } from '../../constants';

export const OrganizerDashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Simulação de um evento que recebeu solicitação de edição (no mundo real viria do status 'needs_correction')
  const eventsNeedingAttention = [MOCK_EVENTS[0]].map(e => ({...e, status: 'needs_correction', moderationNote: 'A imagem de capa está com baixa resolução. Por favor, envie uma versão em HD para aprovação.'}));

  const stats = [
    { label: 'Eventos Ativos', value: '12', icon: 'fa-calendar-check', color: 'text-indigo-600' },
    { label: 'Ingressos Vendidos', value: '1.450', icon: 'fa-ticket', color: 'text-green-600' },
    { label: 'Faturamento Bruto', value: 'R$ 45.200', icon: 'fa-money-bill-trend-up', color: 'text-blue-600' },
    { label: 'Saldo Disponível', value: 'R$ 12.800', icon: 'fa-wallet', color: 'text-amber-600' },
  ];

  return (
    <div className="p-4 lg:p-8 text-left">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Bem-vindo de volta, {user?.name}.</p>
          </div>
          <Link to="/organizador/eventos/novo">
            <Button>
              <i className="fa-solid fa-plus mr-2"></i> Criar Novo Evento
            </Button>
          </Link>
        </div>

        {/* --- NOVO: ALERTAS DE MODERAÇÃO --- */}
        {eventsNeedingAttention.length > 0 && eventsNeedingAttention.map(event => (
          <div key={event.id} className="mb-6 bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-top-4 duration-500">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest">Ação Necessária: {event.name}</h4>
                <Badge variant="warning">EDIÇÃO SOLICITADA</Badge>
              </div>
              <p className="text-sm text-amber-800 font-medium leading-relaxed">
                A moderação analisou seu evento e solicitou ajustes: <span className="italic font-bold">"{event.moderationNote}"</span>
              </p>
            </div>
            <Link to={`/organizador/eventos/${event.id}/editar`} className="w-full md:w-auto">
              <Button size="sm" className="w-full !bg-amber-600 hover:!bg-amber-700 !border-none shadow-lg shadow-amber-200/50">
                <i className="fa-solid fa-pen-to-square mr-2"></i> Corrigir Agora
              </Button>
            </Link>
          </div>
        ))}

        {/* Verification Alert (KYC) */}
        {!user?.isVerified && (
          <div className={`mb-4 border p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-left transition-all ${
            user?.kycStatus === 'pending' 
            ? 'bg-blue-50 border-blue-200' 
            : user?.kycStatus === 'rejected' 
            ? 'bg-rose-50 border-rose-200' 
            : 'bg-indigo-50 border-indigo-200'
          }`}>
            <div className={`p-3 rounded-full flex-shrink-0 ${
              user?.kycStatus === 'pending' ? 'bg-blue-100 text-blue-600' : 
              user?.kycStatus === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <i className={`fa-solid ${
                user?.kycStatus === 'pending' ? 'fa-hourglass-half' : 
                user?.kycStatus === 'rejected' ? 'fa-circle-xmark' : 'fa-shield-halved'
              } text-lg`}></i>
            </div>
            <div className="flex-1">
              <h4 className={`font-bold text-sm ${user?.kycStatus === 'rejected' ? 'text-rose-900' : 'text-indigo-900'}`}>
                {user?.kycStatus === 'pending' ? 'Documentos em análise' : 
                 user?.kycStatus === 'rejected' ? 'Verificação Rejeitada' : 'Verifique seu Perfil'}
              </h4>
              <p className={`text-xs ${user?.kycStatus === 'rejected' ? 'text-rose-800' : 'text-indigo-800'}`}>
                {user?.kycStatus === 'pending' ? 'Estamos revisando seus dados. Você será notificado em até 24h.' : 
                 user?.kycStatus === 'rejected' ? 'Houve um problema com seus documentos. Clique para ajustar.' : 'Envie seus documentos para ganhar o selo de verificado e aumentar sua credibilidade.'}
              </p>
            </div>
            <Link to="/organizador/configuracoes">
              <Button variant="outline" size="sm" className={
                user?.kycStatus === 'pending' ? '!border-blue-600 !text-blue-600' : 
                user?.kycStatus === 'rejected' ? '!border-rose-600 !text-rose-600' : '!border-indigo-600 !text-indigo-600'
              }>
                {user?.kycStatus === 'pending' ? 'Ver Status' : 'Enviar Documentos'}
              </Button>
            </Link>
          </div>
        )}

        {/* Stripe Alert */}
        {user?.stripeStatus !== StripeStatus.ACTIVE && (
          <div className="mb-8 bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-left">
            <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
              <i className="fa-solid fa-triangle-exclamation text-amber-600 text-lg"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-900 text-sm">Conta incompleta</h4>
              <p className="text-amber-800 text-xs">
                Complete sua conta Stripe Express para começar a receber o dinheiro das vendas.
              </p>
            </div>
            <Link to="/organizador/financeiro">
              <Button variant="outline" size="sm" className="!border-amber-600 !text-amber-600 hover:!bg-amber-100">Configurar</Button>
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gray-50 ${stat.color}`}>
                <i className={`fa-solid ${stat.icon} text-lg`}></i>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Recent Events List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Eventos Recentes</h3>
                <Link to="/organizador/eventos" className="text-indigo-600 text-xs font-bold hover:underline">VER TODOS</Link>
              </div>
              <div className="divide-y">
                {MOCK_EVENTS.map((event) => (
                  <div key={event.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition group">
                    <img src={event.banner} className="w-10 h-10 rounded-lg object-cover" alt={event.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{event.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{new Date(event.date).toLocaleDateString()} • {event.category}</p>
                    </div>
                    <Badge variant="success">Ativo</Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/organizador/eventos/${event.id}`}>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition" title="Ver detalhes"><i className="fa-solid fa-chart-line"></i></button>
                      </Link>
                      <Link to={`/organizador/eventos/${event.id}/editar`}>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition" title="Editar"><i className="fa-solid fa-pen"></i></button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Ações Rápidas</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl border hover:border-indigo-600 hover:bg-indigo-50 transition group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <i className="fa-solid fa-file-export text-xs"></i>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Exportar Vendas</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl border hover:border-indigo-600 hover:bg-indigo-50 transition group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                        <i className="fa-solid fa-bullhorn text-xs"></i>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Novo Cupom</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                  </button>
                </div>
             </div>

             <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
                <div className="relative z-10">
                  <h4 className="font-bold text-sm mb-2">Suporte Prioritário</h4>
                  <p className="text-xs text-indigo-100 leading-relaxed mb-4">
                    Como organizador verificado, você tem acesso ao nosso chat 24/7 para tirar dúvidas sobre seus eventos.
                  </p>
                  <Button variant="secondary" size="sm" className="!bg-white/10 !text-white !border-0 hover:!bg-white/20">Falar com Suporte</Button>
                </div>
                <i className="fa-solid fa-headset absolute -right-4 -bottom-4 text-7xl text-white/10 rotate-12"></i>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
