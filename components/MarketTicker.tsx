'use client';

import React, { useEffect, useState } from 'react';
import { MarketIndex } from '@/lib/types';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface MarketTickerProps {
  indices: MarketIndex[];
  onSelectIndex?: (symbol: string) => void;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ indices, onSelectIndex }) => {
  const [istTime, setIstTime] = useState<string>('');
  const [marketStatus, setMarketStatus] = useState<{ status: string; color: string; badge: string }>({
    status: 'Market Open (Live)',
    color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
    badge: 'LIVE NSE/BSE',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const formatted = new Intl.DateTimeFormat('en-IN', options).format(now);
      setIstTime(formatted);

      const istHour = (now.getUTCHours() + 5) + Math.floor((now.getUTCMinutes() + 30) / 60);
      const istMinute = (now.getUTCMinutes() + 30) % 60;
      const totalMinutes = istHour * 60 + istMinute;

      if (totalMinutes >= 540 && totalMinutes < 548) {
        setMarketStatus({
          status: 'Pre-Open Order Discovery (9:00 - 9:08 AM IST)',
          color: 'text-amber-800 bg-amber-50 border-amber-300',
          badge: 'PRE-OPEN SCANNER ACTIVE',
        });
      } else if (totalMinutes >= 548 && totalMinutes < 555) {
        setMarketStatus({
          status: 'Pre-Open Buffer (9:08 - 9:15 AM IST)',
          color: 'text-cyan-800 bg-cyan-50 border-cyan-300',
          badge: 'ORDER BUFFER & FINAL GAPS',
        });
      } else if (totalMinutes >= 555 && totalMinutes <= 930) {
        setMarketStatus({
          status: 'NSE Normal Session (09:15 - 15:30 IST)',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
          badge: 'LIVE MARKET SESSION',
        });
      } else {
        setMarketStatus({
          status: 'Market Replay & Simulation Mode',
          color: 'text-blue-800 bg-blue-50 border-blue-300',
          badge: 'SIMULATED DATA FEED',
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700 px-4 py-2 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Market Status + Clock */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1.5 font-mono text-slate-800">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-slate-900">{istTime || '09:15:00 AM'}</span>
            <span className="text-[10px] text-slate-500 font-semibold">IST</span>
          </div>

          <div className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1.5 shadow-2xs ${marketStatus.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{marketStatus.badge}</span>
          </div>
        </div>

        {/* Indices Ticker Items */}
        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto py-0.5 no-scrollbar justify-start md:justify-end">
          {indices.map((idx) => {
            const isPositive = idx.change >= 0;
            return (
              <button
                key={idx.symbol}
                onClick={() => onSelectIndex?.(idx.symbol)}
                className="flex items-center gap-2 hover:bg-white px-2.5 py-1 rounded-md transition-all whitespace-nowrap shrink-0 group text-left border border-transparent hover:border-slate-200 hover:shadow-xs"
              >
                <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {idx.symbol}
                </span>
                <span className="font-mono tabular-nums text-slate-800 font-semibold">
                  {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`flex items-center font-mono tabular-nums font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                  {isPositive ? '+' : ''}{idx.changePercent.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
