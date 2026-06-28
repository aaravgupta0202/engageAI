import { useEffect, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, Bot, User as UserIcon } from 'lucide-react';

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = () => {
    setShowChat(true);
    setMessages([{ role: 'ai', content: "Welcome to SBI EngageAI. I'll help you set up your Digital Financial Twin. To start, what is your primary occupation?" }]);
    setInputValue('');
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
        <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden flex flex-col" style={{ height: '500px' }}>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
              <Bot className="w-5 h-5 mr-2 text-sbi-blue" /> SBI Copilot Onboarding
            </h3>
            <Button variant="ghost" onClick={() => setShowChat(false)} className="text-slate-500">Cancel</Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-sbi-blue text-white' : 'bg-emerald-500 text-white'}`}>
                    {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-sbi-blue text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm shadow-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2 relative">
              <input 
                type="text" 
                autoFocus
                disabled={isGenerating}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-sbi-blue outline-none"
                placeholder="Type your answer... (or 'Unknown')" 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isGenerating}
                className="rounded-full w-12 h-12 p-0 bg-sbi-blue hover:bg-sbi-navy text-white shrink-0 flex items-center justify-center shadow-md transition-transform hover:scale-105"
              >
                <Send size={18} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
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
