
import React from 'react';
import { User, Notification, Page } from '../types';
import { DAILY_SURVEY_LIMIT } from '../constants';

interface DashboardProps {
  user: User | null;
  notifications: Notification[];
  onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, notifications, onNavigate }) => {
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
        <p className="text-blue-100 text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Total Earnings</p>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-black">KES {user.balance.toLocaleString()}</span>
          <span className="text-blue-200 text-sm pb-1">Verified Balance</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-xs text-blue-100 opacity-80 uppercase">Daily Task</p>
            <p className="font-bold text-lg">{user.dailyCount}/{DAILY_SURVEY_LIMIT}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-100 opacity-80 uppercase">Account Status</p>
            <p className="font-bold text-lg">{user.isPremium ? 'Premium ⭐' : 'Standard'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => onNavigate(Page.SURVEYS)}
          className="flex-1 bg-white p-4 rounded-xl shadow-sm border font-bold text-blue-700 text-center min-w-[120px]"
        >
          Start Earning
        </button>
        <button 
          onClick={() => onNavigate(Page.WITHDRAW)}
          className="flex-1 bg-white p-4 rounded-xl shadow-sm border font-bold text-green-700 text-center min-w-[120px]"
        >
          Withdraw
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-700 flex justify-between items-center">
          Recent Activity
          <span className="text-xs font-normal text-gray-400">Updates live</span>
        </h3>
        {notifications.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl border text-gray-400 italic text-sm">
            No recent activity yet. Complete surveys to see logs.
          </div>
        ) : (
          notifications.map(note => (
            <div key={note.id} className="bg-white p-4 rounded-xl border-l-4 border-l-blue-500 shadow-sm animate-in slide-in-from-left duration-300">
              <p className="text-sm text-gray-800 font-medium">{note.message}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">{note.timestamp.toLocaleTimeString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
