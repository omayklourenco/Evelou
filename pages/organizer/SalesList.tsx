
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_ORDERS, MOCK_EVENTS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const SalesList: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success">Pago</Badge>;
      case 'pending': return <Badge variant="warning">Pendente</Badge>;
      case 'refund_pending': return <Badge variant="warning" className="!bg-rose-50 !text-rose-600 !border-rose-100">Estorno Solicitado</Badge>;
      case 'refunded': return <Badge variant="gray">Estornado</Badge>;
      default: return <Badge variant="error">Falhou</Badge>;
    }
  };

  return (
    <div className="p-4 lg:p-8 text-left">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Vendas</h1>
            <p className="text-gray-500 text-sm">Acompanhe todos os pedidos e transações da sua conta.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <i className="fa-solid fa-download mr-2"></i> Exportar CSV
            </Button>
          </div>
        </header>

        {/* Sales KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Receita Bruta</p>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1">R$ 45.200,50</h3>
            <p className="text-[10px] text-green-600 font-bold mt-2">▲ 8.2% vs mês anterior</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Receita Líquida</p>
            <h3 className="text-xl font-extrabold text-indigo-600 mt-1">R$ 40.680,45</h3>
            <p className="text-[10px] text-gray-400 mt-2">Após taxas da plataforma</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pedidos Pagos</p>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1">1,248</h3>
            <p className="text-[10px] text-gray-400 mt-2">De um total de 1,450 tentativas</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ticket Médio</p>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1">R$ 36,21</h3>
            <p className="text-[10px] text-indigo-600 font-bold mt-2">Ótimo desempenho</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border shadow-sm mb-6 flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'paid', 'pending', 'refunded', 'refund_pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                  filterStatus === status ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'Todos' : status === 'paid' ? 'Pagos' : status === 'pending' ? 'Pendentes' : status === 'refund_pending' ? 'Solic. Estorno' : 'Estornados'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Todos os Eventos</option>
              {MOCK_EVENTS.map(e => <option key={e.id}>{e.name}</option>)}
            </select>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Buscar pedido ou e-mail..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pedido / Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comprador</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Evento</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {MOCK_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.id}</p>
                      <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString('pt-BR')} {new Date(order.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.buyerName}</p>
                      <p className="text-xs text-gray-500">{order.buyerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 line-clamp-1 max-w-[150px]">{order.eventName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">R$ {order.total.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">via {order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/organizador/vendas/${order.id}`}>
                        <Button variant="ghost" size="sm" className="hover:!text-indigo-600">
                          Detalhes <i className="fa-solid fa-chevron-right ml-2 text-[10px]"></i>
                        </Button>
                      </Link>
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
