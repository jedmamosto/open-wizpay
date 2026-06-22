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
  console.log('--- WizPay MCP Server Setup Installer ---\n');

  // 1. Scan for clients
  console.log('Scanning for installed AI Agents / IDEs...');
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
    console.log('No supported AI Agents / IDEs automatically detected.');
  } else {
    console.log('Detected AI Clients / IDEs:');
    detectedClients.forEach(c => {
      console.log(`  - [x] ${c.name} (Found in ${c.paths.length} config location(s))`);
    });
  }

  // 2. Ask for API Key
  const apiKey = await askQuestion('\nEnter your WizPay Developer API Key: ');
  if (!apiKey.trim()) {
    console.error('Error: API Key cannot be empty.');
    rl.close();
    process.exit(1);
  }

  // Ask for API URL
  const rawApiUrl = await askQuestion('Enter your WizPay API Base URL (default: https://pay.unwiz.ai/api): ');
  const apiUrl = rawApiUrl.trim() || 'https://pay.unwiz.ai/api';

  // Save to central config file dynamically so changes are reflected in real-time
  try {
    const wizpayDir = path.join(home || '', '.wizpay');
    if (!fs.existsSync(wizpayDir)) {
      fs.mkdirSync(wizpayDir, { recursive: true });
    }
    const wizpayConfigPath = path.join(wizpayDir, 'config.json');
    fs.writeFileSync(wizpayConfigPath, JSON.stringify({ apiKey: apiKey.trim() }, null, 2), 'utf8');
    console.log(`✓ Saved API key dynamically to central configuration: ${wizpayConfigPath}`);
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
            WIZPAY_API_KEY: apiKey.trim(),
            WIZPAY_API_URL: apiUrl,
          },
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        configured.push({ name: client.name, path: configPath });
      } catch (error) {
        console.error(`Failed to configure ${client.name} at ${configPath}:`, error.message);
      }
    }
  }

  if (configured.length > 0) {
    console.log('\n==================================================');
    console.log('✓ WizPay MCP Server successfully configured for:');
    configured.forEach(c => {
      console.log(`  - ${c.name} (${c.path})`);
    });
    console.log('==================================================');
    console.log('Please restart or reload your AI clients/IDEs to load the tools (First setup only).');
    console.log('Note: Future API key changes will take effect dynamically without requiring client restarts.');
    console.log('Once loaded, you can prompt the AI to manage payment forms:');
    console.log('  "List my payment forms on WizPay"');
    console.log('  "Create a form for Single Origin Coffee Roast for PHP 350"');
    console.log('==================================================\n');
  } else {
    console.log('\nNo configurations were updated.');
  }

  rl.close();
}

run().catch((err) => {
  console.error('An unexpected error occurred:', err);
  rl.close();
});
