
import React, { useState, useMemo } from 'react';
import { User, WithdrawalRequest, UserRole, AdminPermission } from '../types';
import { REGISTRATION_FEE_KES } from '../constants';
import StaffChat from './StaffChat';
import { StaffMessage, StaffDirective } from '../App';

interface SuperAdminPageProps {
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  withdrawals: WithdrawalRequest[];
  setWithdrawals: React.Dispatch<React.SetStateAction<WithdrawalRequest[]>>;
  onLogout: () => void;
  staffMessages: StaffMessage[];
  setStaffMessages: React.Dispatch<React.SetStateAction<StaffMessage[]>>;
  directives: StaffDirective[];
  setDirectives: React.Dispatch<React.SetStateAction<StaffDirective[]>>;
}

const SuperAdminPage: React.FC<SuperAdminPageProps> = ({ allUsers, setAllUsers, withdrawals, setWithdrawals, onLogout, staffMessages, setStaffMessages, directives, setDirectives }) => {
  const [view, setView] = useState<'users' | 'financials' | 'admins' | 'withdrawals' | 'directives' | 'chat'>('financials');
  const [editingEntity, setEditingEntity] = useState<User | null>(null);
  const [newDirective, setNewDirective] = useState({ target: 'admin', text: '' });
  
  const currentSuperAdmin = allUsers.find(u => u.role === 'super_admin');

  const metrics = useMemo(() => {
    const regularUsers = allUsers.filter(u => u.role === 'user');
    const totalUserBalance = regularUsers.reduce((sum, u) => sum + u.balance, 0);
    const totalRegFees = regularUsers.length * REGISTRATION_FEE_KES;
    const premiumUsers = regularUsers.filter(u => u.isPremium);
    const premiumRevenue = premiumUsers.length * 500;
    
    return {
      totalUserBalance,
      totalRegFees,
      premiumRevenue,
      totalRevenue: totalRegFees + premiumRevenue,
      netCapital: (totalRegFees + premiumRevenue) - totalUserBalance,
      userCount: regularUsers.length,
      premiumRatio: Math.round((premiumUsers.length / regularUsers.length) * 100) || 0
    };
  }, [allUsers]);

  const handleEntityUpdate = (updatedEntity: User) => {
    setAllUsers(prev => prev.map(u => u.id === updatedEntity.id ? updatedEntity : u));
    setEditingEntity(null);
    alert(`Identity Overwrite Successful: Global Core Updated for ${updatedEntity.username}.`);
  };

  const issueDirective = () => {
    if (!newDirective.text.trim()) return;
    const d: StaffDirective = {
      id: Math.random().toString(36).substr(2, 9),
      targetRole: newDirective.target,
      instruction: newDirective.text.trim(),
      issuer: currentSuperAdmin?.username || 'Super Admin',
      timestamp: new Date(),
      status: 'active'
    };
    setDirectives(prev => [d, ...prev]);
    // Also post to chat for visibility
    const msg: StaffMessage = {
      id: d.id + '-msg',
      sender: currentSuperAdmin?.username || 'Super Admin',
      role: 'super_admin',
      text: `📢 [COMMAND DIRECTIVE to ${newDirective.target.replace('_', ' ').toUpperCase()}]: ${newDirective.text}`,
      timestamp: new Date()
    };
    setStaffMessages(prev => [...prev, msg]);
    setNewDirective({ ...newDirective, text: '' });
    alert("Administrative Directive issued and synced.");
  };

  const togglePermission = (adminId: string, permission: AdminPermission) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === adminId) {
        const currentPerms = u.permissions || [];
        const newPerms = currentPerms.includes(permission)
          ? currentPerms.filter(p => p !== permission)
          : [...currentPerms, permission];
        return { ...u, permissions: newPerms };
      }
      return u;
    }));
  };

  const promoteToRole = (id: string, role: UserRole) => {
    if (role === 'super_admin' && currentSuperAdmin) {
      alert("CRITICAL ERROR: Master clearance is unique. Protocol denied.");
      return;
    }
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, role, permissions: role === 'user' ? [] : u.permissions } : u));
    alert(`Clearance escalated: Identity promoted to ${role.replace('_', ' ').toUpperCase()}.`);
  };

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'approved' } : w));
  };

  const permissionsList: { id: AdminPermission; label: string }[] = [
    { id: 'canApproveWithdrawals', label: 'Payout Auth' },
    { id: 'canEditFunds', label: 'Fund Override' },
    { id: 'canBlockUsers', label: 'Suspension Control' },
    { id: 'canManageStaff', label: 'Staff Management' },
    { id: 'canViewAnalytics', label: 'Data Access' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="bg-slate-950 p-8 rounded-[3rem] shadow-2xl text-white border-t-8 border-amber-500">
        <div className="flex justify-between items-center">
          <div><h2 className="text-4xl font-black tracking-tighter italic text-amber-400 uppercase">Master Governance</h2><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Command Hub • Active</p></div>
          <button onClick={onLogout} className="bg-amber-500 text-slate-950 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Terminate</button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'financials', label: 'Fiscal Audit', icon: '💰' },
          { id: 'directives', label: 'Staff Command', icon: '🎯' },
          { id: 'admins', label: 'Staff registry', icon: '🛡️' },
          { id: 'users', label: 'User Registry', icon: '👥' },
          { id: 'withdrawals', label: 'Payouts', icon: '🏦' },
          { id: 'chat', label: 'Liaison Chat', icon: '💬' }
        ].map(item => (
          <button key={item.id} onClick={() => setView(item.id as any)} className={`px-6 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest border-2 transition-all ${view === item.id ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-xl' : 'bg-white text-slate-400 border-slate-50'}`}>
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-xl overflow-hidden min-h-[600px]">
        {view === 'financials' && (
           <div className="p-10 animate-in fade-in duration-300">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase mb-10 border-l-8 border-blue-600 pl-4">Macro Financial Audit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Revenue</p>
                <p className="text-3xl font-black italic">KES {metrics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Liabilities</p>
                <p className="text-3xl font-black text-slate-900 italic">KES {metrics.totalUserBalance.toLocaleString()}</p>
              </div>
              <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white">
                <p className="text-[10px] font-black text-blue-200 uppercase mb-2">Net Capital</p>
                <p className="text-3xl font-black italic">KES {metrics.netCapital.toLocaleString()}</p>
              </div>
            </div>
           </div>
        )}

        {view === 'directives' && (
          <div className="p-10 space-y-8 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase border-l-8 border-red-500 pl-4 mb-4">Dictate Staff Operations</h3>
            <div className="bg-slate-950 p-8 rounded-[3rem] border border-slate-800 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block ml-4 tracking-widest">Target Administrative Role</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white text-[10px] font-black uppercase outline-none focus:border-red-500"
                    value={newDirective.target}
                    onChange={(e) => setNewDirective({...newDirective, target: e.target.value})}
                  >
                    <option value="admin">Standard Admin</option>
                    <option value="senior_admin">Senior Admin</option>
                    <option value="finance_admin">Finance Admin</option>
                  </select>
                </div>
                <div className="flex items-end">
                   <p className="text-[9px] text-slate-500 italic mb-1 px-4">Directives will be transmitted to the target dashboard and Liaison Chat instantly.</p>
                </div>
              </div>
              <textarea 
                className="w-full bg-slate-900 border border-slate-700 rounded-[2rem] p-6 text-white text-sm min-h-[120px] outline-none focus:border-red-500 transition-all shadow-inner"
                placeholder="Enter command directive (e.g., 'Verify the last 10 M-Pesa codes from user123')"
                value={newDirective.text}
                onChange={(e) => setNewDirective({...newDirective, text: e.target.value})}
              />
              <button 
                onClick={issueDirective}
                className="mt-6 w-full bg-red-600 text-white font-black py-5 rounded-[2rem] hover:bg-red-700 active:scale-95 transition-all shadow-xl shadow-red-900/20 uppercase tracking-[0.2em] text-xs"
              >
                Transmit Direct Command
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Active Directives Queue</h4>
              {directives.map(d => (
                <div key={d.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-tighter">TO: {d.targetRole.replace('_', ' ')}</span>
                      <span className="text-[8px] text-slate-400 font-mono italic">{new Date(d.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"{d.instruction}"</p>
                  </div>
                  <button onClick={() => setDirectives(prev => prev.filter(x => x.id !== d.id))} className="text-[9px] font-black text-red-500 uppercase tracking-widest px-4">Retract</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'admins' && (
          <div className="p-10 space-y-8 animate-in slide-in-from-left duration-300">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase border-l-8 border-amber-400 pl-4">Staff registry</h3>
            {allUsers.filter(u => u.role !== 'user' && u.role !== 'super_admin').map(admin => (
              <div key={admin.id} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black italic">{admin.username[0]}</div>
                    <div>
                      <h4 className="font-black text-slate-900 italic uppercase">{admin.username}</h4>
                      <p className="text-[9px] text-amber-600 font-bold uppercase tracking-widest">{admin.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingEntity(admin)} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all">Command Overwrite</button>
                    <button onClick={() => promoteToRole(admin.id, 'user')} className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Revoke Clearance</button>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Permission Delta</p>
                  <div className="flex flex-wrap gap-2">
                    {permissionsList.map(perm => (
                      <button
                        key={perm.id}
                        onClick={() => togglePermission(admin.id, perm.id)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${
                          admin.permissions?.includes(perm.id) 
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                            : 'bg-white text-slate-400 border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        {perm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'users' && (
           <div className="p-0 animate-in fade-in duration-300">
             <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-400">Identity Signature</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-400">Assets (KES)</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-400">Status</th>
                  <th className="p-8 text-right text-[10px] font-black uppercase text-slate-400">Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.filter(u => u.role === 'user').map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-8">
                      <div className="font-black text-slate-900 text-lg italic tracking-tighter">{u.username}</div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase italic tracking-tighter">PH: {u.phone} &bull; EM: {u.email}</p>
                    </td>
                    <td className="p-8 font-mono font-black text-blue-600 text-lg italic">KES {u.balance.toLocaleString()}</td>
                    <td className="p-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.isBlocked ? 'bg-red-100 text-red-600 shadow-sm' : 'bg-green-100 text-green-600'}`}>
                        {u.isBlocked ? 'Suspended' : 'Verified'}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={() => setEditingEntity(u)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase hover:bg-blue-600 transition-all shadow-lg active:scale-95">Identity Control</button>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
           </div>
        )}

        {view === 'withdrawals' && (
          <div className="p-10 space-y-4 animate-in zoom-in duration-300">
             <h3 className="text-2xl font-black text-slate-900 italic uppercase border-l-8 border-green-600 pl-4 mb-8">Payout Control</h3>
             {withdrawals.filter(w => w.status === 'pending').map(w => (
               <div key={w.id} className="bg-slate-50 p-8 rounded-[2.5rem] border-2 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{w.username}</p>
                    <p className="font-black text-slate-900 text-3xl italic tracking-tighter">KES {w.amount.toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleApproveWithdrawal(w.id)} className="bg-green-600 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition-all">Authorize Disbursement</button>
               </div>
             ))}
          </div>
        )}

        {view === 'chat' && (
          <div className="p-8 animate-in fade-in duration-300">
            <StaffChat currentUser={currentSuperAdmin || null} messages={staffMessages} setMessages={setStaffMessages} />
          </div>
        )}
      </div>

      {/* Expanded Entity Control Modal (The "Super" Identity Panel) */}
      {editingEntity && (
        <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center p-4 z-[200] backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-2xl p-12 relative overflow-y-auto max-h-[95vh] scrollbar-hide">
              <div className="absolute top-0 right-0 p-10">
                <button onClick={() => setEditingEntity(null)} className="text-slate-300 hover:text-slate-900 transition-all font-black text-3xl">×</button>
              </div>
              
              <div className="text-center mb-10">
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-6 py-2 rounded-full uppercase tracking-[0.4em] mb-4 inline-block italic">Neural Identity Override</span>
                <h3 className="font-black text-4xl text-slate-900 italic uppercase tracking-tighter leading-none mb-1">Entity: {editingEntity.username}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Permanent Node ID: {editingEntity.id}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block italic">Display Signature</label>
                  <input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-slate-900 italic outline-none focus:border-blue-500 transition-all" value={editingEntity.username} onChange={e => setEditingEntity({...editingEntity, username: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block italic">Neural Email</label>
                  <input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-slate-900 italic outline-none focus:border-blue-500 transition-all" value={editingEntity.email} onChange={e => setEditingEntity({...editingEntity, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block italic">Mobile Routing (M-Pesa)</label>
                  <input className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-slate-900 italic outline-none focus:border-blue-500 transition-all" value={editingEntity.phone} onChange={e => setEditingEntity({...editingEntity, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block italic">Activation Code</label>
                  <input className="w-full p-5 bg-slate-100 border border-slate-200 rounded-[2rem] font-mono text-slate-900 italic outline-none focus:border-blue-500 transition-all text-sm" value={editingEntity.activationCode || ''} onChange={e => setEditingEntity({...editingEntity, activationCode: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-center border-t-4 border-blue-500 shadow-2xl shadow-blue-900/10">
                  <label className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-2 block italic">Liquidity Balance</label>
                  <input type="number" className="bg-transparent text-white text-4xl font-black text-center w-full outline-none italic tracking-tighter" value={editingEntity.balance} onChange={e => setEditingEntity({...editingEntity, balance: parseInt(e.target.value)||0})} />
                  <p className="text-[8px] text-slate-500 mt-2 uppercase font-bold tracking-widest">Manual Asset Override</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] flex flex-col items-center justify-center border border-slate-100">
                  <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2 block italic">Access Clearance</label>
                  <p className="font-black text-slate-900 text-2xl italic uppercase pt-1 tracking-tighter">{editingEntity.role.replace('_', ' ')}</p>
                  <div className="flex gap-2 mt-4">
                    {['user', 'admin', 'senior_admin', 'finance_admin'].map(r => (
                      <button key={r} onClick={() => promoteToRole(editingEntity.id, r as UserRole)} className={`w-3 h-3 rounded-full border ${editingEntity.role === r ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`} title={r}></button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={() => handleEntityUpdate(editingEntity)} className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-900/20 uppercase tracking-[0.3em] text-sm">Force Identity Sync</button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setEditingEntity({...editingEntity, isBlocked: !editingEntity.isBlocked})}
                    className={`flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border-2 ${editingEntity.isBlocked ? 'bg-green-600 text-white border-green-500' : 'bg-white text-red-600 border-red-50 hover:bg-red-600 hover:text-white'}`}
                  >
                    {editingEntity.isBlocked ? 'Restore Node Access' : 'Suspend Identity Node'}
                  </button>
                  <button onClick={() => {
                    if(confirm("DANGER: This will permanently purge the entity from the Global Core. Proceed?")) {
                      setAllUsers(prev => prev.filter(u => u.id !== editingEntity.id));
                      setEditingEntity(null);
                    }
                  }} className="flex-1 text-slate-300 font-black text-[10px] uppercase tracking-widest py-2 border-2 border-slate-50 rounded-[2rem] hover:bg-slate-50 hover:text-slate-900 transition-all">Permanent Purge</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
