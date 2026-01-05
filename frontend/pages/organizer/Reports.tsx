
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_EVENTS } from '../../constants';
import { GoogleGenAI } from "@google/genai";

export const Reports: React.FC = () => {
  const [period, setPeriod] = useState('30d');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const kpis = [
    { label: 'Receita Total', value: 'R$ 158.420,00', trend: '+12.5%', isUp: true, desc: 'vs. mês anterior' },
    { label: 'Ingressos Vendidos', value: '3.842', trend: '+5.2%', isUp: true, desc: 'vs. mês anterior' },
    { label: 'Taxa de Conversão', value: '4.2%', trend: '-0.8%', isUp: false, desc: 'no checkout' },
    { label: 'Novos Clientes', value: '840', trend: '+18%', isUp: true, desc: 'este mês' },
  ];

  const handleGenerateAiInsights = async () => {
    setIsGeneratingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Como um analista de marketing sênior, analise estes dados de uma plataforma de eventos: 
      Receita: R$ 158.420 (+12.5%), Ingressos: 3.842 (+5.2%), Conversão: 4.2% (-0.8%). 
      O principal canal é link direto (45%). 
      Escreva 3 insights curtos e acionáveis em tópicos para o organizador aumentar suas vendas.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsights(response.text || "Não foi possível gerar insights no momento.");
    } catch (error) {
      console.error("Erro na IA:", error);
      setAiInsights("Erro ao conectar com a inteligência artificial. Tente novamente.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Inteligência de Dados</h1>
            <p className="text-gray-500 text-sm">Dashboard analítico avançado para tomada de decisão.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="!bg-white">
              <i className="fa-solid fa-file-pdf mr-2"></i> Exportar
            </Button>
            <Button size="sm" onClick={handleGenerateAiInsights} isLoading={isGeneratingAi} className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-100 border-none">
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Insight IA
            </Button>
          </div>
        </header>

        {/* AI Insight Alert */}
        {aiInsights && (
          <div className="mb-8 p-6 bg-indigo-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-top-4">
             <button onClick={() => setAiInsights(null)} className="absolute top-6 right-6 text-indigo-300 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
             <div className="flex items-start gap-6 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                   <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                   <h4 className="font-black text-indigo-300 text-xs uppercase tracking-[0.2em] mb-3">Análise Estratégica Gemini</h4>
                   <div className="prose prose-invert prose-sm max-w-none font-medium leading-relaxed opacity-90">
                      {aiInsights.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                   </div>
                </div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </div>
        )}

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border shadow-sm group hover:border-indigo-100 transition-all">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{kpi.value}</h3>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${kpi.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {kpi.isUp ? '▲' : '▼'} {kpi.trend}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{kpi.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Sales Chart */}
          <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Volume de Vendas (30 dias)</h3>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Picos detectados aos finais de semana</p>
                </div>
                <div className="flex gap-4 text-[9px] font-black text-gray-400 uppercase">
                   <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Atual</div>
                   <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Projeção</div>
                </div>
             </div>
             <div className="h-64 flex items-end justify-between gap-3 px-2">
                {[30, 45, 60, 25, 80, 95, 40, 55, 70, 85, 40, 90, 65, 50, 75].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group cursor-help">
                     <div className="w-full flex justify-center gap-1 h-full items-end">
                        <div 
                          className="w-full bg-indigo-600 rounded-t-full transition-all duration-700 group-hover:bg-indigo-400 relative" 
                          style={{ height: `${v}%` }}
                        >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[9px] px-2 py-1 rounded font-black">R$ {v*100}</div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Demographic Breakdown */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border shadow-sm flex flex-col">
             <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-8">Perfil do Público</h3>
             <div className="flex-1 flex flex-col justify-center gap-8">
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Gênero</p>
                      <div className="flex gap-3 text-[10px] font-black uppercase">
                         <span className="text-indigo-600">Mulheres 62%</span>
                         <span className="text-slate-300">Homens 38%</span>
                      </div>
                   </div>
                   <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-indigo-600" style={{ width: '62%' }}></div>
                      <div className="h-full bg-slate-200" style={{ width: '38%' }}></div>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-4">Faixa Etária (anos)</p>
                   <div className="space-y-3">
                      {[
                        { range: '18-24', val: 45, color: 'bg-indigo-600' },
                        { range: '25-34', val: 30, color: 'bg-indigo-400' },
                        { range: '35-44', val: 15, color: 'bg-indigo-200' },
                        { range: '45+', val: 10, color: 'bg-slate-100' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                           <span className="text-[10px] font-bold text-gray-500 w-8">{item.range}</span>
                           <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                              <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.val}%` }}></div>
                           </div>
                           <span className="text-[10px] font-black text-gray-900">{item.val}%</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Sales Heatmap (Prime Time) */}
           <div className="lg:col-span-7 bg-white p-8 rounded-[3rem] border shadow-sm">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-8">Mapa de Calor (Horário de Vendas)</h3>
              <div className="grid grid-cols-8 gap-1 text-center">
                 <div className="h-8"></div>
                 {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                   <div key={d} className="text-[10px] font-black text-gray-400">{d}</div>
                 ))}
                 
                 {['08h', '12h', '16h', '20h', '00h'].map((h, row) => (
                   <React.Fragment key={h}>
                     <div className="text-[10px] font-black text-gray-400 flex items-center justify-center">{h}</div>
                     {Array.from({length: 7}).map((_, col) => {
                       const intensity = Math.random();
                       return (
                        <div 
                          key={col} 
                          className="aspect-square rounded-lg border border-white transition-all hover:scale-110 cursor-help"
                          title={`Intensidade: ${Math.round(intensity*100)}%`}
                          style={{ 
                            backgroundColor: intensity > 0.8 ? '#4f46e5' : intensity > 0.5 ? '#818cf8' : intensity > 0.2 ? '#c7d2fe' : '#f8fafc' 
                          }}
                        />
                       );
                     })}
                   </React.Fragment>
                 ))}
              </div>
              <div className="mt-6 flex justify-end gap-4">
                 <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase">
                    <span className="w-2 h-2 rounded bg-slate-50 border"></span> Baixo
                    <span className="w-2 h-2 rounded bg-indigo-600"></span> Alto Volume
                 </div>
              </div>
           </div>

           {/* Retention & Loyalty */}
           <div className="lg:col-span-5 bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-10">Retenção & Fidelidade</h3>
              <div className="space-y-10 relative z-10">
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-3xl font-black">24%</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Compradores Recorrentes</p>
                    </div>
                    <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-2xl">
                       <i className="fa-solid fa-users-viewfinder"></i>
                    </div>
                 </div>
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <h4 className="text-[10px] font-black text-indigo-300 uppercase mb-3">Principais Afinidades</h4>
                    <div className="space-y-3">
                       {['Quem compra SHOW, também compra FESTA (82%)', 'Público VIP compra 2.5x mais ingressos/ano'].map((txt, i) => (
                         <div key={i} className="flex gap-3 items-center text-xs font-medium text-slate-300">
                            <i className="fa-solid fa-circle-check text-indigo-500 text-[10px]"></i>
                            {txt}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <i className="fa-solid fa-chart-pie absolute -right-6 -bottom-6 text-9xl text-white opacity-5 rotate-12"></i>
           </div>
        </div>

        {/* Traffic Channels Table */}
        <div className="mt-8 bg-white rounded-[3rem] border shadow-sm overflow-hidden">
           <div className="px-10 py-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Origem das Conversões</h3>
              <Link to="/organizador/pixels" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Configurar Tracking Pixels</Link>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-white border-b">
                    <tr>
                       <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Canal / Fonte</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliques</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Checkout (%)</th>
                       <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Faturamento</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y">
                    {[
                      { source: 'Instagram Ads', clicks: '14.2k', checkout: '12%', revenue: 'R$ 64.200', icon: 'fa-instagram' },
                      { source: 'WhatsApp (Links)', clicks: '8.4k', checkout: '45%', revenue: 'R$ 42.100', icon: 'fa-whatsapp' },
                      { source: 'E-mail Marketing', clicks: '3.1k', checkout: '18%', revenue: 'R$ 15.400', icon: 'fa-envelope' },
                      { source: 'Google Search', clicks: '1.2k', checkout: '8%', revenue: 'R$ 4.200', icon: 'fa-google' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition group">
                         <td className="px-10 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition"><i className={`fa-brands ${row.icon}`}></i></div>
                               <span className="font-bold text-gray-900">{row.source}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5 text-gray-500 font-medium">{row.clicks}</td>
                         <td className="px-6 py-5 text-center">
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">{row.checkout}</span>
                         </td>
                         <td className="px-6 py-5 text-right font-black text-gray-900">{row.revenue}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};
