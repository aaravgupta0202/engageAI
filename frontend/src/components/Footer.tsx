import { Code, User, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center space-x-2">
            <img src="/favicon.png" alt="engageAI Logo" className="h-16 md:h-20 w-auto object-contain -my-4 scale-110" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Built for the SBI Agentic AI Hackathon</p>
        </div>
        
        <div className="flex space-x-4">
          <a href="https://aarav-cc.netlify.app/" target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:text-sbi-blue hover:border-sbi-blue/30 hover:bg-blue-50 transition-all font-medium text-sm">
            <Globe size={16} />
            <span>Portfolio</span>
          </a>
          <a href="https://github.com/aaravgupta0202" target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all font-medium text-sm">
            <Code size={16} />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/aarav-gupta-230269375/" target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-blue-50 transition-all font-medium text-sm">
            <User size={16} />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
