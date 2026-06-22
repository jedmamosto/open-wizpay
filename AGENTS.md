# AGENTS.md

## 1. Project Overview
This workspace is the parent repository for the **WizPay** project ecosystem, a payment engine and storefront orchestration framework tailored for Philippine merchants. The workspace is structured as a monorepo containing:
1. **web-app** (`packages/web-app`): A Next.js payment engine, hosted storefront builder, and Embeddable Storefront SDK.
2. **mcp-server** (`packages/mcp-server`): A TypeScript-based Model Context Protocol (MCP) server that enables AI agents to interactively configure and embed WizPay checkout forms.

## 2. Directory Structure & Guide
- [packages/web-app/](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/web-app) - The web app / backend API platform. See [packages/web-app/AGENTS.md](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/web-app/AGENTS.md) for details.
  - `src/` - App router pages, Firebase config, components, and helper utilities.
  - `public/sdk/` - Client-side SDK script containing the embeddable catalog widget.
- [packages/mcp-server/](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/mcp-server) - The standalone Model Context Protocol server. See [packages/mcp-server/AGENTS.md](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/packages/mcp-server/AGENTS.md) for details.
  - `src/` - MCP server implementation and schemas.
  - `scripts/` - Installation and integration setup scripts.

## 3. Core Tech Stack
- **Framework & Runtime**: Next.js 16 (App Router), React 18, Node.js (v18+)
- **Languages**: TypeScript (Strict, no `any`)
- **Styling**: Tailwind CSS
- **Database & Auth**: Firebase / Cloud Firestore
- **MCP Integration**: `@modelcontextprotocol/sdk`
- **Payment Processing**: Paymongo API (GCash, Maya, GrabPay, cards, Billease)

## 4. Engineering Rules & Mandates
- **No `any`**: Adhere strictly to TypeScript types across all subprojects.
- **Credential Protection**: Never return private/secret keys (e.g., Paymongo API keys) in client-facing API responses.
- **Component-Driven Styling**: Keep styling consistent with tailwind.config.ts configuration tokens.
- **Sub-Project Documentation**: Maintain individual `AGENTS.md` files in `packages/web-app` and `packages/mcp-server` for project-specific instructions.
- **Publishing & Builds**: When modifying `packages/mcp-server` tools or schemas, build the project and publish updates to npm (`@jedmamosto/wizpay-mcp-setup`) to keep MCP client integrations updated.
- **Open-Source PR Governance**: All changes must go through pull requests. Direct pushes to `main` are forbidden. Pull requests must pass the CI workflow (`ci.yml`) with 1+ approval before merging.
- **Secret Scanning**: GitHub Secret Scanning and Push Protection must remain active. Do not commit or push live credentials (e.g., Paymongo API keys, Firebase service accounts). Use environment variables for local configuration.

## 5. Common Development Commands
- **Root-level Operations**:
  - Install all dependencies: `npm install`
  - Build everything: `npm run build`
- **web-app Commands** (from `/`):
  - Run development server: `npm run dev:web`
  - Build production: `npm run build:web`
- **mcp-server Commands** (from `/`):
  - Setup MCP client: `npm run setup:mcp`
  - Build MCP: `npm run build:mcp`

