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
- **CI Validation**: Ensure that the project compiles cleanly (`npm run build`) before pushing or opening a PR to satisfy the automated CI validation suite.
- **Secret Protection**: Do not hardcode or commit keys or testing credentials. Use environment configuration.
- **Dynamic Configuration Handling**:
  - The MCP server reads configurations dynamically from `~/.wizpay/config.json` on every tool invocation. Do not assume values are static or cache them across tool runs.
- **Fail-Fast System Instructions**:
  - The server is designed to append clear system instructions to fetch errors. These instructions are directed at AI agents to prevent infinite retries.
  - If editing `src/index.ts`, ensure that all custom tool wrappers handle exceptions using the `handleToolError` helper to wrap status code and connectivity errors in the loop-prevention envelope.
- **Diagnose Tool Maintenance**:
  - Keep the `diagnose` tool up-to-date with any changes to the configuration schema or port bindings. It must remain a zero-parameter diagnostic tool.

## 5. Common Development Commands
- Build project: `npm run build`
- Start server locally: `npm run start`
- Run unified client setup: `npm run setup` (or `node scripts/setup-mcp.js`)
- Run client setup via legacy command: `npm run setup:antigravity`
- Release and publish updated npm package: `npm run release`
