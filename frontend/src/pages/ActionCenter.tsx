import { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle2, ChevronRight, Clock, ShieldCheck, PlayCircle } from 'lucide-react';

export default function ActionCenter({ customerId, onNavigate }: { customerId: string | null, onNavigate: (page: string) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  // Hardcoded action plan for the MVP demo path
  const steps = [
    { title: "Confirm Amount", description: "Review and confirm the additional ₹5,000 top-up for your SIP." },
    { title: "Select Target Fund", description: "Allocate the top-up to your existing SBI Bluechip Fund." },
    { title: "Authorize Mandate", description: "Set up the UPI AutoPay mandate for the new total amount." }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      setTimeout(() => setShowFollowUp(true), 800);
    }
  };

  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
        <p className="text-lg font-medium">Please select a persona first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 pt-8">
      
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Action Planning Center</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Executing: Mutual Fund SIP Top-Up</p>
      </div>

      {!isCompleted ? (
        <Card className="glass-card shadow-xl overflow-hidden border-t-4 border-t-sbi-blue">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Stepper Sidebar */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                <div className="space-y-6 relative">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700 z-0"></div>
                  
                  {steps.map((step, idx) => (
                    <div key={idx} className={`relative z-10 flex items-center space-x-4 ${idx > currentStep ? 'opacity-40' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${
                        idx < currentStep 
                          ? 'bg-emerald-500 text-white' 
                          : idx === currentStep 
                            ? 'bg-sbi-blue text-white ring-4 ring-sbi-blue/20' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {idx < currentStep ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <div className={`font-semibold ${idx === currentStep ? 'text-sbi-blue dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {step.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Action Area */}
              <div className="p-8 md:w-2/3 flex flex-col justify-center min-h-[300px]">
                <div className="animate-in slide-in-from-right-4 fade-in duration-300" key={currentStep}>
                  <div className="w-12 h-12 bg-sbi-blue/10 text-sbi-blue rounded-2xl flex items-center justify-center mb-6">
                    <PlayCircle size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{steps[currentStep].title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                    {steps[currentStep].description}
                  </p>
                  
                  <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                      onClick={handleNext}
                      className="rounded-full px-8 py-6 bg-sbi-blue hover:bg-sbi-navy text-white font-bold transition-all hover:scale-105 shadow-lg flex items-center"
                    >
                      {currentStep === steps.length - 1 ? 'Authorize & Complete' : 'Confirm & Continue'} 
                      <ChevronRight size={18} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="glass-card bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shadow-lg text-center p-10 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
            <h3 className="text-3xl font-black text-emerald-800 dark:text-emerald-300 mb-2">Action Successfully Executed</h3>
            <p className="text-emerald-600 dark:text-emerald-400/80 text-lg">Your SIP top-up mandate has been established.</p>
          </Card>

          {showFollowUp && (
            <Card className="glass-card border-indigo-200 dark:border-indigo-800 shadow-xl p-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Clock size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">Agent 6: Follow-Up Scheduled</div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Check-in scheduled for 30 days from now</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    The autonomous engine will re-engage you next month to ensure the increased SIP is comfortable with your new cash flow, closing the loop.
                  </p>
                </div>
                <Button 
                  onClick={() => onNavigate('chat')}
                  variant="outline"
                  className="rounded-full px-6 py-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-all hover:scale-105"
                >
                  Return to Chat
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
