"use client";

import { BusPosition } from "@/lib/types";
import { ROUTES_META } from "@/lib/design";
import { computeETA, relativeTime } from "@/lib/algorithms";
import CapacityBadge from "./CapacityBadge";

interface BusCardProps {
  busId: string;
  bus: BusPosition;
}

export default function BusCard({ busId, bus }: BusCardProps) {
  const meta = ROUTES_META[bus.route_id as keyof typeof ROUTES_META];
  if (!meta) return null;

  const eta = computeETA(bus);

  return (
    <div
      style={{
        margin: "0 16px 10px", padding: "14px 16px",
        borderRadius: 14, background: "#fff",
        border: "1px solid #E5E5EA",
        animation: "fade-up .35s ease",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 10, height: 10, borderRadius: "50%",
              background: meta.color, flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1C1C1E" }}>
            Bus {busId}
          </span>
          <span style={{ fontSize: 12, color: "#AEAEB2", fontWeight: 600 }}>
            {meta.name}
          </span>
        </div>
        {bus.capacity_status && <CapacityBadge status={bus.capacity_status} />}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12 }}>
        <Stat label="ETA" value={eta !== null ? `${Math.round(eta)} min` : "N/A"} />
        <Stat label="Updated" value={relativeTime(bus.timestamp)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 11, color: "#AEAEB2", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1C1C1E" }}>{value}</p>
    </div>
  );
}
