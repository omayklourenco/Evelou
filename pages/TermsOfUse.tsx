
import React from 'react';
import { Link } from 'react-router-dom';
// Fix: Import the missing Button component
import { Button } from '../components/ui/Button';

export const TermsOfUse: React.FC = () => {
  const sections = [
    { id: 'aceite', title: '1. Aceite dos Termos' },
    { id: 'cadastro', title: '2. Cadastro e Segurança' },
    { id: 'compras', title: '3. Compras e Pagamentos' },
    { id: 'cancelamentos', title: '4. Cancelamentos e Estornos' },
    { id: 'responsabilidades', title: '5. Responsabilidades do Organizador' },
    { id: 'propriedade', title: '6. Propriedade Intelectual' },
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
      {/* Header */}
      <section className="bg-gray-50 border-b py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Termos de Uso</h1>
          <p className="text-gray-500 font-medium">Última atualização: 24 de Maio de 2024</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Index Sidebar */}
          <aside className="lg:w-64 shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Nesta Página</p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  {s.title}
                </button>
              ))}
              <hr className="my-6 border-gray-100" />
              <Link to="/ajuda">
                <button className="w-full text-left px-4 py-2 text-xs font-bold text-indigo-600 flex items-center gap-2">
                  <i className="fa-solid fa-circle-question"></i> Dúvidas? Fale conosco
                </button>
              </Link>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 max-w-3xl text-left prose prose-indigo prose-lg">
            <section id="aceite" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">1. Aceite dos Termos</h2>
              <p className="text-gray-600 leading-relaxed">
                Ao acessar e utilizar a plataforma Evelou, você concorda expressamente em cumprir e estar vinculado aos seguintes Termos de Uso. Estes termos regem o acesso aos nossos serviços, incluindo nosso site, aplicativos móveis e ferramentas de gestão de eventos.
              </p>
              <p className="text-gray-600 mt-4">
                Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.
              </p>
            </section>

            <section id="cadastro" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">2. Cadastro e Segurança</h2>
              <p className="text-gray-600 leading-relaxed">
                Para utilizar certas funcionalidades, você deve criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li>Você deve fornecer informações precisas e completas.</li>
                <li>Apenas maiores de 18 anos podem criar contas de Organizador.</li>
                <li>Contas suspeitas de fraude serão suspensas imediatamente para auditoria.</li>
              </ul>
            </section>

            <section id="compras" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">3. Compras e Pagamentos</h2>
              <p className="text-gray-600 leading-relaxed">
                A Evelou atua como intermediária na venda de ingressos. Os pagamentos são processados via Stripe ou outros parceiros homologados.
              </p>
              <p className="text-gray-600 mt-4">
                Taxas de serviço podem ser aplicadas ao valor total da compra. Estas taxas são claramente exibidas no momento do checkout e não são reembolsáveis em caso de cancelamento fora do prazo legal.
              </p>
            </section>

            <section id="cancelamentos" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">4. Cancelamentos e Estornos</h2>
              <p className="text-gray-600 leading-relaxed">
                Conforme o Artigo 49 do Código de Defesa do Consumidor, o comprador tem o direito de arrependimento em até 7 dias após a compra, desde que o evento ainda não tenha ocorrido.
              </p>
              <p className="text-gray-600 mt-4">
                Para eventos que ocorrem em menos de 48 horas da data da compra, as regras de reembolso podem variar conforme a política específica de cada Organizador.
              </p>
            </section>

            <section id="responsabilidades" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">5. Responsabilidades do Organizador</h2>
              <p className="text-gray-600 leading-relaxed">
                O Organizador é o único responsável pela realização, qualidade e segurança do evento anunciado. A Evelou não se responsabiliza por adiamentos, cancelamentos de atrações ou alterações de local feitas pelo produtor.
              </p>
            </section>

            <section id="propriedade" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">6. Propriedade Intelectual</h2>
              <p className="text-gray-600 leading-relaxed">
                Todo o conteúdo da plataforma, incluindo design, códigos, marcas e logotipos, é de propriedade exclusiva da Evelou Ingressos S.A ou de seus licenciadores. O uso não autorizado destes ativos resultará em medidas judiciais cabíveis.
              </p>
            </section>

            <div className="mt-20 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                  <h4 className="font-black text-gray-900 text-lg">Ainda tem dúvidas?</h4>
                  <p className="text-sm text-gray-500">Nossa equipe de suporte jurídico e atendimento está pronta para ajudar.</p>
               </div>
               <Link to="/ajuda">
                <Button>Acessar Central de Ajuda</Button>
               </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
