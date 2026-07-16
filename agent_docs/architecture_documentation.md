# WizPay Architecture Documentation (arc42 Template)

This document describes the architecture of WizPay, an independent, self-hosted checkout engine and storefront orchestration framework.

---

## 1. Introduction and Goals

WizPay is an open-source, self-hosted payment checkout platform designed for Philippine merchants. It allows MSMEs to deploy a private payment engine that integrates with PayMongo, supporting local methods (GCash, Maya, GrabPay, cards, and QR Ph) with zero platform commission fees.

### 1.1 Quality Goals
1.  **Security**: Strict isolation of gateway API credentials and signature verification for all payment callbacks.
2.  **Performance (Mobile Conversion)**: Server-side pre-rendered forms, minimal page weight, and immediate visual responsiveness under slow cellular networks (3G/4G).
3.  **Deployability**: Simple, single-command local setup using a file-based SQLite database with zero cloud dependencies.

### 1.2 Stakeholders
*   **Merchants**: Want a reliable, fee-free payment portal and simple product management.
*   **Developers/Integrators**: Want an easily deployable wrapper around PayMongo with custom script embeds and robust APIs.

---

## 2. Architecture Constraints

*   **Runtime Environment**: Node.js (v18+) Serverless or long-running instances.
*   **Framework**: Next.js 16 (App Router), React 18.
*   **Database Providers**: SQLite (default local file), Postgres, or Firebase Firestore (optional pluggable).
*   **Payment Gateway**: PayMongo API.

---

## 3. System Scope and Context

WizPay operates as a secure intermediary between the merchant's public website, the buyer's browser, and the PayMongo gateway.

```mermaid
graph TD
    subgraph Buyer Browser
        A["Merchant's Website (SDK Embedded)"]
        B["WizPay Checkout Page (SSR Form)"]
    end

    subgraph Self-Hosted Infrastructure
        C["WizPay Next.js Server"]
        D["SQLite Database (Prisma)"]
    end

    subgraph External Systems
        E["PayMongo payment API"]
        F["Customer Bank / Wallet (GCash/Maya)"]
    end

    A -- "Embeds & Requests Config" --> C
    B -- "Submit Payment Intent" --> C
    C -- "Read/Write Sessions & Forms" --> D
    C -- "Init Payment Intents" --> E
    E -- "Authorize / OTP Redirect" --> F
    E -- "Webhook Update" --> C
```

---

## 4. Solution Strategy

1.  **Decoupled Storefront Embeds**: Keep the client SDK script lightweight (`/public/sdk/wizpay.js`) and let it query the Next.js server for sanitized JSON configurations to render products dynamically.
2.  **Database Abstraction**: Implement a Repository Adapter to support Prisma (SQLite/Postgres) and Firestore, allowing deployment flexibility.
3.  **Direct Intents Execution**: Avoid external redirects to PayMongo's site by collecting payment methods natively and utilizing PayMongo Payment Intents.

---

## 5. Building Block View

### 5.1 Directory Layout Reference
The codebase follows a modular structure for supporting pluggable databases:
```
packages/web-app/
  ├── prisma/
  │     └── schema.prisma        # SQLite / SQL Schema definitions
  ├── src/
  │     ├── app/
  │     │     ├── admin/         # Admin dashboard (Forms manager, developer keys)
  │     │     ├── api/
  │     │     │     ├── paymongo/# Payment Intent creation & attachment endpoints
  │     │     │     └── webhook/ # PayMongo background webhook receiver (Paid updates)
  │     │     └── payment-form/  # Public checkouts (Pre-rendered SSR page)
  │     ├── lib/
  │     │     ├── db.ts          # Unified database repository router
  │     │     ├── prisma.ts      # Prisma client instantiator
  │     │     └── adapters/      # Pluggable repository adapters
  │     │           ├── prismaAdapter.ts
  │     │           └── firestoreAdapter.ts
  │     └── utils/
  │           └── crypto.ts      # Security & encryption utilities (HMAC signature check)
```

```mermaid
classDiagram
    class DatabaseAdapter {
        <<Interface>>
        +getPaymentForm(id)
        +savePaymentForm(data)
        +createCheckoutSession(data)
        +updateCheckoutSession(id, data)
    }
    class PrismaAdapter {
        +getPaymentForm(id)
        +savePaymentForm(data)
    }
    class FirestoreAdapter {
        +getPaymentForm(id)
        +savePaymentForm(data)
    }
    class API_PayMongo_Intents {
        +POST(request)
    }
    class Middleware {
        +validateAdminSession(request)
    }

    PrismaAdapter ..|> DatabaseAdapter
    FirestoreAdapter ..|> DatabaseAdapter
    API_PayMongo_Intents --> DatabaseAdapter : Uses
    Middleware --> API_PayMongo_Intents : Secures Admin
```

---

## 6. Runtime View

### 6.1 Interactive Checkout Flow (Payment Intent Authorization)

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Buyer Browser
    participant SDK as WizPay Embed/Form
    participant Server as WizPay Next.js Backend
    participant Gateway as PayMongo API

    Customer->>SDK: Click Checkout
    SDK->>Server: POST /api/paymongo (Selected Products & Customer Info)
    Note over Server: Retrieve secret key from ENV<br/>Compute exact total price
    Server->>Gateway: POST /v1/payment_intents (Amount & Details)
    Gateway-->>Server: Return Payment Intent (Client Secret)
    Server->>Gateway: POST /v1/payment_methods (Card / Wallet details)
    Gateway-->>Server: Return Payment Method
    Server->>Gateway: POST /v1/payment_intents/:id/attach (Attach Method)
    Gateway-->>Server: Return Next Actions (OTP URL or Succeeded status)
    Server-->>SDK: Return Next Action Payload
    Note over SDK: Open modal overlay with OTP URL if redirect required
    Customer->>Gateway: Enter OTP/Wallet Pin
    Gateway->>Server: Webhook Call (payment.paid)
    Server->>Server: Verify Webhook Signature & Mark Paid in DB
    SDK-->>Customer: Display Success Confirmation
```

---

## 7. Crosscutting Concepts

### 7.1 Security & Key Management
*   **Server Env Key Isolation**: Payment gateway credentials are never written to any database. They are only loaded on the server side via environment variables.
*   **Webhook Signature Validation**: The server computes a HMAC signature on incoming webhooks to verify origin authenticity.
    
    ```typescript
    import crypto from 'crypto';

    export function verifyPaymongoSignature(
        signatureHeader: string,
        rawBody: string,
        webhookSecret: string
    ): boolean {
        const [tField, v1Field] = signatureHeader.split(',');
        const timestamp = tField.split('=')[1];
        const signature = v1Field.split('=')[1];

        const payload = `${timestamp}.${rawBody}`;
        const computedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(payload)
            .digest('hex');

        return computedSignature === signature;
    }
    ```

### 7.2 Performance and Layout
*   **RSC Pre-rendering**: Checkout forms pre-load database entities in Next.js Server Components, rendering final HTML with theme CSS variables without running loading spinners on the client.


---

## 8. Architecture Decisions

For detailed records of specific architectural choices, trade-offs, and consequences, see [adr.md](file:///c:/Users/ASUS/Documents/VSCode/oz_tech/agent_docs/adr.md).
