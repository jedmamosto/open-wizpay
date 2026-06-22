# Security Policy

## Supported Versions

We actively support and patch security issues in the following versions of WizPay:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

**DO NOT create public GitHub issues for security vulnerabilities.**

If you discover a security vulnerability or credential leak within this repository, please report it privately. 

To report a vulnerability:
1. Send an email to the project maintainers at **security@wizpay.ph** (or the designated security contact email).
2. Include a detailed description of the issue, steps to reproduce, and potential impact.
3. We will acknowledge receipt of your report within 48 hours and work with you to coordinate a security release.

---

## Safety Mandates for Developers and Contributors

WizPay handles payment orchestrations and sensitive configurations. We enforce strict policies to prevent security compromises:

1. **No Hardcoded Keys**: Never check in real API keys, Paymongo Secret Keys, Firebase admin service accounts, or merchant credentials.
2. **Secret Scanning**: This repository utilizes GitHub Secret Scanning and Push Protection. Commits containing suspected secret formats will be blocked automatically.
3. **API Key Sanitization**: Ensure all backend API responses scrub sensitive data (e.g., `paymentFormPaymongoSecKey`) before responding to client storefronts.
4. **Dependency Auditing**: Keep all dependencies up-to-date. Regular dependency checks are run to catch vulnerable packages.
