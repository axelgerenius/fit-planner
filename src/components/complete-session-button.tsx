"use client";

import { useState } from "react";
import LogSessionModal from "@/components/log-session-modal";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };

type Exercise = { name: string; sets?: number | null; reps?: string | null; weightKg?: number | null; restSec?: number | null };

type Props = {
  sessionId: string;
  sessionName: string;
  sessionType: string;
  sessionIcon: string | null;
  durationMin: number;
  exercises: Exercise[];
  completed: boolean;
  isFuture?: boolean;
};

export default function CompleteSessionButton({
  sessionId, sessionName, sessionType, sessionIcon, durationMin, exercises,
  completed, isFuture = false,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(completed);
  const router = require("next/navigation").useRouter();

  // Annulation (undo) — pas de modal nécessaire
  async function handleUndo() {
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
      <span title="Disponible uniquement à partir de ce jour"
        style={{ ...mono, fontSize: "10px", letterSpacing: "1px", padding: "7px 14px", borderRadius: "3px", border: "1px solid #d8d0c4", background: "#f5f0e8", color: "#d8d0c4", cursor: "not-allowed", display: "inline-block" }}>
        ✓ MARQUER COMME FAIT
      </span>
    );
  }

  if (isDone) {
    return (
      <button onClick={handleUndo} disabled={loading}
        style={{ ...mono, fontSize: "10px", letterSpacing: "1px", padding: "7px 14px", borderRadius: "3px", border: "1px solid #7a7268", background: "transparent", color: "#7a7268", cursor: "pointer", opacity: loading ? 0.5 : 1 }}>
        {loading ? "…" : "↩ ANNULER"}
      </button>
    );
  }

  return (
    <>
      <button onClick={() => setShowModal(true)}
        style={{ ...mono, fontSize: "10px", letterSpacing: "1px", padding: "7px 14px", borderRadius: "3px", border: "none", background: "#2c7a4b", color: "#fff", cursor: "pointer" }}>
        ✓ MARQUER COMME FAIT
      </button>

      {showModal && (
        <LogSessionModal
          sessionId={sessionId}
          sessionName={sessionName}
          sessionType={sessionType}
          sessionIcon={sessionIcon}
          durationMin={durationMin}
          exercises={exercises}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
