
import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  const sections = [
    { id: 'coleta', title: '1. Dados Coletados' },
    { id: 'uso', title: '2. Uso das Informações' },
    { id: 'cookies', title: '3. Cookies e Rastreamento' },
    { id: 'compartilhamento', title: '4. Compartilhamento de Dados' },
    { id: 'direitos', title: '5. Seus Direitos (LGPD)' },
    { id: 'seguranca', title: '6. Segurança e Armazenamento' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 animate-in fade-in duration-500">
      <section className="bg-indigo-50 border-b py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-indigo-600 text-2xl">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Política de Privacidade</h1>
          <p className="text-gray-500 font-medium">Última atualização: 24 de Maio de 2024</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Index Sidebar */}
          <aside className="lg:w-64 shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Privacidade</p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 max-w-3xl text-left prose prose-indigo prose-lg">
            <section id="coleta" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">1. Dados que Coletamos</h2>
              <p className="text-gray-600 leading-relaxed">
                Coletamos informações necessárias para a prestação de nossos serviços, tais como:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4 font-medium">
                <li>Nome completo, E-mail, CPF e telefone (para cadastro e compra).</li>
                <li>Dados de pagamento (tokenizados via Stripe - nunca armazenamos números de cartão).</li>
                <li>Endereço IP, tipo de navegador e geolocalização aproximada.</li>
                <li>Preferências de categorias de eventos.</li>
              </ul>
            </section>

            <section id="uso" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">2. Como Usamos as Informações</h2>
              <p className="text-gray-600 leading-relaxed">
                Seus dados são utilizados para processar pedidos, emitir ingressos nominais, prevenir fraudes e enviar comunicações importantes sobre os eventos adquiridos.
              </p>
              <p className="text-gray-600 mt-4">
                Também utilizamos dados anônimos para análises estatísticas e melhoria contínua da experiência do usuário na plataforma.
              </p>
            </section>

            <section id="cookies" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">3. Cookies e Rastreamento</h2>
              <p className="text-gray-600 leading-relaxed">
                Utilizamos cookies para manter sua sessão ativa, lembrar suas preferências e integrar com ferramentas de analytics (Google Analytics) e marketing (Meta Pixel). Você pode configurar seu navegador para recusar cookies, mas isso pode afetar certas funcionalidades do site.
              </p>
            </section>

            <section id="compartilhamento" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">4. Compartilhamento de Dados</h2>
              <p className="text-gray-600 leading-relaxed">
                Não vendemos seus dados. Eles são compartilhados apenas com:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li><strong>Organizadores:</strong> Apenas os dados necessários para conferência de entrada (nome e CPF).</li>
                <li><strong>Gateway de Pagamento (Stripe):</strong> Para processamento de transações.</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial.</li>
              </ul>
            </section>

            <section id="direitos" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">5. Seus Direitos (LGPD)</h2>
              <p className="text-gray-600 leading-relaxed">
                Em conformidade com a Lei Geral de Proteção de Dados, você tem o direito de:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4 font-medium italic">
                <li>Confirmar a existência de tratamento de seus dados.</li>
                <li>Acessar, corrigir ou solicitar a exclusão de seus dados pessoais.</li>
                <li>Revogar o consentimento para comunicações de marketing a qualquer momento.</li>
              </ul>
            </section>

            <section id="seguranca" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">6. Segurança e Armazenamento</h2>
              <p className="text-gray-600 leading-relaxed">
                Adotamos medidas técnicas de segurança, como criptografia SSL e firewalls, para proteger seus dados. Armazenamos as informações em servidores seguros na nuvem (AWS/Google Cloud) pelo tempo necessário para cumprir as obrigações legais e contratuais.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
