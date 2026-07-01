"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useBuses, useRemoveBusData } from "@/lib/hooks";
import { isDataStale } from "@/lib/algorithms";
import { ROUTES_META } from "@/lib/design";
import LoadingOverlay from "@/components/LoadingOverlay";
import BusCard from "@/components/BusCard";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const { buses, loading } = useBuses();
  const [tab, setTab] = useState<"buses" | "map">("buses");
  const { removeBus } = useRemoveBusData();

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

  const activeBuses = Object.entries(buses);

  const grouped = activeBuses.reduce<Record<string, [string, typeof buses[string]][]>>(
    (acc, [id, bus]) => {
      const rid = bus.route_id || "unknown";
      if (!acc[rid]) acc[rid] = [];
      acc[rid].push([id, bus]);
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
          {Object.entries(grouped).map(([rid, routeBuses]) => {
            const meta = ROUTES_META[rid as keyof typeof ROUTES_META];
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
                {routeBuses.map(([id, bus]) => (
                  <BusCard key={id} busId={id} bus={bus} />
                ))}
              </div>
            );
          })}
          {activeBuses.length === 0 && (
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
