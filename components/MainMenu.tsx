
import React from 'react';
import { Page, User } from '../types';

interface MainMenuProps {
  user: User | null;
  onNavigate: (page: Page) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ user, onNavigate }) => {
  if (!user) return null;

  const menuItems = [
    { id: Page.DASHBOARD, label: 'Asset Dash', desc: 'Financial records & tasks', icon: '💰', color: 'bg-green-50 text-green-600' },
    { id: Page.AI_SUPPORT, label: 'AI Intelligence', desc: 'Deep support agent', icon: '🤖', color: 'bg-slate-950 text-blue-400' },
    { id: Page.PROFILE, label: 'Identity', desc: 'User profile & status', icon: '👤', color: 'bg-blue-50 text-blue-600' },
    { id: Page.SETTINGS, label: 'Configuration', desc: 'App & Privacy settings', icon: '⚙️', color: 'bg-slate-100 text-slate-600' },
    { id: Page.HELP, label: 'Knowledge Base', desc: 'FAQ & platform guide', icon: '❓', color: 'bg-amber-50 text-amber-600' },
    { id: Page.RULES, label: 'Governance', desc: 'Rules & regulations', icon: '📜', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center border-b border-slate-100 pb-6">
        <h2 className="text-3xl font-black text-slate-900 mb-1 italic tracking-tighter uppercase">Authorized: {user.username}</h2>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Secure Market Interface Activated</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="group glass-card p-6 rounded-[2rem] text-left hover:shadow-2xl hover:border-blue-200 transition-all active:scale-95 flex items-center gap-5 border border-slate-100 shadow-sm"
          >
            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg tracking-tight italic uppercase">{item.label}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl border border-slate-800">
        <div>
          <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.3em] mb-1">Account Liquidity</p>
          <p className="text-3xl font-black italic text-blue-400">KES {user.balance.toLocaleString()}</p>
        </div>
        <button 
          onClick={() => onNavigate(Page.SURVEYS)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-xl uppercase tracking-widest active:scale-95"
        >
          Begin Research
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
