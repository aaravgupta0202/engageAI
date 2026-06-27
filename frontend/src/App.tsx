/**
 * Main Application Component
 * 
 * Handles routing across the 5 primary views of EngageAI:
 * Landing, Customer Generator, Dashboard, Agent Activity, and Chat.
 * Implements the global navigation header with disabled-state reasoning.
 */
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Landing from './pages/Landing';
import CustomerGenerator from './pages/CustomerGenerator';
import CustomerDashboard from './pages/CustomerDashboard';
import AgentActivityCenter from './pages/AgentActivityCenter';
import AiChat from './pages/AiChat';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);

  const handleNavigate = (page: string, customerId?: string) => {
    if (customerId) setActiveCustomerId(customerId);
    if (page === 'landing') navigate('/');
    else navigate(`/${page}`);
  };

  const isLanding = location.pathname === '/' || location.pathname === '';
  const currentPage = location.pathname.split('/')[1] || 'landing';

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors duration-500">
      
      {/* Premium Glass Header */}
      {!isLanding && (
        <header className="sticky top-0 z-50 glass-panel border-b px-6 py-4 flex justify-between items-center transition-all duration-300">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavigate('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sbi-blue to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
              S
            </div>
            <h1 className="text-2xl font-black tracking-tight text-sbi-navy dark:text-white group-hover:opacity-80 transition-opacity">
              Engage<span className="text-sbi-blue dark:text-cyan-400">AI</span>
            </h1>
          </div>
          
          <nav className="flex space-x-1">
            {['generator', 'dashboard', 'agent', 'chat'].map((page) => {
              const isDisabled = !activeCustomerId && page !== 'generator';
              return (
                <div key={page} className="relative group inline-block">
                  <button
                    onClick={() => handleNavigate(page, activeCustomerId || undefined)}
                    disabled={isDisabled}
                    className={`flex items-center space-x-1 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      currentPage === page 
                        ? 'bg-sbi-blue text-white shadow-md scale-105' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isDisabled && <Lock size={14} className="opacity-70 mr-1" />}
                    <span>{page.charAt(0).toUpperCase() + page.slice(1).replace('Agent', 'Activity')}</span>
                  </button>
                  {isDisabled && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Please select a persona first
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </header>
      )}

      {/* Main Content Area with elegant padding */}
      <main className={`transition-all duration-500 ease-in-out ${!isLanding ? 'p-6 max-w-7xl mx-auto' : ''}`}>
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <Routes>
            <Route path="/" element={<Landing onNavigate={handleNavigate} />} />
            <Route path="/generator" element={<CustomerGenerator onNavigate={handleNavigate} />} />
            <Route path="/dashboard" element={<CustomerDashboard customerId={activeCustomerId} onNavigate={handleNavigate} />} />
            <Route path="/agent" element={<AgentActivityCenter customerId={activeCustomerId} onNavigate={handleNavigate} />} />
            <Route path="/chat" element={<AiChat customerId={activeCustomerId} />} />
          </Routes>
        </div>
      </main>

    </div>
  );
}

export default App;
