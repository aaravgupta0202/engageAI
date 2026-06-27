import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function CustomerDashboard({ customerId, onNavigate }: { customerId: string | null, onNavigate: (page: string) => void }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!customerId) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/customers/${customerId}/graph`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, [customerId]);

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-sbi-blue rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium animate-pulse">Loading Financial Graph...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-center glass-panel p-6 rounded-2xl">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Financial Life Graph</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{data.profile.archetype} • ID: <span className="font-mono text-xs text-slate-400">{customerId?.substring(0, 8)}...</span></p>
        </div>
        <Button onClick={() => onNavigate('agent')} className="rounded-full px-8 shadow-lg bg-gradient-to-r from-cyan-500 to-sbi-blue hover:from-cyan-400 hover:to-sbi-blue text-white font-bold transition-all hover:scale-105">
          Run Analysis Agents ⚡
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 glass-card border-t-4 border-t-cyan-400">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center"><span className="text-2xl mr-2">👤</span> Identity & Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2"><span className="text-slate-400">Age</span> <span className="font-bold text-slate-800 dark:text-white">{data.profile?.profile?.age || 'N/A'}</span></div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2"><span className="text-slate-400">Income</span> <span className="font-bold text-green-600 dark:text-green-400">₹{Number(data.profile?.profile?.income || 0).toLocaleString()}</span></div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2"><span className="text-slate-400">Occupation</span> <span className="font-medium text-slate-800 dark:text-white">{data.profile?.profile?.occupation || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Location</span> <span className="font-medium text-slate-800 dark:text-white">{data.profile?.profile?.location || 'N/A'}</span></div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 glass-card border-t-4 border-t-indigo-500">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center"><span className="text-2xl mr-2">🎯</span> Life Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {(data.profile?.profile?.goals || []).map((g: string, i: number) => (
                <div key={i} className="px-5 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-800/50 font-medium shadow-sm flex items-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span> {g}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass-card border-t-4 border-t-emerald-400 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-400 opacity-5 rounded-full blur-3xl"></div>
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center"><span className="text-2xl mr-2">📊</span> Embedded Life Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {Object.entries(data.profile.embedded_events || {}).map(([key, val]) => (
                <div key={key} className={`p-4 rounded-xl border ${val ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                  <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">{key.replace('_', ' ')}</div>
                  <div className="text-lg font-black">{val ? 'DETECTED' : 'None'}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass-card border-t-4 border-t-purple-500 overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-white flex items-center"><span className="text-2xl mr-2">📅</span> Customer Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 pl-6 space-y-6">
              <div className="relative">
                <div className="absolute -left-[33px] bg-green-500 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                <p className="text-sm text-slate-500 mb-1">Today</p>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Salary Credit</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Regular salary credited (₹{Number(data.profile?.profile?.income || 0).toLocaleString()})</p>
              </div>
              {Object.entries(data.profile.embedded_events || {}).filter(([_, val]) => val).map(([key, _]) => (
                <div key={key} className="relative">
                  <div className="absolute -left-[33px] bg-emerald-500 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                  <p className="text-sm text-slate-500 mb-1">Recent Event</p>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Detected: {key.replace('_', ' ').toUpperCase()} <span className="text-xs ml-2 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Confidence: 91%</span></h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">AI identified this life event from transaction patterns.</p>
                </div>
              ))}
              <div className="relative opacity-60">
                <div className="absolute -left-[33px] bg-slate-300 rounded-full w-4 h-4 border-4 border-white dark:border-slate-900"></div>
                <p className="text-sm text-slate-500 mb-1">Upcoming</p>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">AI Recommendations Pending</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Run the Engagement Cycle to generate proactive actions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
