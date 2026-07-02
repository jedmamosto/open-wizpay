# WizPay

WizPay is a sovereign, unified checkout engine and storefront orchestration framework designed specifically for Philippine MSMEs. Currently operating as a centralized hosted SaaS platform (Scenario B) with a roadmap to transition to a fully decentralized, self-hostable open-source engine (Scenario A), it enables merchants to instantly receive GCash, Maya, GrabPay, Visa/Mastercard, and Billease BNPL payments directly into their own accounts without middleman fees.

WizPay goes beyond a simple payment gateway (like PayMongo) by offering:
- **Progressive Checkout Overlay (No Redirects)**: Opens checkouts inline directly on the merchant's page as a modal, preventing jarring redirects and reducing cart abandonment.
- **Codeless Storefront Builder**: Visually compose product checkout pages and generate simple copy-paste integration scripts.
- **AI-Native MCP Server Integration**: Configure, update, and embed checkout portals conversationally through AI tools (like Cursor, Claude Desktop, or Antigravity).
- **PH-Localized Logistics**: Support for Philippine-specific billing/shipping validation mapping down to local Provinces, Cities, and Barangays.
- **Sovereign Data Custody & Zero Fees**: Route payments directly to the merchant's gateway with no platform commission markups.

The system features:
- **A hosted, codeless dashboard** to create secure checkout forms.
- **An Embeddable Storefront SDK** to build dynamic product grids on any existing HTML page, WordPress blog, or e-commerce storefront.
- **A sanitized, public REST API** for custom software engineering integrations.
- **Credential security proxying** ensuring secret API keys are never exposed on client devices.

---

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation
1. **Clone the repository**
   ```sh
   git clone https://github.com/your_username/wizpay.git
   ```

2. **Install NPM packages**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root of the project and populate it with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the administration dashboard.

---

## Developer Integration Guide

### 1. Embeddable Storefront SDK
To embed a dynamic catalog of products directly on your WordPress or static HTML site, paste the following snippet:

```html
<!-- Container where your product catalog will render -->
<div id="wizpay-storefront" data-form-id="YOUR_PAYMENT_FORM_ID"></div>

<!-- WizPay Storefront SDK JavaScript (Local Development) -->
<script src="http://127.0.0.1:3000/sdk/wizpay.js" defer></script>
```

When users select products and click "Checkout", the SDK opens a secure checkout modal overlay inline on the page, keeping the customer journey unified without external redirects.

### 2. Public API Route
Developers can retrieve a fully sanitized form configuration and product catalog:
- **Endpoint**: `GET /api/v1/forms/[paymentFormId]`
- **Response Format**:
  ```json
  {
    "paymentFormTitle": "My Shop",
    "paymentFormDescription": "Local merchant storefront",
    "paymentFormProducts": [
      {
        "productName": "Awesome Item",
        "productDescription": "Sleek look",
        "productPrice": 150.00
      }
    ],
    "appearance": {
      "colorScheme": "slate",
      "fontFamily": "inter"
    }
  }
  ```
  *(Note: Sensitive properties such as `paymentFormPaymongoSecKey` are automatically stripped out server-side).*

---

## Available Scripts

In the project directory, you can run:
- `npm run dev`: Runs the app in development mode.
- `npm run build`: Compiles the app for production in the `.next` directory.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to check for type and layout warnings.
