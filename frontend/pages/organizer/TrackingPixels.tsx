
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const TrackingPixels: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const [pixels, setPixels] = useState({
    metaId: '1234567890',
    metaCapi: 'EAAG...',
    googleGa4: 'G-XXXXXXXXXX',
    googleAdsId: 'AW-00000000',
    tiktokId: '',
    headerScript: '',
    footerScript: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Configurações de rastreamento atualizadas com sucesso!');
    }, 1500);
  };

  const handleTestPixel = () => {
    setTestStatus('testing');
    setTimeout(() => setTestStatus('success'), 2000);
    setTimeout(() => setTestStatus('idle'), 5000);
  };

  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1";
  const inputClasses = "w-full px-5 py-4 rounded-2xl border border-gray-200 bg-slate-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-bold";

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Link to="/organizador/relatorios" className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2 hover:underline flex items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i> Voltar para Relatórios
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Pixels & Rastreamento</h1>
            <p className="text-gray-500 text-sm mt-1">Configure as ferramentas para medir suas conversões e otimizar anúncios.</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTestPixel} disabled={testStatus !== 'idle'} className="!bg-white">
              {testStatus === 'idle' && <><i className="fa-solid fa-vial mr-2"></i> Testar Pixel</>}
              {testStatus === 'testing' && <><i className="fa-solid fa-circle-notch animate-spin mr-2"></i> Verificando...</>}
              {testStatus === 'success' && <><i className="fa-solid fa-check text-emerald-500 mr-2"></i> Disparo OK</>}
            </Button>
          </div>
        </header>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            
            {/* Meta (Facebook) Card */}
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 md:p-10">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    <i className="fa-brands fa-facebook-f"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Meta Pixel (Facebook/Instagram)</h3>
                    <p className="text-xs text-gray-400 font-medium">Recomendado para otimização de ROAS.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>ID do Pixel</label>
                    <input 
                      type="text" 
                      value={pixels.metaId} 
                      onChange={e => setPixels({...pixels, metaId: e.target.value})}
                      placeholder="Ex: 1234567890123" 
                      className={inputClasses} 
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Token de Acesso (Conversions API)</label>
                    <input 
                      type="password" 
                      value={pixels.metaCapi}
                      onChange={e => setPixels({...pixels, metaCapi: e.target.value})}
                      placeholder="EAAG..." 
                      className={inputClasses} 
                    />
                    <p className="mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-tight ml-1 italic">Rastreamento Server-side para evitar perda de dados por bloqueadores.</p>
                  </div>
               </div>
            </div>

            {/* Google Ecosystem Card */}
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 md:p-10">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    <i className="fa-brands fa-google"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Google Analytics & Ads</h3>
                    <p className="text-xs text-gray-400 font-medium">Rastreie o comportamento e conversão de busca.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Tag ID (GA4)</label>
                    <input 
                      type="text" 
                      value={pixels.googleGa4}
                      onChange={e => setPixels({...pixels, googleGa4: e.target.value})}
                      placeholder="G-XXXXXXXXXX" 
                      className={inputClasses} 
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Conversão (Google Ads)</label>
                    <input 
                      type="text" 
                      value={pixels.googleAdsId}
                      onChange={e => setPixels({...pixels, googleAdsId: e.target.value})}
                      placeholder="AW-00000000" 
                      className={inputClasses} 
                    />
                  </div>
               </div>
            </div>

            {/* Custom Scripts */}
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 md:p-10">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    <i className="fa-solid fa-code"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Scripts Personalizados</h3>
                    <p className="text-xs text-gray-400 font-medium">Insira códigos extras para outras ferramentas.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>Header Scripts (Antes de head)</label>
                    <textarea 
                      rows={3} 
                      value={pixels.headerScript}
                      onChange={e => setPixels({...pixels, headerScript: e.target.value})}
                      className={`${inputClasses} font-mono text-[10px] resize-none`} 
                      placeholder="<script>...</script>"
                    ></textarea>
                  </div>
                  <div>
                    <label className={labelClasses}>Footer Scripts (Antes de /body)</label>
                    <textarea 
                      rows={3} 
                      value={pixels.footerScript}
                      onChange={e => setPixels({...pixels, footerScript: e.target.value})}
                      className={`${inputClasses} font-mono text-[10px] resize-none`} 
                      placeholder="<script>...</script>"
                    ></textarea>
                  </div>
               </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6">Importância do Tracking</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                    Configurar corretamente seus pixels permite que o algoritmo das redes sociais entenda quem é seu comprador ideal. 
                  </p>
                  <ul className="space-y-4">
                     {[
                       'Até 40% mais precisão nas vendas',
                       'Otimização automática de lances',
                       'Remarketing para quem abandonou'
                     ].map((t, i) => (
                       <li key={i} className="flex gap-3 items-center text-[10px] font-black uppercase tracking-tighter">
                          <i className="fa-solid fa-circle-check text-emerald-500"></i>
                          {t}
                       </li>
                     ))}
                  </ul>
               </div>
               <i className="fa-solid fa-bullseye absolute -right-6 -bottom-6 text-9xl text-white opacity-5 rotate-12"></i>
            </div>

            <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
               <h4 className="font-black text-indigo-900 text-xs uppercase tracking-widest mb-4">Eventos Enviados</h4>
               <div className="space-y-2">
                  {['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase'].map(ev => (
                    <div key={ev} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-100 shadow-sm">
                       <span className="text-[10px] font-black text-slate-700 uppercase">{ev}</span>
                       <Badge variant="success" className="!text-[8px] !px-1.5 !py-0">ATIVO</Badge>
                    </div>
                  ))}
               </div>
            </div>

            <div className="pt-6">
               <Button isLoading={loading} type="submit" className="w-full !py-6 shadow-2xl shadow-indigo-100 rounded-[2rem] text-sm font-black uppercase tracking-widest">
                  Salvar Alterações
               </Button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};
