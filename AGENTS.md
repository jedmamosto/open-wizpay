# AGENTS.md

## 1. Project Overview
This workspace is the parent repository for the **WizPay** project ecosystem, an independent, self-hosted checkout engine and storefront orchestration framework tailored for Philippine merchants. WizPay goes beyond a simple payment gateway (like PayMongo) by providing:
1. **Progressive Checkout Overlay**: Inline checkout/modal overlays instead of jarring external redirects.
2. **Codeless Storefront Builder**: Visually compose product checkouts & copy-paste SDK scripts on any site.
3. **AI-Native MCP Integration**: An MCP server that enables AI agents to configure, update, and embed checkout portals conversationally.
4. **PH-Localized Logistics**: Accurate shipping validation mapped down to local Provinces, Cities, and Barangays.
5. **Zero Platform Fees**: Route payments directly to the merchant's gateway with no platform commission cuts.

The workspace is structured as a monorepo containing:
1. **web-app** (`packages/web-app`): A Next.js payment engine, hosted storefront builder, and Embeddable Storefront SDK.
2. **mcp-server** (`packages/mcp-server`): A TypeScript-based Model Context Protocol (MCP) server that enables AI agents to interactively configure and embed WizPay checkout forms.

## 2. Progressive Disclosure Specification (Deep Specs)
For deeper technical specifications, refer to the following documents in [agent_docs/](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/):
- [Architecture Documentation](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/architecture_documentation.md) - Formal arc42 architecture manual detailing scope, contexts, and runtime views.
- [Architecture Decisions (ADRs)](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/adr.md) - Concise logs of all technical decisions and consequences.
- [Self-Hosted Specification](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/self_hosted_engine_spec.md) - Detailed folder layout, schema, types, and signature checks.
- [Database Schema & Auth](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/database_schema.md) - Database collections (`payment-forms`, `checkout-sessions`, etc.) and Zod schemas.
- [API Reference Specification](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/api_spec.md) - Backend API endpoints, authentication, and merchant scoping.
- [MCP Server Specification](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/mcp_spec.md) - MCP tools schemas, fail-fast mechanism, and configuration.
- [Local Setup & Env Guide](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/setup_guide.md) - Build, run, and environment variables.

## 3. Directory Structure & Guide
- [packages/web-app/](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/web-app) - The web app / backend API platform. See [packages/web-app/AGENTS.md](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/web-app/AGENTS.md) for details.
  - `src/` - App router pages, Firebase config, components, and helper utilities.
  - `public/sdk/` - Client-side SDK script containing the embeddable catalog widget.
- [packages/mcp-server/](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/mcp-server) - The standalone Model Context Protocol server. See [packages/mcp-server/AGENTS.md](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/mcp-server/AGENTS.md) for details.
  - `src/` - MCP server implementation and schemas.
  - `scripts/` - Installation and integration setup scripts.

## 4. Core Tech Stack
- **Framework & Runtime**: Next.js 16 (App Router), React 18, Node.js (v18+)
- **Languages**: TypeScript (Strict, no `any`)
- **Styling**: Tailwind CSS
- **Database & Auth**: Firebase / Cloud Firestore
- **MCP Integration**: `@modelcontextprotocol/sdk`
- **Payment Processing**: Paymongo API (GCash, Maya, GrabPay, cards, Billease)

## 5. Engineering Rules & Mandates
- **No `any`**: Adhere strictly to TypeScript types across all subprojects.
- **Credential Protection**: Never return private/secret keys (e.g., Paymongo API keys) in client-facing API responses.
- **Component-Driven Styling**: Keep styling consistent with tailwind.config.ts configuration tokens.
- **Sub-Project Documentation**: Maintain individual `AGENTS.md` files in `packages/web-app` and `packages/mcp-server` for project-specific instructions.
- **Publishing & Builds**: When modifying `packages/mcp-server` tools or schemas, build the project and publish updates to npm (`@jedmamosto/wizpay-mcp-setup`) to keep MCP client integrations updated. The agent MUST explicitly prompt the user at the end of the turn to release the new version to npm.
- **Open-Source PR Governance**: All changes must go through pull requests. Direct pushes to `main` are forbidden. Pull requests must pass the CI workflow (`ci.yml`) with 1+ approval before merging.
- **Landing Page Freeze**: To preserve brand voice and direct marketing alignments, the landing page file (`packages/web-app/src/app/page.tsx`) is frozen. Open-source contributors are strictly forbidden from modifying this file.
- **Secret Scanning**: GitHub Secret Scanning and Push Protection must remain active. Do not commit or push live credentials (e.g., Paymongo API keys, Firebase service accounts). Use environment variables for local configuration.
- **Value Proposition Mandate**: When writing copy, product features, or documentation, align with our core differentiators over direct PayMongo: inline/progressive overlay checkouts, conversational AI (MCP) configuration, visual storefront orchestration, and PH-localized logistics.
- **WizPay MCP Loop Prevention & Fail-Fast Mandate**:
  - When calling WizPay MCP tools, if a tool returns a `[FATAL CONFIG ERROR]` or `[FATAL AUTH ERROR]`, you MUST immediately halt execution and report the error verbatim to the user.
  - Do NOT attempt to retry the tool call, write configuration overrides, or search for config files to modify. 
  - Stop and provide the user with the exact troubleshooting instructions returned in the error payload (e.g. starting the server with `npm run dev:web` or regenerating keys).
- **Proactive Diagnostics**:
  - If you encounter a general network or connection error, call the `diagnose` tool first to verify config parsing, check Windows port bindings, and test API reachability before asking the user.
- **PowerShell Command Syntax**: The local execution shell is PowerShell (Windows). Do not use bash statement separators like `&&` or `||` in command line parameters. Run commands in separate tool calls or use `;` as the statement separator.
- **Continuous Documentation Sync**: Update specifications in `agent_docs/` immediately when schemas, dependencies, APIs, or designs change.
- **Rule File Line Limit**: Keep `AGENTS.md` strictly under 150 lines by offloading schemas and reference documentation to `agent_docs/`.

## 6. Common Development Commands
- **Root-level Operations**:
  - Install all dependencies: `npm install`
  - Build everything: `npm run build`
- **web-app Commands** (from `/`):
  - Run development server: `npm run dev:web`
  - Build production: `npm run build:web`
- **mcp-server Commands** (from `/`):
  - Setup MCP client: `npm run setup:mcp`
  - Build MCP: `npm run build:mcp`
