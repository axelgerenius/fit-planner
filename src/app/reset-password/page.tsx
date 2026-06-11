"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);

    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } else {
      const data = await res.json();
      setError(data.error ?? "Une erreur est survenue.");
    }
  }

  if (!token) {
    return (
      <div>
        <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px", marginBottom: "12px" }}>LIEN INVALIDE</h2>
        <p style={{ fontSize: "13px", color: "#7a7268", marginBottom: "20px" }}>
          Ce lien de réinitialisation est manquant ou invalide.
        </p>
        <Link href="/forgot-password" style={{ ...mono, fontSize: "11px", color: "#c0392b", textDecoration: "none", letterSpacing: "1px" }}>
          DEMANDER UN NOUVEAU LIEN →
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <div style={{ width: 40, height: 40, background: "#2c7a4b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px", marginBottom: "12px" }}>MOT DE PASSE MODIFIÉ</h2>
        <p style={{ fontSize: "13px", color: "#7a7268" }}>
          Ton mot de passe a été mis à jour. Redirection vers la connexion…
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px", marginBottom: "8px" }}>NOUVEAU MOT DE PASSE</h2>
      <p style={{ fontSize: "13px", color: "#7a7268", marginBottom: "20px" }}>
        Choisis un nouveau mot de passe pour ton compte.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label style={{ ...mono, fontSize: "10px", color: "#7a7268", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>
            NOUVEAU MOT DE PASSE
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-sm outline-none"
            style={{ border: "1px solid #d8d0c4", borderRadius: "3px", padding: "10px 12px", background: "#f5f0e8", color: "#1a1a1a" }}
          />
        </div>
        <div>
          <label style={{ ...mono, fontSize: "10px", color: "#7a7268", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>
            CONFIRMER LE MOT DE PASSE
          </label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {loading ? "ENREGISTREMENT…" : "ENREGISTRER LE MOT DE PASSE"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f5f0e8" }}>
      <div className="w-full" style={{ maxWidth: "400px" }}>
        <div className="text-center mb-8">
          <h1 style={{ ...display, fontSize: "42px", letterSpacing: "4px", color: "#1a1a1a", lineHeight: 1 }}>
            VITA<span style={{ color: "#c0392b" }}>LOOP</span>
          </h1>
          <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginTop: "6px", letterSpacing: "2px" }}>
            SPORT & NUTRITION PERSONNALISÉS
          </p>
        </div>

        <div className="rounded p-6" style={{ background: "#fff", border: "1px solid #d8d0c4" }}>
          <Suspense fallback={<p style={{ fontSize: "13px", color: "#7a7268" }}>Chargement…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
