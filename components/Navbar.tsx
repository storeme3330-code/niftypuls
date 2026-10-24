'use client';

import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  SlidersHorizontal, 
  Wallet, 
  HelpCircle, 
  PowerOff,
  Flame,
  LineChart,
  Layers,
  ArrowUpRight,
  Globe,
  Bell
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'premarket' | 'growingshares' | 'options' | 'chart' | 'algo' | 'portfolio';
  setActiveTab: (tab: 'premarket' | 'growingshares' | 'options' | 'chart' | 'algo' | 'portfolio') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  demoBalance: number;
  openPositionsCount: number;
  alertsCount: number;
  onOpenBrokerModal: () => void;
  onOpenAlgoModal: () => void;
  onOpenBeginnerModal: () => void;
  onOpenDeployModal: () => void;
  onOpenAlertsDrawer: () => void;
  onPanicSquareOff: () => void;
  activeBrokerName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDemoMode,
  setIsDemoMode,
  demoBalance,
  openPositionsCount,
  alertsCount,
  onOpenBrokerModal,
  onOpenAlgoModal,
  onOpenBeginnerModal,
  onOpenDeployModal,
  onOpenAlertsDrawer,
  onPanicSquareOff,
  activeBrokerName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Wordmark Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('premarket')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                  NiftyPulse <span className="text-emerald-700 text-xs px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 font-bold">AI</span>
                </div>
                <div className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold mt-1">
                  NSE · BSE · Algo Terminal
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('premarket')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'premarket'
                  ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-600" />
              <span>9:00 AM Pre-Market</span>
            </button>

            <button
              onClick={() => setActiveTab('growingshares')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'growingshares'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>Growing Share List</span>
            </button>

            <button
              onClick={() => setActiveTab('options')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'options'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>Option Chain &amp; Scalp</span>
            </button>

            <button
              onClick={() => setActiveTab('chart')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'chart'
                  ? 'bg-blue-50 text-blue-800 border border-blue-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LineChart className="w-4 h-4 text-blue-600" />
              <span>TradingView Chart</span>
            </button>

            <button
              onClick={() => setActiveTab('algo')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'algo'
                  ? 'bg-purple-50 text-purple-800 border border-purple-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              <span>Algo Trade Bot</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'portfolio'
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wallet className="w-4 h-4 text-amber-600" />
              <span>Portfolio</span>
              {openPositionsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {openPositionsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Actions (Deploy to Netlify, Alerts Bell, Broker, Demo Toggle) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Live Share Growth Alerts Bell Button */}
            <button
              onClick={onOpenAlertsDrawer}
              title="Growing Share Alert Messages"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-xs">
                  {alertsCount}
                </span>
              )}
            </button>

            {/* Beginner Quick Guide button */}
            <button
              onClick={onOpenBeginnerModal}
              title="Beginner Guide & Calculator"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
            </button>

            {/* Deploy to Netlify Button */}
            <button
              onClick={onOpenDeployModal}
              title="Publish to Netlify via GitHub"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deploy Netlify</span>
            </button>

            {/* Mode Selector (Demo vs Real) */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shadow-xs ${
                isDemoMode
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">
                {isDemoMode ? 'Demo Paper' : 'Live Mode'}
              </span>
              <span className="font-mono tabular-nums text-[11px] font-extrabold text-emerald-700">
                {isDemoMode ? `₹${(demoBalance / 100000).toFixed(2)}L` : 'Live'}
              </span>
            </button>

            {/* Broker Attachment Hub Button */}
            <button
              onClick={onOpenBrokerModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="truncate max-w-[90px] sm:max-w-[120px]">{activeBrokerName}</span>
            </button>

            {/* Emergency Panic Square-off button (Visible if open positions) */}
            {openPositionsCount > 0 && (
              <button
                onClick={onPanicSquareOff}
                title="Panic Exit All - Instantly Square Off All Active Positions"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Exit All</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-200 gap-1.5 no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('premarket')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'premarket' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600'
            }`}
          >
            Pre-Market
          </button>
          <button
            onClick={() => setActiveTab('growingshares')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'growingshares' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'
            }`}
          >
            Growing Shares
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'options' ? 'bg-cyan-100 text-cyan-900 font-bold' : 'text-slate-600'
            }`}
          >
            Options Scalp
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'chart' ? 'bg-blue-100 text-blue-900 font-bold' : 'text-slate-600'
            }`}
          >
            Charts
          </button>
          <button
            onClick={() => setActiveTab('algo')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'algo' ? 'bg-purple-100 text-purple-900 font-bold' : 'text-slate-600'
            }`}
          >
            Algo Bot
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'portfolio' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            Portfolio ({openPositionsCount})
          </button>
        </div>
      </div>
    </header>
  );
};
