
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TeamRole, TeamMember } from '../../types';

type TabType = 'profile' | 'organization' | 'users' | 'security' | 'notifications';

export const Settings: React.FC = () => {
  const { user, updateUser, verifyUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Mock Team Data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Ricardo Lemos', email: 'ricardo@evelou.com', role: TeamRole.ADMIN, status: 'active', joinedAt: '2024-01-10' },
    { id: '2', name: 'Ana Beatriz', email: 'ana.staff@gmail.com', role: TeamRole.STAFF, status: 'active', joinedAt: '2024-03-15' },
    { id: '3', name: 'Marcos Paulo', email: 'marcos@produtora.com', role: TeamRole.EDITOR, status: 'pending' },
  ]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    companyName: 'Evelou Produções LTDA',
    document: '12.345.678/0001-99',
    phone: '(11) 98888-7777',
    supportEmail: 'ajuda@evelouproducoes.com',
    address: 'Av. Paulista, 1000 - São Paulo, SP'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    setTimeout(() => {
      if (activeTab === 'profile') {
        updateUser({ name: formData.name, email: formData.email });
      }
      setLoading(false);
      setSuccessMsg('Configurações atualizadas com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1500);
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKycLoading(true);
    setTimeout(() => {
      verifyUser(false, 'pending');
      setKycLoading(false);
      setSuccessMsg('Documentos enviados para análise!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 2000);
  };

  const removeMember = (id: string) => {
    if (confirm('Tem certeza que deseja remover este membro da equipe?')) {
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      setSuccessMsg('Membro removido com sucesso.');
    }
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 text-sm";
  const labelClasses = "text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block";

  return (
    <div className="p-4 lg:p-8 text-left">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500 text-sm">Gerencie suas informações pessoais, da sua organizadora e equipe.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <aside className="md:w-64 space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <i className="fa-solid fa-user-circle"></i> Meu Perfil
            </button>
            <button 
              onClick={() => setActiveTab('organization')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === 'organization' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <i className="fa-solid fa-building"></i> Organizadora
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <i className="fa-solid fa-users"></i> Gestão de Equipe
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <i className="fa-solid fa-shield-halved"></i> Segurança
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <i className="fa-solid fa-bell"></i> Notificações
            </button>
          </aside>

          {/* Form Content */}
          <div className="flex-1 bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-8">
              {successMsg && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                  <i className="fa-solid fa-circle-check"></i> {successMsg}
                </div>
              )}

              {activeTab === 'profile' && (
                <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Informações do Perfil</h3>
                  
                  <div className="flex items-center gap-6 pb-6">
                    <img src={user?.avatar} className="w-20 h-20 rounded-2xl border-2 border-white shadow-md" alt="" />
                    <div>
                      <Button variant="outline" size="sm" type="button">Alterar Foto</Button>
                      <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">JPG ou PNG. Máx 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClasses}>Nome Completo</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={inputClasses} 
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>E-mail de Acesso</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={inputClasses} 
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t flex justify-end gap-3">
                    <Button variant="ghost" type="button" onClick={() => window.location.reload()}>Descartar</Button>
                    <Button isLoading={loading} type="submit">Salvar Alterações</Button>
                  </div>
                </form>
              )}

              {activeTab === 'organization' && (
                <div className="space-y-10 animate-in fade-in duration-300">
                  <section className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Dados da Organizadora</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className={labelClasses}>Razão Social / Nome Fantasia</label>
                        <input 
                          type="text" 
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          className={inputClasses} 
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>CNPJ ou CPF</label>
                        <input 
                          type="text" 
                          value={formData.document}
                          className={inputClasses} 
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Telefone de Suporte</label>
                        <input 
                          type="text" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={inputClasses} 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClasses}>E-mail de Suporte aos Compradores</label>
                        <input 
                          type="email" 
                          value={formData.supportEmail}
                          onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                          placeholder="ajuda@suaempresa.com"
                          className={inputClasses} 
                        />
                        <p className="text-[10px] text-gray-400 mt-2 italic">Este e-mail será exibido nos ingressos e na página do evento.</p>
                      </div>
                    </div>
                    <Button isLoading={loading} onClick={handleSave} size="sm">Atualizar Dados</Button>
                  </section>

                  {/* KYC Verification Section */}
                  <section className="space-y-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Verificação de Perfil</h3>
                        <p className="text-xs text-gray-500">O selo de verificado aumenta em 40% a confiança dos compradores.</p>
                      </div>
                      <Badge variant={user?.kycStatus === 'verified' ? 'success' : user?.kycStatus === 'pending' ? 'info' : user?.kycStatus === 'rejected' ? 'error' : 'gray'}>
                        {user?.kycStatus?.toUpperCase() || 'NÃO INICIADO'}
                      </Badge>
                    </div>

                    {user?.kycStatus === 'verified' ? (
                      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-emerald-100">
                          <i className="fa-solid fa-shield-check"></i>
                        </div>
                        <div>
                          <p className="font-bold text-emerald-900 text-sm">Seu perfil está verificado!</p>
                          <p className="text-xs text-emerald-700">O selo azul já está visível em todos os seus eventos públicos.</p>
                        </div>
                      </div>
                    ) : user?.kycStatus === 'pending' ? (
                      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl animate-pulse">
                          <i className="fa-solid fa-hourglass-half"></i>
                        </div>
                        <div>
                          <p className="font-bold text-blue-900 text-sm">Documentos em análise</p>
                          <p className="text-xs text-blue-700">Nossa equipe está revisando suas informações. Prazo médio: 24 horas.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleKycSubmit} className="space-y-6">
                        {user?.kycStatus === 'rejected' && (
                          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-3">
                            <i className="fa-solid fa-circle-exclamation text-lg"></i>
                            <div>
                              <p>Verificação Rejeitada: Documentos ilegíveis.</p>
                              <p className="font-normal opacity-80">Por favor, envie fotos mais nítidas do seu RG/CNH.</p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className={labelClasses}>Documento de Identidade (Frente e Verso)</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer group">
                               <i className="fa-solid fa-id-card text-2xl text-gray-300 group-hover:text-indigo-400 mb-2"></i>
                               <p className="text-[10px] font-black text-gray-400 uppercase">Clique para fazer upload</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className={labelClasses}>Comprovante de Endereço / Contrato</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer group">
                               <i className="fa-solid fa-file-invoice text-2xl text-gray-300 group-hover:text-indigo-400 mb-2"></i>
                               <p className="text-[10px] font-black text-gray-400 uppercase">Clique para fazer upload</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-indigo-50 rounded-xl flex items-start gap-3">
                           <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-indigo-200 text-indigo-600 focus:ring-indigo-500" />
                           <p className="text-[10px] text-indigo-800 leading-relaxed font-medium">
                             Eu declaro que as informações e documentos enviados são verdadeiros e de minha titularidade, sob as penas da lei.
                           </p>
                        </div>

                        <Button isLoading={kycLoading} type="submit" className="w-full">
                          Solicitar Verificação de Perfil
                        </Button>
                      </form>
                    )}
                  </section>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                    <h3 className="text-lg font-bold text-gray-900">Membros da Equipe</h3>
                    <Button size="sm" type="button">
                      <i className="fa-solid fa-plus mr-2"></i> Convidar Membro
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-2xl overflow-hidden border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Membro</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nível de Acesso</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y bg-white">
                        {teamMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50 transition group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  member.role === TeamRole.ADMIN ? 'bg-red-500' : 
                                  member.role === TeamRole.EDITOR ? 'bg-indigo-500' : 'bg-green-500'
                                }`}></span>
                                <span className="font-medium text-gray-700 capitalize">{member.role.toLowerCase()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                                {member.status === 'active' ? 'Ativo' : 'Pendente'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                type="button"
                                onClick={() => removeMember(member.id)}
                                className="p-2 text-gray-300 hover:text-red-600 transition"
                                title="Remover da equipe"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase mb-2">Entenda as permissões:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-indigo-800 leading-tight">
                      <li><strong>Admin:</strong> Controle total da conta e dados financeiros.</li>
                      <li><strong>Editor:</strong> Gerencia eventos, ingressos e portaria.</li>
                      <li><strong>Staff:</strong> Acesso exclusivo para realizar check-in (Scanner).</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in duration-300 text-left">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Segurança da Conta</h3>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className={labelClasses}>Senha Atual</label>
                      <input type="password" className={inputClasses} placeholder="••••••••" />
                    </div>
                    <div>
                      <label className={labelClasses}>Nova Senha</label>
                      <input type="password" className={inputClasses} placeholder="Mínimo 8 caracteres" />
                    </div>
                    <div>
                      <label className={labelClasses}>Confirmar Nova Senha</label>
                      <input type="password" className={inputClasses} placeholder="••••••••" />
                    </div>
                  </div>

                  <hr className="my-8" />
                  
                  <div>
                    <h4 className="font-bold text-red-600 text-sm mb-2">Zona de Perigo</h4>
                    <p className="text-xs text-gray-500 mb-4">Ao excluir sua conta, todos os seus dados e histórico de eventos serão removidos permanentemente.</p>
                    <Button variant="danger" size="sm" type="button">Excluir minha conta</Button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-4">Preferências de Notificação</h3>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'n1', label: 'Resumo diário de vendas', desc: 'Receba um e-mail toda manhã com o total vendido no dia anterior.' },
                      { id: 'n2', label: 'Novos pedidos', desc: 'Notificação imediata para cada ingresso vendido.' },
                      { id: 'n3', label: 'Alertas de check-in', desc: 'Saiba quando 50%, 80% e 100% dos participantes chegarem.' },
                      { id: 'n4', label: 'Dicas de marketing', desc: 'Sugestões da Evelou para impulsionar suas vendas.' },
                    ].map(n => (
                      <div key={n.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition">
                        <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <div>
                          <p className="font-bold text-sm text-gray-900">{n.label}</p>
                          <p className="text-xs text-gray-500">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
