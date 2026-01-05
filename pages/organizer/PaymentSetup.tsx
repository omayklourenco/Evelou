
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
// Fix: Added missing Badge import
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../stores/useAuthStore';
import { StripeStatus } from '../../types';

export const PaymentSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateStripeStatus } = useAuthStore();
  const [view, setView] = useState<'start' | 'loading_stripe' | 'restricted_dashboard' | 'success'>('start');
  const [step, setStep] = useState(1);

  // Determina a visão inicial baseada no status atual do usuário
  useEffect(() => {
    if (user?.stripeStatus === StripeStatus.ACTIVE) {
      setView('success');
    } else if (user?.stripeStatus === StripeStatus.RESTRICTED || user?.stripeStatus === StripeStatus.INCOMPLETE) {
      setView('restricted_dashboard');
    }
  }, [user]);

  const handleStripeRedirect = () => {
    setView('loading_stripe');
    // Simulando o tempo que o usuário passaria no ambiente do Stripe Connect
    setTimeout(() => {
      // Simulando retorno do Stripe com sucesso parcial (Restrito) para demonstrar fluxo de pendência
      updateStripeStatus(StripeStatus.RESTRICTED);
      setView('restricted_dashboard');
    }, 3000);
  };

  const finalizeVerification = () => {
    setView('loading_stripe');
    setTimeout(() => {
      updateStripeStatus(StripeStatus.ACTIVE);
      setView('success');
    }, 2000);
  };

  const labelClasses = "text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block";
  const cardClasses = "bg-white rounded-3xl border shadow-xl shadow-gray-200/50 overflow-hidden p-8 md:p-12";

  // --- VIEW: SIMULAÇÃO REDIRECIONAMENTO STRIPE ---
  if (view === 'loading_stripe') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 relative mb-8">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
            <i className="fa-brands fa-stripe text-3xl"></i>
          </div>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Conectando ao Stripe</h2>
        <p className="text-gray-500 max-w-xs mx-auto">
          Estamos preparando o seu ambiente seguro de cadastro financeiro. Não feche esta janela.
        </p>
      </div>
    );
  }

  // --- VIEW: DASHBOARD DE PENDÊNCIAS (RESTRICTED) ---
  if (view === 'restricted_dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-left animate-in fade-in duration-500">
        <div className="max-w-3xl mx-auto px-4">
          <header className="mb-10">
            <Badge variant="warning" className="mb-4">Ação Necessária</Badge>
            <h1 className="text-3xl font-black text-gray-900">Verificação de Identidade</h1>
            <p className="text-gray-500 mt-2">O Stripe precisa de mais informações para habilitar seus repasses.</p>
          </header>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border flex items-center justify-between gap-4 group hover:border-indigo-200 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-address-card"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Documento de Identidade</h4>
                  <p className="text-xs text-gray-500">O documento do representante legal expirou ou é ilegível.</p>
                </div>
              </div>
              <Button size="sm" onClick={finalizeVerification}>Corrigir</Button>
            </div>

            <div className="bg-white p-6 rounded-2xl border flex items-center justify-between gap-4 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-check-circle"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Conta Bancária</h4>
                  <p className="text-xs text-gray-500">Validada com sucesso em 12/08/2024.</p>
                </div>
              </div>
              <i className="fa-solid fa-lock text-gray-300 mr-4"></i>
            </div>
          </div>

          <div className="mt-10 p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Por que isso é necessário?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Seguimos as regulamentações internacionais de combate à lavagem de dinheiro (AML) para garantir que sua conta e suas vendas estejam sempre protegidas.
              </p>
            </div>
            <i className="fa-solid fa-shield-halved absolute -right-4 -bottom-4 text-7xl text-white opacity-5"></i>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: SUCESSO ---
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-white py-20 px-4 flex items-center justify-center text-center animate-in zoom-in-95 duration-500">
        <div className="max-w-md">
          <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
            <i className="fa-solid fa-check text-4xl"></i>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Conta Verificada!</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Parabéns! Sua conta está 100% apta para realizar vendas e receber repasses automáticos.
          </p>
          <div className="space-y-4">
             <Button className="w-full" size="lg" onClick={() => navigate('/organizador/financeiro')}>Acessar Financeiro</Button>
             <Button variant="ghost" className="w-full text-indigo-600 font-bold" onClick={() => window.open('https://stripe.com', '_blank')}>
               Ir para o Dashboard Stripe <i className="fa-solid fa-external-link ml-2 text-xs"></i>
             </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: START / ONBOARDING ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 text-left">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/organizador/financeiro" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 mb-8 transition">
          <i className="fa-solid fa-arrow-left"></i> Voltar
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">Seja um Vendedor</h1>
          <p className="text-gray-500 mt-2">Para processar pagamentos e receber lucros, precisamos configurar sua infraestrutura financeira via Stripe.</p>
        </header>

        <div className={cardClasses}>
          <div className="space-y-10">
            {/* Step 1: Requirements */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">1</span>
                Requisitos do Sistema
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: 'fa-id-card', title: 'Documento Oficial', desc: 'RG, CNH ou Passaporte' },
                  { icon: 'fa-building-columns', title: 'Conta Bancária', desc: 'Deve ser da mesma titularidade' },
                  { icon: 'fa-envelope', title: 'E-mail Verificado', desc: 'Para comunicações fiscais' },
                  { icon: 'fa-mobile-screen', title: 'Telefone Celular', desc: 'Para autenticação em duas etapas' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 flex items-center gap-4">
                    <i className={`fa-solid ${item.icon} text-indigo-600`}></i>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{item.title}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr />

            {/* Step 2: Connection */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">2</span>
                Conexão Segura
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ao clicar no botão abaixo, você será redirecionado para o <span className="font-bold text-slate-900 underline decoration-indigo-500 decoration-2">Stripe Connect</span>, nosso parceiro global de pagamentos. 
                Lá você completará seu perfil de forma segura.
              </p>
              
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3 text-xs text-indigo-800 font-medium">
                <i className="fa-solid fa-lock"></i>
                A Evelou não tem acesso às suas chaves de segurança ou dados bancários sensíveis.
              </div>

              <Button size="lg" className="w-full !py-5 shadow-xl shadow-indigo-100" onClick={handleStripeRedirect}>
                Começar Onboarding no Stripe
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Processado por Stripe Payments S.A. &copy; 2024
        </p>
      </div>
    </div>
  );
};
