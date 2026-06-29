export const C = {
  blue: "#22469D",
  blueDark: "#1A3578",
  blueLight: "#EEF2FF",
  blueMid: "#C5D0F0",
  charcoal: "#1C1C1E",
  mid: "#6B6B6B",
  muted: "#AEAEB2",
  border: "#E5E5EA",
  surface: "#F2F2F7",
  white: "#FFFFFF",
  red: "#EE3127",
  redLight: "#FEF0EF",
  coral: "#EE6059",
  coralLight: "#FEF2F1",
  green: "#1A7F4B",
  greenLight: "#EBF7F2",
} as const;

export const ROUTES_META = {
  DAS: { name: "Dasmariñas", short: "DAS", gate: "Gate 7", color: C.blue },
  TRE: { name: "Trece Martires", short: "TRE", gate: "Gate 9", color: C.red },
} as const;

export const CAPS = [
  { id: "seats" as const, label: "Seats free", sub: "Passengers can board normally", icon: "🟢", color: C.green, bg: C.greenLight },
  { id: "standing" as const, label: "Standing only", sub: "Seats full, aisle available", icon: "🟡", color: C.coral, bg: C.coralLight },
  { id: "full" as const, label: "Bus full", sub: "Cannot accept more passengers", icon: "🔴", color: C.red, bg: C.redLight },
] as const;

export type CapacityStatus = (typeof CAPS)[number]["id"];
