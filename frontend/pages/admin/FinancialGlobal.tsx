
import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const FinancialGlobal: React.FC = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const stats = [
    { label: 'GMV Global (Acumulado)', value: 'R$ 2.450.800,00', icon: 'fa-cart-shopping', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Comissões Evelou', value: 'R$ 245.080,00', icon: 'fa-vault', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pendente Repasse', value: 'R$ 812.400,00', icon: 'fa-hand-holding-dollar', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Taxa de Risco (CBK)', value: '0.12%', icon: 'fa-shield-virus', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const [refundRequests, setRefundRequests] = useState([
    { id: 'REF-001', orderId: 'EVL-98421', buyer: 'Marcos Oliveira', amount: 240.00, reason: 'Desistência', date: '2024-08-22' },
    { id: 'REF-002', orderId: 'EVL-98400', buyer: 'Ana Santos', amount: 120.00, reason: 'Imprevisto', date: '2024-08-21' },
  ]);

  const handleProcessRefund = (id: string, action: 'approve' | 'deny') => {
    setLoadingAction(id);
    setTimeout(() => {
      setRefundRequests(prev => prev.filter(r => r.id !== id));
      setLoadingAction(null);
      alert(action === 'approve' ? 'Estorno realizado com sucesso no gateway!' : 'Solicitação de estorno negada.');
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 text-left">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Financeiro Global</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase font-black tracking-widest">Controle de Fluxo de Caixa e Repasses</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="!bg-white flex-1 md:flex-none shadow-sm" onClick={() => setIsReportModalOpen(true)}>
            <i className="fa-solid fa-file-invoice-dollar mr-2"></i> Fechamento Mensal
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border shadow-sm group hover:border-indigo-200 transition">
            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner`}>
              <i className={`fa-solid ${s.icon}`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Fila de Estornos (Novo Componente) */}
          <div className="bg-white rounded-[2.5rem] border-2 border-rose-50 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="px-8 py-6 border-b flex justify-between items-center bg-rose-50/30">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                 <h3 className="font-black text-rose-900 text-xs uppercase tracking-widest">Solicitações de Estorno Pendentes</h3>
               </div>
               <Badge variant="error">{refundRequests.length} Urgente</Badge>
             </div>
             <div className="divide-y">
                {refundRequests.length > 0 ? refundRequests.map(req => (
                  <div key={req.id} className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-rose-50/10 transition">
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase">{req.id}</span>
                           <h4 className="font-bold text-slate-900">{req.buyer}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-1">Pedido: <span className="font-mono">{req.orderId}</span> • Motivo: <span className="font-bold">{req.reason}</span></p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(req.date).toLocaleDateString()}</p>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="text-right">
                           <p className="text-xl font-black text-slate-900">R$ {req.amount.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                           <Button 
                            size="sm" 
                            className="!bg-rose-600 hover:!bg-rose-700 shadow-lg shadow-rose-100"
                            onClick={() => handleProcessRefund(req.id, 'approve')}
                            isLoading={loadingAction === req.id}
                           >
                             Executar Estorno
                           </Button>
                           <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-400 hover:text-slate-600"
                            onClick={() => handleProcessRefund(req.id, 'deny')}
                            disabled={loadingAction === req.id}
                           >
                             Negar
                           </Button>
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="p-16 text-center text-slate-300 flex flex-col items-center">
                    <i className="fa-solid fa-check-circle text-4xl mb-4 opacity-10"></i>
                    <p className="font-bold">Nenhum reembolso pendente.</p>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Fila de Repasses (Saques)</h3>
              <button className="text-xs font-black text-indigo-600 hover:underline uppercase">Ver Todos</button>
            </div>
            <div className="divide-y">
               {[
                 { id: 'PAY-992', org: 'Evelou Produções', val: 'R$ 45.200,00', status: 'pending' }
               ].map(req => (
                 <div key={req.id} className="p-6 px-8 flex justify-between items-center">
                   <div>
                      <p className="font-bold text-slate-900">{req.org}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ref: {req.id}</p>
                   </div>
                   <div className="flex items-center gap-6">
                      <p className="font-black text-slate-900">{req.val}</p>
                      <Button size="sm" className="!text-[10px] !py-1.5">Liberar</Button>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-950 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Gestão de Risco</h3>
             <div className="space-y-6 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Taxa de Reembolso Geral</p>
                   <p className="text-2xl font-black">1.2% <span className="text-[10px] text-emerald-400">Normal</span></p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  O sistema de monitoramento automático congela saques de organizadores com taxa de estorno superior a 5%.
                </p>
             </div>
             <i className="fa-solid fa-shield-halved absolute -right-6 -bottom-6 text-9xl text-white opacity-5"></i>
          </div>

          <div className="bg-white rounded-[3rem] p-8 border shadow-sm">
             <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6 text-center">Políticas Vigentes</h3>
             <div className="space-y-3">
                <div className="flex justify-between text-xs border-b pb-2">
                   <span className="text-slate-500">Prazo Estorno:</span>
                   <span className="font-bold text-slate-900">7 dias (CDC)</span>
                </div>
                <div className="flex justify-between text-xs border-b pb-2">
                   <span className="text-slate-500">Multa Organizador:</span>
                   <span className="font-bold text-slate-900">R$ 5,00 / estorno</span>
                </div>
             </div>
             <Button variant="outline" className="w-full mt-6" size="sm">Configurar Regras</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
