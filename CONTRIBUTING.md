# Contributing to WizPay

Thank you for your interest in contributing to WizPay! As an open-source payment engine and storefront orchestration framework, we welcome contributions from the community to help make Philippine digital checkouts faster, more reliable, and easily accessible.

Please read this guide to understand our workspace setup, coding standards, and contribution workflow.

---

## Workspace Setup

WizPay is structured as a monorepo containing:
1. **web-app** (`packages/web-app`): Next.js payment engine, hosted storefront builder, and embeddable SDK.
2. **mcp-server** (`packages/mcp-server`): TypeScript Model Context Protocol (MCP) server for configuring and embedding checkout forms via AI agents.

### Prerequisites
- **Node.js**: Version 18 or higher (Node 20 recommended)
- **npm**: Version 9 or higher

### Local Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/wizpay.git
   cd wizpay
   ```
2. Install all dependencies from the root directory:
   ```bash
   npm install
   ```

---

## Development Workflow

### Useful Commands

Run the following commands from the root directory:

* **Start Next.js App in Development Mode**:
  ```bash
  npm run dev:web
  ```
* **Verify Linting & Formatting** (for Next.js web-app):
  ```bash
  npm run lint --workspace=packages/web-app
  ```
* **Build Everything** (Verifies Next.js and TypeScript compilation):
  ```bash
  npm run build
  ```
* **Setup MCP Client Locally**:
  ```bash
  npm run setup:mcp
  ```

---

## Coding Guidelines

1. **Strict TypeScript**: We enforce strict type-safety. Do not use the `any` type.
2. **Component-Driven Styling**: Align styling with existing configurations in `tailwind.config.ts`.
3. **No Credential Commits**: Never commit real credentials, Paymongo secret keys, or private Firebase service accounts. Use environment variables (`.env.local`) for configuration.
4. **Code Quality**: Ensure linting checks pass before pushing changes:
   ```bash
   npm run lint --workspace=packages/web-app
   ```

---

## Submitting Pull Requests

1. **Create a Feature Branch**: Create a branch off `main` for your changes (e.g., `feature/custom-form-styles` or `bugfix/paymongo-session-error`).
2. **Commit Guidelines**: Write clear, descriptive commit messages.
3. **Run Build Checks**: Ensure the project compiles successfully by running `npm run build`.
4. **Open a PR**: Submit a pull request to our `main` branch. Provide a detailed summary of your changes in the PR description, referencing any relevant issues.

Thank you again for contributing to WizPay!
