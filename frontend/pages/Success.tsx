
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/useCartStore';

export const Success: React.FC = () => {
  const { event, clearCart } = useCartStore();

  useEffect(() => {
    // We clear the cart after showing the info
    // But in a real app, we'd fetch the order info from API first
    return () => clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-white py-20 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <i className="fa-solid fa-check text-4xl"></i>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Pagamento Confirmado!</h1>
        <p className="text-lg text-gray-500 mb-10">
          Prepare-se para viver uma experiência incrível. Seus ingressos já estão disponíveis na sua conta e foram enviados para o seu e-mail.
        </p>

        {event && (
          <div className="bg-gray-50 border rounded-3xl p-6 mb-10 text-left">
            <div className="flex gap-4 items-center mb-6">
              <img src={event.banner} className="w-20 h-20 rounded-2xl object-cover" alt={event.name} />
              <div>
                <h3 className="font-bold text-xl">{event.name}</h3>
                <p className="text-gray-500">{new Date(event.date).toLocaleDateString()} às {event.time}</p>
              </div>
            </div>
            
            <div className="bg-white border-2 border-dashed rounded-2xl p-6 flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border relative overflow-hidden">
                <i className="fa-solid fa-qrcode text-[120px] text-gray-800 opacity-90"></i>
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                   <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">EVELOU TICKET</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Apresente este código na entrada</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/meus-ingressos">
            <Button size="lg" className="w-full">Ver Meus Ingressos</Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="lg" className="w-full">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
