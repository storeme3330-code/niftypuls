'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  HelpCircle, 
  BookOpen, 
  Coins, 
} from 'lucide-react';

interface BeginnerToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerToolsModal: React.FC<BeginnerToolsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'CALCULATOR' | 'GLOSSARY' | 'TAXES'>('CALCULATOR');

  // Calculator inputs
  const [totalCapital, setTotalCapital] = useState<number>(50000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [entryPrice, setEntryPrice] = useState<number>(985);
  const [stopLossPrice, setStopLossPrice] = useState<number>(970);

  if (!isOpen) return null;

  // Calculation math
  const maxRiskAmount = (totalCapital * riskPercent) / 100;
  const riskPerShare = Math.max(0.1, entryPrice - stopLossPrice);
  const calculatedQty = Math.floor(maxRiskAmount / riskPerShare);
  const target1Price = entryPrice + (riskPerShare * 2); // 1:2
  const profitAtTarget = calculatedQty * (riskPerShare * 2);

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

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Beginner Trader Toolkit &amp; Guide</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Simple mathematical tools and practical rules designed to protect beginners from common Indian market mistakes.
          </p>
        </div>

        {/* Sub-tabs with colorful active tab styling */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold mb-4">
          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'CALCULATOR'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>Position Size Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('GLOSSARY')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'GLOSSARY'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Trading Cheat Sheet</span>
          </button>
          <button
            onClick={() => setActiveTab('TAXES')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'TAXES'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Brokerage &amp; STT</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
          
          {/* Tab 1: Position Size Calculator */}
          {activeTab === 'CALCULATOR' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-blue-950 font-medium">
                <span className="font-extrabold text-blue-900 block mb-0.5">Golden Rule of Professional Trading:</span>
                Never guess how many shares to buy. Determine how much money you can afford to lose first, and let math calculate your quantity.
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-[11px] text-slate-600 font-bold block mb-1">Your Total Capital (₹)</label>
                  <input
                    type="number"
                    value={totalCapital}
                    onChange={(e) => setTotalCapital(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-bold block mb-1">Max Risk per Trade (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-500 font-medium">Recommended: 1% to 2%</span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-bold block mb-1">Planned Entry Price (₹)</label>
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-bold block mb-1">Stop-Loss Price (₹)</label>
                  <input
                    type="number"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-600 shadow-2xs"
                  />
                </div>
              </div>

              {/* Math Output Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-xs">
                <div className="text-slate-900 font-extrabold border-b border-slate-100 pb-2">
                  Automated Sizing Recommendations:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Safe Quantity</span>
                    <span className="text-xl font-black text-emerald-700 font-mono tabular-nums">{calculatedQty}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">shares</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Max Loss (₹)</span>
                    <span className="text-xl font-black text-rose-700 font-mono tabular-nums">₹{maxRiskAmount.toFixed(0)}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">if SL hits</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">1:2 Target (₹)</span>
                    <span className="text-xl font-black text-blue-700 font-mono tabular-nums">₹{target1Price.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">+₹{(riskPerShare * 2).toFixed(1)}/share</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target Gain (₹)</span>
                    <span className="text-xl font-black text-emerald-700 font-mono tabular-nums">+₹{profitAtTarget.toFixed(0)}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">2x your risk</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Glossary & Cheat Sheet */}
          {activeTab === 'GLOSSARY' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold text-emerald-800 block text-xs">What is MIS vs CNC?</span>
                <p className="text-slate-700 text-[11px] mt-1 leading-relaxed font-medium">
                  <strong>MIS (Margin Intraday Square-off):</strong> Buying for today only. You get 5x intraday leverage, but you MUST exit before 3:15 PM IST.
                  <br />
                  <strong>CNC (Cash n Carry):</strong> Delivery buying. You pay 100% money and can hold for months or years.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold text-blue-800 block text-xs">Options: Call (CE) vs Put (PE)</span>
                <p className="text-slate-700 text-[11px] mt-1 leading-relaxed font-medium">
                  <strong>Call (CE):</strong> Buy when you expect NIFTY or a stock to grow UP.
                  <br />
                  <strong>Put (PE):</strong> Buy when you expect NIFTY or a stock to fall DOWN.
                  <br />
                  <strong>Strike Price:</strong> The target level (e.g., NIFTY 24,850 CE).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold text-amber-800 block text-xs">Why Beginners Lose in Options (The Trap)</span>
                <p className="text-slate-700 text-[11px] mt-1 leading-relaxed font-medium">
                  Beginners often buy cheap OTM options priced at ₹5 or ₹10. Due to time decay (Theta), these options almost always expire worthless at ₹0. 
                  Always trade <strong>ATM (At-The-Money)</strong> or <strong>ITM (In-The-Money)</strong> contracts where delta is &gt; 0.50!
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-extrabold text-purple-800 block text-xs">Pre-Market 9:00 - 9:08 AM Advantage</span>
                <p className="text-slate-700 text-[11px] mt-1 leading-relaxed font-medium">
                  The pre-open session matches buyer and seller orders at a single equilibrium price without volatility spikes. 
                  By scanning at 9:10 AM, you see exactly which shares have heavy institutional demand before normal trading begins at 9:15 AM.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Brokerage & Taxes in India */}
          {activeTab === 'TAXES' && (
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-700 font-medium">
              <h4 className="font-bold text-slate-900 text-xs">Indian Market Intraday &amp; Option Charges Breakdown:</h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Brokerage (Zerodha/Groww/Angel):</span>
                  <span className="font-mono text-slate-900 font-bold">Flat ₹20 per executed order</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Securities Transaction Tax (STT):</span>
                  <span className="font-mono text-slate-900 font-bold">0.025% on Intraday Sell · 0.1% on Option Premium</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Exchange Turnover Charge (NSE):</span>
                  <span className="font-mono text-slate-900 font-bold">0.00325% of turnover</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">GST:</span>
                  <span className="font-mono text-slate-900 font-bold">18% on (Brokerage + Exchange fees)</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span className="text-slate-500">Stamp Duty:</span>
                  <span className="font-mono text-slate-900 font-bold">0.003% on Buy orders</span>
                </li>
              </ul>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300 text-[11px] text-emerald-900 font-bold">
                Rule of Thumb: For a 1-lot Nifty option scalp, approximately ₹55–₹60 total round-trip charges apply. Aim for at least 2 points gain to break even after taxes!
              </div>
            </div>
          )}

        </div>

        {/* Footer with colorful button */}
        <div className="pt-4 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition-colors"
          >
            Got It, Back to Trading
          </button>
        </div>

      </div>
    </div>
  );
};
