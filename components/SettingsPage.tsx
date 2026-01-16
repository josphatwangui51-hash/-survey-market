
import React, { useState } from 'react';
import { User, Page } from '../types';

interface SettingsPageProps {
  user: User | null;
  onNavigate: (page: Page) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onNavigate }) => {
  const [notifs, setNotifs] = useState(true);
  const [privacy, setPrivacy] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-900 italic uppercase">Account Settings</h2>
        <button onClick={() => onNavigate(Page.MENU)} className="text-[10px] font-black uppercase text-blue-600">Back to Menu</button>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-100 divide-y divide-slate-50">
        <div className="p-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Communications</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800">Email & SMS Alerts</p>
              <p className="text-[10px] text-slate-400 font-medium">Notifications for new surveys and payouts</p>
            </div>
            <button 
              onClick={() => setNotifs(!notifs)}
              className={`w-12 h-6 rounded-full transition-all relative ${notifs ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifs ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Data Privacy</h3>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-bold text-slate-800">Incognito Mode</p>
              <p className="text-[10px] text-slate-400 font-medium">Anonymize your data from general researchers</p>
            </div>
            <button 
              onClick={() => setPrivacy(!privacy)}
              className={`w-12 h-6 rounded-full transition-all relative ${privacy ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacy ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <button className="text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50">Request Data Deletion (GDPR/DPA)</button>
        </div>

        <div className="p-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Membership</h3>
          <div className="bg-slate-950 p-4 rounded-2xl flex justify-between items-center">
             <div>
               <p className="text-white font-bold text-sm italic">Account Tier</p>
               <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{user.isPremium ? 'Premium (Active)' : 'Standard Plan'}</p>
             </div>
             {!user.isPremium && (
               <button 
                onClick={() => onNavigate(Page.SURVEYS)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter"
               >
                 Upgrade Now
               </button>
             )}
          </div>
        </div>
      </div>
      
      <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.3em]">Version 2.4.0 (Global Architecture)</p>
    </div>
  );
};

export default SettingsPage;
