
import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
  isDesktop?: boolean;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  onClear, 
  onClose, 
  isDesktop = false 
}) => {
  return (
    <div className="h-full flex flex-col p-6 text-slate-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </h2>
        {!isDesktop && (
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500 opacity-50">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No calculations yet</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="group p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <div className="text-xs text-slate-500 mb-1 font-mono">
                {item.expression} =
              </div>
              <div className="text-lg font-medium text-white font-mono">
                {item.result}
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <button
          onClick={onClear}
          className="mt-6 w-full py-2 text-sm text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/30 rounded-lg transition-all"
        >
          Clear History
        </button>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default HistorySidebar;
