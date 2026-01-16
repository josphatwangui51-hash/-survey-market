
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User, Page } from '../types';
import { ADMIN_PHONE } from '../constants';

interface AiSupportPageProps {
  user: User | null;
  onNavigate: (page: Page) => void;
}

const AiSupportPage: React.FC<AiSupportPageProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `Greetings ${user?.username || 'User'}. I am the GSM Intelligence Hub. How can I assist you with your surveys or withdrawals today?` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Hello Admin, I am ${user?.username}. I need human assistance with my GSM account. My balance is KES ${user?.balance}.`);
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${message}`, '_blank');
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsThinking(true);

    // Check for escalation intent
    const escalationKeywords = ['admin', 'human', 'whatsapp', 'person', 'real', 'talk to', 'speak to'];
    const needsHuman = escalationKeywords.some(key => userMessage.toLowerCase().includes(key));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: userMessage,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: `You are the Global Survey Market (GSM) AI Support Agent. 
          Context: 
          - Registration fee: KES 49.
          - Premium upgrade: KES 49.
          - Admin phone for payments: ${ADMIN_PHONE}.
          - Minimum withdrawal: KES 2000.
          - Daily survey limit: 3 for standard users.
          - If the user asks for a human, admin, or WhatsApp, acknowledge it and tell them to use the "ESCALATE" button in the header.
          Current User: ${user?.username}, Balance: KES ${user?.balance}, Premium: ${user?.isPremium}.`
        },
      });

      const aiText = response.text || "I apologize, my neural link was interrupted. Please rephrase your inquiry or connect to a human admin.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      
      if (needsHuman) {
        setShowEscalation(true);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "System Error: Connection to Intelligence Core failed. Please use the direct Admin WhatsApp line for urgent assistance." }]);
      setShowEscalation(true);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl animate-pulse">🤖</div>
          <div>
            <h2 className="text-white font-black italic uppercase tracking-tighter">AI Intelligence Hub</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Active Thinking Mode: Enabled</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={openWhatsApp}
            className="bg-green-600/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
          >
            <span className="text-sm">💬</span> Admin WhatsApp
          </button>
          <button onClick={() => onNavigate(Page.MENU)} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-blue-400 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Analyzing System Protocols...</span>
            </div>
          </div>
        )}
        {showEscalation && (
          <div className="flex justify-start animate-in zoom-in duration-300">
            <div className="bg-green-950/30 border border-green-500/30 p-5 rounded-2xl text-center space-y-3 max-w-[90%]">
              <p className="text-xs text-green-400 font-bold uppercase tracking-wide">Human Assistance Required?</p>
              <p className="text-[11px] text-slate-400">If my intelligence core cannot resolve your specific issue, you can chat directly with our human admin team on WhatsApp.</p>
              <button 
                onClick={openWhatsApp}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span> Connect to Admin WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-slate-800/30 border-t border-slate-700">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            placeholder="Type complex support query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isThinking || !input.trim()}
            className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
          >
            Send
          </button>
        </div>
        <p className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-4 italic opacity-50">Deep Reasoning provided by Gemini 3 Pro &bull; Human Escalation Available</p>
      </div>
    </div>
  );
};

export default AiSupportPage;
