"use client";

import { useMemo } from "react";
import { OverlayView } from "@react-google-maps/api";

const MARKER_SVG = (
  busId: string,
  color: string,
  pulse: boolean,
) => (
  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", cursor: "default" }}>
    {pulse && (
      <div
        style={{
          position: "absolute", top: 2, left: "50%", marginLeft: -16,
          width: 32, height: 32, borderRadius: "50%",
          background: color, opacity: 0.25,
          animation: "ripple 1.5s ease-out infinite",
        }}
      />
    )}
    <div
      style={{
        width: 36, height: 36, borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 2px 8px ${color}66`, color: "#fff",
        fontSize: 11, fontWeight: 800, lineHeight: 1,
        zIndex: 1, position: "relative",
      }}
    >
      🚌
    </div>
    <span
      style={{
        marginTop: 2, padding: "1px 6px", borderRadius: 6,
        background: "rgba(0,0,0,.65)", color: "#fff",
        fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
      }}
    >
      Bus {busId}
    </span>
  </div>
);

interface BusMarkerProps {
  busId: string;
  lat: number;
  lng: number;
  color: string;
  pulse?: boolean;
}

export default function BusMarker({ busId, lat, lng, color, pulse = false }: BusMarkerProps) {
  const pixelOffset = useMemo(() => ({ x: 0, y: -30 }), []);

  return (
    <OverlayView
      position={{ lat, lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={() => pixelOffset}
    >
      {MARKER_SVG(busId, color, pulse)}
    </OverlayView>
  );
}
