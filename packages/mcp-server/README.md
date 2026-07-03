# WizPay Model Context Protocol (MCP) Server

A lightweight Model Context Protocol (MCP) server that exposes WizPay forms as interactive tools and resources for AI coding copilots (such as Claude Desktop, Cursor, or Antigravity).

---

## Capabilities

### Tools
* `list_forms`: Lists all active checkout portals.
* `get_form`: Retrieves details for a specific payment form (credentials are redacted).
* `create_form`: Creates a new form on WizPay.
* `update_form`: Updates titles, descriptions, products, and color schemes.

### Resources
* `wizpay://schemas/payment-form`: Returns the JSON Zod-compatible schema of a WizPay form.

---

## Onboarding & Setup

### 1. Prerequisite
Ensure you have Node.js (version 18 or higher) installed on your machine.

### 2. Generate Developer API Key
Log in to your **WizPay Admin Dashboard**, navigate to **Developer Settings**, and generate an API key (`wzp_live_...`).

### 3. Run the Automated Installer
To automatically detect and configure WizPay MCP for all your installed AI clients (such as Claude Desktop, Antigravity, Cursor, Cline, or Roo Code), run this command in your terminal:

```bash
npx @jedmamosto/wizpay-mcp-setup
```

* Paste your API Key when prompted.
* The script will scan for existing configurations and offer to setup all detected clients at once, or configure them selectively.

Alternatively, if you are running in the local development workspace, you can run:
```bash
npm run setup
```

### 4. Restart Your AI Client
Restart Claude Desktop, reload your editor/extension, or reload Antigravity to load the new tools! You can now prompt the AI using natural language:
> *"List my active payment forms on WizPay"*

---

## Support & Contact
For support, inquiries, or bug reports, please email us at **jed@unwiz.ai**.


