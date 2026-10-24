'use client';

import React from 'react';
import { GrowthAlertMessage } from '@/lib/types';
import { TrendingUp, X, Zap, ShieldAlert, Eye, Volume2 } from 'lucide-react';

interface GrowthAlertPopupProps {
  alert: GrowthAlertMessage | null;
  onClose: () => void;
  onBuyNow: (alert: GrowthAlertMessage) => void;
  onViewChart: (symbol: string) => void;
}

export const GrowthAlertPopup: React.FC<GrowthAlertPopupProps> = ({
  alert,
  onClose,
  onBuyNow,
  onViewChart,
}) => {
  if (!alert) return null;

  return (
    <aside
      aria-label="Stock Growth Alert"
      className="fixed bottom-5 right-5 z-50 max-w-md w-[calc(100vw-2.5rem)] bg-white border-2 border-emerald-500 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 text-slate-800"
    >
      {/* Top Bar: Alert Badge + Close */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            LIVE SHARE GROWTH ALERT
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* SHARE NAME FIRST (Prominently as requested by user) */}
      <div className="mt-3 mb-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {alert.symbol}
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {alert.volumeSpike}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium truncate">
          {alert.name} · Institutional Buy Volume Detected
        </p>
      </div>

      {/* BUY PRICE & SELL TARGET PRICE (Clear & Prominent for Profit) */}
      <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3 text-center">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Recommended Buy Price
          </span>
          <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
            ₹{alert.buyPrice.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 block font-medium">Market Order</span>
        </div>

        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">
            Sell Target Price
          </span>
          <span className="text-lg font-black text-emerald-700 font-mono tabular-nums">
            ₹{alert.sellTargetPrice.toFixed(2)}
          </span>
          <span className="text-[10px] font-bold text-emerald-800 block">
            +{alert.potentialProfitPercent.toFixed(1)}% Profit Zone
          </span>
        </div>
      </div>

      {/* Stop Loss & Expected Gain Breakdown */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-600 font-medium mb-4">
        <div>
          <span>Stop Loss: </span>
          <strong className="text-rose-700 font-mono">₹{alert.stopLossPrice.toFixed(2)}</strong>
        </div>
        <div>
          <span>Expected Net Gain: </span>
          <strong className="text-emerald-700 font-mono font-bold">+₹{alert.potentialProfitAmount.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onViewChart(alert.symbol)}
          className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Chart</span>
        </button>

        <button
          onClick={() => onBuyNow(alert)}
          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>1-Click Buy Now</span>
        </button>
      </div>
    </aside>
  );
};
