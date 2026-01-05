
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'failing';
}

interface APIToken {
  id: string;
  name: string;
  token: string;
  lastUsed: string;
}

export const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apps' | 'webhooks' | 'api'>('apps');
  
  // Modals States
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [showTokenResult, setShowTokenResult] = useState(false);

  // Selected Data for Editing
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [newToken, setNewToken] = useState('');

  // Mock Data
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: '1', url: 'https://api.meusite.com/webhooks/evelou', events: ['order.paid', 'order.refunded'], status: 'active' }
  ]);

  const [tokens, setTokens] = useState<APIToken[]>([
    { id: '1', name: 'Produção - ERP Interno', token: 'evl_live_••••••••2938', lastUsed: 'Há 2 horas' }
  ]);

  const apps = [
    { id: 'meta', name: 'Meta Pixel', desc: 'Acompanhe conversões para anúncios no Facebook e Instagram.', icon: 'fa-brands fa-facebook', color: 'bg-blue-600', connected: true },
    { id: 'google_ga', name: 'Google Analytics 4', desc: 'Analise o comportamento dos visitantes e origem do tráfego.', icon: 'fa-brands fa-google', color: 'bg-orange-500', connected: false },
    { id: 'gtm', name: 'Google Tag Manager', desc: 'Gerencie todas as suas tags em um só lugar sem mexer no código.', icon: 'fa-solid fa-tags', color: 'bg-blue-500', connected: false },
    { id: 'tiktok', name: 'TikTok Ads', desc: 'Mensure conversões e otimize suas campanhas na rede que mais cresce.', icon: 'fa-brands fa-tiktok', color: 'bg-black', connected: false },
    { id: 'oslou_mail', name: 'Oslou Mail', desc: 'Plataforma nativa para automação de e-mail marketing e engajamento.', icon: 'fa-solid fa-envelope-open-text', color: 'bg-indigo-700', connected: true },
    { id: 'oslou_zap', name: 'Oslou ZAP', desc: 'Notificações rápidas via WhatsApp Web (QR Code) para compradores.', icon: 'fa-brands fa-whatsapp', color: 'bg-green-500', connected: false },
    { id: 'oslou_pro', name: 'Oslou PRO', desc: 'API Oficial do WhatsApp para alta escala e selo de verificado.', icon: 'fa-solid fa-shield-check', color: 'bg-emerald-600', connected: false },
  ];

  const handleAddToken = () => {
    const generated = 'evl_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setNewToken(generated);
    setShowTokenResult(true);
  };

  const handleSaveApp = () => {
    setIsAppModalOpen(false);
    // Simular salvamento
  };

  const getInputLabel = (id: string) => {
    switch(id) {
      case 'meta': return 'ID do Pixel';
      case 'tiktok': return 'Pixel ID';
      case 'google_ga': return 'Measurement ID (G-XXXX)';
      case 'gtm': return 'Container ID (GTM-XXXX)';
      case 'oslou_mail': return 'Chave de API Oslou';
      case 'oslou_zap': return 'Instância ID';
      case 'oslou_pro': return 'Phone Number ID (API Official)';
      default: return 'Token de Acesso / ID';
    }
  };

  const labelClasses = "text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block";
  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 text-sm";

  return (
    <div className="p-4 lg:p-8 text-left">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
          <p className="text-gray-500 text-sm">Gerencie conexões externas e ferramentas de automação.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-8 overflow-x-auto scrollbar-hide">
          {['apps', 'webhooks', 'api'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'apps' ? 'Aplicativos' : tab === 'webhooks' ? 'Webhooks' : 'API Access'}
            </button>
          ))}
        </div>

        {/* TAB: APPS */}
        {activeTab === 'apps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {apps.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-3xl border shadow-sm hover:border-indigo-200 transition group flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg ${app.color}`}>
                    <i className={app.icon}></i>
                  </div>
                  <Badge variant={app.connected ? 'success' : 'gray'}>
                    {app.connected ? 'Ativo' : 'Pendente'}
                  </Badge>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{app.name}</h3>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed h-12 line-clamp-3">{app.desc}</p>
                </div>
                <div className="mt-4">
                  <Button 
                    variant={app.connected ? 'outline' : 'primary'} 
                    size="sm" 
                    className="w-full"
                    onClick={() => { setSelectedApp(app); setIsAppModalOpen(true); }}
                  >
                    {app.connected ? 'Configurar' : 'Conectar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: WEBHOOKS */}
        {activeTab === 'webhooks' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest">Endpoints de Saída</h3>
                <Button size="sm" onClick={() => setIsWebhookModalOpen(true)}>
                  <i className="fa-solid fa-plus mr-2"></i> Novo Webhook
                </Button>
              </div>
              <div className="divide-y">
                {webhooks.length > 0 ? webhooks.map((wh) => (
                  <div key={wh.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-tighter">HTTP POST</span>
                        <p className="font-mono text-sm text-gray-900 truncate max-w-xs md:max-w-md">{wh.url}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {wh.events.map(ev => <span key={ev} className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">{ev}</span>)}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Enviar Teste" className="text-gray-400 hover:text-indigo-600 transition p-2.5 bg-gray-100 rounded-xl"><i className="fa-solid fa-vial"></i></button>
                      <button title="Editar" className="text-gray-400 hover:text-indigo-600 transition p-2.5 bg-gray-100 rounded-xl"><i className="fa-solid fa-pen"></i></button>
                      <button title="Remover" className="text-gray-400 hover:text-red-600 transition p-2.5 bg-gray-100 rounded-xl"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center text-gray-400">Nenhum webhook ativo no momento.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: API ACCESS */}
        {activeTab === 'api' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border shadow-sm p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-widest">Tokens de Acesso</h3>
                  <p className="text-xs text-gray-500 mt-1">Utilize estes tokens para integrar a Evelou com seus sistemas internos.</p>
                </div>
                <Button size="sm" onClick={() => { setIsTokenModalOpen(true); setShowTokenResult(false); }}>
                  <i className="fa-solid fa-plus mr-2"></i> Novo Token
                </Button>
              </div>
              
              <div className="space-y-4">
                {tokens.map((tk) => (
                  <div key={tk.id} className="p-5 bg-gray-50 rounded-2xl border flex items-center justify-between group hover:border-indigo-200 transition">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{tk.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-xs text-gray-400 tracking-widest">{tk.token}</p>
                        <button className="text-indigo-600 hover:text-indigo-800 transition text-xs"><i className="fa-solid fa-copy"></i></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Última Chamada</p>
                        <p className="text-xs text-gray-600 font-medium">{tk.lastUsed}</p>
                      </div>
                      <button className="p-2 text-gray-300 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Modal: Configurar App */}
      <Modal 
        isOpen={isAppModalOpen} 
        onClose={() => setIsAppModalOpen(false)} 
        title={`Conectar ${selectedApp?.name}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAppModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveApp}>Salvar Configuração</Button>
          </>
        }
      >
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-md ${selectedApp?.color}`}>
              <i className={selectedApp?.icon}></i>
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">{selectedApp?.name}</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Integração Externa</p>
            </div>
          </div>
          
          <div>
            <label className={labelClasses}>{getInputLabel(selectedApp?.id)}</label>
            <input type="text" className={inputClasses} placeholder="Insira o identificador" />
            <p className="mt-2 text-[10px] text-gray-400 leading-relaxed">
              {selectedApp?.id.startsWith('oslou') 
                ? 'Obtenha este identificador no seu painel administrativo Oslou.' 
                : `Consulte a seção de configurações do ${selectedApp?.name} para localizar esta chave.`}
            </p>
          </div>

          {selectedApp?.id === 'oslou_pro' && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-green-600 mt-1"></i>
              <p className="text-xs text-green-800 leading-relaxed">
                A integração **Oslou PRO** requer uma conta verificada no Meta Business Suite.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal: Novo Webhook */}
      <Modal 
        isOpen={isWebhookModalOpen} 
        onClose={() => setIsWebhookModalOpen(false)} 
        title="Novo Webhook de Saída"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsWebhookModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsWebhookModalOpen(false)}>Ativar Webhook</Button>
          </>
        }
      >
        <div className="space-y-6 text-left">
          <div>
            <label className={labelClasses}>URL de Destino (HTTPS)</label>
            <input type="url" className={inputClasses} placeholder="https://seu-servidor.com/webhook" />
            <p className="mt-1.5 text-[10px] text-gray-400">Recomendamos o uso de conexões seguras (SSL).</p>
          </div>
          
          <div>
            <label className={labelClasses}>Selecione os Eventos</label>
            <div className="space-y-3 pt-2">
              {[
                { id: 'ev1', label: 'order.paid', desc: 'Confirmado quando o pagamento é aprovado.' },
                { id: 'ev2', label: 'order.refunded', desc: 'Disparado ao processar um estorno.' },
                { id: 'ticket.scanned', label: 'ticket.scanned', desc: 'Notifica cada check-in realizado na portaria.' },
              ].map(ev => (
                <label key={ev.id} className="flex items-start gap-3 p-4 rounded-xl border hover:bg-gray-50 cursor-pointer transition">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{ev.label}</p>
                    <p className="text-[10px] text-gray-500">{ev.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal: Novo Token API */}
      <Modal 
        isOpen={isTokenModalOpen} 
        onClose={() => setIsTokenModalOpen(false)} 
        title="Novo Token de API"
        footer={
          showTokenResult ? (
            <Button className="w-full" onClick={() => setIsTokenModalOpen(false)}>Ok, já salvei o token</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setIsTokenModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddToken}>Gerar Agora</Button>
            </>
          )
        }
      >
        <div className="text-left">
          {!showTokenResult ? (
            <div className="space-y-6">
              <div>
                <label className={labelClasses}>Nome Amigável</label>
                <input type="text" className={inputClasses} placeholder="Ex: Integração CRM Vendas" />
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Este token é sensível e fornece acesso administrativo aos seus dados. Trate-o como uma senha pessoal.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-2 animate-in fade-in duration-300">
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fa-solid fa-key"></i>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Token Gerado!</h4>
                  <p className="text-sm text-gray-500 mt-1">Copie-o agora. Por segurança, ele não será exibido novamente.</p>
               </div>
               
               <div className="p-5 bg-slate-900 rounded-2xl flex items-center justify-between shadow-2xl">
                 <p className="font-mono text-xs text-indigo-300 truncate mr-4 tracking-tighter">{newToken}</p>
                 <button 
                  onClick={() => { navigator.clipboard.writeText(newToken); alert('Token copiado!'); }}
                  className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition"
                >
                   <i className="fa-solid fa-copy"></i>
                 </button>
               </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
