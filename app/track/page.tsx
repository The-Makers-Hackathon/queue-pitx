"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTracker, usePublishPosition, useSetQueueValue } from "@/lib/hooks";
import { ROUTES_META } from "@/lib/design";
import { CAPS } from "@/lib/design";
import type { CapacityStatus } from "@/lib/design";

const ROUTES = Object.entries(ROUTES_META).map(([id, m]) => ({ id, ...m }));

export default function TrackPage() {
  const router = useRouter();
  const [routeId, setRouteId] = useState("DAS");
  const [busId, setBusId] = useState("1");
  const { position, error, watching, startTracking, stopTracking } = useTracker();
  const { publish } = usePublishPosition();
  const { setCapacityStatus } = useSetQueueValue(routeId);
  const [capacity, setCapacity] = useState<CapacityStatus>("seats");
  const prevPosRef = useRef<GeolocationPosition | null>(null);
  const [publishedCount, setPublishedCount] = useState(0);

  // Publish position to Firebase when GPS updates
  useEffect(() => {
    if (position && watching) {
      publish(busId, routeId, position);
      prevPosRef.current = position;
      setPublishedCount((c) => c + 1);
    }
  }, [position, watching, busId, routeId, publish]);

  // Handle capacity button press
  const handleCapacity = (status: CapacityStatus) => {
    setCapacity(status);
    setCapacityStatus(status);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#F2F2F7", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 20px 14px", background: "#fff",
          borderBottom: "1px solid #E5E5EA",
          display: "flex", alignItems: "center", gap: 12,
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none", border: "none", fontSize: 20, cursor: "pointer",
            padding: 0, color: "#22469D",
          }}
        >
          ←
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1C1C1E", letterSpacing: "-.3px" }}>
            Conductor Tracker
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6B6B6B", fontWeight: 500 }}>
            Broadcast your bus location in real time
          </p>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {/* Route + Bus selectors */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <Label>Route</Label>
            <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
              {ROUTES.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <Label>Bus ID</Label>
            <select value={busId} onChange={(e) => setBusId(e.target.value)}>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>Bus {i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tracking control */}
        <div
          style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #E5E5EA", padding: 16,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1E" }}>
              Location Broadcast
            </span>
            {watching && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#1A7F4B", animation: "pulse-dot 1.5s ease infinite",
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1A7F4B" }}>
                  Active
                </span>
              </div>
            )}
          </div>

          {position && (
            <div
              style={{
                background: "#F2F2F7", borderRadius: 12, padding: "10px 14px",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#6B6B6B" }}>Latitude</span>
                <span style={{ fontWeight: 700, color: "#1C1C1E" }}>
                  {position.coords.latitude.toFixed(6)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
                <span style={{ color: "#6B6B6B" }}>Longitude</span>
                <span style={{ fontWeight: 700, color: "#1C1C1E" }}>
                  {position.coords.longitude.toFixed(6)}
                </span>
              </div>
            </div>
          )}

          {error && (
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#EE3127", fontWeight: 600 }}>
              {error}
            </p>
          )}

          <button
            onClick={watching ? stopTracking : startTracking}
            style={{
              width: "100%", padding: "14px", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              background: watching ? "#FEF0EF" : "#22469D",
              color: watching ? "#EE3127" : "#fff",
              transition: "all .15s",
            }}
          >
            {watching ? "Stop Broadcasting" : "Start Broadcasting"}
          </button>
        </div>

        {/* Capacity status */}
        <div style={{ marginBottom: 16 }}>
          <Label style={{ display: "block", marginBottom: 8 }}>Bus Capacity</Label>
          <div style={{ display: "flex", gap: 8 }}>
            {CAPS.map((cap) => (
              <button
                key={cap.id}
                onClick={() => handleCapacity(cap.id)}
                style={{
                  flex: 1, padding: "12px 8px", borderRadius: 12,
                  border: capacity === cap.id ? `2px solid ${cap.color}` : "2px solid #E5E5EA",
                  background: capacity === cap.id ? cap.bg : "#fff",
                  cursor: "pointer", textAlign: "center",
                  transition: "all .15s",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{cap.icon}</div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1C1C1E", lineHeight: 1.2 }}>
                  {cap.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Published count */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#AEAEB2", margin: 0 }}>
          {publishedCount > 0 ? `${publishedCount} updates sent` : "No updates yet"}
        </p>
      </div>
    </div>
  );
}

function Label({ children, style: s }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#6B6B6B", ...s }}>{children}</p>;
}
