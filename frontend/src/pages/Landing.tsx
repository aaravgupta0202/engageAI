
import { Button } from '../components/ui/Button';
import { Search, Brain, Send, ChevronDown, Bot, Zap, Activity, Clock, ShieldCheck, Database, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Landing Page Component
 * Serves as the primary entry point for the engageAI demo.
 * Renders the hero section and the "How it works" explainer.
 */
export default function Landing({ onNavigate }: { onNavigate: (page: string) => void }) {
  const scrollToExplainer = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen text-center animate-in fade-in zoom-in-95 duration-700 overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-[90vh] w-full px-4 pt-20">
        
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400 opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sbi-blue opacity-10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="mb-8 relative group cursor-pointer z-10">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-sbi-blue to-indigo-500 rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl border border-slate-100 dark:border-slate-800 transform group-hover:scale-105 transition-transform duration-500">
            <span className="text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-sbi-navy to-cyan-500">S</span>
          </div>
        </div>
        
        <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/50 rounded-full px-4 py-1.5 mb-8 border border-slate-200 dark:border-slate-700 shadow-sm z-10">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Hackathon MVP Live</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-6 z-10 px-4">
          Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-sbi-blue via-indigo-500 to-cyan-500">engageAI</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed z-10 px-4 font-medium">
          An autonomous, multi-agent AI copilot that acts as a proactive, hyper-personalized relationship manager. Built exclusively for the SBI Agentic AI Hackathon.
        </p>

        {/* Detect -> Reason -> Engage Loop */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8 mb-16 z-10 w-full max-w-2xl px-4">
          <div className="flex items-center w-full sm:w-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex-1 justify-center">
            <Search className="text-sbi-blue w-6 h-6 mr-3 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base">1. Detect</span>
          </div>
          <div className="hidden sm:block text-slate-300 dark:text-slate-600 shrink-0"><ArrowRight /></div>
          <div className="flex items-center w-full sm:w-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex-1 justify-center">
            <Brain className="text-indigo-500 w-6 h-6 mr-3 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base">2. Reason</span>
          </div>
          <div className="hidden sm:block text-slate-300 dark:text-slate-600 shrink-0"><ArrowRight /></div>
          <div className="flex items-center w-full sm:w-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex-1 justify-center">
            <Send className="text-cyan-500 w-6 h-6 mr-3 shrink-0" />
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base">3. Engage</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto px-4 z-10">
          <Button 
            onClick={() => onNavigate('generator')} 
            className="w-full sm:w-auto px-10 py-7 text-lg rounded-full shadow-xl shadow-sbi-blue/20 bg-gradient-to-r from-sbi-blue to-cyan-500 hover:from-sbi-navy hover:to-sbi-blue transform hover:-translate-y-1 transition-all duration-300 text-white font-bold"
          >
            Launch the Demo
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://github.com/aaravgupta0202/engageAI', '_blank')}
            className="w-full sm:w-auto px-10 py-7 text-lg rounded-full border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 font-semibold"
          >
            View Source Code
          </Button>
        </div>

        <div className="absolute bottom-10 animate-bounce cursor-pointer text-slate-400 hover:text-sbi-blue transition-colors z-10 hidden md:block" onClick={scrollToExplainer}>
          <p className="text-sm font-bold uppercase tracking-widest mb-2">Explore the Platform</p>
          <ChevronDown className="w-8 h-8 mx-auto" />
        </div>
      </div>

      {/* Agentic AI Explanation */}
      <div className="w-full bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-left relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black tracking-widest text-sbi-blue uppercase mb-3">The Paradigm Shift</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Why Agentic AI?</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
            {/* Chatbot Card */}
            <div className="glass-card p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 shadow-sm relative group h-full">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mb-8">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Traditional Chatbots</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-8 leading-relaxed text-lg">
                Reactive systems that sit passively in a menu, waiting for the customer to already know what financial product they need.
              </p>
              
              <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-3 text-slate-500 font-mono text-sm overflow-x-auto pb-2">
                  <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm whitespace-nowrap">1. Ask</span>
                  <span className="text-slate-300 dark:text-slate-600 shrink-0">→</span>
                  <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm whitespace-nowrap">2. Answer</span>
                </div>
              </div>
            </div>
            
            {/* EngageAI Card */}
            <div className="glass-card p-8 md:p-10 rounded-3xl border-2 border-sbi-blue/30 bg-blue-50/50 dark:bg-sbi-blue/5 shadow-xl shadow-sbi-blue/10 relative overflow-hidden h-full transform lg:-translate-y-4">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-400 opacity-20 rounded-full blur-[80px]"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-sbi-blue to-cyan-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-sbi-navy dark:text-cyan-400 mb-4">engageAI</h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-8 leading-relaxed text-lg">
                A proactive, autonomous system that monitors behavior, anticipates life events, and acts before the customer has to ask.
              </p>
              
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-sbi-blue/20 shadow-inner">
                <div className="flex flex-wrap gap-2 text-sbi-blue dark:text-cyan-400 font-mono text-xs md:text-sm items-center">
                  <span className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold border border-slate-100 dark:border-slate-700">Observe</span> <span className="text-slate-300">→</span>
                  <span className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold border border-slate-100 dark:border-slate-700">Analyze</span> <span className="text-slate-300">→</span>
                  <span className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold border border-slate-100 dark:border-slate-700">Detect</span> <span className="text-slate-300">→</span>
                  <span className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold border border-slate-100 dark:border-slate-700">Reason</span> <span className="text-slate-300">→</span>
                  <span className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold border border-slate-100 dark:border-slate-700">Recommend</span> <span className="text-slate-300">→</span>
                  <span className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold border border-slate-100 dark:border-slate-700">Act</span> <span className="text-slate-300">→</span>
                  <span className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm font-bold border border-slate-100 dark:border-slate-700">Follow-up</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Features / How it Works Explainer */}
      <div id="how-it-works" className="w-full max-w-6xl mx-auto py-24 px-4 text-left">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black tracking-widest text-sbi-blue uppercase mb-3">Core Architecture</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">How engageAI Works</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Synthetic Generation', 
              desc: 'Because we don\'t use real SBI data, we built a 2-pass Cerebras LLM generator to create mathematically realistic personas with hidden "life events" embedded in their transactions.', 
              icon: <Database className="w-8 h-8 text-indigo-500" />,
              features: ['120B parameter models', 'Statistical variance', 'Embedded ground-truth']
            },
            { 
              title: 'LangGraph Orchestration', 
              desc: 'A sequential pipeline of 6 specialized AI agents running on Groq (Llama-3). They analyze behavior, detect events, map opportunities, and draft personalized engagement plans.', 
              icon: <Layers className="w-8 h-8 text-sbi-blue" />,
              features: ['6 Specialized Agents', 'Deterministic workflows', 'FastAPI backend']
            },
            { 
              title: 'Explainable AI UI', 
              desc: 'Every recommendation is completely traceable. The Agent Activity Center streams the LLM\'s internal reasoning live to the screen, proving it\'s not a hard-coded script.', 
              icon: <Activity className="w-8 h-8 text-emerald-500" />,
              features: ['Server-Sent Events', 'Audit trail graphs', 'Live rendering']
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-sbi-blue/30 transition-all duration-300 shadow-lg hover:shadow-xl group flex flex-col h-full">
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 inline-block rounded-2xl group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-8 flex-1">
                {feature.desc}
              </p>
              
              <ul className="space-y-3 mt-auto">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                    <CheckCircle2 size={18} className="text-emerald-500 mr-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Final CTA Footer */}
      <div className="w-full bg-sbi-navy py-20 px-4 text-center border-t-8 border-sbi-blue">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to see it in action?</h2>
        <p className="text-indigo-200 text-xl max-w-2xl mx-auto mb-10">Step into the shoes of the AI and run the full digital engagement cycle on a synthetic persona.</p>
        <Button 
          onClick={() => onNavigate('generator')} 
          className="px-12 py-7 text-lg md:text-xl rounded-full shadow-2xl shadow-cyan-500/20 bg-gradient-to-r from-cyan-400 to-sbi-blue hover:from-cyan-300 hover:to-cyan-500 transition-all duration-300 text-sbi-navy font-black transform hover:scale-105"
        >
          Launch the Experience
        </Button>
      </div>

    </div>
  );
}
