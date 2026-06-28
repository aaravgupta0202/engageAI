import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const MOCK_PERSONAS = [
  { id: 'mock-1', archetype: 'NRI Wealth Investor', profile: { age: 45, income: 2500000, goals: ['Retirement', 'Wealth Management'] } },
  { id: 'mock-2', archetype: 'Tech Entrepreneur', profile: { age: 28, income: 1500000, goals: ['Business Expansion', 'Tax Planning'] } },
  { id: 'mock-3', archetype: 'Rural Farmer', profile: { age: 50, income: 300000, goals: ['Savings Account', 'Crop Insurance'] } }
];

export default function CustomerGenerator({ onNavigate }: { onNavigate: (page: string, id: string) => void }) {
  const [personas, setPersonas] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiFailed, setApiFailed] = useState(false);
  
  // Custom Persona Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [customData, setCustomData] = useState({
    occupation: '',
    income: '',
    assets: '',
    city: '',
    expenses: '',
    demographics: '',
    notes: ''
  });

  const fetchPersonas = () => {
    setIsLoading(true);
    setError(null);
    setApiFailed(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/personas`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setPersonas(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to connect to the server. Loading mock data instead.');
        setPersonas(MOCK_PERSONAS);
        setApiFailed(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const handleGenerateCustom = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/personas/generate_custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to generate persona');
      }
      const newPersona = await res.json();
      setPersonas(prev => [newPersona, ...prev.filter(p => !p.id.toString().startsWith('mock'))]);
      setShowWizard(false);
      setCustomData({ occupation: '', income: '', assets: '', city: '', expenses: '', demographics: '', notes: '' });
      setStep(1);
      setApiFailed(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderWizardStep = () => {
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    
    return (
      <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden animate-in fade-in duration-300">
        <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Create Custom Persona - Step {step} of 6</h3>
        
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">What is their occupation? (e.g. "Business owner and real estate investor")</label>
            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 mb-4" value={customData.occupation} onChange={e => setCustomData({...customData, occupation: e.target.value})} placeholder="Primary and secondary income sources..." />
          </div>
        )}
        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Yearly Income & Assets?</label>
            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 mb-4" value={customData.income} onChange={e => setCustomData({...customData, income: e.target.value})} placeholder="Income (e.g. ₹25,00,000)..." />
            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 mb-4" value={customData.assets} onChange={e => setCustomData({...customData, assets: e.target.value})} placeholder="Assets (e.g. 2 cars, 1 flat)..." />
          </div>
        )}
        {step === 3 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Which city do they live in? (Used to calculate cost of living)</label>
            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 mb-4" value={customData.city} onChange={e => setCustomData({...customData, city: e.target.value})} placeholder="e.g. Mumbai, Pune..." />
          </div>
        )}
        {step === 4 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Base Expenses? (Leave blank to let AI infer based on city)</label>
            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 mb-4" value={customData.expenses} onChange={e => setCustomData({...customData, expenses: e.target.value})} placeholder="e.g. ₹40,000/month rent..." />
          </div>
        )}
        {step === 5 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Demographics (Age, Family, Dependents)</label>
            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 mb-4" value={customData.demographics} onChange={e => setCustomData({...customData, demographics: e.target.value})} placeholder="e.g. 35yo, married, supporting parents..." />
          </div>
        )}
        {step === 6 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Any additional notes or specific goals?</label>
            <textarea className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 mb-4 h-32" value={customData.notes} onChange={e => setCustomData({...customData, notes: e.target.value})} placeholder="e.g. Wants to buy a house in 2 years..." />
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={step === 1 ? () => setShowWizard(false) : prevStep}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          {step < 6 ? (
            <Button onClick={nextStep} className="bg-sbi-blue text-white">Next</Button>
          ) : (
            <Button onClick={handleGenerateCustom} disabled={isGenerating} className="bg-emerald-500 text-white font-bold">
              {isGenerating ? 'Synthesizing Data...' : 'Generate Graph'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!showWizard ? (
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row md:justify-between items-start md:items-center relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-400 opacity-10 rounded-full blur-3xl"></div>
          <div className="mb-6 md:mb-0 relative z-10">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Select a Persona</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg">Choose a synthetic customer or generate a custom profile manually.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col relative z-10">
            <Button 
              onClick={() => setShowWizard(true)} 
              className="rounded-full px-8 py-3 shadow-lg bg-gradient-to-r from-sbi-blue to-cyan-500 hover:from-sbi-navy hover:to-sbi-blue transition-all duration-300 text-white font-bold whitespace-nowrap"
            >
              Build Custom Persona
            </Button>
          </div>
        </div>
      ) : (
        renderWizardStep()
      )}
      
      {error && (
        <div className="bg-red-50/80 backdrop-blur-md dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-2xl border border-red-200 dark:border-red-800 shadow-sm flex items-center justify-between animate-in zoom-in-95">
          <div><strong className="font-bold">Error:</strong> {error}</div>
          {apiFailed && (
            <Button onClick={fetchPersonas} className="bg-red-600 text-white hover:bg-red-700 border-none shadow-md">
              Retry Connection
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-sbi-blue rounded-full animate-spin mb-4"></div>
            Loading personas...
          </div>
        ) : personas.map((p, i) => (
          <Card key={p.id} className="cursor-pointer glass-card group overflow-hidden" onClick={() => onNavigate('dashboard', p.id)} style={{ animationDelay: `${i * 50}ms` }}>
            <div className="h-2 w-full bg-gradient-to-r from-sbi-blue to-cyan-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-sbi-blue transition-colors">{p.archetype}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 font-medium">Age: <span className="text-slate-800 dark:text-slate-200">{p.profile?.age || 'N/A'}</span> <span className="mx-2 text-slate-300">•</span> Income: <span className="text-slate-800 dark:text-slate-200">₹{p.profile?.income || '0'}</span></p>
              <div className="flex flex-wrap gap-2">
                {p.profile?.goals?.map((g: string) => (
                  <span key={g} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-medium text-xs rounded-full border border-slate-200/50 dark:border-slate-700/50">{g}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && personas.length === 0 && (
           <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
             No personas found. Generate one to get started.
           </div>
        )}
      </div>
    </div>
  );
}
