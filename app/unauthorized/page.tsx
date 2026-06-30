"use client";

import { useRouter } from "next/navigation";
import { C, FONT, RADIUS, SPACE } from "@/lib/design";
import { useAuth } from "@/components/AuthProvider";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut().then(() => router.push("/"));
  };

  return (
    <div style={{ minHeight: "100dvh", background: C.background, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: SPACE[5], textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: SPACE[4] }}>🔒</div>
      <h1 style={{ fontFamily: FONT.brand, fontSize: 24, fontWeight: 800, color: C.charcoal, margin: "0 0 8px" }}>
        401 Unauthorized
      </h1>
      <p style={{ margin: "0 0 32px", fontSize: 15, color: C.text, maxWidth: 300, lineHeight: 1.5 }}>
        You don't have permission to access this page.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE[3], width: "100%", maxWidth: 280 }}>
        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%", height: 48, borderRadius: RADIUS.md, border: "none",
            background: C.primary, color: C.white, fontSize: 16, fontWeight: 500,
            fontFamily: FONT.ui, cursor: "pointer",
          }}
        >
          Return to home
        </button>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%", height: 44, borderRadius: RADIUS.md, border: `1px solid ${C.border}`,
            background: "none", color: C.secondary, fontSize: 14, fontWeight: 600,
            fontFamily: FONT.ui, cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
