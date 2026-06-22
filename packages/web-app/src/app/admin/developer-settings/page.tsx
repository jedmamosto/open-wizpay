'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { Clipboard, Key, Trash2, ShieldAlert, Code } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  keyName: string;
  maskedKey: string;
  createdAt: string;
}

export default function DeveloperSettings() {
  const { user, loading: authLoading } = useAuth();
  const currentUserId = user?.uid ?? null;

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch active keys
  const fetchKeys = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const response = await fetch(`/api/developer/keys?userId=${currentUserId}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      });
      if (!response.ok) throw new Error('Failed to fetch keys');
      const data = await response.json();
      setKeys(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load active API keys.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchKeys();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [currentUserId, authLoading, fetchKeys]);

  // Generate a new key
  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error('Session not found. Please log in again.');
      return;
    }
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name.');
      return;
    }

    try {
      const response = await fetch('/api/developer/keys', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          userId: currentUserId,
          keyName: newKeyName.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate key');
      const data = await response.json();
      
      setGeneratedKey(data.apiKey);
      setIsModalOpen(true);
      setNewKeyName('');
      fetchKeys();
      toast.success('API key generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate API key.');
    }
  };

  // Revoke an existing key
  const handleRevokeKey = async (keyId: string) => {
    if (!currentUserId || !confirm('Are you sure you want to revoke this API key? AI agents using this key will immediately lose access.')) return;

    try {
      const response = await fetch(`/api/developer/keys?keyId=${keyId}&userId=${currentUserId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke key');
      
      fetchKeys();
      toast.success('API Key revoked.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to revoke API key.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied key to clipboard!');
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#00180c]">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#ccf15a]"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2.5">
          <Key className="w-8 h-8 text-[#ccf15a]" />
          Developer Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate and manage secure API keys to connect local AI Copilots and external systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Create Key */}
        <div className="lg:col-span-1">
          <Card className="border-[#112f21] bg-[#001208]/90 text-[#c8ebd5]">
            <CardHeader>
              <CardTitle className="text-white text-lg">Generate API Key</CardTitle>
              <CardDescription className="text-[#c5c9b1]/60">
                Create a secret token for local AI agent integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateKey} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#c5c9b1]/80 block">Key Name / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Claude Code Integration"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-[#00180c] border border-[#112f21] text-white rounded p-3 text-xs focus:border-[#ccf15a] outline-none"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-xs uppercase tracking-wider py-4">
                  Generate Key
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Active Keys */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#112f21] bg-[#001208]/90 text-[#c8ebd5]">
            <CardHeader>
              <CardTitle className="text-white text-lg">Active API Keys</CardTitle>
              <CardDescription className="text-[#c5c9b1]/60">
                A list of secure tokens authorized to read and write your payment forms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {keys.length === 0 ? (
                <div className="text-center py-8 text-[#c5c9b1]/40 text-sm italic">
                  No active developer API keys found. Generate a key to get started.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {keys.map((key) => (
                    <div key={key.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#00180c] border border-[#112f21] rounded-lg gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">{key.keyName}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <code className="bg-[#022113] px-2 py-0.5 rounded border border-[#ccf15a]/20 text-[#ccf15a] font-mono">
                            {key.maskedKey}
                          </code>
                          <span className="text-[#c5c9b1]/60">
                            Created: {key.createdAt ? new Date(key.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="destructive"
                        onClick={() => handleRevokeKey(key.id)}
                        className="px-3.5 py-2 hover:bg-red-800 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Guide Card */}
          <Card className="border-[#112f21] bg-[#001208]/90 text-[#c8ebd5]">
            <CardHeader>
              <CardTitle className="text-white text-sm uppercase font-mono tracking-widest flex items-center gap-2">
                <Code className="w-4 h-4 text-[#ccf15a]" />
                MCP Local Integration Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-[#c5c9b1]/80">
              <p>
                To enable your local AI agents (Claude Code / Cursor / Antigravity) to create and style payment forms:
              </p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Copy your generated API Key.</li>
                <li>Open your local terminal and execute the installer:</li>
                <pre className="bg-[#00180c] border border-[#112f21] p-3 rounded font-mono text-white text-[11px] select-all">
                  npx @jedmamosto/wizpay-mcp-setup
                </pre>
                <li>Paste your API key when prompted. The installer will automatically inject settings into Claude Desktop or Cursor.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pop-up Dialog: Display New Key */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md border-[#112f21] bg-[#062517] text-[#c8ebd5] p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-yellow-500" />
              Copy Your Developer API Key
            </DialogTitle>
            <DialogDescription className="text-[#c5c9b1]/70 leading-normal pt-1.5">
              Make sure to copy your API key now. For your security, you will not be able to see it again.
            </DialogDescription>
          </DialogHeader>

          {generatedKey && (
            <div className="space-y-4 pt-3">
              <div className="flex items-center justify-between p-3.5 bg-[#001208] border border-[#112f21] rounded-lg">
                <code className="text-[#ccf15a] font-mono text-xs select-all break-all pr-2">
                  {generatedKey}
                </code>
                <Button
                  onClick={() => copyToClipboard(generatedKey)}
                  className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-xs uppercase tracking-wider p-2.5 shrink-0"
                >
                  <Clipboard className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-[10px] text-yellow-500/80 italic font-medium">
                Keep this key secret. Anyone with access to this token can manage your checkout portals.
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#112f21] flex justify-end">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-[#ccf15a] hover:bg-[#b0d440] text-[#161e00] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded"
            >
              I Have Saved It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
