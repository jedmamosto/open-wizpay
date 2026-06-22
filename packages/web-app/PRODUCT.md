# Product

## Register

product

## Users
- **Philippine MSMEs (Merchants):** Non-technical business owners looking to accept online payments (GCash, Maya, cards, QR Ph, Billease) directly with their own credentials without intermediate fees or lock-ins.
- **Client Developers & Agencies:** Technical users looking to embed a lightweight, high-performance checkout widget or integrate with a secure payment REST API.
- **End Consumers (Buyers):** Shoppers on Philippine storefronts who expect a frictionless, instant, secure checkout modal overlay that stays inline rather than redirecting them.

## Product Purpose
WizPay is a sovereign, zero-fee payment engine and storefront orchestration framework that democratizes Philippine online transactions. Currently running as a centralized hosted SaaS platform, it routes transactions directly to the merchant's gateway credentials while we manage the core infrastructure, serving as an intermediate step towards a fully decentralized, self-hostable open-source engine.

## Brand Personality
- **Voice & Tone:** Authoritative, high-focus, and highly precise.
- **Three-Word Personality:** Kinetic, Sovereign, Precise.
- **Emotional Goals:** High-contrast authority, technical confidence, and urgent momentum.

## Anti-references
- **Beige SaaS Slop:** Saturated cream/sand/beige/paper backgrounds and generic visual elements.
- **Overdone SaaS Clichés:** Side-stripe card borders, hero-metric templates, gradient text, excessive glassmorphism, or placing tracked uppercase eyebrows on every single section.
- **Async popup redirects:** Blocking or triggering Safari/Chrome pop-up blockers when completing payment flows.
- **Unlabeled or nested components:** Multi-layered nested card elements or generic button labels (like "Yes" or "OK") that do not state the explicit action.

## Design Principles
1. **Sovereign Disintermediation:** The user's direct credentials are central. Keep transactions transparent, direct, and private.
2. **In-Context Fluidity:** Avoid disrupting the customer journey. Run checkouts inline via overlay widgets rather than redirecting away from the host page.
3. **Structured Momentum:** Use a clean, dark-mode first layout (using deep atmospheric greens and high-contrast neon accents) to guide users through checkout forms with absolute clarity and focus.
4. **Action-Oriented Context:** Interactive UI elements must clearly describe the outcome (e.g., "Pay PHP 750.00" instead of "Submit").

## Accessibility & Inclusion
- **Contrast Ratios:** Ensure text color achieves at least WCAG AA compliance (body text ≥4.5:1 against the dark emerald background).
- **Reduced Motion Support:** Respect the system setting `@media (prefers-reduced-motion: reduce)` by bypassing layout animations and defaulting to simple crossfades.
- **Geographic Accessibility (Future Roadmap):** Support seamless validation for Philippine local administrative levels (Provinces, Cities, and Barangays) to calculate accurate shipping without confusing international-only forms.
