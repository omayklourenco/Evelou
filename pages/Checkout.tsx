
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

type PaymentMethod = 'card' | 'pix' | 'boleto';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { event, items, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Valores financeiros
  const subtotal = getTotal();
  const serviceFee = subtotal * 0.1; // 10% de taxa
  const total = subtotal + serviceFee;

  if (!event || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto mb-8 border border-gray-100">
            <i className="fa-solid fa-cart-shopping text-gray-300 text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto font-medium">Você ainda não selecionou nenhum ingresso para este evento.</p>
          <Button onClick={() => navigate('/eventos')} size="lg" className="rounded-2xl">Explorar Eventos</Button>
        </div>
      </div>
    );
  }

  const handleFinishPayment = () => {
    setLoading(true);
    // Simulação de processamento de gateway
    setTimeout(() => {
      setLoading(false);
      navigate('/compra-sucesso');
    }, 2500);
  };

  const inputClasses = "w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium";
  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1";

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Simplificado */}
      <header className="bg-white border-b py-6 mb-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter">EVELOU</Link>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <i className="fa-solid fa-lock text-emerald-500"></i>
            Ambiente Seguro
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Main Checkout Flow */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: User Info */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border shadow-sm border-gray-100">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-gray-900 tracking-tight">
                <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-lg shadow-indigo-100 italic">1</span>
                Dados do Comprador
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClasses}>Nome Completo</label>
                  <input type="text" className={inputClasses} placeholder="Como impresso no documento" />
                </div>
                <div>
                  <label className={labelClasses}>E-mail para receber ingressos</label>
                  <input type="email" className={inputClasses} placeholder="seu@email.com" />
                </div>
                <div>
                  <label className={labelClasses}>CPF</label>
                  <input type="text" className={inputClasses} placeholder="000.000.000-00" />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border shadow-sm border-gray-100">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-gray-900 tracking-tight">
                <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-lg shadow-indigo-100 italic">2</span>
                Pagamento
              </h2>

              {/* Payment Tabs */}
              <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1 mb-8">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === 'card' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <i className="fa-solid fa-credit-card mr-2"></i> Cartão
                </button>
                <button 
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === 'pix' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <i className="fa-solid fa-bolt mr-2"></i> Pix
                </button>
                <button 
                  onClick={() => setPaymentMethod('boleto')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === 'boleto' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <i className="fa-solid fa-barcode mr-2"></i> Boleto
                </button>
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className={labelClasses}>Número do Cartão</label>
                        <div className="relative">
                          <input type="text" className={inputClasses} placeholder="0000 0000 0000 0000" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-40 grayscale group-focus-within:grayscale-0 transition-all">
                             <i className="fa-brands fa-cc-visa text-xl"></i>
                             <i className="fa-brands fa-cc-mastercard text-xl"></i>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className={labelClasses}>Validade (MM/AA)</label>
                        <input type="text" className={inputClasses} placeholder="00/00" />
                      </div>
                      <div>
                        <label className={labelClasses}>CVC / CVV</label>
                        <input type="text" className={inputClasses} placeholder="123" />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClasses}>Parcelamento</label>
                        <select className={inputClasses}>
                           <option>1x de R$ {total.toFixed(2)} sem juros</option>
                           <option>2x de R$ {(total/2).toFixed(2)} sem juros</option>
                           <option>3x de R$ {(total/3).toFixed(2)} sem juros</option>
                        </select>
                      </div>
                   </div>
                </div>
              )}

              {/* PIX Info */}
              {paymentMethod === 'pix' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 text-2xl shadow-sm">
                        <i className="fa-solid fa-bolt"></i>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Pague com Pix e receba na hora</h4>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                        O QR Code será gerado após clicar em concluir. O ingresso é enviado imediatamente após a confirmação.
                      </p>
                   </div>
                </div>
              )}

              {/* Boleto Info */}
              {paymentMethod === 'boleto' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-gray-400 border">
                           <i className="fa-solid fa-barcode"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Atenção ao prazo</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Boletos podem levar até 3 dias úteis para compensação. O ingresso só será enviado após a confirmação bancária. Recomendamos pagar o quanto antes para garantir sua vaga.
                          </p>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              <div className="mt-10 pt-10 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <i className="fa-brands fa-stripe text-4xl text-[#635BFF]"></i>
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest max-w-[100px] leading-tight">Pagamento Processado com Segurança</p>
                </div>
                <div className="flex gap-4 opacity-20 grayscale">
                   <i className="fa-solid fa-shield-halved text-2xl"></i>
                   <i className="fa-solid fa-user-lock text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] border shadow-xl shadow-gray-200/50 border-gray-100 sticky top-24 overflow-hidden">
              <div className="p-8">
                <h2 className="text-xl font-black mb-6 text-gray-900 tracking-tight">Resumo do Pedido</h2>
                
                <div className="mb-8 flex gap-4">
                  <img src={event.banner} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-100" alt={event.name} />
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 leading-tight truncate">{event.name}</h3>
                    <p className="text-xs text-indigo-600 font-bold mt-1 uppercase tracking-widest">
                      {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {event.time}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 py-6 border-t border-gray-50">
                  {items.map((item) => (
                    <div key={item.ticket.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold">{item.quantity}x {item.ticket.name}</span>
                      <span className="font-black text-gray-900">R$ {(item.ticket.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="py-6 border-t border-gray-50 space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-600">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <div className="flex items-center gap-1.5 text-gray-400 group">
                      Taxa de serviço
                      <i className="fa-solid fa-circle-info text-[10px] cursor-help"></i>
                    </div>
                    <span className="text-emerald-500">R$ {serviceFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total a pagar</span>
                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input type="text" placeholder="CUPOM DE DESCONTO" className="w-full px-5 py-3.5 border border-gray-100 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black tracking-widest pr-20 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 font-black text-[10px] uppercase tracking-widest px-3 py-2 hover:bg-white rounded-xl transition">Aplicar</button>
                  </div>
                  
                  <Button 
                    className="w-full !py-6 rounded-2xl shadow-xl shadow-indigo-100" 
                    size="lg" 
                    isLoading={loading}
                    onClick={handleFinishPayment}
                  >
                    Confirmar e Pagar
                  </Button>
                </div>

                <p className="text-center text-[10px] text-gray-400 mt-6 px-4 font-bold leading-relaxed">
                  Ao clicar em pagar, você concorda com os <Link to="/termos" className="text-indigo-600 hover:underline">Termos de Uso</Link> e a <Link to="/regras-de-estorno" className="text-indigo-600 hover:underline">Política de Estorno</Link> da Evelou.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
