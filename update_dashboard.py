import re

with open('frontend/src/pages/CustomerDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new icons to import
content = re.sub(
    r"import \{ HeartPulse, Target, Wallet, Activity, CalendarClock, CreditCard \} from 'lucide-react';",
    "import { HeartPulse, Target, Wallet, Activity, CalendarClock, CreditCard, Sparkles, Send, ArrowRight } from 'lucide-react';",
    content
)

# Add states for scenario planner
content = content.replace("  const [metrics, setMetrics] = useState<any>(null);",
                          "  const [metrics, setMetrics] = useState<any>(null);\n  const [scenarioInput, setScenarioInput] = useState('');\n  const [isSimulating, setIsSimulating] = useState(false);\n  const [scenarioResult, setScenarioResult] = useState<any>(null);")

# Add the simulate function
simulate_func = """
  const handleSimulateScenario = async () => {
    if (!scenarioInput.trim() || !id) return;
    setIsSimulating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/personas/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: id, scenario: scenarioInput })
      });
      if (res.ok) {
        const data = await res.json();
        const origMetrics = calculateMetrics(data.original);
        const simMetrics = calculateMetrics(data.simulated);
        setScenarioResult({ original: origMetrics, simulated: simMetrics, profile: data.simulated });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };
"""

content = content.replace("  const hasRunAnalysis = localStorage.getItem(`analysis_run_${id}`);", simulate_func + "\n  const hasRunAnalysis = localStorage.getItem(`analysis_run_${id}`);")

# Add Scenario Planner UI at the bottom
scenario_ui = """
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
"""

content = content.replace("        </Card>\n      </div>\n    </div>\n  );\n}", "        </Card>\n" + scenario_ui + "\n      </div>\n    </div>\n  );\n}")

with open('frontend/src/pages/CustomerDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
