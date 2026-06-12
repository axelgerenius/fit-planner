"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        fontSize: 13, fontWeight: 700,
        padding: "10px 18px", borderRadius: 12,
        border: "none", background: "#22C55E", color: "#fff",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        display: "flex", alignItems: "center", gap: 6,
      }}
    >
      {loading ? "…" : "🔄 Générer la liste"}
    </button>
  );
}
