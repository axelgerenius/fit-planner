"use client";

import { useState } from "react";
import Link from "next/link";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
    } else {
      setError("Une erreur est survenue. Réessaie plus tard.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f5f0e8" }}>
      <div className="w-full" style={{ maxWidth: "400px" }}>
        <div className="text-center mb-8">
          <h1 style={{ ...display, fontSize: "42px", letterSpacing: "4px", color: "#1a1a1a", lineHeight: 1 }}>
            FIT<span style={{ color: "#c0392b" }}>PLANNER</span>
          </h1>
          <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginTop: "6px", letterSpacing: "2px" }}>
            SPORT & NUTRITION PERSONNALISÉS
          </p>
        </div>

        <div className="rounded p-6" style={{ background: "#fff", border: "1px solid #d8d0c4" }}>
          {sent ? (
            <div>
              <div style={{ width: 40, height: 40, background: "#2c7a4b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4 4 8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px", marginBottom: "12px" }}>EMAIL ENVOYÉ</h2>
              <p style={{ fontSize: "13px", color: "#7a7268", lineHeight: 1.6, marginBottom: "20px" }}>
                Si un compte existe pour <strong>{email}</strong>, tu recevras un lien de réinitialisation dans les prochaines minutes.
              </p>
              <Link
                href="/login"
                style={{ ...mono, fontSize: "11px", color: "#7a7268", textDecoration: "none", letterSpacing: "1px" }}
              >
                ← RETOUR À LA CONNEXION
              </Link>
            </div>
          ) : (
            <>
              <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px", marginBottom: "8px" }}>MOT DE PASSE OUBLIÉ</h2>
              <p style={{ fontSize: "13px", color: "#7a7268", marginBottom: "20px", lineHeight: 1.5 }}>
                Saisis ton email et on t&apos;envoie un lien pour réinitialiser ton mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label style={{ ...mono, fontSize: "10px", color: "#7a7268", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
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
                  {loading ? "ENVOI…" : "ENVOYER LE LIEN"}
                </button>
              </form>

              <p className="mt-5 text-center" style={{ fontSize: "13px", color: "#7a7268" }}>
                <Link href="/login" style={{ color: "#c0392b", fontWeight: 600, textDecoration: "none" }}>
                  ← Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
