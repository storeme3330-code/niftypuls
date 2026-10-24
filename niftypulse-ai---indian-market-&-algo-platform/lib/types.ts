export type Exchange = 'NSE' | 'BSE';

export type SignalType = 'STRONG_BUY' | 'BUY' | 'BREAKOUT' | 'MOMENTUM_SURGE' | 'WATCH' | 'TAKE_PROFIT';

export type StockCategory = 
  | 'PRE_MARKET_GAP'
  | 'INTRADAY_MOMENTUM'
  | 'VOLUME_SURGE'
  | 'FNO_LEADERS'
  | 'GAP_DOWN_RECOVERY';

export interface StockItem {
  symbol: string;
  name: string;
  exchange: Exchange;
  sector: string;
  ltp: number;
  prevClose: number;
  openPrice: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume: number;
  volumeRatio: number;
  vwap: number;
  rsi: number;
  supertrend: 'BULLISH' | 'BEARISH';
  emaCross: 'BULLISH_9_21' | 'NEUTRAL' | 'BEARISH';
  preMarketGapPercent: number;
  catalyst: string;
  signal: SignalType;
  confidence: number;
  category: StockCategory;
  lastTickDirection?: 'UP' | 'DOWN' | 'EQUAL';
}

export interface OptionGreek {
  delta: number;
  theta: number;
  gamma: number;
  iv: number;
}

export interface OptionData {
  ltp: number;
  change: number;
  changePercent: number;
  oi: number;
  oiChange: number;
  volume: number;
  greeks: OptionGreek;
  signal?: 'BUY' | 'STRONG_BUY' | 'NEUTRAL';
}

export interface OptionStrikeRow {
  strikePrice: number;
  call: OptionData;
  put: OptionData;
  isAtm?: boolean;
}

export interface OptionScalpSignal {
  id: string;
  underlying: 'NIFTY' | 'BANKNIFTY' | 'FINNIFTY' | 'RELIANCE' | 'HDFCBANK';
  contract: string;
  type: 'CE' | 'PE';
  strike: number;
  expiry: string;
  ltp: number;
  entryZone: string;
  entryMin: number;
  entryMax: number;
  target1: number;
  target2: number;
  stopLoss: number;
  lotSize: number;
  estimatedMargin: number;
  rationale: string;
  confidence: number;
  pcr: number;
}

export interface BrokerAccount {
  id: string;
  name: string;
  badge: string;
  connected: boolean;
  mode: 'DEMO' | 'REAL';
  clientCode?: string;
  status: 'ACTIVE' | 'DISCONNECTED' | 'AUTHENTICATING';
  supportedProducts: string[];
}

export interface AlgoStrategy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  winRate: number;
  avgProfitPerTrade: string;
  triggerTime: string;
  tags: string[];
}

export interface AlgoConfig {
  active: boolean;
  mode: 'AUTO_PILOT' | 'MANUAL_1CLICK';
  maxDailyLoss: number;
  targetPercent: number;
  stopLossPercent: number;
  trailingSlStep: number;
  capitalPerTrade: number;
  maxConcurrentTrades: number;
  autoSquareOffTime: string;
  soundAlerts: boolean;
}

export interface AlgoLogEntry {
  id: string;
  time: string;
  type: 'SCAN' | 'ORDER_FIRED' | 'SL_TRAIL' | 'TARGET_HIT' | 'SL_HIT' | 'SAFETY_HALT';
  message: string;
  symbol?: string;
  badge?: string;
}

export interface Position {
  id: string;
  symbol: string;
  displayName: string;
  type: 'BUY' | 'SELL';
  product: 'MIS' | 'CNC' | 'NRML';
  qty: number;
  buyPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss: number;
  target: number;
  trailingSl: number;
  isOption?: boolean;
  timestamp: string;
}

export interface Order {
  id: string;
  symbol: string;
  displayName: string;
  type: 'BUY' | 'SELL';
  product: 'MIS' | 'CNC' | 'NRML';
  qty: number;
  price: number;
  status: 'FILLED' | 'PENDING' | 'CANCELLED' | 'SQUARED_OFF';
  timestamp: string;
  reason: string;
  realizedPnl?: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface GrowthAlertMessage {
  id: string;
  symbol: string;
  name: string;
  time: string;
  buyPrice: number;
  sellTargetPrice: number;
  stopLossPrice: number;
  potentialProfitPercent: number;
  potentialProfitAmount: number;
  catalyst: string;
  volumeSpike: string;
  confidence: number;
  read?: boolean;
}
