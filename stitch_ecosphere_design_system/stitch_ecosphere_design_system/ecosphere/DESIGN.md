---
name: EcoSphere
colors:
  surface: '#f4fcf0'
  surface-dim: '#d5dcd1'
  surface-bright: '#f4fcf0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff6ea'
  surface-container: '#e9f0e5'
  surface-container-high: '#e3eadf'
  surface-container-highest: '#dde5d9'
  on-surface: '#171d16'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#2b322b'
  inverse-on-surface: '#ecf3e7'
  outline: '#6e7b6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2d'
  primary: '#006b2c'
  on-primary: '#ffffff'
  primary-container: '#00873a'
  on-primary-container: '#f7fff2'
  inverse-primary: '#62df7d'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#a72d51'
  on-tertiary: '#ffffff'
  tertiary-container: '#c74668'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffd9de'
  tertiary-fixed-dim: '#ffb2bf'
  on-tertiary-fixed: '#3f0016'
  on-tertiary-fixed-variant: '#8a143c'
  background: '#f4fcf0'
  on-background: '#171d16'
  surface-variant: '#dde5d9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system for this premium ESG management platform is built on the pillars of **Professionalism, Transparency, and Precision**. It targets enterprise stakeholders who require high-density data visualization without the cognitive load of traditional ERP systems.

The visual style is a synthesis of **Modern Minimalism** and **Fluent Depth**. It leverages expansive white space and high-contrast typography to ensure data clarity, while using subtle glassmorphism and multi-layered shadows to establish a clear spatial hierarchy. The aesthetic is intentionally "clean" to reflect sustainability, yet "robust" to reflect corporate governance and financial-grade reliability.

## Colors
The palette is rooted in "Nature's Professionalism." The **Emerald Primary** signifies growth and environmental impact, while the **Teal Secondary** provides a calming, tech-forward bridge to the **Blue Accent**, used specifically for interactive elements and data pathways.

The system utilizes a high-contrast foundation:
- **Surface Strategy:** Backgrounds use a cool-toned neutral (#F8FAFC) to reduce glare, while primary data containers use pure white (#FFFFFF) to pop against the canvas.
- **Deep Surfaces:** For the sidebar and navigation, a deep navy (#0F172A) is utilized to provide a sophisticated, grounded frame for the application.
- **Semantic Feedback:** Success (Emerald), Warning (Amber), Info (Blue), and Error (Rose) are derived from the core palette to maintain visual harmony.

## Typography
This design system utilizes **Inter** exclusively to ensure maximum legibility for complex data sets and administrative interfaces. 

- **Scale:** A tight, 4px-aligned scale is used to maintain a consistent rhythm. 
- **Hierarchy:** We use weight (SemiBold/Bold) rather than size increases to differentiate headers, keeping the UI compact for data-heavy views.
- **Data Display:** For tabular data and numerical values, tabular lining figures should be enabled (`tnum`) to ensure columns of numbers align perfectly for easy scanning.

## Layout & Spacing
The layout follows an **8px base grid** system. Consistency in spacing ensures that even the most complex dashboards remain breathable and navigable.

- **Grid Model:** A 12-column fluid grid for desktop with 24px gutters. For the dashboard view, a "Fixed Sidebar / Fluid Content" model is used.
- **Sidebars:** The primary navigation sidebar is fixed at 280px (expanded) or 80px (collapsed).
- **Density:** In data tables, a "Compact" mode is available which reduces vertical padding from 16px to 8px to increase information density for expert users.
- **Safe Areas:** Page headers always maintain a 32px bottom margin to separate global actions from the main content area.

## Elevation & Depth
This design system uses depth to communicate object priority and interactivity, inspired by Microsoft Fluent's layering.

- **Level 0 (Base):** The #F8FAFC background. No shadow.
- **Level 1 (Cards):** Standard surface for data widgets. Uses a subtle 1px border (#E2E8F0) and a soft, multi-layered shadow: `0px 1px 3px rgba(0,0,0,0.05), 0px 4px 6px rgba(0,0,0,0.02)`.
- **Level 2 (Dropdowns/Popovers):** Floating elements. Increased shadow depth to indicate focus: `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)`.
- **Level 3 (Modals):** Highest priority. Uses a 20% black backdrop blur (8px) to isolate the interaction.

## Shapes
A **generous 16px corner radius** (`rounded-xl` in this system) is the standard for cards, modals, and primary containers. This soften the "industrial" feel of ESG data and makes the platform feel modern and approachable.

Smaller components like buttons, input fields, and tags utilize an 8px radius (`rounded-md`) to maintain structural integrity at smaller scales. Badges and Status Chips are fully pill-shaped (999px) to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid Emerald (#16A34A) with White text. 8px radius. Subtle inner-glow on hover.
- **Secondary:** White background, 1px border (#D1D5DB), Text (#0F172A). 
- **Ghost:** No background/border. Primary color text. Used for secondary actions in tables.
- **Danger:** Solid Rose (#E11D48). Used sparingly for destructive ESG data resets.

### KPI Cards
- **Structure:** Top-aligned title (Label-SM), Large numerical value (Headline-LG), Bottom-aligned trend indicator (Badge).
- **Visuals:** Incorporate a small icon in the top-right using a subtle tinted background (e.g., 10% opacity of the primary color).

### Data Tables & Input
- **Tables:** Use sticky headers, zebra striping (very subtle #F1F5F9), and 16px horizontal cell padding.
- **Inputs:** 1px border (#D1D5DB) that transitions to 2px Emerald (#16A34A) on focus. Labels should always be visible above the field.

### Sidebar & Navbar
- **Sidebar:** Dark theme (#0F172A). Active states use a left-edge Emerald border (4px) and a subtle background tint (#1E293B).
- **Navbar:** Pure white, Level 1 shadow. Contains Breadcrumbs and Global Search.

### Status & Progress
- **Badges:** Low-saturation backgrounds with high-saturation text for readability (e.g., Success: Background #DCFCE7, Text #166534).
- **Progress Rings:** Used for ESG scores. Use the Primary Emerald for the "fill" and a light grey (#E2E8F0) for the "track."

### States
- **Skeleton:** Soft grey (#F1F5F9) with a pulse animation.
- **Empty States:** Centered illustration (minimalist line art), Title-MD, and a single Primary Call-to-Action button.