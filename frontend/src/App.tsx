/**
 * Main Application Component
 * 
 * Handles routing across the 5 primary views of engageAI:
 * Landing, Customer Generator, Dashboard, Agent Activity, and Chat.
 * Implements the global navigation header with disabled-state reasoning.
 */
import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Landing from './pages/Landing';
import CustomerGenerator from './pages/CustomerGenerator';
import CustomerDashboard from './pages/CustomerDashboard';
import AgentActivityCenter from './pages/AgentActivityCenter';
import RecommendationsCenter from './pages/RecommendationsCenter';
import ActionCenter from './pages/ActionCenter';
import AiChat from './pages/AiChat';
import Footer from './components/Footer';

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-colors duration-500 selection:bg-sbi-blue selection:text-white">
      
      {/* Premium Glass Header */}
      {!isLanding && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center transition-all duration-300 shadow-sm">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavigate('landing')}>
            <img src="/favicon.png" alt="engageAI Logo" className="h-16 md:h-20 w-auto group-hover:opacity-80 transition-opacity object-contain -my-4 scale-110" />
          </div>
          
          <nav className="flex space-x-1">
            {['generator', 'dashboard', 'agent', 'recommendations', 'actions', 'chat'].map((page) => {
              const isDisabled = !activeCustomerId && page !== 'generator';
              return (
                <div key={page} className="relative group inline-block">
                  <button
                    onClick={() => handleNavigate(page, activeCustomerId || undefined)}
                    disabled={isDisabled}
                    className={`flex items-center space-x-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      currentPage === page 
                        ? 'bg-sbi-blue text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
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

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${!isLanding ? 'p-6 max-w-7xl mx-auto w-full' : ''}`}>
        <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
          <Routes>
            <Route path="/" element={<Landing onNavigate={handleNavigate} />} />
            <Route path="/generator" element={<CustomerGenerator onNavigate={handleNavigate} />} />
            <Route path="/dashboard" element={<CustomerDashboard customerId={activeCustomerId} onNavigate={handleNavigate} />} />
            <Route path="/agent" element={<AgentActivityCenter customerId={activeCustomerId} onNavigate={handleNavigate} />} />
            <Route path="/recommendations" element={<RecommendationsCenter customerId={activeCustomerId} onNavigate={handleNavigate} />} />
            <Route path="/actions" element={<ActionCenter customerId={activeCustomerId} onNavigate={handleNavigate} />} />
            <Route path="/chat" element={<AiChat customerId={activeCustomerId} />} />
          </Routes>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}

export default App;
