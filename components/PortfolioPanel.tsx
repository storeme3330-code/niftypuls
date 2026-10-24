'use client';

import React, { useState } from 'react';
import { Position, Order } from '@/lib/types';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PowerOff, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

interface PortfolioPanelProps {
  positions: Position[];
  orders: Order[];
  demoBalance: number;
  availableMargin: number;
  usedMargin: number;
  realizedPnl: number;
  unrealizedPnl: number;
  maxDailyLoss: number;
  isDemoMode: boolean;
  onSquareOffPosition: (positionId: string) => void;
  onPanicSquareOffAll: () => void;
  onResetDemoBalance: () => void;
}

export const PortfolioPanel: React.FC<PortfolioPanelProps> = ({
  positions,
  orders,
  demoBalance,
  availableMargin,
  usedMargin,
  realizedPnl,
  unrealizedPnl,
  maxDailyLoss,
  isDemoMode,
  onSquareOffPosition,
  onPanicSquareOffAll,
  onResetDemoBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'POSITIONS' | 'ORDERS'>('POSITIONS');

  const totalPnl = realizedPnl + unrealizedPnl;
  const isPnlPositive = totalPnl >= 0;

  const closedOrdersWithPnl = orders.filter(o => o.realizedPnl !== undefined);
  const winningTrades = closedOrdersWithPnl.filter(o => (o.realizedPnl || 0) > 0).length;
  const winRate = closedOrdersWithPnl.length > 0 
    ? Math.round((winningTrades / closedOrdersWithPnl.length) * 100) 
    : 80;

  return (
    <div className="space-y-6">
      
      {/* Portfolio Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Balance / Margin Available */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>{isDemoMode ? 'Demo Virtual Fund' : 'Broker Balance'}</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            ₹{availableMargin.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2 flex items-center justify-between">
            <span>Used Margin: ₹{usedMargin.toLocaleString('en-IN')}</span>
            {isDemoMode && (
              <button
                onClick={onResetDemoBalance}
                title="Reset virtual balance back to ₹10,00,000"
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset 10L</span>
              </button>
            )}
          </div>
        </div>

        {/* Total Today's P&L */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Today&apos;s Net P&amp;L</span>
            {isPnlPositive ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-rose-600" />}
          </div>
          <div className={`text-2xl font-black font-mono tabular-nums ${isPnlPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isPnlPositive ? '+' : ''}₹{totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2 flex items-center justify-between">
            <span>Realized: ₹{realizedPnl.toFixed(0)}</span>
            <span>Unrealized: ₹{unrealizedPnl.toFixed(0)}</span>
          </div>
        </div>

        {/* Win Rate & Performance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Algo Win Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono tabular-nums">
            {winRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            {closedOrdersWithPnl.length} Trades executed today
          </div>
        </div>

        {/* Risk Limit Consumed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Daily Loss Limit</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            ₹{maxDailyLoss.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            Kill-switch: <span className="text-emerald-700 font-extrabold">Protected</span>
          </div>
        </div>

      </div>

      {/* Tabs & Emergency Panic Exit */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('POSITIONS')}
            className={`font-bold pb-2 border-b-2 transition-colors ${
              activeTab === 'POSITIONS'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Open Positions ({positions.length})
          </button>
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`font-bold pb-2 border-b-2 transition-colors ${
              activeTab === 'ORDERS'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Order History ({orders.length})
          </button>
        </div>

        {positions.length > 0 && (
          <button
            onClick={onPanicSquareOffAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition-colors"
          >
            <PowerOff className="w-3.5 h-3.5" />
            <span>Panic Square-Off All ({positions.length})</span>
          </button>
        )}
      </div>

      {/* View 1: Active Positions Table */}
      {activeTab === 'POSITIONS' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          {positions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-2">
              <p className="text-slate-800 font-bold text-sm">No open positions right now.</p>
              <p className="text-slate-500 font-medium">
                Go to the Pre-Market Radar or Option Chain tab to place a 1-click trade or run the Algo Bot!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Contract / Stock</th>
                    <th className="px-3 py-3.5">Type</th>
                    <th className="px-3 py-3.5 text-right">Qty</th>
                    <th className="px-3 py-3.5 text-right">Avg Price</th>
                    <th className="px-3 py-3.5 text-right">LTP (₹)</th>
                    <th className="px-3 py-3.5 text-right">Target / SL</th>
                    <th className="px-3 py-3.5 text-right">P&amp;L (₹)</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {positions.map((pos) => {
                    const isProfit = pos.pnl >= 0;
                    return (
                      <tr key={pos.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-extrabold text-slate-900 text-sm">{pos.displayName}</div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {pos.product} · Entered {pos.timestamp}
                          </div>
                        </td>

                        <td className="px-3 py-3.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                            pos.type === 'BUY' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {pos.type}
                          </span>
                        </td>

                        <td className="px-3 py-3.5 text-right font-mono tabular-nums font-bold text-slate-800">
                          {pos.qty}
                        </td>

                        <td className="px-3 py-3.5 text-right font-mono tabular-nums text-slate-600 font-medium">
                          ₹{pos.buyPrice.toFixed(2)}
                        </td>

                        <td className="px-3 py-3.5 text-right font-mono tabular-nums font-extrabold text-slate-900">
                          ₹{pos.currentPrice.toFixed(2)}
                        </td>

                        <td className="px-3 py-3.5 text-right font-mono tabular-nums text-[11px] font-semibold">
                          <div className="text-emerald-700">Tgt: ₹{pos.target.toFixed(2)}</div>
                          <div className="text-rose-700">SL: ₹{pos.stopLoss.toFixed(2)}</div>
                        </td>

                        <td className="px-3 py-3.5 text-right">
                          <div className={`font-mono tabular-nums font-black text-sm ${isProfit ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isProfit ? '+' : ''}₹{pos.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className={`text-[10px] font-mono tabular-nums font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isProfit ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => onSquareOffPosition(pos.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-2xs transition-colors"
                          >
                            Square Off
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View 2: Executed Orders Table */}
      {activeTab === 'ORDERS' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No orders executed yet in this session.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Time</th>
                    <th className="px-3 py-3.5">Contract / Symbol</th>
                    <th className="px-3 py-3.5">Type</th>
                    <th className="px-3 py-3.5 text-right">Qty</th>
                    <th className="px-3 py-3.5 text-right">Executed Price</th>
                    <th className="px-3 py-3.5">Trigger Reason</th>
                    <th className="px-3 py-3.5 text-right">Realized P&amp;L</th>
                    <th className="px-4 py-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {ord.timestamp}
                      </td>
                      <td className="px-3 py-3 font-extrabold text-slate-900">
                        {ord.displayName}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                          ord.type === 'BUY' ? 'text-emerald-800 bg-emerald-50 border border-emerald-200' : 'text-rose-800 bg-rose-50 border border-rose-200'
                        }`}>
                          {ord.type}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums font-semibold">
                        {ord.qty}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        ₹{ord.price.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-slate-600 text-[11px] font-medium">
                        {ord.reason}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums font-extrabold">
                        {ord.realizedPnl !== undefined ? (
                          <span className={ord.realizedPnl >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                            {ord.realizedPnl >= 0 ? '+' : ''}₹{ord.realizedPnl.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
