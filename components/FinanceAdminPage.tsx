
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { REGISTRATION_FEE_KES } from '../constants';
import StaffChat from './StaffChat';
import { StaffMessage, StaffDirective } from '../App';

interface FinanceAdminPageProps {
  allUsers: User[];
  onLogout: () => void;
  currentUser: User | null;
  staffMessages: StaffMessage[];
  setStaffMessages: React.Dispatch<React.SetStateAction<StaffMessage[]>>;
  directives: StaffDirective[];
}

const FinanceAdminPage: React.FC<FinanceAdminPageProps> = ({ 
  allUsers, 
  onLogout, 
  currentUser, 
  staffMessages, 
  setStaffMessages, 
  directives 
}) => {
  const [advice, setAdvice] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'chat'>('analytics');
  
  const metrics = useMemo(() => {
    const regularUsers = allUsers.filter(u => u.role === 'user');
    const totalLiabilities = regularUsers.reduce((sum, u) => sum + u.balance, 0);
    const totalRevenue = regularUsers.length * REGISTRATION_FEE_KES;
    const premiumRevenue = regularUsers.filter(u => u.isPremium).length * 100;
    
    return {
      totalRevenue: totalRevenue + premiumRevenue,
      totalLiabilities,
      profit: (totalRevenue + premiumRevenue) - totalLiabilities,
      userCount: regularUsers.length,
      premiumRate: Math.round((regularUsers.filter(u => u.isPremium).length / regularUsers.length) * 100) || 0
    };
  }, [allUsers]);

  const myDirectives = directives.filter(d => d.targetRole === 'finance_admin');

  const handleTransmitFinanceAdvice = () => {
    if (!advice.trim() || !currentUser) return;
    const newMessage: StaffMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUser.username,
      role: currentUser.role,
      text: `📊 [FISCAL BRIEFING]: ${advice.trim()}`,
      timestamp: new Date()
    };
    setStaffMessages(prev => [...prev, newMessage]);
    setAdvice('');
    alert("Fiscal intelligence transmitted to Master Ledger and Liaison Hub.");
    setActiveTab('chat');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none mb-1">Fiscal Intelligence</h2>
          <p className="text-xs font-bold text-green-600 uppercase tracking-widest italic tracking-tighter">Auditor: {currentUser?.username}</p>
        </div>
        <button onClick={onLogout} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-slate-800 transition-all">LOGOUT</button>
      </div>

      {myDirectives.length > 0 && (
        <div className="bg-red-950 border-4 border-red-500 p-8 rounded-[3rem] animate-pulse shadow-2xl">
          <h3 className="text-red-400 font-black text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
             <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span> 
             Incoming Master Directives
          </h3>
          <div className="space-y-4">
            {myDirectives.map(d => (
              <div key={d.id} className="bg-slate-900 p-6 rounded-3xl border border-red-500/30">
                <p className="text-lg font-black text-white italic leading-snug">"{d.instruction}"</p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest italic">Source: Master Hub</p>
                  <button onClick={() => alert("Task logged in working memory.")} className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Acknowledge</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('analytics')} className={`pb-4 px-2 font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'analytics' ? 'text-green-600' : 'text-slate-400'}`}>
          Analytics Hub
          {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 w-full h-1 bg-green-600 rounded-full" />}
        </button>
        <button onClick={() => setActiveTab('chat')} className={`pb-4 px-2 font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-400'}`}>
          Staff Liaison Chat
          {activeTab === 'chat' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />}
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl border border-slate-800">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 italic">Gross Inflow</p>
              <p className="text-3xl font-black italic tracking-tighter">KES {metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 italic">Liability</p>
              <p className="text-3xl font-black text-red-500 italic tracking-tighter">KES {metrics.totalLiabilities.toLocaleString()}</p>
            </div>
            <div className={`p-8 rounded-[2.5rem] border-2 shadow-sm ${metrics.profit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 italic">Net Delta</p>
              <p className="text-3xl font-black italic tracking-tighter">KES {metrics.profit.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-amber-50 p-10 rounded-[3rem] border-2 border-amber-200 shadow-lg">
            <h3 className="text-xl font-black text-slate-900 italic uppercase mb-2 tracking-tight">Executive Fiscal Relay</h3>
            <p className="text-[10px] text-amber-800 font-bold uppercase tracking-widest mb-6 italic">Submit high-level analysis to the Master Governance Hub</p>
            <textarea 
              className="w-full p-6 bg-white border border-amber-200 rounded-3xl text-sm min-h-[150px] outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-medium" 
              placeholder="Report fiscal trends, revenue gaps, or optimization strategies..." 
              value={advice} 
              onChange={(e) => setAdvice(e.target.value)} 
            />
            <button 
              onClick={handleTransmitFinanceAdvice} 
              disabled={!advice.trim()}
              className="mt-6 w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
            >
              Transmit Intelligence Packet
            </button>
          </div>
        </>
      ) : (
        <StaffChat currentUser={currentUser} messages={staffMessages} setMessages={setStaffMessages} />
      )}
    </div>
  );
};

export default FinanceAdminPage;
