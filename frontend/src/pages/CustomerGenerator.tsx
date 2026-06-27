import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const MOCK_PERSONAS = [
  { id: 'mock-1', archetype: 'NRI Wealth Investor', profile: { age: 45, income: 2500000, goals: ['Retirement', 'Wealth Management'] } },
  { id: 'mock-2', archetype: 'Tech Entrepreneur', profile: { age: 28, income: 1500000, goals: ['Business Expansion', 'Tax Planning'] } },
  { id: 'mock-3', archetype: 'Rural Farmer', profile: { age: 50, income: 300000, goals: ['Savings Account', 'Crop Insurance'] } }
];

const TEMPLATES = ['A 45yo NRI investor', 'A young tech entrepreneur', 'A rural farmer'];

export default function CustomerGenerator({ onNavigate }: { onNavigate: (page: string, id: string) => void }) {
  const [personas, setPersonas] = useState<any[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiFailed, setApiFailed] = useState(false);

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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/personas/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to generate persona');
      }
      const newPersona = await res.json();
      setPersonas(prev => [newPersona, ...prev.filter(p => !p.id.toString().startsWith('mock'))]);
      setPrompt('');
      setApiFailed(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row md:justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-400 opacity-10 rounded-full blur-3xl"></div>
        <div className="mb-6 md:mb-0 relative z-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Select a Persona</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg">Choose a synthetic customer or generate a brand new one instantly using Cerebras LLM.</p>
        </div>
        <div className="w-full md:w-auto flex flex-col relative z-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="e.g. A 45yo NRI investor..." 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={isGenerating}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              className="w-full sm:w-80 glass-panel bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()} 
              className="rounded-full px-8 py-3 shadow-lg bg-gradient-to-r from-sbi-blue to-cyan-500 hover:from-sbi-navy hover:to-sbi-blue transition-all duration-300 disabled:opacity-50 text-white font-bold whitespace-nowrap"
            >
              {isGenerating ? (
                <span className="flex items-center"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Generating...</span>
              ) : 'Generate AI Persona'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 pl-2">
            <span className="text-xs text-slate-500 py-1">Quick start:</span>
            {TEMPLATES.map(t => (
              <button 
                key={t} 
                onClick={() => setPrompt(t)}
                className="text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50/80 backdrop-blur-md dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-2xl border border-red-200 dark:border-red-800 shadow-sm flex items-center justify-between animate-in zoom-in-95">
          <div><strong className="font-bold">Error:</strong> {error}</div>
          {apiFailed && (
            <Button onClick={fetchPersonas} variant="outline" className="text-red-600 border-red-200 hover:bg-red-100">
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
