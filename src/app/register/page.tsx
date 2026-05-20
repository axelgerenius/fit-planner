"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
    } else {
      router.push("/login?registered=1");
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
          <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px", marginBottom: "20px" }}>CRÉER UN COMPTE</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "PRÉNOM", type: "text", placeholder: "Alex" },
              { name: "email", label: "EMAIL", type: "email", placeholder: "vous@exemple.com" },
              { name: "password", label: "MOT DE PASSE", type: "password", placeholder: "Min. 6 caractères", minLength: 6 },
            ].map((field) => (
              <div key={field.name}>
                <label style={{ ...mono, fontSize: "10px", color: "#7a7268", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  minLength={field.minLength}
                  className="w-full text-sm outline-none"
                  style={{ border: "1px solid #d8d0c4", borderRadius: "3px", padding: "10px 12px", background: "#f5f0e8", color: "#1a1a1a" }}
                />
              </div>
            ))}
            {error && <p style={{ ...mono, fontSize: "11px", color: "#c0392b" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ ...mono, fontSize: "11px", background: "#1a1a1a", color: "#f5f0e8", padding: "12px", borderRadius: "3px", border: "none", cursor: "pointer", letterSpacing: "1px" }}
            >
              {loading ? "CRÉATION…" : "CRÉER MON COMPTE"}
            </button>
          </form>

          <p className="mt-5 text-center" style={{ fontSize: "13px", color: "#7a7268" }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "#c0392b", fontWeight: 600, textDecoration: "none" }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
