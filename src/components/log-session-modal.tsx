"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

type ExRow = { name: string; sets: string; reps: string; weightKg: string; restSec: string };

type Props = {
  sessionId: string;
  sessionName: string;
  sessionType: string;
  sessionIcon: string | null;
  durationMin: number;
  exercises: { name: string; sets?: number | null; reps?: string | null; weightKg?: number | null; restSec?: number | null }[];
  onClose: () => void;
};

export default function LogSessionModal({ sessionId, sessionName, sessionType, sessionIcon, durationMin, exercises: templateExercises, onClose }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<ExRow[]>(
    templateExercises.length > 0
      ? templateExercises.map(e => ({
          name: e.name,
          sets: String(e.sets ?? ""),
          reps: e.reps ?? "",
          weightKg: String(e.weightKg ?? ""),
          restSec: String(e.restSec ?? ""),
        }))
      : [{ name: "", sets: "", reps: "", weightKg: "", restSec: "" }]
  );
  const [duration, setDuration] = useState(String(durationMin));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateRow(i: number, field: keyof ExRow, value: string) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }
  function addRow() { setRows(prev => [...prev, { name: "", sets: "", reps: "", weightKg: "", restSec: "" }]); }
  function removeRow(i: number) { setRows(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      // 1. Sauvegarder le log
      const logRes = await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          sessionName,
          sessionType,
          sessionIcon,
          date: new Date().toISOString(),
          durationMin: parseInt(duration) || durationMin,
          notes: notes.trim() || null,
          exercises: rows
            .filter(r => r.name.trim())
            .map(r => ({
              name: r.name.trim(),
              sets: r.sets ? parseInt(r.sets) : null,
              reps: r.reps.trim() || null,
              weightKg: r.weightKg ? parseFloat(r.weightKg) : null,
              restSec: r.restSec ? parseInt(r.restSec) : null,
            })),
        }),
      });
      if (!logRes.ok) throw new Error("Erreur lors de l'enregistrement du log");

      // 2. Marquer la séance comme faite
      await fetch(`/api/sessions/${sessionId}/complete`, { method: "POST" });

      router.refresh();
      onClose();
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff", borderRadius: "16px 16px 0 0",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#d8d0c4" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "10px 20px 12px", borderBottom: "1px solid #ede8df" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 20 }}>{sessionIcon ?? "🏋️"}</span>
                <h2 style={{ ...display, fontSize: 22, letterSpacing: 1 }}>{sessionName.toUpperCase()}</h2>
              </div>
              <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 1 }}>
                VALIDE ET NOTE TES VRAIES PERFORMANCES
              </p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#7a7268" }}>×</button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 4px" }}>

          {/* Durée réelle */}
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 2, marginBottom: 6 }}>DURÉE RÉELLE (min)</p>
              <input type="number" inputMode="numeric" min="1" max="600" value={duration}
                onChange={e => setDuration(e.target.value)}
                style={{ width: "100%", border: "1px solid #d8d0c4", borderRadius: 6, padding: "10px", fontSize: 16, background: "#f5f0e8", color: "#1a1a1a", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Exercices */}
          <div style={{ marginBottom: 14 }}>
            <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 2, marginBottom: 10 }}>EXERCICES RÉALISÉS</p>

            {/* En-têtes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 46px 60px 58px 50px 24px", gap: 4, marginBottom: 4 }}>
              {["NOM", "SÉR.", "REPS", "KG", "REPOS", ""].map((h, i) => (
                <p key={i} style={{ ...mono, fontSize: 8, color: "#b0a898", letterSpacing: 1 }}>{h}</p>
              ))}
            </div>

            {rows.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 46px 60px 58px 50px 24px", gap: 4, marginBottom: 6 }}>
                <input value={row.name} onChange={e => updateRow(i, "name", e.target.value)}
                  placeholder="Squat…"
                  autoComplete="off" autoCorrect="off" autoCapitalize="sentences" spellCheck={false}
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 6px", fontSize: 16, background: "#f5f0e8", color: "#1a1a1a", outline: "none" }} />
                <input type="number" inputMode="numeric" min="1" max="99" value={row.sets} onChange={e => updateRow(i, "sets", e.target.value)}
                  placeholder="3"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 4px", fontSize: 16, background: "#f5f0e8", color: "#1a1a1a", outline: "none", textAlign: "center" }} />
                <input value={row.reps} onChange={e => updateRow(i, "reps", e.target.value)}
                  placeholder="12"
                  inputMode="numeric" autoComplete="off"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 4px", fontSize: 16, background: "#f5f0e8", color: "#1a1a1a", outline: "none", textAlign: "center" }} />
                <input type="number" inputMode="decimal" min="0" max="999" step="0.5" value={row.weightKg} onChange={e => updateRow(i, "weightKg", e.target.value)}
                  placeholder="kg"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 4px", fontSize: 16, background: "#f5f0e8", color: "#1a1a1a", outline: "none", textAlign: "center" }} />
                <input type="number" inputMode="numeric" min="0" max="600" value={row.restSec} onChange={e => updateRow(i, "restSec", e.target.value)}
                  placeholder="60s"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 4px", fontSize: 16, background: "#f5f0e8", color: "#1a1a1a", outline: "none", textAlign: "center" }} />
                <button onClick={() => removeRow(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#d8d0c4", fontSize: 16, padding: 0, lineHeight: 1, alignSelf: "center" }}>×</button>
              </div>
            ))}

            <button onClick={addRow}
              style={{ ...mono, fontSize: 9, letterSpacing: 1, padding: "7px 12px", borderRadius: 4, border: "1px dashed #d8d0c4", background: "transparent", color: "#7a7268", cursor: "pointer", width: "100%", marginTop: 2 }}>
              + AJOUTER UN EXERCICE
            </button>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 8 }}>
            <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 2, marginBottom: 8 }}>
              RESSENTI / NOTES <span style={{ color: "#b0a898" }}>(optionnel)</span>
            </p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Comment s'est passée la séance ? Sensations, fatigue, PRs…"
              style={{ width: "100%", border: "1px solid #d8d0c4", borderRadius: 6, padding: "12px", fontSize: 13, background: "#f5f0e8", color: "#1a1a1a", outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }} />
          </div>

          {error && <p style={{ ...mono, fontSize: 11, color: "#c0392b" }}>{error}</p>}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px 28px", borderTop: "1px solid #ede8df", display: "flex", gap: 8 }}>
          <button onClick={onClose}
            style={{ ...mono, fontSize: 10, flex: 1, padding: 13, borderRadius: 6, border: "1px solid #d8d0c4", background: "transparent", color: "#7a7268", cursor: "pointer", letterSpacing: 1 }}>
            ANNULER
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ ...mono, fontSize: 10, flex: 2, padding: 13, borderRadius: 6, border: "none", background: saving ? "#d8d0c4" : "#2c7a4b", color: "#fff", cursor: saving ? "default" : "pointer", letterSpacing: 1 }}>
            {saving ? "ENREGISTREMENT…" : "✓ VALIDER LA SÉANCE"}
          </button>
        </div>
      </div>
    </>
  );
}
