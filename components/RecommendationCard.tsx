"use client";

import { Recommendation } from "@/lib/types";
import { ROUTES_META } from "@/lib/design";

export default function RecommendationCard({ rec }: { rec: Recommendation | null }) {
  if (!rec) return null;

  const isAllFull = rec.type === "all-full";

  return (
    <div
      style={{
        margin: "0 16px 12px", padding: "14px 18px",
        borderRadius: 14, display: "flex", alignItems: "center", gap: 12,
        background: isAllFull ? "#FEF0EF" : "#EBF7F2",
        animation: "fade-up .3s ease",
      }}
    >
      <span style={{ fontSize: 22 }}>{isAllFull ? "⚠️" : "💡"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1C1C1E" }}>
          {isAllFull ? "All routes full" : rec.type === "switch" ? "Try the other route" : "Stick with this route"}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6B6B6B" }}>
          {rec.message}
        </p>
      </div>
      {rec.recommendedRoute && ROUTES_META[rec.recommendedRoute as keyof typeof ROUTES_META] && (
        <div
          style={{
            width: 32, height: 32, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
            fontSize: 11, fontWeight: 800, color: "#fff", lineHeight: 1,
            background: ROUTES_META[rec.recommendedRoute as keyof typeof ROUTES_META].color,
          }}
        >
          {ROUTES_META[rec.recommendedRoute as keyof typeof ROUTES_META].short}
        </div>
      )}
    </div>
  );
}
