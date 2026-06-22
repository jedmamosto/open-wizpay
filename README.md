# WizPay Monorepo

Welcome to **WizPay**, a sovereign, unified checkout engine and storefront orchestration framework designed specifically for Philippine MSMEs. It enables merchants to instantly receive GCash, Maya, GrabPay, Visa/Mastercard, and Billease BNPL payments directly into their own accounts without middleman fees.

This repository is structured as a monorepo containing:
1. **`packages/web-app`**: A Next.js payment engine, hosted storefront builder, and Embeddable Storefront SDK (built with Firebase and Paymongo).
2. **`packages/mcp-server`**: A standalone Model Context Protocol (MCP) server that enables AI agents to configure, update, and embed WizPay checkout forms directly in your editor (e.g. Cursor, Claude Desktop, Antigravity).

---

## Repository Structure

```
wizpay/
  ├── packages/
  │     ├── web-app/         # Next.js checkout platform & SDK
  │     └── mcp-server/      # TS-based MCP server
  ├── LICENSE                # MIT License
  ├── package.json           # npm workspaces configuration
  └── README.md              # This guide
```

---

## Quick Start

### 1. Installation

From the root directory, install dependencies for all workspace projects:
```bash
npm install
```

### 2. Configure the Web Application (`packages/web-app`)

1. Create a Firebase project via the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Authentication** (Email/Password).
3. Copy the `.env.example` in `packages/web-app` to `.env.local` and populate it with your Firebase client & Admin SDK credentials:
   ```bash
   cp packages/web-app/.env.example packages/web-app/.env.local
   ```
4. Run the development server for the web app:
   ```bash
   npm run dev:web
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the admin dashboard.

### 3. Configure the MCP Server (`packages/mcp-server`)

1. Build both packages:
   ```bash
   npm run build
   ```
2. Navigate to your **WizPay Admin Dashboard** (`http://localhost:3000`), go to **Developer Settings**, and generate an API key (`wzp_live_...`).
3. Run the automated MCP setup installer:
   ```bash
   npm run setup:mcp
   ```
   * Paste your Developer API key when prompted.
   * Provide your local self-hosted URL (`http://localhost:3000/api`) when prompted for the WizPay API base URL.
   * Restart/reload your AI editor or Claude Desktop to load the tools.

---

## Scripts & Operations

Manage everything from the root directory:
* **Install dependencies**: `npm install`
* **Run web dev server**: `npm run dev:web`
* **Build all projects**: `npm run build`
* **Setup MCP server**: `npm run setup:mcp`

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
