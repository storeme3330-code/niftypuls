'use client';

import React, { useState } from 'react';
import { BrokerAccount } from '@/lib/types';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Key, 
  Lock, 
  Zap,
  Building2
} from 'lucide-react';

interface BrokerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokers: BrokerAccount[];
  activeBrokerId: string;
  isDemoMode: boolean;
  onSelectBroker: (brokerId: string) => void;
  onToggleDemoMode: (val: boolean) => void;
}

export const BrokerConnectModal: React.FC<BrokerConnectModalProps> = ({
  isOpen,
  onClose,
  brokers,
  activeBrokerId,
  isDemoMode,
  onSelectBroker,
  onToggleDemoMode,
}) => {
  const [selectedBroker, setSelectedBroker] = useState<BrokerAccount | null>(
    brokers.find(b => b.id === activeBrokerId) || brokers[0]
  );
  const [apiKey, setApiKey] = useState('demo_api_kite_prod_89234');
  const [apiSecret, setApiSecret] = useState('••••••••••••••••••••••');
  const [clientCode, setClientCode] = useState('ZN4921');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = () => {
    setStatusMessage(`Successfully connected to ${selectedBroker?.name} API Gateway.`);
    if (selectedBroker) {
      onSelectBroker(selectedBroker.id);
    }
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };

  const handleUseDemo = () => {
    onToggleDemoMode(true);
    setStatusMessage('Switched to Demo Virtual Paper Trading (₹10,00,000 INR balance).');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Broker Attachment &amp; Trading Mode</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Attach your real Indian broker API account (Zerodha, Groww, Angel One, etc.) or practice safely with ₹10 Lakhs Virtual Paper balance.
          </p>
        </div>

        {/* Demo vs Real Switch Banner with distinct vibrant colors */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-1.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => onToggleDemoMode(true)}
            className={`p-3.5 rounded-xl text-left transition-all flex items-start gap-2.5 ${
              isDemoMode
                ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-slate-900 text-xs">Demo Paper Trading (Active)</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">₹10,00,000 Virtual capital · Zero risk</div>
            </div>
          </button>

          <button
            onClick={() => onToggleDemoMode(false)}
            className={`p-3.5 rounded-xl text-left transition-all flex items-start gap-2.5 ${
              !isDemoMode
                ? 'bg-amber-50 border-2 border-amber-500 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-slate-900 text-xs">Real Broker Execution</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Direct live orders via your attached broker</div>
            </div>
          </button>
        </div>

        {/* Broker Selector Grid */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-800 block mb-2">
            Select Indian Broker:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {brokers.map((b) => {
              const isSelected = selectedBroker?.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBroker(b)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-extrabold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="truncate">{b.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">{b.badge}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credentials Form (For the selected broker) */}
        {selectedBroker && (
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3 text-xs mb-5">
            <div className="flex items-center justify-between text-slate-800 pb-2 border-b border-slate-200 font-bold">
              <span>{selectedBroker.name} API Configuration</span>
              <span className="text-[10px] text-slate-500 font-normal">{selectedBroker.badge}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 font-bold block mb-1">API Key / Client ID</label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-bold block mb-1">API Secret / TOTP Token</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-500 font-medium">
                Supports: {selectedBroker.supportedProducts.slice(0, 2).join(' · ')}
              </div>
              <button
                type="button"
                onClick={() => {
                  setApiKey('demo_sandbox_test_token_8892');
                  setApiSecret('test_sandbox_secret_key');
                  setClientCode(selectedBroker.clientCode || 'DEMO01');
                }}
                className="text-[11px] text-blue-600 font-bold hover:underline"
              >
                Autofill Sandbox Demo Credentials
              </button>
            </div>
          </div>
        )}

        {/* Status Confirmation Message */}
        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Modal Actions with colorful buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleUseDemo}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Use Demo Mode Only
          </button>

          <button
            onClick={handleConnect}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Connect &amp; Activate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
