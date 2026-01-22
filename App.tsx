
import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import HistorySidebar from './components/HistorySidebar';
import { HistoryItem } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addToHistory = (expression: string, result: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      expression,
      result,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row items-center justify-center p-4 gap-8">
      {/* Header for Mobile */}
      <div className="md:hidden w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Gemini Calc
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <main className="flex-1 flex justify-center w-full max-w-md">
        <Calculator onCalculate={addToHistory} />
      </main>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 h-[600px]">
        <HistorySidebar 
          history={history} 
          onClear={clearHistory} 
          isOpen={true} 
          onClose={() => {}} 
          isDesktop={true}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 shadow-2xl">
            <HistorySidebar 
              history={history} 
              onClear={clearHistory} 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
