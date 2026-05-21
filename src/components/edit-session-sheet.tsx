"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

export type SessionType = "STRENGTH" | "CARDIO" | "HIIT" | "YOGA_STRETCH" | "FULL_BODY" | "REST";

const SPORTS: { icon: string; name: string; type: SessionType; category: string }[] = [
  { icon: "🏋️", name: "Musculation",        type: "STRENGTH",     category: "Force" },
  { icon: "🧗", name: "Escalade",            type: "STRENGTH",     category: "Force" },
  { icon: "🥊", name: "Boxe / MMA",          type: "STRENGTH",     category: "Force" },
  { icon: "🤸", name: "Gymnastique",          type: "STRENGTH",     category: "Force" },
  { icon: "🏃", name: "Course à pied",        type: "CARDIO",       category: "Cardio" },
  { icon: "🚴", name: "Vélo / Cycling",        type: "CARDIO",       category: "Cardio" },
  { icon: "🏊", name: "Natation",             type: "CARDIO",       category: "Cardio" },
  { icon: "🛶", name: "Aviron / Kayak",        type: "CARDIO",       category: "Cardio" },
  { icon: "⛸️", name: "Patinage",             type: "CARDIO",       category: "Cardio" },
  { icon: "🚶", name: "Marche rapide",         type: "CARDIO",       category: "Cardio" },
  { icon: "⚽", name: "Football",             type: "HIIT",         category: "Sports" },
  { icon: "🏀", name: "Basketball",           type: "HIIT",         category: "Sports" },
  { icon: "🎾", name: "Tennis",               type: "HIIT",         category: "Sports" },
  { icon: "🏸", name: "Badminton",            type: "HIIT",         category: "Sports" },
  { icon: "🏐", name: "Volleyball",           type: "HIIT",         category: "Sports" },
  { icon: "🤾", name: "Handball",             type: "HIIT",         category: "Sports" },
  { icon: "🏒", name: "Hockey",               type: "HIIT",         category: "Sports" },
  { icon: "🎱", name: "Squash / Padel",        type: "HIIT",         category: "Sports" },
  { icon: "🔥", name: "HIIT",                type: "HIIT",         category: "Sports" },
  { icon: "💃", name: "Danse",                type: "FULL_BODY",    category: "Corps entier" },
  { icon: "🥋", name: "Arts martiaux",         type: "FULL_BODY",    category: "Corps entier" },
  { icon: "🤸", name: "CrossFit",             type: "FULL_BODY",    category: "Corps entier" },
  { icon: "🏄", name: "Surf / Kitesurf",       type: "FULL_BODY",    category: "Corps entier" },
  { icon: "🎿", name: "Ski / Snowboard",        type: "FULL_BODY",    category: "Corps entier" },
  { icon: "💪", name: "Full Body",             type: "FULL_BODY",    category: "Corps entier" },
  { icon: "🧘", name: "Yoga",                type: "YOGA_STRETCH", category: "Bien-être" },
  { icon: "🧘", name: "Pilates",              type: "YOGA_STRETCH", category: "Bien-être" },
  { icon: "🧖", name: "Stretching",           type: "YOGA_STRETCH", category: "Bien-être" },
  { icon: "🌊", name: "Tai-chi",              type: "YOGA_STRETCH", category: "Bien-être" },
  { icon: "🛌", name: "Repos complet",         type: "REST",         category: "Repos" },
  { icon: "🚶", name: "Marche / NEAT",          type: "REST",         category: "Repos" },
];

const CATEGORIES = ["Force", "Cardio", "Sports", "Corps entier", "Bien-être", "Repos"];

type ExerciseRow = { name: string; sets: string; reps: string; restSec: string; weightKg: string };

type Props = {
  sessionId: string;
  currentName: string;
  currentType: SessionType;
  currentIcon?: string | null;
  currentNotes?: string | null;
  currentDuration: number;
  currentExercises?: { name: string; sets?: number | null; reps?: string | null; restSec?: number | null; weightKg?: number | null }[];
  onClose: () => void;
};

export default function EditSessionSheet({ sessionId, currentName, currentType, currentIcon, currentNotes, currentDuration, currentExercises = [], onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [type, setType] = useState<SessionType>(currentType);
  const [icon, setIcon] = useState<string>(currentIcon ?? "");
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [duration, setDuration] = useState(String(currentDuration));
  const [exercises, setExercises] = useState<ExerciseRow[]>(
    currentExercises.length > 0
      ? currentExercises.map(e => ({ name: e.name, sets: String(e.sets ?? ""), reps: e.reps ?? "", restSec: String(e.restSec ?? ""), weightKg: String(e.weightKg ?? "") }))
      : [{ name: "", sets: "", reps: "", restSec: "", weightKg: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addExercise() {
    setExercises(prev => [...prev, { name: "", sets: "", reps: "", restSec: "", weightKg: "" }]);
  }

  function removeExercise(i: number) {
    setExercises(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateExercise(i: number, field: keyof ExerciseRow, value: string) {
    setExercises(prev => prev.map((ex, idx) => idx === i ? { ...ex, [field]: value } : ex));
  }

  function selectSport(sport: typeof SPORTS[0]) {
    setName(sport.name);
    setType(sport.type);
    setIcon(sport.icon);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          icon: icon || null,
          notes: notes.trim() || null,
          durationMin: parseInt(duration) || currentDuration,
          exercises: exercises
            .filter(e => e.name.trim())
            .map(e => ({
              name: e.name.trim(),
              sets: e.sets ? parseInt(e.sets) : null,
              reps: e.reps.trim() || null,
              restSec: e.restSec ? parseInt(e.restSec) : null,
              weightKg: e.weightKg ? parseFloat(e.weightKg) : null,
            })),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Erreur lors de la sauvegarde");
        setSaving(false);
        return;
      }
      router.refresh();
      onClose();
    } catch {
      setError("Erreur réseau");
      setSaving(false);
    }
  }

  const isSelected = (sport: typeof SPORTS[0]) => sport.name === name && sport.icon === icon;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "#fff", borderRadius: "16px 16px 0 0",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#d8d0c4" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "10px 20px 12px", borderBottom: "1px solid #ede8df", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ ...display, fontSize: 22, letterSpacing: 1, color: "#1a1a1a" }}>MODIFIER LA SÉANCE</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#7a7268", lineHeight: 1 }}>×</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 4px" }}>

          {/* Choisir un sport */}
          <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 2, marginBottom: 10 }}>
            CHOISIR UN SPORT (optionnel — cliquer pré-remplit le nom)
          </p>
          {CATEGORIES.map(cat => {
            const sports = SPORTS.filter(s => s.category === cat);
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <p style={{ ...mono, fontSize: 8, color: "#b0a898", letterSpacing: 1, marginBottom: 6 }}>
                  {cat.toUpperCase()}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {sports.map(sport => (
                    <button
                      key={sport.name}
                      onClick={() => selectSport(sport)}
                      style={{
                        all: "unset", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "7px 10px", borderRadius: 20,
                        border: isSelected(sport) ? "2px solid #c0392b" : "1px solid #d8d0c4",
                        background: isSelected(sport) ? "#fff5f5" : "#f5f0e8",
                        fontSize: 13,
                        transition: "all 0.1s",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{sport.icon}</span>
                      <span style={{ fontWeight: isSelected(sport) ? 600 : 400, color: isSelected(sport) ? "#c0392b" : "#1a1a1a" }}>
                        {sport.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Séparateur */}
          <div style={{ borderTop: "1px solid #ede8df", margin: "8px 0 16px" }} />

          {/* Nom libre */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 2, marginBottom: 8 }}>
              NOM DE LA SÉANCE {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
            </p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Danse le lundi soir, Escalade…"
              style={{
                width: "100%", border: "1px solid #d8d0c4", borderRadius: 6,
                padding: "12px", fontSize: 15, background: "#f5f0e8",
                color: "#1a1a1a", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Durée */}
          <div style={{ marginBottom: 8 }}>
            <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 2, marginBottom: 8 }}>DURÉE (minutes)</p>
            <input
              type="number"
              min={5} max={300}
              value={duration}
              onChange={e => setDuration(e.target.value)}
              style={{
                width: "100%", border: "1px solid #d8d0c4", borderRadius: 6,
                padding: "12px", fontSize: 15, background: "#f5f0e8",
                color: "#1a1a1a", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Exercices structurés */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 2, marginBottom: 10 }}>
              EXERCICES <span style={{ color: "#b0a898" }}>(optionnel)</span>
            </p>

            {/* En-têtes colonnes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 46px 60px 50px 58px 24px", gap: 4, marginBottom: 4 }}>
              {["NOM", "SÉR.", "REPS", "REPOS", "KG", ""].map((h, i) => (
                <p key={i} style={{ ...mono, fontSize: 8, color: "#b0a898", letterSpacing: 1 }}>{h}</p>
              ))}
            </div>

            {exercises.map((ex, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 46px 60px 50px 58px 24px", gap: 4, marginBottom: 6 }}>
                <input
                  value={ex.name}
                  onChange={e => updateExercise(i, "name", e.target.value)}
                  placeholder="Squat…"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 6px", fontSize: 12, background: "#f5f0e8", color: "#1a1a1a", outline: "none" }}
                />
                <input
                  type="number" min="1" max="99"
                  value={ex.sets}
                  onChange={e => updateExercise(i, "sets", e.target.value)}
                  placeholder="3"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 4px", fontSize: 12, background: "#f5f0e8", color: "#1a1a1a", outline: "none", textAlign: "center" }}
                />
                <input
                  value={ex.reps}
                  onChange={e => updateExercise(i, "reps", e.target.value)}
                  placeholder="12"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 4px", fontSize: 12, background: "#f5f0e8", color: "#1a1a1a", outline: "none", textAlign: "center" }}
                />
                <input
                  type="number" min="0" max="600"
                  value={ex.restSec}
                  onChange={e => updateExercise(i, "restSec", e.target.value)}
                  placeholder="60"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 4px", fontSize: 12, background: "#f5f0e8", color: "#1a1a1a", outline: "none", textAlign: "center" }}
                />
                <input
                  type="number" min="0" max="999" step="0.5"
                  value={ex.weightKg}
                  onChange={e => updateExercise(i, "weightKg", e.target.value)}
                  placeholder="kg"
                  style={{ border: "1px solid #d8d0c4", borderRadius: 4, padding: "8px 4px", fontSize: 12, background: "#f5f0e8", color: "#1a1a1a", outline: "none", textAlign: "center" }}
                />
                <button
                  onClick={() => removeExercise(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#d8d0c4", fontSize: 16, padding: 0, lineHeight: 1, alignSelf: "center" }}
                >×</button>
              </div>
            ))}

            <button
              onClick={addExercise}
              style={{ ...mono, fontSize: 9, letterSpacing: 1, padding: "7px 12px", borderRadius: 4, border: "1px dashed #d8d0c4", background: "transparent", color: "#7a7268", cursor: "pointer", width: "100%", marginTop: 2 }}
            >
              + AJOUTER UN EXERCICE
            </button>
          </div>

          {/* Notes libres */}
          <div style={{ marginBottom: 8 }}>
            <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 2, marginBottom: 8 }}>
              NOTES LIBRES <span style={{ color: "#b0a898" }}>(optionnel)</span>
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Instructions, conseils, objectifs du jour…"
              style={{
                width: "100%", border: "1px solid #d8d0c4", borderRadius: 6,
                padding: "12px", fontSize: 13, background: "#f5f0e8",
                color: "#1a1a1a", outline: "none", boxSizing: "border-box",
                resize: "vertical", lineHeight: 1.6,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            />
          </div>

          {error && <p style={{ ...mono, fontSize: 11, color: "#c0392b", marginTop: 8 }}>{error}</p>}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px 28px", borderTop: "1px solid #ede8df", display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{ ...mono, fontSize: 10, flex: 1, padding: 13, borderRadius: 6, border: "1px solid #d8d0c4", background: "transparent", color: "#7a7268", cursor: "pointer", letterSpacing: 1 }}
          >
            ANNULER
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            style={{ ...mono, fontSize: 10, flex: 2, padding: 13, borderRadius: 6, border: "none", background: saving || !name.trim() ? "#d8d0c4" : "#1a1a1a", color: "#fff", cursor: saving || !name.trim() ? "default" : "pointer", letterSpacing: 1 }}
          >
            {saving ? "ENREGISTREMENT…" : "✓ ENREGISTRER"}
          </button>
        </div>
      </div>
    </>
  );
}
