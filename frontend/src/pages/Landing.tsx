import { Button } from '../components/ui/Button';
import { Layers, Activity, Link, Brain, Search, Send, ArrowRight, Zap, Target, Bot } from 'lucide-react';

export default function Landing({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen text-left bg-white overflow-x-hidden selection:bg-sbi-blue selection:text-white">
      
      {/* Navigation for Landing Only */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-50">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 bg-sbi-blue text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg">S</div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 group-hover:opacity-80 transition-opacity">
            engage<span className="text-sbi-blue">AI</span>
          </h1>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <span className="cursor-pointer hover:text-sbi-blue transition-colors">Our Solutions</span>
          <span className="cursor-pointer hover:text-sbi-blue transition-colors">Architecture</span>
          <span className="cursor-pointer hover:text-sbi-blue transition-colors">Testimonials</span>
          <span className="cursor-pointer hover:text-sbi-blue transition-colors">Contact Us</span>
        </div>
        <Button onClick={() => onNavigate('generator')} className="rounded-full bg-sbi-blue hover:bg-sbi-navy text-white px-6 font-semibold shadow-md shadow-sbi-blue/20">
          Enquire <ArrowRight size={16} className="ml-2" />
        </Button>
      </header>

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-20 pb-32 relative">
        <div className="max-w-3xl">
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Turn Customer Data<br />
            into <span className="text-emerald-500 font-semibold">Sales Success</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
            Whatever your business size, our autonomous AI system can be customized to help you manage customers, predict life events, and increase efficiency.
          </p>
          <div className="flex space-x-4">
            <Button onClick={() => onNavigate('generator')} className="rounded-full bg-sbi-blue hover:bg-[#185ADB] text-white px-8 py-6 shadow-xl shadow-sbi-blue/20 text-lg font-semibold flex items-center">
              Try Demo <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="outline" onClick={() => window.open('https://github.com/aaravgupta0202', '_blank')} className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg font-medium flex items-center">
              View Source <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Abstract Infinity/Glass Graphic area */}
        <div className="mt-24 relative w-full h-64 md:h-96 flex items-center justify-center">
          {/* Abstract Floating UI Elements */}
          <div className="absolute top-10 left-10 text-sbi-blue font-bold text-2xl md:text-3xl bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50 transform -rotate-3 animate-pulse">
            95% Faster
          </div>
          <div className="absolute bottom-10 right-10 text-emerald-500 font-bold text-2xl md:text-3xl bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50 transform rotate-3 animate-pulse" style={{animationDelay: '1s'}}>
            2x Growth
          </div>
          
          {/* The Central Shape (simulating the glossy 3D shape from the mockup) */}
          <div className="w-full max-w-3xl h-32 md:h-48 rounded-full bg-gradient-to-r from-slate-100 via-white to-slate-100 shadow-[inset_0_-20px_40px_rgba(0,0,0,0.05),0_30px_60px_rgba(40,116,240,0.1)] border-2 border-white/50 relative overflow-hidden backdrop-blur-3xl flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-sbi-blue/10 via-transparent to-indigo-500/10 mix-blend-overlay"></div>
             <div className="absolute w-[200%] h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sbi-blue/5 via-transparent to-transparent animate-[spin_10s_linear_infinite]"></div>
             <span className="text-4xl md:text-6xl font-black text-slate-200 opacity-50 tracking-widest">engageAI</span>
          </div>
        </div>

        {/* Logos Bar */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 pt-8 gap-6">
          <div className="text-sm font-medium text-slate-500">Trusted by visionary businesses</div>
          <div className="flex space-x-6 md:space-x-12 text-sm font-semibold text-slate-700">
             <div className="flex items-center"><CheckCircle2 size={16} className="text-sbi-blue mr-2"/> Collaborative AI</div>
             <div className="flex items-center"><CheckCircle2 size={16} className="text-sbi-blue mr-2"/> Data-Driven Decisions</div>
             <div className="flex items-center"><CheckCircle2 size={16} className="text-sbi-blue mr-2"/> Task Automation</div>
          </div>
        </div>
      </div>

      {/* Massive Blue Statistics Banner */}
      <div className="w-full max-w-[95%] mx-auto bg-[#185ADB] rounded-[40px] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden mb-32">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#0A1931]/20 to-transparent rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#5E95FF]/30 to-transparent rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">
          <div className="bg-[#0A1931]/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 md:col-span-1 h-full shadow-inner">
            <div className="text-5xl font-black mb-2">#1</div>
            <div className="text-xl font-bold mb-4">Agentic AI Platform</div>
            <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
              We provide the world's leading autonomous agents to help organizations manage customers, boost sales, and drive growth seamlessly.
            </p>
          </div>
          <div className="flex flex-col justify-center h-full">
            <div className="text-5xl md:text-6xl font-light tracking-tight mb-3">6.5M+</div>
            <p className="text-blue-100 font-medium text-sm md:text-base pr-8">Synthetic customer interactions managed dynamically via LangGraph.</p>
          </div>
          <div className="flex flex-col justify-center h-full">
            <div className="text-5xl md:text-6xl font-light tracking-tight mb-3">6+</div>
            <p className="text-blue-100 font-medium text-sm md:text-base pr-8">Specialized AI agents running sequentially in the orchestration pipeline.</p>
          </div>
          <div className="flex flex-col justify-center h-full">
            <div className="text-5xl md:text-6xl font-light tracking-tight mb-3">120B</div>
            <p className="text-blue-100 font-medium text-sm md:text-base pr-8">Parameter models powered by Cerebras ensuring rapid, human-like reasoning.</p>
          </div>
        </div>
      </div>

      {/* Our Capabilities Section */}
      <div className="w-full max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          <div className="md:col-span-5 md:pr-12">
            <h2 className="text-5xl font-medium text-slate-900 mb-8 leading-[1.2]">
              Our<br />Capabilities
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              We offer a full array of AI-powered services to help you maximize customer engagement and revenue. Observe, analyze, and act autonomously.
            </p>
          </div>

          <div className="md:col-span-7 space-y-16">
            
            {/* Capability 1 */}
            <div className="flex items-start">
              <div className="w-16 h-16 shrink-0 bg-blue-50 text-sbi-blue rounded-full flex items-center justify-center mr-8">
                <Search size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Customer Insights</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-4">
                  Gain a 360° view of your customers with real-time analytics. Identify hidden life events (like salary hikes or loan payoffs) from raw transaction data.
                </p>
                <button className="flex items-center text-sm font-bold text-sbi-blue hover:text-sbi-navy transition-colors">
                  Read more <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>

            {/* Capability 2 */}
            <div className="flex items-start">
              <div className="w-16 h-16 shrink-0 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mr-8">
                <Bot size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Autonomous Agents</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-4">
                  Automate lead tracking and follow-ups. Our LangGraph pipeline detects opportunities and instantly drafts hyper-personalized engagement plans.
                </p>
                <button className="flex items-center text-sm font-bold text-indigo-500 hover:text-indigo-800 transition-colors">
                  Read more <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>

            {/* Capability 3 */}
            <div className="flex items-start">
              <div className="w-16 h-16 shrink-0 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mr-8">
                <Link size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Seamless Integration</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-4">
                  Easily connect the multi-agent AI brain to your existing data lakes and CRMs. Explainable UI components ensure every AI decision is completely transparent.
                </p>
                <button className="flex items-center text-sm font-bold text-emerald-500 hover:text-emerald-700 transition-colors">
                  Read more <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
