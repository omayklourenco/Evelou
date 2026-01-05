
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_EVENTS } from '../../constants';

export const AffiliateDashboard: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dados mockados do comprador como afiliado
  const stats = {
    totalEarned: 450.00,
    totalPaid: 320.00,
    pendingAmount: 130.00,
    salesCount: 12,
    cliques: 450
  };

  const campaigns = [
    { 
      eventId: '1', 
      name: 'Festival de Verão 2024', 
      commission: 5, 
      code: 'MARCOS10',
      status: 'active'
    },
    { 
      eventId: '2', 
      name: 'Workshop React Avançado', 
      commission: 8, 
      code: 'MARCOSDEV',
      status: 'active'
    }
  ];

  const commissions = [
    { id: 'c1', date: '2024-08-20', event: 'Festival de Verão 2024', value: 6.00, status: 'approved' },
    { id: 'c2', date: '2024-08-18', event: 'Festival de Verão 2024', value: 6.00, status: 'approved' },
    { id: 'c3', date: '2024-08-15', event: 'Workshop React Avançado', value: 15.76, status: 'approved' },
  ];

  const handleCopyLink = (code: string, id: string) => {
    const link = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="text-left animate-in fade-in duration-500 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Painel de Afiliado</h1>
        <p className="text-gray-500 text-sm mt-1">Acompanhe suas indicações e comissões ganhas.</p>
      </header>

      {/* Cards de Saldo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-indigo-100 transition-all">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Saldo a Receber</p>
          <h3 className="text-3xl font-black text-rose-500">R$ {stats.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-3">Aguardando pagamento do produtor</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Já Pago</p>
          <h3 className="text-3xl font-black text-emerald-600">R$ {stats.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-3">Recebido via PIX/Transferência</p>
        </div>
        <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Vendas Realizadas</p>
            <h3 className="text-3xl font-black">{stats.salesCount}</h3>
            <p className="text-[10px] text-indigo-200 font-bold uppercase mt-3">{stats.cliques} cliques gerados</p>
          </div>
          <i className="fa-solid fa-sack-dollar absolute -right-4 -bottom-4 text-7xl text-white/5 rotate-12"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Campanhas Ativas */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest">Suas Campanhas Ativas</h3>
              <Badge variant="success">Afiliado Ativo</Badge>
            </div>
            <div className="divide-y">
              {campaigns.map(camp => (
                <div key={camp.eventId} className="p-8 hover:bg-gray-50/50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-widest">Comissão: {camp.commission}%</span>
                       <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-mono">{camp.code}</span>
                    </div>
                    <h4 className="text-lg font-black text-gray-900 leading-tight">{camp.name}</h4>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleCopyLink(camp.code, camp.eventId)}
                      className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copiedId === camp.eventId ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                      <i className={`fa-solid ${copiedId === camp.eventId ? 'fa-check' : 'fa-link'}`}></i>
                      {copiedId === camp.eventId ? 'Link Copiado' : 'Copiar Link'}
                    </button>
                    <Button variant="outline" size="sm" className="!rounded-2xl !py-3">
                       Material de Apoio
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b bg-gray-50/50">
              <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest">Comissões Recentes</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                      <th className="px-4 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Evento</th>
                      <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Valor Ganho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {commissions.map(comm => (
                      <tr key={comm.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-4 text-gray-500 font-medium">{new Date(comm.date).toLocaleDateString()}</td>
                        <td className="px-4 py-4 font-bold text-gray-900">{comm.event}</td>
                        <td className="px-8 py-4 text-right font-black text-emerald-600">R$ {comm.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                 <i className="fa-solid fa-circle-info text-lg"></i>
              </div>
              <h4 className="font-black text-indigo-900 text-sm uppercase tracking-widest mb-2">Como recebo?</h4>
              <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                Os pagamentos de afiliados na Evelou são realizados manualmente pelos produtores de cada evento.
              </p>
              <p className="text-xs text-indigo-800 leading-relaxed font-medium mt-4">
                Caso você tenha um saldo pendente há muito tempo, recomendamos entrar em contato com o organizador através do e-mail de suporte na página do evento.
              </p>
           </div>

           <div className="bg-white rounded-[2.5rem] border shadow-sm p-8">
              <h4 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-6">Dicas de Divulgação</h4>
              <ul className="space-y-4">
                 {[
                   { icon: 'fa-whatsapp', text: 'Compartilhe em grupos de interesse no WhatsApp.' },
                   { icon: 'fa-instagram', text: 'Coloque seu link na bio ou nos Stories.' },
                   { icon: 'fa-envelope', text: 'Envie para sua lista de contatos por e-mail.' },
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><i className={`fa-brands ${tip.icon}`}></i></div>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{tip.text}</p>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
              <h4 className="font-black text-sm mb-2 relative z-10">Novos Eventos</h4>
              <p className="text-xs text-slate-400 mb-6 relative z-10">Confira a vitrine pública e solicite afiliação para novos eventos que combinam com você.</p>
              <Button variant="secondary" size="sm" className="w-full relative z-10 !text-[10px] font-black uppercase">Ver Vitrine de Eventos</Button>
              <i className="fa-solid fa-bullhorn absolute -right-6 -bottom-6 text-8xl text-white opacity-5 rotate-12"></i>
           </div>
        </div>
      </div>
    </div>
  );
};
