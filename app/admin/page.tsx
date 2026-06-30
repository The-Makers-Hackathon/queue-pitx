"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBuses, useQueues, useSetQueueValue } from "@/lib/hooks";
import { ROUTES_META, CAPS } from "@/lib/design";
import type { CapacityStatus } from "@/lib/design";
import { canAccess } from "@/lib/roles";
import LoadingOverlay from "@/components/LoadingOverlay";
import { relativeTime } from "@/lib/algorithms";
import { useAuth } from "@/components/AuthProvider";

const ROUTES = Object.entries(ROUTES_META).map(([id, m]) => ({ id, ...m }));

export default function AdminPage() {
  const router = useRouter();
  const { user, role, roleLoading, loading: authLoading, signOut } = useAuth();
  const [routeId, setRouteId] = useState("DAS");
  const { buses, loading: busesLoading } = useBuses();
  const { queues, loading: queuesLoading } = useQueues();
  const { setQueueLength, setCapacityStatus } = useSetQueueValue(routeId);
  const wasSignedIn = useRef(false);
  if (user) wasSignedIn.current = true;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(wasSignedIn.current ? "/" : "/login");
    }
  }, [authLoading, user, router]);

  const denied = !authLoading && user && !roleLoading && !canAccess(role, "admin");

  useEffect(() => {
    if (denied) router.replace("/unauthorized");
  }, [denied, router]);

  if (authLoading || !user || (user && roleLoading) || denied) return <LoadingOverlay message="Checking access..." />;
  if (busesLoading || queuesLoading) return <LoadingOverlay message="Loading admin data..." />;

  const routeBuses = Object.entries(buses).filter(([, b]) => b.route_id === routeId);
  const queue = queues[routeId];

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
            Admin Controls
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6B6B6B", fontWeight: 500 }}>
            Override queue data in real time
          </p>
        </div>
        <button
          onClick={() => signOut()}
          title="Sign out"
          style={{
            marginLeft: "auto", width: 34, height: 34, borderRadius: "50%",
            background: "#EE3127", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {/* Route selector */}
        <div style={{ marginBottom: 16 }}>
          <Label>Route</Label>
          <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
            {ROUTES.map((r) => (
              <option key={r.id} value={r.id}>{r.name} ({r.gate})</option>
            ))}
          </select>
        </div>

        {/* Queue controls */}
        {queue ? (
          <div
            style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #E5E5EA", padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: ROUTES_META[routeId as keyof typeof ROUTES_META]?.color,
                }}
              />
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1C1C1E" }}>
                {ROUTES_META[routeId as keyof typeof ROUTES_META]?.name} Queue
              </span>
            </div>

            {/* Queue length slider */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#6B6B6B" }}>Queue length</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#22469D" }}>
                  {queue.queue_length} passengers
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={queue.queue_length}
                onChange={(e) => setQueueLength(Number(e.target.value))}
                style={{
                  width: "100%", height: 6, borderRadius: 100,
                  appearance: "none", background: "#F2F2F7",
                  accentColor: "#22469D", cursor: "pointer",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#AEAEB2" }}>0</span>
                <span style={{ fontSize: 11, color: "#AEAEB2" }}>50</span>
              </div>
            </div>

            {/* Capacity status toggle */}
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#6B6B6B", display: "block", marginBottom: 8 }}>
                Capacity status
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {CAPS.map((cap) => (
                  <button
                    key={cap.id}
                    onClick={() => setCapacityStatus(cap.id)}
                    style={{
                      flex: 1, padding: "10px 8px", borderRadius: 10,
                      border: queue.capacity_status === cap.id
                        ? `2px solid ${cap.color}`
                        : "2px solid #E5E5EA",
                      background: queue.capacity_status === cap.id ? cap.bg : "#fff",
                      cursor: "pointer", fontSize: 12, fontWeight: 700,
                      color: "#1C1C1E", transition: "all .12s",
                    }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 2 }}>{cap.icon}</div>
                    {cap.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #E5E5EA", padding: 24, textAlign: "center",
              marginBottom: 16,
            }}
          >
            <p style={{ margin: 0, fontSize: 14, color: "#AEAEB2", fontWeight: 600 }}>
              No queue data for this route
            </p>
          </div>
        )}

        {/* Active buses list */}
        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#6B6B6B" }}>
            Active Buses ({routeBuses.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {routeBuses.map(([id, bus]) => (
              <div
                key={id}
                style={{
                  background: "#fff", borderRadius: 12,
                  border: "1px solid #E5E5EA", padding: "10px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E" }}>
                    Bus {id}
                  </span>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#AEAEB2" }}>
                    {relativeTime(bus.timestamp)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#6B6B6B" }}>
                    {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            ))}
            {routeBuses.length === 0 && (
              <p style={{ fontSize: 13, color: "#AEAEB2", textAlign: "center", padding: 8 }}>
                No buses broadcasting on this route
              </p>
            )}
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#6B6B6B" }}>{children}</p>;
}
