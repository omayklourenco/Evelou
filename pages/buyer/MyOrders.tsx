
import React, { useState } from 'react';
import { MOCK_ORDERS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const MyOrders: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter || (filter === 'refunded' && order.status === 'refund_pending');
    const matchesSearch = order.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <i className="fa-solid fa-credit-card text-blue-500"></i>;
      case 'pix': return <i className="fa-solid fa-bolt text-teal-500"></i>;
      case 'boleto': return <i className="fa-solid fa-barcode text-gray-600"></i>;
      default: return <i className="fa-solid fa-wallet"></i>;
    }
  };

  return (
    <div className="text-left animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meus Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">Histórico de compras e comprovantes de pagamento.</p>
        </div>
        
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input 
            type="text" 
            placeholder="Buscar por evento ou ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
          />
        </div>
      </header>

      <div className="flex gap-2 mb-8 p-1 bg-gray-200/50 rounded-2xl w-fit">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'paid', label: 'Aprovados' },
          { id: 'pending', label: 'Pendentes' },
          { id: 'refunded', label: 'Estornados' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedido / Data</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Evento</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Método</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valor Total</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition group">
                  <td className="px-6 py-5">
                    <Link to={`/meu-pedido/${order.id}`} className="block">
                      <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{order.id}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <Link to={`/meu-pedido/${order.id}`} className="flex items-center gap-3">
                      <img src={order.eventBanner} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      <p className="font-bold text-gray-700 truncate max-w-[180px] group-hover:text-indigo-600 transition-colors">{order.eventName}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{getPaymentIcon(order.paymentMethod)}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase mt-1 tracking-tighter">
                        {order.paymentMethod === 'credit_card' ? 'Cartão' : order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="font-black text-gray-900">R$ {order.total.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{order.tickets.reduce((acc, t) => acc + t.quantity, 0)} itens</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge variant={order.status === 'paid' ? 'success' : order.status === 'pending' ? 'warning' : order.status === 'refund_pending' ? 'gray' : 'error'}>
                      {order.status === 'paid' ? 'Aprovado' : order.status === 'pending' ? 'Pendente' : order.status === 'refund_pending' ? 'Estorno em Análise' : 'Estornado'}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      to={`/meu-pedido/${order.id}`}
                      className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <i className="fa-solid fa-arrow-right-long text-xs"></i>
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4 text-2xl">
                        <i className="fa-solid fa-receipt"></i>
                      </div>
                      <p className="text-gray-500 font-medium">Nenhum pedido encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
