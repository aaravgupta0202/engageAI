import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, TrendingUp, ShieldAlert, AlertCircle } from 'lucide-react';

export default function RecommendationsCenter({ customerId, onNavigate }: { customerId: string | null, onNavigate: (page: string) => void }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{rec.product}</h3>
                    {rec.urgency === 'High' && <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full"><AlertCircle size={12} className="mr-1"/> Urgent</span>}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                    {rec.rationale}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                  <Button 
                    onClick={() => handleAccept(rec.product)}
                    className="flex-1 md:w-40 rounded-full shadow-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <CheckCircle2 size={18} className="mr-2" /> {selectedAction === rec.product ? 'Continue Setup' : 'Accept'}
                  </Button>
                  <Button 
                    className="flex-1 md:w-40 rounded-full shadow-md bg-red-500 hover:bg-red-600 text-white font-bold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <XCircle size={18} className="mr-2" /> Decline
                  </Button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
