
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CATEGORIES } from '../../constants';
import { GoogleGenAI } from "@google/genai";

export const CreateEventWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Form State
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const handleAiGenerate = async () => {
    if (!eventName) {
      alert('Por favor, dê um nome ao evento primeiro para que a IA possa se basear nele.');
      return;
    }

    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva uma descrição atraente, profissional e persuasiva para um evento chamado "${eventName}" na categoria "${category}". Use bullet points para destacar benefícios e mantenha um tom empolgante.`,
      });
      
      if (response.text) {
        setDescription(response.text);
      }
    } catch (error) {
      console.error("Erro na IA:", error);
      alert("Não foi possível gerar a descrição agora. Verifique sua conexão.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/organizador/dashboard');
    }, 2000);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400";
  const labelClasses = "text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0 -translate-y-1/2"></div>
            {[
              { number: 1, title: 'Dados Básicos' },
              { number: 2, title: 'Ingressos' },
              { number: 3, title: 'Publicação' },
            ].map((s) => (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= s.number ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-2 text-gray-400'
                }`}>
                  {step > s.number ? <i className="fa-solid fa-check"></i> : s.number}
                </div>
                <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${step === s.number ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-white rounded-3xl border shadow-xl p-8 md:p-12 text-left">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">Conte-nos sobre o evento</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className={labelClasses}>Imagem de Destaque (1:1)</label>
                  <div className="mt-2 aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                    <i className="fa-solid fa-image text-gray-300 text-3xl group-hover:text-indigo-400 transition-colors mb-2"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Quadrado</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Imagem de Capa (Panorâmica)</label>
                  <div className="mt-2 aspect-[21/9] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                    <i className="fa-solid fa-panorama text-gray-300 text-4xl group-hover:text-indigo-400 transition-colors mb-2"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Banner</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClasses}>Nome do Evento</label>
                  <input 
                    type="text" 
                    className={inputClasses} 
                    placeholder="Ex: Show na Praia de Verão" 
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Categoria</label>
                  <select 
                    className={inputClasses} 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Data</label>
                  <input type="date" className={inputClasses} />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className={labelClasses}>Local (ou Link se online)</label>
                  <input type="text" className={inputClasses} placeholder="Rua das Experiências, 123 ou zoom.us/..." />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className={labelClasses}>Descrição Detalhada</label>
                    <button 
                      type="button"
                      onClick={handleAiGenerate}
                      disabled={aiLoading}
                      className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-100 transition-all disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                      ) : (
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                      )}
                      Gerar com IA
                    </button>
                  </div>
                  <textarea 
                    rows={6} 
                    className={inputClasses} 
                    placeholder="O que as pessoas podem esperar do seu evento?"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  ></textarea>
                  <p className="text-[10px] text-gray-400 italic">Dica: Use nosso assistente para criar uma descrição matadora em segundos.</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Configurar Ingressos</h2>
                <Button size="sm" variant="outline">+ Adicionar Lote</Button>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed rounded-2xl bg-gray-50 flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Crie seu primeiro lote</h4>
                    <p className="text-sm text-gray-500">Você pode criar ingressos pagos ou gratuitos.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Ingresso Pago</Button>
                    <Button size="sm" variant="secondary">Gratuito</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-2xl font-bold text-gray-900">Revisão e Publicação</h2>
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">Tudo pronto!</h4>
                <p className="text-indigo-800 text-sm leading-relaxed">
                  Ao publicar, seu evento ficará disponível para milhares de pessoas na plataforma.
                </p>
              </div>
              <div className="bg-gray-50 p-4 border rounded-xl flex items-center gap-4">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600" />
                <label className="text-sm text-gray-700 font-medium">Eu li e concordo com os Termos do Organizador.</label>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setStep(s => s - 1)} 
              disabled={step === 1}
            >
              Anterior
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)}>Próximo Passo</Button>
            ) : (
              <Button isLoading={loading} onClick={handleFinish}>Publicar Evento</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
