"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { OverlayView } from "@react-google-maps/api";

interface BusMarkerProps {
  busId: string;
  lat: number;
  lng: number;
  color: string;
  pulse?: boolean;
  routeLabel?: string;
  eta?: number | null;
}

export default function BusMarker({ busId, lat, lng, color, pulse = false, routeLabel = "", eta = null }: BusMarkerProps) {
  const [showTip, setShowTip] = useState(false);
  const [displayPos, setDisplayPos] = useState({ lat, lng });
  const animRef = useRef<number | null>(null);
  const pixelOffset = useMemo(() => ({ x: 0, y: -30 }), []);

  useEffect(() => {
    const from = displayPos;
    const to = { lat, lng };

    const dx = to.lat - from.lat;
    const dy = to.lng - from.lng;
    if (dx === 0 && dy === 0) return;
    if (Math.abs(dx) < 0.00001 && Math.abs(dy) < 0.00001) {
      setDisplayPos(to);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      setDisplayPos({
        lat: from.lat + dx * ease,
        lng: from.lng + dy * ease,
      });

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [lat, lng]);

  return (
    <OverlayView
      position={displayPos}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={() => pixelOffset}
    >
      <div
        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
        onClick={() => setShowTip((o) => !o)}
      >
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
        {showTip && (
          <div
            style={{
              position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
              marginBottom: 6, padding: "6px 10px", borderRadius: 8,
              background: "#1C1C1E", color: "#fff",
              fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
              pointerEvents: "none", zIndex: 10,
            }}
          >
            {routeLabel}{eta !== null ? ` · ${Math.round(eta)} min` : ""}
          </div>
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
    </OverlayView>
  );
}
