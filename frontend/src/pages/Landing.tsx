import { Button } from '../components/ui/Button';
import { Link, Search, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';

export default function Landing({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen text-left bg-white overflow-x-hidden selection:bg-sbi-blue selection:text-white">
      
      {/* Navigation for Landing Only */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-50">
        <div className="flex items-center -ml-3 cursor-pointer group">
          <img src="/favicon.png" alt="engageAI Logo" className="h-32 md:h-40 w-auto group-hover:opacity-80 transition-opacity object-contain -my-10 scale-125" />
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <span onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer hover:text-sbi-blue transition-colors">Our Capabilities</span>
          <span onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer hover:text-sbi-blue transition-colors">Architecture</span>
          <span onClick={() => window.open('https://github.com/aaravgupta0202', '_blank')} className="cursor-pointer hover:text-sbi-blue transition-colors">GitHub Repo</span>
          <span onClick={() => window.open('https://aarav-cc.netlify.app/', '_blank')} className="cursor-pointer hover:text-sbi-blue transition-colors">Contact Us</span>
        </div>
        <Button onClick={() => onNavigate('generator')} className="rounded-full bg-sbi-blue hover:bg-sbi-navy text-white px-4 md:px-6 py-2 font-semibold shadow-md shadow-sbi-blue/20 text-sm md:text-base">
          Try Demo <ArrowRight size={16} className="ml-1 md:ml-2" />
        </Button>
      </header>

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-12 md:pb-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-medium tracking-tight text-slate-900 mb-4 md:mb-6 leading-[1.1]">
              Turn Banking Data<br />
              into <span className="text-emerald-500 font-semibold">Agentic Actions</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 max-w-xl leading-relaxed">
              Built for the SBI Hackathon. Our autonomous AI system analyzes customer financial data, predicts life events, and executes personalized banking actions seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <Button onClick={() => onNavigate('generator')} className="rounded-full bg-sbi-blue hover:bg-[#185ADB] text-white px-8 py-4 sm:py-6 shadow-xl shadow-sbi-blue/20 text-base sm:text-lg font-semibold flex items-center justify-center w-full sm:w-auto">
                Try Demo <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button variant="outline" onClick={() => window.open('https://github.com/aaravgupta0202/engageAI', '_blank')} className="rounded-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-8 py-4 sm:py-6 text-base sm:text-lg font-medium flex items-center justify-center shadow-sm w-full sm:w-auto">
                View Source <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Right Column: Floating Agent Dashboard Mockup */}
          <div className="relative hidden lg:flex items-center justify-center w-full h-[500px]">
            <div className="w-[420px] bg-white rounded-2xl border-2 border-slate-900 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-4 transition-transform duration-500 cursor-default relative">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs font-bold text-white bg-emerald-500 px-3 py-1 rounded-md tracking-wider uppercase">Life Event</div>
                <div className="text-slate-400 font-mono text-xs">PID: 8829A</div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 font-serif">Salary Hike Detected</h3>
              <p className="text-slate-600 text-sm mb-6 font-medium leading-relaxed">System detected a ₹1,20,000 deposit (35% increase over 6m average). LangGraph pipeline initiated.</p>
              
              <div className="space-y-3">
                <div className="flex items-center p-4 border-2 border-slate-900 rounded-xl bg-slate-50 cursor-pointer hover:bg-sbi-blue hover:text-white transition-all group">
                  <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 group-hover:bg-white group-hover:text-sbi-blue transition-colors">1</div>
                  <div className="font-bold text-sm">Generate Wealth Plan</div>
                </div>
                <div className="flex items-center p-4 border-2 border-slate-900 rounded-xl bg-slate-50 cursor-pointer hover:bg-emerald-500 hover:text-white transition-all group">
                  <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 group-hover:bg-white group-hover:text-emerald-500 transition-colors">2</div>
                  <div className="font-bold text-sm">Execute Autonomous Action</div>
                </div>
              </div>
              
              {/* Floating Deco Tags */}
              <div className="absolute -top-6 -left-8 bg-[#185ADB] text-white border-2 border-slate-900 px-4 py-2 rounded-full font-bold shadow-md transform -rotate-6">
                AI Triggered
              </div>
              <div className="absolute -bottom-6 -right-6 bg-emerald-400 text-slate-900 border-2 border-slate-900 px-4 py-2 rounded-full font-bold shadow-md transform rotate-6 flex items-center">
                <CheckCircle2 size={16} className="mr-1"/> 100% Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Abstract Infinity/Glass Graphic area */}
        <div className="mt-16 md:mt-24 relative w-full h-48 sm:h-64 md:h-96 flex items-center justify-center">
          
          {/* Glass Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-visible animate-[spin_20s_linear_infinite]">
            <div className="absolute top-[10%] left-[10%] sm:left-[20%] w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-sbi-blue/40 blur-[2px] animate-bounce" style={{animationDuration: '3s'}}></div>
            <div className="absolute top-[40%] left-[5%] sm:left-[10%] w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-indigo-500/30 blur-[4px] animate-pulse" style={{animationDuration: '4s'}}></div>
            <div className="absolute top-[60%] right-[10%] sm:right-[15%] w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-emerald-400/40 blur-[3px] animate-bounce" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
            <div className="absolute top-[20%] right-[15%] sm:right-[25%] w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-sbi-blue/20 blur-[6px] animate-pulse" style={{animationDuration: '6s'}}></div>
            <div className="absolute bottom-[10%] left-[20%] sm:left-[30%] w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-400/30 blur-[2px] animate-bounce" style={{animationDuration: '4.5s', animationDelay: '0.5s'}}></div>
          </div>
          {/* Abstract Floating UI Elements */}
          <div className="absolute top-0 sm:top-10 left-0 sm:left-10 text-sbi-blue font-bold text-lg sm:text-2xl md:text-3xl bg-white/80 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 transform -rotate-3 animate-pulse">
            95% Faster
          </div>
          <div className="absolute bottom-0 sm:bottom-10 right-0 sm:right-10 text-emerald-500 font-bold text-lg sm:text-2xl md:text-3xl bg-white/80 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 transform rotate-3 animate-pulse" style={{animationDelay: '1s'}}>
            2x Growth
          </div>
          
          {/* The Central Shape (simulating the glossy 3D shape from the mockup) */}
          <div className="w-full max-w-[90%] sm:max-w-3xl h-24 sm:h-32 md:h-48 rounded-full bg-gradient-to-r from-slate-100 via-white to-slate-100 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.05),0_15px_30px_rgba(40,116,240,0.1)] md:shadow-[inset_0_-20px_40px_rgba(0,0,0,0.05),0_30px_60px_rgba(40,116,240,0.1)] border-2 border-white/50 relative overflow-hidden backdrop-blur-3xl flex items-center justify-center group cursor-default transition-all duration-700 hover:shadow-[inset_0_-20px_40px_rgba(0,0,0,0.05),0_30px_60px_rgba(40,116,240,0.2)]">
             <div className="absolute inset-0 bg-gradient-to-tr from-sbi-blue/10 via-transparent to-indigo-500/10 mix-blend-overlay"></div>
             <div className="absolute w-[200%] h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sbi-blue/10 via-transparent to-transparent animate-[spin_8s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite]"></div>
             <span className="text-3xl sm:text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#0A1931] via-[#185ADB] to-[#0A1931] tracking-widest z-10 drop-shadow-md group-hover:scale-110 group-hover:tracking-[0.2em] transition-all duration-700 ease-out bg-[length:200%_auto] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] pb-2 sm:pb-3 md:pb-4 leading-normal">engageAI</span>
          </div>
        </div>

        {/* Logos Bar */}
        <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 pt-8 gap-6">
          <div className="text-sm font-medium text-slate-500">Trusted by visionary businesses</div>
          <div className="flex space-x-6 md:space-x-12 text-sm font-semibold text-slate-700">
             <div className="flex items-center"><CheckCircle2 size={16} className="text-sbi-blue mr-2"/> Collaborative AI</div>
             <div className="flex items-center"><CheckCircle2 size={16} className="text-sbi-blue mr-2"/> Data-Driven Decisions</div>
             <div className="flex items-center"><CheckCircle2 size={16} className="text-sbi-blue mr-2"/> Task Automation</div>
          </div>
        </div>
      </div>

      {/* Massive Blue Statistics Banner */}
      <div id="stats" className="w-full max-w-[95%] mx-auto bg-[#185ADB] rounded-[30px] md:rounded-[40px] p-8 md:p-12 lg:p-20 text-white shadow-2xl relative overflow-hidden mb-16 md:mb-20 mt-8 md:mt-12">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#0A1931]/20 to-transparent rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#5E95FF]/30 to-transparent rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start">
          <div className="bg-[#0A1931]/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 md:col-span-1 h-full shadow-inner">
            <div className="text-4xl md:text-5xl font-black mb-2">#1</div>
            <div className="text-lg md:text-xl font-bold mb-3 md:mb-4">SBI Hackathon MVP</div>
            <p className="text-xs md:text-sm text-blue-100/80 leading-relaxed font-medium">
              We provide an advanced multi-agent architecture to help banks understand customers, discover opportunities, and execute actions autonomously.
            </p>
          </div>
          <div className="flex flex-col justify-center h-full text-center md:text-left">
            <div className="text-5xl md:text-6xl font-light tracking-tight mb-2 md:mb-3">100k+</div>
            <p className="text-blue-100 font-medium text-sm md:text-base md:pr-8">Mock banking transactions processed and analyzed accurately.</p>
          </div>
          <div className="flex flex-col justify-center h-full text-center md:text-left">
            <div className="text-5xl md:text-6xl font-light tracking-tight mb-2 md:mb-3">6</div>
            <p className="text-blue-100 font-medium text-sm md:text-base md:pr-8">Sequential LangGraph agents working autonomously to detect opportunities.</p>
          </div>
          <div className="flex flex-col justify-center h-full text-center md:text-left">
            <div className="text-5xl md:text-6xl font-light tracking-tight mb-2 md:mb-3">100%</div>
            <p className="text-blue-100 font-medium text-sm md:text-base md:pr-8">Explainable UI architecture with transparent reasoning at every step.</p>
          </div>
        </div>
      </div>

      {/* Our Capabilities Section */}
      <div id="capabilities" className="w-full max-w-7xl mx-auto px-6 pb-20">
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
            <div className="flex flex-col sm:flex-row items-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-blue-50 text-sbi-blue rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-8">
                <Search size={24} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
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
            <div className="flex flex-col sm:flex-row items-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-8">
                <Bot size={24} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
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
            <div className="flex flex-col sm:flex-row items-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-8">
                <Link size={24} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
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
