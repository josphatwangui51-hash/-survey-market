
import React, { useState } from 'react';
import { User, Page } from '../types';
import { MIN_WITHDRAWAL_KES, WITHDRAWAL_DEDUCTION_RATE } from '../constants';

interface WithdrawPageProps {
  user: User | null;
  onWithdraw: (amt: number) => void;
  onNavigate: (page: Page) => void;
  addNotification: (msg: string, type: 'info' | 'success') => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ user, onWithdraw, onNavigate, addNotification }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const amtNum = parseInt(amount) || 0;
  const deduction = Math.round(amtNum * WITHDRAWAL_DEDUCTION_RATE);
  const disbursement = amtNum - deduction;

  const handleWithdraw = () => {
    if (amtNum < MIN_WITHDRAWAL_KES) return alert(`Minimum withdrawal is KES ${MIN_WITHDRAWAL_KES}.`);
    if (amtNum > user.balance) return alert("Insufficient balance.");

    setLoading(true);
    setTimeout(() => {
      onWithdraw(amtNum);
      addNotification(`Withdrawal of KES ${amtNum} (Disbursement: KES ${disbursement}) requested.`, 'success');
      setAmount('');
      setLoading(false);
      alert(`Success! KES ${disbursement.toLocaleString()} will be processed to your M-Pesa within 24 hours after 15% admin deduction.`);
      onNavigate(Page.DASHBOARD);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-black text-slate-900 italic uppercase">Liquidity Disbursement</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Authorized Fund Withdrawal Portal</p>
      </div>
      
      <div className="glass-card p-8 rounded-[2.5rem] shadow-xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-1">Available to Withdraw</label>
            <p className="text-4xl font-black text-blue-600 italic tracking-tighter">KES {user.balance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-3 py-1 rounded-full uppercase">Priority Channel</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-2">Enter Withdrawal Amount (KES)</label>
            <input 
              type="number"
              className="w-full p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-3xl font-black text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all text-center italic"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] space-y-4 border border-slate-800 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Amount:</span>
              <span className="font-bold text-white italic">KES {amtNum.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Admin Protocol (15%):</span>
              <span className="font-bold text-red-400 italic">- KES {deduction.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Estimated Payout:</span>
              <span className="text-2xl font-black text-green-400 italic">KES {disbursement.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={handleWithdraw}
            disabled={loading || amtNum < MIN_WITHDRAWAL_KES}
            className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] hover:bg-slate-800 shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
          >
            {loading ? 'Initializing Payout Link...' : 'Authorize M-Pesa Disbursement'}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocol Transparency</h4>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
          To maintain global network stability, a 15% administrative fee is applied to all outgoing transactions. 
          Payouts are dispatched directly to <strong>{user.phone}</strong> following a final neural audit of research integrity.
        </p>
      </div>
    </div>
  );
};

export default WithdrawPage;
