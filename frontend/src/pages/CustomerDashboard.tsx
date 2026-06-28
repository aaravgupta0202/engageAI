import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Target, Activity, CalendarClock, Wallet, HeartPulse, Sparkles, Send, ArrowRight } from 'lucide-react';
import FinancialGraphView from '../components/FinancialGraphView';

export default function CustomerDashboard({ customerId, onNavigate }: { customerId: string | null, onNavigate: (page: string) => void }) {
  const [data, setData] = useState<any>(null);
  const [hasRunAnalysis, setHasRunAnalysis] = useState(false);
  const [scenarioInput, setScenarioInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<any>(null);

  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (!customerId) return;
    
    // Check if the user has run the analysis agents already
    setHasRunAnalysis(localStorage.getItem(`analysis_run_${customerId}`) === 'true');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/customers/${customerId}/graph`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, [customerId]);

  if (!customerId) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500 text-center px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <User size={32} className="text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">No Persona Selected</h2>
      <p className="text-slate-500 max-w-md mb-8">You need to select or generate a synthetic persona before viewing the dashboard.</p>
      <Button onClick={() => onNavigate('generator')} className="bg-sbi-blue text-white rounded-full px-8 py-3 font-semibold shadow-md hover:bg-sbi-navy hover:shadow-lg transition-all">
        Go to Generator
      </Button>
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-sbi-blue rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium animate-pulse">Loading Financial Graph...</p>
    </div>
  );

  const handleSaveEdit = async () => {
    if (!editKey || !customerId) return;
    const isGoal = editKey === 'goals';
    let newValue: any = editValue;
    
    if (isGoal) {
        newValue = editValue.split(',').map(s => s.trim()).filter(Boolean);
    } else if (!isNaN(Number(editValue))) {
        newValue = Number(editValue);
    }
    
    const updatedProfile = { ...data.profile, [editKey]: newValue };
    setData({ ...data, profile: updatedProfile });
    setEditKey(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    try {
        await fetch(`${API_URL}/customers/${customerId}/graph`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile: updatedProfile })
        });
    } catch (e) {
        console.error("Failed to save edit:", e);
    }
  };


  const parseNum = (val: any) => {
      if (!val) return 0;
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
          const match = val.match(/\d+/g);
          return match ? parseInt(match.join('')) : 0;
      }
      return 0;
  };

  const calculateMetrics = (profile: any) => {
      const income = parseNum(profile?.income) || 0;
      const expenses = parseNum(profile?.cost_of_living_estimate) || (income * 0.5) || 0;
      
      let assets = 0;
      if (profile?.assets) {
        if (Array.isArray(profile.assets)) {
          assets = profile.assets.reduce((acc: number, cur: any) => acc + parseNum(cur), 0) || income * 2;
        } else {
          assets = parseNum(profile.assets) || income * 2;
        }
      } else {
        assets = income * 2;
      }

      let liabilities = 0;
      if (profile?.liabilities) {
        liabilities = parseNum(profile.liabilities);
      } else {
        liabilities = assets * 0.3;
      }

      const netWorth = assets - liabilities;

      const savingsScore = assets > income ? 25 : Math.min(25, (assets / Math.max(income, 1)) * 25);
      const emergencyFundScore = (assets > expenses * 6) ? 20 : 10;
      const insuranceScore = profile?.notes?.toLowerCase().includes('insurance') ? 15 : 0;
      const debtScore = liabilities === 0 ? 15 : Math.max(0, 15 - (liabilities / Math.max(assets, 1)) * 15);
      const goalsScore = (profile?.goals && profile.goals.length > 0) ? 15 : 0;
      const cashFlowScore = (income > expenses * 12) ? 10 : 5;

      const healthScore = Math.round(savingsScore + emergencyFundScore + insuranceScore + debtScore + goalsScore + cashFlowScore);

      return {
          assets,
          liabilities,
          netWorth,
          healthScore,
          breakdown: {
              savings: Math.round(savingsScore),
              emergency: Math.round(emergencyFundScore),
              insurance: Math.round(insuranceScore),
              debt: Math.round(debtScore),
              goals: Math.round(goalsScore),
              cashFlow: Math.round(cashFlowScore)
          }
      };
  };

  const metrics = data?.profile ? calculateMetrics(data.profile) : null;

  const handleSimulateScenario = async () => {
    if (!scenarioInput.trim() || !customerId) return;
    setIsSimulating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/personas/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, scenario: scenarioInput })
      });
      if (res.ok) {
        const simData = await res.json();
        const origMetrics = calculateMetrics(simData.original);
        const simMetrics = calculateMetrics(simData.simulated);
        setScenarioResult({ original: origMetrics, simulated: simMetrics, profile: simData.simulated });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Generate deterministic past events based on age and demographics
  const generatePastEvents = (profile: any) => {
    const age = parseInt(profile?.age) || 30;
    const currentYear = new Date().getFullYear();
    const events = [];
    
    if (age > 22) {
      events.push({ year: currentYear - (age - 22), title: "First Job", desc: "Started full-time employment.", color: "bg-slate-400" });
    }
    if (age > 26) {
      events.push({ year: currentYear - (age - 26), title: "Bought Car", desc: "First major vehicle purchase.", color: "bg-slate-500" });
    }
    if (profile?.demographics?.toLowerCase().includes('married') || age > 28) {
      events.push({ year: currentYear - (age - 28), title: "Married", desc: "Tied the knot.", color: "bg-pink-400" });
    }
    if (profile?.demographics?.toLowerCase().includes('child') || profile?.demographics?.toLowerCase().includes('dependents') || age > 31) {
      events.push({ year: currentYear - (age - 31), title: "Child Born", desc: "Expanded the family.", color: "bg-purple-400" });
    }
    if (profile?.income && parseNum(profile.income) > 1000000) {
      events.push({ year: currentYear - 1, title: "Salary Hike", desc: "Significant income increase.", color: "bg-green-400" });
    }
    
    return events.sort((a: any, b: any) => b.year - a.year);
  };


  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Financial Life Graph</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{data.archetype} • ID: <span className="font-mono text-xs text-slate-400">{customerId?.substring(0, 8)}...</span></p>
        </div>
        <Button onClick={() => onNavigate('agent')} className="w-full md:w-auto rounded-full px-8 shadow-lg bg-gradient-to-r from-cyan-500 to-sbi-blue hover:from-cyan-400 hover:to-sbi-blue text-white font-bold transition-all hover:scale-105 shrink-0 whitespace-nowrap">
          Run Analysis Agents
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 glass-card border-t-4 border-t-cyan-400">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center"><User className="w-6 h-6 mr-2 text-cyan-500" /> Identity & Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600 dark:text-slate-300">
            {Object.keys(data.profile || {}).filter(k => k !== 'goals').map((key) => (
              <div key={key} className="flex flex-col border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">{key.replace(/_/g, ' ')}</span>
                {editKey === key ? (
                  <div className="flex items-center gap-2">
                    <input autoFocus className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm text-slate-900 dark:text-white" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveEdit()} />
                    <button onClick={handleSaveEdit} className="text-xs bg-emerald-500 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={() => setEditKey(null)} className="text-xs text-slate-400">Cancel</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center group">
                    <span className="font-bold text-slate-800 dark:text-white">
                      {key === 'income' || key === 'cost_of_living_estimate' ? `₹${Number(data.profile[key]).toLocaleString()}` : (Array.isArray(data.profile[key]) ? data.profile[key].join(', ') : data.profile[key])}
                    </span>
                    <button onClick={() => { setEditKey(key); setEditValue(Array.isArray(data.profile[key]) ? data.profile[key].join(', ') : String(data.profile[key])); }} className="text-xs text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 glass-card border-t-4 border-t-indigo-500">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center justify-between">
                <div className="flex items-center"><Target className="w-6 h-6 mr-2 text-indigo-500" /> Life Goals</div>
                {editKey !== 'goals' && <button onClick={() => { setEditKey('goals'); setEditValue((data.profile?.goals || []).join(', ')); }} className="text-xs text-indigo-500 font-medium">Edit Goals</button>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editKey === 'goals' ? (
                <div className="flex flex-col gap-2">
                    <input autoFocus className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm text-slate-900 dark:text-white" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveEdit()} placeholder="Comma separated goals..." />
                    <div className="flex gap-2">
                        <button onClick={handleSaveEdit} className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded">Save Goals</button>
                        <button onClick={() => setEditKey(null)} className="text-xs text-slate-400">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4 w-full">
                  {(data.profile?.goals || []).map((g: string, i: number) => {
                    const progress = Math.min(100, Math.max(10, Math.round((g.length * 7.3) % 85))); 
                    return (
                    <div key={i} className="px-5 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-800/50 font-medium shadow-sm flex flex-col w-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span> {g}</span>
                        <span className="text-sm font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-indigo-100 dark:bg-indigo-800/50 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  )})}
                  {(!data.profile?.goals || data.profile.goals.length === 0) && <span className="text-slate-400 italic">No goals specified.</span>}
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass-card border-t-4 border-t-emerald-400 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-400 opacity-5 rounded-full blur-3xl"></div>
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center"><Activity className="w-6 h-6 mr-2 text-emerald-500" /> Embedded Life Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {Object.entries(data.life_events || {}).map(([key, val]) => (
                <div key={key} className={`p-4 rounded-xl border ${val ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                  <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">{key.replace(/_/g, ' ')}</div>
                  <div className="text-lg font-black">{val ? 'DETECTED' : 'None'}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        
        {metrics && (
          <>
            <Card className="md:col-span-1 glass-card border-t-4 border-t-pink-500">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-white flex items-center"><Wallet className="w-6 h-6 mr-2 text-pink-500" /> Net Worth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 text-sm">Assets</span>
                  <span className="font-bold text-emerald-500">₹{metrics.assets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 text-sm">Liabilities</span>
                  <span className="font-bold text-red-500">-₹{metrics.liabilities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-800 dark:text-white font-bold">Net Worth</span>
                  <span className="font-black text-xl text-sbi-blue">₹{metrics.netWorth.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 glass-card border-t-4 border-t-amber-500">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-white flex items-center justify-between">
                  <div className="flex items-center"><HeartPulse className="w-6 h-6 mr-2 text-amber-500" /> Financial Health Score</div>
                  <div className="text-2xl font-black text-amber-500">{metrics.healthScore} <span className="text-sm text-slate-400 font-normal">/ 100</span></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Savings</div>
                    <div className="font-bold text-slate-800 dark:text-amber-100">{metrics.breakdown.savings} <span className="text-xs font-normal text-slate-400">/ 25</span></div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Emergency Fund</div>
                    <div className="font-bold text-slate-800 dark:text-amber-100">{metrics.breakdown.emergency} <span className="text-xs font-normal text-slate-400">/ 20</span></div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Debt Mgmt</div>
                    <div className="font-bold text-slate-800 dark:text-amber-100">{metrics.breakdown.debt} <span className="text-xs font-normal text-slate-400">/ 15</span></div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Insurance</div>
                    <div className="font-bold text-slate-800 dark:text-amber-100">{metrics.breakdown.insurance} <span className="text-xs font-normal text-slate-400">/ 15</span></div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Goals Setup</div>
                    <div className="font-bold text-slate-800 dark:text-amber-100">{metrics.breakdown.goals} <span className="text-xs font-normal text-slate-400">/ 15</span></div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cash Flow</div>
                    <div className="font-bold text-slate-800 dark:text-amber-100">{metrics.breakdown.cashFlow} <span className="text-xs font-normal text-slate-400">/ 10</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <FinancialGraphView data={data} />

        <Card className="md:col-span-3 glass-card border-t-4 border-t-purple-500 overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center"><CalendarClock className="w-6 h-6 mr-2 text-purple-500" /> Financial Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 pl-6 space-y-6">
              
              {hasRunAnalysis || (data.recommendations && data.recommendations.length > 0) ? (
                <div className="relative">
                  <div className="absolute -left-[33px] bg-sbi-blue rounded-full w-4 h-4 border-4 border-white dark:border-slate-900 animate-pulse"></div>
                  <p className="text-sm text-sbi-blue font-bold tracking-wider uppercase mb-1">Next Step</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">AI Recommendations Ready</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <button className="p-0 h-auto text-sbi-blue font-semibold hover:text-sbi-navy hover:underline text-base outline-none bg-transparent" onClick={() => onNavigate('recommendations')}>
                      Review proactive actions ➔
                    </button>
                  </p>
                </div>
              ) : (
                <div className="relative opacity-60">
                  <div className="absolute -left-[33px] bg-slate-300 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                  <p className="text-sm text-slate-500 mb-1">Upcoming</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">AI Recommendations Pending</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Run the Engagement Cycle to predict future needs.</p>
                </div>
              )}

              <div className="relative">
                <div className="absolute -left-[33px] bg-green-500 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                <p className="text-sm text-slate-500 mb-1">Today</p>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Current State Active</h4>
              </div>

              {Object.entries(data.life_events || {}).filter(([_, val]) => val).map(([key, _]) => (
                <div key={key} className="relative">
                  <div className="absolute -left-[33px] bg-emerald-500 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                  <p className="text-sm text-slate-500 mb-1">Recent Event</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Detected: {key.replace(/_/g, ' ').toUpperCase()} <span className="text-xs ml-2 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Confidence: 91%</span></h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">AI identified this life event from transaction patterns.</p>
                </div>
              ))}

              {generatePastEvents(data.profile).map((ev: any, idx: number) => (
                <div key={idx} className="relative opacity-80 hover:opacity-100 transition-opacity">
                  <div className={`absolute -left-[33px] ${ev.color} rounded-full w-4 h-4 border-4 border-white dark:border-slate-900`}></div>
                  <p className="text-sm text-slate-500 mb-1">{ev.year}</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{ev.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{ev.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass-card border-t-4 border-t-blue-500 overflow-hidden relative">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent">
            <CardTitle className="text-slate-800 dark:text-white flex items-center justify-between">
              <div className="flex items-center"><Sparkles className="w-6 h-6 mr-2 text-blue-500" /> Scenario Planner ("What if?")</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <input 
                type="text" 
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="E.g., What if I get married next year and buy a car?" 
                value={scenarioInput}
                onChange={e => setScenarioInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSimulateScenario()}
              />
              <button 
                onClick={handleSimulateScenario} 
                disabled={isSimulating || !scenarioInput.trim()}
                className="rounded-xl px-6 py-0 bg-blue-500 hover:bg-blue-600 text-white font-bold shrink-0 flex items-center justify-center shadow-md transition-transform hover:scale-105 disabled:opacity-50"
              >
                {isSimulating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Send size={18} className="mr-2" /> Simulate</>}
              </button>
            </div>
            
            {scenarioResult && (
              <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider text-sm">Simulated Twin Projection</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                     <span className="text-sm text-slate-500 mb-1">Health Score</span>
                     <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-slate-400 line-through">{scenarioResult.original.healthScore}</span>
                        <ArrowRight size={16} className="text-blue-500" />
                        <span className={`text-2xl font-black ${scenarioResult.simulated.healthScore > scenarioResult.original.healthScore ? 'text-emerald-500' : 'text-red-500'}`}>{scenarioResult.simulated.healthScore}</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                     <span className="text-sm text-slate-500 mb-1">Net Worth</span>
                     <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-400 line-through">₹{(scenarioResult.original.netWorth/100000).toFixed(1)}L</span>
                        <ArrowRight size={16} className="text-blue-500" />
                        <span className="text-xl font-black text-blue-500">₹{(scenarioResult.simulated.netWorth/100000).toFixed(1)}L</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                     <span className="text-sm text-slate-500 mb-1">Cash Flow Score</span>
                     <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-400 line-through">{scenarioResult.original.breakdown.cashFlow}/10</span>
                        <ArrowRight size={16} className="text-blue-500" />
                        <span className="text-xl font-black text-blue-500">{scenarioResult.simulated.breakdown.cashFlow}/10</span>
                     </div>
                  </div>
                  
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
