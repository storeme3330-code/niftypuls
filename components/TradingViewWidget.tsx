'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LineChart } from 'lucide-react';

interface TradingViewWidgetProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  selectedSymbol,
  onSelectSymbol,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeInterval, setActiveInterval] = useState<'1' | '3' | '5' | '15' | 'D'>('5');

  // Popular Indian stock shortcuts
  const popularSymbols = [
    { label: 'NIFTY 50', tvSymbol: 'NSE:NIFTY' },
    { label: 'BANK NIFTY', tvSymbol: 'NSE:BANKNIFTY' },
    { label: 'TATA MOTORS', tvSymbol: 'NSE:TATAMOTORS' },
    { label: 'RELIANCE', tvSymbol: 'NSE:RELIANCE' },
    { label: 'ZOMATO', tvSymbol: 'NSE:ZOMATO' },
    { label: 'TRENT', tvSymbol: 'NSE:TRENT' },
    { label: 'BHEL', tvSymbol: 'NSE:BHEL' },
    { label: 'SUZLON', tvSymbol: 'NSE:SUZLON' },
    { label: 'HDFC BANK', tvSymbol: 'NSE:HDFCBANK' },
  ];

  const getTvSymbol = (sym: string) => {
    if (sym.includes(':')) return sym;
    if (sym === 'NIFTY' || sym === 'NIFTY 50') return 'NSE:NIFTY';
    if (sym === 'BANKNIFTY' || sym === 'BANK NIFTY') return 'NSE:BANKNIFTY';
    if (sym === 'SENSEX') return 'BSE:SENSEX';
    return `NSE:${sym}`;
  };

  const currentTvSymbol = getTvSymbol(selectedSymbol);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: currentTvSymbol,
      interval: activeInterval,
      timezone: 'Asia/Kolkata',
      theme: 'light',
      style: '1',
      locale: 'en',
      backgroundColor: '#ffffff',
      gridColor: 'rgba(0, 0, 0, 0.04)',
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      studies: [
        'RSI@tv-basicstudies',
        'MASimple@tv-basicstudies',
        'Volume@tv-basicstudies',
      ],
      support_host: 'https://www.tradingview.com',
    });

    containerRef.current.appendChild(script);
  }, [currentTvSymbol, activeInterval]);

  return (
    <div className="space-y-4">
      
      {/* Chart Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            Live TradingView Advanced Terminal
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time NSE candlestick charts with RSI, Supertrend, Moving Averages, and Volume indicators.
          </p>
        </div>

        {/* Timeframe intervals with vibrant buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          {(['1', '3', '5', '15', 'D'] as const).map((int) => (
            <button
              key={int}
              onClick={() => setActiveInterval(int)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeInterval === int ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {int === 'D' ? '1D' : `${int}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Symbol Switcher Bar with colorful buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-500 font-bold whitespace-nowrap text-[11px] shrink-0">Quick Switch:</span>
        {popularSymbols.map((item) => {
          const isSelected = currentTvSymbol === item.tvSymbol || selectedSymbol === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onSelectSymbol(item.label)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Embedded Chart Container */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs relative">
        <div
          ref={containerRef}
          className="w-full h-[580px] sm:h-[650px] relative bg-white"
        >
          {/* Fallback loading while widget initializes */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs gap-2 bg-white">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Connecting to TradingView NSE data feed...</span>
          </div>
        </div>
      </div>

      {/* Beginner Indicator Cheat-Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="font-extrabold text-emerald-700 block mb-1">Supertrend (7, 3)</span>
          <p className="text-slate-600 font-medium leading-relaxed">
            When line is Green below price, the intraday trend is Bullish. Only look for Buy or CE trades. If Red, stay cautious or look for PE.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="font-extrabold text-blue-700 block mb-1">VWAP (Volume Weighted Avg Price)</span>
          <p className="text-slate-600 font-medium leading-relaxed">
            Institutional benchmark. If stock trades above VWAP, buyers are in control. Buying near VWAP gives the safest low-risk entry.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="font-extrabold text-amber-700 block mb-1">RSI (Relative Strength Index)</span>
          <p className="text-slate-600 font-medium leading-relaxed">
            Momentum zone: 55 to 70 signifies strong, sustained buying without being exhausted. Above 80 is overbought (avoid FOMO chasing).
          </p>
        </div>
      </div>

    </div>
  );
};
