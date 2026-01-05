
import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { MOCK_EVENTS, MOCK_PURCHASED_TICKETS, MOCK_ORDERS, CATEGORIES } from '../../constants';
import { UserRole, StripeStatus, TicketStatus, PurchasedTicket, Event } from '../../types';
import { Badge } from '../../components/ui/Badge';

type ProfileView = 'main' | 'personal_data' | 'security' | 'payments';

export const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [profileView, setProfileView] = useState<ProfileView>('main');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const { user, logout, updateUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<PurchasedTicket | null>(null);
  const [ticketFilter, setTicketFilter] = useState<'valid' | 'used'>('valid');
  
  // Organizer specific states
  const [selectedGateEvent, setSelectedGateEvent] = useState<string | null>(null);
  const [managingEventId, setManagingEventId] = useState<string | null>(null);
  const [showCourtesyForm, setShowCourtesyForm] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [gateSearchQuery, setGateSearchQuery] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{status: 'ok' | 'error', msg: string} | null>(null);

  // States for sub-pages
  const [notifications, setNotifications] = useState(true);
  const [faceId, setFaceId] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Courtesy form states
  const [courtesyForm, setCourtesyForm] = useState({
    name: '',
    email: '',
    ticketTypeId: '',
    quantity: 1
  });

  // Edit Event state
  const [editEventForm, setEditEventForm] = useState({
    name: '',
    category: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  // Form states (User Profile)
  const [personalForm, setPersonalForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 99999-8888',
    cpf: '123.456.789-00',
    birthDate: '1995-05-15'
  });

  // Camera state for Scanner
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (user?.role === UserRole.ORGANIZER) {
      setIsOrganizer(true);
      setActiveTab('dashboard');
    }
  }, [user]);

  // Handle Scan Simulation
  const simulateScan = (status: 'ok' | 'error', name: string) => {
    setScanFeedback({ 
      status, 
      msg: status === 'ok' ? `LIBERADO: ${name}` : 'ERRO: INGRESSO INVÁLIDO' 
    });
    setTimeout(() => setScanFeedback(null), 2500);
  };

  // Load event data into edit form
  useEffect(() => {
    if (showEditDetails && managingEventId) {
      const ev = MOCK_EVENTS.find(e => e.id === managingEventId);
      if (ev) {
        setEditEventForm({
          name: ev.name,
          category: ev.category,
          date: ev.date,
          time: ev.time,
          location: ev.location,
          description: ev.description
        });
      }
    }
  }, [showEditDetails, managingEventId]);

  // Request camera for Scanner
  useEffect(() => {
    if (activeTab === 'scanner' && selectedGateEvent) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(() => setHasCameraPermission(true))
        .catch(() => setHasCameraPermission(false));
    }
  }, [activeTab, selectedGateEvent]);

  useEffect(() => {
    if (activeTab === 'scanner' && hasCameraPermission && videoRef.current && selectedGateEvent) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
    }
  }, [activeTab, hasCameraPermission, selectedGateEvent]);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalForm.name || !personalForm.email || !personalForm.phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ name: personalForm.name, email: personalForm.email });
      setIsSaving(false);
      setProfileView('main');
    }, 1500);
  };

  const handleIssueCourtesy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Cortesia enviada com sucesso para ${courtesyForm.name}!`);
      setCourtesyForm({ name: '', email: '', ticketTypeId: '', quantity: 1 });
      setShowCourtesyForm(false);
    }, 2000);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Informações do evento atualizadas com sucesso!');
      setShowEditDetails(false);
    }, 1800);
  };

  const filteredEvents = MOCK_EVENTS.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ticketsToList = MOCK_PURCHASED_TICKETS.filter(t => 
    ticketFilter === 'valid' ? t.status === TicketStatus.VALID : t.status === TicketStatus.USED
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-500 text-left pb-10">
            {/* Top Bar / Greeting */}
            <header className="px-6 pt-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Bom dia!</p>
                <h2 className="font-black text-xl text-gray-900 tracking-tight">
                  {user ? `Olá, ${user.name.split(' ')[0]}` : 'Explorar'} 👋
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-2xl bg-white border shadow-sm flex items-center justify-center text-gray-400">
                  <i className="fa-solid fa-bell"></i>
                </button>
                <img 
                  onClick={() => { setActiveTab('profile'); setProfileView('main'); }}
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=Guest'} 
                  className="w-10 h-10 rounded-2xl border-2 border-white shadow-md object-cover cursor-pointer" 
                />
              </div>
            </header>
            
            <div className="px-6 mb-6">
              <button className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700">
                <i className="fa-solid fa-location-dot"></i>
                Salvador, BA
                <i className="fa-solid fa-chevron-down text-[8px]"></i>
              </button>
            </div>

            <div className="px-6 mb-8">
              <div 
                className="relative group cursor-pointer"
                onClick={() => setActiveTab('search')}
              >
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <div className="w-full pl-11 pr-4 py-4 rounded-[1.5rem] bg-white border-none text-sm shadow-xl shadow-gray-200/50 text-gray-400">
                  Artistas, festas ou teatro...
                </div>
              </div>
            </div>

            <div className="mb-8 overflow-hidden">
               <div className="flex gap-4 overflow-x-auto pb-4 px-6 scrollbar-hide">
                  {[
                    { name: 'Show', icon: 'fa-music', color: 'bg-orange-500' },
                    { name: 'Festa', icon: 'fa-glass-cheers', color: 'bg-pink-500' },
                    { name: 'Teatro', icon: 'fa-masks-theater', color: 'bg-purple-500' },
                    { name: 'Curso', icon: 'fa-graduation-cap', color: 'bg-blue-500' },
                    { name: 'Esporte', icon: 'fa-basketball', color: 'bg-emerald-500' },
                  ].map((cat, i) => (
                    <button key={i} className="flex flex-col items-center gap-2 shrink-0 group active:scale-95 transition-transform">
                       <div className={`w-14 h-14 ${cat.color} rounded-[1.5rem] flex items-center justify-center text-white text-lg shadow-lg shadow-${cat.color.split('-')[1]}-200/50`}>
                          <i className={`fa-solid ${cat.icon}`}></i>
                       </div>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter group-active:text-indigo-600 transition-colors">{cat.name}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end px-6 mb-4">
                <h3 className="font-black text-gray-900 tracking-tight">Em Destaque</h3>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest active:opacity-50">Ver Tudo</button>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-6 px-6 scrollbar-hide">
                {MOCK_EVENTS.map(event => (
                  <div key={event.id} className="min-w-[280px] bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/40 group active:scale-[0.98] transition-all">
                    <div className="relative h-40">
                      <img src={event.banner} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                         <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-2xl shadow-sm text-center min-w-[45px]">
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter leading-none">{new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                            <p className="text-sm font-black text-indigo-600 leading-none mt-0.5">{new Date(event.date).getDate()}</p>
                         </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                         <Badge variant="success" className="shadow-lg !bg-indigo-600 !text-white border-none !py-1.5 !px-3 font-black">R$ {event.tickets[0].price.toFixed(0)}</Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-black text-gray-900 text-sm line-clamp-1 mb-1">{event.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-indigo-400"></i> {event.location.split(',')[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'search':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left pb-10">
            <header className="px-6 pt-6 mb-6">
              <h2 className="font-black text-2xl text-gray-900 tracking-tight mb-6">Encontrar</h2>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 text-sm"></i>
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="O que você quer viver hoje?" 
                  className="w-full pl-12 pr-12 py-4 rounded-[1.5rem] bg-white border-none text-sm shadow-xl shadow-gray-200/50 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-gray-400" 
                />
              </div>
            </header>
            <div className="px-6">
                <div className="grid grid-cols-2 gap-4">
                {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm active:scale-95 transition-transform group">
                        <div className="relative h-28">
                        <img src={event.banner} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                        <h4 className="font-black text-gray-900 text-[11px] line-clamp-2 leading-tight mb-2">{event.name}</h4>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-[10px] font-black text-indigo-600 tracking-tighter">R$ {event.tickets[0].price.toFixed(0)}</span>
                        </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
          </div>
        );
      
      case 'tickets':
        if (selectedTicket) {
          return (
            <div className="animate-in slide-in-from-right duration-300 text-left px-6 pt-4 pb-24 h-full flex flex-col">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-10 h-10 rounded-2xl bg-white border shadow-sm flex items-center justify-center text-gray-900 mb-4 active:scale-90 transition-transform"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-gray-100 relative flex-1 flex flex-col mb-4">
                <div className="p-6 text-center border-b border-dashed border-gray-100">
                   <Badge variant="success" className="mb-3 !bg-emerald-500 !text-white border-none shadow-lg shadow-emerald-100 font-black text-[9px] uppercase">Ingresso Válido</Badge>
                   <h3 className="font-black text-lg text-gray-900 leading-tight mb-1">{selectedTicket.eventName}</h3>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{selectedTicket.ticketName}</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50/30">
                   <div className="p-4 bg-white rounded-[2rem] shadow-xl border-4 border-slate-900 relative group">
                      <div className="w-40 h-40 flex items-center justify-center">
                         <i className="fa-solid fa-qrcode text-[150px] text-slate-900"></i>
                      </div>
                   </div>
                   <p className="mt-6 text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] animate-pulse">Apresente na Portaria</p>
                </div>

                <div className="flex justify-between px-0 relative -mt-4 mb-2">
                  <div className="w-6 h-6 bg-gray-50 rounded-full -ml-3 border-r shadow-inner"></div>
                  <div className="flex-1 border-t-2 border-dashed border-gray-100 mt-3 mx-1"></div>
                  <div className="w-6 h-6 bg-gray-50 rounded-full -mr-3 border-l shadow-inner"></div>
                </div>

                <div className="p-6 space-y-4 bg-white">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Data do Evento</p>
                        <p className="text-[11px] font-bold text-gray-900">{new Date(selectedTicket.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às 18:00</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Código Ticket</p>
                        <p className="text-[11px] font-mono font-bold text-slate-900">{selectedTicket.id}</p>
                      </div>
                   </div>
                   
                   <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Titular</p>
                      <p className="text-[11px] font-bold text-gray-900">{selectedTicket.buyerName}</p>
                   </div>

                   <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Localização</p>
                      <p className="text-[10px] font-medium text-gray-500 leading-tight">{selectedTicket.eventLocation}</p>
                   </div>

                   <div className="pt-2 space-y-2">
                      <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                        <i className="fa-solid fa-file-pdf mr-2"></i> Baixar Ingresso PDF
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                         <button className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all">
                           <i className="fa-brands fa-apple text-sm"></i> Wallet
                         </button>
                         <button className="flex items-center justify-center gap-2 py-3 bg-[#4285F4] text-white rounded-xl text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all">
                           <i className="fa-brands fa-google text-sm"></i> Wallet
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="p-6 animate-in fade-in duration-300 text-left pb-24">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Meus Ingressos</h2>
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-2xl w-fit">
               <button 
                onClick={() => setTicketFilter('valid')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${ticketFilter === 'valid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                Próximos
               </button>
               <button 
                onClick={() => setTicketFilter('used')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${ticketFilter === 'used' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                Histórico
               </button>
            </div>

            <div className="space-y-6">
              {ticketsToList.length > 0 ? ticketsToList.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/40 flex active:scale-95 transition-transform group cursor-pointer"
                >
                  <div className="w-24 shrink-0 relative overflow-hidden">
                    <img src={MOCK_EVENTS[0].banner} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[1px] flex items-center justify-center">
                       <div className="text-white text-center">
                          <p className="text-[10px] font-black uppercase leading-none">{new Date(ticket.eventDate).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                          <p className="text-xl font-black">{new Date(ticket.eventDate).getDate()}</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-5 relative">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-gray-50 rounded-full border border-gray-100 shadow-inner"></div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{ticket.ticketName}</p>
                      <i className="fa-solid fa-qrcode text-gray-300 group-hover:text-indigo-600 transition-colors"></i>
                    </div>
                    <h4 className="font-black text-sm text-gray-900 line-clamp-1 mb-1">{ticket.eventName}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{ticket.eventLocation.split(',')[0]}</p>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center">
                   <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-3xl">
                      <i className="fa-solid fa-ticket-simple"></i>
                   </div>
                   <h3 className="font-black text-gray-900 mb-2">Vazio por aqui</h3>
                   <button onClick={() => setActiveTab('home')} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Explorar Eventos</button>
                </div>
              )}
            </div>
          </div>
        );

      case 'profile':
        if (profileView === 'personal_data') {
           return (
            <div className="animate-in slide-in-from-right duration-300 text-left px-6 pt-4 pb-24">
              <button onClick={() => setProfileView('main')} className="w-10 h-10 rounded-2xl bg-white border shadow-sm flex items-center justify-center mb-6"><i className="fa-solid fa-chevron-left"></i></button>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Dados Pessoais</h2>
              
              <form onSubmit={handleSavePersonal} className="space-y-6">
                <div className="flex justify-center mb-8">
                   <div className="relative">
                      <img src={user?.avatar} className="w-24 h-24 rounded-[2.5rem] border-4 border-white shadow-xl object-cover" />
                      <button type="button" className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-2xl flex items-center justify-center border-2 border-white shadow-lg"><i className="fa-solid fa-camera text-[10px]"></i></button>
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Nome Completo *</label>
                   <input required type="text" value={personalForm.name} onChange={e => setPersonalForm({...personalForm, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">E-mail de Contato *</label>
                   <input required type="email" value={personalForm.email} onChange={e => setPersonalForm({...personalForm, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">WhatsApp *</label>
                   <input required type="text" value={personalForm.phone} onChange={e => setPersonalForm({...personalForm, phone: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">CPF</label>
                    <input type="text" value={personalForm.cpf} readOnly className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-400 cursor-not-allowed outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Nascimento</label>
                    <input type="date" value={personalForm.birthDate} onChange={e => setPersonalForm({...personalForm, birthDate: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <button type="submit" disabled={isSaving} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 mt-10 active:scale-95 transition-all">
                   {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </form>
            </div>
           );
        }

        if (profileView === 'security') {
           return (
            <div className="animate-in slide-in-from-right duration-300 text-left px-6 pt-4 pb-24">
              <button onClick={() => setProfileView('main')} className="w-10 h-10 rounded-2xl bg-white border shadow-sm flex items-center justify-center mb-6"><i className="fa-solid fa-chevron-left"></i></button>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Segurança</h2>
              
              <div className="space-y-8">
                <section>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Trocar Senha</h3>
                   <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                      <input type="password" placeholder="Senha Atual" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm" />
                      <input type="password" placeholder="Nova Senha" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm" />
                      <button className="text-indigo-600 font-bold text-xs">Esqueceu a senha?</button>
                   </div>
                </section>

                <section>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Autenticação</h3>
                   <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y">
                      <div className="px-6 py-5 flex items-center justify-between">
                         <div>
                            <p className="text-sm font-bold text-gray-700">Verificação em 2 etapas</p>
                            <p className="text-[10px] text-gray-400">Proteja sua conta com SMS</p>
                         </div>
                         <button className="w-10 h-6 bg-emerald-500 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></button>
                      </div>
                      <div className="px-6 py-5 flex items-center justify-between">
                         <div>
                            <p className="text-sm font-bold text-gray-700">Dispositivos Conectados</p>
                            <p className="text-[10px] text-gray-400">Ver onde você está logado</p>
                         </div>
                         <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                      </div>
                   </div>
                </section>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest mt-4">Atualizar Segurança</button>
              </div>
            </div>
           );
        }

        if (profileView === 'payments') {
           return (
            <div className="animate-in slide-in-from-right duration-300 text-left px-6 pt-4 pb-24">
              <button onClick={() => setProfileView('main')} className="w-10 h-10 rounded-2xl bg-white border shadow-sm flex items-center justify-center mb-6"><i className="fa-solid fa-chevron-left"></i></button>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Pagamentos</h2>

              <div className="space-y-6">
                <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                   <div className="flex justify-between items-start relative z-10">
                      <i className="fa-solid fa-microchip text-4xl opacity-50"></i>
                      <i className="fa-brands fa-cc-visa text-4xl"></i>
                   </div>
                   <div className="mt-8 relative z-10">
                      <p className="text-sm opacity-50 uppercase tracking-widest mb-2 font-bold">Cartão Principal</p>
                      <p className="text-xl font-bold tracking-[0.2em]">•••• •••• •••• 4522</p>
                   </div>
                   <div className="mt-auto pt-6 flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-[9px] opacity-50 uppercase font-black">Titular</p>
                        <p className="text-xs font-bold uppercase">{user?.name}</p>
                      </div>
                      <p className="text-xs font-bold">12/28</p>
                   </div>
                   <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <section>
                   <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Métodos Salvos</h3>
                   <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-6 py-5 flex items-center justify-between border-b last:border-0">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-7 bg-slate-50 rounded border flex items-center justify-center text-blue-600"><i className="fa-brands fa-cc-mastercard text-lg"></i></div>
                            <div>
                               <p className="text-sm font-bold text-gray-700">Mastercard Final 2201</p>
                               <p className="text-[9px] font-black text-gray-300 uppercase">Expira em 05/26</p>
                            </div>
                         </div>
                         <button className="text-gray-300 hover:text-red-500 transition"><i className="fa-solid fa-trash-can text-sm"></i></button>
                      </div>
                      <button className="w-full px-6 py-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                         <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner"><i className="fa-solid fa-plus"></i></div>
                         <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">Novo Cartão</span>
                      </button>
                   </div>
                </section>
                
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4">
                   <i className="fa-solid fa-shield-check text-emerald-500 mt-1"></i>
                   <p className="text-[10px] text-emerald-800 leading-relaxed font-bold uppercase">Pagamentos processados com segurança via SSL 256 bits.</p>
                </div>
              </div>
            </div>
           );
        }

        return (
          <div className="animate-in slide-in-from-bottom-4 duration-500 text-left pb-24">
            <div className="px-6 pt-10 pb-8 bg-white border-b">
               <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img src={user?.avatar || 'https://ui-avatars.com/api/?name=Guest'} className="w-24 h-24 rounded-[2.5rem] border-4 border-gray-50 shadow-xl object-cover" />
                    <button onClick={() => setProfileView('personal_data')} className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
                       <i className="fa-solid fa-camera text-[10px]"></i>
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user?.name || 'Visitante'}</h2>
                    <p className="text-xs text-gray-400 font-bold mb-3">{user?.email || 'viva@experiencia.com'}</p>
                    <Badge variant="info" className="!bg-indigo-50 !text-indigo-600 !border-indigo-100 font-black !py-1 !px-3">MEMBRO BRONZE</Badge>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-3xl text-center border border-gray-100">
                     <p className="text-xl font-black text-gray-900 leading-none">12</p>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Eventos Vividos</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-3xl text-center border border-gray-100">
                     <p className="text-xl font-black text-gray-900 leading-none">03</p>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Ingressos Ativos</p>
                  </div>
               </div>
            </div>

            <div className="p-6 space-y-8">
               <section>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Sua Conta</h3>
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                     <button onClick={() => setProfileView('personal_data')} className="w-full px-6 py-5 flex items-center justify-between border-b hover:bg-gray-50 transition group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-active:scale-90 transition-transform"><i className="fa-solid fa-user-gear"></i></div>
                           <span className="text-sm font-bold text-gray-700">Dados Pessoais</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                     </button>
                     <button onClick={() => setProfileView('security')} className="w-full px-6 py-5 flex items-center justify-between border-b hover:bg-gray-50 transition group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-active:scale-90 transition-transform"><i className="fa-solid fa-shield-halved"></i></div>
                           <span className="text-sm font-bold text-gray-700">Segurança & Senha</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                     </button>
                     <button onClick={() => setProfileView('payments')} className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-active:scale-90 transition-transform"><i className="fa-solid fa-credit-card"></i></div>
                           <span className="text-sm font-bold text-gray-700">Métodos de Pagamento</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                     </button>
                  </div>
               </section>

               <section>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Preferências</h3>
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-2 space-y-1">
                     <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                              <i className="fa-solid fa-bell"></i>
                           </div>
                           <span className="text-sm font-bold text-gray-700">Notificações Push</span>
                        </div>
                        <button 
                          onClick={() => setNotifications(!notifications)}
                          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${notifications ? 'bg-indigo-600' : 'bg-gray-200'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${notifications ? 'left-7' : 'left-1'}`}></div>
                        </button>
                     </div>
                     <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                              <i className="fa-solid fa-face-smile"></i>
                           </div>
                           <span className="text-sm font-bold text-gray-700">Face ID / Biometria</span>
                        </div>
                        <button 
                          onClick={() => setFaceId(!faceId)}
                          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${faceId ? 'bg-indigo-600' : 'bg-gray-200'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${faceId ? 'left-7' : 'left-1'}`}></div>
                        </button>
                     </div>
                  </div>
               </section>

               <div className="pt-4 px-2 text-center">
                  <button onClick={() => { logout(); setActiveTab('home'); }} className="w-full py-5 bg-rose-50 text-rose-600 rounded-[2rem] font-black text-xs uppercase tracking-widest border border-rose-100 active:scale-95 transition-all">
                     <i className="fa-solid fa-right-from-bracket mr-2"></i> Encerrar Sessão
                  </button>
                  <p className="text-[10px] text-gray-300 font-bold mt-8 uppercase tracking-widest">Evelou v2.4.8-stable • v2024.12.01</p>
               </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="animate-in fade-in duration-500 text-left pb-24">
            <header className="px-6 pt-6 mb-6 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Dashboard</p>
                  <h2 className="font-black text-2xl text-gray-900 tracking-tight">Painel do Org. 👋</h2>
               </div>
               <button className="w-10 h-10 rounded-2xl bg-white border shadow-sm flex items-center justify-center text-gray-400 relative">
                  <i className="fa-solid fa-bell"></i>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
            </header>

            <div className="px-6 mb-8">
               <div className="w-full bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                  <div className="relative z-10">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Disponível para saque</p>
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-lg font-bold">R$</span>
                        <span className="text-4xl font-black tracking-tighter">12.840,45</span>
                     </div>
                     <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                        Solicitar Resgate
                     </button>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  <i className="fa-solid fa-wallet absolute top-8 right-8 text-white/5 text-6xl"></i>
               </div>
            </div>

            <div className="px-6 mb-8 grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                     <i className="fa-solid fa-ticket"></i>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vendas Hoje</p>
                  <h4 className="text-xl font-black text-gray-900">42 <span className="text-[10px] text-emerald-500">+12%</span></h4>
               </div>
               <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                     <i className="fa-solid fa-user-check"></i>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-ins</p>
                  <h4 className="text-xl font-black text-gray-900">1.2k</h4>
               </div>
            </div>

            <div className="px-6 mb-8">
               <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Performance Semanal</h3>
                     <span className="text-[9px] font-bold text-gray-400 uppercase">Últimos 7 dias</span>
                  </div>
                  <div className="flex items-end justify-between h-24 gap-2">
                     {[35, 60, 45, 90, 65, 80, 55].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                           <div 
                              className="w-full bg-indigo-50 rounded-t-lg relative group overflow-hidden" 
                              style={{ height: `${val}%` }}
                           >
                              <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           </div>
                           <span className="text-[8px] font-black text-gray-300 uppercase">{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="px-6 mb-8 overflow-x-auto pb-4 scrollbar-hide">
               <div className="flex gap-4">
                  <button className="flex flex-col items-center gap-2 shrink-0 group active:scale-95 transition-transform">
                     <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-600 text-xl border shadow-sm">
                        <i className="fa-solid fa-plus"></i>
                     </div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Novo Evento</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 shrink-0 group active:scale-95 transition-transform">
                     <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-600 text-xl border shadow-sm">
                        <i className="fa-solid fa-chart-pie"></i>
                     </div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Relatórios</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 shrink-0 group active:scale-95 transition-transform">
                     <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-600 text-xl border shadow-sm">
                        <i className="fa-solid fa-bank"></i>
                     </div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Bancário</span>
                  </button>
               </div>
            </div>

            <div className="px-6 mb-8">
               <div className="flex justify-between items-end mb-4">
                  <h3 className="font-black text-gray-900 tracking-tight">Atividade Recente</h3>
                  <button onClick={() => setActiveTab('org_events')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Ver Tudo</button>
               </div>
               <div className="space-y-4">
                  {MOCK_ORDERS.slice(0, 3).map((order) => (
                     <div key={order.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <img 
                           src={`https://ui-avatars.com/api/?name=${order.buyerName}&background=random`} 
                           className="w-10 h-10 rounded-2xl object-cover" 
                        />
                        <div className="flex-1">
                           <h4 className="font-black text-gray-900 text-xs">{order.buyerName}</h4>
                           <p className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[120px]">{order.eventName}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-indigo-600 text-xs">R$ {order.total.toFixed(0)}</p>
                           <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter">Há 5 min</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'org_events':
        if (showEditDetails) {
          const eventToEdit = MOCK_EVENTS.find(e => e.id === managingEventId);
          return (
            <div className="animate-in slide-in-from-right duration-300 text-left pb-24 h-full flex flex-col">
              <header className="px-6 py-4 flex items-center gap-4 bg-white border-b sticky top-0 z-10">
                <button onClick={() => setShowEditDetails(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black truncate">Editar Detalhes</h3>
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{eventToEdit?.name}</p>
                </div>
              </header>

              <form onSubmit={handleUpdateEvent} className="flex-1 overflow-y-auto px-6 pt-6 space-y-6">
                {/* Visual Preview Section - Split Images with Recommendations */}
                <div className="space-y-6">
                   <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Foto de Destaque (1:1)</p>
                      <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-lg border-2 border-indigo-50">
                        <img src={`https://picsum.photos/seed/highlight${managingEventId}/300/300`} className="w-full h-full object-cover" />
                        <button type="button" className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 active:opacity-100 transition-opacity">
                           <i className="fa-solid fa-camera"></i>
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 italic ml-1">Recomendado: 800x800px</p>
                   </div>

                   <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capa do Evento (Banner)</p>
                      <div className="relative h-32 rounded-3xl overflow-hidden shadow-lg border-2 border-indigo-50">
                        <img src={eventToEdit?.banner} className="w-full h-full object-cover" />
                        <button type="button" className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 active:opacity-100 transition-opacity">
                           <i className="fa-solid fa-camera"></i>
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 italic ml-1">Recomendado: 1920x820px</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Título do Evento</label>
                      <input 
                        required 
                        type="text" 
                        value={editEventForm.name}
                        onChange={e => setEditEventForm({...editEventForm, name: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Categoria</label>
                      <select 
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                        value={editEventForm.category}
                        onChange={e => setEditEventForm({...editEventForm, category: e.target.value})}
                      >
                         {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Data</label>
                        <input 
                          required 
                          type="date" 
                          value={editEventForm.date}
                          onChange={e => setEditEventForm({...editEventForm, date: e.target.value})}
                          className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Horário</label>
                        <input 
                          required 
                          type="time" 
                          value={editEventForm.time}
                          onChange={e => setEditEventForm({...editEventForm, time: e.target.value})}
                          className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                      </div>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Localização</label>
                      <input 
                        required 
                        type="text" 
                        value={editEventForm.location}
                        onChange={e => setEditEventForm({...editEventForm, location: e.target.value})}
                        placeholder="Endereço ou Link Online" 
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Descrição</label>
                      <textarea 
                        required 
                        rows={5}
                        value={editEventForm.description}
                        onChange={e => setEditEventForm({...editEventForm, description: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                      ></textarea>
                   </div>
                </div>

                <div className="pt-4 flex gap-3">
                   <button 
                    type="button" 
                    onClick={() => setShowEditDetails(false)}
                    className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                   >
                     Cancelar
                   </button>
                   <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="flex-[2] py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                   >
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                   </button>
                </div>
              </form>
            </div>
          );
        }

        if (showCourtesyForm) {
          const eventToManage = MOCK_EVENTS.find(e => e.id === managingEventId);
          return (
            <div className="animate-in slide-in-from-right duration-300 text-left pb-24 h-full flex flex-col">
              <header className="px-6 py-4 flex items-center gap-4 bg-white border-b sticky top-0 z-10">
                <button onClick={() => setShowCourtesyForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black truncate">Liberar Cortesia</h3>
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{eventToManage?.name}</p>
                </div>
              </header>

              <form onSubmit={handleIssueCourtesy} className="flex-1 overflow-y-auto px-6 pt-6 space-y-6">
                <div className="p-6 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
                   <i className="fa-solid fa-gift text-indigo-600 mt-1"></i>
                   <p className="text-[11px] text-indigo-800 leading-relaxed font-bold uppercase">Envie ingressos gratuitos diretamente para o e-mail do convidado.</p>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Nome do Convidado</label>
                      <input 
                        required 
                        type="text" 
                        value={courtesyForm.name}
                        onChange={e => setCourtesyForm({...courtesyForm, name: e.target.value})}
                        placeholder="Ex: Maria Clara" 
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">E-mail do Destinatário</label>
                      <input 
                        required 
                        type="email" 
                        value={courtesyForm.email}
                        onChange={e => setCourtesyForm({...courtesyForm, email: e.target.value})}
                        placeholder="convidado@email.com" 
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Tipo de Ingresso</label>
                      <select 
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                        value={courtesyForm.ticketTypeId}
                        onChange={e => setCourtesyForm({...courtesyForm, ticketTypeId: e.target.value})}
                      >
                         <option value="">Selecione o Lote</option>
                         {eventToManage?.tickets.map(t => (
                           <option key={t.id} value={t.id}>{t.name}</option>
                         ))}
                      </select>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantidade</p>
                        <p className="text-xs font-bold text-gray-900">{courtesyForm.quantity} {courtesyForm.quantity > 1 ? 'ingressos' : 'ingresso'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button type="button" onClick={() => setCourtesyForm({...courtesyForm, quantity: Math.max(1, courtesyForm.quantity - 1)})} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 hover:text-indigo-600 transition"><i className="fa-solid fa-minus"></i></button>
                         <span className="font-bold text-lg min-w-[20px] text-center">{courtesyForm.quantity}</span>
                         <button type="button" onClick={() => setCourtesyForm({...courtesyForm, quantity: Math.min(10, courtesyForm.quantity + 1)})} className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 hover:text-indigo-600 transition"><i className="fa-solid fa-plus"></i></button>
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                   <button type="submit" disabled={isSaving} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3">
                      {isSaving ? 'Processando...' : <><i className="fa-solid fa-paper-plane text-xs"></i> Emitir Cortesia</>}
                   </button>
                </div>
              </form>
            </div>
          );
        }

        if (managingEventId) {
          const eventToManage = MOCK_EVENTS.find(e => e.id === managingEventId);
          return (
            <div className="animate-in slide-in-from-right duration-300 text-left pb-24 h-full flex flex-col">
              <header className="px-6 py-4 flex items-center gap-4 bg-white border-b sticky top-0 z-10">
                <button onClick={() => setManagingEventId(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black truncate">{eventToManage?.name}</h3>
                  <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Painel de Gestão</p>
                </div>
                <button className="text-gray-400"><i className="fa-solid fa-ellipsis-vertical"></i></button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 pt-6">
                {/* Event Cover Small */}
                <div className="relative h-32 rounded-[2rem] overflow-hidden mb-6 shadow-lg">
                   <img src={eventToManage?.banner} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                      <Badge className="w-fit !bg-indigo-600 !text-white border-none uppercase text-[8px] font-black mb-1">PÚBLICO</Badge>
                      <p className="text-white text-[10px] font-bold"><i className="fa-solid fa-calendar mr-1"></i> {new Date(eventToManage?.date || '').toLocaleDateString()}</p>
                   </div>
                </div>

                {/* Event Realtime metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-white p-5 rounded-[2rem] border border-indigo-50 shadow-xl shadow-indigo-100/50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Receita Líquida</p>
                      <h4 className="text-xl font-black text-indigo-600 leading-none">R$ 8.420</h4>
                      <p className="text-[8px] text-emerald-500 font-bold mt-2 flex items-center gap-1"><i className="fa-solid fa-arrow-up"></i> +12% hoje</p>
                   </div>
                   <div className="bg-white p-5 rounded-[2rem] border border-indigo-50 shadow-xl shadow-indigo-100/50">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ingressos</p>
                      <h4 className="text-xl font-black text-gray-900 leading-none">145 / 300</h4>
                      <p className="text-[8px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">48.3% ocupação</p>
                   </div>
                </div>

                {/* Tickets Breakdown */}
                <div className="mb-8">
                   <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4 ml-2">Monitor de Lotes</h4>
                   <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-2 space-y-1">
                      {eventToManage?.tickets.map((t, idx) => (
                        <div key={idx} className="p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-xs font-black text-gray-900 leading-none">{t.name}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">R$ {t.price.toFixed(2)}</p>
                              </div>
                              <span className="text-[10px] font-black text-indigo-600">{t.available} rest.</span>
                           </div>
                           <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(t.available / t.quantity) * 100}%` }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Management Actions */}
                <div className="mb-8">
                   <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4 ml-2">Ferramentas Rápidas</h4>
                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setShowEditDetails(true)} className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col items-center gap-2 group active:scale-95 transition-all shadow-xl shadow-slate-200">
                         <i className="fa-solid fa-pen-to-square opacity-50 group-hover:opacity-100"></i>
                         <span className="text-[9px] font-black uppercase tracking-widest">Editar Detalhes</span>
                      </button>
                      <button onClick={() => setShowCourtesyForm(true)} className="p-4 bg-white text-indigo-600 border border-indigo-50 rounded-2xl flex flex-col items-center gap-2 group active:scale-95 transition-all shadow-lg">
                         <i className="fa-solid fa-gift opacity-50 group-hover:opacity-100"></i>
                         <span className="text-[9px] font-black uppercase tracking-widest">Liberar Cortesia</span>
                      </button>
                      <button className="p-4 bg-white text-rose-600 border border-rose-50 rounded-2xl flex flex-col items-center gap-2 group active:scale-95 transition-all shadow-lg">
                         <i className="fa-solid fa-pause-circle opacity-50 group-hover:opacity-100"></i>
                         <span className="text-[9px] font-black uppercase tracking-widest">Pausar Vendas</span>
                      </button>
                      <button className="p-4 bg-white text-emerald-600 border border-emerald-50 rounded-2xl flex flex-col items-center gap-2 group active:scale-95 transition-all shadow-lg">
                         <i className="fa-solid fa-share-nodes opacity-50 group-hover:opacity-100"></i>
                         <span className="text-[9px] font-black uppercase tracking-widest">Divulgar Link</span>
                      </button>
                   </div>
                </div>

                {/* Event Recent Feed */}
                <div className="pb-10">
                   <div className="flex justify-between items-end mb-4 ml-2">
                      <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Vendas Recentes</h4>
                      <button className="text-[8px] font-black text-indigo-600 uppercase tracking-tighter">Relatório Completo</button>
                   </div>
                   <div className="space-y-3">
                      {MOCK_ORDERS.slice(0, 4).map((order, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                           <div className="flex items-center gap-3">
                              <img src={`https://ui-avatars.com/api/?name=${order.buyerName}&background=random`} className="w-8 h-8 rounded-xl object-cover" />
                              <div>
                                 <p className="text-[10px] font-black text-gray-900 leading-none">{order.buyerName}</p>
                                 <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">{order.tickets[0].typeName}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-emerald-500 leading-none">R$ {order.total.toFixed(0)}</p>
                              <p className="text-[8px] text-gray-300 font-bold uppercase mt-1">Hoje às 10:22</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="animate-in fade-in duration-500 text-left pb-24 px-6 pt-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Meus Eventos</h2>
            
            <div className="space-y-6">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/40 group active:scale-[0.98] transition-all flex flex-col">
                  <div className="relative h-32 shrink-0">
                    <img src={event.banner} className="h-full w-full object-cover" />
                    <div className="absolute top-4 left-4">
                       <Badge variant={event.status === 'published' ? 'success' : 'gray'} className="shadow-lg !bg-indigo-600 !text-white border-none uppercase font-black tracking-widest text-[8px]">
                          {event.status === 'published' ? 'Ativo' : 'Encerrado'}
                       </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-black text-gray-900 text-sm line-clamp-1 flex-1 pr-4">{event.name}</h4>
                       <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">R$ {event.tickets[0].price.toFixed(0)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 mb-4">
                      <i className="fa-solid fa-calendar text-indigo-300"></i> {new Date(event.date).toLocaleDateString()}
                    </p>
                    
                    <div className="space-y-1.5">
                       <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-tighter">
                          <span className="text-gray-400">Vendas: 145 / 300</span>
                          <span className="text-indigo-600">48%</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: '48%' }}></div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-5">
                       <button onClick={() => { setSelectedGateEvent(event.id); setActiveTab('scanner'); }} className="py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">
                          Abrir Portaria
                       </button>
                       <button onClick={() => setManagingEventId(event.id)} className="py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">
                          Gerenciar
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'scanner':
        if (!selectedGateEvent) {
          return (
            <div className="animate-in fade-in duration-500 text-left pb-24 px-6 pt-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Portaria Mobile</h2>
              <p className="text-xs text-gray-400 font-bold mb-8 uppercase tracking-widest">Selecione um evento para escanear</p>
              
              <div className="space-y-4">
                {MOCK_EVENTS.map(event => (
                  <button 
                    key={event.id}
                    onClick={() => setSelectedGateEvent(event.id)}
                    className="w-full bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all"
                  >
                    <img src={event.banner} className="w-12 h-12 rounded-2xl object-cover" />
                    <div className="flex-1 text-left">
                       <h4 className="font-black text-gray-900 text-sm line-clamp-1">{event.name}</h4>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">82 presentes / 145 vendidos</p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[10px] text-gray-300"></i>
                  </button>
                ))}
              </div>
            </div>
          );
        }

        const activeEvent = MOCK_EVENTS.find(e => e.id === selectedGateEvent);

        return (
          <div className="relative h-full bg-black overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            {/* Full-Screen Alert Overlay */}
            {scanFeedback && (
              <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center animate-in fade-in duration-200 ${scanFeedback.status === 'ok' ? 'bg-emerald-500' : 'bg-rose-600'}`}>
                 <i className={`fa-solid ${scanFeedback.status === 'ok' ? 'fa-circle-check' : 'fa-circle-xmark'} text-9xl text-white mb-6 animate-bounce`}></i>
                 <h2 className="text-white text-3xl font-black text-center px-10 tracking-tighter uppercase leading-none">{scanFeedback.msg}</h2>
                 <p className="text-white/60 font-bold mt-4 uppercase tracking-[0.3em] text-[10px]">Liberando próximo...</p>
              </div>
            )}

            {/* Header Portaria Mobile */}
            <div className="bg-white/10 backdrop-blur-xl px-6 py-4 flex items-center justify-between shrink-0 relative z-20 border-b border-white/5">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedGateEvent(null)} className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white active:bg-white/20"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                  <div className="text-white">
                    <h3 className="text-sm font-black truncate max-w-[150px] leading-tight">{activeEvent?.name}</h3>
                    <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Portão Principal • 82/145</p>
                  </div>
               </div>
               <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg"><i className="fa-solid fa-bolt text-sm"></i></button>
               </div>
            </div>

            {/* Scanner Viewport */}
            <div className="flex-1 relative">
              {hasCameraPermission ? (
                <>
                  <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-64 h-64 border-4 border-white/20 rounded-[4rem] relative">
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-indigo-500 rounded-tl-[4rem] -mt-2 -ml-2"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-indigo-500 rounded-tr-[4rem] -mt-2 -mr-2"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-indigo-500 rounded-bl-[4rem] -mb-2 -ml-2"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-indigo-500 rounded-br-[4rem] -mb-2 -mr-2"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-full h-1.5 bg-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,1)] animate-[scan_2.5s_infinite] rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="mt-12 flex gap-4 px-6">
                       <button onClick={() => simulateScan('ok', 'Marcos Oliveira')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border border-white/10">Teste OK</button>
                       <button onClick={() => simulateScan('error', '')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border border-white/10">Teste Erro</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white bg-slate-900">
                   <i className="fa-solid fa-camera text-5xl mb-6 opacity-50"></i>
                   <h3 className="font-black mb-2 uppercase tracking-widest text-lg">Câmera Bloqueada</h3>
                   <p className="text-xs text-white/40 mb-10 leading-relaxed px-10">Precisamos da câmera para ler os ingressos. Ative as permissões nas configurações do seu celular.</p>
                   <button onClick={() => window.location.reload()} className="bg-indigo-600 px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-900">Tentar Novamente</button>
                </div>
              )}
            </div>

            {/* Bottom Interaction List - Fixed Spacing for Mobile Screen */}
            <div className="bg-slate-900 rounded-t-[3rem] p-6 max-h-[35%] overflow-y-auto shrink-0 relative z-10">
               <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6"></div>
               <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Acessos Recentes</h4>
                  <div className="relative flex-1 max-w-[180px] ml-4">
                     <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]"></i>
                     <input 
                      type="text" 
                      placeholder="Pesquisar..." 
                      className="w-full pl-8 pr-4 py-2 bg-slate-800 border-none rounded-xl text-[10px] text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={gateSearchQuery}
                      onChange={(e) => setGateSearchQuery(e.target.value)}
                     />
                  </div>
               </div>
               <div className="space-y-3">
                  {[
                    { name: 'João Silva', ticket: 'Lote VIP', time: 'Há 2 min', ok: true },
                    { name: 'Maria Souza', ticket: 'Inteira', time: 'Pendente', ok: false },
                    { name: 'Ricardo Lemos', ticket: 'Lote 1', time: 'Pendente', ok: false },
                  ].filter(p => p.name.toLowerCase().includes(gateSearchQuery.toLowerCase())).map((person, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${person.ok ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-white">{person.name}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">{person.ticket}</p>
                          </div>
                       </div>
                       {person.ok ? (
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">{person.time}</span>
                       ) : (
                         <button onClick={() => simulateScan('ok', person.name)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase active:scale-90 transition-transform">Check-in</button>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Simulator Frame */}
        <div className="relative mx-auto">
          <div className="relative w-[340px] h-[680px] bg-gray-900 rounded-[55px] border-[10px] border-gray-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-gray-800 rounded-b-3xl z-50 flex items-center justify-center">
               <div className="w-12 h-1 bg-gray-700/50 rounded-full"></div>
            </div>
            
            <div className="h-10 bg-transparent flex justify-between items-end px-8 pb-1 z-40">
              <span className="text-[12px] font-bold text-gray-800">9:41</span>
              <div className="flex gap-1.5 items-center">
                <i className="fa-solid fa-signal text-[10px] text-gray-800"></i>
                <i className="fa-solid fa-wifi text-[10px] text-gray-800"></i>
                <i className="fa-solid fa-battery-full text-[12px] text-gray-800"></i>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 overflow-y-auto scrollbar-hide pt-2 pb-24 relative">
              {renderContent()}
            </div>

            {/* Bottom Tabs */}
            {activeTab !== 'scanner' && (
              <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-xl border-t h-20 flex items-center justify-around px-4 pb-4">
                {isOrganizer ? (
                  <>
                    <button onClick={() => { setActiveTab('dashboard'); setManagingEventId(null); setShowCourtesyForm(false); setShowEditDetails(false); }} className={`flex flex-col items-center gap-1 transition ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <i className="fa-solid fa-chart-line text-lg"></i>
                      <span className="text-[10px] font-medium">Dash</span>
                    </button>
                    <button onClick={() => { setActiveTab('org_events'); setManagingEventId(null); setShowCourtesyForm(false); setShowEditDetails(false); }} className={`flex flex-col items-center gap-1 transition ${activeTab === 'org_events' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <i className="fa-solid fa-calendar-days text-lg"></i>
                      <span className="text-[10px] font-medium">Eventos</span>
                    </button>
                    <button onClick={() => { setSelectedGateEvent(null); setManagingEventId(null); setShowCourtesyForm(false); setShowEditDetails(false); setActiveTab('scanner'); }} className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg -mt-10 border-4 border-white active:scale-90 transition-transform">
                      <i className="fa-solid fa-qrcode text-xl"></i>
                    </button>
                    <button onClick={() => { setActiveTab('profile'); setProfileView('main'); setManagingEventId(null); setShowCourtesyForm(false); setShowEditDetails(false); }} className={`flex flex-col items-center gap-1 transition ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <i className="fa-solid fa-user text-lg"></i>
                      <span className="text-[10px] font-medium">Perfil</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <i className="fa-solid fa-house text-lg"></i>
                      <span className="text-[10px] font-medium">Início</span>
                    </button>
                    <button onClick={() => setActiveTab('search')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'search' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <i className="fa-solid fa-magnifying-glass text-lg"></i>
                      <span className="text-[10px] font-medium">Buscar</span>
                    </button>
                    <button onClick={() => { setActiveTab('tickets'); setSelectedTicket(null); }} className={`flex flex-col items-center gap-1 transition ${activeTab === 'tickets' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <i className="fa-solid fa-ticket text-lg"></i>
                      <span className="text-[10px] font-medium">Ingressos</span>
                    </button>
                    <button onClick={() => { setActiveTab('profile'); setProfileView('main'); }} className={`flex flex-col items-center gap-1 transition ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <i className="fa-solid fa-circle-user text-lg"></i>
                      <span className="text-[10px] font-medium">Perfil</span>
                    </button>
                  </>
                )}
              </div>
            )}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gray-800 rounded-full z-50"></div>
          </div>
        </div>

        {/* Info Column */}
        <div className="hidden lg:block space-y-8 text-left">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tighter">Simulador Mobile Evelou</h1>
            <p className="text-lg text-gray-600">Alterne entre os perfis para testar a experiência completa do app.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border shadow-sm">
            <h4 className="font-bold mb-4">Alternar Perfil</h4>
            <div className="flex gap-2">
              <button onClick={() => { setIsOrganizer(false); setActiveTab('home'); setManagingEventId(null); setShowCourtesyForm(false); setShowEditDetails(false); }} className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${!isOrganizer ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Comprador</button>
              <button onClick={() => { setIsOrganizer(true); setActiveTab('dashboard'); setManagingEventId(null); setShowCourtesyForm(false); setShowEditDetails(false); }} className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${isOrganizer ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Organizador</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
