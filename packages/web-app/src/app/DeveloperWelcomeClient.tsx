'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  Settings,
  HelpCircle,
  Sparkles,
  Database,
  Key,
  Shield,
  Activity,
  Code,
  Terminal,
  ExternalLink,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Diagnostics {
  databaseProvider: string;
  isDatabaseConnected: boolean;
  hasPaymongoPubKey: boolean;
  hasPaymongoSecKey: boolean;
  hasAdminEmail: boolean;
  hasAdminPassword: boolean;
  hasFirebaseApiKey: boolean;
  hasFirebaseProjectId: boolean;
  hasFirebaseServiceAccount: boolean;
}

interface DeveloperWelcomeClientProps {
  diagnostics: Diagnostics;
}

export default function DeveloperWelcomeClient({ diagnostics }: DeveloperWelcomeClientProps) {
  // Navigation active states for simulated sandbox
  const [activeTab, setActiveTab] = useState<'checkout' | 'dashboard' | 'designer'>('checkout');

  // Form customizer state
  const [formTitle, setFormTitle] = useState('Batangas Coffee Roast');
  const [formPrice, setFormPrice] = useState(750);
  const [formColor, setFormColor] = useState<'emerald' | 'indigo' | 'amber' | 'sky'>('emerald');

  // Simulated Customer Checkout state
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'gcash' | 'maya' | 'card'>('gcash');
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [checkoutProgress, setCheckoutProgress] = useState(0);
  const [checkoutLogs, setCheckoutLogs] = useState<string[]>([]);

  // Color dynamic styles mapping
  const colorMap = {
    emerald: {
      primary: '#ccf15a',
      primaryHover: '#b0d440',
      text: '#161e00',
      border: 'border-[#ccf15a]',
      bgLight: 'bg-[#ccf15a]/5',
      bgDot: 'bg-[#ccf15a]',
      accentText: 'text-[#ccf15a]',
      borderMuted: 'border-[#ccf15a]/30',
      bgLightMuted: 'bg-[#ccf15a]/5',
    },
    indigo: {
      primary: '#818cf8',
      primaryHover: '#6366f1',
      text: '#0f172a',
      border: 'border-[#818cf8]',
      bgLight: 'bg-[#818cf8]/5',
      bgDot: 'bg-[#818cf8]',
      accentText: 'text-[#818cf8]',
      borderMuted: 'border-[#818cf8]/30',
      bgLightMuted: 'bg-[#818cf8]/5',
    },
    amber: {
      primary: '#fbbf24',
      primaryHover: '#f59e0b',
      text: '#451a03',
      border: 'border-[#fbbf24]',
      bgLight: 'bg-[#fbbf24]/5',
      bgDot: 'bg-[#fbbf24]',
      accentText: 'text-[#fbbf24]',
      borderMuted: 'border-[#fbbf24]/30',
      bgLightMuted: 'bg-[#fbbf24]/5',
    },
    sky: {
      primary: '#38bdf8',
      primaryHover: '#0ea5e9',
      text: '#0c4a6e',
      border: 'border-[#38bdf8]',
      bgLight: 'bg-[#38bdf8]/5',
      bgDot: 'bg-[#38bdf8]',
      accentText: 'text-[#38bdf8]',
      borderMuted: 'border-[#38bdf8]/30',
      bgLightMuted: 'bg-[#38bdf8]/5',
    }
  };

  const colors = colorMap[formColor];

  // Handle Simulated Payment Action
  const triggerSimulatedPayment = () => {
    if (checkoutStatus !== 'idle') return;
    
    setCheckoutStatus('processing');
    setCheckoutProgress(15);
    setCheckoutLogs(['[INIT] Customer initiated direct wallet checkout...']);
    
    const steps = [
      { progress: 35, log: '[ROUTING] Accessing direct merchant PayMongo credentials...', delay: 600 },
      { progress: 65, log: `[GATEWAY] Redirecting customer to ${checkoutPaymentMethod.toUpperCase()} auth gateway...`, delay: 1300 },
      { progress: 85, log: '[CALLBACK] Settlement webhook verified. Order completed.', delay: 2200 },
      { progress: 100, log: '[SUCCESS] Funds settled directly to merchant balance. Overlay closing.', delay: 2800 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setCheckoutProgress(step.progress);
        setCheckoutLogs(prev => [...prev, step.log]);
        if (step.progress === 100) {
          setTimeout(() => {
            setCheckoutStatus('success');
          }, 400);
        }
      }, step.delay);
    });
  };

  const resetCheckoutSimulation = () => {
    setCheckoutStatus('idle');
    setCheckoutProgress(0);
    setCheckoutLogs([]);
  };

  // Helper variables for diagnostic health status
  const isDatabaseOk = diagnostics.isDatabaseConnected;
  const isPaymongoOk = diagnostics.hasPaymongoPubKey && diagnostics.hasPaymongoSecKey;
  const isFirebaseClientOk = diagnostics.hasFirebaseApiKey && diagnostics.hasFirebaseProjectId;
  const isFirebaseAdminOk = diagnostics.databaseProvider === 'sqlite' || diagnostics.hasFirebaseServiceAccount;
  
  const isAuthOk = diagnostics.databaseProvider === 'firestore' 
    ? isFirebaseClientOk 
    : (diagnostics.hasAdminEmail && diagnostics.hasAdminPassword);

  const isSystemReady = isDatabaseOk && isPaymongoOk && isAuthOk && isFirebaseAdminOk;

  return (
    <div className="min-h-screen bg-[#00180c] bg-[radial-gradient(circle_at_center,_#062517_0%,_#001208_80%)] text-[#c8ebd5] font-sans antialiased overflow-x-hidden selection:bg-[#ccf15a] selection:text-[#00180c]">
      
      {/* Top Banner */}
      <div className="w-full bg-[#022113] border-b border-[#112f21]/80 py-2.5 px-4 text-center">
        <p className="text-xs font-mono tracking-wider uppercase text-[#c5c9b1] flex items-center justify-center gap-1.5 flex-wrap">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${isSystemReady ? 'bg-[#ccf15a] animate-pulse' : 'bg-amber-400'}`} />
          <span>
            {isSystemReady 
              ? 'WizPay local engine is fully operational.' 
              : 'WizPay requires environment configuration.'}
          </span>
        </p>
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-[#112f21]/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#ccf15a] to-[#6dfe9c] p-[2px] shrink-0">
            <div className="h-full w-full bg-[#00180c] rounded-[6px] flex items-center justify-center">
              <span className="text-white font-black text-lg tracking-tighter">Wz</span>
            </div>
          </div>
          <span className="text-xl font-black uppercase text-white tracking-widest hidden min-[400px]:inline">WizPay Portal</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            href="/admin" 
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#c5c9b1] hover:text-white transition-colors duration-300 rounded px-2.5 py-1.5 whitespace-nowrap"
          >
            Enter Dashboard
          </Link>
          <a
            href="https://github.com/jedmamosto/open-wizpay"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button 
              className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-5 sm:py-2.5 rounded-md transition-all duration-300 shadow-[0_4px_12px_rgba(204,241,90,0.15)]"
            >
              Docs & GitHub
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Diagnostics, Actions & Checklist */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title / Description */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ccf15a]/30 bg-[#ccf15a]/5 text-[#ccf15a] text-xs font-bold tracking-widest uppercase">
                <span className="h-2 w-2 bg-[#ccf15a] rounded-full shrink-0" />
                Self-Hosted Single-Tenant Dev Portal
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">
                Local Setup <span className="text-[#ccf15a]">Diagnostics</span>
              </h1>
              <p className="text-sm text-[#a6d0b5] leading-relaxed">
                Welcome to your self-hosted instance. Verify configuration variables, run simulations, and launch your merchant manager.
              </p>
            </div>

            {/* Diagnostics checklist card */}
            <div className="border border-[#1d3a2c] rounded-xl bg-[#062517]/50 backdrop-blur-md shadow-md p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#112f21] pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#ccf15a]" />
                  Pre-flight Environment Check
                </h2>
                <span className="text-[10px] font-mono text-[#a6d0b5]/60">v1.0.0</span>
              </div>

              <div className="space-y-3">
                
                {/* 1. Database connection */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#001208] border border-[#112f21]">
                  <div className="flex items-start gap-3">
                    <Database className="w-4 h-4 text-[#a6d0b5] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">Database Connection</span>
                      <span className="text-[11px] text-[#a6d0b5]/70 block font-mono">
                        Provider: {diagnostics.databaseProvider.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {isDatabaseOk ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ccf15a]/10 border border-[#ccf15a]/30 text-[#ccf15a] uppercase">
                      Connected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/10 border border-red-500/30 text-red-400 uppercase">
                      Failed
                    </span>
                  )}
                </div>

                {/* 2. Paymongo configuration */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#001208] border border-[#112f21]">
                  <div className="flex items-start gap-3">
                    <Key className="w-4 h-4 text-[#a6d0b5] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">PayMongo Integration</span>
                      <span className="text-[11px] text-[#a6d0b5]/70 block font-mono">
                        Keys: {diagnostics.hasPaymongoPubKey ? 'PUB' : '❌'} | {diagnostics.hasPaymongoSecKey ? 'SEC' : '❌'}
                      </span>
                    </div>
                  </div>
                  {isPaymongoOk ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ccf15a]/10 border border-[#ccf15a]/30 text-[#ccf15a] uppercase">
                      Ready
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase">
                      Keys Missing
                    </span>
                  )}
                </div>

                {/* 3. Auth configuration */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#001208] border border-[#112f21]">
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-[#a6d0b5] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">Admin Dashboard Auth</span>
                      <span className="text-[11px] text-[#a6d0b5]/70 block font-mono">
                        {diagnostics.databaseProvider === 'sqlite' 
                          ? 'Env auth (Email/Password)' 
                          : 'Firebase Cloud Authentication'}
                      </span>
                    </div>
                  </div>
                  {isAuthOk ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ccf15a]/10 border border-[#ccf15a]/30 text-[#ccf15a] uppercase">
                      Configured
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase">
                      Unconfigured
                    </span>
                  )}
                </div>

                {/* 4. Firebase SDK config (if firestore provider is active) */}
                {diagnostics.databaseProvider === 'firestore' && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#001208] border border-[#112f21]">
                    <div className="flex items-start gap-3">
                      <FolderOpen className="w-4 h-4 text-[#a6d0b5] mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-white block">Firebase Admin Service</span>
                        <span className="text-[11px] text-[#a6d0b5]/70 block font-mono">
                          Credentials parsing check
                        </span>
                      </div>
                    </div>
                    {isFirebaseAdminOk ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ccf15a]/10 border border-[#ccf15a]/30 text-[#ccf15a] uppercase">
                        Loaded
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/10 border border-red-500/30 text-red-400 uppercase">
                        Missing Account Key
                      </span>
                    )}
                  </div>
                )}

              </div>

              {!isSystemReady && (
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-start gap-2 text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-normal font-mono">
                    Please configure your environment variables in <code className="bg-[#001208] px-1 rounded text-white">packages/web-app/.env.local</code>. Run <code className="bg-[#001208] px-1 rounded text-white">npm run dev:web</code> again to reload config.
                  </p>
                </div>
              )}
            </div>

            {/* Quick launch block */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin" className="w-full">
                <Button className="w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-xs uppercase tracking-wider py-4 rounded-lg flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(204,241,90,0.15)]">
                  Admin Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href="/developers" className="w-full">
                <Button variant="ghost" className="w-full border border-[#1d3a2c] text-white hover:bg-[#112f21] hover:text-white font-bold text-xs uppercase tracking-wider py-4 rounded-lg flex items-center justify-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#ccf15a]" />
                  API Sandbox
                </Button>
              </Link>
            </div>

            {/* Development CLI Commands */}
            <div className="border border-[#112f21] rounded-xl bg-[#062517]/10 p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#a6d0b5] flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Local Setup Guide Commands
              </h3>
              
              <div className="space-y-2.5 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[#a6d0b5]/50 block text-[10px]">1. Deploy local SQLite Database</span>
                  <div className="bg-[#001208] p-2 rounded border border-[#112f21]/80 text-[#c8ebd5] flex justify-between items-center">
                    <span>npx prisma db push</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[#a6d0b5]/50 block text-[10px]">2. Install & Start MCP Server (for Cursor/Claude Desktop)</span>
                  <div className="bg-[#001208] p-2 rounded border border-[#112f21]/80 text-[#c8ebd5] flex justify-between items-center">
                    <span>npm run setup:mcp</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[#a6d0b5]/50 block text-[10px]">3. Local SDK Script Reference</span>
                  <div className="bg-[#001208] p-2 rounded border border-[#112f21]/80 text-[#c8ebd5] overflow-x-auto text-[10px] whitespace-nowrap">
                    <code>&lt;script src=&quot;http://localhost:3000/sdk/wizpay.js&quot;&gt;&lt;/script&gt;</code>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Interactive Simulation Playground */}
          <div id="sandbox-demo" className="lg:col-span-7 w-full">
            <div className="border border-[#1d3a2c] rounded-xl bg-[#062517]/70 backdrop-blur-md shadow-lg overflow-hidden">
              
              {/* Terminal Window Header */}
              <div className="bg-[#022113] px-3 py-3 sm:px-4 flex items-center justify-between border-b border-[#112f21]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                  <span className="text-[11px] font-mono text-[#a6d0b5]/70 ml-2 tracking-widest uppercase">
                    Interactive Playground Simulator
                  </span>
                </div>
                
                <div role="tablist" aria-label="Interactive Demo Switcher" className="flex bg-[#00180c] p-0.5 rounded-lg border border-[#112f21]">
                  <button
                    role="tab"
                    aria-selected={activeTab === 'designer'}
                    aria-controls="designer-panel"
                    id="tab-designer"
                    onClick={() => setActiveTab('designer')}
                    className={`px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none ${activeTab === 'designer' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#c5c9b1] hover:text-white'}`}
                  >
                    Designer
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'checkout'}
                    aria-controls="checkout-panel"
                    id="tab-checkout"
                    onClick={() => setActiveTab('checkout')}
                    className={`px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none ${activeTab === 'checkout' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#c5c9b1] hover:text-white'}`}
                  >
                    Checkout View
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === 'dashboard'}
                    aria-controls="merchant-panel"
                    id="tab-dashboard"
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none ${activeTab === 'dashboard' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#c5c9b1] hover:text-white'}`}
                  >
                    Analytics
                  </button>
                </div>
              </div>

              {/* Sandbox Tab Contents */}
              <div className="p-6 min-h-[460px] flex flex-col justify-between">
                
                {activeTab === 'designer' && (
                  /* VISUAL FORM DESIGNER TAB */
                  <div role="tabpanel" id="designer-panel" aria-labelledby="tab-designer" className="space-y-6">
                    <div className="border-b border-[#112f21] pb-4">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-[#a6d0b5]">Interactive Form Builder</h4>
                      <h3 className="text-lg font-bold text-white mt-1">Design Your Checkout Button</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="designer-title" className="text-[10px] font-mono uppercase tracking-wider text-[#a6d0b5] block">
                          Product Name
                        </label>
                        <input
                          id="designer-title"
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="w-full bg-[#001208] border border-[#112f21] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#ccf15a] transition-all"
                          placeholder="e.g. Batangas Coffee Roast"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="designer-price" className="text-[10px] font-mono uppercase tracking-wider text-[#a6d0b5] block">
                          Price (PHP)
                        </label>
                        <input
                          id="designer-price"
                          type="number"
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          className="w-full bg-[#001208] border border-[#112f21] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#ccf15a] transition-all"
                          placeholder="e.g. 750"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#a6d0b5] block">
                          Checkout Highlight Color
                        </span>
                        <div className="flex gap-3 pt-1">
                          {(['emerald', 'indigo', 'amber', 'sky'] as const).map((colorName) => {
                            const bgClasses = {
                              emerald: 'bg-[#ccf15a]',
                              indigo: 'bg-[#818cf8]',
                              amber: 'bg-[#fbbf24]',
                              sky: 'bg-[#38bdf8]',
                            };
                            return (
                              <button
                                key={colorName}
                                onClick={() => setFormColor(colorName)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${formColor === colorName ? 'border-white scale-110' : 'border-transparent hover:scale-105'} ${bgClasses[colorName]}`}
                                title={colorName}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab('checkout')}
                        style={{ backgroundColor: colors.primary, color: colors.text }}
                        className="w-full font-bold text-xs uppercase tracking-wider py-4 rounded-lg transition-all transform hover:opacity-90"
                      >
                        Preview Checkout Page
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'checkout' && (
                  /* CUSTOMER CHECKOUT VIEW */
                  <div role="tabpanel" id="checkout-panel" aria-labelledby="tab-checkout" className="space-y-6">
                    <div className="border-b border-[#112f21] pb-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-widest text-[#a6d0b5]">Your Store Checkout</h4>
                        <h3 className="text-lg font-bold text-white mt-1">{formTitle || 'Sample Checkout'}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono uppercase text-[#c8ebd5] block opacity-70">Amount Due</span>
                        <span className="text-xl font-black text-white">₱{formPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {checkoutStatus === 'idle' && (
                      <>
                        <div className="space-y-3">
                          <span id="payment-method-label" className="text-xs font-mono uppercase tracking-wider text-[#a6d0b5] block">Select Payment Method</span>
                          
                          <div role="radiogroup" aria-labelledby="payment-method-label" className="grid grid-cols-1 gap-2.5">
                            <button
                              role="radio"
                              aria-checked={checkoutPaymentMethod === 'gcash'}
                              onClick={() => setCheckoutPaymentMethod('gcash')}
                              className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all ${checkoutPaymentMethod === 'gcash' ? `${colors.border} ${colors.bgLight} text-white` : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-black text-white">G</div>
                                <div>
                                  <span className="font-bold text-sm block">GCash Account</span>
                                  <span className="text-[11px] text-[#a6d0b5]">Standard mobile authorization</span>
                                </div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutPaymentMethod === 'gcash' ? colors.border : 'border-[#112f21]'}`}>
                                {checkoutPaymentMethod === 'gcash' && <div className={`w-2.5 h-2.5 rounded-full ${colors.bgDot}`} />}
                              </div>
                            </button>

                            <button
                              role="radio"
                              aria-checked={checkoutPaymentMethod === 'maya'}
                              onClick={() => setCheckoutPaymentMethod('maya')}
                              className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all ${checkoutPaymentMethod === 'maya' ? `${colors.border} ${colors.bgLight} text-white` : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[9px] font-black text-white">M</div>
                                <div>
                                  <span className="font-bold text-sm block">Maya Wallet</span>
                                  <span className="text-[11px] text-[#a6d0b5]">Direct scan or OTP confirmation</span>
                                </div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutPaymentMethod === 'maya' ? colors.border : 'border-[#112f21]'}`}>
                                {checkoutPaymentMethod === 'maya' && <div className={`w-2.5 h-2.5 rounded-full ${colors.bgDot}`} />}
                              </div>
                            </button>

                            <button
                              role="radio"
                              aria-checked={checkoutPaymentMethod === 'card'}
                              onClick={() => setCheckoutPaymentMethod('card')}
                              className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all ${checkoutPaymentMethod === 'card' ? `${colors.border} ${colors.bgLight} text-white` : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
                            >
                              <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-white" />
                                <div>
                                  <span className="font-bold text-sm block">Credit/Debit Card</span>
                                  <span className="text-[11px] text-[#a6d0b5]">Visa, Mastercard, & JCB direct</span>
                                </div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutPaymentMethod === 'card' ? colors.border : 'border-[#112f21]'}`}>
                                {checkoutPaymentMethod === 'card' && <div className={`w-2.5 h-2.5 rounded-full ${colors.bgDot}`} />}
                              </div>
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={triggerSimulatedPayment}
                          style={{ backgroundColor: colors.primary, color: colors.text }}
                          className="w-full font-bold text-sm uppercase tracking-wider py-5 rounded-lg transition-all"
                        >
                          Pay ₱{formPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </button>
                      </>
                    )}

                    {checkoutStatus === 'processing' && (
                      <div className="space-y-6 py-8 flex flex-col items-center justify-center">
                        <div 
                          style={{ borderTopColor: colors.primary }}
                          className="w-16 h-16 rounded-full border-4 border-[#112f21] animate-spin" 
                        />
                        
                        <div className="w-full max-w-sm space-y-2.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-[#a6d0b5]">Secure Settlement Route</span>
                            <span style={{ color: colors.primary }}>{checkoutProgress}%</span>
                          </div>
                          <div className="w-full bg-[#112f21] h-2 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${checkoutProgress}%`, backgroundColor: colors.primary }}
                              className="h-full transition-all duration-300" 
                            />
                          </div>
                        </div>

                        <div className="w-full bg-[#001208] border border-[#112f21] p-3 rounded-lg font-mono text-[10px] space-y-1 max-h-[140px] overflow-y-auto">
                          {checkoutLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span style={{ color: colors.primary }}>&gt;</span>
                              <span className="text-[#a6d0b5]">{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {checkoutStatus === 'success' && (
                      <div className="text-center py-8 space-y-6">
                        <div 
                          style={{ borderColor: `${colors.primary}40`, color: colors.primary, backgroundColor: `${colors.primary}15` }}
                          className="inline-flex h-16 w-16 items-center justify-center rounded-full border mx-auto transition-all duration-500 scale-100"
                        >
                          <CheckCircle2 className="h-10 w-10" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-white uppercase tracking-wider">Checkout Confirmed</h3>
                          <p className="text-sm text-[#a6d0b5] max-w-sm mx-auto">
                            Payment has successfully routed. In a live environment, these funds deposit directly to your personal bank account.
                          </p>
                        </div>

                        <div className="bg-[#022113] border border-[#6dfe9c]/20 p-4 rounded-lg max-w-sm mx-auto text-left font-mono">
                          <p 
                            style={{ color: colors.primary }}
                            className="text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Direct Settlement Log
                          </p>
                          <p className="text-[11px] text-[#a6d0b5] leading-relaxed">
                            Your customer was charged directly. WizPay took ₱0.00 platform cuts. Settles to your merchant balance in 1 business day.
                          </p>
                        </div>

                        <div className="flex gap-3 justify-center pt-2">
                          <button
                            onClick={resetCheckoutSimulation}
                            className="px-4 py-2 border border-[#1d3a2c] hover:border-[#ccf15a] text-white hover:bg-[#ccf15a]/5 text-xs font-bold uppercase tracking-wider rounded transition-all"
                          >
                            Test Again
                          </button>
                          <button
                            onClick={() => setActiveTab('dashboard')}
                            style={{ backgroundColor: colors.primary, color: colors.text }}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all"
                          >
                            Check Analytics
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'dashboard' && (
                  /* MERCHANT DASHBOARD VIEW */
                  <div role="tabpanel" id="merchant-panel" aria-labelledby="tab-dashboard" className="space-y-5">
                    <div className="flex items-center justify-between border-b border-[#112f21] pb-3">
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-widest text-[#a6d0b5]">Merchant Control</h4>
                        <h3 className="text-lg font-bold text-white mt-1">Live Storefront Metrics</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#6dfe9c]/10 border border-[#6dfe9c]/30 text-[#6dfe9c] uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6dfe9c] animate-pulse" />
                        Live Status
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#001208] p-3 rounded-lg border border-[#112f21]">
                        <span className="text-[9px] font-mono uppercase text-[#a6d0b5]/60 block">Total Revenue</span>
                        <span className="text-sm font-bold text-white block mt-1">₱142,500</span>
                      </div>
                      <div className="bg-[#001208] p-3 rounded-lg border border-[#112f21]">
                        <span className="text-[9px] font-mono uppercase text-[#a6d0b5]/60 block">Settled Fees</span>
                        <span className="text-sm font-bold text-[#ccf15a] block mt-1">₱0.00</span>
                      </div>
                      <div className="bg-[#001208] p-3 rounded-lg border border-[#112f21]">
                        <span className="text-[9px] font-mono uppercase text-[#a6d0b5]/60 block">Checkout Forms</span>
                        <span className="text-sm font-bold text-white block mt-1">12 active</span>
                      </div>
                    </div>

                    <div className="bg-[#001208] border border-[#112f21] rounded-lg p-3 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-[#a6d0b5]/60 block">Simulated Active Form Checklist</span>
                      <div className="space-y-1.5 text-xs font-mono text-[#a6d0b5]">
                        <div className="flex items-center justify-between border-b border-[#112f21]/40 pb-1">
                          <span className="truncate">{formTitle || 'Sample Form'}</span>
                          <span style={{ color: colors.primary }}>₱{formPrice}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-[#112f21]/40 pb-1">
                          <span>Barako Brew Bag</span>
                          <span>₱350</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Kapeng Alamid (Civet)</span>
                          <span>₱1,200</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/admin" className="block pt-2">
                      <button
                        style={{ backgroundColor: colors.primary, color: colors.text }}
                        className="w-full font-bold text-xs uppercase tracking-wider py-4 rounded-lg transition-all"
                      >
                        Enter Real Admin Panel
                      </button>
                    </Link>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#001208] border-t border-[#112f21]/80 py-10 mt-12 text-[#a6d0b5]/50 text-center text-xs font-mono">
        <p>WizPay is independent software licensed under the MIT License.</p>
        <p className="mt-1">For help, read the setup guides in the repository under /agent_docs/.</p>
      </footer>

    </div>
  );
}
