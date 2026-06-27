import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function AgentActivityCenter({ customerId, onNavigate }: { customerId: string | null, onNavigate: (page: string) => void }) {
  const [logs, setLogs] = useState<{type: string, data: any}[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!customerId) return;
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const eventSource = new EventSource(`${API_URL}/customers/${customerId}/run-agents`);
    
    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        setIsDone(true);
        eventSource.close();
        return;
      }
      
      try {
        const parsed = JSON.parse(event.data);
        setLogs(prev => [...prev, parsed]);
      } catch (e) {
        console.error("Failed to parse SSE data", event.data);
      }
    };

    eventSource.onerror = () => {
      console.error("SSE Error");
      eventSource.close();
      setIsDone(true);
    };

    return () => eventSource.close();
  }, [customerId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-center glass-panel p-6 rounded-2xl border-l-4 border-l-sbi-blue">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
            Agent Orchestration 
            {!isDone && <span className="ml-4 flex space-x-1"><span className="w-2 h-2 bg-sbi-blue rounded-full animate-ping"></span></span>}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">LangGraph sequential pipeline analyzing financial state.</p>
        </div>
        <Button 
          onClick={() => onNavigate('chat')} 
          disabled={!isDone} 
          className="rounded-full px-8 shadow-lg bg-gradient-to-r from-sbi-blue to-cyan-500 text-white font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          {isDone ? 'Proceed to Chat 💬' : 'Processing...'}
        </Button>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
        {logs.map((log, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-br from-cyan-400 to-sbi-blue text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="font-bold">{idx + 1}</span>
            </div>
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-card border-0 shadow-md p-5 transition-transform group-hover:-translate-y-1">
              <div className="text-xs uppercase tracking-widest font-black text-cyan-600 dark:text-cyan-400 mb-2">{log.type.replace('_', ' ')}</div>
              <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-lg overflow-x-auto text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
