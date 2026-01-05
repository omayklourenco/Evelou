
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { UserRole, KYCStatus } from '../../types';

export const UserDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock do usuário detalhado (Simulando um Organizador para teste de KYC)
  const [user, setUser] = useState({
    id: id || '1',
    name: 'Marcos Oliveira',
    email: 'marcos@evelouproducoes.com',
    role: UserRole.ORGANIZER,
    status: 'active',
    isVerified: false,
    kycStatus: 'pending' as KYCStatus,
    joined: '2024-01-15',
    lastLogin: '2024-08-20 14:45',
    ip: '189.12.34.56',
    location: 'Salvador, BA - Brasil',
    device: 'iPhone 15 Pro - iOS 17.4',
    ordersCount: 12,
    totalSpent: 0,
    totalEarned: 15400.00,
    disputes: 0
  });

  const activityLog = [
    { date: '2024-08-20 14:45', action: 'Login realizado', status: 'success' },
    { date: '2024-08-19 11:30', action: 'Enviou documentos para verificação', status: 'info' },
    { date: '2024-08-10 19:12', action: 'Configurou conta Stripe Connect', status: 'success' },
  ];

  const handleVerify = (approve: boolean) => {
    setIsVerifying(true);
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        isVerified: approve,
        kycStatus: approve ? 'verified' : 'rejected'
      }));
      setIsVerifying(false);
      alert(approve ? 'Organizador verificado com sucesso!' : 'Verificação rejeitada.');
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 text-left">
      <header className="mb-8">
        <nav className="flex text-[10px] font-black uppercase tracking-widest text-slate-400 gap-2 mb-4">
          <Link to="/admin/dashboard" className="hover:text-indigo-600">Admin</Link>
          <span>/</span>
          <Link to="/admin/usuarios" className="hover:text-indigo-600">Usuários</Link>
          <span>/</span>
          <span className="text-slate-900 uppercase">Dossiê do Usuário</span>
        </nav>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=128`} 
                className="w-24 h-24 rounded-[2.5rem] border-4 border-white shadow-xl object-cover" 
                alt="" 
              />
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                  <i className="fa-solid fa-check text-sm"></i>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{user.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant={user.role === UserRole.ADMIN ? 'info' : user.role === UserRole.ORGANIZER ? 'warning' : 'gray'}>{user.role}</Badge>
                <Badge variant={user.status === 'active' ? 'success' : 'error'}>Conta {user.status === 'active' ? 'Ativa' : 'Suspensa'}</Badge>
                <span className="text-xs font-bold text-slate-400">ID: #{user.id}982</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none !bg-white" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button variant="danger" className="flex-1 md:flex-none">
              <i className="fa-solid fa-user-slash mr-2"></i> Suspender Conta
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* KYC DOCUMENT SECTION */}
          {user.role === UserRole.ORGANIZER && (
            <div className="bg-white rounded-[2.5rem] border shadow-sm p-8 border-indigo-100">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Verificação de Identidade (KYC)</h3>
                    <p className="text-sm text-slate-500">Analise os documentos enviados pelo organizador.</p>
                  </div>
                  <Badge variant={user.kycStatus === 'verified' ? 'success' : user.kycStatus === 'pending' ? 'warning' : 'gray'}>
                    {user.kycStatus.toUpperCase()}
                  </Badge>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><i className="fa-solid fa-id-card"></i></div>
                       <div>
                          <p className="text-xs font-bold text-slate-700">Documento de Identidade</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Frente e Verso • PDF</p>
                       </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest">Visualizar</button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><i className="fa-solid fa-file-invoice"></i></div>
                       <div>
                          <p className="text-xs font-bold text-slate-700">Comprovante de Endereço</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Últimos 90 dias • JPG</p>
                       </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest">Visualizar</button>
                  </div>
               </div>

               {!user.isVerified ? (
                 <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
                    <Button 
                      className="flex-1 shadow-lg shadow-emerald-100 !bg-emerald-500 hover:!bg-emerald-600 border-none" 
                      onClick={() => handleVerify(true)}
                      isLoading={isVerifying}
                    >
                      <i className="fa-solid fa-check-circle mr-2"></i> Aprovar e Verificar Perfil
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 !border-red-100 !text-red-500 hover:!bg-red-50"
                      onClick={() => handleVerify(false)}
                      disabled={isVerifying}
                    >
                      <i className="fa-solid fa-times-circle mr-2"></i> Rejeitar Documentos
                    </Button>
                 </div>
               ) : (
                 <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <i className="fa-solid fa-shield-check text-emerald-500 text-xl"></i>
                       <p className="text-sm font-bold text-emerald-800">Este perfil foi verificado em {new Date().toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleVerify(false)} className="text-[10px] font-black text-red-500 uppercase tracking-widest underline">Revogar Selo</button>
                 </div>
               )}
            </div>
          )}

          {/* Activity Log */}
          <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
             <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Logs de Atividade</h3>
                <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Ver Todos</button>
             </div>
             <div className="divide-y text-sm">
                {activityLog.map((log, i) => (
                  <div key={i} className="px-8 py-4 flex justify-between items-center hover:bg-slate-50/50 transition">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'success' ? 'bg-emerald-500' : 
                          log.status === 'info' ? 'bg-indigo-500' : 'bg-red-500'
                        }`}></div>
                        <p className="font-medium text-slate-700">{log.action}</p>
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.date}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Informações de Acesso</h3>
             <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-3">
                   <i className="fa-solid fa-location-dot mt-1 text-indigo-500"></i>
                   <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Localização</p>
                      <p className="text-sm font-bold">{user.location}</p>
                      <p className="text-[10px] text-slate-500 font-mono">IP: {user.ip}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <i className="fa-solid fa-mobile-screen mt-1 text-indigo-500"></i>
                   <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Dispositivo</p>
                      <p className="text-sm font-bold">{user.device}</p>
                   </div>
                </div>
             </div>
             <i className="fa-solid fa-fingerprint absolute -right-6 -bottom-6 text-9xl text-white opacity-5 rotate-12"></i>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm">
             <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Notas Internas (Admin)</h3>
             <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-40 mb-4"
              placeholder="Adicione observações sobre a verificação aqui..."
             ></textarea>
             <Button className="w-full" size="sm">Salvar Nota</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
