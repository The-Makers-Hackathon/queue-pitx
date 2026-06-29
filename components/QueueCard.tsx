"use client";

import { QueueData, BusPosition, Recommendation } from "@/lib/types";
import { ROUTES_META } from "@/lib/design";
import { findNextBus, computeETA, greatCircleDistance } from "@/lib/algorithms";
import { AVG_BOARDING_TIME, PITX_COORDS } from "@/lib/constants";
import CapacityBadge from "./CapacityBadge";

interface QueueCardProps {
  routeId: string;
  queue: QueueData;
  buses: Record<string, BusPosition>;
  recommendation?: Recommendation | null;
  onTap?: () => void;
}

export default function QueueCard({ routeId, queue, buses, onTap }: QueueCardProps) {
  const meta = ROUTES_META[routeId as keyof typeof ROUTES_META];
  if (!meta) return null;

  const nextBus = findNextBus(buses, routeId);
  const eta = nextBus ? computeETA(nextBus) : null;

  const maxPax = 50;
  const pct = Math.min((queue.queue_length / maxPax) * 100, 100);

  const dist =
    nextBus
      ? greatCircleDistance({ lat: nextBus.lat, lng: nextBus.lng }, PITX_COORDS)
      : null;

  const totalWait =
    queue.queue_length > 0
      ? queue.queue_length * AVG_BOARDING_TIME + (eta ?? 0)
      : eta;

  return (
    <div
      onClick={onTap}
      style={{
        margin: "0 16px 12px", padding: "16px 18px",
        borderRadius: 14, background: "#fff",
        border: "1px solid #E5E5EA",
        cursor: onTap ? "pointer" : "default",
        animation: "fade-up .35s ease",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10, height: 10, borderRadius: "50%",
                background: meta.color, flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 17, fontWeight: 800, color: "#1C1C1E" }}>
              {meta.name}
            </span>
          </div>
          <p style={{ margin: "2px 0 0 18px", fontSize: 12, color: "#AEAEB2", fontWeight: 600 }}>
            {meta.gate}
          </p>
        </div>
        <CapacityBadge status={queue.capacity_status} />
      </div>

      {/* Queue bar */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            height: 8, borderRadius: 100, background: "#F2F2F7",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`, height: "100%", borderRadius: 100,
              background: `linear-gradient(90deg, ${meta.color}, ${meta.color}aa)`,
              transition: "width .5s ease",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 12, color: "#6B6B6B", fontWeight: 600 }}>
            {queue.queue_length} passengers
          </span>
          <span style={{ fontSize: 12, color: "#AEAEB2" }}>
            {maxPax} max
          </span>
        </div>
      </div>

      {/* Footer stats */}
      <div style={{ display: "flex", gap: 12 }}>
        <Stat label="Next bus" value={eta !== null ? `${Math.round(eta)} min` : "No data"} />
        <Stat label="Distance" value={dist !== null ? `${dist.toFixed(1)} km` : "—"} />
        <Stat label="Est. wait" value={totalWait !== null ? `${Math.round(totalWait)} min` : "—"} />
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
