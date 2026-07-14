# Local Development & Environment Setup Guide

Follow this guide to spin up the local development environment for WizPay web app and MCP server.

---

## 1. Prerequisites
- **Node.js**: version 18.x or higher
- **Package Manager**: npm (v9+)
- **OS Support**: Windows (using PowerShell terminal commands)

---

## 2. Standard Commands Reference

### Monorepo/Root Commands
- **Install dependencies**:
  ```powershell
  npm install
  ```
- **Build all workspace packages**:
  ```powershell
  npm run build
  ```

### Web App (`packages/web-app`)
- **Run local development server**:
  ```powershell
  npm run dev:web
  ```
- **Build production app**:
  ```powershell
  npm run build:web
  ```
- **Run linting checks**:
  ```powershell
  npm run lint --workspace=packages/web-app
  ```

### MCP Server (`packages/mcp-server`)
- **Build the MCP server**:
  ```powershell
  npm run build:mcp
  ```
- **Run setup to register server on IDE clients**:
  ```powershell
  npm run setup:mcp
  ```

---

## 3. Environment Configurations

### Web App Env (`packages/web-app/.env`)
Create a `.env` file in `packages/web-app/` with the following variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase Admin Service Account (JSON string format or local path reference)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'
```

### MCP Config (`~/.wizpay/config.json`)
The configuration for the Model Context Protocol is stored in your user profile:
```json
{
  "apiKey": "wzp_live_xxxxxxxxxxxx",
  "apiEndpoint": "http://localhost:3000",
  "sandbox": true
}
```
If this configuration is missing, run `npm run setup:mcp` to generate a fresh one.
