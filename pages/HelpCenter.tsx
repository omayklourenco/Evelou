
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
// Added missing import for Badge component
import { Badge } from '../components/ui/Badge';

interface FAQItem {
  question: string;
  answer: string;
  category: 'buyer' | 'organizer';
  subcategory?: string;
}

export const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'buyer' | 'organizer'>('buyer');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    // --- COMPRADOR ---
    {
      category: 'buyer',
      subcategory: 'Ingressos',
      question: 'Onde encontro meus ingressos após a compra?',
      answer: 'Seus ingressos ficam disponíveis imediatamente na sua conta Evelou, no menu "Meus Ingressos". Além disso, uma cópia em PDF é enviada automaticamente para o e-mail cadastrado. Certifique-se de verificar sua caixa de spam caso não receba em até 5 minutos.'
    },
    {
      category: 'buyer',
      subcategory: 'Pagamentos',
      question: 'Quais as formas de pagamento aceitas?',
      answer: 'Aceitamos PIX (com aprovação instantânea), Cartão de Crédito (parcelamento em até 12x dependendo do evento) e Boleto Bancário. Lembre-se que boletos podem levar até 3 dias úteis para compensar.'
    },
    {
      category: 'buyer',
      subcategory: 'Cancelamento',
      question: 'Como solicitar o estorno do meu pedido?',
      answer: 'De acordo com o Código de Defesa do Consumidor, você tem até 7 dias após a compra para desistir e receber 100% do valor de volta, desde que faltem mais de 48h para o início do evento. Acesse "Meus Pedidos", selecione a compra e clique em "Solicitar Estorno".'
    },
    {
      category: 'buyer',
      subcategory: 'Acesso',
      question: 'Preciso imprimir o ingresso para entrar no evento?',
      answer: 'Não é necessário! A Evelou foca em sustentabilidade. Basta apresentar o QR Code na tela do seu celular através do nosso site ou aplicativo mobile. O brilho da tela deve estar no máximo para facilitar a leitura.'
    },
    {
      category: 'buyer',
      subcategory: 'Afiliados',
      question: 'Como recebo minhas comissões como afiliado?',
      answer: 'Na Evelou, os pagamentos de comissão de afiliados são realizados manualmente pelos produtores do evento. Você pode acompanhar seu "Saldo Pendente" no seu Painel de Afiliado. Assim que o produtor realizar o pagamento (via PIX ou transferência), ele marcará como pago no sistema e seu saldo será atualizado.'
    },

    // --- ORGANIZADOR ---
    {
      category: 'organizer',
      subcategory: 'Financeiro',
      question: 'Quais são as taxas cobradas pela plataforma?',
      answer: 'A Evelou cobra uma taxa de serviço padrão de 10% sobre cada ingresso vendido. Não cobramos taxa de adesão, mensalidade ou taxa para publicação de eventos gratuitos. Para grandes volumes, entre em contato com nosso time comercial para taxas personalizadas.'
    },
    {
      category: 'organizer',
      subcategory: 'Financeiro',
      question: 'Quando recebo o dinheiro das minhas vendas?',
      answer: 'O prazo padrão para liberação do saldo é de D+30 (30 dias após cada venda) ou D+2 (2 dias após a realização do evento), conforme sua configuração de conta. O valor é transferido automaticamente para sua conta bancária cadastrada via Stripe Connect.'
    },
    {
      category: 'organizer',
      subcategory: 'Portaria',
      question: 'Como realizar o check-in dos participantes?',
      answer: 'A maneira mais eficiente é através do Aplicativo Evelou (disponível para iOS e Android). Faça login como organizador, selecione o evento e use a câmera para escanear os ingressos. O sistema funciona offline caso a internet caia durante o evento.'
    },
    {
      category: 'organizer',
      subcategory: 'Afiliados',
      question: 'Como gerenciar o pagamento dos meus afiliados?',
      answer: 'Como o pagamento não é automático pela plataforma, você deve acessar o "Relatório de Afiliados" no seu painel. Lá você verá o "Saldo Pendente" de cada parceiro. Após realizar o pagamento por fora (ex: via seu banco), você deve registrar o pagamento no botão "Registrar Pagamento" para manter seu controle contábil e informar o afiliado.'
    },
    {
      category: 'organizer',
      subcategory: 'Privacidade',
      question: 'Como configurar o Pixel do Facebook ou Google Analytics?',
      answer: 'Acesse o menu "Integrações" ou "Pixels" dentro do painel do seu evento. Basta inserir o ID do seu Pixel ou o código do GA4. A Evelou dispara automaticamente eventos de PageView, InitiateCheckout e Purchase (Compra).'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.category === activeCategory && 
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     faq.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-500">
      {/* Search Hero */}
      <section className="bg-indigo-600 pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Como podemos ajudar?</h1>
          <div className="relative max-w-2xl mx-auto">
            <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
            <input 
              type="text" 
              placeholder="Pesquise por termos como 'estorno', 'repasse', 'afiliado'..." 
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white border-none shadow-2xl focus:ring-4 focus:ring-indigo-400/30 outline-none text-gray-900 text-lg font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-center gap-3">
             <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Buscas comuns:</span>
             <button onClick={() => setSearchTerm('estorno')} className="text-white text-xs font-black underline hover:text-indigo-200">Estorno</button>
             <button onClick={() => setSearchTerm('afiliado')} className="text-white text-xs font-black underline hover:text-indigo-200">Afiliados</button>
             <button onClick={() => setSearchTerm('pix')} className="text-white text-xs font-black underline hover:text-indigo-200">Pix</button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar / Navigation */}
          <aside className="lg:col-span-1 space-y-4">
             <div className="bg-white p-2 rounded-[2.5rem] border shadow-sm flex flex-col gap-1">
                <button 
                  onClick={() => { setActiveCategory('buyer'); setOpenFaq(null); }}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] font-bold text-sm transition-all ${
                    activeCategory === 'buyer' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <i className="fa-solid fa-user-tag text-lg"></i> Sou Comprador
                </button>
                <button 
                  onClick={() => { setActiveCategory('organizer'); setOpenFaq(null); }}
                  className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] font-bold text-sm transition-all ${
                    activeCategory === 'organizer' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <i className="fa-solid fa-briefcase text-lg"></i> Sou Organizador
                </button>
             </div>

             <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-black text-emerald-900 mb-2">Status da Rede</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Sistemas OK</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 leading-tight font-medium">Todas as integrações e gateways estão operando normalmente.</p>
                </div>
                <i className="fa-solid fa-signal absolute -right-4 -bottom-4 text-7xl text-emerald-500/10 group-hover:scale-110 transition duration-500"></i>
             </div>

             <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                <h4 className="font-black text-xs uppercase tracking-widest text-indigo-400 mb-4">Ouvidoria</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">Não teve sua dúvida resolvida por aqui?</p>
                <Button variant="secondary" size="sm" className="w-full !text-[10px] uppercase font-black">Abrir Chamado</Button>
                <i className="fa-solid fa-headset absolute -right-4 -bottom-4 text-6xl text-white/5 rotate-12"></i>
             </div>
          </aside>

          {/* FAQ Content Area */}
          <main className="lg:col-span-3 space-y-12 text-left">
            
            {/* FAQ Accordion */}
            <div className="bg-white rounded-[3rem] border shadow-sm p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <i className="fa-solid fa-circle-question"></i>
                  </div>
                  Principais Dúvidas
                </h3>
                <Badge variant="gray">{activeCategory === 'buyer' ? 'Portal do Comprador' : 'Portal do Organizador'}</Badge>
              </div>

              <div className="space-y-4">
                {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
                  <div key={idx} className={`border rounded-[2rem] transition-all overflow-hidden ${openFaq === idx ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-8 py-6 flex items-center justify-between gap-4 text-left group"
                    >
                      <div className="flex flex-col gap-1">
                        {faq.subcategory && <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{faq.subcategory}</span>}
                        <span className={`font-bold transition-colors ${openFaq === idx ? 'text-indigo-600' : 'text-gray-700 group-hover:text-indigo-600'}`}>{faq.question}</span>
                      </div>
                      <i className={`fa-solid fa-chevron-down text-xs text-gray-300 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-indigo-600' : ''}`}></i>
                    </button>
                    {openFaq === idx && (
                      <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                        <div className="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-6 font-medium">
                          {faq.answer.split('\n').map((para, pidx) => (
                            <p key={pidx} className="mb-4">{para}</p>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Essa resposta foi útil?</p>
                           <div className="flex gap-2">
                             <button className="w-8 h-8 rounded-lg bg-white border text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition flex items-center justify-center shadow-sm"><i className="fa-solid fa-thumbs-up text-[10px]"></i></button>
                             <button className="w-8 h-8 rounded-lg bg-white border text-gray-400 hover:text-rose-600 hover:border-rose-200 transition flex items-center justify-center shadow-sm"><i className="fa-solid fa-thumbs-down text-[10px]"></i></button>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="py-24 text-center text-gray-400 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-3xl opacity-20">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <p className="font-bold text-lg text-gray-500">Ops! Não encontramos resultados para sua busca.</p>
                    <p className="text-sm mt-2">Tente usar palavras-chave mais simples.</p>
                    <button onClick={() => setSearchTerm('')} className="mt-6 text-indigo-600 font-black text-xs uppercase tracking-widest underline">Ver todas as dúvidas</button>
                  </div>
                )}
              </div>
            </div>

            {/* Support Cards */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900 px-4 tracking-tight">Precisa de atendimento direto?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm text-center group hover:border-indigo-600 transition duration-300">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:scale-110 transition duration-500 shadow-inner">
                      <i className="fa-solid fa-comments"></i>
                    </div>
                    <h4 className="font-black text-gray-900 mb-2">Chat em Tempo Real</h4>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed font-medium">Fale com um especialista agora mesmo.</p>
                    <div className="pt-4 border-t">
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-4">Esperando: ~2 min</span>
                      <Button variant="outline" size="sm" className="w-full !rounded-xl !text-xs !font-black uppercase">Iniciar Chat</Button>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm text-center group hover:border-emerald-600 transition duration-300">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:scale-110 transition duration-500 shadow-inner">
                      <i className="fa-brands fa-whatsapp"></i>
                    </div>
                    <h4 className="font-black text-gray-900 mb-2">WhatsApp Evelou</h4>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed font-medium">Atendimento rápido para dúvidas de compra.</p>
                    <div className="pt-4 border-t">
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-4">Disponível Agora</span>
                      <Button variant="outline" size="sm" className="w-full !rounded-xl !text-xs !font-black uppercase group-hover:!bg-emerald-600 group-hover:!text-white group-hover:!border-emerald-600">Mandar Mensagem</Button>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm text-center group hover:border-slate-900 transition duration-300">
                    <div className="w-16 h-16 bg-slate-50 text-slate-600 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-6 group-hover:scale-110 transition duration-500 shadow-inner">
                      <i className="fa-solid fa-envelope-open-text"></i>
                    </div>
                    <h4 className="font-black text-gray-900 mb-2">Ticket de Suporte</h4>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed font-medium">Para casos complexos ou denúncias.</p>
                    <div className="pt-4 border-t">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-4">Resposta em até 12h</span>
                      <Button variant="outline" size="sm" className="w-full !rounded-xl !text-xs !font-black uppercase">Abrir Ticket</Button>
                    </div>
                 </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
