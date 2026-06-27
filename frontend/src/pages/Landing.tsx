import React from 'react';
import { Button } from '../components/ui/Button';
import { Search, Brain, Send, ChevronDown } from 'lucide-react';

/**
 * Landing Page Component
 * Serves as the primary entry point for the EngageAI demo.
 * Renders the hero section and the "How it works" explainer.
 */
export default function Landing({ onNavigate }: { onNavigate: (page: string) => void }) {
  const scrollToExplainer = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen text-center px-4 pt-20 animate-in fade-in zoom-in-95 duration-700">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="mb-8 relative group cursor-pointer">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-sbi-blue rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl border border-slate-100 dark:border-slate-800 transform group-hover:scale-110 transition-transform duration-500">
            <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-sbi-navy to-cyan-500">S</span>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sbi-blue to-cyan-500">EngageAI</span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          An advanced, multi-agent AI copilot that acts as a proactive, hyper-personalized relationship manager. Built for the SBI Hackathon.
        </p>

        {/* Detect -> Reason -> Engage Loop */}
        <div className="flex items-center justify-center space-x-6 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <Search className="text-sbi-blue w-8 h-8" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Detect</span>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-slate-200 to-sbi-blue/50 dark:from-slate-700 dark:to-sbi-blue/30 rounded -mt-8"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <Brain className="text-sbi-blue w-8 h-8" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Reason</span>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-sbi-blue/50 to-cyan-400/50 dark:from-sbi-blue/30 dark:to-cyan-400/30 rounded -mt-8"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <Send className="text-cyan-500 w-8 h-8" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Engage</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => onNavigate('generator')} 
            className="px-10 py-6 text-lg rounded-full shadow-xl bg-gradient-to-r from-sbi-blue to-cyan-500 hover:from-sbi-navy hover:to-sbi-blue transform hover:-translate-y-1 transition-all duration-300 text-white font-bold"
          >
            Try the Demo
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://github.com', '_blank')}
            className="px-10 py-6 text-lg rounded-full border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 font-semibold"
          >
            View Source
          </Button>
        </div>

        <div className="mt-16 animate-bounce cursor-pointer text-slate-400 hover:text-sbi-blue transition-colors" onClick={scrollToExplainer}>
          <p className="text-sm font-medium mb-2">How it works</p>
          <ChevronDown className="w-6 h-6 mx-auto" />
        </div>
      </div>

      {/* How it Works Explainer */}
      <div id="how-it-works" className="w-full max-w-5xl mx-auto py-24 text-left border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-4xl font-bold mb-12 text-center text-slate-900 dark:text-white">The Core Philosophy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Generative Personas', desc: 'Synthetic graph generation powered by Cerebras LLM. Realistic data with embedded life events.', icon: <Brain className="w-8 h-8 text-cyan-500" /> },
            { title: 'LangGraph Orchestration', desc: '6 sequential agents running continuously to analyze behaviors, discover opportunities, and plan actions.', icon: <Search className="w-8 h-8 text-sbi-blue" /> },
            { title: 'Explainable AI', desc: 'Live reasoning streams directly into the UI, making every financial recommendation fully transparent.', icon: <Send className="w-8 h-8 text-emerald-500" /> }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sbi-blue/50 transition-colors shadow-sm">
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 inline-block rounded-xl">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agentic AI Explanation */}
      <div className="w-full max-w-5xl mx-auto pb-24 text-left">
        <h2 className="text-4xl font-bold mb-12 text-center text-slate-900 dark:text-white">Why Agentic AI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-red-50 dark:bg-red-900/10">
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4 flex items-center"><span className="text-2xl mr-2">🤖</span> Traditional Chatbots</h3>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-6">Reactive systems that wait for you to know what you need.</p>
            <div className="flex items-center space-x-3 text-slate-500 font-mono text-sm">
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">Ask</span>
              <span>→</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">Answer</span>
            </div>
          </div>
          
          <div className="glass-card p-8 rounded-2xl border border-sbi-blue/30 bg-blue-50 dark:bg-sbi-blue/10 shadow-lg shadow-sbi-blue/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400 opacity-10 rounded-full blur-2xl"></div>
            <h3 className="text-xl font-bold text-sbi-navy dark:text-sbi-blue mb-4 flex items-center"><span className="text-2xl mr-2">⚡</span> SBI EngageAI</h3>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-6">A proactive system that anticipates needs before you ask.</p>
            <div className="flex flex-wrap gap-2 text-sbi-blue font-mono text-xs md:text-sm items-center">
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-sbi-blue/30 font-bold shadow-sm">Observe</span> <span className="text-slate-400">→</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-sbi-blue/30 font-bold shadow-sm">Analyze</span> <span className="text-slate-400">→</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-sbi-blue/30 font-bold shadow-sm">Detect</span> <span className="text-slate-400">→</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-sbi-blue/30 font-bold shadow-sm">Reason</span> <span className="text-slate-400">→</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-sbi-blue/30 font-bold shadow-sm">Recommend</span> <span className="text-slate-400">→</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-sbi-blue/30 font-bold shadow-sm">Act</span> <span className="text-slate-400">→</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-sbi-blue/30 font-bold shadow-sm">Follow-up</span> <span className="text-slate-400">→</span>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-md border border-sbi-blue/30 font-bold shadow-sm">Observe Again</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
