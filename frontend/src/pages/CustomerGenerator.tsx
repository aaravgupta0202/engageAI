import { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bot, Mic } from 'lucide-react';

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
  
  // Chat Wizard State
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai'|'user', content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = () => {
    setShowChat(true);
    setMessages([{ role: 'ai', content: "Welcome to SBI EngageAI. I'll help you set up your Digital Financial Twin. To start, what is your primary occupation?" }]);
    setInputValue('');
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
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputValue(prev => prev ? prev + " " + finalTranscript : finalTranscript);
      }
    };
    recognition.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;
    
    const userMessage = inputValue;
    setInputValue('');
    
    const newMessages: {role: 'ai'|'user', content: string}[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsGenerating(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/personas/onboarding-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      if (data.status === 'asking') {
        setMessages(prev => [...prev, { role: 'ai', content: data.question }]);
        setIsGenerating(false);
      } else if (data.status === 'complete' || data.id) {
        setMessages(prev => [...prev, { role: 'ai', content: "Thank you. I am now synthesizing your Digital Financial Twin... Please wait." }]);
        setTimeout(() => {
            onNavigate('dashboard', data.id || data.persona_id);
            setIsGenerating(false);
        }, 1500);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "I encountered an error. Please try again." }]);
        setIsGenerating(false);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI. Please try again later." }]);
      setIsGenerating(false);
    }
  };

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



  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      {!showChat ? (
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row md:justify-between items-start md:items-center relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-400 opacity-10 rounded-full blur-3xl"></div>
          <div className="mb-6 md:mb-0 relative z-10">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Select a Persona</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg">Choose a synthetic customer or generate a custom profile manually.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col relative z-10">
            <Button 
              onClick={startChat} 
              className="rounded-full px-8 py-3 shadow-lg bg-gradient-to-r from-sbi-blue to-cyan-500 hover:from-sbi-navy hover:to-sbi-blue transition-all duration-300 text-white font-bold whitespace-nowrap"
            >
              Create My Financial Profile
            </Button>
          </div>
        </div>
      ) : (
        <>
          <style>{`
            body { overflow: hidden; }
          `}</style>
          <div className="fixed inset-0 z-40 bg-slate-50 dark:bg-slate-900 pt-[65px] md:pt-[81px] flex flex-col animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 border-0 overflow-hidden">
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 md:px-8 flex flex-row items-center justify-between shadow-sm z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sbi-blue to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">SBI Copilot Onboarding</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Setting up your Digital Financial Twin</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowChat(false)} className="!bg-transparent hover:!bg-slate-100 !text-slate-500 hover:!text-slate-700 border border-transparent hover:border-slate-200">Cancel</Button>
            </div>
            
            <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center">
              <div className="w-full max-w-4xl space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-xl rounded-2xl p-4 shadow-sm backdrop-blur-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-sbi-blue to-cyan-500 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-md'}`}>
                    {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-4 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 flex justify-center">
              <div className="w-full max-w-4xl flex space-x-2 items-center relative">
                <div className="flex-1 relative flex items-center">
                  <input 
                    type="text" 
                    autoFocus
                    disabled={isGenerating}
                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-sbi-blue focus:border-transparent transition-all shadow-inner disabled:opacity-50"
                    placeholder="Type your answer... (or 'Unknown')" 
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleMicClick}
                    className={`absolute right-3 p-2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-sbi-blue'}`}
                    title="Speech to Text"
                  >
                    <Mic size={20} />
                  </button>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputValue.trim() || isGenerating}
                  className="rounded-full px-6 md:px-8 py-6 shadow-lg transition-all duration-300 font-bold text-white shrink-0 bg-gradient-to-r from-sbi-blue to-cyan-500 hover:from-sbi-navy hover:to-sbi-blue transform hover:scale-105"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
      
      {error && !showChat && (
        <div className="bg-red-50/80 backdrop-blur-md dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-2xl border border-red-200 dark:border-red-800 shadow-sm flex items-center justify-between animate-in zoom-in-95">
          <div><strong className="font-bold">Error:</strong> {error}</div>
          {apiFailed && (
            <Button onClick={fetchPersonas} className="bg-red-600 text-white hover:bg-red-700 border-none shadow-md">
              Retry Connection
            </Button>
          )}
        </div>
      )}

      {!showChat && (
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
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 font-medium">Age: <span className="text-slate-800 dark:text-slate-200">{p.profile?.age || 'N/A'}</span> <span className="mx-2 text-slate-300">•</span> Income: <span className="text-slate-800 dark:text-slate-200">₹{Number(p.profile?.income || 0).toLocaleString()}</span></p>
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
      )}
    </div>
  );
}
