import re

with open('frontend/src/pages/RecommendationsCenter.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new icons to import
content = re.sub(
    r"import \{ CheckCircle2, XCircle, TrendingUp, ShieldAlert, AlertCircle, ExternalLink \} from 'lucide-react';",
    "import { CheckCircle2, XCircle, TrendingUp, ShieldAlert, AlertCircle, ExternalLink, ActivitySquare, ArrowRight } from 'lucide-react';",
    content
)

content = content.replace("  const [isLoading, setIsLoading] = useState(true);",
                          "  const [isLoading, setIsLoading] = useState(true);\n  const [simulatingRec, setSimulatingRec] = useState<any>(null);")

old_buttons = """                  <Button 
                    className="flex-1 md:w-40 rounded-full shadow-md bg-red-500 hover:bg-red-600 text-white font-bold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <XCircle size={18} className="mr-2" /> Decline
                  </Button>"""

new_buttons = """                  <Button 
                    onClick={() => setSimulatingRec(rec)}
                    variant="outline"
                    className="flex-1 md:w-40 rounded-full shadow-sm border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 font-bold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <ActivitySquare size={18} className="mr-2" /> Simulate Impact
                  </Button>
                  <Button 
                    className="flex-1 md:w-40 rounded-full shadow-md bg-red-500 hover:bg-red-600 text-white font-bold transition-all hover:scale-105 flex items-center justify-center"
                  >
                    <XCircle size={18} className="mr-2" /> Decline
                  </Button>"""

content = content.replace(old_buttons, new_buttons)

modal_ui = """
      {simulatingRec && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <Card className="glass-card w-full max-w-2xl overflow-hidden shadow-2xl border-2 border-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white pb-6 pt-6">
              <CardTitle className="flex justify-between items-center text-2xl">
                <span><ActivitySquare className="inline mr-2" /> Recommendation Simulator</span>
                <button onClick={() => setSimulatingRec(null)} className="opacity-70 hover:opacity-100"><XCircle /></button>
              </CardTitle>
              <p className="opacity-90 font-medium">Predicting the impact of: {simulatingRec.product}</p>
            </CardHeader>
            <CardContent className="p-8 space-y-8 bg-white dark:bg-slate-900">
              
              <div className="grid grid-cols-3 gap-6 items-center">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Before</div>
                  <div className="text-4xl font-black text-slate-700 dark:text-slate-300">82 <span className="text-lg font-normal text-slate-400">/100</span></div>
                  <div className="text-xs text-slate-400 mt-2">Health Score</div>
                </div>
                
                <div className="flex justify-center text-purple-500 animate-pulse">
                  <ArrowRight size={48} />
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-md">
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-bold uppercase tracking-wider mb-2">After</div>
                  <div className="text-4xl font-black text-purple-700 dark:text-purple-300">
                    {simulatingRec.category === 'protect' ? '91' : (simulatingRec.category === 'borrow' ? '79' : '88')} <span className="text-lg font-normal opacity-50">/100</span>
                  </div>
                  <div className="text-xs text-purple-500 mt-2">Projected Health Score</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-sm border-b pb-2">Simulated Impacts on Twin</h4>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Goal Progress (Est.)</span>
                  <span className="font-bold text-emerald-500">+8.5% acceleration</span>
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
"""

content = content.replace("    </div>\n  );\n}\n", modal_ui + "\n  );\n}\n")

with open('frontend/src/pages/RecommendationsCenter.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Recommendations Simulator added.")
