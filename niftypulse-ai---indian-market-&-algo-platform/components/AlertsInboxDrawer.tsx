'use client';

import React from 'react';
import { GrowthAlertMessage } from '@/lib/types';
import { X, Bell, Zap, TrendingUp, Trash2, Eye } from 'lucide-react';

interface AlertsInboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: GrowthAlertMessage[];
  onClearAlerts: () => void;
  onBuyAlert: (alert: GrowthAlertMessage) => void;
  onViewChart: (symbol: string) => void;
}

export const AlertsInboxDrawer: React.FC<AlertsInboxDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onClearAlerts,
  onBuyAlert,
  onViewChart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                Growth Alerts &amp; Messages
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Live breakout shares with buy &amp; sell profit targets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {alerts.length > 0 && (
              <button
                onClick={onClearAlerts}
                title="Clear all alerts"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-100">
          {alerts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700">No growing share alerts right now.</p>
              <p className="text-slate-400 text-[11px]">
                The radar scans continuously. When a stock breaks out above VWAP with volume, its buy &amp; sell targets will appear here.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="pt-3.5 first:pt-0 space-y-2.5">
                {/* Share Name FIRST */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-slate-900">
                        {alert.symbol}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {alert.volumeSpike}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate max-w-[220px]">
                      {alert.name}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    {alert.time}
                  </span>
                </div>

                {/* Buy Price and Sell Target Price Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Buy Price
                    </span>
                    <span className="font-black text-slate-900 font-mono text-sm">
                      ₹{alert.buyPrice.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                      Sell Target
                    </span>
                    <span className="font-black text-emerald-700 font-mono text-sm">
                      ₹{alert.sellTargetPrice.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-emerald-700 font-bold block">
                      +{alert.potentialProfitPercent.toFixed(1)}% Gain
                    </span>
                  </div>
                </div>

                {/* Stop Loss & Actions */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="text-[11px] text-slate-500">
                    SL: <strong className="text-rose-700 font-mono">₹{alert.stopLossPrice.toFixed(2)}</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewChart(alert.symbol)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Chart
                    </button>
                    <button
                      onClick={() => onBuyAlert(alert)}
                      className="px-3 py-1 text-xs font-black rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Buy MIS</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
