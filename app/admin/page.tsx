"use client";

import { useState, useRef, useCallback } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBuses } from "@/lib/hooks";
import { ROUTES_META, CAPS } from "@/lib/design";
import type { CapacityStatus } from "@/lib/design";
import { canAccess } from "@/lib/roles";
import LoadingOverlay from "@/components/LoadingOverlay";
import { relativeTime } from "@/lib/algorithms";
import { useAuth } from "@/components/AuthProvider";
import { getDb, ref, set } from "@/lib/firebase";

const ROUTES = Object.entries(ROUTES_META).map(([id, m]) => ({ id, ...m }));

export default function AdminPage() {
  const router = useRouter();
  const { user, role, roleLoading, loading: authLoading, signOut } = useAuth();
  const [routeFilter, setRouteFilter] = useState("all");
  const { buses, loading: busesLoading } = useBuses();
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

  const setBusCapacity = useCallback((busId: string, status: CapacityStatus) => {
    const db = getDb();
    set(ref(db, `buses/${busId}/capacity_status`), status);
  }, []);

  if (authLoading || !user || (user && roleLoading) || denied) return <LoadingOverlay message="Checking access..." />;
  if (busesLoading) return <LoadingOverlay message="Loading admin data..." />;

  const filteredBuses = Object.entries(buses).filter(
    ([, b]) => routeFilter === "all" || b.route_id === routeFilter
  );

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
            Manage active buses and capacities
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
        {/* Route filter */}
        <div style={{ marginBottom: 16 }}>
          <Label>Filter by Route</Label>
          <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)}>
            <option value="all">All Routes</option>
            {ROUTES.map((r) => (
              <option key={r.id} value={r.id}>{r.name} ({r.gate})</option>
            ))}
          </select>
        </div>

        {/* Active buses list */}
        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#6B6B6B" }}>
            Active Buses ({filteredBuses.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredBuses.map(([id, bus]) => {
              const meta = ROUTES_META[bus.route_id as keyof typeof ROUTES_META];
              return (
                <div
                  key={id}
                  style={{
                    background: "#fff", borderRadius: 12,
                    border: "1px solid #E5E5EA", padding: "12px 14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: meta?.color ?? "#999", flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E" }}>
                        Bus {id}
                      </span>
                      <span style={{ fontSize: 12, color: "#AEAEB2", fontWeight: 600 }}>
                        {meta?.name ?? bus.route_id}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: "#AEAEB2" }}>
                      {relativeTime(bus.timestamp)}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "#6B6B6B", fontWeight: 600 }}>
                      {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                    </span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {CAPS.map((cap) => (
                        <button
                          key={cap.id}
                          onClick={() => setBusCapacity(id, cap.id)}
                          style={{
                            padding: "6px 10px", borderRadius: 8, border: "none",
                            fontSize: 11, fontWeight: 700, cursor: "pointer",
                            background: bus.capacity_status === cap.id ? cap.bg : "#F2F2F7",
                            color: bus.capacity_status === cap.id ? cap.color : "#6B6B6B",
                            transition: "all .12s",
                          }}
                        >
                          {cap.icon} {cap.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredBuses.length === 0 && (
              <p style={{ fontSize: 13, color: "#AEAEB2", textAlign: "center", padding: 8 }}>
                No buses found
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
