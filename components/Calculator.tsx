
import React, { useState, useEffect, useCallback } from 'react';
import { Operation, AIExplanation } from '../types';
import { getMathExplanation } from '../services/geminiService';

interface CalculatorProps {
  onCalculate: (expression: string, result: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onCalculate }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIExplanation | null>(null);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
    setAiResponse(null);
  };

  const handleOperation = (op: Operation) => {
    if (operation && !shouldResetDisplay) {
      calculate();
    }
    setPreviousValue(display);
    setOperation(op);
    setShouldResetDisplay(true);
    setAiResponse(null);
  };

  const calculate = useCallback(() => {
    if (operation === null || previousValue === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = current !== 0 ? prev / current : 0; break;
    }

    const resultStr = result.toString().slice(0, 12);
    const expression = `${previousValue} ${operation} ${display}`;
    
    onCalculate(expression, resultStr);
    setDisplay(resultStr);
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  }, [operation, previousValue, display, onCalculate]);

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
    setAiResponse(null);
  };

  const handlePercent = () => {
    const val = parseFloat(display) / 100;
    setDisplay(val.toString());
  };

  const toggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const askAI = async () => {
    if (display === '0' && !previousValue) return;
    setIsExplaining(true);
    try {
      const expression = operation ? `${previousValue} ${operation} ${display}` : display;
      const res = await getMathExplanation(expression, display);
      setAiResponse(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExplaining(false);
    }
  };

  const buttons = [
    { label: 'AC', onClick: clear, className: 'text-rose-400 font-bold' },
    { label: '+/-', onClick: toggleSign, className: 'text-indigo-400' },
    { label: '%', onClick: handlePercent, className: 'text-indigo-400' },
    { label: '÷', onClick: () => handleOperation('/'), className: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
    { label: '7', onClick: () => handleNumber('7') },
    { label: '8', onClick: () => handleNumber('8') },
    { label: '9', onClick: () => handleNumber('9') },
    { label: '×', onClick: () => handleOperation('*'), className: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
    { label: '4', onClick: () => handleNumber('4') },
    { label: '5', onClick: () => handleNumber('5') },
    { label: '6', onClick: () => handleNumber('6') },
    { label: '-', onClick: () => handleOperation('-'), className: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
    { label: '1', onClick: () => handleNumber('1') },
    { label: '2', onClick: () => handleNumber('2') },
    { label: '3', onClick: () => handleNumber('3') },
    { label: '+', onClick: () => handleOperation('+'), className: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
    { label: '0', onClick: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', onClick: () => handleNumber('.') },
    { label: '=', onClick: calculate, className: 'bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold' },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Display */}
        <div className="mb-6 text-right">
          <div className="h-6 text-slate-500 text-sm font-mono truncate">
            {previousValue} {operation}
          </div>
          <div className="text-5xl font-light tracking-tighter text-white truncate font-mono">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={`
                h-14 sm:h-16 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-95
                ${btn.className || 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-200'}
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* AI Action */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={askAI}
            disabled={isExplaining}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isExplaining ? (
              <span className="animate-pulse">Gemini is thinking...</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                </svg>
                Explain with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Response Card */}
      {aiResponse && (
        <div className="bg-slate-900/50 border border-blue-500/30 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-200 text-sm leading-relaxed mb-2">
                {aiResponse.explanation}
              </p>
              {aiResponse.funFact && (
                <div className="text-xs text-indigo-400 italic">
                  Tip: {aiResponse.funFact}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
