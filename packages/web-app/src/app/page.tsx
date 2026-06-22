'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  Code, 
  Copy, 
  ChevronDown, 
  CreditCard, 
  Lock, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function Home() {
  // Navigation active states and modals
  const [activeTab, setActiveTab] = useState<'checkout' | 'dashboard'>('checkout');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  
  // Interactive FAQ active item
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Developer Section Interactive Terminal state
  const [devTerminalTab, setDevTerminalTab] = useState<'prompt' | 'rpc' | 'result'>('prompt');

  // Simulated Customer Checkout state
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'gcash' | 'maya' | 'card'>('gcash');
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [checkoutProgress, setCheckoutProgress] = useState(0);
  const [checkoutLogs, setCheckoutLogs] = useState<string[]>([]);

  // Handle Simulated Payment Action
  const triggerSimulatedPayment = () => {
    if (checkoutStatus !== 'idle') return;
    
    setCheckoutStatus('processing');
    setCheckoutProgress(15);
    setCheckoutLogs(['[INIT] Customer clicked simulated payment button...']);
    
    const steps = [
      { progress: 35, log: '[ROUTING] Initiating direct PayMongo API payload payload...', delay: 600 },
      { progress: 65, log: `[GATEWAY] Redirecting customer authorization window to ${checkoutPaymentMethod.toUpperCase()}...`, delay: 1300 },
      { progress: 85, log: '[WEBHOOK] PayMongo webhook call received: Payment Completed.', delay: 2200 },
      { progress: 100, log: '[SUCCESS] Funds settled directly to merchant credentials. Closing inline frame.', delay: 2800 }
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

  const copyCodeSnippet = () => {
    const code = `<div id="wizpay-storefront" data-form-id="oz-wallet"></div>\n<script src="https://pay.unwiz.ai/sdk/wizpay.js"></script>`;
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#00180c] bg-[radial-gradient(circle_at_center,_#062517_0%,_#001208_80%)] text-[#c8ebd5] font-sans antialiased overflow-x-hidden selection:bg-[#ccf15a] selection:text-[#00180c]">
      
      {/* Upper Announcement Bar */}
      <div className="w-full bg-[#022113] border-b border-[#112f21]/80 py-2.5 px-4 text-center">
        <p className="text-xs font-mono tracking-wider uppercase text-[#c5c9b1] flex items-center justify-center gap-1.5 flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-[#ccf15a] animate-pulse" />
          <span>Disclaimer: Beta testing. Use for simulation only. Do not use for live transactions.</span>
        </p>
      </div>

      {/* Primary Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-[#112f21]/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#ccf15a] to-[#6dfe9c] p-[2px] shrink-0">
            <div className="h-full w-full bg-[#00180c] rounded-[6px] flex items-center justify-center">
              <span className="text-white font-black text-lg tracking-tighter">Oz</span>
            </div>
          </div>
          <span className="text-xl font-black uppercase text-white tracking-widest hidden min-[400px]:inline">WizPay</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="https://github.com/jedmamosto/open-wizpay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#c5c9b1] hover:text-white transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none rounded px-2 py-1.5 whitespace-nowrap"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </a>
          <Link href="/login" className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#c5c9b1] hover:text-white transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none rounded px-2 py-1.5 whitespace-nowrap">
            Sign In
          </Link>
          <Link href="/login?tab=signup" className="shrink-0">
            <Button 
              className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-5 sm:py-2.5 rounded-md transition-all duration-300 shadow-[0_4px_12px_rgba(204,241,90,0.15)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none whitespace-nowrap"
            >
              Start My Setup
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Copy Panel */}
        <div className="lg:col-span-6 space-y-8">
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ccf15a]/30 bg-[#ccf15a]/5 text-[#ccf15a] text-xs font-bold tracking-widest uppercase">
              <span className="h-2 w-2 rounded-full bg-[#ccf15a] animate-pulse shrink-0" />
              DIRECT SETTLEMENT GATEWAY
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6dfe9c]/30 bg-[#6dfe9c]/5 text-[#6dfe9c] text-xs font-bold tracking-widest uppercase">
              <span>MIT LICENSE (Open-Source)</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-white leading-[1.05]">
            Accept Online Payments <span className="text-[#ccf15a]">Directly</span> With Zero Platform Fees
          </h1>

          <p className="text-lg text-[#a6d0b5] leading-relaxed max-w-xl">
            Take payments on your store using GCash, Maya, QR Ph, and credit cards. Connect your direct PayMongo credentials so cash settlements drop instantly into your bank. Keep 100% of your earnings.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md pt-2">
            <Link href="/login?tab=signup" className="w-full sm:w-auto">
              <Button
                className="w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] text-sm font-bold uppercase tracking-wider h-auto py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(204,241,90,0.2)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                Start My Free Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Sandbox Visual Panel */}
        <div id="sandbox-demo" className="lg:col-span-6 w-full max-w-xl mx-auto">
          <div className="border border-[#1d3a2c] rounded-xl bg-[#062517]/70 backdrop-blur-md shadow-[0_0_50px_rgba(204,241,90,0.02)] overflow-hidden">
            
            {/* Terminal Window Header */}
            <div className="bg-[#022113] px-3 py-3 sm:px-4 flex items-center justify-between border-b border-[#112f21]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                <span className="text-[11px] font-mono text-[#a6d0b5]/70 ml-2 tracking-widest uppercase hidden sm:inline">Live Interactive Demo</span>
              </div>
              
              <div role="tablist" aria-label="Interactive Demo Switcher" className="flex bg-[#00180c] p-0.5 rounded-lg border border-[#112f21]">
                <button
                  role="tab"
                  aria-selected={activeTab === 'checkout'}
                  aria-controls="checkout-panel"
                  id="tab-checkout"
                  onClick={() => setActiveTab('checkout')}
                  className={`px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${activeTab === 'checkout' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#c5c9b1] hover:text-white'}`}
                >
                  Customer Checkout
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'dashboard'}
                  aria-controls="merchant-panel"
                  id="tab-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${activeTab === 'dashboard' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#c5c9b1] hover:text-white'}`}
                >
                  Merchant Panel
                </button>
              </div>
            </div>

            {/* Sandbox Tab Contents */}
            <div className="p-6 min-h-[460px] flex flex-col justify-between">
              {activeTab === 'checkout' ? (
                /* CUSTOMER CHECKOUT VIEW */
                <div role="tabpanel" id="checkout-panel" aria-labelledby="tab-checkout" className="space-y-6">
                  <div className="border-b border-[#112f21] pb-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-[#a6d0b5]">PH Artisans Shop</h4>
                      <h3 className="text-lg font-bold text-white mt-1">Direct Wallet Checkout</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-[#ccf15a] block">Amount Due</span>
                      <span className="text-xl font-black text-white">₱750.00</span>
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
                            className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${checkoutPaymentMethod === 'gcash' ? 'border-[#ccf15a] bg-[#ccf15a]/5 text-white' : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-black text-white">G</div>
                              <div>
                                <span className="font-bold text-sm block">GCash Account</span>
                                <span className="text-[11px] text-[#a6d0b5]">Redirects to verification portal</span>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutPaymentMethod === 'gcash' ? 'border-[#ccf15a]' : 'border-[#112f21]'}`}>
                              {checkoutPaymentMethod === 'gcash' && <div className="w-2.5 h-2.5 rounded-full bg-[#ccf15a]" />}
                            </div>
                          </button>

                          <button
                            role="radio"
                            aria-checked={checkoutPaymentMethod === 'maya'}
                            onClick={() => setCheckoutPaymentMethod('maya')}
                            className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${checkoutPaymentMethod === 'maya' ? 'border-[#ccf15a] bg-[#ccf15a]/5 text-white' : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[9px] font-black text-white">M</div>
                              <div>
                                <span className="font-bold text-sm block">Maya Wallet</span>
                                <span className="text-[11px] text-[#a6d0b5]">Direct scan or OTP verification</span>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutPaymentMethod === 'maya' ? 'border-[#ccf15a]' : 'border-[#112f21]'}`}>
                              {checkoutPaymentMethod === 'maya' && <div className="w-2.5 h-2.5 rounded-full bg-[#ccf15a]" />}
                            </div>
                          </button>

                          <button
                            role="radio"
                            aria-checked={checkoutPaymentMethod === 'card'}
                            onClick={() => setCheckoutPaymentMethod('card')}
                            className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${checkoutPaymentMethod === 'card' ? 'border-[#ccf15a] bg-[#ccf15a]/5 text-white' : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5 text-white" />
                              <div>
                                <span className="font-bold text-sm block">Credit/Debit Card</span>
                                <span className="text-[11px] text-[#a6d0b5]">Visa, Mastercard, & JCB direct</span>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutPaymentMethod === 'card' ? 'border-[#ccf15a]' : 'border-[#112f21]'}`}>
                              {checkoutPaymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#ccf15a]" />}
                            </div>
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={triggerSimulatedPayment}
                        className="w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-sm uppercase tracking-wider py-6 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                      >
                        Pay ₱750.00 via {checkoutPaymentMethod === 'gcash' ? 'GCash' : checkoutPaymentMethod === 'maya' ? 'Maya' : 'Card'}
                      </Button>
                    </>
                  )
}

                  {checkoutStatus === 'processing' && (
                    <div className="space-y-6 py-8 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-4 border-[#112f21] border-t-[#ccf15a] animate-spin" />
                      
                      <div className="w-full max-w-sm space-y-2.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-[#a6d0b5]">Transaction Router</span>
                          <span className="text-[#ccf15a]">{checkoutProgress}%</span>
                        </div>
                        <div className="w-full bg-[#112f21] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#ccf15a] h-full transition-all duration-300" style={{ width: `${checkoutProgress}%` }} />
                        </div>
                      </div>

                      <div className="w-full bg-[#001208] border border-[#112f21] p-3 rounded-lg font-mono text-[10px] space-y-1 max-h-[140px] overflow-y-auto">
                        {checkoutLogs.map((log, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="text-[#ccf15a]">&gt;</span>
                            <span className="text-[#a6d0b5]">{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {checkoutStatus === 'success' && (
                    <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in duration-500">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#6dfe9c]/10 border border-[#6dfe9c]/40 text-[#6dfe9c] mx-auto transition-all duration-500 scale-100">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">Simulated Payment Received</h3>
                        <p className="text-sm text-[#a6d0b5] max-w-sm mx-auto">
                          In real setup, the funds flow immediately to your personal PayMongo merchant balance.
                        </p>
                      </div>

                      <div className="bg-[#022113] border border-[#6dfe9c]/20 p-4 rounded-lg max-w-sm mx-auto text-left">
                        <p className="text-xs font-mono text-[#6dfe9c] flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1">
                          <Lock className="w-3.5 h-3.5" />
                          Direct Transfer Log
                        </p>
                        <p className="text-[11px] text-[#a6d0b5] leading-relaxed">
                          No middleman accounts. Raw customer transaction settled directly into your linked bank balance in 1 business day.
                        </p>
                      </div>

                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          onClick={resetCheckoutSimulation}
                          className="px-4 py-2 border border-[#1d3a2c] hover:border-[#ccf15a] text-white hover:bg-[#ccf15a]/5 text-xs font-bold uppercase tracking-wider rounded transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none"
                        >
                          Test Again
                        </button>
                        <button
                          onClick={() => setActiveTab('dashboard')}
                          className="px-4 py-2 bg-[#ccf15a] text-[#161e00] text-xs font-bold uppercase tracking-wider rounded transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                          Check Merchant Panel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MERCHANT DASHBOARD VIEW */
                <div role="tabpanel" id="merchant-panel" aria-labelledby="tab-dashboard" className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#112f21] pb-3">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#ccf15a] animate-spin" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">WizPay Portal (Demo Mode)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-[#022113] border border-[#ccf15a]/30 text-[#ccf15a] px-2 py-0.5 rounded">
                      DIRECT CONNECT ACTIVE
                    </span>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#022113] border border-[#112f21] rounded-lg">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#a6d0b5] block">Direct Net Settled</span>
                      <span className="text-lg font-black text-white block mt-0.5">₱2,400.00</span>
                    </div>
                    <div className="p-3 bg-[#022113] border border-[#112f21] rounded-lg">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#a6d0b5] block">Platform Fees Taken</span>
                      <span className="text-lg font-black text-[#ccf15a] block mt-0.5">₱0.00</span>
                    </div>
                  </div>

                  {/* Settings Mock List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#001208] border border-[#112f21] rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#6dfe9c]" />
                        <span className="font-bold text-white">GCash direct gateway</span>
                      </div>
                      <span className="font-mono text-[#a6d0b5]">Connected (PayMongo API)</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-[#001208] border border-[#112f21] rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#6dfe9c]" />
                        <span className="font-bold text-white">Maya direct gateway</span>
                      </div>
                      <span className="font-mono text-[#a6d0b5]">Connected (PayMongo API)</span>
                    </div>
                  </div>

                  {/* Transaction feed list */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#a6d0b5] block">Demo Transaction Logs</span>
                    
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto font-mono text-[10px]">
                      <div className="flex items-center justify-between p-2 bg-[#022113]/30 border border-[#112f21]/40 rounded text-[#a6d0b5]">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6dfe9c]" />
                          ₱750.00 - GCash
                        </span>
                        <span className="text-[#6dfe9c]">COMPLETED (100% Kept)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#022113]/30 border border-[#112f21]/40 rounded text-[#a6d0b5]">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6dfe9c]" />
                          ₱1,200.00 - Visa Card
                        </span>
                        <span className="text-[#6dfe9c]">COMPLETED (100% Kept)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#022113]/30 border border-[#112f21]/40 rounded text-[#a6d0b5]">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6dfe9c]" />
                          ₱450.00 - Maya
                        </span>
                        <span className="text-[#6dfe9c]">COMPLETED (100% Kept)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/login?tab=signup" className="w-full">
                      <Button 
                        className="w-full bg-[#022113] hover:bg-[#ccf15a]/10 border border-[#ccf15a]/30 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                      >
                        Connect Your Own PayMongo Account
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Interactive Visual Banner footer */}
              <div className="mt-4 pt-3 border-t border-[#112f21] text-center">
                <span className="text-[10px] font-mono text-[#a6d0b5] uppercase tracking-widest block font-medium">
                  Demo mode. No actual cards or wallets will be charged.
                </span>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Comparison Grid Area (Direct vs Aggregator) */}
      <section className="bg-[#022113]/40 border-y border-[#112f21] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-[#161e00] bg-[#ccf15a] rounded-full uppercase tracking-wider">
              Direct Integration vs Aggregators
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-none mt-2">
              Why Keep Piling Up Fees?
            </h2>
            <p className="text-[#a6d0b5] text-sm sm:text-base">
              Traditional local checkouts route payments through intermediary bank accounts, taking percentages and locking up your cash flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* The Aggregator Card */}
            <div className="border border-[#ffb4ab]/20 rounded-xl bg-[#001208] p-8 space-y-6 hover:border-[#ffb4ab]/40 transition-all duration-300">
              <h3 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]" />
                Traditional aggregators
              </h3>
              
              <ul className="space-y-4 text-sm text-[#c5c9b1]">
                <li className="flex items-start gap-3">
                  <span className="text-[#ffb4ab] font-bold mt-0.5 font-mono">❌</span>
                  <span><strong>1.5% to 3.5% Fees:</strong> Platform transaction markups cut directly into your products profit margin.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffb4ab] font-bold mt-0.5 font-mono">❌</span>
                  <span><strong>3 to 7 Day Payout Delays:</strong> Intermediaries hold your cash before settling it into your actual bank balance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffb4ab] font-bold mt-0.5 font-mono">❌</span>
                  <span><strong>Site Redirects:</strong> Popups or browser redirects trigger system popup blockers, causing checkout drop-offs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffb4ab] font-bold mt-0.5 font-mono">❌</span>
                  <span><strong>Arbitrary Holds:</strong> Risk having your entire account frozen with funds locked away due to sudden compliance flags.</span>
                </li>
              </ul>
            </div>

            {/* The Direct WizPay Card */}
            <div className="border border-[#6dfe9c]/30 rounded-xl bg-[#062517] p-8 space-y-6 hover:border-[#6dfe9c]/60 transition-all duration-300 shadow-[0_0_30px_rgba(109,254,156,0.02)]">
              <h3 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6dfe9c]" />
                WizPay Direct Engine
              </h3>
              
              <ul className="space-y-4 text-sm text-[#c5c9b1]">
                <li className="flex items-start gap-3">
                  <span className="text-[#6dfe9c] font-bold mt-0.5 font-mono">✅</span>
                  <span><strong>0% Platform Markup:</strong> Pay only the raw processing fee from PayMongo. WizPay takes zero cuts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6dfe9c] font-bold mt-0.5 font-mono">✅</span>
                  <span><strong>Direct Payout Settlement:</strong> Payments flow directly into your PayMongo account and land in your bank in 1 day.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6dfe9c] font-bold mt-0.5 font-mono">✅</span>
                  <span><strong>Inline Checkout Experience:</strong> A clean overlay widget renders directly within your existing layout.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6dfe9c] font-bold mt-0.5 font-mono">✅</span>
                  <span><strong>Complete Data Custody:</strong> Direct credentials stay secure in your database. No third party ever intercepts your revenue log.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Features Showcase (PH Address Widget & Code Snippet) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
        
        {/* Row 1: Code Embed Snippet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-black uppercase text-white tracking-tight leading-none">
              Deploy Checkouts with One Simple Embed Code
            </h3>
            <p className="text-[#a6d0b5] text-sm sm:text-base leading-relaxed">
              Integrate the checkout system directly inside your custom site, Carrd, Webflow, or headless application. Simply place a styled HTML anchor div, load the WizPay script, and let the secure overlay process everything in-place.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-[#6dfe9c]/10 border border-[#6dfe9c]/30 flex items-center justify-center text-[#6dfe9c] text-xs">✓</div>
                <span className="text-xs font-mono text-[#a6d0b5]">Zero external popup blockers triggered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-[#6dfe9c]/10 border border-[#6dfe9c]/30 flex items-center justify-center text-[#6dfe9c] text-xs">✓</div>
                <span className="text-xs font-mono text-[#a6d0b5]">Responsive on mobile screen width formats</span>
              </div>
            </div>
          </div>

          {/* Faux Code Editor Component */}
          <div className="border border-[#112f21] rounded-xl bg-[#001208] overflow-hidden font-mono text-xs shadow-md">
            <div className="bg-[#022113] px-4 py-2.5 border-b border-[#112f21] flex justify-between items-center">
              <span className="text-[10px] text-[#a6d0b5] tracking-wider flex items-center gap-1.5 font-medium">
                <Code className="w-3.5 h-3.5 text-[#ccf15a]" />
                embed-storefront.html
              </span>
              <button 
                onClick={copyCodeSnippet}
                className="flex items-center gap-1.5 text-[10px] text-[#a6d0b5] hover:text-[#ccf15a] transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none rounded px-1.5 py-0.5"
              >
                {copiedSnippet ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ccf15a]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            
            <div className="p-5 overflow-x-auto text-[#c5c9b1] bg-[#001208]/90 leading-relaxed">
              <pre>
{`<!-- 1. The container where the checkout renders inline -->
<div 
  id="wizpay-storefront" 
  data-form-id="oz-wallet"
></div>

<!-- 2. Import the direct checkout SDK -->
<script 
  src="https://pay.unwiz.ai/sdk/wizpay.js"
></script>`}
              </pre>
            </div>
          </div>
        </div>



      </section>

      {/* Developer Integration / AI Copilots Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-[#112f21]/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Onboarding Guide */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold text-[#a6d0b5] border-l-2 border-[#ccf15a] pl-2 uppercase tracking-wide">
              Developer Ecosystem
            </span>
            <h3 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-none">
              Build & Manage Forms using AI Copilots
            </h3>
            <p className="text-[#a6d0b5] text-sm sm:text-base leading-relaxed">
              WizPay supports the open-standard <strong>Model Context Protocol (MCP)</strong>. This connects WizPay directly to your local AI coding assistants (like Antigravity, Claude Desktop, Cursor, Cline, or Roo Code) so they can build, customize, and track payment forms for you using simple chat instructions.
            </p>
            <div className="p-4 rounded-lg bg-[#062517]/50 border border-[#112f21]/80 space-y-2">
              <h4 className="text-xs font-mono uppercase text-[#6dfe9c] font-bold">Self-Hostable Core</h4>
              <p className="text-xs text-[#a6d0b5] leading-normal">
                Want complete data custody and zero dependencies? Clone the repository and self-host your own payment engine on Vercel and Firebase in minutes.
              </p>
              <a 
                href="https://github.com/jedmamosto/open-wizpay" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-xs text-[#ccf15a] hover:underline font-semibold"
              >
                <span>Read the Self-Hosting Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Step-by-Step Onboarding Instructions */}
            <div className="space-y-5 pt-4">
              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-[#ccf15a]/10 border border-[#ccf15a]/30 flex items-center justify-center text-[#ccf15a] text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Create a Merchant Account</h4>
                  <p className="text-xs text-[#a6d0b5] leading-relaxed">
                    Register your shop on the platform at{' '}
                    <Link href="/login?tab=signup" className="text-[#ccf15a] underline hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none rounded">
                      wizpay.com/sign-up
                    </Link>
                    . It takes less than 30 seconds.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-[#ccf15a]/10 border border-[#ccf15a]/30 flex items-center justify-center text-[#ccf15a] text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Generate Developer API Key</h4>
                  <p className="text-xs text-[#a6d0b5] leading-relaxed">
                    Navigate to **Settings &gt; Developer Settings** in your Admin Dashboard and click **Generate API Key**. Copy your token (`wzp_live_...`).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-[#ccf15a]/10 border border-[#ccf15a]/30 flex items-center justify-center text-[#ccf15a] text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Run the Auto-Installer</h4>
                  <p className="text-xs text-[#a6d0b5] leading-relaxed">
                    Open your terminal application (e.g. Command Prompt or PowerShell on Windows, Terminal on macOS) and run the installer. It will automatically scan your system and configure all detected AI clients:
                  </p>
                  <div className="mt-2 p-3 rounded-lg bg-[#001208] border border-[#112f21] font-mono text-[11px] text-white flex justify-between items-center max-w-md">
                    <span>npx @jedmamosto/wizpay-mcp-setup</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('npx @jedmamosto/wizpay-mcp-setup');
                      }}
                      className="text-[#a6d0b5] hover:text-[#ccf15a] text-[10px] uppercase font-bold tracking-wider focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none rounded px-2 py-1 transition-all"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-[10px] text-[#a6d0b5]/70 mt-1.5 italic">
                    Note: Requires Node.js installed on your computer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-6 w-6 rounded-full bg-[#ccf15a]/10 border border-[#ccf15a]/30 flex items-center justify-center text-[#ccf15a] text-xs font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Prompt your AI Agent</h4>
                  <p className="text-xs text-[#a6d0b5] leading-relaxed">
                    Restart your AI assistant (close and reopen Claude Desktop, or reload your VS Code/Cursor editor) and ask it to create payment forms:
                    <span className="block mt-1 font-mono text-[10px] text-[#ccf15a]">
                      &ldquo;Create a GCash payment form for my store &apos;Manila Coffee&apos; selling beans for 450 PHP.&rdquo;
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive MCP Terminal Simulation */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            <div className="border border-[#112f21] rounded-xl bg-[#062517]/50 backdrop-blur-md shadow-lg overflow-hidden">
              
              {/* Terminal Tabs */}
              <div className="bg-[#022113] px-3 py-2.5 sm:px-4 border-b border-[#112f21] flex justify-between items-center">
                <span className="text-[10px] font-mono text-[#a6d0b5] tracking-wider hidden sm:flex items-center gap-1.5 font-medium">
                  <Code className="w-3.5 h-3.5 text-[#ccf15a]" />
                  Claude / Cursor Interface
                </span>

                <div className="flex gap-1 sm:gap-1.5" role="tablist" aria-label="Developer Terminal Tabs">
                  <button
                    role="tab"
                    aria-selected={devTerminalTab === 'prompt'}
                    id="dev-tab-prompt"
                    aria-controls="dev-panel-prompt"
                    onClick={() => setDevTerminalTab('prompt')}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${devTerminalTab === 'prompt' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#a6d0b5] hover:text-white'}`}
                  >
                    1. Prompt
                  </button>
                  <button
                    role="tab"
                    aria-selected={devTerminalTab === 'rpc'}
                    id="dev-tab-rpc"
                    aria-controls="dev-panel-rpc"
                    onClick={() => setDevTerminalTab('rpc')}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${devTerminalTab === 'rpc' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#a6d0b5] hover:text-white'}`}
                  >
                    2. JSON-RPC
                  </button>
                  <button
                    role="tab"
                    aria-selected={devTerminalTab === 'result'}
                    id="dev-tab-result"
                    aria-controls="dev-panel-result"
                    onClick={() => setDevTerminalTab('result')}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${devTerminalTab === 'result' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#a6d0b5] hover:text-white'}`}
                  >
                    3. Result
                  </button>
                </div>
              </div>

              {/* Terminal Screen Area */}
              <div className="p-5 min-h-[320px] font-mono text-[11px] text-[#a6d0b5] bg-[#001208]/90 flex flex-col justify-between leading-relaxed">
                {devTerminalTab === 'prompt' && (
                  <div role="tabpanel" id="dev-panel-prompt" aria-labelledby="dev-tab-prompt" className="space-y-3">
                    <p className="text-[#a6d0b5]/50">{"// prompt your local AI agent"}</p>
                    <div className="flex gap-2">
                      <span className="text-[#ccf15a] font-bold">&gt;</span>
                      <span className="text-white font-semibold">
                        &ldquo;Hey, create a GCash checkout form for my shop Batangas Roast. I sell &apos;Barako Ground Pack&apos; for 380 PHP. Make the design emerald with Inter font.&rdquo;
                      </span>
                    </div>
                    <div className="pt-4 space-y-1 text-[#6dfe9c]">
                      <p>&gt; Calling tool: create_form...</p>
                      <p>&gt; Validating parameters against wizpay://schemas/payment-form...</p>
                      <p>&gt; Authenticating with key wzp_live_xxxxxxxx...</p>
                    </div>
                  </div>
                )}

                {devTerminalTab === 'rpc' && (
                  <div role="tabpanel" id="dev-panel-rpc" aria-labelledby="dev-tab-rpc" className="space-y-3">
                    <p className="text-[#a6d0b5]/50">{"// client-to-server JSON-RPC payload"}</p>
                    <pre className="text-white text-[10px] leading-tight overflow-x-auto max-w-full">
{`{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "create_form",
    "arguments": {
      "paymentFormTitle": "Batangas Roast",
      "paymentFormDescription": "Order Barako Ground Pack online.",
      "paymentFormSuccessURL": "https://example.com/success",
      "paymentFormCancelURL": "https://example.com/cancel",
      "paymentFormPaymongoPubKey": "pk_live_...",
      "paymentFormPaymongoSecKey": "sk_live_...",
      "paymentFormProducts": [
        {
          "productName": "Barako Ground Pack",
          "productPrice": 380
        }
      ],
      "appearance": {
        "colorScheme": "emerald",
        "fontFamily": "inter"
      }
    }
  }
}`}
                    </pre>
                  </div>
                )}

                {devTerminalTab === 'result' && (
                  <div role="tabpanel" id="dev-panel-result" aria-labelledby="dev-tab-result" className="space-y-3 animate-in fade-in duration-300">
                    <p className="text-[#a6d0b5]">{"// response from local mcp server"}</p>
                    <div className="text-[#6dfe9c]">
                      <p>Form created successfully!</p>
                      <p className="mt-2 text-white">✓ Form Title: &ldquo;Batangas Roast&rdquo;</p>
                      <p className="text-white">✓ Form Link: <span className="text-[#ccf15a] underline cursor-pointer">https://pay.unwiz.ai/payment-form/barako-123</span></p>
                      <p className="text-white">✓ Scoped to Merchant ID: &ldquo;test-user-mcp&rdquo;</p>
                    </div>
                    <div className="mt-4 p-2.5 bg-[#022113] border border-[#6dfe9c]/30 rounded text-white text-[10px] leading-normal">
                      <p className="font-bold uppercase tracking-wider text-[#6dfe9c] mb-1">Interactive Checkout Active</p>
                      Copy and paste the frame script block in your storefront to begin taking GCash, Maya, and Card payments.
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-3 border-t border-[#112f21] flex justify-between items-center text-[10px] text-[#a6d0b5] uppercase tracking-widest font-medium">
                  <span>Protocol: stdio</span>
                  <span>Server: wizpay-mcp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-[#022113]/20 border-t border-[#112f21] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-16 space-y-3">
            <span className="text-xs font-semibold text-[#a6d0b5] border-l-2 border-[#ccf15a] pl-2 uppercase tracking-wide">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-2">
              Payment Integration FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is WizPay really free? How do you make money?",
                a: "Yes, WizPay is completely open-source and free to use. We do not charge transaction setup percentages or monthly fees. You connect your direct PayMongo account credentials to process checkouts, meaning you only pay PayMongo's raw standard gateway fees. We make zero markups."
              },
              {
                q: "Do I need developer skills to set up payment forms?",
                a: "No! We provide a visual administrative dashboard where you can build checkouts, manage catalog items, and track orders. Once styled, we provide a copy-paste HTML block that you can insert into Webflow, Wix, Carrd, or custom code blocks."
              },
              {
                q: "How secure are my PayMongo API credentials?",
                a: "Security is our highest mandate. Your secret keys are stored securely inside your private Firebase database instance, completely isolated from our servers. When client requests query details, WizPay sanitizes all payloads, meaning private credentials are never returned to consumer browsers."
              },
              {
                q: "Which Philippine payment methods are supported?",
                a: "Out-of-the-box, we support GCash, Maya, GrabPay, Visa, Mastercard, JCB, QR Ph, and Billease Buy Now Pay Later configurations."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="border border-[#112f21] rounded-lg bg-[#001208]/80 overflow-hidden transition-all duration-300"
              >
                <button
                  id={`faq-btn-${index}`}
                  aria-expanded={activeFaq === index}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none hover:bg-[#022113]/30 transition-all"
                >
                  <span className="font-bold text-white text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#a6d0b5] transition-transform duration-300 ${activeFaq === index ? 'transform rotate-180 text-[#ccf15a]' : ''}`} />
                </button>
                
                {activeFaq === index && (
                  <div 
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-btn-${index}`}
                    className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#a6d0b5] leading-relaxed border-t border-[#112f21]/50 bg-[#022113]/10"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exit Intent Call to Action Footer Area */}
      <section className="border-t border-[#112f21] py-16 md:py-24 text-center space-y-8 bg-[#001208]">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none">
            Ready to Take Control of Your Revenue?
          </h2>
          <p className="text-[#a6d0b5] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Stop giving away transaction cuts to intermediaries. Connect direct credentials, retain 100% of checkouts, and build beautiful payment structures.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/login?tab=signup">
            <Button
              className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] text-sm font-bold uppercase tracking-wider h-auto py-4 px-10 rounded-lg transition-all shadow-[0_4px_20px_rgba(204,241,90,0.15)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              Start My Free Setup
            </Button>
          </Link>
        </div>

        <p className="text-[10px] font-mono uppercase tracking-widest text-[#a6d0b5] font-medium">
          Open-Source Core Engine. Self-Hosted & Secure.
        </p>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-[#112f21] bg-[#001208]/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#a6d0b5]">
          <p>&copy; {new Date().getFullYear()} WizPay payments framework. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer focus-visible:underline outline-none">[Terms of Service]</span>
            <span className="hover:text-white cursor-pointer focus-visible:underline outline-none">[Privacy Policy]</span>
            <a href="https://github.com/jedmamosto/open-wizpay" target="_blank" rel="noopener noreferrer" className="hover:text-white focus-visible:underline outline-none">[GitHub Repository]</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
