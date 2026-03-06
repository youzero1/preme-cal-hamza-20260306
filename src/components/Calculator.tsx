'use client';

import { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import History from './History';
import { initialState, evaluateExpression, formatNumber, CalculatorState } from '@/lib/calculate';

const OPERATORS = ['+', '−', '×', '÷'];

function isOperator(val: string): boolean {
  return OPERATORS.includes(val);
}

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const saveToHistory = useCallback(async (expression: string, result: string) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      setHistoryRefresh(r => r + 1);
    } catch (err) {
      console.error('Failed to save history:', err);
    }
  }, []);

  const handleButton = useCallback((value: string) => {
    setState(prev => {
      const { display, expression, hasResult, error } = prev;

      // Clear all
      if (value === 'clear') {
        return { ...initialState };
      }

      // Error state - any key except clear resets
      if (error) {
        return { ...initialState };
      }

      // Backspace
      if (value === 'backspace') {
        if (hasResult) return { ...initialState };
        const newDisplay = display.length > 1 ? display.slice(0, -1) : '0';
        const newExpr = expression.length > 0 ? expression.slice(0, -1) : '';
        return { ...prev, display: newDisplay, expression: newExpr };
      }

      // Equals
      if (value === '=') {
        const fullExpr = expression + display;
        try {
          const evalResult = evaluateExpression(fullExpr);
          const resultStr = formatNumber(evalResult);
          // Save async
          setTimeout(() => saveToHistory(fullExpr, resultStr), 0);
          return {
            display: resultStr,
            expression: fullExpr,
            result: resultStr,
            hasResult: true,
            error: null,
          };
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Error';
          return {
            display: msg === 'Division by zero' ? '÷0 Error' : 'Error',
            expression: fullExpr,
            result: '',
            hasResult: false,
            error: msg,
          };
        }
      }

      // Operator
      if (isOperator(value)) {
        if (hasResult) {
          // Continue with result
          return {
            display: value,
            expression: prev.result + value,
            result: '',
            hasResult: false,
            error: null,
          };
        }
        // Replace operator if display is already an operator
        if (isOperator(display)) {
          const newExpr = expression.slice(0, -1) + value;
          return { ...prev, display: value, expression: newExpr };
        }
        return {
          ...prev,
          display: value,
          expression: expression + display + value,
          hasResult: false,
        };
      }

      // Toggle sign
      if (value === 'toggle') {
        if (display === '0' || isOperator(display)) return prev;
        const toggled = display.startsWith('-') ? display.slice(1) : '-' + display;
        return { ...prev, display: toggled };
      }

      // Percent
      if (value === 'percent') {
        if (isOperator(display)) return prev;
        try {
          const num = parseFloat(display);
          const pct = formatNumber(num / 100);
          return { ...prev, display: pct };
        } catch {
          return prev;
        }
      }

      // Decimal
      if (value === '.') {
        if (hasResult) {
          return { ...prev, display: '0.', expression: '', hasResult: false };
        }
        if (isOperator(display)) {
          return { ...prev, display: '0.' };
        }
        if (display.includes('.')) return prev;
        return { ...prev, display: display + '.', hasResult: false };
      }

      // Numbers
      if (hasResult) {
        // Start fresh after result
        return {
          ...prev,
          display: value,
          expression: '',
          result: '',
          hasResult: false,
        };
      }

      if (isOperator(display)) {
        // After entering operator, start new number
        return { ...prev, display: value };
      }

      if (display === '0') {
        return { ...prev, display: value };
      }

      if (display.length >= 12) return prev;

      return { ...prev, display: display + value };
    });
  }, [saveToHistory]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= '0' && key <= '9') handleButton(key);
      else if (key === '+') handleButton('+');
      else if (key === '-') handleButton('−');
      else if (key === '*') handleButton('×');
      else if (key === '/') { e.preventDefault(); handleButton('÷'); }
      else if (key === '.') handleButton('.');
      else if (key === 'Enter' || key === '=') handleButton('=');
      else if (key === 'Backspace') handleButton('backspace');
      else if (key === 'Escape') handleButton('clear');
      else if (key === '%') handleButton('percent');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButton]);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h1 className="text-xl font-bold text-white tracking-wider">
          <span className="text-[#e94560]">P</span>reme{' '}
          <span className="text-[#e94560]">C</span>al
        </h1>
        <button
          onClick={() => setShowHistory(h => !h)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f3460] hover:bg-[#1a4a7a] text-sm text-white transition-colors no-select"
          aria-label="Toggle history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </button>
      </div>

      {/* Calculator Card */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#0f3460]" style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
        <Display
          expression={state.expression}
          display={state.display}
          hasResult={state.hasResult}
          error={state.error}
        />
        <ButtonGrid onButton={handleButton} />
      </div>

      {/* History Panel */}
      {showHistory && (
        <History
          refreshKey={historyRefresh}
          onClose={() => setShowHistory(false)}
          onSelectEntry={(expr, result) => {
            setState({
              display: result,
              expression: expr,
              result: result,
              hasResult: true,
              error: null,
            });
            setShowHistory(false);
          }}
        />
      )}
    </div>
  );
}
