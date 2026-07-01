// ── Color Tokens (DESIGN.md v1.0) ──
export const C = {
  primary: "#E38C89",
  secondary: "#999CA4",
  text: "#51515D",
  background: "#FFFFFF",
  success: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  surface: "#F2F2F7",
  border: "#E5E5EA",
  muted: "#AEAEB2",
  charcoal: "#1C1C1E",
  white: "#FFFFFF",
} as const;

// ── Route Colors ──
export const ROUTES_META = {
  DAS: { name: "Dasmariñas", short: "DAS", gate: "Gate 7", color: "#2563EB" },
  TRE: { name: "Trece Martires", short: "TRE", gate: "Gate 9", color: "#16A34A" },
} as const;

// ── Capacity Status ──
export const CAPS = [
  { id: "seats" as const, label: "Seats free", sub: "Passengers can board normally", icon: "🟢", color: C.success, bg: "#F0FDF4" },
  { id: "full" as const, label: "Bus full", sub: "Cannot accept more passengers", icon: "🔴", color: C.error, bg: "#FEF2F2" },
] as const;

export type CapacityStatus = (typeof CAPS)[number]["id"];

// ── Spacing ──
export const SPACE = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 } as const;

// ── Border Radius ──
export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 } as const;

// ── Typography ──
export const FONT = {
  ui: "'Roboto', sans-serif",
  brand: "'Bricolage Grotesque', sans-serif",
} as const;
