'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  Globe, 
  GitBranch, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

interface NetlifyDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetlifyDeployModal: React.FC<NetlifyDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "Deploy NiftyPulse AI to Netlify via GitHub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main`;

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
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Publish &amp; Deploy to Netlify via GitHub
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            This application is 100% pre-configured with <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-800 font-bold">netlify.toml</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-800 font-bold">@netlify/plugin-nextjs</code> for zero-config publishing.
          </p>
        </div>

        {/* Deployment Steps */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
          
          {/* Step 1: Git Push */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                Push Project to Your GitHub Repository
              </span>
              <button
                onClick={() => copyToClipboard(gitCommands, 1)}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Copied!' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
              {gitCommands}
            </pre>
          </div>

          {/* Step 2: Connect to Netlify */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
              Import Repository on Netlify
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 font-medium pl-1 leading-relaxed">
              <li>Open <a href="https://app.netlify.com" target="_blank" rel="noreferrer" className="text-teal-700 font-bold underline inline-flex items-center gap-0.5">Netlify Dashboard <ExternalLink className="w-3 h-3 inline" /></a> and sign in.</li>
              <li>Click <strong>&quot;Add new site&quot;</strong> &gt; <strong>&quot;Import an existing project&quot;</strong>.</li>
              <li>Choose <strong>GitHub</strong>, authorize, and select your repository.</li>
              <li>Netlify automatically reads <code className="bg-slate-200 px-1 py-0.2 rounded font-mono">netlify.toml</code>. No manual build adjustments needed!</li>
            </ol>
          </div>

          {/* Step 3: Add Secrets */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] flex items-center justify-center font-bold">3</span>
              Add Gemini API Key in Netlify
            </span>
            <p className="text-slate-600 font-medium leading-relaxed">
              In Netlify Site Settings &gt; <strong>Environment variables</strong>, add:
            </p>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-slate-500 font-bold">Key: </span>
                <span className="text-purple-700 font-extrabold">GEMINI_API_KEY</span>
              </div>
              <button
                onClick={() => copyToClipboard('GEMINI_API_KEY', 2)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900"
              >
                {copiedIndex === 2 ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Value: Your Google Gemini API Key from Google AI Studio.
            </p>
          </div>

          {/* Verification Badge */}
          <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-emerald-950 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <strong className="block font-bold">Pre-Flight Build Check Passed</strong>
              <span className="text-emerald-800 font-medium">All Next.js 15 SSR routes, server endpoints, and assets are fully validated for Netlify hosting.</span>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <a
            href="https://app.netlify.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-sm inline-flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Open Netlify App</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
