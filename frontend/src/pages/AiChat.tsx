import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../components/ui/Button';
import { Mic, Paperclip, Copy, Edit2, Check, RotateCcw, Square } from 'lucide-react';

export default function AiChat({ customerId }: { customerId: string | null }) {
  const [messages, setMessages] = useState<{role: string, content: string, reasoning?: string[]}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [intent, setIntent] = useState('Advice');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!customerId) return;
    
    setIsFetchingHistory(true);
    
    const pendingMsg = localStorage.getItem(`pending_chat_message_${customerId}`);
    if (pendingMsg) {
      setMessages([{ role: 'assistant', content: pendingMsg }]);
      localStorage.removeItem(`pending_chat_message_${customerId}`);
    } else {
      setMessages([{ role: 'assistant', content: 'Hello! How can I help you today? I have access to your full financial graph.' }]);
    }
    
    setIsFetchingHistory(false);
  }, [customerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !customerId) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    sendMessage(userMsg);
  };

  const sendMessage = async (userMsg: string) => {
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/customers/${customerId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, intent: intent }),
        signal: abortControllerRef.current.signal
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
      if (err.name === 'AbortError') {
        return;
      }
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleReload = (index: number) => {
    if (index > 0 && messages[index - 1].role === 'user') {
      const userMsg = messages[index - 1].content;
      setMessages(prev => prev.slice(0, index));
      sendMessage(userMsg);
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
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev ? prev + " " + finalTranscript : finalTranscript);
      }
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

  const editMessage = (text: string, index: number) => {
    setInput(text);
    setMessages(prev => prev.slice(0, index));
  };

  return (
    <div className="w-full h-full flex flex-col flex-1 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 md:px-8 flex flex-row items-center justify-between shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sbi-blue to-cyan-500 flex items-center justify-center text-white shadow-md">
              <span className="font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Financial Assistant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Grounded dynamically in your personal Financial Graph</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Conversation Intent</div>
          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-700">
            {['Advice', 'Planning', 'Comparison', 'Execution'].map(mode => (
              <button 
                key={mode} 
                onClick={() => setIntent(mode)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${intent === mode ? 'bg-sbi-blue text-white shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center relative">
          <div className="w-full max-w-5xl space-y-8 pb-12">
          {isFetchingHistory ? (
            <div className="flex items-center justify-center h-full text-slate-500">Loading history...</div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 w-full`}>
                <div className={`max-w-3xl rounded-2xl p-4 shadow-sm backdrop-blur-sm prose prose-sm dark:prose-invert ${m.role === 'user' ? 'bg-gradient-to-r from-sbi-blue to-cyan-500 text-white rounded-tr-sm prose-p:text-white prose-strong:text-white' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-md'}`}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                
                {/* Action Buttons Below Bubble */}
                <div className={`flex mt-2 space-x-1 ${m.role === 'user' ? 'justify-end' : 'justify-start'} w-full max-w-3xl`}>
                  {m.role === 'assistant' && (
                    <>
                      <button onClick={() => copyToClipboard(m.content, i)} className="flex items-center space-x-1 px-2 py-1 text-xs text-slate-500 hover:text-sbi-blue rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" title="Copy response">
                        {copiedIndex === i ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        <span>Copy</span>
                      </button>
                      <button onClick={() => handleReload(i)} className="flex items-center space-x-1 px-2 py-1 text-xs text-slate-500 hover:text-sbi-blue rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" title="Reload response">
                        <RotateCcw size={12} />
                        <span>Reload</span>
                      </button>
                    </>
                  )}
                  {m.role === 'user' && (
                    <button onClick={() => editMessage(m.content, i)} className="flex items-center space-x-1 px-2 py-1 text-xs text-slate-500 hover:text-sbi-blue rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" title="Edit message">
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
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
          </div>
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 md:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 flex justify-center">
          <div className="w-full max-w-5xl flex space-x-2 items-end relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".txt,.csv,.json,.md" 
            />
            <div className="flex-1 relative flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-inner overflow-hidden transition-all focus-within:ring-2 focus-within:ring-sbi-blue focus-within:border-transparent">
              <button onClick={() => fileInputRef.current?.click()} className="absolute left-2 w-10 h-10 rounded-full bg-sbi-blue flex items-center justify-center text-white hover:bg-sbi-navy transition-colors shrink-0 z-10" title="Attach file">
                <Paperclip size={18} strokeWidth={2} />
              </button>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading && !isFetchingHistory) {
                      handleSend();
                    }
                  }
                }}
                disabled={isLoading || isFetchingHistory}
                className="w-full bg-transparent dark:text-white pl-14 pr-14 py-4 focus:outline-none disabled:opacity-50 resize-none overflow-y-auto"
                placeholder="Ask about your financial plan..."
                rows={1}
                style={{ minHeight: '56px', maxHeight: '200px' }}
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
              onClick={isLoading ? handleStop : handleSend} 
              disabled={isFetchingHistory} 
              className={`rounded-full px-6 md:px-8 py-6 shadow-lg transition-all duration-300 font-bold text-white shrink-0 ${isLoading ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gradient-to-r from-sbi-blue to-cyan-500 hover:from-sbi-navy hover:to-sbi-blue transform hover:scale-105'}`}
            >
              {isLoading ? <Square fill="currentColor" size={16} /> : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
