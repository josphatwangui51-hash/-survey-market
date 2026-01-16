
import React, { useState } from 'react';
import { User, Page, Survey, Question, PremiumTier } from '../types';
import { MOCK_SURVEYS, DAILY_SURVEY_LIMIT, ADMIN_PHONE, REWARD_DEDUCTION_RATE } from '../constants';
import MapsGrounding from './MapsGrounding';

interface SurveyPageProps {
  user: User | null;
  onComplete: (amt: number, surveyId?: string, tier?: PremiumTier) => void;
  onNavigate: (page: Page) => void;
  addNotification: (msg: string, type: 'info' | 'success') => void;
}

const SurveyPage: React.FC<SurveyPageProps> = ({ user, onComplete, onNavigate, addNotification }) => {
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [premiumInput, setPremiumInput] = useState('');
  const [selectedTier, setSelectedTier] = useState<PremiumTier>('basic');
  const [showResults, setShowResults] = useState(false);
  const [mapData, setMapData] = useState<{text: string, links: {title: string, uri: string}[]} | null>(null);

  if (!user) return null;

  const availableSurveys = MOCK_SURVEYS.filter(s => !user.completedSurveys.includes(s.id));

  const startSurvey = (survey: Survey) => {
    if (!user.isPremium && user.dailyCount >= DAILY_SURVEY_LIMIT) {
      setIsUpgrading(true);
      return;
    }

    const qCount = survey.questions.length;
    if (user.isPremium) {
      if (user.premiumTier === 'basic' && qCount > 5) {
        alert("Your Essential Tier covers up to 5 questions. Elevate to Professional for deeper research access.");
        setIsUpgrading(true);
        return;
      }
      if (user.premiumTier === 'standard' && qCount > 7) {
        alert("Professional Tier covers up to 7 questions. Unlock the Elite Master Tier for full platform control.");
        setIsUpgrading(true);
        return;
      }
    }

    setActiveSurvey(survey);
    setCurrentIdx(0);
    setScore(0);
    setShowResults(false);
    setMapData(null);
  };

  const handleNext = () => {
    if (!selectedOption || !activeSurvey) return;
    const currentQ = activeSurvey.questions[currentIdx];
    if (selectedOption === currentQ.correctAnswer) setScore(prev => prev + 1);

    if (currentIdx < activeSurvey.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setMapData(null);
    } else {
      const totalQuestions = activeSurvey.questions.length;
      const accuracy = (score + (selectedOption === currentQ.correctAnswer ? 1 : 0)) / totalQuestions;
      const grossReward = Math.round(10 + (40 * accuracy));
      const netReward = Math.round(grossReward * (1 - REWARD_DEDUCTION_RATE));
      
      onComplete(netReward, activeSurvey.id);
      addNotification(`Survey Finished! Scored ${Math.round(accuracy * 100)}%. Earned Net KES ${netReward}`, 'success');
      setShowResults(true);
    }
  };

  const handlePremiumUpgrade = () => {
    if (!premiumInput.trim()) return alert("Please provide the M-Pesa code or paste the full confirmation message.");
    const codeRegex = /([A-Z0-9]{10})/;
    const match = premiumInput.match(codeRegex);
    const extractedCode = match ? match[1] : premiumInput.trim().toUpperCase();
    if (extractedCode.length < 8) return alert("Invalid reference ID.");

    addNotification(`${selectedTier.toUpperCase()} Membership Authorized! Research depth increased.`, "success");
    setIsUpgrading(false);
    onComplete(0, undefined, selectedTier);
    onNavigate(Page.DASHBOARD);
  };

  const tierPrices = { basic: 100, standard: 300, elite: 500 };

  if (isUpgrading) {
    return (
      <div className="max-w-4xl mx-auto pb-12 animate-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase mb-2">Elevate Your Research</h2>
          <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto leading-relaxed">
            Unlock deeper insights and higher rewards. Our premium tiers allow you to engage with complex global data, 
            expanding your contribution to international market intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div onClick={() => setSelectedTier('basic')} className={`cursor-pointer group relative bg-white p-8 rounded-[2.5rem] border-2 transition-all hover:shadow-2xl ${selectedTier === 'basic' ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100 opacity-80'}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Essential</div>
            <p className="text-3xl font-black text-slate-900 italic mb-1">KES 100</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">Strategic Entry Access</p>
            <ul className="space-y-3 text-xs font-bold text-slate-600 mb-8">
              <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> 5-Question Depth</li>
              <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Standard Priority</li>
            </ul>
          </div>
          <div onClick={() => setSelectedTier('standard')} className={`cursor-pointer group relative bg-white p-8 rounded-[2.5rem] border-2 transition-all hover:shadow-2xl ${selectedTier === 'standard' ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 opacity-80'}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Professional</div>
            <p className="text-3xl font-black text-slate-900 italic mb-1">KES 300</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">Advanced Data Analysis</p>
            <ul className="space-y-3 text-xs font-bold text-slate-600 mb-8">
              <li className="flex items-center gap-2"><span className="text-indigo-500">✓</span> 7-Question Depth</li>
              <li className="flex items-center gap-2"><span className="text-indigo-500">✓</span> High Priority Payout</li>
            </ul>
          </div>
          <div onClick={() => setSelectedTier('elite')} className={`cursor-pointer group relative bg-slate-900 p-8 rounded-[2.5rem] border-2 transition-all hover:shadow-2xl ${selectedTier === 'elite' ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-slate-800 opacity-80'}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Elite Master</div>
            <p className="text-3xl font-black text-white italic mb-1">KES 500</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 italic">Platform Supremacy</p>
            <ul className="space-y-3 text-xs font-bold text-slate-400 mb-8">
              <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Unlimited Questions</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Instant Liquidity</li>
            </ul>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem] shadow-xl border-none text-center">
          <div className="bg-slate-50 p-6 rounded-3xl inline-block mb-8 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization Instructions</p>
            <p className="text-sm font-medium">Send <strong>KES {tierPrices[selectedTier as keyof typeof tierPrices]}</strong> to:</p>
            <p className="text-3xl font-black text-slate-900 italic tracking-tighter mt-1">{ADMIN_PHONE}</p>
          </div>
          <div className="space-y-4 max-w-md mx-auto">
            <textarea 
              className="w-full p-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-sm font-medium focus:border-blue-600 focus:bg-white outline-none transition-all h-32 scrollbar-hide"
              placeholder="Paste M-Pesa message here..."
              value={premiumInput}
              onChange={(e) => setPremiumInput(e.target.value)}
            />
            <button onClick={handlePremiumUpgrade} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-slate-800 shadow-xl transition-all uppercase tracking-widest text-xs">Verify & Activate</button>
            <button onClick={() => setIsUpgrading(false)} className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest py-2 hover:text-slate-600 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && activeSurvey) {
    const totalQuestions = activeSurvey.questions.length;
    const finalScore = Math.round((score / totalQuestions) * 100);
    const grossReward = Math.round(10 + (40 * (score / totalQuestions)));
    const netReward = Math.round(grossReward * (1 - REWARD_DEDUCTION_RATE));
    const deducted = grossReward - netReward;

    return (
      <div className="glass-card p-10 rounded-[3rem] shadow-2xl text-center max-w-lg mx-auto border-t-8 border-green-500">
        <div className="text-5xl mb-6">🎯</div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 italic tracking-tighter uppercase">Research Complete</h2>
        <div className="py-6 border-y border-slate-100 my-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Final Accuracy</p>
          <p className="text-5xl font-black text-blue-600">{finalScore}%</p>
        </div>
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Gross Earning</span>
            <span>KES {grossReward}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-red-400 uppercase">
            <span>Platform Fee (20%)</span>
            <span>- KES {deducted}</span>
          </div>
          <div className="pt-2 border-t flex justify-between">
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Net Credited</span>
            <span className="text-3xl font-black text-green-600 italic">KES {netReward}</span>
          </div>
        </div>
        <button onClick={() => { setActiveSurvey(null); setShowResults(false); }} className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-slate-800 transition-all shadow-xl mt-6 uppercase text-xs tracking-widest">Explore New Fields</button>
      </div>
    );
  }

  if (activeSurvey) {
    const q = activeSurvey.questions[currentIdx];
    const progress = ((currentIdx + 1) / activeSurvey.questions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center px-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 italic uppercase tracking-tighter">{activeSurvey.title}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{activeSurvey.category} Analysis</p>
          </div>
          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100">PHASE {currentIdx + 1}/{activeSurvey.questions.length}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-none">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-slate-800 leading-snug italic tracking-tight flex-1">{q.text}</h3>
            {activeSurvey.category === 'Geography' || activeSurvey.category === 'Economy' ? (
              <MapsGrounding query={`Relevant locations for: "${q.text}"`} onResult={(text, links) => setMapData({text, links})} />
            ) : null}
          </div>
          {mapData && (
            <div className="mb-8 p-4 bg-slate-900 rounded-2xl text-white text-[11px] font-medium animate-in fade-in zoom-in duration-300">
              <p className="mb-3 opacity-90 leading-relaxed italic">{mapData.text}</p>
              {mapData.links.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {mapData.links.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-blue-600 px-3 py-1 rounded-lg font-black uppercase hover:bg-blue-500 transition-colors">{link.title}</a>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="space-y-3">
            {q.options.map(opt => (
              <button key={opt} onClick={() => setSelectedOption(opt)} className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-bold text-sm ${selectedOption === opt ? 'border-blue-600 bg-blue-50 text-blue-800 scale-[1.01] shadow-lg shadow-blue-50' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>{opt}</button>
            ))}
          </div>
          <div className="mt-10 flex justify-end">
            <button onClick={handleNext} disabled={!selectedOption} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 italic uppercase tracking-widest text-xs">
              {currentIdx === activeSurvey.questions.length - 1 ? 'Submit Research' : 'Forward Phase'}
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4 px-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">Market Operations</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select an active research field</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase">Current Clearance</p>
          <p className="font-black text-blue-600 italic">
            {user.isPremium ? `${user.premiumTier?.toUpperCase()} TIER ACTIVE` : `${DAILY_SURVEY_LIMIT - user.dailyCount} TASKS REMAINING`}
          </p>
        </div>
      </div>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r-2xl">
        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Financial Notice</p>
        <p className="text-[11px] font-medium text-amber-700">20% Company service fee is deducted from gross rewards upon successful task completion.</p>
      </div>

      {availableSurveys.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <p className="text-5xl mb-4">🌪️</p>
          <h3 className="text-xl font-black text-slate-900 uppercase italic">All Sectors Optimized</h3>
          <p className="text-sm text-slate-500 font-medium mt-2">New market data packets arriving soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableSurveys.map(s => (
            <button key={s.id} onClick={() => startSurvey(s)} className="group glass-card p-6 rounded-[2rem] text-left hover:shadow-2xl hover:border-blue-200 transition-all active:scale-95 border-none shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest mb-2 inline-block">{s.category}</span>
                <h3 className="font-black text-slate-800 text-lg italic tracking-tight group-hover:text-blue-600 transition-colors">{s.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.questions.length} Data Points • KES {Math.round(50 * (1-REWARD_DEDUCTION_RATE))} Net</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">→</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyPage;
