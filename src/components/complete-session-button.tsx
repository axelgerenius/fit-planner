"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };

export default function CompleteSessionButton({ sessionId, completed, isFuture = false }: { sessionId: string; completed: boolean; isFuture?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(completed);

  async function handleToggle() {
    setLoading(true);
    const res = await fetch(`/api/sessions/${sessionId}/complete`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setIsDone(data.completed);
    }
    setLoading(false);
    router.refresh();
  }

  if (isFuture && !isDone) {
    return (
      <span
        title="Disponible uniquement à partir de ce jour"
        style={{
          ...mono, fontSize: "10px", letterSpacing: "1px",
          padding: "7px 14px", borderRadius: "3px",
          border: "1px solid #d8d0c4", background: "#f5f0e8",
          color: "#d8d0c4", cursor: "not-allowed", display: "inline-block",
        }}
      >
        ✓ MARQUER COMME FAIT
      </span>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        ...mono, fontSize: "10px", letterSpacing: "1px",
        padding: "7px 14px", borderRadius: "3px",
        border: isDone ? "1px solid #7a7268" : "none",
        background: isDone ? "transparent" : "#2c7a4b",
        color: isDone ? "#7a7268" : "#fff",
        cursor: "pointer", opacity: loading ? 0.5 : 1,
      }}
    >
      {loading ? "…" : isDone ? "↩ ANNULER" : "✓ MARQUER COMME FAIT"}
    </button>
  );
}
