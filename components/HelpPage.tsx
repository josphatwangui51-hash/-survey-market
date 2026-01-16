
import React from 'react';
import { Page } from '../types';

const FAQ = [
  { 
    q: "How do deductions work for survey rewards?", 
    a: "The platform applies a 20% company service fee on all gross rewards. For example, if a survey pays a gross of KES 50, your account will be credited with KES 40 (Net). This fee funds platform maintenance and AI data cleaning." 
  },
  { 
    q: "Are there fees for withdrawing?", 
    a: "Yes, a 15% administrative deduction is applied upon withdrawal to cover transaction processing and manual audit costs. If you withdraw KES 2,000, the net amount sent to your M-Pesa will be KES 1,700." 
  },
  { 
    q: "How do I verify my account?", 
    a: "Verification requires a one-time fee of KES 49 paid via M-Pesa. This links your demographic profile to a verified mobile identity, securing your payout channel." 
  },
  { 
    q: "When can I withdraw my earnings?", 
    a: "Withdrawals are available once your verified net balance reaches KES 2,000. Requests are typically processed via M-Pesa within 2-24 hours after an integrity audit." 
  },
  { 
    q: "What is the 'AI Intelligence Hub'?", 
    a: "It is our advanced support system powered by Gemini 3 Pro. It handles complex queries regarding account errors, payment issues, and market data queries." 
  }
];

interface HelpPageProps {
  onNavigate?: (page: Page) => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300 pb-12">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-black text-slate-900 italic uppercase">Support Knowledge Base</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Platform FAQ & Technical Documentation</p>
      </div>
      
      <div className="space-y-3">
        {FAQ.map((item, i) => (
          <details key={i} className="glass-card rounded-2xl border border-slate-100 overflow-hidden group transition-all duration-300">
            <summary className="p-5 font-bold text-slate-700 cursor-pointer list-none flex justify-between items-center bg-white group-open:bg-blue-50 transition-colors">
              <span className="text-sm italic tracking-tight uppercase">{item.q}</span>
              <span className="text-blue-500 font-normal group-open:rotate-180 transition-transform text-xs">▼</span>
            </summary>
            <div className="p-5 text-xs text-slate-500 bg-white border-t border-slate-50 leading-relaxed font-medium">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-600/20 transition-all"></div>
        <div className="relative z-10">
          <h3 className="font-black italic uppercase text-blue-400 mb-2 tracking-tighter text-xl">AI Intelligence Hub</h3>
          <p className="text-xs text-slate-400 mb-6 font-medium leading-relaxed max-w-sm">Our neural-linked support agent provides real-time resolution for complex account and payout inquiries.</p>
          <button 
            onClick={() => onNavigate && onNavigate(Page.AI_SUPPORT)}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🤖</span> Initialize Deep Support Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
