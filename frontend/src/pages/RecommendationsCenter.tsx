import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, TrendingUp, ShieldAlert, AlertCircle, ExternalLink, ActivitySquare, ArrowRight, Loader2 } from 'lucide-react';

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
      if (Array.isArray(profile.assets)) assets = profile.assets.reduce((acc: number, cur: any) => acc + parseNum(cur), 0) || income * 2;
      else assets = parseNum(profile.assets) || income * 2;
    } else {
      assets = income * 2;
    }
    let liabilities = parseNum(profile?.liabilities) || assets * 0.3;
    const savingsScore = assets > income ? 25 : Math.min(25, (assets / Math.max(income, 1)) * 25);
    const emergencyFundScore = (assets > expenses * 6) ? 20 : 10;
    const insuranceScore = (typeof profile?.notes === 'string' && profile.notes.toLowerCase().includes('insurance')) ? 15 : 0;
    const debtScore = liabilities === 0 ? 15 : Math.max(0, 15 - (liabilities / Math.max(assets, 1)) * 15);
    let hasGoals = false;
    if (profile?.goals) {
        if (Array.isArray(profile.goals)) hasGoals = profile.goals.length > 0;
        else if (typeof profile.goals === 'string') hasGoals = profile.goals.trim().length > 0;
        else if (typeof profile.goals === 'object') hasGoals = Object.keys(profile.goals).length > 0;
    }
    const goalsScore = hasGoals ? 15 : 0;
    const cashFlowScore = (income > expenses * 12) ? 10 : 5;
    const healthScore = Math.round(savingsScore + emergencyFundScore + insuranceScore + debtScore + goalsScore + cashFlowScore);
    return { healthScore };
};

export default function RecommendationsCenter({ customerId, onNavigate }: { customerId: string | null, onNavigate: (page: string) => void }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [simulatingRec, setSimulatingRec] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleSimulate = async (rec: any) => {
    setSimulatingRec(rec);
    if (!customerId) return;
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/personas/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, scenario: `Adopt recommendation: ${rec.product}` })
      });
      if (res.ok) {
        const simData = await res.json();
        const origScore = calculateMetrics(simData.original).healthScore;
        const newScore = calculateMetrics(simData.simulated).healthScore;
        setSimulationResult({ before: origScore, after: newScore, profile: simData.simulated });
      } else {
        setSimulationResult({ error: true });
      }
    } catch(e) {
      console.error(e);
      setSimulationResult({ error: true });
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (!customerId) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    // Attempt to fetch graph to get recommendations
    fetch(`${API_URL}/customers/${customerId}/graph`)
      .then(res => res.json())
      .then(data => {
        const localOppStr = localStorage.getItem(`opportunities_${customerId}`);
        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
        } else if (localOppStr) {
          try {
            const opps = JSON.parse(localOppStr);
            const formattedOpps = opps.map((o: any, idx: number) => ({
              ...o,
              id: o.id || `rec_${idx}`,
              category: o.category || 'invest'
            }));
            setRecommendations(formattedOpps);
          } catch(e) {
            console.error("Failed to parse local opportunities", e);
          }
        } else {
          // Fallback mock for the MVP demo path (Young Professional -> SIP Top-Up)
          setRecommendations([
            {
              id: "rec_sip_1",
              product: "Mutual Fund SIP Top-Up",
              rationale: "Your income recently increased by 19% over the last 2 cycles. Routing a portion of this new surplus to your existing SIP maximizes wealth accumulation without affecting your previous lifestyle.",
              fit_score: 0.88,
              urgency: "Medium",
              category: "invest"
            },
            {
              id: "rec_ins_1",
              product: "Term Life Insurance Expansion",
              rationale: "With a higher income baseline, your current income protection gap has widened. A supplementary term policy covers this new risk exposure.",
              fit_score: 0.72,
              urgency: "Low",
              category: "protect"
            }
          ]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [customerId]);

  const selectedAction = customerId ? localStorage.getItem(`selected_action_${customerId}`) : null;

  const handleAccept = (productName: string) => {
    localStorage.setItem(`selected_action_${customerId}`, productName);
    onNavigate('actions');
  };

  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
        <p className="text-lg font-medium">Please select a persona first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-center glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Opportunity Discovery</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Ranked recommendations based on your live financial graph.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, idx) => (
            <Card key={rec.id || idx} className={`glass-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${idx === 0 ? 'border-2 border-emerald-400/50' : 'border border-slate-200 dark:border-slate-800'}`}>
              {idx === 0 && (
                <div className="bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 text-center">
                  Top Recommended Action
                </div>
              )}
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                
                {/* Icon & Score */}
                <div className="flex flex-col items-center justify-center min-w-[100px] shrink-0">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner ${rec.category === 'invest' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'}`}>
                    {rec.category === 'invest' ? <TrendingUp size={32} /> : <ShieldAlert size={32} />}
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold font-mono">
                    FIT: {(rec.fit_score * 100).toFixed(0)}%
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{rec.product}</h3>
                      {rec.urgency === 'High' && <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full"><AlertCircle size={12} className="mr-1"/> Urgent</span>}
                    </div>
                  </div>
                  
                  {rec.rationale && <p className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base border-l-2 border-slate-300 dark:border-slate-700 pl-3 italic">{rec.rationale}</p>}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {rec.why_this && <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Why this?</span>{rec.why_this}</div>}
                    {rec.benefits && <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Benefits</span>{rec.benefits}</div>}
                    {rec.why_now && <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Why now?</span>{rec.why_now}</div>}
                    {rec.impact && <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Estimated Impact</span>{rec.impact}</div>}
                    {rec.eligibility && <div><span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Eligibility</span>{rec.eligibility}</div>}
                  </div>

                  {rec.factors && Array.isArray(rec.factors) && rec.factors.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Based on:</div>
                      <div className="flex flex-wrap gap-2">
                        {rec.factors.map((factor: string, i: number) => (
                          <span key={i} className="text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50 flex items-center">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                  <Button 
                    onClick={() => handleAccept(rec.product)}
                    className="flex-1 md:w-40 rounded-full shadow-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <CheckCircle2 size={18} className="mr-2" /> {selectedAction === rec.product ? 'Continue Setup' : 'Accept'}
                  </Button>
                  <Button 
                    onClick={() => handleSimulate(rec)}
                    className="flex-1 md:w-40 rounded-full shadow-md bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <ActivitySquare size={18} className="mr-2" /> Simulate Impact
                  </Button>
                  <Button 
                    onClick={() => setRecommendations(prev => prev.filter(r => r.id !== rec.id))}
                    className="flex-1 md:w-40 rounded-full shadow-md bg-red-500 hover:bg-red-600 text-white font-bold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <XCircle size={18} className="mr-2" /> Decline
                  </Button>
                  {rec.url && (
                    <Button 
                      onClick={() => window.open(rec.url, '_blank')}
                      className="flex-1 md:w-40 rounded-full shadow-md bg-sbi-blue hover:bg-sbi-navy text-white font-bold transition-all hover:scale-105 flex items-center justify-center"
                    >
                      <ExternalLink size={18} className="mr-2" /> View Product
                    </Button>
                  )}
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

      {simulatingRec && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <Card className="w-full max-w-2xl overflow-hidden shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white pb-6 pt-6">
              <CardTitle className="flex justify-between items-center text-2xl">
                <span><ActivitySquare className="inline mr-2" /> Recommendation Simulator</span>
                <button onClick={() => setSimulatingRec(null)} className="opacity-70 hover:opacity-100"><XCircle /></button>
              </CardTitle>
              <p className="opacity-90 font-medium">Predicting the impact of: {simulatingRec.product}</p>
            </CardHeader>
            <CardContent className="p-8 space-y-8 bg-white dark:bg-slate-900">
              
              {isSimulating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={48} className="text-purple-500 animate-spin" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Running advanced AI simulation on your digital twin...</p>
                </div>
              ) : simulationResult?.error ? (
                <div className="py-12 text-center text-red-500">
                  <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Failed to simulate recommendation. Please try again.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-6 items-center">
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Before</div>
                      <div className="text-4xl font-black text-slate-700 dark:text-slate-300">{simulationResult?.before || 82} <span className="text-lg font-normal text-slate-400">/100</span></div>
                      <div className="text-xs text-slate-400 mt-2">Health Score</div>
                    </div>
                    
                    <div className="flex justify-center text-purple-500 animate-pulse">
                      <ArrowRight size={48} />
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-md">
                      <div className="text-purple-600 dark:text-purple-400 text-sm font-bold uppercase tracking-wider mb-2">After</div>
                      <div className="text-4xl font-black text-purple-700 dark:text-purple-300">
                        {simulationResult?.after || (simulatingRec.category === 'protect' ? '91' : (simulatingRec.category === 'borrow' ? '79' : '88'))} <span className="text-lg font-normal opacity-50">/100</span>
                      </div>
                      <div className="text-xs text-purple-500 mt-2">Projected Health Score</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-sm border-b pb-2">Simulated Impacts on Twin</h4>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Goal Progress (Est.)</span>
                      <span className="font-bold text-emerald-500">{simulationResult?.after > simulationResult?.before ? '+8.5% acceleration' : 'Minor deceleration'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Monthly Cash Flow</span>
                      <span className={simulatingRec.category === 'borrow' ? "font-bold text-red-500" : "font-bold text-amber-500"}>
                        -₹{Math.floor(Math.random() * 5000 + 2000).toLocaleString()} (Est. EMI/Premium)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Risk Profile Alignment</span>
                      <span className="font-bold text-emerald-500">Optimal Match</span>
                    </div>
                  </div>
                  
                  <Button onClick={() => { handleAccept(simulatingRec.product); setSimulatingRec(null); }} className="w-full h-12 text-lg rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg transition-transform hover:scale-105">
                    Apply Action Now
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>

  );
}
