# QueuePITX Design System

> Version: 1.0
> Project: QueuePITX
> Platform: Mobile-First Progressive Web Application (PWA)
> Framework: Next.js + Tailwind CSS
> Design Inspiration: Kakao Map + Material Design 3

# Purpose

This document defines the design tokens, UI components, layout rules, and accessibility standards used throughout QueuePITX.

## Design Principles

- Mobile-first design
- Map-first experience
- Fast glanceability
- Clean information hierarchy
- Consistent spacing and typography
- Accessibility by default
- Minimal visual clutter

# Typography

## Brand Font
**Bricolage Grotesque**

Usage:
- Logo
- Splash Screen
- Marketing Materials

## UI Font
**Roboto**

| Token | Size | Weight | Usage |
|--------|------|--------|------|
| text-xs | 12px | 400 | Caption |
| text-sm | 14px | 400 | Labels |
| text-base | 16px | 400 | Body |
| text-lg | 18px | 500 | Important Values |
| text-xl | 20px | 500 | Card Titles |
| text-2xl | 24px | 700 | Screen Titles |
| text-3xl | 32px | 700 | Hero Heading |

# Color Tokens

| Variable | Value |
|------------|---------|
| primary | #E38C89 |
| secondary | #999CA4 |
| text | #51515D |
| background | #FFFFFF |
| success | #22C55E |
| error | #EF4444 |
| warning | #F59E0B |
| info | #3B82F6 |

## Route Colors

| Route | Color |
|---------|---------|
| Dasmariñas | #2563EB |
| Trece Martires | #16A34A |

# Tailwind Theme

```js
colors: {
  primary: "#E38C89",
  secondary: "#999CA4",
  text: "#51515D",
  background: "#FFFFFF",
  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  route: {
    dasma: "#2563EB",
    trece: "#16A34A",
  },
}

fontFamily: {
  sans: ["Roboto", "sans-serif"],
  logo: ["Bricolage Grotesque", "sans-serif"],
}
```

# Spacing

| Token | Value |
|------|------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 24px |
| space-6 | 32px |
| space-7 | 48px |
| space-8 | 64px |

# Border Radius

| Token | Value |
|------|------|
| radius-sm | 8px |
| radius-md | 12px |
| radius-lg | 16px |
| radius-xl | 24px |
| radius-full | 9999px |

# Components

## App Bar
- Height: 64px
- Background: White
- Logo aligned left

## Primary Button
- Height: 48px
- Radius: 12px
- Font: Roboto Medium 16px
- Background: Primary
- Text: White

States:
- Default
- Hover
- Active
- Disabled
- Loading

## Queue Card
Displays:
- Route Name
- ETA
- Queue Length
- Estimated Wait Time
- Capacity Status
- Last Updated

Specs:
- Padding: 16px
- Radius: 16px
- White background

## Recommendation Card
Variants:
- Stay
- Switch
- All Full

## Status Badge
- Available → Success
- Full → Error

## Bottom Sheet
- Radius: 24px
- White background

# Responsive Breakpoints

| Device | Width |
|------|------|
| Mobile | 320–767px |
| Tablet | 768–1023px |
| Desktop | 1024px+ |

# Accessibility

- WCAG AA
- Minimum touch target: 44×44px
- Minimum font size: 14px

# Development Guidelines

- Use Tailwind theme tokens.
- Never hardcode colors.
- Never hardcode spacing.
- Build reusable components.
- Keep the map as the primary content area.
