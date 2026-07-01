"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(145deg, #22469D 0%, #1A3578 60%, #14295B 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "40px 24px", position: "relative", overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(255,255,255,.04)",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: -40, left: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: "rgba(255,255,255,.03)",
        }}
      />

      <div style={{ textAlign: "center", marginBottom: 48, animation: "fade-up .4s ease" }}>
        <div
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 80, height: 80, borderRadius: 24,
            background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)",
            marginBottom: 20, fontSize: 40,
          }}
        >
          🚌
        </div>
        <h1
          style={{
            margin: 0, fontSize: 34, fontWeight: 900, color: "#fff",
            letterSpacing: "-.5px", lineHeight: 1.1,
          }}
        >
          QueuePITX
        </h1>
        <p
          style={{
            margin: "8px 0 0", fontSize: 15, color: "rgba(255,255,255,.7)",
            fontWeight: 500, lineHeight: 1.4, maxWidth: 280, marginInline: "auto",
          }}
        >
          Real-time bus queue intelligence for PITX Cavite Lines
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 320, marginInline: "auto", width: "100%" }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "18px 24px", borderRadius: 16, background: "#fff",
            border: "none", cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,.15)",
            transition: "transform .15s, box-shadow .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.15)"; }}
        >
          <span style={{ fontSize: 28 }}>👤</span>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1C1C1E" }}>Commuter</p>
            <p style={{ margin: 0, fontSize: 13, color: "#6B6B6B" }}>View queues & live map</p>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 20, color: "#C5D0F0" }}>→</span>
        </button>

        <button
          onClick={() => router.push(user ? "/track" : "/login?redirect=/track")}
          style={{
            padding: "18px 24px", borderRadius: 16, background: "#fff",
            border: "none", cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,.15)",
            transition: "transform .15s, box-shadow .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.15)"; }}
        >
          <span style={{ fontSize: 28 }}>🧑‍✈️</span>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1C1C1E" }}>Conductor</p>
            <p style={{ margin: 0, fontSize: 13, color: "#6B6B6B" }}>Broadcast bus location</p>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 20, color: "#C5D0F0" }}>→</span>
        </button>
      </div>
    </div>
  );
}
