
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { StripeStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const FinancialDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const payouts = [
    { id: 'tr_1OpX23...', date: '2024-08-10', amount: 12450.00, status: 'paid', destination: 'Banco Itaú •••• 1234' },
    { id: 'tr_1OpA56...', date: '2024-08-03', amount: 8900.50, status: 'paid', destination: 'Banco Itaú •••• 1234' },
    { id: 'tr_1OmB89...', date: '2024-07-27', amount: 4200.00, status: 'failed', destination: 'Banco Itaú •••• 1234' },
  ];

  const getStripeInfo = () => {
    switch(user?.stripeStatus) {
      case StripeStatus.ACTIVE:
        return {
          title: 'Sua conta Stripe está ativa',
          desc: 'Seus repasses estão configurados e automáticos conforme o calendário de vendas.',
          color: 'bg-green-50 border-green-100',
          iconColor: 'bg-green-500',
          btnText: 'Painel Stripe'
        };
      case StripeStatus.RESTRICTED:
      case StripeStatus.INCOMPLETE:
        return {
          title: 'Conta Restrita - Requer Atenção',
          desc: 'Existem pendências de documentação que impedem o recebimento de valores.',
          color: 'bg-red-50 border-red-100',
          iconColor: 'bg-red-500',
          btnText: 'Resolver Pendências'
        };
      default:
        return {
          title: 'Conecte sua conta Stripe',
          desc: 'Para receber o dinheiro de suas vendas, você precisa configurar uma conta Stripe Express.',
          color: 'bg-indigo-50 border-indigo-100',
          iconColor: 'bg-indigo-600',
          btnText: 'Configurar Agora'
        };
    }
  };

  const stripeInfo = getStripeInfo();

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-500 text-sm">Gerencie seus ganhos, taxas e transferências bancárias.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <i className="fa-solid fa-file-invoice-dollar mr-2"></i> Relatório Fiscal
            </Button>
          </div>
        </header>

        {/* Stripe Connection Status */}
        <div className={`mb-8 p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${stripeInfo.color}`}>
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg ${stripeInfo.iconColor}`}>
              <i className="fa-brands fa-stripe"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{stripeInfo.title}</h3>
              <p className="text-sm text-gray-600 max-w-md">{stripeInfo.desc}</p>
            </div>
          </div>
          <Link to="/organizador/financeiro/setup">
            <Button variant={user?.stripeStatus === StripeStatus.ACTIVE ? 'outline' : 'primary'}>
              {stripeInfo.btnText}
            </Button>
          </Link>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl border shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Disponível para Repasse</p>
              <h3 className="text-3xl font-black text-gray-900">R$ 12.840,00</h3>
              <Button 
                size="sm" 
                className="mt-4 !bg-indigo-600"
                disabled={user?.stripeStatus !== StripeStatus.ACTIVE}
              >
                Solicitar Antecipação
              </Button>
            </div>
            <i className="fa-solid fa-money-bill-transfer absolute -right-4 -bottom-4 text-7xl text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity rotate-12"></i>
          </div>

          <div className="bg-white p-8 rounded-3xl border shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Vendas Pendentes</p>
            <h3 className="text-3xl font-black text-gray-400">R$ 5.200,50</h3>
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">Valores em processamento (D+30)</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border shadow-sm bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Total Ganho (Mês)</p>
            <h3 className="text-3xl font-black">R$ 45.200,50</h3>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span>+18% que o mês anterior</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payout History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Histórico de Repasses</h3>
                <button className="text-indigo-600 text-xs font-bold hover:underline">VER TUDO</button>
              </div>
              <div className="divide-y">
                {payouts.map((p) => (
                  <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        p.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <i className={`fa-solid ${p.status === 'paid' ? 'fa-arrow-down' : 'fa-circle-xmark'}`}></i>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-gray-500">{p.destination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{new Date(p.date).toLocaleDateString('pt-BR')}</p>
                      <Badge variant={p.status === 'paid' ? 'success' : 'error'}>
                        {p.status === 'paid' ? 'Concluído' : 'Falhou'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border shadow-sm p-6">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-6">Custos Operacionais</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Taxa Evelou</span>
                  <span className="text-sm font-bold text-gray-900">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Processamento Stripe</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] uppercase">Grátis</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Custo de Antecipação</span>
                  <span className="text-sm font-bold text-gray-900">2.5% ao mês</span>
                </div>
                <hr className="my-2" />
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Margem Líquida Estimada</p>
                  <p className="text-xl font-black text-indigo-900">90% <span className="text-[10px] font-medium text-indigo-700 uppercase tracking-widest">do faturamento</span></p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200">
               <h4 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                 <i className="fa-solid fa-circle-question"></i> Suporte Financeiro
               </h4>
               <p className="text-xs text-amber-800 leading-relaxed mb-4">
                 Tem dúvidas sobre prazos de repasse ou notas fiscais?
               </p>
               <button className="text-indigo-600 text-xs font-bold hover:underline">Acessar FAQ Financeiro &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
