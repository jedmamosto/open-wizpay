# AGENTS.md

## 1. Project Overview
WizPay is a modern, TypeScript-based Next.js payment engine and storefront orchestration framework that allows Philippine merchants to visually compile payment forms and checkout portals. Currently, it operates as a centralized hosted SaaS platform (Scenario B) routing merchant-supplied credentials and checkouts through our shared infrastructure, with the long-term goal of transitioning into a fully decentralized, self-hostable open-source engine (Scenario A). It provides:
- A codeless administrative dashboard for hosted checkout configuration.
- A public API and Embeddable Storefront SDK (`/public/sdk/wizpay.js`) for custom client developer integrations.

## 2. Directory Structure & Guide
* `src/app/` - Next.js App Router directories.
  * `/admin/` - Admin dashboard, form creation/management, and user management.
  * `/payment-form/[paymentFormId]/` - Public high-converting checkout route.
  * `/api/` - Backend API endpoints.
    * `/api/v1/forms/[paymentFormId]/` - Sanitized public JSON configuration endpoint for storefront widgets.
    * `/api/paymongo/` - Server-side Paymongo checkout session creator.
  * `/login/` & `/sign-up/` - Authentication pages.
* `public/sdk/` - Client-side SDK script containing the embeddable catalog widget.
* `src/components/ui/` - Shared UI elements (Shadcn/Radix-based).
* `src/context/` - Global context, including AuthContext for Firebase authentication.
* `src/firebase/` - Firebase configurations and Client/Admin SDK setup.
* `src/schemas/` - Zod schema validation rules (e.g., payment forms, checkouts, signups).
* `src/utils/` - Shared helper/utility scripts for Firestore operations.
* `wizpay-mcp/` (Extracted) - Core TypeScript MCP Server, now hosted in its own standalone repository.

## 3. Core Tech Stack
* **Framework**: Next.js 16 (App Router)
* **Frontend Library**: React 18
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Database & Auth**: Firebase / Cloud Firestore
* **Payment Processing**: Paymongo API (GCash, Maya, cards, GrabPay, Billease)
* **Form & Validation**: React Hook Form, Zod

## 4. Engineering Rules & Mandates
* **No `any`**: Adhere strictly to TypeScript types; avoid `any` in TypeScript files.
* **Component-Driven CSS**: Keep styles aligned with tailwind.config.ts config tokens and default layout styles.
* **Linting & Formatting**: Follow Prettier & ESLint configurations to keep code formatting clean and unified.
* **Credential Protection**: Never return private keys (e.g., `paymentFormPaymongoSecKey`) in public client-facing API responses. Sanitization is mandatory.
* **Firestore Operations**: Utilize the shared wrapper utilities in `src/utils/` for CRUD operations on documents and collections.
* **API Key Auth**: Developer API keys are validated using `src/utils/apiKeyAuth.ts` and hashed using SHA-256. Enforce merchant scoping in routes.

## 5. Common Development Commands
* Run development server: `npm run dev`
* Build production app: `npm run build`
* Start production build locally: `npm run start`
* Run lint checks: `npm run lint`
* Build MCP Server: `cd wizpay-mcp && npm run build`
* Clear Turbopack cache (on compilation issues): `rm -rf .next` (or `Remove-Item -Recurse -Force .next` on Windows)


