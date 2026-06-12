"use client";

import { useEffect, useState } from "react";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

const EMOJI_OPTIONS = ["✅", "💧", "🏃", "🥗", "😴", "📚", "🧘", "🚭", "🥤", "🍎", "💪", "🧹", "🌅", "🚶", "🎯"];

const QUOTES = [
  { text: "Nous sommes ce que nous faisons de manière répétée. L'excellence n'est donc pas un acte, mais une habitude.", author: "Aristote" },
  { text: "Le secret de votre futur se cache dans votre routine quotidienne.", author: "Mike Murdock" },
  { text: "La discipline est le pont entre les objectifs et les accomplissements.", author: "Jim Rohn" },
  { text: "Un petit progrès chaque jour mène à de grands résultats.", author: "Satya Nani" },
  { text: "Le corps accomplit ce que l'esprit croit.", author: "Napoleon Hill" },
  { text: "Tu n'as pas à être exceptionnel chaque jour. Tu dois juste être constant.", author: "Anonymous" },
  { text: "La santé est la première des richesses.", author: "Ralph Waldo Emerson" },
  { text: "Prends soin de ton corps. C'est le seul endroit où tu dois vivre.", author: "Jim Rohn" },
];

type Habit = { id: string; name: string; emoji: string };

function todayLabel() {
  return new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

export default function HabitudesPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("✅");
  const [saving, setSaving] = useState(false);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  async function loadHabits() {
    const [habitsRes] = await Promise.all([fetch("/api/habits")]);
    const habitsData: Habit[] = await habitsRes.json();
    setHabits(habitsData);

    const todayLogs = await fetch("/api/habits/today");
    if (todayLogs.ok) {
      const ids: string[] = await todayLogs.json();
      setChecked(new Set(ids));
    }
    setLoading(false);
  }

  useEffect(() => { loadHabits(); }, []);

  async function toggle(id: string) {
    const res = await fetch(`/api/habits/${id}/toggle`, { method: "POST" });
    if (!res.ok) return;
    const { checked: isChecked } = await res.json();
    setChecked(prev => {
      const next = new Set(prev);
      isChecked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), emoji: newEmoji }),
    });
    setSaving(false);
    if (res.ok) {
      const habit = await res.json();
      setHabits(prev => [...prev, habit]);
      setNewName("");
      setNewEmoji("✅");
      setShowForm(false);
    }
  }

  async function deleteHabit(id: string) {
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    setHabits(prev => prev.filter(h => h.id !== id));
    setChecked(prev => { const next = new Set(prev); next.delete(id); return next; });
  }

  const total = habits.length;
  const done = habits.filter(h => checked.has(h.id)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #E5E7EB",
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ ...display, fontSize: 32, letterSpacing: 2, color: "#111827", marginBottom: 4 }}>
          MES HABITUDES
        </h1>
        <p style={{ ...mono, fontSize: 11, color: "#6B7280", letterSpacing: 1, textTransform: "capitalize" }}>
          {todayLabel()}
        </p>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div style={{ ...card, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ ...mono, fontSize: 10, color: "#6B7280", letterSpacing: 1 }}>PROGRESSION DU JOUR</span>
            <span style={{ ...mono, fontSize: 14, color: allDone ? "#22C55E" : "#FF6500", fontWeight: 700 }}>
              {done}/{total}
            </span>
          </div>
          <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: allDone ? "#22C55E" : "#FF6500", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
          {allDone && (
            <p style={{ ...mono, fontSize: 10, color: "#22C55E", letterSpacing: 1, marginTop: 8, textAlign: "right" }}>
              🎉 TOUTES COMPLÉTÉES !
            </p>
          )}
        </div>
      )}

      {/* Habits list */}
      <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {loading ? (
          <p style={{ ...mono, fontSize: 11, color: "#6B7280" }}>Chargement…</p>
        ) : habits.length === 0 ? (
          <div style={{ ...card, padding: 40, textAlign: "center" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🌱</p>
            <p style={{ ...mono, fontSize: 11, color: "#6B7280", letterSpacing: 1 }}>AUCUNE HABITUDE DÉFINIE</p>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>Ajoute ta première habitude ci-dessous.</p>
          </div>
        ) : (
          habits.map(habit => {
            const isDone = checked.has(habit.id);
            return (
              <div
                key={habit.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  borderLeft: `4px solid ${isDone ? "#22C55E" : "#E5E7EB"}`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  transition: "border-color 0.2s, opacity 0.2s",
                  opacity: isDone ? 0.75 : 1,
                }}
                onClick={() => toggle(habit.id)}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{habit.emoji}</span>
                <span style={{
                  flex: 1,
                  fontSize: 14,
                  color: isDone ? "#6B7280" : "#111827",
                  textDecoration: isDone ? "line-through" : "none",
                  fontWeight: isDone ? 400 : 500,
                }}>
                  {habit.name}
                </span>
                <div style={{
                  width: 24, height: 24,
                  borderRadius: "50%",
                  border: `2px solid ${isDone ? "#22C55E" : "#D1D5DB"}`,
                  background: isDone ? "#22C55E" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.2s",
                }}>
                  {isDone && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteHabit(habit.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", padding: 4, lineHeight: 1, fontSize: 18 }}
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Quote */}
      <div style={{ ...card, padding: "14px 18px", marginBottom: 16, borderLeft: "4px solid #FF6500" }}>
        <p style={{ fontSize: 13, color: "#111827", lineHeight: 1.7, fontStyle: "italic", marginBottom: 6 }}>
          &ldquo;{quote.text}&rdquo;
        </p>
        <p style={{ ...mono, fontSize: 10, color: "#6B7280", letterSpacing: 1 }}>— {quote.author.toUpperCase()}</p>
      </div>

      {/* Add habit */}
      {showForm ? (
        <form onSubmit={addHabit} style={{ ...card, padding: 20 }}>
          <p style={{ ...mono, fontSize: 10, color: "#6B7280", letterSpacing: 1, marginBottom: 14 }}>NOUVELLE HABITUDE</p>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Ex: Boire 2L d'eau"
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
            spellCheck={false}
            style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px", fontSize: 16, background: "#F9FAFB", color: "#111827", outline: "none", boxSizing: "border-box", marginBottom: 14 }}
          />
          <div style={{ marginBottom: 18 }}>
            <p style={{ ...mono, fontSize: 10, color: "#6B7280", letterSpacing: 1, marginBottom: 8 }}>EMOJI</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EMOJI_OPTIONS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setNewEmoji(em)}
                  style={{
                    fontSize: 20, padding: "6px 8px", borderRadius: 10,
                    border: `2px solid ${newEmoji === em ? "#FF6500" : "#E5E7EB"}`,
                    background: newEmoji === em ? "#FFF3ED" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={saving}
              style={{ ...mono, fontSize: 11, background: "#FF6500", color: "#fff", padding: "11px 24px", borderRadius: 10, border: "none", cursor: "pointer", letterSpacing: 1, opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "…" : "AJOUTER"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ ...mono, fontSize: 11, background: "transparent", color: "#6B7280", padding: "11px 20px", borderRadius: 10, border: "1px solid #E5E7EB", cursor: "pointer", letterSpacing: 1 }}
            >
              ANNULER
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{
            ...mono, fontSize: 11, background: "#fff", color: "#FF6500",
            padding: "14px 20px", borderRadius: 14, border: "2px dashed #FF6500",
            cursor: "pointer", letterSpacing: 1, width: "100%",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          + AJOUTER UNE HABITUDE
        </button>
      )}
    </div>
  );
}
