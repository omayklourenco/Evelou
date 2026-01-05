
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_ORDERS } from '../../constants';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Order } from '../../types';

export const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | undefined>(MOCK_ORDERS.find(o => o.id === id));
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Pedido não encontrado</h2>
          <Button onClick={() => navigate('/meus-pedidos')}>Voltar para Meus Pedidos</Button>
        </div>
      </div>
    );
  }

  const isEligibleForRefund = (order: Order) => {
    if (order.status !== 'paid') return false;
    const purchaseDate = new Date(order.createdAt);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
    const eventDate = new Date(order.eventDate);
    const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffDays <= 7 && hoursUntilEvent >= 48;
  };

  const handleRequestRefund = () => {
    if (!refundReason) return;
    setLoading(true);
    setTimeout(() => {
      setOrder({
        ...order,
        status: 'refund_pending',
        refundReason,
        refundRequestedAt: new Date().toISOString()
      });
      setLoading(false);
      setIsRefundModalOpen(false);
      alert('Solicitação de estorno enviada para análise!');
    }, 1500);
  };

  return (
    <div className="text-left animate-in fade-in duration-500 pb-20">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/meus-pedidos')}
            className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4 hover:underline flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Voltar para pedidos
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pedido #{order.id}</h1>
          <p className="text-gray-500 text-sm mt-1">Realizado em {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
        </div>
        <div className="flex gap-2">
           <Badge variant={order.status === 'paid' ? 'success' : order.status === 'refund_pending' ? 'warning' : 'gray'}>
              {order.status === 'paid' ? 'PAGAMENTO APROVADO' : order.status === 'refund_pending' ? 'ESTORNO EM ANÁLISE' : order.status.toUpperCase()}
           </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 md:p-10">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 border-b pb-4">Itens da Compra</h3>
              <div className="space-y-6">
                 {order.tickets.map((ticket, i) => (
                   <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-lg">
                            <i className="fa-solid fa-ticket"></i>
                         </div>
                         <div>
                            <p className="font-bold text-gray-900">{ticket.quantity}x {ticket.typeName}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Preço Unitário: R$ {ticket.price.toFixed(2)}</p>
                         </div>
                      </div>
                      <p className="font-black text-gray-900 text-lg">R$ {(ticket.quantity * ticket.price).toFixed(2)}</p>
                   </div>
                 ))}
              </div>

              <div className="mt-10 p-8 bg-gray-950 rounded-[2rem] text-white">
                 <div className="flex justify-between items-center mb-2 opacity-50">
                    <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-bold">R$ {order.total.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center mb-6 opacity-50">
                    <span className="text-xs font-bold uppercase tracking-widest">Taxas de Serviço</span>
                    <span className="font-bold">R$ 0,00</span>
                 </div>
                 <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Total Pago</span>
                    <span className="text-3xl font-black">R$ {order.total.toFixed(2)}</span>
                 </div>
              </div>
           </div>

           {order.status === 'refund_pending' && (
             <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 text-2xl shadow-sm">
                   <i className="fa-solid fa-circle-exclamation"></i>
                </div>
                <div>
                   <h4 className="text-lg font-black text-amber-900 mb-1">Solicitação de Estorno em Análise</h4>
                   <p className="text-sm text-amber-800 leading-relaxed font-medium">
                     Recebemos seu pedido de reembolso em {new Date(order.refundRequestedAt!).toLocaleDateString()}. Nossa equipe financeira analisará as informações e o valor será devolvido via {order.paymentMethod.toUpperCase()} em até 7 dias úteis.
                   </p>
                   <p className="text-xs text-amber-700 mt-4 italic">Motivo declarado: {order.refundReason}</p>
                </div>
             </div>
           )}

           <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">Nota Fiscal / Comprovante</h4>
                    <p className="text-xs text-gray-500">Documento válido para fins de reembolso corporativo.</p>
                 </div>
              </div>
              <Button variant="outline" className="w-full md:w-auto" onClick={() => alert('Download iniciado...')}>
                 <i className="fa-solid fa-download mr-2"></i> Baixar PDF
              </Button>
           </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
           <div className="bg-white rounded-[3rem] border shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">Evento Relacionado</h4>
                 <p className="text-xl font-black leading-tight relative z-10">{order.eventName}</p>
                 <i className="fa-solid fa-calendar-star absolute -right-4 -bottom-4 text-7xl text-white opacity-10"></i>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <img src={order.eventBanner} className="w-full h-40 object-cover rounded-[2rem] shadow-sm mb-4" alt="" />
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                       <i className="fa-solid fa-location-dot text-indigo-500"></i>
                       Salvador, BA
                    </div>
                 </div>
                 <Link to={`/meus-ingressos?pedido=${order.id}`} className="block">
                    <Button className="w-full !py-4 shadow-lg shadow-indigo-100">
                       <i className="fa-solid fa-qrcode mr-2"></i> Ver Ingressos
                    </Button>
                 </Link>
                 
                 {isEligibleForRefund(order) && (
                   <div className="pt-4 border-t border-gray-50">
                      <button 
                        onClick={() => setIsRefundModalOpen(true)}
                        className="w-full text-center text-rose-500 font-black text-[10px] uppercase tracking-widest hover:text-rose-700 transition"
                      >
                         <i className="fa-solid fa-rotate-left mr-2"></i> Solicitar Estorno
                      </button>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Pagamento</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500">Método:</span>
                    <span className="text-sm font-black text-gray-900 uppercase">{order.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : order.paymentMethod}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500">Adquirente:</span>
                    <span className="text-sm font-black text-gray-900">Stripe Payments</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500">Parcelas:</span>
                    <span className="text-sm font-black text-gray-900">1x (à vista)</span>
                 </div>
              </div>
           </div>
        </aside>
      </div>

      {/* Modal: Solicitar Reembolso */}
      <Modal 
        isOpen={isRefundModalOpen} 
        onClose={() => setIsRefundModalOpen(false)} 
        title="Solicitar Reembolso"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsRefundModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" isLoading={loading} onClick={handleRequestRefund} disabled={!refundReason}>Confirmar Estorno</Button>
          </>
        }
      >
        <div className="space-y-6 text-left">
           <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-4">
              <i className="fa-solid fa-triangle-exclamation text-rose-600 mt-1"></i>
              <p className="text-xs text-rose-800 leading-relaxed font-bold uppercase">
                Esta ação é irreversível. Seus ingressos serão cancelados imediatamente após a análise.
              </p>
           </div>

           <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Por que deseja cancelar?</label>
              <div className="space-y-2">
                 {[
                   'Desistência / Arrependimento',
                   'Imprevisto pessoal',
                   'Erro na escolha do tipo de ingresso',
                   'Não poderei ir na nova data',
                   'Outros'
                 ].map(reason => (
                   <label key={reason} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition group">
                      <input 
                        type="radio" 
                        name="reason" 
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                        onChange={() => setRefundReason(reason)}
                      />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">{reason}</span>
                   </label>
                 ))}
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
};
