#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

const home = process.env.HOME || process.env.USERPROFILE;

const clients = [
  {
    name: 'Claude Desktop',
    getPaths: (home) => {
      switch (process.platform) {
        case 'win32':
          return [path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json')];
        case 'darwin':
          return [path.join(home || '', 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')];
        default:
          return [path.join(home || '', '.config', 'Claude', 'claude_desktop_config.json')];
      }
    }
  },
  {
    name: 'Antigravity',
    getPaths: (home) => [
      path.join(home || '', '.gemini', 'config', 'mcp_config.json'),
      path.join(home || '', '.gemini', 'antigravity-cli', 'mcp_config.json'),
      path.join(home || '', '.gemini', 'antigravity', 'mcp_config.json')
    ]
  },
  {
    name: 'Cursor',
    getPaths: (home) => [
      path.join(home || '', '.cursor', 'mcp.json')
    ]
  },
  {
    name: 'Cline',
    getPaths: (home) => {
      const paths = [];
      const vscodeDirs = ['Code', 'Code - Insiders', 'VSCodium'];
      for (const dir of vscodeDirs) {
        switch (process.platform) {
          case 'win32':
            paths.push(path.join(process.env.APPDATA || '', dir, 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
            break;
          case 'darwin':
            paths.push(path.join(home || '', 'Library', 'Application Support', dir, 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
            break;
          default:
            paths.push(path.join(home || '', '.config', dir, 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
            break;
        }
      }
      return paths;
    }
  },
  {
    name: 'Roo Code',
    getPaths: (home) => {
      const paths = [];
      const vscodeDirs = ['Code', 'Code - Insiders', 'VSCodium'];
      for (const dir of vscodeDirs) {
        switch (process.platform) {
          case 'win32':
            paths.push(path.join(process.env.APPDATA || '', dir, 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'mcp_settings.json'));
            paths.push(path.join(process.env.APPDATA || '', dir, 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'cline_mcp_settings.json'));
            break;
          case 'darwin':
            paths.push(path.join(home || '', 'Library', 'Application Support', dir, 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'mcp_settings.json'));
            paths.push(path.join(home || '', 'Library', 'Application Support', dir, 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'cline_mcp_settings.json'));
            break;
          default:
            paths.push(path.join(home || '', '.config', dir, 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'mcp_settings.json'));
            paths.push(path.join(home || '', '.config', dir, 'User', 'globalStorage', 'rooveterinaryinc.roo-cline', 'settings', 'cline_mcp_settings.json'));
            break;
        }
      }
      return paths;
    }
  }
];

async function run() {
  console.log('🔮 WizPay MCP Setup');
  console.log('   Connect your AI assistant to WizPay checkouts\n');

  // 1. Scan for clients
  console.log('Scanning local environment for AI clients...');
  const detectedClients = [];
  for (const client of clients) {
    const paths = client.getPaths(home);
    const foundPaths = [];
    for (const p of paths) {
      const dir = path.dirname(p);
      if (fs.existsSync(p) || fs.existsSync(dir)) {
        foundPaths.push(p);
      }
    }
    if (foundPaths.length > 0) {
      detectedClients.push({
        name: client.name,
        paths: foundPaths
      });
    }
  }

  if (detectedClients.length === 0) {
    console.log('  [x] No supported AI clients automatically detected.');
  } else {
    detectedClients.forEach(c => {
      console.log(`  [✓] Found ${c.name} config`);
    });
  }

  // 2. Scan for local WizPay server
  console.log('\nScanning for local WizPay server & configuration...');

  // Auto-detect WIZPAY_DEV_API_KEY from packages/web-app/.env.local
  let defaultApiKey = '';
  const envLocalPath = path.resolve(__dirname, '../../web-app/.env.local');
  if (fs.existsSync(envLocalPath)) {
    try {
      const envContent = fs.readFileSync(envLocalPath, 'utf8');
      const lines = envContent.split('\n');
      const envVars = {};
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const parts = trimmed.split('=');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            let val = parts.slice(1).join('=').trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            envVars[key] = val;
          }
        }
      }
      if (envVars['WIZPAY_DEV_API_KEY']) {
        defaultApiKey = envVars['WIZPAY_DEV_API_KEY'];
      }
    } catch (err) {
      // ignore
    }
  }

  let localServerOnline = false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch('http://127.0.0.1:3000/api/health', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      localServerOnline = true;
    }
  } catch (err) {
    // server offline
  }

  let apiUrl = 'http://127.0.0.1:3000/api';
  
  if (localServerOnline) {
    console.log('  [✓] Running local server detected on port 3000!');
    console.log('\nWhich server should this AI assistant connect to?');
    console.log('  ❯ 1. Local Server (http://127.0.0.1:3000/api) [Default]');
    console.log('    2. Custom URL / Domain');
    const choiceStr = await askQuestion('\nChoose option (1-2): ');
    if (choiceStr.trim() === '2') {
      const rawApiUrl = await askQuestion('\nEnter your API Base URL: ');
      apiUrl = rawApiUrl.trim();
    }
  } else {
    console.log('  [x] No running local server found on port 3000/3001.');
    console.log('\nConfigure for:');
    console.log('  ❯ 1. Custom/Local Server (To self-host, start your server first) [Default]');
    console.log('    2. WizPay Cloud Sandbox (https://pay.unwiz.ai/api)');
    const choiceStr = await askQuestion('\nChoose option (1-2): ');
    if (choiceStr.trim() === '2') {
      apiUrl = 'https://pay.unwiz.ai/api';
    } else {
      const rawApiUrl = await askQuestion('\nEnter your API Base URL (Default: http://127.0.0.1:3000/api): ');
      apiUrl = rawApiUrl.trim() || 'http://127.0.0.1:3000/api';
    }
  }

  // Hostname Normalization Rules
  try {
    let urlObj = new URL(apiUrl);
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '::1') {
      urlObj.hostname = '127.0.0.1';
      console.log(`  → Normalized hostname to '127.0.0.1'`);
    }
    apiUrl = urlObj.toString().replace(/\/$/, '');
  } catch (err) {
    if (apiUrl.includes('localhost')) {
      apiUrl = apiUrl.replace('localhost', '127.0.0.1');
      console.log(`  → Normalized 'localhost' to '127.0.0.1'`);
    }
    if (apiUrl.includes('[::1]')) {
      apiUrl = apiUrl.replace('[::1]', '127.0.0.1');
      console.log(`  → Normalized '::1' to '127.0.0.1'`);
    }
    apiUrl = apiUrl.replace(/\/$/, '');
  }

  if (!defaultApiKey && (apiUrl.includes('127.0.0.1') || apiUrl.includes('localhost'))) {
    defaultApiKey = 'wz_dev_local123456';
  }

  let hintUrl = 'https://pay.unwiz.ai/admin/developer-settings';
  try {
    const urlObj = new URL(apiUrl);
    if (urlObj.hostname === '127.0.0.1' || urlObj.hostname === 'localhost') {
      hintUrl = `${urlObj.protocol}//${urlObj.host}/admin/developer-settings`;
    }
  } catch (e) {
    if (apiUrl.includes('127.0.0.1') || apiUrl.includes('localhost')) {
      hintUrl = 'http://127.0.0.1:3000/admin/developer-settings';
    }
  }

  console.log(`\nEnter your WizPay Developer API Key:`);
  console.log(`  (Found in ${hintUrl})`);
  const apiKeyPrompt = defaultApiKey ? `API Key (Default: ${defaultApiKey}): ` : 'API Key: ';
  const apiKeyInput = await askQuestion(apiKeyPrompt);
  const apiKey = apiKeyInput.trim() || defaultApiKey;
  if (!apiKey) {
    console.error('Error: API Key cannot be empty.');
    rl.close();
    process.exit(1);
  }

  // Save to central config file dynamically so changes are reflected in real-time
  try {
    const wizpayDir = path.join(home || '', '.wizpay');
    if (!fs.existsSync(wizpayDir)) {
      fs.mkdirSync(wizpayDir, { recursive: true });
    }
    const wizpayConfigPath = path.join(wizpayDir, 'config.json');
    fs.writeFileSync(wizpayConfigPath, JSON.stringify({ apiKey, apiUrl }, null, 2), 'utf8');
    console.log('\nWriting configuration...');
    console.log(`  ✓ Dynamic configuration saved to ~/.wizpay/config.json`);
  } catch (err) {
    console.warn(`Warning: Failed to write to central config file: ${err.message}`);
  }

  // 3. Determine which clients to configure
  let clientsToConfigure = [];
  if (detectedClients.length > 0) {
    const confirmAll = await askQuestion('\nConfigure WizPay MCP for all detected clients? (Y/n): ');
    if (confirmAll.trim().toLowerCase() === 'n') {
      for (const c of detectedClients) {
        const answer = await askQuestion(`Configure for ${c.name}? (y/N): `);
        if (answer.trim().toLowerCase() === 'y') {
          clientsToConfigure.push(c);
        }
      }
    } else {
      clientsToConfigure = [...detectedClients];
    }
  } else {
    console.log('\nSince no clients were automatically detected, you can choose to configure one manually:');
    for (let i = 0; i < clients.length; i++) {
      console.log(`  ${i + 1}. ${clients[i].name}`);
    }
    console.log(`  ${clients.length + 1}. Exit`);
    const choiceStr = await askQuestion(`Select a client to force-configure (1-${clients.length + 1}): `);
    const choice = parseInt(choiceStr.trim(), 10);
    if (choice >= 1 && choice <= clients.length) {
      const selectedClient = clients[choice - 1];
      const p = selectedClient.getPaths(home)[0];
      clientsToConfigure.push({
        name: selectedClient.name,
        paths: [p]
      });
    }
  }

  if (clientsToConfigure.length === 0) {
    console.log('\nNo clients selected for configuration.');
    rl.close();
    process.exit(0);
  }

  // Resolve absolute path to the compiled index.js
  const serverPath = path.resolve(__dirname, '../dist/index.js');
  const configured = [];

  for (const client of clientsToConfigure) {
    for (const configPath of client.paths) {
      const configDir = path.dirname(configPath);
      try {
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
        }

        let config = { mcpServers: {} };
        if (fs.existsSync(configPath)) {
          const fileContent = fs.readFileSync(configPath, 'utf8');
          try {
            config = JSON.parse(fileContent);
          } catch (e) {
            console.warn(`Warning: Failed to parse existing config at ${configPath}. Overwriting with clean template.`);
          }
        }

        if (!config.mcpServers) {
          config.mcpServers = {};
        }

        config.mcpServers.wizpay = {
          command: 'node',
          args: [serverPath],
          env: {
            WIZPAY_API_KEY: apiKey,
            WIZPAY_API_URL: apiUrl,
          },
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        configured.push({ name: client.name, path: configPath });
        console.log(`  ✓ Configured ${client.name} integration`);
      } catch (error) {
        console.error(`Failed to configure ${client.name} at ${configPath}:`, error.message);
      }
    }
  }

  // 4. Verifying connection status
  console.log('\n🔍 Verifying connection status...');
  let healthPassed = false;
  let connectionErrorMsg = '';
  let merchantName = 'PH Coffee Roasters - Local';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${apiUrl}/payment-forms`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      healthPassed = true;
      if (apiKey === 'wz_dev_local123456' || apiKey === 'test-key-mcp' || apiKey.includes('test') || apiKey.includes('dev')) {
        merchantName = 'PH Coffee Roasters - Local';
      } else {
        merchantName = 'WizPay Merchant (Production)';
      }
    } else {
      connectionErrorMsg = `API responded with status ${res.status}`;
    }
  } catch (err) {
    connectionErrorMsg = err.message || 'Connection refused';
  }

  if (healthPassed) {
    console.log('  [✓] API Endpoint reachable');
    console.log(`  [✓] API Key authenticated (Merchant: "${merchantName}")`);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 WizPay MCP is healthy and ready to use!');
    console.log('\nTo activate the new tools, restart your AI client:');
    configured.forEach(c => {
      if (c.name === 'Antigravity') {
        console.log('  • Antigravity: Close this chat window and start a new conversation.');
      } else if (c.name === 'Cursor') {
        console.log('  • Cursor: Press Ctrl+Shift+P → type "Reload Window" → Enter.');
      } else if (c.name === 'Claude Desktop') {
        console.log('  • Claude Desktop: Quit the app (Alt+F4 / Cmd+Q) and reopen it.');
      } else {
        console.log(`  • ${c.name}: Restart the application/editor.`);
      }
    });
    console.log('\nThen try asking your AI: "List my checkout forms"');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } else {
    console.log(`  [x] Connection failed (${connectionErrorMsg})`);
    console.log('\n⚠️  Could not connect to the API server.');
    console.log('    - Setup was written successfully, but the server is currently offline or the API Key is invalid.');
    if (apiUrl.includes('127.0.0.1')) {
      console.log("    - Start your local server with 'npm run dev:web' before using the AI tools.");
    } else {
      console.log('    - Check your network connection or verify your API key and URL.');
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('To activate the new tools, restart your AI client:');
    configured.forEach(c => {
      if (c.name === 'Antigravity') {
        console.log('  • Antigravity: Close this chat window and start a new conversation.');
      } else if (c.name === 'Cursor') {
        console.log('  • Cursor: Press Ctrl+Shift+P → type "Reload Window" → Enter.');
      } else if (c.name === 'Claude Desktop') {
        console.log('  • Claude Desktop: Quit the app (Alt+F4 / Cmd+Q) and reopen it.');
      } else {
        console.log(`  • ${c.name}: Restart the application/editor.`);
      }
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  rl.close();
}

run().catch((err) => {
  console.error('An unexpected error occurred:', err);
  rl.close();
});
