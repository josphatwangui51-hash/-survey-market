
import React, { useState } from 'react';
import { User, Page } from '../types';

interface ProfilePageProps { 
  user: User | null; 
  onNavigate: (page: Page) => void;
  addNotification: (msg: string, type: 'info' | 'success') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate, addNotification }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  if (!user) return null;

  const handleRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addNotification("Neural identity synchronized with GSM Global Network.", "success");
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-2xl mx-auto pb-12">
      <div className="flex items-end justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Member Identity</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Verified Market Research Credential</p>
        </div>
        <div className={`w-14 h-14 rounded-[1.5rem] shadow-xl ${user.isPremium ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-blue-600 text-white border-blue-500'} flex items-center justify-center text-2xl font-black border-2 transform rotate-3`}>
          {user.username[0].toUpperCase()}
        </div>
      </div>
      
      <div className="glass-card rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-50/50 p-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 backdrop-blur-md">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Account Holder</label>
            <p className="text-2xl font-black text-slate-900 italic tracking-tight">{user.username}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Registered Contact</label>
            <p className="text-2xl font-black text-slate-900 italic tracking-tight">{user.phone}</p>
          </div>
        </div>
        
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Credential Email</p>
              <p className="font-bold text-slate-800 text-lg">{user.email}</p>
            </div>
            <span className="text-[10px] font-black bg-blue-600 text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">Verified</span>
          </div>

          <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Membership Tier</p>
              <p className={`text-xl font-black uppercase tracking-tighter italic ${user.isPremium ? 'text-amber-500' : 'text-slate-600'}`}>
                {user.isPremium ? `${user.premiumTier?.toUpperCase()} PREMIUM` : 'Market Standard'}
              </p>
            </div>
            {user.isPremium ? (
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-xl shadow-amber-200 animate-bounce-slow">⭐</div>
            ) : (
              <button 
                onClick={() => onNavigate(Page.SURVEYS)}
                className="group relative px-6 py-3 bg-slate-900 text-white rounded-2xl overflow-hidden transition-all active:scale-95 shadow-xl"
              >
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em]">Upgrade Tier</span>
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity Audit Trail</p>
              <p className="font-black text-green-600 italic flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                ACTIVE SECURITY CLEARANCE
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">M-Pesa Verification Hash</p>
              <p className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{user.activationCode || 'SYSTEM_MASTER'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={handleRefresh}
          disabled={isSyncing}
          className="relative overflow-hidden bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] transition-all hover:shadow-2xl hover:border-blue-200 active:scale-95 group flex flex-col items-center gap-4"
        >
          <div className={`text-4xl transition-transform duration-500 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180'}`}>
            {isSyncing ? '🔄' : '🔑'}
          </div>
          <div className="text-center">
            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-1">Neural Sync</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase italic">Refresh Security Tokens</p>
          </div>
          {isSyncing && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 animate-shimmer"></div>
          )}
        </button>

        <button 
          onClick={() => onNavigate(Page.WITHDRAW)}
          className="bg-slate-950 border-2 border-slate-800 p-8 rounded-[2.5rem] transition-all hover:shadow-2xl hover:border-green-500/50 active:scale-95 group flex flex-col items-center gap-4"
        >
          <div className="text-4xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            🏦
          </div>
          <div className="text-center">
            <h4 className="font-black text-white uppercase tracking-widest text-xs mb-1">Liquidity routing</h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase italic">Payout Channel Management</p>
          </div>
          <div className="absolute top-4 right-6">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
        </button>
      </div>
      
      <div className="text-center pt-4">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.5em] italic">
          GSM Identity Node ID: <span className="text-slate-900">#{user.id.slice(0, 8).toUpperCase()}</span>
        </p>
        <div className="flex justify-center gap-1 mt-3 opacity-30">
          {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 bg-slate-900 rounded-full"></div>)}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
