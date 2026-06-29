"use client";

import { CAPS, CapacityStatus } from "@/lib/design";

export default function CapacityBadge({ status }: { status: CapacityStatus }) {
  const cap = CAPS.find((c) => c.id === status);
  if (!cap) return null;

  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 100,
        background: cap.bg, fontSize: 13, fontWeight: 600,
        color: cap.color, lineHeight: 1.2,
      }}
    >
      <span style={{ fontSize: 14 }}>{cap.icon}</span>
      {cap.label}
    </div>
  );
}
