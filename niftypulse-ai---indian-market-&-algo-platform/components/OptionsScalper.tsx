'use client';

import React, { useState } from 'react';
import { OptionStrikeRow, OptionScalpSignal } from '@/lib/types';
import { 
  Layers, 
  ShieldCheck, 
  Zap, 
} from 'lucide-react';

interface OptionsScalperProps {
  optionChain: OptionStrikeRow[];
  signals: OptionScalpSignal[];
  onTradeOption: (signal: OptionScalpSignal) => void;
  onTradeOptionStrike: (strike: number, type: 'CE' | 'PE', price: number, lotSize: number) => void;
}

export const OptionsScalper: React.FC<OptionsScalperProps> = ({
  optionChain,
  signals,
  onTradeOption,
  onTradeOptionStrike,
}) => {
  const [selectedUnderlying, setSelectedUnderlying] = useState<'NIFTY' | 'BANKNIFTY'>('NIFTY');
  const [activeSubTab, setActiveSubTab] = useState<'SCALP_PICKS' | 'OPTION_CHAIN'>('SCALP_PICKS');
  const [selectedLots, setSelectedLots] = useState<Record<string, number>>({});

  const filteredSignals = signals.filter(s => {
    if (selectedUnderlying === 'NIFTY') return s.underlying === 'NIFTY';
    return s.underlying === 'BANKNIFTY';
  });

  const getLots = (id: string, defaultLotSize: number) => {
    return selectedLots[id] || 1;
  };

  const setLots = (id: string, val: number) => {
    setSelectedLots(prev => ({ ...prev, [id]: Math.max(1, Math.min(10, val)) }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600" />
              Options Scalper &amp; Smart Option Chain
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 font-extrabold border border-cyan-300">
              Beginner Safe Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pre-calculated option buying setups with strict stop-loss, 1:2 risk-reward, and real-time Open Interest (OI) analysis.
          </p>
        </div>

        {/* Index Selector + Mode Tabs with distinct vibrant buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Index Selector */}
          <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setSelectedUnderlying('NIFTY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedUnderlying === 'NIFTY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NIFTY 50 (Lot 75)
            </button>
            <button
              onClick={() => setSelectedUnderlying('BANKNIFTY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedUnderlying === 'BANKNIFTY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BANK NIFTY (Lot 15)
            </button>
          </div>

          {/* Sub-Tab Selector */}
          <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveSubTab('SCALP_PICKS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'SCALP_PICKS' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curated Scalp Picks
            </button>
            <button
              onClick={() => setActiveSubTab('OPTION_CHAIN')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'OPTION_CHAIN' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Option Chain
            </button>
          </div>
        </div>
      </div>

      {/* PCR & Market Sentiment Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-slate-500 font-semibold text-[11px] block">Put-Call Ratio (PCR)</span>
          <div className="text-base font-extrabold text-emerald-700 font-mono tabular-nums mt-1 flex items-center gap-1.5">
            1.28
            <span className="text-[10px] font-bold text-emerald-800 px-1.5 py-0.2 rounded-md bg-emerald-100 border border-emerald-300">
              Bullish Bias
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-slate-500 font-semibold text-[11px] block">Max Pain Strike</span>
          <div className="text-base font-extrabold text-slate-900 font-mono tabular-nums mt-1">
            24,800
            <span className="text-[10px] text-slate-500 font-medium ml-1">(Exp Magnet)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-slate-500 font-semibold text-[11px] block">ATM Strike</span>
          <div className="text-base font-extrabold text-amber-700 font-mono tabular-nums mt-1">
            24,850 CE/PE
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-slate-500 font-semibold text-[11px] block">Call Writers Status</span>
          <div className="text-base font-extrabold text-rose-700 font-mono tabular-nums mt-1">
            Unwinding (-8.5L OI)
          </div>
        </div>
      </div>

      {/* View 1: Curated Option Scalp Signals */}
      {activeSubTab === 'SCALP_PICKS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSignals.map((sig) => {
              const currentLots = getLots(sig.id, sig.lotSize);
              const totalQuantity = currentLots * sig.lotSize;
              const totalCost = totalQuantity * sig.ltp;

              return (
                <div
                  key={sig.id}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 p-5 shadow-xs hover:shadow-md flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Contract Title & Type */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900 tracking-tight">
                            {sig.contract}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                            sig.type === 'CE' 
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {sig.type === 'CE' ? 'CALL (BULLISH)' : 'PUT (BEARISH)'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          Expiry: {sig.expiry} · 1 Lot = {sig.lotSize} Qty
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
                          ₹{sig.ltp.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-extrabold">
                          Confidence: {sig.confidence}%
                        </div>
                      </div>
                    </div>

                    {/* Entry, Target, SL Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center mb-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Buy Zone</span>
                        <span className="font-extrabold text-blue-700 font-mono tabular-nums">{sig.entryZone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Target 1 / 2</span>
                        <span className="font-extrabold text-emerald-700 font-mono tabular-nums">₹{sig.target1} / ₹{sig.target2}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Stop Loss</span>
                        <span className="font-extrabold text-rose-700 font-mono tabular-nums">₹{sig.stopLoss}</span>
                      </div>
                    </div>

                    {/* Plain-English Rationale */}
                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 leading-relaxed font-medium">
                      <span className="font-bold text-slate-900">Strategy Logic: </span>
                      {sig.rationale}
                    </div>

                    {/* Lot Sizing & Capital Calculation */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 font-semibold">Lots:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setLots(sig.id, currentLots - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 flex items-center justify-center font-bold shadow-2xs"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-extrabold font-mono text-slate-900">
                            {currentLots}
                          </span>
                          <button
                            onClick={() => setLots(sig.id, currentLots + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 flex items-center justify-center font-bold shadow-2xs"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">({totalQuantity} Qty)</span>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-semibold">Required Capital</div>
                        <div className="font-black text-slate-900 font-mono tabular-nums text-sm">
                          ₹{totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Action Button with vibrant colors */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onTradeOption(sig)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-black text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                        sig.type === 'CE'
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                          : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>
                        1-Click Buy {sig.type} ({currentLots} Lot · ₹{totalCost.toFixed(0)})
                      </span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Beginner Golden Rules for Option Trading */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 shadow-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3 Non-Negotiable Rules for Beginner Option Traders:
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 font-medium pl-1">
              <li><strong className="text-slate-900">Never Hold Overnight:</strong> Close all intraday options before 3:15 PM to avoid gap-down and overnight theta decay.</li>
              <li><strong className="text-slate-900">Predefined Stop Loss:</strong> An option contract can lose 50% in minutes if the market turns. Always trade with a system stop loss.</li>
              <li><strong className="text-slate-900">Max 10% Capital per Trade:</strong> If your capital is ₹50,000, never invest more than ₹5,000 to ₹10,000 in a single option trade.</li>
            </ul>
          </div>
        </div>
      )}

      {/* View 2: Full Live Option Chain */}
      {activeSubTab === 'OPTION_CHAIN' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-extrabold">CALLS (CE - Bullish)</span>
              <span>← Strike Price →</span>
              <span className="text-rose-700 font-extrabold">PUTS (PE - Bearish)</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Lot Size: 75 · Weekly Expiry
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 text-left">Call OI</th>
                  <th className="px-2 py-3">Call Delta</th>
                  <th className="px-3 py-3 text-right">Call LTP</th>
                  <th className="px-3 py-3 text-center bg-slate-200 font-black text-slate-900">STRIKE</th>
                  <th className="px-3 py-3 text-left">Put LTP</th>
                  <th className="px-2 py-3">Put Delta</th>
                  <th className="px-3 py-3 text-right">Put OI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {optionChain.map((row) => {
                  const isAtm = row.isAtm;
                  return (
                    <tr
                      key={row.strikePrice}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isAtm ? 'bg-amber-50 font-bold' : ''
                      }`}
                    >
                      {/* Call OI */}
                      <td className="px-3 py-2.5 text-left font-mono tabular-nums text-slate-600 font-medium">
                        {(row.call.oi / 100000).toFixed(1)}L
                      </td>

                      {/* Call Delta */}
                      <td className="px-2 py-2.5 font-mono tabular-nums text-blue-700 font-bold">
                        {row.call.greeks.delta.toFixed(2)}
                      </td>

                      {/* Call LTP & Buy Button */}
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono tabular-nums font-bold text-emerald-700">
                            ₹{row.call.ltp.toFixed(2)}
                          </span>
                          <button
                            onClick={() => onTradeOptionStrike(row.strikePrice, 'CE', row.call.ltp, 75)}
                            className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                          >
                            Buy CE
                          </button>
                        </div>
                      </td>

                      {/* Strike Price */}
                      <td className={`px-4 py-2.5 font-mono tabular-nums font-extrabold text-center border-x border-slate-200 ${
                        isAtm ? 'text-amber-900 bg-amber-100' : 'text-slate-900 bg-slate-50'
                      }`}>
                        {row.strikePrice}
                        {isAtm && <span className="block text-[9px] text-amber-800 uppercase font-sans font-extrabold">ATM</span>}
                      </td>

                      {/* Put LTP & Buy Button */}
                      <td className="px-3 py-2.5 text-left">
                        <div className="flex items-center justify-start gap-2">
                          <button
                            onClick={() => onTradeOptionStrike(row.strikePrice, 'PE', row.put.ltp, 75)}
                            className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
                          >
                            Buy PE
                          </button>
                          <span className="font-mono tabular-nums font-bold text-rose-700">
                            ₹{row.put.ltp.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      {/* Put Delta */}
                      <td className="px-2 py-2.5 font-mono tabular-nums text-blue-700 font-bold">
                        {row.put.greeks.delta.toFixed(2)}
                      </td>

                      {/* Put OI */}
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-600 font-medium">
                        {(row.put.oi / 100000).toFixed(1)}L
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
