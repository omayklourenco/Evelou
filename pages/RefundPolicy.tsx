
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const RefundPolicy: React.FC = () => {
  const rules = [
    {
      icon: 'fa-calendar-check',
      title: 'Regra dos 7 Dias',
      desc: 'Conforme o Código de Defesa do Consumidor, você tem até 7 dias após a compra para desistir e receber 100% do valor de volta.'
    },
    {
      icon: 'fa-clock',
      title: 'Limite de 48 horas',
      desc: 'A solicitação deve ser feita no máximo até 48 horas antes do início do evento para ser processada automaticamente.'
    },
    {
      icon: 'fa-ticket',
      title: 'Ingressos Utilizados',
      desc: 'Uma vez que o check-in no evento foi realizado ou o evento ocorreu, o ingresso perde o direito ao estorno.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-500 text-left">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-24 pb-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Transparência Evelou</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">Regras de Estorno</h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto">
            Saiba como funcionam os cancelamentos, reembolsos e seus direitos como consumidor na nossa plataforma.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Quick Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {rules.map((rule, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-md transition group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                <i className={`fa-solid ${rule.icon}`}></i>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3">{rule.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{rule.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Detailed Text */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Política Geral de Cancelamento</h2>
              <div className="prose prose-indigo max-w-none text-gray-600 space-y-4">
                <p>
                  A <strong>Evelou</strong> preza pela satisfação dos nossos clientes e pela conformidade com a legislação vigente. Nossa política de estorno é baseada no <strong>Artigo 49 da Lei 8.078/09 (Código de Defesa do Consumidor)</strong>.
                </p>
                <p>
                  O consumidor pode desistir da compra em até 7 (sete) dias corridos a partir da data da transação. Caso esse prazo seja respeitado, o reembolso será integral, incluindo a taxa de serviço.
                </p>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[3rem] border shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                Como solicitar seu reembolso
              </h3>
              <div className="space-y-8">
                {[
                  { step: '1', title: 'Acesse sua conta', text: 'Faça login na Evelou e vá até o menu "Meus Pedidos".' },
                  { step: '2', title: 'Selecione o pedido', text: 'Clique no botão de detalhes (seta) do pedido que deseja cancelar.' },
                  { step: '3', title: 'Solicitar Cancelamento', text: 'Se o prazo legal for respeitado, o botão "Solicitar Estorno" estará visível.' },
                  { step: '4', title: 'Acompanhe o status', text: 'O valor retornará pelo mesmo método de pagamento em até 2 faturas (cartão) ou em minutos (Pix).' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <span className="text-2xl font-black text-gray-100">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500 font-medium">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
               <h3 className="text-lg font-black text-indigo-900 mb-4">Sobre a Taxa de Serviço</h3>
               <p className="text-sm text-indigo-800 leading-relaxed font-medium">
                 A taxa de serviço da Evelou é destinada à manutenção da infraestrutura de pagamentos e tecnologia. Em cancelamentos solicitados **após os 7 dias legais do CDC**, mas ainda dentro das regras do organizador, a taxa de serviço não será reembolsada, sendo devolvido apenas o valor de face do ingresso.
               </p>
            </section>
          </div>

          {/* Sidebar / Info */}
          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-white p-8 rounded-[3rem] border shadow-sm">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Prazos de Devolução</h3>
                <div className="space-y-6">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><i className="fa-solid fa-bolt"></i></div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Via PIX</p>
                        <p className="text-sm font-bold text-gray-700">Imediato após aprovação</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><i className="fa-solid fa-credit-card"></i></div>
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Via Cartão</p>
                        <p className="text-sm font-bold text-gray-700">Em até 2 faturas subsequentes</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold mb-4">Ainda com dúvidas?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-8">
                    Se o seu evento foi cancelado ou adiado e você não sabe como proceder, fale com nosso time.
                  </p>
                  <Link to="/ajuda">
                    <Button variant="secondary" className="w-full" size="sm">Abrir Chamado</Button>
                  </Link>
                </div>
                <i className="fa-solid fa-headset absolute -right-6 -bottom-6 text-7xl text-white/5 rotate-12"></i>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
