'use client';

import React, { useEffect, useState } from 'react';
import { StockItem } from '@/lib/types';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  RefreshCw,
} from 'lucide-react';

interface AiTradeModalProps {
  stock: StockItem | null;
  isOpen: boolean;
  onClose: () => void;
  onExecutePlan: (stock: StockItem) => void;
}

export const AiTradeModal: React.FC<AiTradeModalProps> = ({
  stock,
  isOpen,
  onClose,
  onExecutePlan,
}) => {
  const [language, setLanguage] = useState<'english' | 'hinglish'>('english');
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (selectedStock: StockItem, lang: 'english' | 'hinglish') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          name: selectedStock.name,
          ltp: selectedStock.ltp,
          changePercent: selectedStock.changePercent,
          volumeRatio: selectedStock.volumeRatio,
          signal: selectedStock.signal,
          technicals: {
            supertrend: selectedStock.supertrend,
            rsi: selectedStock.rsi,
            vwap: selectedStock.vwap,
            emaCross: selectedStock.emaCross,
            catalyst: selectedStock.catalyst,
          },
          language: lang,
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setAnalysisText(data.text);
      } else {
        throw new Error(data.error || 'Failed to fetch AI analysis.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to analyze trade with AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !stock) return;
    const timer = setTimeout(() => {
      fetchAnalysis(stock, language);
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen, stock, language]);

  if (!isOpen || !stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative text-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                AI Beginner Trade Plan &amp; Rationale
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Asset: <strong className="text-slate-900">{stock.symbol}</strong> ({stock.name}) · ₹{stock.ltp.toFixed(2)} (+{stock.changePercent.toFixed(2)}%)
            </div>
          </div>

          {/* Language Toggle: English vs Hinglish with vibrant button */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0 mr-8 font-bold">
            <button
              onClick={() => setLanguage('english')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                language === 'english' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                language === 'hinglish' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-slate-900 font-extrabold text-sm">Gemini 3.8 Flash analyzing market metrics...</div>
              <div className="text-slate-500 text-[11px] font-medium max-w-sm">
                Calculating 9:00 AM pre-open volume surge, VWAP support, and 1:2 risk-reward entry zone for beginners.
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Unable to fetch AI trade analysis</span>
              </div>
              <p className="text-[11px] text-rose-700 font-medium">{error}</p>
              <button
                onClick={() => fetchAnalysis(stock, language)}
                className="mt-2 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          ) : analysisText ? (
            <div className="space-y-4">
              
              {/* Key Indicators Quick Strip */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Signal</span>
                  <span className="font-extrabold text-emerald-700 font-mono text-xs">{stock.signal}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Volume Surge</span>
                  <span className="font-extrabold text-amber-700 font-mono text-xs">{stock.volumeRatio.toFixed(1)}x Avg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">VWAP Support</span>
                  <span className="font-extrabold text-slate-800 font-mono text-xs">₹{stock.vwap.toFixed(1)}</span>
                </div>
              </div>

              {/* Formatted Analysis text */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 leading-relaxed text-slate-800 whitespace-pre-line text-xs font-medium">
                {analysisText}
              </div>

            </div>
          ) : null}
        </div>

        {/* Footer Actions with colorful buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium text-[11px]">
            Strict 1:2 Risk-Reward enforced by Algo Guardrails.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onExecutePlan(stock);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Execute 1-Click Buy MIS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
