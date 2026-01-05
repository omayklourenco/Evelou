
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Coupon } from '../../types';
import { MOCK_EVENTS } from '../../constants';

export const CouponsList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: '1', code: 'PRIMEIRACOMPRA', discountType: 'percentage', value: 15, limit: 100, used: 42, status: 'active', expiryDate: '2024-12-31' },
    { id: '2', code: 'VERAO2024', discountType: 'fixed', value: 20, limit: 50, used: 50, status: 'expired', expiryDate: '2024-08-01' },
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    limit: 0,
    expiryDate: ''
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value || !newCoupon.limit) return alert('Preencha os campos obrigatórios.');
    
    const created: Coupon = {
      id: Math.random().toString(),
      code: newCoupon.code.toUpperCase(),
      discountType: newCoupon.type as any,
      value: newCoupon.value,
      limit: newCoupon.limit,
      used: 0,
      status: 'active',
      expiryDate: newCoupon.expiryDate
    };
    setCoupons([created, ...coupons]);
    setIsCreateModalOpen(false);
    setNewCoupon({ code: '', type: 'percentage', value: 0, limit: 0, expiryDate: '' });
  };

  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1";
  const inputClasses = "w-full px-5 py-4 rounded-2xl border border-gray-200 bg-slate-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-bold";

  return (
    <div className="p-4 lg:p-8 text-left animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cupons de Desconto</h1>
            <p className="text-gray-500 text-sm mt-1">Crie códigos promocionais para impulsionar suas vendas.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-indigo-100">
            <i className="fa-solid fa-plus mr-2"></i> Criar Novo Cupom
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cupons Ativos</p>
             <h4 className="text-3xl font-black text-gray-900">{coupons.filter(c => c.status === 'active').length}</h4>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total de Usos</p>
             <h4 className="text-3xl font-black text-indigo-600">{coupons.reduce((acc, c) => acc + c.used, 0)}</h4>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Economia Gerada</p>
             <h4 className="text-3xl font-black text-emerald-600">R$ 2.840,00</h4>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Código & Validade</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Desconto</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Uso / Limite</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5">
                       <span className="font-mono font-black text-indigo-600 text-base tracking-tighter">{coupon.code}</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                         <i className="fa-regular fa-calendar-clock"></i>
                         {coupon.expiryDate ? `Expira em ${new Date(coupon.expiryDate).toLocaleDateString('pt-BR')}` : 'Sem Expiração'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-black text-gray-900 text-lg">
                      {coupon.discountType === 'percentage' ? `${coupon.value}%` : `R$ ${coupon.value.toFixed(2)}`}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{coupon.discountType === 'percentage' ? 'OFF no total' : 'Valor Fixo'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 w-40">
                       <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                          <span>{coupon.used} / {coupon.limit}</span>
                          <span>{Math.round((coupon.used / coupon.limit) * 100)}%</span>
                       </div>
                       <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50 shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${coupon.used >= coupon.limit ? 'bg-red-400' : 'bg-indigo-600'}`} 
                            style={{ width: `${(coupon.used / coupon.limit) * 100}%` }}
                          ></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge variant={coupon.status === 'active' ? 'success' : 'gray'}>
                      {coupon.status === 'active' ? 'ATIVO' : 'EXPIRADO'}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center border border-transparent hover:border-rose-100">
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Novo Cupom de Desconto"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} className="shadow-lg shadow-indigo-100">Ativar Código</Button>
          </>
        }
      >
        <form className="space-y-6 text-left p-1" onSubmit={handleCreate}>
          <div>
            <label className={labelClasses}>Código do Cupom</label>
            <input 
              type="text" 
              placeholder="EX: PROMOVERAO20" 
              className={`${inputClasses} uppercase font-mono`}
              value={newCoupon.code}
              onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
            />
            <p className="mt-2 text-[10px] text-gray-400 font-medium italic ml-1">Dica: Use códigos curtos e fáceis de memorizar.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className={labelClasses}>Tipo de Desconto</label>
                <select 
                  className={`${inputClasses} appearance-none`}
                  value={newCoupon.type}
                  onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                >
                  <option value="percentage">Porcentagem (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
             </div>
             <div>
                <label className={labelClasses}>Valor do Desconto</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className={inputClasses}
                    value={newCoupon.value}
                    onChange={e => setNewCoupon({...newCoupon, value: Number(e.target.value)})}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-indigo-400/50 pointer-events-none">
                    {newCoupon.type === 'percentage' ? '%' : 'R$'}
                  </span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Limite de Usos</label>
              <input 
                type="number" 
                placeholder="Ex: 100" 
                className={inputClasses}
                value={newCoupon.limit}
                onChange={e => setNewCoupon({...newCoupon, limit: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className={labelClasses}>Data Limite (Validade)</label>
              <input 
                type="date" 
                className={inputClasses}
                value={newCoupon.expiryDate}
                onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-start gap-4">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
               <i className="fa-solid fa-circle-info"></i>
             </div>
             <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
               O cupom será aplicado automaticamente ao checkout do comprador assim que o código for validado. Você poderá desativá-lo a qualquer momento.
             </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};
