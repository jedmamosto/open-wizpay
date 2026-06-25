'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  CreditCard, 
  Lock, 
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  // Navigation active states
  const [activeTab, setActiveTab] = useState<'checkout' | 'dashboard' | 'designer'>('checkout');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  
  // Interactive FAQ active item
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen bg-[#00180c] bg-[radial-gradient(circle_at_center,_#062517_0%,_#001208_80%)] text-[#c8ebd5] font-sans antialiased overflow-x-hidden selection:bg-[#ccf15a] selection:text-[#00180c]">
      
      {/* Upper Announcement Bar */}
      <div className="w-full bg-[#022113] border-b border-[#112f21]/80 py-2.5 px-4 text-center">
        <p className="text-xs font-mono tracking-wider uppercase text-[#c5c9b1] flex items-center justify-center gap-1.5 flex-wrap">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ccf15a] animate-pulse" />
          <span>Demo and Simulation Environment Only. No real money transactions.</span>
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
          <Link 
            href="/login" 
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#c5c9b1] hover:text-white transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none rounded px-2.5 py-1.5 whitespace-nowrap"
          >
            Sign In
          </Link>
          <a
            href="https://github.com/jedmamosto/open-wizpay"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button 
              className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-5 sm:py-2.5 rounded-md transition-all duration-300 shadow-[0_4px_12px_rgba(204,241,90,0.15)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              GitHub / Deploy
            </Button>
          </a>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Copy Panel */}
        <div className="lg:col-span-6 space-y-8">
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ccf15a]/30 bg-[#ccf15a]/5 text-[#ccf15a] text-xs font-bold tracking-widest uppercase">
              <span className="h-2 w-2 bg-[#ccf15a] rounded-full shrink-0" />
              DIRECT PAYMENT GATEWAY
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6dfe9c]/30 bg-[#6dfe9c]/5 text-[#6dfe9c] text-xs font-bold tracking-widest uppercase">
              <span>OPEN SOURCE</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-white leading-[1.05]">
            Accept GCash, Maya, and credit cards <span className="text-[#ccf15a]">directly</span> on your store
          </h1>

          <p className="text-lg text-[#a6d0b5] leading-relaxed max-w-xl">
            Connect your own PayMongo account to process payments. Keep your earnings minus raw gateway fees—WizPay itself takes 0% platform transaction cuts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a href="https://github.com/jedmamosto/open-wizpay" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button
                className="w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] text-sm font-bold uppercase tracking-wider h-auto py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(204,241,90,0.2)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                Deploy WizPay
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
            <a href="#ai-onboarding" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="w-full border border-[#1d3a2c] text-white hover:bg-[#112f21] hover:text-white text-sm font-bold uppercase tracking-wider h-auto py-4 px-8 rounded-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                AI Onboarding
              </Button>
            </a>
          </div>
        </div>

        {/* Right Sandbox Visual Panel */}
        <div id="sandbox-demo" className="lg:col-span-6 w-full max-w-xl mx-auto">
          <div className="border border-[#1d3a2c] rounded-xl bg-[#062517]/70 backdrop-blur-md shadow-lg overflow-hidden">
            
            {/* Terminal Window Header */}
            <div className="bg-[#022113] px-3 py-3 sm:px-4 flex items-center justify-between border-b border-[#112f21]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                <span className="text-[11px] font-mono text-[#a6d0b5]/70 ml-2 tracking-widest uppercase hidden sm:inline">Interactive Sandbox</span>
              </div>
              
              <div role="tablist" aria-label="Interactive Demo Switcher" className="flex bg-[#00180c] p-0.5 rounded-lg border border-[#112f21]">
                <button
                  role="tab"
                  aria-selected={activeTab === 'designer'}
                  aria-controls="designer-panel"
                  id="tab-designer"
                  onClick={() => setActiveTab('designer')}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${activeTab === 'designer' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#c5c9b1] hover:text-white'}`}
                >
                  Visual Designer
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'checkout'}
                  aria-controls="checkout-panel"
                  id="tab-checkout"
                  onClick={() => setActiveTab('checkout')}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${activeTab === 'checkout' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#c5c9b1] hover:text-white'}`}
                >
                  Checkout View
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'dashboard'}
                  aria-controls="merchant-panel"
                  id="tab-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${activeTab === 'dashboard' ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#c5c9b1] hover:text-white'}`}
                >
                  Merchant Panel
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
                            className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${checkoutPaymentMethod === 'gcash' ? `${colors.border} ${colors.bgLight} text-white` : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
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
                            className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${checkoutPaymentMethod === 'maya' ? `${colors.border} ${colors.bgLight} text-white` : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
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
                            className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none ${checkoutPaymentMethod === 'card' ? `${colors.border} ${colors.bgLight} text-white` : 'border-[#112f21] bg-[#001208] text-[#c5c9b1] hover:border-[#ccf15a]/30'}`}
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
                        className="w-full font-bold text-sm uppercase tracking-wider py-5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
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
                    <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in duration-500">
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

                      <div className="bg-[#022113] border border-[#6dfe9c]/20 p-4 rounded-lg max-w-sm mx-auto text-left">
                        <p 
                          style={{ color: colors.primary }}
                          className="text-xs font-mono flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1"
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
                          className="px-4 py-2 border border-[#1d3a2c] hover:border-[#ccf15a] text-white hover:bg-[#ccf15a]/5 text-xs font-bold uppercase tracking-wider rounded transition-all focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none"
                        >
                          Test Again
                        </button>
                        <button
                          onClick={() => setActiveTab('dashboard')}
                          style={{ backgroundColor: colors.primary, color: colors.text }}
                          className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                          Check Merchant Panel
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
                    <div className="flex items-center gap-2">
                      <Settings 
                        style={{ color: colors.primary }}
                        className="w-4 h-4 animate-spin" 
                      />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">WizPay Portal (Demo)</span>
                    </div>
                    <span 
                      style={{ borderColor: `${colors.primary}40`, color: colors.primary }}
                      className="text-[10px] font-mono bg-[#022113] border px-2 py-0.5 rounded"
                    >
                      DIRECT SETTLEMENT ACTIVE
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
                      <span 
                        style={{ color: colors.primary }}
                        className="text-lg font-black block mt-0.5"
                      >
                        ₱0.00
                      </span>
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
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#a6d0b5] block">Simulation Log History</span>
                    
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto font-mono text-[10px]">
                      <div className="flex items-center justify-between p-2 bg-[#022113]/30 border border-[#112f21]/40 rounded text-[#a6d0b5]">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 
                            style={{ color: colors.primary }}
                            className="w-3.5 h-3.5" 
                          />
                          ₱{formPrice.toFixed(2)} - GCash
                        </span>
                        <span 
                          style={{ color: colors.primary }}
                          className="font-bold"
                        >
                          100% KEPT
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#022113]/30 border border-[#112f21]/40 rounded text-[#a6d0b5]">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6dfe9c]" />
                          ₱1,200.00 - Visa Card
                        </span>
                        <span className="text-[#6dfe9c] font-bold">100% KEPT</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#022113]/30 border border-[#112f21]/40 rounded text-[#a6d0b5]">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6dfe9c]" />
                          ₱450.00 - Maya
                        </span>
                        <span className="text-[#6dfe9c] font-bold">100% KEPT</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/login" className="w-full">
                      <button 
                        style={{ borderColor: `${colors.primary}40` }}
                        className="w-full bg-[#022113] hover:bg-white/5 border text-white font-bold text-xs uppercase tracking-wider py-4 rounded-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                      >
                        Configure PayMongo Account
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Interactive Visual Banner footer */}
              <div className="mt-4 pt-3 border-t border-[#112f21] text-center">
                <span className="text-[10px] font-mono text-[#a6d0b5] uppercase tracking-widest block font-medium">
                  Use designer to customize text, prices, and colors.
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
              Fee Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-none mt-2">
              Pay Processing Fees Only
            </h2>
            <p className="text-[#a6d0b5] text-sm sm:text-base">
              Standard hosted platforms add extra commission margins on top of the processor rates. WizPay removes the middleman completely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* The Aggregator Card */}
            <div className="border border-[#ffb4ab]/20 rounded-xl bg-[#001208] p-8 space-y-6 hover:border-[#ffb4ab]/40 transition-all duration-300">
              <h3 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]" />
                Aggregator Platforms
              </h3>
              
              <ul className="space-y-4 text-sm text-[#c5c9b1]">
                <li className="flex items-start gap-3">
                  <span className="text-[#ffb4ab] font-bold mt-0.5 font-mono">❌</span>
                  <span><strong>Extra Transaction Fees:</strong> Standard platforms take a percentage cut of every order you sell.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffb4ab] font-bold mt-0.5 font-mono">❌</span>
                  <span><strong>Payout Delays:</strong> Funds are held by intermediary accounts for days before transferring to your bank.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffb4ab] font-bold mt-0.5 font-mono">❌</span>
                  <span><strong>Forced Redirects:</strong> Customers are redirected to third-party domains, increasing cart abandonment.</span>
                </li>
              </ul>
            </div>

            {/* The Direct WizPay Card */}
            <div className="border border-[#6dfe9c]/30 rounded-xl bg-[#062517] p-8 space-y-6 hover:border-[#6dfe9c]/60 transition-all duration-300 shadow-[0_0_30px_rgba(109,254,156,0.02)]">
              <h3 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6dfe9c]" />
                WizPay Framework
              </h3>
              
              <ul className="space-y-4 text-sm text-[#c5c9b1]">
                <li className="flex items-start gap-3">
                  <span className="text-[#6dfe9c] font-bold mt-0.5 font-mono">✅</span>
                  <span><strong>0% Extra Markup:</strong> You only pay PayMongo&apos;s standard credit card/GCash gateway fees directly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6dfe9c] font-bold mt-0.5 font-mono">✅</span>
                  <span><strong>Instant Processing:</strong> Payments clear straight into your linked PayMongo balance without middlemen holds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6dfe9c] font-bold mt-0.5 font-mono">✅</span>
                  <span><strong>Embedded Checkout:</strong> The checkout form is shown directly on your website, providing a smooth user flow.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* AI Onboarding Prompt Section */}
      <section id="ai-onboarding" className="bg-[#022113]/20 border-t border-[#112f21] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-[#112f21] rounded-2xl bg-[#062517]/50 p-6 sm:p-10 space-y-8 shadow-lg max-w-3xl mx-auto">
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ccf15a]/30 bg-[#ccf15a]/5 text-[#ccf15a] text-xs font-mono uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI-Powered Onboarding</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                Not a Coder? Use your AI Assistant
              </h2>
              <p className="text-sm text-[#a6d0b5] leading-relaxed">
                If you want to use WizPay but don&apos;t have developer skills, you can have your favorite AI assistant (like Claude, Gemini, or ChatGPT) set up and configure everything for you. WizPay supports the **Model Context Protocol (MCP)**, meaning your AI can directly create payment forms and connect gateways on your behalf once you run our simple installer.
              </p>
            </div>

            <div className="border border-[#112f21] rounded-xl bg-[#001208] p-5 font-mono text-xs text-[#c5c9b1] leading-relaxed relative">
              <p className="text-[#a6d0b5]/50 mb-3">{"// Copy this prompt and paste it to your AI"}</p>
              <p className="text-white select-all">
                &ldquo;I want to use WizPay (an open-source Philippine payment system, hosted at https://github.com/jedmamosto/open-wizpay) to accept GCash and Maya payments on my online shop. I do not know how to code, but I want to connect you to WizPay using the Model Context Protocol (MCP) so you can configure checkouts for me. The auto-installer command is `npx @jedmamosto/wizpay-mcp-setup`. Please read the repository documentation (if you have web search enabled) and explain in simple steps how I can run this setup on my computer, and how you will then create and customize payment forms for me once connected.&rdquo;
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={() => {
                  const promptText = `I want to use WizPay (an open-source Philippine payment system, hosted at https://github.com/jedmamosto/open-wizpay) to accept GCash and Maya payments on my online shop. I do not know how to code, but I want to connect you to WizPay using the Model Context Protocol (MCP) so you can configure checkouts for me. The auto-installer command is \`npx @jedmamosto/wizpay-mcp-setup\`. Please read the repository documentation (if you have web search enabled) and explain in simple steps how I can run this setup on my computer, and how you will then create and customize payment forms for me once connected.`;
                  navigator.clipboard.writeText(promptText);
                  setCopiedSnippet(true);
                  setTimeout(() => setCopiedSnippet(false), 2000);
                }}
                className="w-full sm:w-auto bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                {copiedSnippet ? 'Copied Prompt to Clipboard!' : 'Copy Onboarding Prompt'}
              </button>
              <span className="text-[10px] font-mono text-[#a6d0b5]/70 uppercase tracking-widest text-center sm:text-right">
                Connects directly to your AI Assistant via MCP
              </span>
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
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is WizPay really free? How do you make money?",
                a: "Yes, WizPay is completely open-source and free to use. We do not charge transaction setup percentages or monthly fees. You connect your direct PayMongo account credentials to process checkouts, meaning you only pay PayMongo's raw standard gateway fees. We make zero platform markups."
              },
              {
                q: "Do I need developer skills to set up payment forms?",
                a: "No. While developers love our SDK, non-technical merchants can visually configure checkouts in the dashboard and paste the resulting script onto their website. Alternatively, you can copy our AI onboarding prompt and have an AI model walk you through the setup."
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
            Ready to Take Control of Your Payments?
          </h2>
          <p className="text-[#a6d0b5] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Stop giving away transaction cuts to third-party platforms. Link your credentials, retain 100% of your earnings, and deploy checkout buttons instantly.
          </p>
        </div>

        <div className="pt-2">
          <a href="https://github.com/jedmamosto/open-wizpay" target="_blank" rel="noopener noreferrer">
            <Button
              className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] text-sm font-bold uppercase tracking-wider h-auto py-4 px-10 rounded-lg transition-all shadow-[0_4px_20px_rgba(204,241,90,0.15)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              Get Started on GitHub
            </Button>
          </a>
        </div>

        <p className="text-[10px] font-mono uppercase tracking-widest text-[#a6d0b5] font-medium">
          Open-Source. Direct Integration. Secure.
        </p>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-[#112f21] bg-[#001208]/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#a6d0b5]">
          <p>&copy; {new Date().getFullYear()} WizPay. All rights reserved.</p>
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
