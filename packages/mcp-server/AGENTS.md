# AGENTS.md

## 1. Project Overview
WizPay Model Context Protocol (MCP) Server is a lightweight Node.js/TypeScript-based server configured to integrate WizPay payment forms directly as interactive tools and resources in AI environments (such as Claude Desktop or Cursor). It enables users to perform actions like creating, listing, and updating checkout portals via conversational prompts.

## 2. Directory Structure & Guide
- `/src`: Source code containing the core MCP server logic (`index.ts`).
- `/dist`: Compiled JavaScript outputs.
- `/scripts`: Helper scripts, including `setup-mcp.js` (unified installer for Claude, Antigravity, Cursor, Cline, Roo Code, etc.).
- `package.json`: Project manifest.
- `tsconfig.json`: TypeScript configuration.

## 3. Core Tech Stack
- **Language**: TypeScript
- **Runtime**: Node.js (v18+)
- **Libraries**: `@modelcontextprotocol/sdk`, `zod`

## 4. Engineering Rules & Mandates
- Follow ESLint rules, avoiding the use of `any` types.
- Maintain `AGENTS.md` as a living memory document under 200 lines.
- Verify requirements and execute builds/tests before deploying.
- Every time the MCP server logic or tooling is modified, the npm package (`@jedmamosto/wizpay-mcp-setup`) must be updated and published to reflect the changes.

## 5. Common Development Commands
- Build project: `npm run build`
- Start server locally: `npm run start`
- Run unified client setup: `npm run setup` (or `node scripts/setup-mcp.js`)
- Run client setup via legacy command: `npm run setup:antigravity`
- Release and publish updated npm package: `npm run release`
