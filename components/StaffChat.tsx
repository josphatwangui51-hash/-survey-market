
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { StaffMessage } from '../App';

interface StaffChatProps {
  currentUser: User | null;
  messages: StaffMessage[];
  setMessages: React.Dispatch<React.SetStateAction<StaffMessage[]>>;
}

const StaffChat: React.FC<StaffChatProps> = ({ currentUser, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !currentUser) return;
    const newMessage: StaffMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUser.username,
      role: currentUser.role,
      text: input.trim(),
      timestamp: new Date()
    };
    // Optimistic UI update
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      case 'senior_admin': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'finance_admin': return 'text-green-400 border-green-400/30 bg-green-400/10';
      default: return 'text-slate-400 border-slate-400/30 bg-slate-400/10';
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-white font-black italic uppercase tracking-tighter text-lg">Staff Liaison Hub</h3>
          <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.3em]">Neural Link [PERSISTENT-NODE-01]</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">Low Latency Sync</span>
          </div>
          <span className="text-[7px] text-slate-600 font-mono mt-1">SECURE_TUNNEL_ESTABLISHED</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed opacity-95">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === currentUser?.username ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className="flex items-center gap-2 mb-1 px-2">
              <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${getRoleColor(m.role)}`}>
                {m.role.replace('_', ' ')}
              </span>
              <span className="text-[9px] text-slate-500 font-mono italic">@{m.sender}</span>
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-lg ${
              m.sender === currentUser?.username 
                ? 'bg-blue-600 text-white rounded-tr-none border border-blue-500' 
                : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800'
            }`}>
              {m.text}
              <div className={`text-[8px] mt-2 opacity-40 font-mono ${m.sender === currentUser?.username ? 'text-right' : 'text-left'}`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-900/30 border-t border-slate-800">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-xs outline-none focus:border-blue-500 transition-all font-medium placeholder-slate-600"
            placeholder="Type administrative dispatch..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 text-white px-8 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-blue-900/20"
          >
            Dispatch
          </button>
        </div>
        <p className="text-center text-[8px] text-slate-700 font-black uppercase tracking-[0.4em] mt-4 italic">Internal Communication Only • GSM Global Core</p>
      </div>
    </div>
  );
};

export default StaffChat;
