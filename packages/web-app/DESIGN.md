---
name: Emerald Kinetic
colors:
  surface: '#00180c'
  surface-dim: '#00180c'
  surface-bright: '#213f30'
  surface-container-lowest: '#001208'
  surface-container-low: '#022113'
  surface-container: '#062517'
  surface-container-high: '#112f21'
  surface-container-highest: '#1d3a2c'
  on-surface: '#c8ebd5'
  on-surface-variant: '#c5c9b1'
  inverse-surface: '#c8ebd5'
  inverse-on-surface: '#183627'
  outline: '#8f937d'
  outline-variant: '#454936'
  surface-tint: '#b0d440'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#ccf15a'
  on-primary-container: '#566d00'
  inverse-primary: '#516600'
  secondary: '#a6d0b5'
  on-secondary: '#0f3724'
  secondary-container: '#2a513c'
  on-secondary-container: '#98c2a8'
  tertiary: '#ffffff'
  on-tertiary: '#003919'
  tertiary-container: '#6dfe9c'
  on-tertiary-container: '#007439'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ccf15a'
  primary-fixed-dim: '#b0d440'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#c1edd0'
  secondary-fixed-dim: '#a6d0b5'
  on-secondary-fixed: '#002112'
  on-secondary-fixed-variant: '#284e3a'
  tertiary-fixed: '#6dfe9c'
  tertiary-fixed-dim: '#4de082'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005227'
  background: '#00180c'
  on-background: '#c8ebd5'
  surface-variant: '#1d3a2c'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.2em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  section-padding: 120px
  card-padding: 32px
  stack-gap: 16px
---

## Brand & Style

The design system is built on a foundation of high-contrast authority and technical precision. It is designed for founders and high-stakes decision-makers, evoking an emotional response of confidence, clarity, and urgent momentum.

The visual style is a blend of **Modern Minimalism** and **High-Contrast Digital**, utilizing a dark-mode first approach. It leverages deep atmospheric backgrounds to make neon-bright accents feel hyper-functional. The aesthetic avoids unnecessary ornamentation in favor of bold, "loud" typography and structured card-based layouts that present information with surgical efficiency.

Key characteristics:
- **Atmospheric Depth:** Deep greens create a sense of focused, "head-down" engineering environments.
- **Urgency:** Neon accents act as visual beacons, directing the eye toward calls to action and critical data.
- **Structured Precision:** Content is housed in clearly defined containers with subtle borders, emphasizing a systematic approach to problem-solving.

## Colors

This design system utilizes a "Deep Forest" palette to establish a professional, high-focus dark mode environment.

- **Primary (Neon Lime):** Used exclusively for primary buttons, highlighted text spans within headers, and active status indicators. It represents action and "working technology."
- **Secondary (Forest Green):** Used for card surfaces and container backgrounds to provide subtle contrast against the near-black main background.
- **Tertiary (Spring Green):** Used for positive reinforcement, checkmarks, and secondary accents.
- **Error/Accent (Coral Red):** A high-contrast red used for highlighting pain points, "the harsh reality," or destructive actions.
- **Background:** A near-black `#01160C` that maintains a hint of green saturation to prevent the UI from feeling "dead" or purely monochromatic.

## Typography

The system uses **Inter** exclusively to maintain a technical, systematic appearance. The hierarchy is driven by extreme weight variance—moving from heavy, tight-tracked Black (900) weights for headlines to clean, legible Regular (400) weights for body copy.

- **Headlines:** Must always be uppercase with tight letter spacing. Use the Neon Lime or white to create internal hierarchy within a single headline block.
- **Labels:** Small-caps with high letter spacing (tracking) are used for "pills" or section headers to create a sense of professional labeling.
- **Emphasis:** Italicized body text should be used sparingly for "takeaway" quotes or secondary insights to break the rigid structure of the Sans-Serif layout.

## Layout & Spacing

The layout is built on a **Mobile-First Responsive** philosophy. UI elements are structured starting from small mobile viewports (e.g., minimum 44x44px touch targets, compact stack spacing) and scale upward fluidly for larger screens. For desktop viewports, a **Fixed Grid** philosophy centers content to maintain focus and prevent visual fatigue across wide monitors.

- **Grid:** A 12-column grid is used for card layouts, typically collapsing to 1 column on mobile and reflowing into 3-column (33% width) or 2-column (50% width) configurations on desktop.
- **Responsive Section Spacing:** Section padding adjusts responsively (`py-16 md:py-24`) to eliminate excessive empty scroll depth on mobile viewports while giving content "room to breathe" on desktop.
- **Card-Based Architecture:** Information is modular. Cards use internal padding of `32px` on desktop, scaling down on mobile to maximize horizontal readability.
- **Mobile Reflow & Focus:** All interactive items (tabs, sliders) must meet minimum 44px tap targets. The typography scales down dynamically to ensure headings remain legible without breaking words across viewports.

## Elevation & Depth

This system avoids traditional shadows in favor of **Tonal Layering** and **Luminous Outlines**.

- **Surfaces:** Depth is created by placing lighter green surfaces (`surface_card`) on top of the darker base background.
- **Outlines:** Cards and active containers use a 1px solid border. For "featured" content, this border uses a subtle gradient or the primary Neon Lime color to simulate a glow effect.
- **Backdrop Blur:** When overlays or menus are used, a heavy backdrop blur (20px+) combined with a 10% opacity white tint is applied to maintain the "glass" engineering feel without breaking the dark aesthetic.

## Shapes

The shape language is "Softly Geometric." While the grid is rigid and the typography is sharp, the containers use a medium roundedness to feel modern and approachable.

- **Standard Radius:** `0.5rem` (8px) for cards and input fields.
- **Feature Radius:** `1rem` (16px) for larger landing page containers.
- **Buttons:** Large buttons use a `0.5rem` radius. Note: Avoid full pill-shapes unless specifically used for small status "chips."

## Components

### Buttons
- **Primary:** Neon Lime background with Black text. Bold, uppercase, often accompanied by a trailing icon (e.g., →). High-contrast hover state involves a slight scale-up (1.02x).
- **Secondary:** Ghost style. White or Spring Green border (1px) with transparent background and white text.

### Cards
- **Standard Card:** Forest Green background, 1px subtle border. Contains a header in `label-caps` and body text.
- **Comparison Cards:** Side-by-side cards (e.g., "The Industry" vs "Our Approach") should use contrasting border colors—Coral Red for negative space and Spring Green for positive space.

### Chips & Badges
- Used for small category labels. These are small containers with a 1px border and `label-caps` text. Always center-aligned when used as section prefixes.

### Lists
- **Checklists:** Use the Spring Green primary color for icons.
- **Negative Lists:** Use the Coral Red for "X" icons to signify pain points.
- Icons should be minimal, line-based, and consistently 20px in size.

### Input Fields
- Dark background (darker than the card surface), 1px border that glows Neon Lime on focus. Text is always white or light gray.