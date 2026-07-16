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

---

## 4. Production Deployments (e.g. Vercel)

> [!NOTE]
> The official repository's Vercel Git integration has been disconnected to accommodate its status as a pure self-hosted monorepo. This prevents unconfigured preview build checks from failing on pull requests. Developers should connect their own repositories or forks to Vercel and configure their own environment secrets.

When self-hosting the WizPay web app in production:

### Vercel Project Settings
1. **Root Directory**: `packages/web-app`
2. **Build Command**: Set to `npx prisma generate && next build`
3. **Environment Variables**:
   - `DATABASE_PROVIDER`: Set to `firestore` or `sqlite`.
     - *Caution on Vercel SQLite*: Because Vercel uses ephemeral serverless functions, SQLite databases written to local files will not persist. If `DATABASE_PROVIDER` is set to `sqlite`, you should modify the database datasource provider in `prisma/schema.prisma` to `postgresql` (or other remote SQL providers) and supply the remote database URL.
   - `DATABASE_URL`: Connection string to your remote SQL database.
   - `NEXT_PUBLIC_APP_URL`: Your production domain URL.
   - Standard Firebase environment variables matching your `.env.local` settings.

