
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de envio de lead comercial
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium";
  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block";

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 animate-in zoom-in-95 duration-500">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-50">
            <i className="fa-solid fa-paper-plane text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Proposta enviada!</h1>
          <p className="text-gray-500 leading-relaxed mb-10 font-medium">
            Obrigado pelo interesse. Um de nossos gerentes de conta entrará em contato em até 24 horas úteis para discutir como a Evelou pode escalar seus eventos.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>Enviar outra mensagem</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-left animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-slate-950 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-900 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Evelou for Enterprise</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              A tecnologia que seus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">eventos merecem.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              Taxas competitivas, gestão em tempo real e a melhor experiência de compra do mercado para o seu público.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section - Fixed Spacing */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border p-8 md:p-12">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Fale com um especialista</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Seu Nome</label>
                  <input type="text" required placeholder="Ex: Rodrigo Silva" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>E-mail Corporativo</label>
                  <input type="email" required placeholder="rodrigo@empresa.com" className={inputClasses} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Nome da Empresa / Organizadora</label>
                  <input type="text" required placeholder="Evelou Eventos LTDA" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Telefone / WhatsApp</label>
                  <input type="tel" required placeholder="(00) 00000-0000" className={inputClasses} />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Volume estimado de ingressos/mês</label>
                <select required className={inputClasses}>
                  <option value="">Selecione uma faixa</option>
                  <option value="1">Até 500 ingressos</option>
                  <option value="2">500 a 2.000 ingressos</option>
                  <option value="3">2.000 a 10.000 ingressos</option>
                  <option value="4">Acima de 10.000 ingressos</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Como podemos ajudar?</label>
                <textarea rows={4} required placeholder="Conte-nos brevemente sobre seus próximos eventos..." className={`${inputClasses} resize-none`}></textarea>
              </div>

              <div className="pt-4">
                <Button className="w-full !py-5 shadow-xl shadow-indigo-100" size="lg" isLoading={loading} type="submit">
                  Solicitar Proposta Comercial
                </Button>
                <p className="text-center text-[10px] text-gray-400 mt-6 uppercase font-bold tracking-widest">
                  Ao enviar, você concorda com nossa política de privacidade.
                </p>
              </div>
            </form>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Por que a Evelou?</h3>
              
              <div className="space-y-10">
                 {[
                   { icon: 'fa-percent', title: 'Taxas Flexíveis', desc: 'Negocie condições especiais baseadas no seu volume de vendas anual.' },
                   { icon: 'fa-headset', title: 'Gerente de Contas', desc: 'Atendimento prioritário via WhatsApp para grandes organizadores.' },
                   { icon: 'fa-chart-pie', title: 'Data Analytics', desc: 'Acesso a relatórios detalhados de comportamento e origem de tráfego.' },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-6 group">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <i className={`fa-solid ${item.icon} text-xl`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 space-y-8">
               <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Contatos Diretos</h3>
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-400 shadow-sm border border-gray-100">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <span>comercial@evelou.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-400 shadow-sm border border-gray-100">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <span>Av. Paulista, 1000 - São Paulo, SP</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-400 shadow-sm border border-gray-100">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <span>Seg a Sex, das 09h às 18h</span>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust Section */}
      <section className="py-24 border-t bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-16">Empresas que confiam na tecnologia Evelou</p>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
              <i className="fa-brands fa-google text-5xl"></i>
              <i className="fa-brands fa-microsoft text-5xl"></i>
              <i className="fa-brands fa-amazon text-5xl"></i>
              <i className="fa-brands fa-spotify text-5xl"></i>
              <i className="fa-brands fa-meta text-5xl"></i>
           </div>
        </div>
      </section>
    </div>
  );
};
