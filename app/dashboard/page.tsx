"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useBuses, useQueues } from "@/lib/hooks";
import { computeRecommendation } from "@/lib/algorithms";
import { ROUTES_META } from "@/lib/design";
import LoadingOverlay from "@/components/LoadingOverlay";
import QueueCard from "@/components/QueueCard";
import RecommendationCard from "@/components/RecommendationCard";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function DashboardPage() {
  const { buses, loading: busesLoading } = useBuses();
  const { queues, loading: queuesLoading } = useQueues();
  const [tab, setTab] = useState<"queues" | "map">("queues");

  if (busesLoading || queuesLoading) {
    return <LoadingOverlay message="Loading queues..." />;
  }

  const rec = computeRecommendation(buses, queues, null);

  return (
    <div style={{ minHeight: "100dvh", background: "#F2F2F7", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 20px 12px", background: "#fff",
          borderBottom: "1px solid #E5E5EA",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#22469D", letterSpacing: "-.3px" }}>
          QueuePITX
        </h1>

        {/* Tab bar */}
        <div
          style={{
            display: "flex", gap: 4, marginTop: 14,
            background: "#F2F2F7", borderRadius: 12, padding: 3,
          }}
        >
          <TabButton active={tab === "queues"} onClick={() => setTab("queues")}>
            Queues
          </TabButton>
          <TabButton active={tab === "map"} onClick={() => setTab("map")}>
            Live Map
          </TabButton>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", paddingTop: 12 }}>
        {tab === "queues" ? (
          <>
            {rec && rec.type !== "all-full" && Object.keys(rec).length > 0 && (
              <RecommendationCard rec={rec} />
            )}
            {Object.entries(ROUTES_META).map(([rid, meta]) => {
              const queue = queues[rid];
              if (!queue) return null;
              return (
                <QueueCard
                  key={rid}
                  routeId={rid}
                  queue={queue}
                  buses={buses}
                  recommendation={rec}
                />
              );
            })}
            {Object.keys(queues).length === 0 && (
              <p style={{ textAlign: "center", color: "#AEAEB2", fontSize: 15, padding: 40 }}>
                No queue data available yet
              </p>
            )}
            <div style={{ height: 24 }} />
          </>
        ) : (
          <div style={{ height: "100%", minHeight: "calc(100dvh - 130px)" }}>
            <MapView buses={buses} />
          </div>
        )}
      </div>
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
