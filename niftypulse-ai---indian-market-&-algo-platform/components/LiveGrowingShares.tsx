'use client';

import React, { useState } from 'react';
import { StockItem, StockCategory } from '@/lib/types';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Sparkles, 
  Eye, 
  Zap, 
  Table as TableIcon,
  LayoutGrid,
  Flame
} from 'lucide-react';

interface LiveGrowingSharesProps {
  stocks: StockItem[];
  onOpenAiModal: (stock: StockItem) => void;
  onTradeStock: (stock: StockItem, type: 'BUY' | 'SELL') => void;
  onSelectStockForChart: (symbol: string) => void;
  onDeployAlgo: (stock: StockItem) => void;
}

export const LiveGrowingShares: React.FC<LiveGrowingSharesProps> = ({
  stocks,
  onOpenAiModal,
  onTradeStock,
  onSelectStockForChart,
  onDeployAlgo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | StockCategory>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');
  const [sortBy, setSortBy] = useState<'change' | 'volumeRatio' | 'confidence'>('change');

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch = 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedFilter === 'ALL') return true;
    return stock.category === selectedFilter;
  }).sort((a, b) => {
    if (sortBy === 'change') return b.changePercent - a.changePercent;
    if (sortBy === 'volumeRatio') return b.volumeRatio - a.volumeRatio;
    return b.confidence - a.confidence;
  });

  return (
    <div className="space-y-5">
      
      {/* Title & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            Live Growing Shares Radar (NSE &amp; BSE)
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time algorithmic screener tracking volume surges, VWAP breakouts, and Supertrend confirmations.
          </p>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search symbol (e.g. TATA, ZOMATO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-52 sm:w-64 font-medium"
            />
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('TABLE')}
              title="Table View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('CARDS')}
              title="Cards View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'CARDS' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            All Growing ({stocks.length})
          </button>
          <button
            onClick={() => setSelectedFilter('PRE_MARKET_GAP')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedFilter === 'PRE_MARKET_GAP'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Pre-Market Gap Leads
          </button>
          <button
            onClick={() => setSelectedFilter('INTRADAY_MOMENTUM')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedFilter === 'INTRADAY_MOMENTUM'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Intraday Momentum
          </button>
          <button
            onClick={() => setSelectedFilter('VOLUME_SURGE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedFilter === 'VOLUME_SURGE'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Volume Surge (&gt;2.5x)
          </button>
          <button
            onClick={() => setSelectedFilter('FNO_LEADERS')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedFilter === 'FNO_LEADERS'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            F&amp;O Leaders
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 font-semibold rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 shadow-2xs"
          >
            <option value="change">Top % Gainers</option>
            <option value="volumeRatio">Highest Volume Spike</option>
            <option value="confidence">Algo Confidence</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table or Cards View */}
      {viewMode === 'TABLE' ? (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Stock &amp; Sector</th>
                  <th scope="col" className="px-3 py-3.5 text-right">LTP (₹)</th>
                  <th scope="col" className="px-3 py-3.5 text-right">% Change</th>
                  <th scope="col" className="px-3 py-3.5 text-right">Volume Spike</th>
                  <th scope="col" className="px-3 py-3.5 text-center">VWAP / RSI</th>
                  <th scope="col" className="px-3 py-3.5 text-center">Supertrend</th>
                  <th scope="col" className="px-3 py-3.5">Catalyst &amp; Rationale</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStocks.map((stock) => {
                  const isPositive = stock.change >= 0;
                  return (
                    <tr 
                      key={stock.symbol}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Stock & Sector */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectStockForChart(stock.symbol)}
                            className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors hover:underline text-left text-sm"
                          >
                            {stock.symbol}
                          </button>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {stock.exchange}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[170px] font-medium">
                          {stock.name} · <span className="text-slate-400">{stock.sector}</span>
                        </div>
                      </td>

                      {/* LTP */}
                      <td className="px-3 py-3.5 text-right font-mono tabular-nums font-bold text-slate-900 text-sm">
                        ₹{stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Change % */}
                      <td className="px-3 py-3.5 text-right font-mono tabular-nums font-bold">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-extrabold ${isPositive ? 'text-emerald-800 bg-emerald-50' : 'text-rose-800 bg-rose-50'}`}>
                          {isPositive ? <TrendingUp className="w-3.5 h-3.5 inline" /> : <TrendingDown className="w-3.5 h-3.5 inline" />}
                          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </td>

                      {/* Volume Multiplier */}
                      <td className="px-3 py-3.5 text-right">
                        <div className="font-mono tabular-nums font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                          {stock.volumeRatio.toFixed(1)}x
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {(stock.volume / 100000).toFixed(1)}L shares
                        </div>
                      </td>

                      {/* VWAP / RSI */}
                      <td className="px-3 py-3.5 text-center font-mono tabular-nums">
                        <div className="text-slate-800 font-bold">
                          ₹{stock.vwap.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold">
                          RSI: {stock.rsi.toFixed(1)}
                        </div>
                      </td>

                      {/* Supertrend */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 border border-emerald-300 text-emerald-800">
                          {stock.supertrend}
                        </span>
                      </td>

                      {/* Catalyst & Rationale */}
                      <td className="px-3 py-3.5 max-w-xs">
                        <div className="text-[11px] text-slate-600 line-clamp-2 font-medium">
                          {stock.catalyst}
                        </div>
                      </td>

                      {/* Actions with distinct rich colors */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Purple AI button */}
                          <button
                            onClick={() => onOpenAiModal(stock)}
                            title="AI Plain-English Trade Breakdown"
                            className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-2xs transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {/* Blue Chart button */}
                          <button
                            onClick={() => onSelectStockForChart(stock.symbol)}
                            title="Open TradingView Chart"
                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Amber Algo button */}
                          <button
                            onClick={() => onDeployAlgo(stock)}
                            title="Deploy Algo Bot for this Stock"
                            className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-2xs transition-colors"
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </button>

                          {/* Emerald Buy button */}
                          <button
                            onClick={() => onTradeStock(stock, 'BUY')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors"
                          >
                            Buy MIS
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map((stock) => {
            const isPositive = stock.change >= 0;
            return (
              <div
                key={stock.symbol}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {stock.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate max-w-[170px]">
                        {stock.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-slate-900 font-mono tabular-nums text-sm">
                        ₹{stock.ltp.toFixed(2)}
                      </div>
                      <div className={`font-mono tabular-nums text-xs font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center my-3 border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Vol Surge</span>
                      <span className="font-bold text-amber-700 font-mono tabular-nums">{stock.volumeRatio.toFixed(1)}x</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">VWAP</span>
                      <span className="font-bold text-slate-800 font-mono tabular-nums">₹{stock.vwap.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">RSI</span>
                      <span className="font-bold text-emerald-700 font-mono tabular-nums">{stock.rsi.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {stock.catalyst}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenAiModal(stock)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Plan</span>
                  </button>

                  <button
                    onClick={() => onSelectStockForChart(stock.symbol)}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onTradeStock(stock, 'BUY')}
                    className="flex-1 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center justify-center gap-1"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Buy MIS</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
