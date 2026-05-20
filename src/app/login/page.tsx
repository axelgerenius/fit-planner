"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f5f0e8" }}>
      <div className="w-full" style={{ maxWidth: "400px" }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 style={{ ...display, fontSize: "42px", letterSpacing: "4px", color: "#1a1a1a", lineHeight: 1 }}>
            FIT<span style={{ color: "#c0392b" }}>PLANNER</span>
          </h1>
          <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginTop: "6px", letterSpacing: "2px" }}>
            SPORT & NUTRITION PERSONNALISÉS
          </p>
        </div>

        {/* Card */}
        <div className="rounded p-6" style={{ background: "#fff", border: "1px solid #d8d0c4" }}>
          <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px", marginBottom: "20px" }}>CONNEXION</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ ...mono, fontSize: "10px", color: "#7a7268", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>
                EMAIL
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="vous@exemple.com"
                className="w-full text-sm outline-none transition-colors"
                style={{ border: "1px solid #d8d0c4", borderRadius: "3px", padding: "10px 12px", background: "#f5f0e8", color: "#1a1a1a" }}
              />
            </div>
            <div>
              <label style={{ ...mono, fontSize: "10px", color: "#7a7268", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>
                MOT DE PASSE
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full text-sm outline-none"
                style={{ border: "1px solid #d8d0c4", borderRadius: "3px", padding: "10px 12px", background: "#f5f0e8", color: "#1a1a1a" }}
              />
            </div>
            {error && <p style={{ ...mono, fontSize: "11px", color: "#c0392b" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ ...mono, fontSize: "11px", background: "#1a1a1a", color: "#f5f0e8", padding: "12px", borderRadius: "3px", border: "none", cursor: "pointer", letterSpacing: "1px" }}
            >
              {loading ? "CONNEXION…" : "SE CONNECTER"}
            </button>
          </form>

          <p className="mt-5 text-center" style={{ fontSize: "13px", color: "#7a7268" }}>
            Pas encore de compte ?{" "}
            <Link href="/register" style={{ color: "#c0392b", fontWeight: 600, textDecoration: "none" }}>
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
