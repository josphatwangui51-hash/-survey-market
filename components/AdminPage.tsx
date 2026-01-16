
import React, { useState } from 'react';
import { User, WithdrawalRequest, AdminPermission } from '../types';
import StaffChat from './StaffChat';
import { StaffMessage, StaffDirective } from '../App';

interface AdminPageProps {
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  withdrawals: WithdrawalRequest[];
  setWithdrawals: React.Dispatch<React.SetStateAction<WithdrawalRequest[]>>;
  onLogout: () => void;
  currentUser?: User | null;
  staffMessages: StaffMessage[];
  setStaffMessages: React.Dispatch<React.SetStateAction<StaffMessage[]>>;
  directives: StaffDirective[];
}

const AdminPage: React.FC<AdminPageProps> = ({ allUsers, setAllUsers, withdrawals, setWithdrawals, onLogout, currentUser, staffMessages, setStaffMessages, directives }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'staff' | 'advice' | 'chat'>('users');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [advice, setAdvice] = useState('');

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const myDirectives = directives.filter(d => d.targetRole === currentUser?.role);
  const canManageStaff = currentUser?.role === 'super_admin' || currentUser?.role === 'senior_admin' || currentUser?.permissions?.includes('canManageStaff');

  const handleTransmitAdvice = () => {
    if (!advice.trim() || !currentUser) return;
    const newMessage: StaffMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUser.username,
      role: currentUser.role,
      text: `⚠️ [STRATEGIC ADVICE]: ${advice.trim()}`,
      timestamp: new Date()
    };
    setStaffMessages(prev => [...prev, newMessage]);
    setAdvice('');
    alert("Briefing transmitted to Master Governance.");
    setActiveTab('chat');
  };

  const toggleBlock = (id: string) => {
    const userToToggle = allUsers.find(u => u.id === id);
    if (!userToToggle) return;
    if (userToToggle.role === 'super_admin') {
      alert("SECURITY VIOLATION: Super Admin protocols are immutable.");
      return;
    }
    const newBlockState = !userToToggle.isBlocked;
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: newBlockState } : u));
  };

  const handleApproveWithdrawal = (id: string, amount: number, username: string) => {
    if (window.confirm(`Authorize payout to ${username}?`)) {
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'approved' } : w));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Operations Hub</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Auth: {currentUser?.role?.replace('_', ' ').toUpperCase()}</p>
        </div>
        <button onClick={onLogout} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-slate-800 transition-all shadow-lg">LOGOUT</button>
      </div>

      {myDirectives.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-[2.5rem] animate-pulse shadow-lg">
          <h3 className="text-red-600 font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span> Incoming Master Directives
          </h3>
          <div className="space-y-3">
            {myDirectives.map(d => (
              <div key={d.id} className="bg-white/80 p-4 rounded-2xl border border-red-100">
                <p className="text-sm font-black text-slate-900 italic leading-relaxed">"{d.instruction}"</p>
                <p className="text-[8px] text-slate-400 mt-2 uppercase font-bold italic tracking-tighter">Source: {d.issuer} &bull; {new Date(d.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('users')} className={`pb-4 px-2 font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'users' ? 'text-blue-600' : 'text-slate-400'}`}> Registry </button>
        <button onClick={() => setActiveTab('withdrawals')} className={`pb-4 px-2 font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'withdrawals' ? 'text-blue-600' : 'text-slate-400'}`}> Payouts </button>
        {canManageStaff && <button onClick={() => setActiveTab('staff')} className={`pb-4 px-2 font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'staff' ? 'text-blue-600' : 'text-slate-400'}`}> Staff </button>}
        <button onClick={() => setActiveTab('chat')} className={`pb-4 px-2 font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-400'}`}> Liaison Chat </button>
        <button onClick={() => setActiveTab('advice')} className={`pb-4 px-2 font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'advice' ? 'text-amber-600' : 'text-slate-400'}`}> Advise Master </button>
      </div>

      {activeTab === 'chat' ? (
        <StaffChat currentUser={currentUser || null} messages={staffMessages} setMessages={setStaffMessages} />
      ) : activeTab === 'users' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-black uppercase text-slate-400">User Identity</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Balance (KES)</th>
                <th className="p-4 text-right text-[10px] font-black uppercase text-slate-400">Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.filter(u => u.role === 'user').map(u => (
                <tr key={u.id}>
                  <td className="p-4">
                    <p className="font-black text-slate-900 italic">{u.username}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{u.phone}</p>
                  </td>
                  <td className="p-4 font-mono font-black text-blue-600 italic">KES {u.balance.toLocaleString()}</td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <button onClick={() => setEditingUser(u)} className="text-[10px] font-black text-blue-600 uppercase">Edit</button>
                    <button onClick={() => toggleBlock(u.id)} className={`text-[10px] font-black uppercase ${u.isBlocked ? 'text-green-600' : 'text-red-500'}`}>{u.isBlocked ? 'Restore' : 'Block'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'withdrawals' ? (
        <div className="space-y-4">
          {pendingWithdrawals.map(w => (
            <div key={w.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex justify-between items-center">
              <div><p className="font-black text-slate-900 italic text-xl">KES {w.amount.toLocaleString()}</p><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{w.username}</p></div>
              <button onClick={() => handleApproveWithdrawal(w.id, w.amount, w.username)} className="bg-green-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Approve</button>
            </div>
          ))}
        </div>
      ) : activeTab === 'staff' ? (
        <div className="space-y-4">
          {allUsers.filter(u => ['admin', 'senior_admin', 'finance_admin'].includes(u.role)).map(admin => (
            <div key={admin.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex justify-between items-center">
              <div><h4 className="font-black text-slate-800 italic">{admin.username}</h4><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{admin.role}</p></div>
              <button onClick={() => setEditingAdmin(admin)} className="bg-slate-50 text-slate-900 px-4 py-2 rounded-lg text-[10px] font-black uppercase">Perms</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-amber-50 p-8 rounded-[2.5rem] border-2 border-amber-200">
           <h3 className="text-lg font-black text-slate-900 italic uppercase mb-2 tracking-tight">Master Intelligence Relay</h3>
           <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest mb-4 italic">Direct neural link to Super Admin Hub</p>
           <textarea 
             className="w-full p-6 bg-white border border-amber-200 rounded-3xl text-sm min-h-[150px] outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner font-medium" 
             value={advice} 
             onChange={(e) => setAdvice(e.target.value)} 
             placeholder="Submit anomalies, fiscal trends, or personnel reports..." 
           />
           <button 
             onClick={handleTransmitAdvice} 
             disabled={!advice.trim()}
             className="mt-4 w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50"
           >
             Transmit Dispatch to Master
           </button>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10">
              <h3 className="text-center font-black text-slate-900 uppercase italic mb-6">Modify Entity Node</h3>
              <div className="space-y-4 mb-8">
                <input className="w-full p-4 bg-slate-50 border rounded-2xl font-bold italic" placeholder="Username" value={editingUser.username} onChange={e => setEditingUser({...editingUser, username: e.target.value})} />
                <input className="w-full p-4 bg-slate-50 border rounded-2xl font-bold italic" placeholder="Phone" value={editingUser.phone} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} />
                <div className="bg-slate-900 p-6 rounded-3xl text-center">
                  <p className="text-[9px] text-blue-400 font-black uppercase mb-1">Asset Override (KES)</p>
                  <input type="number" className="bg-transparent text-white text-3xl font-black text-center w-full outline-none italic" value={editingUser.balance} onChange={e => setEditingUser({...editingUser, balance: parseInt(e.target.value)||0})} />
                </div>
              </div>
              <button onClick={() => {setAllUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u)); setEditingUser(null);}} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs">Commit Protocol</button>
              <button onClick={() => setEditingUser(null)} className="w-full text-slate-400 text-[10px] font-black uppercase mt-2">Abort</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
