"use client";

export default function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,.2)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "white", borderRadius: 20, padding: "32px 40px",
          textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,.15)",
          animation: "scale-in .25s ease",
        }}
      >
        <div
          style={{
            width: 40, height: 40, border: "4px solid #E5E5EA",
            borderTopColor: "#22469D", borderRadius: "50%",
            margin: "0 auto 16px", animation: "spin .8s linear infinite",
          }}
        />
        <p style={{ color: "#1C1C1E", fontSize: 15, fontWeight: 600, margin: 0 }}>
          {message}
        </p>
      </div>
    </div>
  );
}
