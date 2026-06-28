import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const renderParsedData = (data: any) => {
  if (typeof data !== 'object' || data === null) {
    return <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{String(data)}</p>;
  }

  return (
    <div className="space-y-3 mt-3">
      {Object.entries(data).map(([key, value], idx) => (
        <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">{key.replace(/_/g, ' ')}</div>
          {Array.isArray(value) ? (
            <ul className="space-y-2">
              {value.length === 0 && <li className="text-sm text-slate-400 italic font-medium px-1">None available</li>}
              {value.map((v, i) => (
                <li key={i} className="text-sm flex items-start">
                  <span className="text-sbi-blue dark:text-cyan-500 mr-2 mt-0.5 font-bold">•</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {typeof v === 'object' ? (
                      v.event_type ? `${v.event_type} (Conf: ${(v.confidence * 100).toFixed(0)}%) - ${v.reasoning}` :
                      v.step_number ? `Step ${v.step_number}: ${v.description} [${v.status || 'pending'}]` :
                      v.product ? `${v.product} (Fit: ${v.fit_score}) - ${v.rationale}` :
                      v.due_at ? `${v.reason} - Due: ${v.due_at} [${v.status}]` :
                      <span className="flex flex-wrap gap-2">
                        {Object.entries(v).map(([k, val]) => (
                          <span key={k} className="mr-2 px-2 py-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 text-xs">
                            <strong className="text-slate-500">{k.replace(/_/g, ' ')}:</strong> {String(val)}
                          </span>
                        ))}
                      </span>
                    ) : String(v)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {typeof value === 'object' && value !== null ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.keys(value).length === 0 && <span className="text-sm text-slate-400 italic font-medium px-1">None available</span>}
                  {Object.entries(value).map(([k, val]) => (
                    <span key={k} className="mr-2 px-2 py-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 text-xs">
                      <strong className="text-slate-500">{k.replace(/_/g, ' ')}:</strong> {String(val)}
                    </span>
                  ))}
                </div>
              ) : String(value)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function AgentActivityCenter({ customerId, onNavigate }: { customerId: string | null, onNavigate: (page: string) => void }) {
  const [logs, setLogs] = useState<any[]>(() => {
    if (!customerId) return [];
    const saved = localStorage.getItem(`agent_logs_${customerId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [isDone, setIsDone] = useState(() => {
    if (!customerId) return false;
    return localStorage.getItem(`analysis_run_${customerId}`) === 'true';
  });

  useEffect(() => {
    if (!customerId || isDone) return;
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const eventSource = new EventSource(`${API_URL}/customers/${customerId}/run-agents`);
    
    eventSource.onmessage = (event) => {
      if (event.data.includes('Workflow Complete')) {
        setIsDone(true);
        localStorage.setItem(`analysis_run_${customerId}`, 'true');
        eventSource.close();
        return;
      }
      
      try {
        const parsed = JSON.parse(event.data);
        setLogs(prev => {
          const newLogs = [...prev, parsed];
          localStorage.setItem(`agent_logs_${customerId}`, JSON.stringify(newLogs));
          return newLogs;
        });
        if (parsed.agent === 'opportunity_discovery' && parsed.state_summary?.opportunities) {
          localStorage.setItem(`opportunities_${customerId}`, JSON.stringify(parsed.state_summary.opportunities));
        }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl border-l-4 border-l-sbi-blue">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
            Agent Orchestration 
            {!isDone && <span className="ml-4 flex space-x-1"><span className="w-2 h-2 bg-sbi-blue rounded-full animate-ping"></span></span>}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">LangGraph sequential pipeline analyzing financial state.</p>
        </div>
        <Button 
          onClick={() => onNavigate('recommendations')} 
          disabled={!isDone} 
          className="w-full md:w-auto shrink-0 whitespace-nowrap rounded-full px-8 shadow-lg bg-gradient-to-r from-sbi-blue to-cyan-500 text-white font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          {isDone ? 'View Recommendations ➔' : 'Processing...'}
        </Button>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
        {logs.map((log, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-br from-cyan-400 to-sbi-blue text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="font-bold">{idx + 1}</span>
            </div>
            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-card border-0 shadow-md p-5 transition-transform group-hover:-translate-y-1">
              <div className="text-xs uppercase tracking-widest font-black text-cyan-600 dark:text-cyan-400 mb-2">{(log.agent || log.type || 'system').replace(/_/g, ' ')}</div>
              {renderParsedData(log.state_summary || log.data || log)}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
