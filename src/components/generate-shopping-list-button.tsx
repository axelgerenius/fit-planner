"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };

export default function GenerateShoppingListButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    await fetch("/api/shopping/generate", { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={generate}
      disabled={loading}
      style={{
        ...mono, fontSize: 11, letterSpacing: 1,
        padding: "10px 18px", borderRadius: 12,
        border: "none", background: "#22C55E", color: "#fff",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        display: "flex", alignItems: "center", gap: 6,
        fontWeight: 600,
      }}
    >
      {loading ? "…" : "🔄 GÉNÉRER LA LISTE"}
    </button>
  );
}
