'use client';

import React from 'react';
import { StockItem } from '@/lib/types';
import { Flame, Sparkles, TrendingUp, Zap, Clock, ShieldAlert, Eye } from 'lucide-react';

interface PreMarketScannerProps {
  stocks: StockItem[];
  onOpenAiModal: (stock: StockItem) => void;
  onTradeStock: (stock: StockItem, type: 'BUY' | 'SELL') => void;
  onSelectStockForChart: (symbol: string) => void;
  onDeployPreMarketAlgo: (stock: StockItem) => void;
}

export const PreMarketScanner: React.FC<PreMarketScannerProps> = ({
  stocks,
  onOpenAiModal,
  onTradeStock,
  onSelectStockForChart,
  onDeployPreMarketAlgo,
}) => {
  const preMarketStocks = stocks
    .filter(s => s.category === 'PRE_MARKET_GAP' || s.preMarketGapPercent > 1.2)
    .sort((a, b) => b.preMarketGapPercent - a.preMarketGapPercent);

  return (
    <div className="space-y-6">
      
      {/* Hero Banner for 5-Minute Pre-Market Edge */}
      <div className="relative rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white shadow-md overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-100 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-black/20 border border-white/20">
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              9:00 AM - 9:08 AM IST Discovery Window
            </span>
            <span>·</span>
            <span>5-Minute Edge Before 9:15 AM Opening Bell</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight mb-2">
            Pre-Market 5-Minute Radar: High-Momentum Growth Shares
          </h1>

          <p className="text-amber-50 text-sm sm:text-base leading-relaxed mb-5 font-medium">
            Institutional buyers and FIIs place orders during the NSE 9:00–9:08 AM pre-open auction. 
            At exactly 9:10 AM (5 minutes before market opens), this radar scans for authentic gap-ups with 
            volume confirmation, giving beginners clear entry plans before the crowd enters.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/25 text-white backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GIFT Nifty Gap: +98 pts</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/25 text-white backdrop-blur-xs">
              <Flame className="w-3.5 h-3.5 text-amber-200" />
              <span>Pre-Open Gap Leaders: {preMarketStocks.length} Verified</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/25 text-white backdrop-blur-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-200" />
              <span>Automated 1:2 Risk-Reward Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Market Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {preMarketStocks.map((stock) => {
          return (
            <div
              key={stock.symbol}
              className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all p-5 shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* Header: Symbol + Gap Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {stock.exchange}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate max-w-[190px]">
                      {stock.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-700 font-mono tabular-nums bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      +{stock.preMarketGapPercent.toFixed(2)}% Gap
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">Pre-Open Indicative</div>
                  </div>
                </div>

                {/* Price and Volume Multiplier Strip */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Indicative Price</div>
                    <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                      ₹{stock.ltp.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Pre-Open Vol</div>
                    <div className="text-sm font-bold text-amber-700 font-mono tabular-nums">
                      {stock.volumeRatio.toFixed(1)}x Avg
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Supertrend</div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">
                      {stock.supertrend}
                    </div>
                  </div>
                </div>

                {/* Catalyst Explanation */}
                <div className="mb-4 text-xs text-slate-700 leading-relaxed bg-amber-50/70 border border-amber-200 p-2.5 rounded-xl font-medium">
                  <span className="font-bold text-amber-900">Why It&apos;s Gapping: </span>
                  {stock.catalyst}
                </div>
              </div>

              {/* Action Buttons with distinct rich colors */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  {/* Purple AI button */}
                  <button
                    onClick={() => onOpenAiModal(stock)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Beginner Plan</span>
                  </button>

                  {/* Blue Chart button */}
                  <button
                    onClick={() => onSelectStockForChart(stock.symbol)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Chart</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Amber/Orange Algo button */}
                  <button
                    onClick={() => onDeployPreMarketAlgo(stock)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-slate-950" />
                    <span>Auto 9:20 Algo</span>
                  </button>

                  {/* Vibrant Emerald Buy button */}
                  <button
                    onClick={() => onTradeStock(stock, 'BUY')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Buy Intraday</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Beginner Explanation Guide Section for 9:00 AM Discovery */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 text-xs text-slate-700 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          How Beginners Can Safely Profit From 9:00 AM Pre-Market Gaps:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">Step 1: Wait for 9:15 AM Open</div>
            <p className="text-slate-600 font-medium">
              Never rush at 9:15:00. Let the first 3-to-5 minute candle form to confirm whether buyers are holding the gap above VWAP.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">Step 2: 9:20 AM Candle Breakout</div>
            <p className="text-slate-600 font-medium">
              Enter Buy when price crosses the high of the first 5-min candle. Place your Stop-Loss at the candle low or VWAP.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">Step 3: 1:2 Risk-Reward Target</div>
            <p className="text-slate-600 font-medium">
              If risk is ₹10 per share, book 50% profit at +₹20 (1:2), and trail the remaining 50% with Supertrend until 3:15 PM.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
