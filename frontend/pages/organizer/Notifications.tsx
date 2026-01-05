
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'sale' | 'system' | 'finance' | 'alert';
  read: boolean;
  date: string;
}

export const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Nova Venda Realizada', message: 'Um ingresso Pista foi vendido para o evento "Festival de Verão".', type: 'sale', read: false, date: '2024-08-22 14:30' },
    { id: '2', title: 'Solicitação de Saque Aprovada', message: 'Seu resgate de R$ 1.250,00 foi processado e cairá na conta em instantes.', type: 'finance', read: false, date: '2024-08-22 10:15' },
    { id: '3', title: 'Evento Publicado!', message: 'Seu evento "Workshop React" já está disponível para venda.', type: 'system', read: true, date: '2024-08-21 09:00' },
    { id: '4', title: 'Alerta de Segurança', message: 'Um novo login foi realizado a partir de um dispositivo não reconhecido.', type: 'alert', read: true, date: '2024-08-20 18:45' },
    { id: '5', title: 'Novo Cupom Usado', message: 'O cupom "VERAO10" acaba de ser utilizado em uma compra.', type: 'sale', read: true, date: '2024-08-20 12:30' },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => filter === 'all' || !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'sale': return { icon: 'fa-ticket', bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'finance': return { icon: 'fa-sack-dollar', bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'alert': return { icon: 'fa-triangle-exclamation', bg: 'bg-rose-50', text: 'text-rose-600' };
      default: return { icon: 'fa-circle-info', bg: 'bg-indigo-50', text: 'text-indigo-600' };
    }
  };

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">Notificações</h1>
            <p className="text-gray-500 text-sm mt-2 uppercase font-black tracking-widest">Acompanhe as novidades da sua conta em tempo real</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={!notifications.some(n => !n.read)}>
               Marcar tudo como lido
            </Button>
          </div>
        </header>

        <div className="flex gap-2 mb-8 bg-gray-200/50 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
          >
            Todas ({notifications.length})
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
          >
            Não Lidas ({notifications.filter(n => !n.read).length})
          </button>
        </div>

        <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden divide-y divide-gray-100">
          {filtered.length > 0 ? filtered.map((notif) => {
            const style = getIcon(notif.type);
            return (
              <div key={notif.id} className={`p-8 flex flex-col md:flex-row items-start md:items-center gap-6 transition-colors group ${!notif.read ? 'bg-indigo-50/10' : 'hover:bg-gray-50'}`}>
                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-xl shrink-0 ${style.bg} ${style.text} shadow-inner`}>
                  <i className={`fa-solid ${style.icon}`}></i>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className={`text-lg font-black tracking-tight ${!notif.read ? 'text-gray-900' : 'text-gray-500'}`}>
                      {notif.title}
                    </h3>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>}
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed mb-2">{notif.message}</p>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(notif.date).toLocaleString('pt-BR')}</p>
                </div>

                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                   {!notif.read && (
                     <button 
                      onClick={() => markAsRead(notif.id)}
                      className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition shadow-sm"
                      title="Marcar como lida"
                     >
                       <i className="fa-solid fa-check"></i>
                     </button>
                   )}
                   <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="p-3 text-gray-400 bg-gray-100 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition shadow-sm"
                    title="Excluir"
                   >
                     <i className="fa-solid fa-trash-can text-sm"></i>
                   </button>
                </div>
              </div>
            );
          }) : (
            <div className="py-24 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6 text-3xl">
                  <i className="fa-solid fa-bell-slash"></i>
               </div>
               <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Tudo em silêncio por aqui</h3>
               <p className="text-gray-500 text-sm max-w-xs leading-relaxed font-medium">Você não possui nenhuma notificação {filter === 'unread' ? 'não lida ' : ''}no momento.</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 p-8 bg-indigo-900 rounded-[3rem] text-white relative overflow-hidden">
           <div className="relative z-10">
              <h4 className="text-lg font-black mb-2">Configure seus Alertas</h4>
              <p className="text-sm text-indigo-200 mb-6 max-w-md">Escolha quais tipos de notificações você deseja receber por e-mail e push no seu navegador.</p>
              <Button variant="secondary" size="sm" className="!text-[10px] font-black uppercase tracking-widest">Abrir Preferências</Button>
           </div>
           <i className="fa-solid fa-sliders absolute -right-6 -bottom-6 text-8xl text-white opacity-5 rotate-12"></i>
        </div>
      </div>
    </div>
  );
};
