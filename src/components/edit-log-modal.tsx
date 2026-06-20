"use client";

import { useState } from "react";

type LogExercise = { id: string; name: string; sets?: number | null; reps?: string | null; weightKg?: number | null; restSec?: number | null };
type WorkoutLog = {
  id: string;
  sessionName: string;
  sessionType: string;
  sessionIcon?: string | null;
  date: string;
  durationMin?: number | null;
  notes?: string | null;
  exercises: LogExercise[];
};

type ExRow = { name: string; sets: string; reps: string; weightKg: string; restSec: string };

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #E5E7EB", borderRadius: 10,
  padding: "10px 12px", background: "#F9FAFB", color: "#111827",
  fontSize: 15, outline: "none", boxSizing: "border-box",
};

type Props = {
  log: WorkoutLog;
  onClose: () => void;
  onSaved: (updated: WorkoutLog) => void;
};

export default function EditLogModal({ log, onClose, onSaved }: Props) {
  const [sessionName, setSessionName] = useState(log.sessionName);
  const [date, setDate] = useState(log.date.slice(0, 10));
  const [duration, setDuration] = useState(String(log.durationMin ?? ""));
  const [notes, setNotes] = useState(log.notes ?? "");
  const [rows, setRows] = useState<ExRow[]>(
    log.exercises.length > 0
      ? log.exercises.map(e => ({
          name: e.name,
          sets: String(e.sets ?? ""),
          reps: e.reps ?? "",
          weightKg: String(e.weightKg ?? ""),
          restSec: String(e.restSec ?? ""),
        }))
      : [{ name: "", sets: "", reps: "", weightKg: "", restSec: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateRow(i: number, field: keyof ExRow, value: string) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }
  function addRow() { setRows(prev => [...prev, { name: "", sets: "", reps: "", weightKg: "", restSec: "" }]); }
  function removeRow(i: number) { setRows(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSave() {
    if (!sessionName.trim() || !date) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/workout-logs/${log.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionName: sessionName.trim(),
          date: new Date(date).toISOString(),
          durationMin: duration ? parseInt(duration) : null,
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
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      const updated = await res.json();
      onSaved(updated);
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
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#E5E7EB" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "10px 20px 12px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Modifier la séance</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6B7280" }}>×</button>
        </div>

        {/* Contenu scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 4px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>Nom</label>
              <input value={sessionName} onChange={e => setSessionName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>Durée (min)</label>
              <input type="number" inputMode="numeric" min="1" max="600" value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>

          {/* Exercices */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 8 }}>Exercices</label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 42px 50px 50px 50px 22px", gap: 4, marginBottom: 4 }}>
              {["Nom", "Sér.", "Reps", "Kg", "Repos", ""].map((h, i) => (
                <p key={i} style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</p>
              ))}
            </div>

            {rows.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 42px 50px 50px 50px 22px", gap: 4, marginBottom: 6, alignItems: "center" }}>
                <input value={row.name} onChange={e => updateRow(i, "name", e.target.value)}
                  placeholder="Squat…"
                  style={{ ...inputStyle, padding: "8px 8px", fontSize: 14 }} />
                <input type="number" inputMode="numeric" min="1" max="99" value={row.sets} onChange={e => updateRow(i, "sets", e.target.value)}
                  placeholder="3"
                  style={{ ...inputStyle, padding: "8px 4px", fontSize: 14, textAlign: "center" }} />
                <input value={row.reps} onChange={e => updateRow(i, "reps", e.target.value)}
                  placeholder="12"
                  inputMode="numeric"
                  style={{ ...inputStyle, padding: "8px 4px", fontSize: 14, textAlign: "center" }} />
                <input type="number" inputMode="decimal" min="0" max="999" step="0.5" value={row.weightKg} onChange={e => updateRow(i, "weightKg", e.target.value)}
                  placeholder="kg"
                  style={{ ...inputStyle, padding: "8px 4px", fontSize: 14, textAlign: "center" }} />
                <input type="number" inputMode="numeric" min="0" max="600" value={row.restSec} onChange={e => updateRow(i, "restSec", e.target.value)}
                  placeholder="60s"
                  style={{ ...inputStyle, padding: "8px 4px", fontSize: 14, textAlign: "center" }} />
                <button onClick={() => removeRow(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
              </div>
            ))}

            <button onClick={addRow}
              style={{ fontSize: 12, fontWeight: 600, padding: "8px 12px", borderRadius: 8, border: "1px dashed #E5E7EB", background: "transparent", color: "#6B7280", cursor: "pointer", width: "100%", marginTop: 2 }}>
              + Ajouter un exercice
            </button>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Sensations, fatigue, records…"
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
          </div>

          {error && <p style={{ fontSize: 12, color: "#EF4444" }}>{error}</p>}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 8 }}>
          <button onClick={onClose}
            style={{ fontSize: 13, fontWeight: 700, flex: 1, padding: 13, borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", color: "#6B7280", cursor: "pointer" }}>
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ fontSize: 13, fontWeight: 700, flex: 2, padding: 13, borderRadius: 12, border: "none", background: saving ? "#FFB280" : "#FF6500", color: "#fff", cursor: saving ? "default" : "pointer" }}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </>
  );
}
