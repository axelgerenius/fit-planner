"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #E5E7EB", borderRadius: 10,
  padding: "11px 14px", background: "#F9FAFB", color: "#111827",
  fontSize: 15, outline: "none", boxSizing: "border-box",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "#F9FAFB" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/icon.svg" alt="VitaLoop" width={64} height={64} style={{ borderRadius: 16, border: "1px solid #E5E7EB", marginBottom: 12 }} />
          <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, color: "#111827", letterSpacing: 0.5 }}>
            VITA<span style={{ color: "#FF6500" }}>LOOP</span>
          </h1>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#6B7280", marginTop: 6, letterSpacing: 1 }}>
            Sport & nutrition personnalisés
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: "28px 28px 24px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 22 }}>Connexion</h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="vous@exemple.com"
                autoComplete="email"
                autoCapitalize="none"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: "#EF4444", background: "#FEF2F2", padding: "8px 12px", borderRadius: 8 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                fontSize: 14, fontWeight: 700,
                background: "#FF6500", color: "#fff",
                padding: "13px", borderRadius: 12, border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", marginTop: 16 }}>
            <Link href="/forgot-password" style={{ color: "#6B7280", textDecoration: "none" }}>
              Mot de passe oublié ?
            </Link>
          </p>
          <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", marginTop: 10 }}>
            Pas encore de compte ?{" "}
            <Link href="/register" style={{ color: "#FF6500", fontWeight: 700, textDecoration: "none" }}>
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
