"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useBuses, useRemoveBusData } from "@/lib/hooks";
import { isDataStale, computeETA } from "@/lib/algorithms";
import { ROUTES_META } from "@/lib/design";
import LoadingOverlay from "@/components/LoadingOverlay";
import BusCard from "@/components/BusCard";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const { buses, loading } = useBuses();
  const [tab, setTab] = useState<"buses" | "map">("buses");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const allRouteIds = Object.keys(ROUTES_META);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(allRouteIds);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const { removeBus } = useRemoveBusData();

  useEffect(() => {
    if (!filterOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  const toggleRoute = (rid: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(rid) ? prev.filter((r) => r !== rid) : [...prev, rid]
    );
  };

  const setAll = () => setSelectedRoutes([...allRouteIds]);
  const clearAll = () => setSelectedRoutes([]);

  useEffect(() => {
    const cleanup = () => {
      for (const [id, bus] of Object.entries(buses)) {
        if (isDataStale(bus.timestamp)) removeBus(id);
      }
    };
    cleanup();
    const id = setInterval(cleanup, 30_000);
    return () => clearInterval(id);
  }, [buses, removeBus]);

  if (loading) {
    return <LoadingOverlay message="Loading buses..." />;
  }

  const routeMeta = (rid: string) => ROUTES_META[rid as keyof typeof ROUTES_META];

  const rawBuses = Object.entries(buses).filter(
    ([, bus]) => selectedRoutes.includes(bus.route_id)
  );

  const withEta = rawBuses
    .map(([id, bus]) => ({ id, bus, eta: computeETA(bus) }))
    .filter((b): b is typeof b & { eta: number } => b.eta !== null);

  withEta.sort((a, b) => (sortDir === "asc" ? a.eta - b.eta : b.eta - a.eta));

  const grouped = withEta.reduce<Record<string, typeof withEta>>(
    (acc, entry) => {
      const rid = entry.bus.route_id || "unknown";
      if (!acc[rid]) acc[rid] = [];
      acc[rid].push(entry);
      return acc;
    },
    {}
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#F2F2F7", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 20px 12px", background: "#fff",
          borderBottom: "1px solid #E5E5EA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none", border: "none", fontSize: 20, cursor: "pointer",
              padding: 0, color: "#22469D",
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#22469D", letterSpacing: "-.3px" }}>
            QueuePITX
          </h1>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex", gap: 4, marginTop: 14,
            background: "#F2F2F7", borderRadius: 12, padding: 3,
          }}
        >
          <TabButton active={tab === "buses"} onClick={() => setTab("buses")}>
            Buses
          </TabButton>
          <TabButton active={tab === "map"} onClick={() => setTab("map")}>
            Live Map
          </TabButton>
        </div>
      </div>

      {/* Content */}
      {tab === "buses" ? (
        <div style={{ flex: 1, overflow: "auto", paddingTop: 12 }}>
          {/* Controls bar */}
          <div
            style={{
              margin: "0 16px 12px", display: "flex", gap: 8,
              alignItems: "center",
            }}
          >
            <div ref={filterRef} style={{ position: "relative" }}>
              <button
                onClick={() => setFilterOpen((o) => !o)}
                style={{
                  padding: "6px 14px", borderRadius: 8, border: "1px solid #E5E5EA",
                  background: "#fff", fontSize: 12, fontWeight: 700,
                  color: "#1C1C1E", cursor: "pointer", whiteSpace: "nowrap",
                  outline: "none",
                }}
              >
                Filter ({selectedRoutes.length})
              </button>
              {filterOpen && (
                <div
                  style={{
                    position: "absolute", top: "100%", left: 0, marginTop: 4,
                    background: "#fff", borderRadius: 10,
                    border: "1px solid #E5E5EA", boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                    padding: 6, zIndex: 10, minWidth: 180,
                  }}
                >
                  {Object.entries(ROUTES_META).map(([rid, m]) => {
                    const checked = selectedRoutes.includes(rid);
                    return (
                      <label
                        key={rid}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                          fontSize: 13, fontWeight: 600, color: "#1C1C1E",
                          background: checked ? "#F2F2F7" : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRoute(rid)}
                          style={{ accentColor: m.color }}
                        />
                        {m.name}
                      </label>
                    );
                  })}
                  <div
                    style={{
                      display: "flex", gap: 4, padding: "6px 10px 2px",
                      borderTop: "1px solid #E5E5EA", marginTop: 4,
                    }}
                  >
                    <button
                      onClick={setAll}
                      style={{
                        flex: 1, padding: "6px 0", borderRadius: 6, border: "none",
                        background: "#22469D", color: "#fff", fontSize: 12,
                        fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAll}
                      style={{
                        flex: 1, padding: "6px 0", borderRadius: 6, border: "none",
                        background: "#F2F2F7", color: "#6B6B6B", fontSize: 12,
                        fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              style={{
                padding: "6px 14px", borderRadius: 8, border: "1px solid #E5E5EA",
                background: "#fff", fontSize: 12, fontWeight: 700,
                color: "#1C1C1E", cursor: "pointer", whiteSpace: "nowrap",
                outline: "none",
              }}
            >
              ETA {sortDir === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {Object.entries(grouped).map(([rid, routeBuses]) => {
            const meta = routeMeta(rid);
            return (
              <div key={rid}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "4px 20px 8px",
                  }}
                >
                  <div
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: meta?.color ?? "#999",
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#6B6B6B" }}>
                    {meta?.name ?? rid}
                  </span>
                  <span style={{ fontSize: 12, color: "#AEAEB2" }}>
                    ({routeBuses.length})
                  </span>
                </div>
                {routeBuses.map(({ id, bus }) => (
                  <BusCard key={id} busId={id} bus={bus} />
                ))}
              </div>
            );
          })}
          {withEta.length === 0 && (
            <p style={{ textAlign: "center", color: "#AEAEB2", fontSize: 15, padding: 40 }}>
              No active buses right now
            </p>
          )}
          <div style={{ height: 24 }} />
        </div>
      ) : (
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          <MapView buses={buses} />
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: "10px 16px", border: "none", borderRadius: 10,
        background: active ? "#fff" : "transparent",
        color: active ? "#22469D" : "#6B6B6B",
        fontSize: 14, fontWeight: 700, cursor: "pointer",
        transition: "all .15s",
        boxShadow: active ? "0 1px 3px rgba(0,0,0,.08)" : "none",
      }}
    >
      {children}
    </button>
  );
}
