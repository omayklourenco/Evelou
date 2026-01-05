
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

type LogSeverity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  severity: LogSeverity;
  ip: string;
}

export const SystemLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'health' | 'backups'>('logs');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);

  const logs: LogEntry[] = [
    { id: '10922', timestamp: '2024-08-22 14:30:05', user: 'Admin Principal', action: 'Alteração de taxa global (10% -> 12%)', severity: 'CRITICAL', ip: '189.12.33.10' },
    { id: '10921', timestamp: '2024-08-22 14:28:12', user: 'Sistema', action: 'Backup diário concluído com sucesso', severity: 'INFO', ip: '127.0.0.1' },
    { id: '10920', timestamp: '2024-08-22 14:25:44', user: 'Carlos Silva (Org)', action: 'Falha na autenticação (3x)', severity: 'WARN', ip: '177.45.22.90' },
    { id: '10919', timestamp: '2024-08-22 14:22:10', user: 'Sistema', action: 'Timeout na API do Google Maps', severity: 'ERROR', ip: 'internal-lb' },
    { id: '10918', timestamp: '2024-08-22 14:15:33', user: 'Admin João', action: 'Suspensão de evento ID #992', severity: 'CRITICAL', ip: '189.12.33.12' },
  ];

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBackingUp(false);
            alert('Snapshot gerado e enviado para o Cold Storage (AWS S3 Glacier).');
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const getSeverityStyle = (sev: LogSeverity) => {
    switch(sev) {
      case 'CRITICAL': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ERROR': return 'bg-red-100 text-red-700 border-red-200';
      case 'WARN': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 text-left">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Logs & Infraestrutura</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase font-black tracking-widest">Monitoramento técnico e segurança de dados</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Todos os Sistemas Online</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-slate-200/50 rounded-2xl w-fit">
        {[
          { id: 'logs', label: 'Audit Logs', icon: 'fa-terminal' },
          { id: 'health', label: 'Saúde & Performance', icon: 'fa-heart-pulse' },
          { id: 'backups', label: 'Backups & Snapshots', icon: 'fa-database' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <i className={`fa-solid ${t.icon}`}></i>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {activeTab === 'logs' && (
            <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Registro de Eventos Recentes</h3>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black tracking-widest"><i className="fa-solid fa-filter mr-2"></i> Filtrar</Button>
                   <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black tracking-widest"><i className="fa-solid fa-download mr-2"></i> Baixar JSON</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Carimbo de Data/Hora</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Usuário / Origem</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ação / Evento</th>
                      <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Nível</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition group">
                        <td className="px-8 py-4 text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-8 py-4">
                           <p className="font-bold text-slate-900 text-xs">{log.user}</p>
                           <p className="text-[10px] text-slate-400">{log.ip}</p>
                        </td>
                        <td className="px-8 py-4">
                           <p className="text-xs text-slate-700 leading-relaxed">{log.action}</p>
                        </td>
                        <td className="px-8 py-4 text-center">
                           <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black border ${getSeverityStyle(log.severity)}`}>
                             {log.severity}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-4 bg-slate-900 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] flex justify-between items-center">
                 <span>Listening to stream...</span>
                 <div className="flex gap-1">
                   <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
                   <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                   <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-8">
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Serviços Externos</h3>
                  <div className="space-y-6">
                    {[
                      { name: 'Gateway (Stripe API)', status: 'UP', latency: '42ms', icon: 'fa-stripe' },
                      { name: 'E-mail (SendGrid)', status: 'UP', latency: '120ms', icon: 'fa-paper-plane' },
                      { name: 'Maps (Google Cloud)', status: 'UP', latency: '35ms', icon: 'fa-map' },
                      { name: 'Storage (AWS S3)', status: 'UP', latency: '18ms', icon: 'fa-cloud' },
                      { name: 'Search (Algolia)', status: 'DEGRADED', latency: '1.2s', icon: 'fa-magnifying-glass' },
                    ].map((svc, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                               <i className={`fa-solid ${svc.icon}`}></i>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900">{svc.name}</p>
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Latência: {svc.latency}</p>
                            </div>
                         </div>
                         <Badge variant={svc.status === 'UP' ? 'success' : 'warning'}>{svc.status}</Badge>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                     <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Recursos do Servidor</h3>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase">
                              <span className="text-slate-400">CPU Usage (vCore)</span>
                              <span className="text-emerald-400">12%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="w-[12%] h-full bg-emerald-500 rounded-full"></div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase">
                              <span className="text-slate-400">Memory Allocation (RAM)</span>
                              <span className="text-amber-400">62%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="w-[62%] h-full bg-amber-500 rounded-full"></div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase">
                              <span className="text-slate-400">Database Connections</span>
                              <span className="text-emerald-400">45 / 500</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="w-[9%] h-full bg-emerald-500 rounded-full"></div>
                           </div>
                        </div>
                     </div>
                     <i className="fa-solid fa-microchip absolute -right-6 -bottom-6 text-9xl text-white opacity-5"></i>
                  </div>

                  <div className="bg-white p-8 rounded-[3rem] border shadow-sm">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl border">
                           <i className="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 text-sm tracking-tight tracking-widest uppercase">Plataforma Uptime</h4>
                           <p className="text-2xl font-black text-slate-900 tracking-tighter">99.998%</p>
                        </div>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed italic">
                        "Último incidente registrado em 12 de Junho de 2024 (Duração: 4 minutos)."
                     </p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white p-8 rounded-[3rem] border shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-2xl shadow-xl shadow-indigo-200">
                           <i className="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-slate-900">Gerenciamento de Snapshots</h3>
                           <p className="text-sm text-slate-500">Backups de contingência para recuperação de desastres.</p>
                        </div>
                     </div>
                     <Button 
                      className="!py-4 px-10 shadow-lg shadow-indigo-100" 
                      onClick={handleManualBackup}
                      disabled={isBackingUp}
                     >
                       {isBackingUp ? `Gerando Snapshot (${progress}%)` : 'Gerar Snapshot Agora'}
                     </Button>
                  </div>
                  
                  {isBackingUp && (
                    <div className="mt-8 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  )}
               </div>

               <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Histórico de Backups</h3>
                    <Badge variant="success">Auto-Sync On</Badge>
                  </div>
                  <div className="divide-y text-sm">
                     {[
                       { date: '22 Ago 2024, 04:00', size: '245.8 MB', type: 'FULL AUTOMATIC', status: 'Healthy' },
                       { date: '21 Ago 2024, 04:00', size: '244.2 MB', type: 'FULL AUTOMATIC', status: 'Healthy' },
                       { date: '20 Ago 2024, 15:22', size: '243.9 MB', type: 'MANUAL', status: 'Healthy' },
                       { date: '20 Ago 2024, 04:00', size: '243.5 MB', type: 'FULL AUTOMATIC', status: 'Healthy' },
                     ].map((bk, i) => (
                       <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                               <i className="fa-solid fa-file-zipper"></i>
                             </div>
                             <div>
                                <p className="font-bold text-slate-900">{bk.date}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{bk.type} • {bk.size}</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition border border-transparent hover:border-slate-100"><i className="fa-solid fa-download"></i></button>
                             <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition border border-transparent hover:border-slate-100"><i className="fa-solid fa-trash-can"></i></button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Technical Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           
           {/* Environment Badge */}
           <div className="bg-white p-8 rounded-[3rem] border shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Build Information</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Versão:</span>
                    <span className="font-mono text-xs font-black text-slate-900">v2.4.8-stable</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Environment:</span>
                    <Badge variant="info">Production</Badge>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Last Deploy:</span>
                    <span className="text-xs font-bold text-slate-700">Há 3 dias</span>
                 </div>
              </div>
           </div>

           {/* Quick Server Action */}
           <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100">
              <i className="fa-solid fa-power-off text-3xl text-red-500 mb-4"></i>
              <h4 className="font-bold text-red-900 text-sm mb-2">Controle de Emergência</h4>
              <p className="text-xs text-red-800 leading-relaxed mb-6">
                Reiniciar os clusters de API em caso de travamento crítico. Esta ação derrubará as conexões ativas por até 15s.
              </p>
              <Button variant="danger" size="sm" className="w-full !bg-red-600 !border-0 shadow-lg shadow-red-200" onClick={() => alert('Solicitação enviada. Aguardando aprovação do 2FA do Diretor de Tecnologia.')}>
                Restart Core Services
              </Button>
           </div>

           {/* Security Tip */}
           <div className="bg-amber-50 p-8 rounded-[3rem] border border-amber-100 text-center">
              <i className="fa-solid fa-shield-halved text-3xl text-amber-500 mb-4"></i>
              <h4 className="font-bold text-amber-900 text-sm mb-2">Monitoramento WAF</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Bloqueamos **42.500** solicitações suspeitas nos últimos 7 dias. O firewall está operando em modo agressivo.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
