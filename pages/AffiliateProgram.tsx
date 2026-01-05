
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const AffiliateProgram: React.FC = () => {
  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-500 text-left">
      {/* Hero Section */}
      <section className="bg-slate-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Evelou Partners</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              Transforme sua <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">influência em renda.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium mb-10">
              Seja um afiliado Evelou e ganhe comissões recomendando os melhores eventos do Brasil para sua audiência.
            </p>
            <Link to="/cadastro">
              <Button size="lg" className="px-12 !py-5 shadow-2xl shadow-indigo-500/20">Quero ser um Parceiro</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Como funciona?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Um processo simples e transparente para você focar no que importa: divulgar e lucrar.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Cadastre-se', desc: 'Crie sua conta gratuita em segundos e escolha os eventos que combinam com seu público.', icon: 'fa-user-plus' },
              { step: '02', title: 'Divulgue seu Link', desc: 'Use seu link exclusivo em redes sociais, grupos de WhatsApp ou e-mail marketing.', icon: 'fa-share-nodes' },
              { step: '03', title: 'Ganhe Comissões', desc: 'Receba uma porcentagem de cada ingresso vendido através da sua recomendação.', icon: 'fa-sack-dollar' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">{item.step}</span>
                <h3 className="text-xl font-black text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-8 leading-tight">Por que ser um afiliado Evelou?</h2>
              <div className="space-y-8">
                {[
                  { title: 'Pagamento Ágil', desc: 'Receba suas comissões diretamente na sua conta bancária sem burocracia.' },
                  { title: 'Dashboard Completo', desc: 'Acompanhe cliques, vendas e comissões em tempo real com transparência total.' },
                  { title: 'Eventos Exclusivos', desc: 'Tenha acesso a pré-vendas e lotes exclusivos para sua audiência.' },
                  { title: 'Suporte Dedicado', desc: 'Um time de especialistas pronto para ajudar você a converter mais.' },
                ].map((b, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                      <i className="fa-solid fa-check text-[10px]"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{b.title}</h4>
                      <p className="text-sm text-gray-500 font-medium">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                  <h3 className="text-3xl font-black mb-6">Comece agora mesmo!</h3>
                  <p className="text-indigo-100 mb-10 font-medium leading-relaxed">Não perca a oportunidade de monetizar sua rede de contatos com a plataforma que mais cresce no setor.</p>
                  <Link to="/cadastro">
                    <Button variant="secondary" className="w-full !py-5 font-black uppercase tracking-widest">Criar Conta Gratuita</Button>
                  </Link>
                  <i className="fa-solid fa-rocket absolute -right-8 -bottom-8 text-[12rem] text-white/5 rotate-12"></i>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-12 text-center">Dúvidas Frequentes</h2>
          <div className="space-y-6">
            {[
              { q: 'Quanto eu posso ganhar?', a: 'Não há limites. Suas comissões dependem apenas do volume de vendas que você gerar através do seu link.' },
              { q: 'Preciso pagar para participar?', a: 'Não. O programa de afiliados é 100% gratuito.' },
              { q: 'Como recebo meus ganhos?', a: 'Os valores são creditados no seu saldo Evelou e podem ser resgatados via PIX ou transferência bancária conforme os prazos de repasse.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
