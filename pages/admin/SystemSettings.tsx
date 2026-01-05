
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

type ConfigTab = 'fees' | 'marketplace' | 'payouts' | 'integrations' | 'security';

export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('fees');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações aplicadas com sucesso em toda a rede.');
    }, 1500);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium";
  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block";

  return (
    <div className="animate-in fade-in duration-500 text-left pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Configurações do Sistema</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase font-black tracking-widest">Painel de Controle de Regras de Negócio</p>
        </div>
        <Button 
          className="shadow-lg shadow-indigo-100 px-10 !py-4" 
          onClick={handleSave}
          isLoading={isSaving}
        >
          Salvar Alterações Globais
        </Button>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 space-y-2">
          {[
            { id: 'fees', label: 'Taxas & Comissões', icon: 'fa-percent' },
            { id: 'marketplace', label: 'Vitrine & Conteúdo', icon: 'fa-store' },
            { id: 'payouts', label: 'Regras de Repasse', icon: 'fa-hand-holding-dollar' },
            { id: 'integrations', label: 'Integrações & API', icon: 'fa-plug-circle-check' },
            { id: 'security', label: 'Segurança & Ops', icon: 'fa-shield-halved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ConfigTab)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' 
                : 'text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-slate-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-50'}`}>
                <i className={`fa-solid ${tab.icon}`}></i>
              </div>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Settings Forms */}
        <div className="flex-1 bg-white rounded-[3rem] border shadow-sm p-8 md:p-12">
          
          {activeTab === 'fees' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Comissões da Plataforma</h3>
                  <p className="text-sm text-slate-500">Defina os valores padrão cobrados sobre cada venda realizada.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className={labelClasses}>Service Fee Padrão (%)</label>
                    <div className="relative">
                      <input type="number" defaultValue="10.0" className={inputClasses} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Taxa Fixa por Ingresso (R$)</label>
                    <div className="relative">
                      <input type="number" defaultValue="2.50" className={inputClasses} />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">R$</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Taxa de Saque Organizador (R$)</label>
                    <input type="number" defaultValue="5.00" className={inputClasses} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Taxa de Antecipação (Mensal %)</label>
                    <input type="number" defaultValue="2.49" className={inputClasses} />
                  </div>
               </div>

               <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                  <i className="fa-solid fa-circle-exclamation text-amber-500 mt-1"></i>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Alterações nas taxas afetam apenas **novos eventos** criados após a modificação. Eventos em curso mantém as taxas vigentes no momento da publicação.
                  </p>
               </div>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Vitrine & Home</h3>
                  <p className="text-sm text-slate-500">Gerencie a primeira impressão dos usuários na Evelou.</p>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>Título Principal (Hero Section)</label>
                    <input type="text" defaultValue="Descubra os melhores momentos da sua cidade." className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Subtítulo de Apoio</label>
                    <textarea rows={3} className={`${inputClasses} resize-none`} defaultValue="Encontre shows, palestras, workshops e muito mais. Evelou é a sua nova maneira de viver experiências inesquecíveis."></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <label className={labelClasses}>Banner Global Ativo</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:bg-slate-50 transition cursor-pointer">
                           <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-300 mb-4"></i>
                           <p className="text-xs font-bold text-slate-400 uppercase">Substituir Banner Principal</p>
                           <p className="text-[10px] text-slate-300 mt-2">Recomendado: 1920x600px</p>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <label className={labelClasses}>Configurações de Exibição</label>
                        <div className="space-y-4">
                           <label className="flex items-center justify-between cursor-pointer group">
                              <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition">Mostrar Eventos Encerrados</span>
                              <input type="checkbox" className="w-6 h-6 rounded border-slate-300 text-indigo-600" />
                           </label>
                           <label className="flex items-center justify-between cursor-pointer group">
                              <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition">Exibir Contador de Vendas</span>
                              <input type="checkbox" defaultChecked className="w-6 h-6 rounded border-slate-300 text-indigo-600" />
                           </label>
                           <label className="flex items-center justify-between cursor-pointer group">
                              <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition">Habilitar Busca por Cidade</span>
                              <input type="checkbox" defaultChecked className="w-6 h-6 rounded border-slate-300 text-indigo-600" />
                           </label>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Políticas de Liquidação</h3>
                  <p className="text-sm text-slate-500">Regras para transferência de fundos para os organizadores.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className={labelClasses}>Prazo de Repasse Padrão</label>
                    <select className={inputClasses}>
                      <option>D+30 (Pós Venda)</option>
                      <option>D+2 (Após Evento)</option>
                      <option>D+7 (Semanal)</option>
                      <option>Imediato (Checkout Direto)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Valor Mínimo para Saque</label>
                    <input type="number" defaultValue="50.00" className={inputClasses} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Limite Mensal (Novos Orgs)</label>
                    <input type="number" defaultValue="5000.00" className={inputClasses} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClasses}>Fuso Horário de Fechamento</label>
                    <select className={inputClasses}>
                      <option>Brasília (GMT-3)</option>
                      <option>New York (GMT-5)</option>
                      <option>London (GMT+0)</option>
                    </select>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Integrações & Analytics</h3>
                  <p className="text-sm text-slate-500">Gerencie scripts de rastreamento e credenciais de provedores externos.</p>
               </div>

               {/* Analytics Group */}
               <section className="space-y-6">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Rastreamento de Marketing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className={labelClasses}>Google Analytics (GA4 ID)</label>
                        <input type="text" placeholder="G-XXXXXXXXXX" className={inputClasses} />
                     </div>
                     <div className="space-y-2">
                        <label className={labelClasses}>Meta Pixel ID</label>
                        <input type="text" placeholder="123456789012345" className={inputClasses} />
                     </div>
                     <div className="space-y-2">
                        <label className={labelClasses}>Google Tag Manager (GTM)</label>
                        <input type="text" placeholder="GTM-XXXXXXX" className={inputClasses} />
                     </div>
                     <div className="space-y-2">
                        <label className={labelClasses}>TikTok Pixel</label>
                        <input type="text" placeholder="CXXXXXXXXXXXXXX" className={inputClasses} />
                     </div>
                  </div>
               </section>

               {/* Infrastructure Group */}
               <section className="space-y-6">
                  <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Comunicação & Core API</h4>
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border">
                             <i className="fa-brands fa-stripe-s text-xl"></i>
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">Stripe Live Secret Key</p>
                             <p className="text-[10px] text-slate-400 font-mono">sk_live_••••••••••••••••••••••••••••</p>
                          </div>
                       </div>
                       <Button variant="outline" size="sm" className="!bg-white">Substituir Chave</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className={labelClasses}>SendGrid API Key (E-mails)</label>
                          <input type="password" placeholder="SG.xxxxxxxxxxxxxxxx" className={inputClasses} />
                       </div>
                       <div className="space-y-2">
                          <label className={labelClasses}>Google Maps API Key</label>
                          <input type="password" placeholder="AIzaSyXXXXXXXXXXXXXXXX" className={inputClasses} />
                       </div>
                    </div>
                  </div>
               </section>

               {/* Webhooks Group */}
               <section className="space-y-6">
                  <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest border-b border-amber-50 pb-2">Webhooks de Sistema</h4>
                  <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6">
                     <p className="text-xs text-slate-500 mb-6 leading-relaxed italic">URLs cadastradas aqui receberão payloads JSON sobre eventos críticos do sistema (Novos Organizadores, Fraudes Detectadas, Erros de Gateway).</p>
                     
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border">
                           <Badge variant="success">Active</Badge>
                           <p className="flex-1 text-xs font-mono text-slate-600 truncate">https://api.evelou-ops.com/webhooks/security</p>
                           <button className="text-slate-300 hover:text-red-500 transition"><i className="fa-solid fa-trash-can text-sm"></i></button>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full !border-dashed !border-slate-200 !text-slate-400 hover:!bg-white">
                           <i className="fa-solid fa-plus mr-2"></i> Adicionar Nova URL de Escuta
                        </Button>
                     </div>
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Operações & Segurança</h3>
                  <p className="text-sm text-slate-500">Controles críticos de acesso e integridade.</p>
               </div>

               <div className="space-y-6">
                  <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 flex items-center justify-between">
                     <div>
                        <h4 className="font-black text-red-900 text-sm">Modo de Manutenção Global</h4>
                        <p className="text-xs text-red-700 mt-1">Ao ativar, todos os checkouts serão bloqueados.</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Desativado</span>
                        <button className="w-14 h-8 bg-slate-300 rounded-full relative transition-colors">
                           <div className="w-6 h-6 bg-white rounded-full absolute left-1 top-1"></div>
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                        <h4 className="font-bold text-slate-900 text-sm">Autenticação (2FA)</h4>
                        <p className="text-xs text-slate-500 leading-relaxed italic">Exigir 2FA para todos os organizadores ao realizar saques acima de R$ 10.000,00.</p>
                        <Button variant="outline" size="sm" className="w-full !bg-white">Configurar Regra</Button>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                        <h4 className="font-bold text-slate-900 text-sm">Aprovação de Organizadores</h4>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600" />
                           <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition">Exigir validação manual de KYC</span>
                        </label>
                        <p className="text-[10px] text-slate-400 font-medium">Novos vendedores precisarão enviar documentos antes de criar eventos.</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
