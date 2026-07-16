'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Code, 
  Copy, 
  ShieldCheck,
  Terminal,
  Server,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Developers() {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedNpx, setCopiedNpx] = useState(false);
  const [devTerminalTab, setDevTerminalTab] = useState<'prompt' | 'rpc' | 'result'>('prompt');

  const copyCodeSnippet = () => {
    const code = `<div id="wizpay-storefront" data-form-id="oz-wallet"></div>\n<script src="https://pay.unwiz.ai/sdk/wizpay.js"></script>`;
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const copyNpxCommand = () => {
    const command = 'npx @jedmamosto/wizpay-mcp-setup';
    navigator.clipboard.writeText(command);
    setCopiedNpx(true);
    setTimeout(() => setCopiedNpx(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#00180c] bg-[radial-gradient(circle_at_center,_#062517_0%,_#001208_80%)] text-[#c8ebd5] font-sans antialiased overflow-x-hidden selection:bg-[#ccf15a] selection:text-[#00180c]">
      
      {/* Primary Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-[#112f21]/50">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#ccf15a] to-[#6dfe9c] p-[2px] shrink-0">
            <div className="h-full w-full bg-[#00180c] rounded-[6px] flex items-center justify-center">
              <span className="text-white font-black text-lg tracking-tighter">Oz</span>
            </div>
          </Link>
          <span className="text-xl font-black uppercase text-white tracking-widest hidden min-[400px]:inline">WizPay Docs</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#c5c9b1] hover:text-white transition-colors duration-300 rounded px-2 py-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <a
            href="https://github.com/jedmamosto/open-wizpay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#c5c9b1] hover:text-white transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none rounded px-2 py-1.5 whitespace-nowrap"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Developer Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ccf15a]/30 bg-[#ccf15a]/5 text-[#ccf15a] text-xs font-mono tracking-widest uppercase">
          <Terminal className="h-3 w-3" />
          <span>DEVELOPER PORTAL</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white max-w-3xl mx-auto leading-none">
          Integrate local payments using <span className="text-[#ccf15a]">SDKs</span> & <span className="text-[#ccf15a]">AI Tools</span>
        </h1>
        <p className="text-base text-[#a6d0b5] leading-relaxed max-w-xl mx-auto">
          Deploy direct GCash, Maya, and credit card checkouts. WizPay is open-source, customizable, and features built-in Model Context Protocol (MCP) support for AI-accelerated setup.
        </p>
      </section>

      {/* Main Grid: Code Embed & MCP Simulation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Embed SDK Details */}
        <div className="lg:col-span-6 space-y-10">
          
          {/* Card 1: HTML Embed SDK */}
          <div className="border border-[#112f21] rounded-xl bg-[#062517]/30 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-[#ccf15a]/10 flex items-center justify-center text-[#ccf15a]">
                <Code className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Embed Storefront SDK</h2>
            </div>
            
            <p className="text-sm text-[#a6d0b5] leading-relaxed">
              Add direct checkouts to any custom site, Carrd, Webflow, or static webpage. Simply insert a container div with your form ID, and import the client SDK. The script will render the secure payment overlay in-place without external redirects.
            </p>

            {/* Faux Code Editor Component */}
            <div className="border border-[#112f21] rounded-xl bg-[#001208] overflow-hidden font-mono text-xs shadow-md">
              <div className="bg-[#022113] px-4 py-2.5 border-b border-[#112f21] flex justify-between items-center">
                <span className="text-[10px] text-[#a6d0b5] tracking-wider flex items-center gap-1.5 font-medium">
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
{`<!-- 1. The container where checkout renders inline -->
<div 
  id="wizpay-storefront" 
  data-form-id="your-form-id"
></div>

<!-- 2. Import the direct checkout SDK -->
<script 
  src="https://pay.unwiz.ai/sdk/wizpay.js"
></script>`}
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 text-[#6dfe9c] shrink-0 mt-0.5">✓</div>
                <span className="text-xs text-[#a6d0b5]">No popup-blocking conflicts</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 text-[#6dfe9c] shrink-0 mt-0.5">✓</div>
                <span className="text-xs text-[#a6d0b5]">Responsive on all viewports</span>
              </div>
            </div>
          </div>

          {/* Card 2: Self Hosting Core */}
          <div className="border border-[#112f21] rounded-xl bg-[#062517]/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-[#ccf15a]/10 flex items-center justify-center text-[#ccf15a]">
                <Layers className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Self-Hosted Deployment</h2>
            </div>
            
            <p className="text-sm text-[#a6d0b5] leading-relaxed">
              If you require complete data isolation, you can self-host the core Next.js engine and Firebase database on your own servers. All API credentials and keys will remain entirely inside your infrastructure.
            </p>
            
            <a 
              href="https://github.com/jedmamosto/open-wizpay" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-xs text-[#ccf15a] hover:underline font-semibold pt-1"
            >
              <span>GitHub Self-Hosting Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>

        {/* Right Column: AI-Native MCP Server Integration */}
        <div className="lg:col-span-6 space-y-8">
          
          <div className="border border-[#112f21] rounded-xl bg-[#062517]/30 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-[#ccf15a]/10 flex items-center justify-center text-[#ccf15a]">
                <Server className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">AI-Native MCP Server</h2>
            </div>
            
            <p className="text-sm text-[#a6d0b5] leading-relaxed">
              WizPay implements the **Model Context Protocol (MCP)**. This lets your local AI coding assistants (such as Antigravity, Cursor, or Claude Desktop) configure, update, and deploy checkout forms automatically on your behalf.
            </p>

            {/* Install Step */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-white uppercase tracking-wider">1. Run Auto-Installer locally:</h3>
              <div className="p-3 rounded-lg bg-[#001208] border border-[#112f21] font-mono text-[11px] text-white flex justify-between items-center">
                <span>npx @jedmamosto/wizpay-mcp-setup</span>
                <button
                  onClick={copyNpxCommand}
                  className="text-[#a6d0b5] hover:text-[#ccf15a] text-[10px] uppercase font-bold tracking-wider focus-visible:ring-2 focus-visible:ring-[#ccf15a] focus-visible:outline-none rounded px-2 py-1 transition-all"
                >
                  {copiedNpx ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-[#a6d0b5]/70 italic">
                Note: Requires Node.js and a WizPay Developer API Key (generate one under Developer Settings).
              </p>
            </div>

            {/* Simulated AI Interface Terminal */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono text-white uppercase tracking-wider">2. Interactive AI Agent Flow:</h3>
              
              <div className="border border-[#112f21] rounded-xl bg-[#062517]/50 overflow-hidden">
                {/* Terminal Tabs */}
                <div className="bg-[#022113] px-3 py-2 border-b border-[#112f21] flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#a6d0b5] tracking-wider uppercase font-medium">
                    AI Editor Shell
                  </span>

                  <div className="flex gap-1" role="tablist" aria-label="Terminal Tabs">
                    {(['prompt', 'rpc', 'result'] as const).map((tab, idx) => (
                      <button
                        key={tab}
                        role="tab"
                        aria-selected={devTerminalTab === tab}
                        onClick={() => setDevTerminalTab(tab)}
                        className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider transition-all ${devTerminalTab === tab ? 'bg-[#ccf15a] text-[#161e00]' : 'text-[#a6d0b5] hover:text-white'}`}
                      >
                        {idx + 1}. {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terminal Screen Area */}
                <div className="p-4 min-h-[260px] font-mono text-[10px] text-[#a6d0b5] bg-[#001208]/90 flex flex-col justify-between leading-relaxed">
                  {devTerminalTab === 'prompt' && (
                    <div className="space-y-2">
                      <p className="text-[#a6d0b5]/40">{"// prompt your AI coding assistant"}</p>
                      <div className="flex gap-2">
                        <span className="text-[#ccf15a] font-bold">&gt;</span>
                        <span className="text-white">
                          &ldquo;Create a GCash payment form for my store &apos;Batangas Roast&apos;. Price is 380 PHP. Theme color should be emerald.&rdquo;
                        </span>
                      </div>
                      <div className="pt-3 space-y-1 text-[#6dfe9c]">
                        <p>&gt; AI agent calls tool: create_form...</p>
                        <p>&gt; Validating against payment-form schema...</p>
                        <p>&gt; Authenticating developer key...</p>
                      </div>
                    </div>
                  )}

                  {devTerminalTab === 'rpc' && (
                    <div className="space-y-2">
                      <p className="text-[#a6d0b5]/40">{"// MCP client-to-server payload"}</p>
                      <pre className="text-white text-[9px] leading-tight overflow-x-auto">
{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "create_form",
    "arguments": {
      "paymentFormTitle": "Batangas Roast",
      "paymentFormProducts": [{
        "productName": "Coffee Roast",
        "productPrice": 380
      }],
      "appearance": { "colorScheme": "emerald" }
    }
  }
}`}
                      </pre>
                    </div>
                  )}

                  {devTerminalTab === 'result' && (
                    <div className="space-y-2">
                      <p className="text-[#a6d0b5]/40">{"// JSON response from local MCP server"}</p>
                      <div className="text-[#6dfe9c]">
                        <p>Form successfully created!</p>
                        <p className="mt-1 text-white">✓ Form Title: &ldquo;Batangas Roast&rdquo;</p>
                        <p className="text-white">✓ Form Link: <span className="text-[#ccf15a] underline">https://pay.unwiz.ai/payment-form/br-380</span></p>
                      </div>
                      <p className="mt-3 p-2 bg-[#022113] border border-[#6dfe9c]/20 rounded text-white text-[9px]">
                        The AI assistant has updated your database and injected the embed code directly into your files.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-2 border-t border-[#112f21] flex justify-between text-[9px] text-[#a6d0b5]/60">
                    <span>Protocol: stdio</span>
                    <span>Server: wizpay-mcp</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Security Info Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#112f21]/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold uppercase text-xs">
              <ShieldCheck className="h-4 w-4 text-[#ccf15a]" />
              Credential Sandboxing
            </div>
            <p className="text-xs text-[#a6d0b5] leading-relaxed">
              API credentials are kept safe in your private database. Sanitization protocols ensure secret keys are never returned in public frontend configurations.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold uppercase text-xs">
              <ShieldCheck className="h-4 w-4 text-[#ccf15a]" />
              Standard Webhooks
            </div>
            <p className="text-xs text-[#a6d0b5] leading-relaxed">
              Standard secure event listeners process payment events from PayMongo, executing orders and updating inventory state in real-time.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold uppercase text-xs">
              <ShieldCheck className="h-4 w-4 text-[#ccf15a]" />
              Type Safe Core
            </div>
            <p className="text-xs text-[#a6d0b5] leading-relaxed">
              The core monorepo is fully written in strict TypeScript. Safe Zod schema validations handle form creation, API parameters, and checkouts.
            </p>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-[#112f21] bg-[#001208]/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#a6d0b5]">
          <p>&copy; {new Date().getFullYear()} WizPay payments framework. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white outline-none">[Return to Main Site]</Link>
            <a href="https://github.com/jedmamosto/open-wizpay" target="_blank" rel="noopener noreferrer" className="hover:text-white outline-none">[GitHub Repository]</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
