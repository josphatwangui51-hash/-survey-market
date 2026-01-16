
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password?: string) => void;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');

  const handleReset = () => {
    if (resetStep === 1) {
      if (!recoveryIdentifier) return alert("Enter your registered Phone or Email");
      setResetStep(2);
    } else {
      alert("Verification link sent to " + recoveryIdentifier + ". Please check your inbox/messages for reset instructions.");
      setIsResetting(false);
      setResetStep(1);
    }
  };

  if (isResetting) {
    return (
      <div className="glass-card p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-300 max-w-md mx-auto">
        <h2 className="text-xl font-black text-slate-900 mb-2 italic uppercase tracking-tighter text-center">Security Recovery</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 text-center">Identity Verification Protocol</p>
        
        <div className="space-y-4">
          {resetStep === 1 ? (
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block ml-1">Account Identifier</label>
              <input 
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                placeholder="Phone or Email"
                value={recoveryIdentifier}
                onChange={(e) => setRecoveryIdentifier(e.target.value)}
              />
            </div>
          ) : (
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center space-y-2">
              <p className="text-xs font-bold text-blue-800 uppercase italic">Verification Link Triggered</p>
              <p className="text-[10px] text-blue-600 font-medium">Check your registered device for the 6-digit secure access token.</p>
            </div>
          )}
          
          <button 
            onClick={handleReset}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95"
          >
            {resetStep === 1 ? 'Initiate Recovery' : 'Confirm & Dispatch Link'}
          </button>
          <button 
            onClick={() => {setIsResetting(false); setResetStep(1);}}
            className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest py-2 hover:text-slate-600 transition-colors"
          >
            Back to Secure Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-none max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">Authorized Login</h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Accessing Global Research Network</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Account Identity</label>
          <input 
            type="text" 
            className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-800 bg-slate-50"
            placeholder="Username or ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Access Protocol</label>
          <input 
            type="password" 
            className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-800 bg-slate-50"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-right">
          <button onClick={() => setIsResetting(true)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Forgot Access Key?</button>
        </div>
        <button 
          onClick={() => onLogin(username, password)}
          className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase tracking-widest text-xs"
        >
          Initialize Dashboard
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-6 font-black uppercase tracking-widest">
          New Researcher? <button onClick={onGoToRegister} className="text-blue-600 font-black hover:underline">Apply for Account</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
