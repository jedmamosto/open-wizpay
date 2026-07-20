# WizPay Architecture Decision Records (ADRs)

This document tracks the core architectural decisions made for the WizPay project to establish clear technical guardrails and long-term memory for future development.

---

## ADR-001: Self-Hosted Single-Tenant Focus

*   **Date**: 2026-07-15
*   **Status**: Accepted
*   **Context**: 
    WizPay previously operated under a dual SaaS/Sovereign model. The presence of SaaS-related marketing landing pages and sign-up flows inside the open-source repository blurred the project's identity, causing developer confusion during self-hosting setup.
*   **Decision**: 
    We will decouple and shift the primary development and documentation focus of the open-source repository to a **Pure Self-Hosted Single-Tenant Engine**. Shared hosted SaaS elements (such as central landing pages and registration routes) will be isolated or deprecated.
*   **Consequences**: 
    *   *Easier*: Setting up WizPay locally or deploying a private instance becomes straightforward and requires zero multi-tenant setup.
    *   *Harder*: Merchants wanting to build their own SaaS wrapper will need to re-implement multi-tenant billing/routing or pull from legacy branches.

---

## ADR-002: Environment-Based Gateway Credentials

*   **Date**: 2026-07-15
*   **Status**: Accepted
*   **Context**: 
    PayMongo API keys (public and secret keys) were previously saved as database fields in Firestore. This introduced severe security vulnerabilities (accidental key exposure via client queries or database breaches).
*   **Decision**: 
    We will never store payment gateway credentials (`PAYMONGO_SECRET_KEY` and `PAYMONGO_PUBLIC_KEY`) in the database. All API integrations must read keys strictly from server-side environment variables.
*   **Consequences**: 
    *   *Easier*: Complete protection of payment keys at rest. Zero risk of Firestore leaks.
    *   *Harder*: Multi-merchant setups where different forms route to separate bank/gateway credentials are no longer supported out-of-the-box. The entire instance binds to a single gateway account.

---

## ADR-003: Pluggable Database Adapter Layer

*   **Date**: 2026-07-15
*   **Status**: Superseded / Deprecated (Replaced by Firestore-only architecture)
*   **Context**: 
    Firebase Firestore was a hard requirement for saving payment forms and checkout sessions, presenting onboarding friction for developers who want a quick local setup or a single SQL database.
*   **Decision**: 
    [SUPERSEDED] Replaced by a Firestore-only database architecture. The pluggable Database Adapter Layer and SQL/Prisma support have been deprecated and removed in favor of direct Firestore usage to simplify cloud deployment.
*   **Consequences**: 
    *   *Easier*: Single database strategy across all environments (dev and prod), eliminating database adapter complexity.
    *   *Harder*: Requires Google Cloud/Firebase accounts even for local development.

---

## ADR-004: Environment-Based Admin Authentication

*   **Date**: 2026-07-15
*   **Status**: Superseded / Deprecated (Replaced by standard Firebase Auth)
*   **Context**: 
    Self-hosted single-tenant environments do not require complex, database-backed multi-user authentication systems. 
*   **Decision**: 
    [SUPERSEDED] Replaced by standard Firebase Authentication, as the system has transitioned to a Firestore-only architecture.
*   **Consequences**: 
    *   *Easier*: Leverages robust, secure authentication managed directly by Firebase.
    *   *Harder*: Requires setting up Firebase Auth domain and configuration parameters for all deployments.

---

## ADR-005: Inline Checkout via Payment Intents API

*   **Date**: 2026-07-15
*   **Status**: Accepted
*   **Context**: 
    The legacy implementation relied on PayMongo Checkout Sessions, which redirected the buyer to external `checkout.paymongo.com` links. This added friction and dropped mobile checkout conversion rates.
*   **Decision**: 
    We will transition checkout flows to use PayMongo’s **Payment Intents API** directly. Card payments will collect inputs natively on the checkout form, while redirect methods (like GCash/Maya OTP) will open inline or inside modal overlays without changing the parent frame window.
*   **Consequences**: 
    *   *Easier*: Seamless inline checkout overlay experiences on the merchant's site, retaining customers in a single flow.
    *   *Harder*: Requires building custom, secure form validation components that comply with PayMongo payment intent requirements.

---

## ADR-006: Server-Side Pre-rendering (SSR) for Checkout Pages

*   **Date**: 2026-07-15
*   **Status**: Accepted
*   **Context**: 
    The checkout page `/payment-form/[id]` previously loaded metadata on the client-side via React `useEffect` hooks, displaying a full-screen spinner on slow connections and causing layout shifts.
*   **Decision**: 
    We will convert checkout pages into Next.js React Server Components (RSC). Form metadata, products, and visual themes will be fetched server-side directly from the database and served instantly in the initial HTML document.
*   **Consequences**: 
    *   *Easier*: Zero initial layout shifts, instant load times, and removal of front-end loaders.
    *   *Harder*: Restricts client-side runtime updates (e.g. real-time form settings changes must trigger standard revalidations).
