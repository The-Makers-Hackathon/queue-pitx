"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirectTo = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("redirect") || "/"
    : "/";

  useEffect(() => {
    if (!loading && user) router.replace(redirectTo);
  }, [loading, user, router, redirectTo]);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signIn();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign in failed";
      setError(msg);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "linear-gradient(145deg, #22469D 0%, #1A3578 60%, #14295B 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 32, height: 32, border: "3px solid rgba(255,255,255,.2)",
              borderTopColor: "#fff", borderRadius: "50%",
              margin: "0 auto 12px", animation: "spin .8s linear infinite",
            }}
          />
        </div>
      </div>
    );
  }

  if (user) return null;

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
            margin: 0, fontSize: 28, fontWeight: 900, color: "#fff",
            letterSpacing: "-.5px",
          }}
        >
          Sign in to QueuePITX
        </h1>
        <p
          style={{
            margin: "8px 0 0", fontSize: 15, color: "rgba(255,255,255,.7)",
            fontWeight: 500, maxWidth: 280, marginInline: "auto",
          }}
        >
          Use your Google account to access all features
        </p>
      </div>

      <div style={{ maxWidth: 320, marginInline: "auto", width: "100%" }}>
        {error && (
          <p
            style={{
              margin: "0 0 12px", padding: "10px 14px", borderRadius: 12,
              background: "rgba(238,49,39,.15)", color: "#EE3127",
              fontSize: 13, fontWeight: 600, textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          style={{
            width: "100%", padding: "16px 24px", borderRadius: 16,
            background: signingIn ? "rgba(255,255,255,.7)" : "#fff",
            border: "none", cursor: signingIn ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,.15)", fontSize: 16, fontWeight: 700,
            color: "#1C1C1E", transition: "all .15s",
          }}
        >
          {signingIn ? (
            <div
              style={{
                width: 20, height: 20, border: "2px solid #E5E5EA",
                borderTopColor: "#22469D", borderRadius: "50%",
                animation: "spin .8s linear infinite",
              }}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A24 24 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-6.17z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {signingIn ? "Signing in..." : "Sign in with Google"}
        </button>

        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%", padding: "12px", marginTop: 12,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.6)",
            textAlign: "center",
          }}
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}
