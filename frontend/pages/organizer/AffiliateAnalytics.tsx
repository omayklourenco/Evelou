
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AffiliateAnalytics: React.FC = () => {
  const { id } = useParams();
  const [period, setPeriod] = useState('30d');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Dados simulados do afiliado
  const [affiliateData, setAffiliateData] = useState({
    name: 'Rodrigo Promotor',
    code: 'RODRIGO10',
    totalEarned: 840.50,
    totalPaid: 500.00,
    commission: 5
  });

  const [paymentHistory, setPaymentHistory] = useState([
    { id: '1', date: '2024-08-10 10:15', amount: 300.00, method: 'PIX', note: 'Pagamento referente a Julho' },
    { id: '2', date: '2024-07-05 14:22', amount: 200.00, method: 'Transferência', note: 'Primeiro repasse' },
  ]);

  const pendingAmount = affiliateData.totalEarned - affiliateData.totalPaid;

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return alert('Insira um valor válido.');
    
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newPayment = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleString('pt-BR'),
        amount: paymentAmount,
        method: paymentMethod,
        note: `Pagamento manual registrado pelo produtor.`
      };
      
      setPaymentHistory([newPayment, ...paymentHistory]);
      setAffiliateData(prev => ({
        ...prev,
        totalPaid: prev.totalPaid + paymentAmount
      }));
      
      setIsProcessingPayment(false);
      setIsPaymentModalOpen(false);
      setPaymentAmount(0);
      alert('Pagamento registrado com sucesso no histórico!');
    }, 1200);
  };

  // KPIs simulados para o parceiro
  const stats = [
    { label: 'Cliques Únicos', value: '4.250', color: 'text-indigo-600', trend: '+12%' },
    { label: 'Vendas Finalizadas', value: '154', color: 'text-emerald-600', trend: '+18%' },
    { label: 'Total Comissionado', value: `R$ ${affiliateData.totalEarned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'text-gray-900', trend: '' },
    { label: 'Saldo Pago', value: `R$ ${affiliateData.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'text-emerald-500', trend: '' },
  ];

  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1";
  const inputClasses = "w-full px-5 py-4 rounded-2xl border border-gray-200 bg-slate-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-bold";

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Link to="/organizador/afiliados" className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2 hover:underline flex items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i> Voltar para Lista
            </Link>
            <div className="flex items-center gap-4 mt-2">
               <img src={`https://ui-avatars.com/api/?name=${affiliateData.name}&background=6366f1&color=fff`} className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white" alt="" />
               <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Relatório: {affiliateData.name}</h1>
                  <p className="text-gray-500 text-sm font-medium">Controle de indicações e pagamentos • <strong>{affiliateData.code}</strong></p>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="flex gap-2 p-1 bg-gray-200/50 rounded-2xl w-fit">
                {['7d', '30d', '90d', 'Anual'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      period === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
             </div>
             <Button onClick={() => setIsPaymentModalOpen(true)} className="shadow-lg shadow-indigo-100">
                <i className="fa-solid fa-money-bill-transfer mr-2"></i> Registrar Pagamento
             </Button>
          </div>
        </header>

        {/* Pending Balance Hero Widget */}
        <div className="mb-8 p-8 bg-white border-2 border-rose-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-rose-50/50">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center text-2xl shadow-inner">
                 <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
              <div>
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-1">Saldo a Pagar (Pendente)</p>
                 <h2 className="text-4xl font-black text-rose-600 tracking-tighter">R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
              </div>
           </div>
           <div className="text-center md:text-right">
              <p className="text-xs text-gray-500 font-medium mb-2">Este valor é calculado subtraindo o acumulado histórico pelo total já pago registrado.</p>
              <button 
                onClick={() => { setPaymentAmount(pendingAmount); setIsPaymentModalOpen(true); }}
                className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
              >
                Pagar valor total pendente &rarr;
              </button>
           </div>
        </div>

        {/* Funnel KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border shadow-sm group hover:border-indigo-100 transition duration-300">
               <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                  {s.trend && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{s.trend}</span>}
               </div>
               <h3 className={`text-3xl font-black ${s.color}`}>{s.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Visual Chart Simulation */}
           <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Fluxo de Vendas Diário</h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase">
                   <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Cliques</div>
                   <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Vendas</div>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-2 px-2">
                 {[40, 65, 30, 85, 45, 90, 60, 75, 40, 55, 80, 95].map((v, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                      <div className="w-full flex justify-center gap-0.5 h-full items-end">
                         <div className="w-1.5 bg-indigo-100 rounded-t-full transition-all duration-700 group-hover:bg-indigo-300" style={{ height: `${v}%` }}></div>
                         <div className="w-1.5 bg-emerald-500 rounded-t-full transition-all duration-700 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ height: `${v * 0.4}%` }}></div>
                      </div>
                      <span className="text-[8px] font-black text-gray-300 uppercase">D {i+1}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Payment History sidebar */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm overflow-hidden flex flex-col h-full">
                 <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Histórico de Repasses</h3>
                 <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    {paymentHistory.map(pay => (
                      <div key={pay.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group relative">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded border uppercase tracking-widest">{pay.method}</span>
                            <span className="text-[9px] font-black text-gray-300 uppercase">{pay.date.split(' ')[0]}</span>
                         </div>
                         <p className="text-lg font-black text-emerald-600">R$ {pay.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                         <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1 line-clamp-2">{pay.note}</p>
                      </div>
                    ))}
                    {paymentHistory.length === 0 && (
                      <div className="text-center py-10 opacity-30 italic text-sm">Nenhum pagamento registrado.</div>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Transactions list by this affiliate */}
        <div className="mt-8 bg-white rounded-[3rem] border shadow-sm overflow-hidden">
           <div className="px-10 py-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Vendas Recentes do Parceiro</h3>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Exportar Extrato</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead className="bg-white border-b">
                    <tr>
                       <th className="px-10 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Data / Hora</th>
                       <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Comprador</th>
                       <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Evento</th>
                       <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Valor Venda</th>
                       <th className="px-10 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Comissão ({affiliateData.commission}%)</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y">
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="hover:bg-slate-50/50 transition">
                         <td className="px-10 py-5 text-gray-500 font-medium">22/08/2024 às 14:32</td>
                         <td className="px-6 py-5 font-bold text-gray-900">Comprador Exemplo {i}</td>
                         <td className="px-6 py-5 text-gray-600">Festival de Verão 2024</td>
                         <td className="px-6 py-5 text-right font-bold">R$ 120,00</td>
                         <td className="px-10 py-5 text-right font-black text-emerald-600">R$ 6,00</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Modal: Registrar Pagamento Manual */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Registrar Pagamento de Comissão"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleRegisterPayment} isLoading={isProcessingPayment} className="shadow-lg shadow-indigo-100">Registrar no Histórico</Button>
          </>
        }
      >
        <div className="space-y-6 text-left p-1">
           <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
              <i className="fa-solid fa-circle-info text-indigo-600 mt-1"></i>
              <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                Use esta ferramenta para marcar como pago os valores que você enviou por fora da plataforma (PIX, Transferência, etc). Isto atualizará o saldo pendente do parceiro.
              </p>
           </div>

           <form onSubmit={handleRegisterPayment} className="space-y-4">
              <div>
                 <label className={labelClasses}>Valor Pago (R$)</label>
                 <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">R$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      className={`${inputClasses} pl-12`} 
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(Number(e.target.value))}
                      placeholder="0,00"
                    />
                 </div>
              </div>

              <div>
                 <label className={labelClasses}>Método de Pagamento</label>
                 <select 
                   className={inputClasses}
                   value={paymentMethod}
                   onChange={e => setPaymentMethod(e.target.value)}
                 >
                    <option value="PIX">PIX</option>
                    <option value="Transferência">Transferência Bancária</option>
                    <option value="Dinheiro">Dinheiro (Espécie)</option>
                    <option value="Outros">Outros</option>
                 </select>
              </div>

              <div className="pt-4 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Resumo de Saldo Pós-Pagamento</p>
                 <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-bold text-gray-500">Saldo Atual Pendente:</span>
                    <span className="text-sm font-black text-rose-500">R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between items-center mt-1 border-b border-gray-100 pb-2">
                    <span className="text-xs font-bold text-gray-500">Valor a Registrar:</span>
                    <span className="text-sm font-black text-indigo-600">- R$ {paymentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-black text-gray-900 uppercase">Novo Saldo Pendente:</span>
                    <span className="text-sm font-black text-gray-900">R$ {Math.max(0, pendingAmount - paymentAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                 </div>
              </div>
           </form>
        </div>
      </Modal>
    </div>
  );
};
