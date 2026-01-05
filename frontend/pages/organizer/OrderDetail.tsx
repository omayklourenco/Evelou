
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_ORDERS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Order } from '../../types';

export const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | undefined>(MOCK_ORDERS.find(o => o.id === id));
  const [loading, setLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Pedido não encontrado</h2>
        <Link to="/organizador/vendas" className="text-indigo-600 font-bold hover:underline">Voltar para Vendas</Link>
      </div>
    );
  }

  const handleResendTickets = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Ingressos reenviados com sucesso para ' + order.buyerEmail);
    }, 1500);
  };

  const handleRefund = () => {
    setRefundLoading(true);
    setTimeout(() => {
      setOrder({ ...order, status: 'refunded' });
      setRefundLoading(false);
      setIsRefundModalOpen(false);
      alert('Venda estornada com sucesso! O comprador será notificado e o valor devolvido via ' + order.paymentMethod.toUpperCase());
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="success">PAGO / CAPTURADO</Badge>;
      case 'refunded': return <Badge variant="gray">ESTORNADO / DEVOLVIDO</Badge>;
      case 'refund_pending': return <Badge variant="warning">ESTORNO SOLICITADO</Badge>;
      case 'pending': return <Badge variant="warning">AGUARDANDO PAGAMENTO</Badge>;
      default: return <Badge variant="error">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link to="/organizador/vendas" className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-2 mb-4">
            <i className="fa-solid fa-arrow-left"></i> Voltar para Vendas
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Pedido {order.id}</h1>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-gray-500 text-sm">Realizado em {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" isLoading={loading} onClick={handleResendTickets} className="!bg-white">
                <i className="fa-solid fa-paper-plane mr-2"></i> Reenviar E-mail
              </Button>
              {order.status === 'paid' && (
                <Button variant="danger" size="sm" onClick={() => setIsRefundModalOpen(true)}>
                  <i className="fa-solid fa-rotate-left mr-2"></i> Estornar Venda
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
              <h3 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[0.2em] border-b pb-4">Itens do Pedido</h3>
              <div className="space-y-4">
                {order.tickets.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-lg border border-indigo-100">
                        <i className="fa-solid fa-ticket"></i>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.quantity}x {item.typeName}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Preço unitário: R$ {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900 text-lg">R$ {(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white space-y-2">
                <div className="flex justify-between text-xs opacity-50 font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs opacity-50 font-bold uppercase tracking-widest">
                  <span>Taxas da Plataforma</span>
                  <span>- R$ {(order.total - order.netAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-4 border-t border-white/10">
                  <span className="text-indigo-400">Seu Lucro</span>
                  <span className="text-emerald-400">R$ {order.netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
              <h3 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[0.2em] border-b pb-4">Timeline da Transação</h3>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100"><i className="fa-solid fa-check text-[10px]"></i></div>
                    <div>
                       <p className="text-sm font-bold text-gray-900">Pagamento Confirmado</p>
                       <p className="text-xs text-gray-500">Transação autorizada pelo emissor via {order.paymentMethod.toUpperCase()}</p>
                       <p className="text-[10px] font-black text-slate-300 mt-1 uppercase">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-100"><i className="fa-solid fa-paper-plane text-[10px]"></i></div>
                    <div>
                       <p className="text-sm font-bold text-gray-900">Ingressos Enviados</p>
                       <p className="text-xs text-gray-500">E-mail de confirmação disparado para {order.buyerEmail}</p>
                    </div>
                 </div>
                 {order.status === 'refunded' && (
                    <div className="flex gap-4 animate-in slide-in-from-left duration-500">
                       <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100"><i className="fa-solid fa-rotate-left text-[10px]"></i></div>
                       <div>
                          <p className="text-sm font-bold text-rose-600">Venda Estornada</p>
                          <p className="text-xs text-rose-400">O valor foi devolvido integralmente ao comprador e os ingressos foram invalidados.</p>
                          <p className="text-[10px] font-black text-rose-300 mt-1 uppercase">Agora mesmo</p>
                       </div>
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
              <h3 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[0.2em] border-b pb-4">Comprador</h3>
              <div className="flex items-center gap-4 mb-8">
                <img src={`https://ui-avatars.com/api/?name=${order.buyerName}&background=random`} className="w-14 h-14 rounded-2xl border-2 border-white shadow-md" alt="" />
                <div>
                  <p className="font-black text-gray-900 leading-tight">{order.buyerName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Cliente desde 2023</p>
                </div>
              </div>
              <div className="space-y-5 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-indigo-400 border"><i className="fa-solid fa-envelope text-[10px]"></i></div>
                  <span className="font-medium text-xs truncate">{order.buyerEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-indigo-400 border"><i className="fa-solid fa-id-card text-[10px]"></i></div>
                  <span className="font-medium text-xs">{order.buyerCpf}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-8 !border-gray-100 hover:!bg-gray-50 !text-gray-500">Histórico do Cliente</Button>
            </div>

            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 group">
              <h3 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[0.2em] border-b pb-4">Evento</h3>
              <Link to={`/evento/${order.eventId}`} className="block">
                <div className="relative h-32 rounded-2xl overflow-hidden mb-4 shadow-sm">
                   <img src={order.eventBanner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                   <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <p className="font-black text-gray-900 group-hover:text-indigo-600 transition leading-tight mb-1">{order.eventName}</p>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{new Date(order.eventDate).toLocaleDateString()}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Confirmação de Estorno */}
      <Modal 
        isOpen={isRefundModalOpen} 
        onClose={() => setIsRefundModalOpen(false)} 
        title="Confirmar Estorno de Venda"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsRefundModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" isLoading={refundLoading} onClick={handleRefund}>Confirmar e Estornar</Button>
          </>
        }
      >
        <div className="space-y-6 text-left">
           <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 flex items-start gap-4">
              <i className="fa-solid fa-triangle-exclamation text-rose-600 mt-1 text-xl"></i>
              <div>
                <h4 className="font-black text-rose-900 text-sm uppercase tracking-widest mb-1">Ação Irreversível</h4>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Ao estornar esta venda, o valor de <strong>R$ {order.total.toFixed(2)}</strong> será devolvido ao comprador. 
                  Os ingressos vinculados a este pedido serão <strong>automaticamente cancelados</strong> e não permitirão mais o check-in.
                </p>
              </div>
           </div>

           <div className="p-5 bg-indigo-50 rounded-[2rem] border border-indigo-100 space-y-3">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center">Resumo da Devolução</p>
              <div className="flex justify-between items-center text-sm font-bold text-indigo-900">
                 <span>Valor da Face:</span>
                 <span>R$ {order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">
                 <span>Taxa Evelou (Ajuste):</span>
                 <span>- R$ 0,00</span>
              </div>
           </div>

           <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest leading-relaxed">
              O processamento do estorno no cartão pode levar até 2 faturas para aparecer no extrato do cliente.
           </p>
        </div>
      </Modal>
    </div>
  );
};
