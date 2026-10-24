'use client';

import React, { useState } from 'react';
import { AlgoConfig, AlgoStrategy, AlgoLogEntry } from '@/lib/types';
import { 
  SlidersHorizontal, 
  Zap, 
  ShieldAlert, 
  Play, 
  Pause, 
  CheckCircle2, 
  Activity,
} from 'lucide-react';

interface AlgoEnginePanelProps {
  config: AlgoConfig;
  onUpdateConfig: (newConfig: Partial<AlgoConfig>) => void;
  strategies: AlgoStrategy[];
  onToggleStrategy: (id: string) => void;
  logs: AlgoLogEntry[];
  onTestTriggerAlgo: () => void;
}

export const AlgoEnginePanel: React.FC<AlgoEnginePanelProps> = ({
  config,
  onUpdateConfig,
  strategies,
  onToggleStrategy,
  logs,
  onTestTriggerAlgo,
}) => {
  const [activeTab, setActiveTab] = useState<'STRATEGIES' | 'SETTINGS' | 'LOGS'>('STRATEGIES');

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Master Switch */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-purple-600" />
              Automated Algo Trading Engine
            </h2>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
              config.active 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-300'
            }`}>
              {config.active ? 'ENGINE RUNNING' : 'ENGINE PAUSED'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed">
            Execute high-probability Indian market strategies automatically without emotional hesitation. 
            Enforces strict capital limits, auto-trailing stop losses, and a daily loss kill-switch.
          </p>
        </div>

        {/* Master Active / Pause & Mode Selector with rich colorful buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switch: Auto-Pilot vs 1-Click Manual */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => onUpdateConfig({ mode: 'AUTO_PILOT' })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                config.mode === 'AUTO_PILOT'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Full Auto Bot</span>
            </button>
            <button
              onClick={() => onUpdateConfig({ mode: 'MANUAL_1CLICK' })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                config.mode === 'MANUAL_1CLICK'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1-Click Approval</span>
            </button>
          </div>

          {/* Master Start / Stop Button with bold color */}
          <button
            onClick={() => onUpdateConfig({ active: !config.active })}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition-all ${
              config.active
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {config.active ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Engine</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Algo Engine</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs with colorful active styling */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('STRATEGIES')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'STRATEGIES'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Strategies ({strategies.filter(s => s.enabled).length}/{strategies.length})
        </button>
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'SETTINGS'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Risk &amp; Target Guardrails
        </button>
        <button
          onClick={() => setActiveTab('LOGS')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'LOGS'
              ? 'border-purple-600 text-purple-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Live Scanner Log ({logs.length})
        </button>
      </div>

      {/* View 1: Strategies Grid */}
      {activeTab === 'STRATEGIES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strat) => (
              <div
                key={strat.id}
                className={`rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  strat.enabled
                    ? 'bg-white border-slate-300'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{strat.name}</h3>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Trigger Window: {strat.triggerTime}
                      </div>
                    </div>

                    {/* Enable Toggle Switch */}
                    <button
                      onClick={() => onToggleStrategy(strat.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                        strat.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          strat.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    {strat.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Historical Win Rate</span>
                      <span className="font-black text-emerald-700 font-mono tabular-nums text-sm">{strat.winRate}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Avg Edge per Trade</span>
                      <span className="font-black text-blue-700 font-mono tabular-nums text-sm">{strat.avgProfitPerTrade}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  {strat.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Simulation Test Button with colorful button */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-700">
              <strong className="text-slate-900 block text-sm">Test Algorithm Order Execution</strong>
              Fire a simulated high-probability trigger to see paper execution, stop loss, and target placement in real-time.
            </div>
            <button
              onClick={onTestTriggerAlgo}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 whitespace-nowrap shadow-sm transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Simulate Trigger Now</span>
            </button>
          </div>
        </div>
      )}

      {/* View 2: Risk & Guardrail Settings */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Beginner Safety &amp; Risk Management Rules
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              These hard stops prevent big drawdowns. If market moves against you, the engine automatically exits to preserve your capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            
            {/* Daily Loss Kill-Switch */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-rose-800 block">
                Daily Loss Kill-Switch (₹)
              </label>
              <p className="text-[11px] text-slate-500 font-medium">
                Trading terminates immediately if daily loss hits this limit.
              </p>
              <input
                type="number"
                value={config.maxDailyLoss}
                onChange={(e) => onUpdateConfig({ maxDailyLoss: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 font-black focus:outline-none focus:border-rose-500 shadow-2xs"
              />
              <span className="text-[10px] text-slate-500 font-medium">Recommended for beginners: ₹2,000 - ₹3,000</span>
            </div>

            {/* Target % */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-emerald-800 block">
                Target Profit %
              </label>
              <p className="text-[11px] text-slate-500 font-medium">
                Automatic profit booking threshold per trade.
              </p>
              <input
                type="number"
                value={config.targetPercent}
                onChange={(e) => onUpdateConfig({ targetPercent: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 font-black focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
              <span className="text-[10px] text-slate-500 font-medium">Stock Intraday: 2.5% | Options: 15% - 25%</span>
            </div>

            {/* Stop Loss % */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-amber-800 block">
                Stop Loss %
              </label>
              <p className="text-[11px] text-slate-500 font-medium">
                Fixed exit price protection to prevent blowout.
              </p>
              <input
                type="number"
                value={config.stopLossPercent}
                onChange={(e) => onUpdateConfig({ stopLossPercent: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 font-black focus:outline-none focus:border-amber-500 shadow-2xs"
              />
              <span className="text-[10px] text-slate-500 font-medium">Ensures 1:2 risk to reward ratio</span>
            </div>

            {/* Trailing Stop Loss Step */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-blue-800 block">
                Trailing SL Step %
              </label>
              <p className="text-[11px] text-slate-500 font-medium">
                For every 2% the stock rises, SL automatically moves up by 1.5%.
              </p>
              <input
                type="number"
                value={config.trailingSlStep}
                onChange={(e) => onUpdateConfig({ trailingSlStep: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 font-black focus:outline-none focus:border-blue-500 shadow-2xs"
              />
              <span className="text-[10px] text-slate-500 font-medium">Locks in your hard-earned green profits!</span>
            </div>

            {/* Capital Allocation per Trade */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-900 block">
                Capital per Trade (₹)
              </label>
              <p className="text-[11px] text-slate-500 font-medium">
                Maximum fund utilized on any single order.
              </p>
              <input
                type="number"
                value={config.capitalPerTrade}
                onChange={(e) => onUpdateConfig({ capitalPerTrade: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 font-black focus:outline-none focus:border-purple-500 shadow-2xs"
              />
              <span className="text-[10px] text-slate-500 font-medium">Never exceed 15% of total account capital</span>
            </div>

            {/* Auto Square-Off Time */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-900 block">
                Auto Square-Off (IST)
              </label>
              <p className="text-[11px] text-slate-500 font-medium">
                All open MIS intraday positions closed before broker penalty.
              </p>
              <input
                type="text"
                value={config.autoSquareOffTime}
                onChange={(e) => onUpdateConfig({ autoSquareOffTime: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 font-black focus:outline-none focus:border-purple-500 shadow-2xs"
              />
              <span className="text-[10px] text-slate-500 font-medium">Standard NSE intraday cut-off: 03:15 PM</span>
            </div>

          </div>
        </div>
      )}

      {/* View 3: Live Scanner Log */}
      {activeTab === 'LOGS' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Real-time Algorithmic Trigger Logs
            </span>
            <span className="text-[11px] text-slate-500">
              Auto-updating stream
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No algo events recorded yet. Start the engine or click &quot;Simulate Trigger Now&quot;.
              </div>
            ) : (
              logs.map((log) => {
                let badgeColor = 'text-slate-700 bg-slate-100 border-slate-200';
                if (log.type === 'ORDER_FIRED') badgeColor = 'text-emerald-800 bg-emerald-100 border-emerald-300';
                if (log.type === 'TARGET_HIT') badgeColor = 'text-blue-800 bg-blue-100 border-blue-300';
                if (log.type === 'SL_HIT' || log.type === 'SAFETY_HALT') badgeColor = 'text-rose-800 bg-rose-100 border-rose-300';
                if (log.type === 'SL_TRAIL') badgeColor = 'text-amber-800 bg-amber-100 border-amber-300';

                return (
                  <div key={log.id} className="p-3.5 hover:bg-slate-50 flex items-start gap-3">
                    <span className="text-slate-500 text-[11px] shrink-0 pt-0.5">{log.time}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-sans font-bold border shrink-0 ${badgeColor}`}>
                      {log.type}
                    </span>
                    <span className="text-slate-800 text-xs flex-1 font-medium">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
};
