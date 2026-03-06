'use client';

import { useEffect, useState } from 'react';

interface HistoryEntry {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

interface HistoryProps {
  refreshKey: number;
  onClose: () => void;
  onSelectEntry: (expression: string, result: string) => void;
}

export default function History({ refreshKey, onClose, onSelectEntry }: HistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEntries(data.data);
        } else {
          setError('Failed to load history');
        }
      })
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col rounded-3xl overflow-hidden history-panel"
      style={{ background: 'linear-gradient(145deg, #1a1a2e, #0d1b2a)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#0f3460]">
        <h2 className="text-lg font-semibold text-white">Calculation History</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#0f3460] text-[#a0b4cc] hover:text-white transition-colors no-select"
          aria-label="Close history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center text-[#e94560] py-8">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="text-center text-[#8899aa] py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No calculations yet</p>
            <p className="text-xs mt-1 opacity-60">Your history will appear here</p>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="space-y-2">
            {entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelectEntry(entry.expression, entry.result)}
                className="w-full text-right px-4 py-3 rounded-xl bg-[#0f3460]/50 hover:bg-[#0f3460] transition-colors no-select group"
              >
                <p className="text-[#8899aa] text-xs group-hover:text-[#a0b4cc] transition-colors truncate">
                  {entry.expression}
                </p>
                <p className="text-white text-lg font-light mt-0.5">
                  = {entry.result}
                </p>
                <p className="text-[#8899aa] text-xs mt-1 opacity-60">
                  {formatDate(entry.createdAt)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
