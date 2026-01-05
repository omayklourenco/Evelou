
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Dados mockados de usuários
  const MOCK_USERS = [
    { id: '1', name: 'Marcos Oliveira', email: 'marcos@email.com', role: UserRole.BUYER, status: 'active', joined: '2024-01-15', totalSpent: 1250.00 },
    { id: '2', name: 'Evelou Produções', email: 'contato@evelou.com', role: UserRole.ORGANIZER, status: 'active', joined: '2023-11-20', totalEarned: 154000.00 },
    { id: '3', name: 'Admin João', email: 'joao@admin.com', role: UserRole.ADMIN, status: 'active', joined: '2022-05-10', totalEarned: 0 },
    { id: '4', name: 'Carla Souza', email: 'carla@fake.com', role: UserRole.BUYER, status: 'suspended', joined: '2024-02-01', totalSpent: 0 },
    { id: '5', name: 'Tech Events S.A', email: 'financeiro@tech.com', role: UserRole.ORGANIZER, status: 'pending', joined: '2024-03-12', totalEarned: 0 },
  ];

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const stats = [
    { label: 'Total de Usuários', val: '12.450', icon: 'fa-users', color: 'text-indigo-600' },
    { label: 'Organizadores', val: '842', icon: 'fa-building', color: 'text-emerald-600' },
    { label: 'Novos (Hoje)', val: '+124', icon: 'fa-user-plus', color: 'text-blue-600' },
    { label: 'Contas Banidas', val: '12', icon: 'fa-user-slash', color: 'text-red-600' },
  ];

  return (
    <div className="animate-in fade-in duration-500 text-left">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Gestão de Usuários</h1>
          <p className="text-slate-500 text-sm mt-2 uppercase font-black tracking-widest">Base de Dados e Auditoria de Contas</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              type="text" 
              placeholder="Buscar por Nome ou E-mail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          >
            <option value="all">Todos os Papéis</option>
            <option value={UserRole.BUYER}>Compradores</option>
            <option value={UserRole.ORGANIZER}>Organizadores</option>
            <option value={UserRole.ADMIN}>Administradores</option>
          </select>
        </div>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 ${s.color} flex items-center justify-center text-xl`}>
              <i className={`fa-solid ${s.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h4 className="text-xl font-black text-slate-900 leading-tight">{s.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Papel</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cadastro</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                        className="w-10 h-10 rounded-xl border object-cover" 
                        alt="" 
                      />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Badge variant={user.role === UserRole.ADMIN ? 'info' : user.role === UserRole.ORGANIZER ? 'warning' : 'gray'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-medium text-slate-700">{new Date(user.joined).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: #{user.id}982</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                       <span className={`w-2 h-2 rounded-full mb-1 ${
                         user.status === 'active' ? 'bg-emerald-500' : 
                         user.status === 'suspended' ? 'bg-red-500' : 'bg-amber-500'
                       }`}></span>
                       <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => navigate(`/admin/usuarios/${user.id}/detalhes`)}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition shadow-sm"
                        title="Ver Dossiê"
                       >
                         <i className="fa-solid fa-address-card text-xs"></i>
                       </button>
                       {user.role === UserRole.ORGANIZER && (
                         <Link 
                          to={`/admin/organizador/${user.id}/reputacao`}
                          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition shadow-sm"
                          title="Reputação"
                         >
                           <i className="fa-solid fa-award text-xs"></i>
                         </Link>
                       )}
                       <button 
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition shadow-sm"
                        title="Gerir Status"
                       >
                         <i className="fa-solid fa-shield-halved text-xs"></i>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
