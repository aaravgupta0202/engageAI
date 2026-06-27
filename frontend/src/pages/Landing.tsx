import { Button } from '../components/ui/Button';
import { Link, Search, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';

export default function Landing({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen text-left bg-white overflow-x-hidden selection:bg-sbi-blue selection:text-white">
      
      {/* Navigation for Landing Only */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-50">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <img src="/favicon.png" alt="engageAI Logo" className="h-20 md:h-24 w-auto group-hover:opacity-80 transition-opacity object-contain -my-6 scale-110" />
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <span onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer hover:text-sbi-blue transition-colors">Our Capabilities</span>
          <span onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer hover:text-sbi-blue transition-colors">Architecture</span>
          <span onClick={() => window.open('https://github.com/aaravgupta0202', '_blank')} className="cursor-pointer hover:text-sbi-blue transition-colors">GitHub Repo</span>
          <span onClick={() => window.open('https://aarav-cc.netlify.app/', '_blank')} className="cursor-pointer hover:text-sbi-blue transition-colors">Contact Us</span>
        </div>
        <Button onClick={() => onNavigate('generator')} className="rounded-full bg-sbi-blue hover:bg-sbi-navy text-white px-6 font-semibold shadow-md shadow-sbi-blue/20">
          Try Demo <ArrowRight size={16} className="ml-2" />
        </Button>
      </header>

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-20 pb-32 relative">
        <div className="max-w-3xl">
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Turn Banking Data<br />
            into <span className="text-emerald-500 font-semibold">Agentic Actions</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
            Built for the SBI Hackathon. Our autonomous AI system analyzes customer financial data, predicts life events, and executes personalized banking actions seamlessly.
          </p>
          <div className="flex space-x-4">
            <Button onClick={() => onNavigate('generator')} className="rounded-full bg-sbi-blue hover:bg-[#185ADB] text-white px-8 py-6 shadow-xl shadow-sbi-blue/20 text-lg font-semibold flex items-center">
              Try Demo <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="outline" onClick={() => window.open('https://github.com/aaravgupta0202', '_blank')} className="rounded-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-8 py-6 text-lg font-medium flex items-center shadow-sm">
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
          <div className="w-full max-w-3xl h-32 md:h-48 rounded-full bg-gradient-to-r from-slate-100 via-white to-slate-100 shadow-[inset_0_-20px_40px_rgba(0,0,0,0.05),0_30px_60px_rgba(40,116,240,0.1)] border-2 border-white/50 relative overflow-hidden backdrop-blur-3xl flex items-center justify-center group cursor-default transition-all duration-700 hover:shadow-[inset_0_-20px_40px_rgba(0,0,0,0.05),0_30px_60px_rgba(40,116,240,0.2)]">
             <div className="absolute inset-0 bg-gradient-to-tr from-sbi-blue/10 via-transparent to-indigo-500/10 mix-blend-overlay"></div>
             <div className="absolute w-[200%] h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sbi-blue/10 via-transparent to-transparent animate-[spin_8s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite]"></div>
             <span className="text-4xl sm:text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#0A1931] via-[#185ADB] to-[#0A1931] tracking-widest z-10 drop-shadow-md group-hover:scale-110 group-hover:tracking-[0.2em] transition-all duration-700 ease-out bg-[length:200%_auto] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">engageAI</span>
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
      <div id="stats" className="w-full max-w-[95%] mx-auto bg-[#185ADB] rounded-[40px] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden mb-32">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#0A1931]/20 to-transparent rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#5E95FF]/30 to-transparent rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">
          <div className="bg-[#0A1931]/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 md:col-span-1 h-full shadow-inner">
            <div className="text-5xl font-black mb-2">#1</div>
            <div className="text-xl font-bold mb-4">SBI Hackathon MVP</div>
            <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
              We provide an advanced multi-agent architecture to help banks understand customers, discover opportunities, and execute actions autonomously.
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
      <div id="capabilities" className="w-full max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          <div className="md:col-span-5 md:pr-12">
            <h2 className="text-5xl font-medium text-slate-900 mb-8 leading-[1.2]">
              Our<br />Capabilities
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              We offer a full array of AI-powered services tailored for banking. Observe transaction data, analyze life events, and act autonomously.
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
                  Gain a 360° view of your customers with real-time analytics. Identify hidden life events (like salary hikes or loan payoffs) directly from raw banking transaction data.
                </p>
                <button onClick={() => onNavigate('generator')} className="flex items-center text-sm font-bold text-sbi-blue hover:text-sbi-navy transition-colors">
                  See it in action <ArrowRight size={14} className="ml-1" />
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
                  Our sequential LangGraph pipeline detects financial opportunities and instantly drafts hyper-personalized wealth management and insurance plans without human intervention.
                </p>
                <button onClick={() => onNavigate('generator')} className="flex items-center text-sm font-bold text-indigo-500 hover:text-indigo-800 transition-colors">
                  See it in action <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>

            {/* Capability 3 */}
            <div className="flex items-start">
              <div className="w-16 h-16 shrink-0 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mr-8">
                <Link size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Explainable Integration</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-4">
                  Easily connect the multi-agent AI brain to SBI's existing data lakes. Explainable UI components ensure every AI decision and confidence score is completely transparent to the banker.
                </p>
                <button onClick={() => onNavigate('generator')} className="flex items-center text-sm font-bold text-emerald-500 hover:text-emerald-700 transition-colors">
                  See it in action <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
