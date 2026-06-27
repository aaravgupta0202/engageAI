import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mic, Paperclip, Copy, Edit2, Check } from 'lucide-react';

export default function AiChat({ customerId }: { customerId: string | null }) {
  const [messages, setMessages] = useState<{role: string, content: string, reasoning?: string[]}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!customerId) return;
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/customers/${customerId}/chat`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setMessages(data);
        } else {
          setMessages([{ role: 'assistant', content: 'Hello! How can I help you today? I have access to your full financial graph.' }]);
        }
      })
      .catch(console.error)
      .finally(() => setIsFetchingHistory(false));
  }, [customerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !customerId) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/customers/${customerId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      if (!res.ok) {
         let errorMessage = `Server responded with ${res.status}`;
         try {
           const errorData = await res.json();
           errorMessage = errorData.detail || errorMessage;
         } catch(e) { }
         throw new Error(errorMessage);
      }
      
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || "No response received.", 
        reasoning: data.reasoning 
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? prev + " " + transcript : transcript);
    };
    recognition.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Strict 500KB limit
    if (file.size > 500 * 1024) {
      alert("File exceeds 500KB size limit to protect API quotas. Please upload a smaller text document.");
      if(fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setInput(prev => prev + `\n\n[Attached File Content from ${file.name}]:\n${text}`);
      }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const editMessage = (text: string) => {
    setInput(text);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh] animate-in slide-in-from-bottom-4 duration-500">
      <Card className="flex-1 flex flex-col glass-card border-0 overflow-hidden shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-sbi-navy to-indigo-900 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sbi-blue opacity-20 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse"></div>
          <CardTitle className="text-2xl font-bold flex items-center relative z-10">
            <img src="/favicon.png" alt="engageAI Logo" className="h-14 w-auto object-contain -my-2 scale-125" />
          </CardTitle>
          <p className="text-sm text-indigo-200 mt-2 relative z-10">Grounded dynamically in your personal Financial Graph</p>
        </CardHeader>
        
        <CardContent className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
          {isFetchingHistory ? (
            <div className="flex items-center justify-center h-full text-slate-500">Loading history...</div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className="flex items-center space-x-2 group/message">
                  {m.role === 'assistant' && (
                    <div className="opacity-0 group-hover/message:opacity-100 transition-opacity">
                      <button onClick={() => copyToClipboard(m.content, i)} className="p-1.5 text-slate-400 hover:text-sbi-blue rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" title="Copy response">
                        {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                  
                  <div className={`max-w-xl rounded-2xl p-4 shadow-sm backdrop-blur-sm ${m.role === 'user' ? 'bg-gradient-to-r from-sbi-blue to-cyan-500 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-md'}`}>
                    {m.content.split('\n').map((line, lIdx) => (
                      <span key={lIdx}>{line}<br/></span>
                    ))}
                  </div>

                  {m.role === 'user' && (
                    <div className="opacity-0 group-hover/message:opacity-100 transition-opacity">
                      <button onClick={() => editMessage(m.content)} className="p-1.5 text-slate-400 hover:text-sbi-blue rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit message">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                {m.reasoning && m.reasoning.length > 0 && (
                  <div className="mt-3 ml-4 max-w-[75%] opacity-90 transition-opacity hover:opacity-100">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center">
                      <svg className="w-3.5 h-3.5 text-cyan-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      Agent Reasoning
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 bg-slate-100/80 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                      {m.reasoning.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-start">
                          <div className="min-w-1.5 min-h-1.5 bg-cyan-400 rounded-full mt-1.5 mr-2"></div>
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm flex space-x-2 items-center">
                <div className="w-2 h-2 bg-sbi-blue rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 flex space-x-2 items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".txt,.csv,.json,.md" 
          />
          <Button variant="ghost" onClick={() => fileInputRef.current?.click()} className="rounded-full w-12 h-12 p-0 text-slate-400 hover:text-sbi-blue hover:bg-sbi-blue/10 shrink-0">
            <Paperclip size={20} />
          </Button>
          <div className="flex-1 relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading || isFetchingHistory}
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-sbi-blue focus:border-transparent transition-all shadow-inner disabled:opacity-50"
              placeholder="Ask about your financial plan..."
            />
            <button 
              onClick={handleMicClick}
              className={`absolute right-3 p-2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-sbi-blue'}`}
              title="Speech to Text"
            >
              <Mic size={20} />
            </button>
          </div>
          <Button onClick={handleSend} disabled={isLoading || isFetchingHistory} className="rounded-full px-6 md:px-8 py-6 shadow-lg bg-gradient-to-r from-sbi-blue to-cyan-500 hover:from-sbi-navy hover:to-sbi-blue transition-all duration-300 transform hover:scale-105 font-bold text-white shrink-0">
            {isLoading ? '...' : 'Send'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
