'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  StockItem, 
  MarketIndex, 
  OptionStrikeRow, 
  OptionScalpSignal, 
  BrokerAccount, 
  AlgoConfig, 
  AlgoStrategy, 
  AlgoLogEntry, 
  Position, 
  Order,
  GrowthAlertMessage
} from '@/lib/types';
import { 
  INITIAL_INDICES, 
  INITIAL_STOCKS, 
  NIFTY_OPTION_CHAIN, 
  OPTION_SCALP_SIGNALS, 
  SUPPORTED_BROKERS, 
  DEFAULT_ALGO_STRATEGIES 
} from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { MarketTicker } from '@/components/MarketTicker';
import { PreMarketScanner } from '@/components/PreMarketScanner';
import { LiveGrowingShares } from '@/components/LiveGrowingShares';
import { OptionsScalper } from '@/components/OptionsScalper';
import { TradingViewWidget } from '@/components/TradingViewWidget';
import { AlgoEnginePanel } from '@/components/AlgoEnginePanel';
import { PortfolioPanel } from '@/components/PortfolioPanel';
import { BrokerConnectModal } from '@/components/BrokerConnectModal';
import { AiTradeModal } from '@/components/AiTradeModal';
import { BeginnerToolsModal } from '@/components/BeginnerToolsModal';
import { GrowthAlertPopup } from '@/components/GrowthAlertPopup';
import { AlertsInboxDrawer } from '@/components/AlertsInboxDrawer';
import { NetlifyDeployModal } from '@/components/NetlifyDeployModal';
import { playAlertChime } from '@/lib/audioAlert';

export default function Home() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'premarket' | 'growingshares' | 'options' | 'chart' | 'algo' | 'portfolio'>('premarket');
  const [selectedChartSymbol, setSelectedChartSymbol] = useState<string>('NIFTY 50');

  // Market Data State
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [optionChain, setOptionChain] = useState<OptionStrikeRow[]>(NIFTY_OPTION_CHAIN);
  const [signals, setSignals] = useState<OptionScalpSignal[]>(OPTION_SCALP_SIGNALS);

  // Broker & Account State
  const [brokers, setBrokers] = useState<BrokerAccount[]>(SUPPORTED_BROKERS);
  const [activeBrokerId, setActiveBrokerId] = useState<string>('zerodha');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [demoBalance, setDemoBalance] = useState<number>(1000000); // 10 Lakhs INR starting paper capital
  const [usedMargin, setUsedMargin] = useState<number>(18900);
  const [realizedPnl, setRealizedPnl] = useState<number>(3420);

  // Positions & Orders State (Initial sample trade so beginner sees populated state)
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 'pos-init-1',
      symbol: 'TATAMOTORS',
      displayName: 'TATAMOTORS Intraday MIS',
      type: 'BUY',
      product: 'MIS',
      qty: 150,
      buyPrice: 968.00,
      currentPrice: 984.50,
      pnl: 2475.00,
      pnlPercent: 1.70,
      stopLoss: 955.00,
      target: 998.00,
      trailingSl: 975.00,
      timestamp: '09:18:22',
    },
    {
      id: 'pos-init-2',
      symbol: 'NIFTY24850CE',
      displayName: 'NIFTY 24850 CE (Weekly)',
      type: 'BUY',
      product: 'NRML',
      qty: 75,
      buyPrice: 114.00,
      currentPrice: 125.80,
      pnl: 885.00,
      pnlPercent: 10.35,
      stopLoss: 102.00,
      target: 155.00,
      trailingSl: 118.00,
      isOption: true,
      timestamp: '09:22:45',
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-101',
      symbol: 'ZOMATO',
      displayName: 'ZOMATO Intraday MIS',
      type: 'BUY',
      product: 'MIS',
      qty: 500,
      price: 270.00,
      status: 'SQUARED_OFF',
      timestamp: '09:16:10',
      reason: '9:00 AM Pre-Open Gap Breakout Algo',
      realizedPnl: 3420.00,
    },
    {
      id: 'ord-102',
      symbol: 'TATAMOTORS',
      displayName: 'TATAMOTORS Intraday MIS',
      type: 'BUY',
      product: 'MIS',
      qty: 150,
      price: 968.00,
      status: 'FILLED',
      timestamp: '09:18:22',
      reason: 'VWAP Breakout Triggered',
    },
    {
      id: 'ord-103',
      symbol: 'NIFTY24850CE',
      displayName: 'NIFTY 24850 CE (Weekly)',
      type: 'BUY',
      product: 'NRML',
      qty: 75,
      price: 114.00,
      status: 'FILLED',
      timestamp: '09:22:45',
      reason: 'Call Unwinding Scalp Pick',
    }
  ]);

  // Algo Engine State
  const [algoConfig, setAlgoConfig] = useState<AlgoConfig>({
    active: true,
    mode: 'AUTO_PILOT',
    maxDailyLoss: 2500,
    targetPercent: 15,
    stopLossPercent: 7,
    trailingSlStep: 2,
    capitalPerTrade: 15000,
    maxConcurrentTrades: 3,
    autoSquareOffTime: '15:15:00',
    soundAlerts: true,
  });

  const [algoStrategies, setAlgoStrategies] = useState<AlgoStrategy[]>(DEFAULT_ALGO_STRATEGIES);

  const [algoLogs, setAlgoLogs] = useState<AlgoLogEntry[]>([
    {
      id: 'log-1',
      time: '09:08:02',
      type: 'SCAN',
      message: 'Pre-Market 9:00 AM auction settled. Identified 4 gap-up stocks with volume > 2.5x: TATAMOTORS, ZOMATO, BHEL, SUZLON.',
    },
    {
      id: 'log-2',
      time: '09:16:10',
      type: 'ORDER_FIRED',
      message: 'Strategy [9:20 AM Gap Breakout] executed BUY 500 ZOMATO @ ₹270.00.',
    },
    {
      id: 'log-3',
      time: '09:21:40',
      type: 'TARGET_HIT',
      message: 'Target 1 Hit! Squared off ZOMATO @ ₹276.84 (+₹3,420 Realized Profit).',
    },
    {
      id: 'log-4',
      time: '09:22:45',
      type: 'ORDER_FIRED',
      message: 'Strategy [Supertrend Scalper] executed BUY 75 NIFTY 24850 CE @ ₹114.00.',
    },
    {
      id: 'log-5',
      time: '09:26:12',
      type: 'SL_TRAIL',
      message: 'Option price climbed to ₹125.80. Trailing Stop Loss automatically moved up from ₹102 to ₹118.00.',
    }
  ]);

  // Real-time Growing Share Alert Messages State (User request: Share Name FIRST + Buy Price + Sell Target Price)
  const [growthAlerts, setGrowthAlerts] = useState<GrowthAlertMessage[]>([
    {
      id: 'alert-init-1',
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Limited',
      time: '09:24:15',
      buyPrice: 984.50,
      sellTargetPrice: 1012.00,
      stopLossPrice: 970.00,
      potentialProfitPercent: 2.79,
      potentialProfitAmount: 4125,
      catalyst: 'JLR global margin expansion & heavy pre-market block buying',
      volumeSpike: '3.5x Vol Spike',
      confidence: 96,
    },
    {
      id: 'alert-init-2',
      symbol: 'BHEL',
      name: 'Bharat Heavy Electricals',
      time: '09:21:05',
      buyPrice: 312.80,
      sellTargetPrice: 326.50,
      stopLossPrice: 305.00,
      potentialProfitPercent: 4.38,
      potentialProfitAmount: 3420,
      catalyst: 'Wins ₹7,000 Crore Supercritical Thermal order from NTPC',
      volumeSpike: '3.8x Vol Spike',
      confidence: 92,
    }
  ]);

  const [activePopupAlert, setActivePopupAlert] = useState<GrowthAlertMessage | null>({
    id: 'alert-popup-init',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    time: 'Just Now',
    buyPrice: 984.50,
    sellTargetPrice: 1012.00,
    stopLossPrice: 970.00,
    potentialProfitPercent: 2.79,
    potentialProfitAmount: 4125,
    catalyst: 'Breakout above Day High with 3.5x volume surge',
    volumeSpike: '3.5x Vol Spike',
    confidence: 96,
  });

  // Modals state
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [isBeginnerModalOpen, setIsBeginnerModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [aiModalStock, setAiModalStock] = useState<StockItem | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'alert' } | null>(null);

  // Current Active Broker
  const activeBroker = brokers.find(b => b.id === activeBrokerId) || brokers[0];

  // Calculate Unrealized PnL from live positions
  const unrealizedPnl = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const availableMargin = demoBalance - usedMargin + realizedPnl;

  // Show auto-dismiss notification toast
  const triggerNotification = (title: string, desc: string, type: 'success' | 'info' | 'alert' = 'info') => {
    setNotification({ title, desc, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Live market price simulation (Micro-ticks every 2.5s)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      // 1. Tick indices
      setIndices(prev => prev.map(idx => {
        const delta = (Math.random() - 0.48) * (idx.value * 0.0004);
        const newValue = Number((idx.value + delta).toFixed(2));
        const newChange = Number((idx.change + delta).toFixed(2));
        const newPercent = Number(((newChange / (newValue - newChange)) * 100).toFixed(2));
        return {
          ...idx,
          value: newValue,
          change: newChange,
          changePercent: newPercent,
        };
      }));

      // 2. Tick stocks
      setStocks(prev => prev.map(stock => {
        const delta = (Math.random() - 0.46) * (stock.ltp * 0.001);
        const newLtp = Math.max(1, Number((stock.ltp + delta).toFixed(2)));
        const newChange = Number((newLtp - stock.prevClose).toFixed(2));
        const newChangePercent = Number(((newChange / stock.prevClose) * 100).toFixed(2));
        return {
          ...stock,
          ltp: newLtp,
          change: newChange,
          changePercent: newChangePercent,
          lastTickDirection: delta >= 0 ? 'UP' : 'DOWN',
        };
      }));

      // 3. Tick active positions
      setPositions(prev => prev.map(pos => {
        const delta = (Math.random() - 0.47) * (pos.currentPrice * 0.0015);
        const newPrice = Math.max(0.05, Number((pos.currentPrice + delta).toFixed(2)));
        const pnl = Number(((newPrice - pos.buyPrice) * pos.qty).toFixed(2));
        const pnlPercent = Number((((newPrice - pos.buyPrice) / pos.buyPrice) * 100).toFixed(2));
        return {
          ...pos,
          currentPrice: newPrice,
          pnl,
          pnlPercent,
        };
      }));

    }, 2500);

    return () => clearInterval(tickInterval);
  }, []);

  // Recurring Live Growth Surge Alert generator (Every 22 seconds simulates a surging breakout share)
  useEffect(() => {
    const growthScannerInterval = setInterval(() => {
      const candidates = stocks.filter(s => s.changePercent > 1.0);
      if (candidates.length === 0) return;
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      
      const buyPrice = chosen.ltp;
      const targetGainPercent = Number((2.0 + Math.random() * 2.5).toFixed(2));
      const sellTargetPrice = Number((buyPrice * (1 + targetGainPercent / 100)).toFixed(2));
      const stopLossPrice = Number((buyPrice * (1 - (targetGainPercent / 2) / 100)).toFixed(2)); // strict 1:2
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newAlert: GrowthAlertMessage = {
        id: `growth-${Date.now()}`,
        symbol: chosen.symbol,
        name: chosen.name,
        time: timeStr,
        buyPrice,
        sellTargetPrice,
        stopLossPrice,
        potentialProfitPercent: targetGainPercent,
        potentialProfitAmount: Math.round(150 * (sellTargetPrice - buyPrice)),
        catalyst: chosen.catalyst,
        volumeSpike: `${chosen.volumeRatio.toFixed(1)}x Vol Spike`,
        confidence: chosen.confidence,
      };

      setGrowthAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // keep last 20
      setActivePopupAlert(newAlert);
      playAlertChime(); // Sound alert
    }, 22000);

    return () => clearInterval(growthScannerInterval);
  }, [stocks]);

  // Action: 1-Click Buy Stock
  const handleTradeStock = (stock: StockItem, type: 'BUY' | 'SELL') => {
    const calculatedQty = Math.max(1, Math.floor(algoConfig.capitalPerTrade / stock.ltp));
    const marginRequired = calculatedQty * stock.ltp * 0.2; // 5x intraday margin

    if (marginRequired > availableMargin) {
      triggerNotification('Margin Insufficient', 'Please add virtual funds or adjust trade size in Settings.', 'alert');
      return;
    }

    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      symbol: stock.symbol,
      displayName: `${stock.symbol} Intraday MIS`,
      type,
      product: 'MIS',
      qty: calculatedQty,
      buyPrice: stock.ltp,
      currentPrice: stock.ltp,
      pnl: 0,
      pnlPercent: 0,
      stopLoss: Number((stock.ltp * (1 - algoConfig.stopLossPercent / 100)).toFixed(2)),
      target: Number((stock.ltp * (1 + (algoConfig.stopLossPercent * 2) / 100)).toFixed(2)), // 1:2
      trailingSl: Number((stock.ltp * 0.99).toFixed(2)),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      symbol: stock.symbol,
      displayName: `${stock.symbol} Intraday MIS`,
      type,
      product: 'MIS',
      qty: calculatedQty,
      price: stock.ltp,
      status: 'FILLED',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      reason: '1-Click Intraday Execution',
    };

    setPositions(prev => [newPosition, ...prev]);
    setOrders(prev => [newOrder, ...prev]);
    setUsedMargin(prev => prev + marginRequired);

    triggerNotification(
      `Order Executed: ${type} ${calculatedQty} ${stock.symbol}`,
      `Filled @ ₹${stock.ltp.toFixed(2)}. Target & Stop-Loss auto-placed with 1:2 Risk-Reward.`,
      'success'
    );
  };

  // Action: Buy directly from Growth Alert Message
  const handleBuyFromAlert = (alertMsg: GrowthAlertMessage) => {
    const calculatedQty = Math.max(1, Math.floor(algoConfig.capitalPerTrade / alertMsg.buyPrice));
    const marginRequired = calculatedQty * alertMsg.buyPrice * 0.2;

    if (marginRequired > availableMargin) {
      triggerNotification('Margin Insufficient', 'Not enough margin to execute alert trade.', 'alert');
      return;
    }

    const newPosition: Position = {
      id: `pos-alert-${Date.now()}`,
      symbol: alertMsg.symbol,
      displayName: `${alertMsg.symbol} Surge MIS`,
      type: 'BUY',
      product: 'MIS',
      qty: calculatedQty,
      buyPrice: alertMsg.buyPrice,
      currentPrice: alertMsg.buyPrice,
      pnl: 0,
      pnlPercent: 0,
      stopLoss: alertMsg.stopLossPrice,
      target: alertMsg.sellTargetPrice,
      trailingSl: Number((alertMsg.buyPrice * 0.99).toFixed(2)),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    const newOrder: Order = {
      id: `ord-alert-${Date.now()}`,
      symbol: alertMsg.symbol,
      displayName: `${alertMsg.symbol} Surge MIS`,
      type: 'BUY',
      product: 'MIS',
      qty: calculatedQty,
      price: alertMsg.buyPrice,
      status: 'FILLED',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      reason: `Growth Alert Execution (Target ₹${alertMsg.sellTargetPrice})`,
    };

    setPositions(prev => [newPosition, ...prev]);
    setOrders(prev => [newOrder, ...prev]);
    setUsedMargin(prev => prev + marginRequired);
    setActivePopupAlert(null); // dismiss popup on execution

    try {
      confetti({ particleCount: 35, spread: 65, origin: { y: 0.8 } });
    } catch (e) {}

    triggerNotification(
      `Target Order Placed: BUY ${alertMsg.symbol}`,
      `Bought ${calculatedQty} shares @ ₹${alertMsg.buyPrice.toFixed(2)}. Sell Target: ₹${alertMsg.sellTargetPrice.toFixed(2)} (+${alertMsg.potentialProfitPercent.toFixed(1)}%).`,
      'success'
    );
  };

  // Action: 1-Click Buy Option Scalp Signal
  const handleTradeOption = (sig: OptionScalpSignal) => {
    const totalQty = sig.lotSize;
    const totalCost = totalQty * sig.ltp;

    if (totalCost > availableMargin) {
      triggerNotification('Margin Insufficient', `Required: ₹${totalCost.toFixed(0)}, Available: ₹${availableMargin.toFixed(0)}`, 'alert');
      return;
    }

    const newPosition: Position = {
      id: `pos-opt-${Date.now()}`,
      symbol: sig.contract,
      displayName: sig.contract,
      type: 'BUY',
      product: 'NRML',
      qty: totalQty,
      buyPrice: sig.ltp,
      currentPrice: sig.ltp,
      pnl: 0,
      pnlPercent: 0,
      stopLoss: sig.stopLoss,
      target: sig.target1,
      trailingSl: Number((sig.ltp * 0.94).toFixed(2)),
      isOption: true,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    const newOrder: Order = {
      id: `ord-opt-${Date.now()}`,
      symbol: sig.contract,
      displayName: sig.contract,
      type: 'BUY',
      product: 'NRML',
      qty: totalQty,
      price: sig.ltp,
      status: 'FILLED',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      reason: `${sig.type} Scalp Pick (${sig.rationale.slice(0, 40)}...)`,
    };

    setPositions(prev => [newPosition, ...prev]);
    setOrders(prev => [newOrder, ...prev]);
    setUsedMargin(prev => prev + totalCost);

    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch (e) {}

    triggerNotification(
      `Option Scalp Order Filled: ${sig.contract}`,
      `Bought ${totalQty} Qty @ ₹${sig.ltp}. Target ₹${sig.target1}, SL ₹${sig.stopLoss}.`,
      'success'
    );
  };

  // Action: Buy strike directly from Option Chain
  const handleTradeOptionStrike = (strike: number, type: 'CE' | 'PE', price: number, lotSize: number) => {
    const totalQty = lotSize;
    const totalCost = totalQty * price;

    if (totalCost > availableMargin) {
      triggerNotification('Margin Insufficient', 'Not enough margin for this option strike.', 'alert');
      return;
    }

    const contractName = `NIFTY ${strike} ${type}`;
    const newPosition: Position = {
      id: `pos-chain-${Date.now()}`,
      symbol: contractName,
      displayName: contractName,
      type: 'BUY',
      product: 'NRML',
      qty: totalQty,
      buyPrice: price,
      currentPrice: price,
      pnl: 0,
      pnlPercent: 0,
      stopLoss: Number((price * 0.80).toFixed(2)),
      target: Number((price * 1.30).toFixed(2)),
      trailingSl: Number((price * 0.90).toFixed(2)),
      isOption: true,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    const newOrder: Order = {
      id: `ord-chain-${Date.now()}`,
      symbol: contractName,
      displayName: contractName,
      type: 'BUY',
      product: 'NRML',
      qty: totalQty,
      price: price,
      status: 'FILLED',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      reason: `Option Chain Direct ${type} Entry`,
    };

    setPositions(prev => [newPosition, ...prev]);
    setOrders(prev => [newOrder, ...prev]);
    setUsedMargin(prev => prev + totalCost);

    triggerNotification(
      `Option Strike Filled: ${contractName}`,
      `Executed 1 Lot (${totalQty} Qty) @ ₹${price.toFixed(2)}.`,
      'success'
    );
  };

  // Action: Square off single position
  const handleSquareOffPosition = (positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return;

    setRealizedPnl(prev => prev + pos.pnl);
    setPositions(prev => prev.filter(p => p.id !== positionId));
    setUsedMargin(prev => Math.max(0, prev - (pos.qty * pos.buyPrice * (pos.isOption ? 1 : 0.2))));

    const exitOrder: Order = {
      id: `ord-exit-${Date.now()}`,
      symbol: pos.symbol,
      displayName: pos.displayName,
      type: pos.type === 'BUY' ? 'SELL' : 'BUY',
      product: pos.product,
      qty: pos.qty,
      price: pos.currentPrice,
      status: 'SQUARED_OFF',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      reason: 'Manual Square-Off',
      realizedPnl: pos.pnl,
    };
    setOrders(prev => [exitOrder, ...prev]);

    if (pos.pnl > 0) {
      try {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.7 } });
      } catch (e) {}
    }

    triggerNotification(
      `Position Closed: ${pos.displayName}`,
      `Booked P&L: ${pos.pnl >= 0 ? '+' : ''}₹${pos.pnl.toFixed(2)} (${pos.pnlPercent.toFixed(2)}%)`,
      pos.pnl >= 0 ? 'success' : 'alert'
    );
  };

  // Action: Panic Exit All
  const handlePanicSquareOffAll = () => {
    if (positions.length === 0) return;

    let totalExitPnl = 0;
    const exitOrders: Order[] = [];

    positions.forEach(pos => {
      totalExitPnl += pos.pnl;
      exitOrders.push({
        id: `ord-panic-${Date.now()}-${pos.id}`,
        symbol: pos.symbol,
        displayName: pos.displayName,
        type: pos.type === 'BUY' ? 'SELL' : 'BUY',
        product: pos.product,
        qty: pos.qty,
        price: pos.currentPrice,
        status: 'SQUARED_OFF',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        reason: 'Panic Emergency Exit All',
        realizedPnl: pos.pnl,
      });
    });

    setRealizedPnl(prev => prev + totalExitPnl);
    setPositions([]);
    setUsedMargin(0);
    setOrders(prev => [...exitOrders, ...prev]);

    triggerNotification(
      'Emergency Exit Complete: All Positions Closed',
      `Squared off all ${positions.length} active positions. Total Net P&L booked: ${totalExitPnl >= 0 ? '+' : ''}₹${totalExitPnl.toFixed(2)}.`,
      'alert'
    );
  };

  // Action: Deploy 9:20 Pre-Market Algo for a stock
  const handleDeployPreMarketAlgo = (stock: StockItem) => {
    const logTime = new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AlgoLogEntry = {
      id: `log-${Date.now()}`,
      time: logTime,
      type: 'SCAN',
      message: `Strategy [9:20 AM Gap Breakout] armed for ${stock.symbol}. Waiting for 9:20 AM candle high breakout above ₹${(stock.high || stock.ltp).toFixed(2)}.`,
      symbol: stock.symbol,
    };
    setAlgoLogs(prev => [newLog, ...prev]);

    triggerNotification(
      `Algo Armed for ${stock.symbol}`,
      `9:20 AM Pre-Market Gap Breakout rule activated. Will auto-buy if high is breached with volume confirmation.`,
      'success'
    );
  };

  // Action: Test Trigger Algo Execution (For beginner testing)
  const handleTestTriggerAlgo = () => {
    const candidate = stocks[0] || INITIAL_STOCKS[0];
    handleTradeStock(candidate, 'BUY');

    const logTime = new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AlgoLogEntry = {
      id: `log-test-${Date.now()}`,
      time: logTime,
      type: 'ORDER_FIRED',
      message: `Simulated Algo Trigger: Supertrend + VWAP confirmation met for ${candidate.symbol}. Auto-placed Buy MIS order.`,
      symbol: candidate.symbol,
    };
    setAlgoLogs(prev => [newLog, ...prev]);
  };

  // Action: Toggle Algo Strategy
  const handleToggleStrategy = (id: string) => {
    setAlgoStrategies(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-950">
      
      {/* 1. Universal Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        demoBalance={availableMargin}
        openPositionsCount={positions.length}
        alertsCount={growthAlerts.length}
        onOpenBrokerModal={() => setIsBrokerModalOpen(true)}
        onOpenAlgoModal={() => setActiveTab('algo')}
        onOpenBeginnerModal={() => setIsBeginnerModalOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenAlertsDrawer={() => setIsAlertsDrawerOpen(true)}
        onPanicSquareOff={handlePanicSquareOffAll}
        activeBrokerName={activeBroker.name}
      />

      {/* 2. Indian Indices & IST Market Clock Ticker */}
      <MarketTicker
        indices={indices}
        onSelectIndex={(sym) => {
          setSelectedChartSymbol(sym);
          setActiveTab('chart');
        }}
      />

      {/* 3. Main Dashboard Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Toast Notification Banner with colorful badges */}
        {notification && (
          <div className={`mb-5 p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 shadow-sm animate-in slide-in-from-top-3 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : notification.type === 'alert'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-blue-50 border-blue-300 text-blue-950'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${
                notification.type === 'success' ? 'bg-emerald-600' : notification.type === 'alert' ? 'bg-rose-600' : 'bg-blue-600'
              } animate-ping`} />
              <div>
                <strong className="block text-sm font-extrabold">{notification.title}</strong>
                <span className="font-medium text-slate-700">{notification.desc}</span>
              </div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-800 p-1 rounded-md text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dynamic Views */}
        {activeTab === 'premarket' && (
          <PreMarketScanner
            stocks={stocks}
            onOpenAiModal={(stk) => {
              setAiModalStock(stk);
              setIsAiModalOpen(true);
            }}
            onTradeStock={handleTradeStock}
            onSelectStockForChart={(sym) => {
              setSelectedChartSymbol(sym);
              setActiveTab('chart');
            }}
            onDeployPreMarketAlgo={handleDeployPreMarketAlgo}
          />
        )}

        {activeTab === 'growingshares' && (
          <LiveGrowingShares
            stocks={stocks}
            onOpenAiModal={(stk) => {
              setAiModalStock(stk);
              setIsAiModalOpen(true);
            }}
            onTradeStock={handleTradeStock}
            onSelectStockForChart={(sym) => {
              setSelectedChartSymbol(sym);
              setActiveTab('chart');
            }}
            onDeployAlgo={handleDeployPreMarketAlgo}
          />
        )}

        {activeTab === 'options' && (
          <OptionsScalper
            optionChain={optionChain}
            signals={signals}
            onTradeOption={handleTradeOption}
            onTradeOptionStrike={handleTradeOptionStrike}
          />
        )}

        {activeTab === 'chart' && (
          <TradingViewWidget
            selectedSymbol={selectedChartSymbol}
            onSelectSymbol={(sym) => setSelectedChartSymbol(sym)}
          />
        )}

        {activeTab === 'algo' && (
          <AlgoEnginePanel
            config={algoConfig}
            onUpdateConfig={(cfg) => setAlgoConfig(prev => ({ ...prev, ...cfg }))}
            strategies={algoStrategies}
            onToggleStrategy={handleToggleStrategy}
            logs={algoLogs}
            onTestTriggerAlgo={handleTestTriggerAlgo}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioPanel
            positions={positions}
            orders={orders}
            demoBalance={demoBalance}
            availableMargin={availableMargin}
            usedMargin={usedMargin}
            realizedPnl={realizedPnl}
            unrealizedPnl={unrealizedPnl}
            maxDailyLoss={algoConfig.maxDailyLoss}
            isDemoMode={isDemoMode}
            onSquareOffPosition={handleSquareOffPosition}
            onPanicSquareOffAll={handlePanicSquareOffAll}
            onResetDemoBalance={() => {
              setDemoBalance(1000000);
              setRealizedPnl(0);
              setPositions([]);
              setUsedMargin(0);
              triggerNotification('Demo Balance Reset', 'Virtual capital restored to ₹10,00,000 INR.', 'success');
            }}
          />
        )}

      </main>

      {/* Floating Real-time Stock Growth Alert Popup (Share Name First, Buy Price, Sell Target Price) */}
      <GrowthAlertPopup
        alert={activePopupAlert}
        onClose={() => setActivePopupAlert(null)}
        onBuyNow={handleBuyFromAlert}
        onViewChart={(sym) => {
          setSelectedChartSymbol(sym);
          setActiveTab('chart');
        }}
      />

      {/* Growth Alerts Inbox Drawer */}
      <AlertsInboxDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        alerts={growthAlerts}
        onClearAlerts={() => setGrowthAlerts([])}
        onBuyAlert={handleBuyFromAlert}
        onViewChart={(sym) => {
          setSelectedChartSymbol(sym);
          setActiveTab('chart');
          setIsAlertsDrawerOpen(false);
        }}
      />

      {/* Netlify GitHub Deployment Modal */}
      <NetlifyDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* 4. Modals */}
      <BrokerConnectModal
        isOpen={isBrokerModalOpen}
        onClose={() => setIsBrokerModalOpen(false)}
        brokers={brokers}
        activeBrokerId={activeBrokerId}
        isDemoMode={isDemoMode}
        onSelectBroker={(id) => {
          setActiveBrokerId(id);
          triggerNotification('Broker Switched', `Connected to ${brokers.find(b => b.id === id)?.name}.`, 'success');
        }}
        onToggleDemoMode={(val) => {
          setIsDemoMode(val);
          triggerNotification(
            val ? 'Demo Paper Mode Active' : 'Live Broker Mode Active',
            val ? 'All trades are executed in simulated sandbox with ₹10L virtual INR.' : 'Live orders will be routed to your attached broker account.',
            val ? 'info' : 'alert'
          );
        }}
      />

      <AiTradeModal
        stock={aiModalStock}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onExecutePlan={(stk) => handleTradeStock(stk, 'BUY')}
      />

      <BeginnerToolsModal
        isOpen={isBeginnerModalOpen}
        onClose={() => setIsBeginnerModalOpen(false)}
      />

      {/* 5. Clean Footer adhering to design constitution */}
      <footer className="mt-auto border-t border-slate-200 bg-white text-slate-500 text-xs py-5 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-900">NiftyPulse AI</span>
            <span>·</span>
            <span>Indian Stock &amp; Options Algo Terminal</span>
            <span>·</span>
            <span>NSE/BSE Market Data Feed</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            For educational &amp; algorithmic simulation. Strictly adhere to risk-reward discipline and stop loss rules.
          </div>
        </div>
      </footer>

    </div>
  );
}
