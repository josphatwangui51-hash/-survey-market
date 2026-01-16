
import React, { useState } from 'react';

interface RegisterPageProps {
  onRegister: (details: any) => void;
  onGoToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onGoToLogin }) => {
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' });
  const [consent, setConsent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegisterAttempt = () => {
    if (!consent) {
      alert("Please review and accept the Terms & Conditions and Privacy Policy to continue.");
      return;
    }
    if (!form.username || !form.password || !form.phone) {
      alert("Please fill in all required fields.");
      return;
    }
    onRegister(form);
  };

  return (
    <div className="glass-card p-8 rounded-2xl shadow-xl animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center italic tracking-tighter uppercase">Create Secure Account</h2>
      <div className="space-y-4">
        <input 
          name="username"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Choose Username"
          onChange={handleChange}
        />
        <input 
          name="email"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Email Address"
          onChange={handleChange}
        />
        <input 
          name="phone"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Phone Number (M-Pesa Only)"
          onChange={handleChange}
        />
        <input 
          name="password"
          type="password"
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Create Secure Password"
          onChange={handleChange}
        />
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 items-start">
          <input 
            type="checkbox" 
            id="consent"
            className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <label htmlFor="consent" className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wide">
            I certify that I am 18+, provide accurate demographic data, and agree to the 
            <span className="text-blue-600 underline ml-1">Terms of Service</span> and 
            <span className="text-blue-600 underline ml-1">Privacy Protocol</span>.
          </label>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-[10px] text-amber-800 rounded-r-lg font-bold uppercase tracking-widest">
          Verification Fee: <strong>KES 49</strong> (Required for M-Pesa API integration)
        </div>

        <button 
          onClick={handleRegisterAttempt}
          className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
        >
          Verify & Pay KES 49
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-4 font-black uppercase tracking-widest">
          Registered member? <button onClick={onGoToLogin} className="text-blue-600 font-black hover:underline">Access Dashboard</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
