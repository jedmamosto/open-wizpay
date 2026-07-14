# Model Context Protocol (MCP) Server Specification

WizPay includes a Model Context Protocol (MCP) server that enables AI agents to converse with, manage, and configure payment checkouts.

---

## 1. Directory Structure

- `/src/index.ts`: Unified entry point defining tools, resources, schemas, and error handlers.
- `/scripts/setup-mcp.js`: Automated installation script that registers the MCP server with IDEs (VSCode/Cursor, Cline, Windsurf, Claude Desktop, Antigravity).
- `/scripts/release.js`: Version-controlled publish wrapper for the `@jedmamosto/wizpay-mcp-setup` npm registry.

---

## 2. Exposed MCP Tools

The server registers the following tools to the Model Context Protocol:

### `list_forms`
Lists all payment forms configured by the merchant.
- **Parameters**: None.

### `get_form`
Retrieves detailed config for a specific checkout form.
- **Parameters**:
  - `paymentFormId` (string, required): The target form ID.

### `create_form`
Creates a new payment form config.
- **Parameters**:
  - `paymentFormTitle` (string, required)
  - `paymentFormDescription` (string, required)
  - `paymentFormSuccessURL` (string, required)
  - `paymentFormCancelURL` (string, required)
  - `paymentFormPaymongoPubKey` (string, required)
  - `paymentFormPaymongoSecKey` (string, required)
  - `paymentFormProducts` (array, required): Array of products containing `productName` and `productPrice`.

### `update_form`
Updates an existing payment form config.
- **Parameters**:
  - `paymentFormId` (string, required)
  - `paymentFormTitle` (string, optional)
  - `paymentFormDescription` (string, optional)
  - `paymentFormSuccessURL` (string, optional)
  - `paymentFormCancelURL` (string, optional)
  - `paymentFormPaymongoPubKey` (string, optional)
  - `paymentFormPaymongoSecKey` (string, optional)
  - `paymentFormProducts` (array, optional)

### `get_embed_code`
Returns a cut-and-paste JavaScript code snippet to embed the progressive checkout portal.
- **Parameters**:
  - `paymentFormId` (string, required)

### `diagnose`
Runs diagnostic checks to verify configuration, network reachability, and backend compatibility.
- **Parameters**: None.

---

## 3. Dynamic Configuration Handling

To maintain secure, multi-client, and live state:
- The MCP server **reads the configuration dynamically** on every tool execution.
- Config is fetched from the local file path: `~/.wizpay/config.json`.
- The configuration contains details like the API Key, Local Port, and Sandbox mode.
- Under no circumstances should configurations or credentials be cached statically across runs.

---

## 4. MCP Loop Prevention & Fail-Fast Mandate

To prevent AI agents from going into infinite retry loops when encountering configuration or credentials issues:
1. **Error Wrapper**: The server handles connection/config exceptions using a helper `handleToolError` function.
2. **Fatal Code Markers**: Returns custom prefix messages starting with `[FATAL CONFIG ERROR]` or `[FATAL AUTH ERROR]`.
3. **Execution Terminate**: AI agents must halt execution immediately upon receiving these error strings, showing the exact troubleshooting payload to the user without attempting automated fixes.
