"use client";

import { useEffect, useState } from "react";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

const EMOJI_OPTIONS = ["✅", "💧", "🏃", "🥗", "😴", "📚", "🧘", "🚭", "🥤", "🍎", "💪", "🧹", "🌅", "🚶", "🎯"];

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

  async function loadHabits() {
    const [habitsRes, logsRes] = await Promise.all([
      fetch("/api/habits"),
      fetch("/api/habits/logs?days=1"),
    ]);
    const habitsData: Habit[] = await habitsRes.json();
    const logsData: { byDate: Record<string, number> } = await logsRes.json();

    setHabits(habitsData);

    // Fetch today's individual logs
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

  return (
    <div style={{ padding: "24px 16px", maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ ...display, fontSize: 36, letterSpacing: 2, color: "#1a1a1a", marginBottom: 4 }}>
          MES HABITUDES
        </h1>
        <p style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1, textTransform: "capitalize" }}>
          {todayLabel()}
        </p>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div style={{ background: "#fff", border: "1px solid #d8d0c4", borderRadius: 4, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1 }}>PROGRESSION DU JOUR</span>
            <span style={{ ...mono, fontSize: 13, color: pct === 100 ? "#2c7a4b" : "#1a1a1a", fontWeight: 700 }}>{done}/{total}</span>
          </div>
          <div style={{ height: 5, background: "#d8d0c4", borderRadius: 0 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#2c7a4b" : "#c0392b", transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {/* Habits list */}
      <div style={{ marginBottom: 24 }}>
        {loading ? (
          <p style={{ ...mono, fontSize: 11, color: "#7a7268" }}>Chargement…</p>
        ) : habits.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #d8d0c4", borderRadius: 4, padding: 32, textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>🌱</p>
            <p style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1 }}>AUCUNE HABITUDE DÉFINIE</p>
            <p style={{ fontSize: 13, color: "#7a7268", marginTop: 4 }}>Ajoute ta première habitude ci-dessous.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {habits.map(habit => {
              const isDone = checked.has(habit.id);
              return (
                <div
                  key={habit.id}
                  style={{
                    background: "#fff",
                    border: `1px solid ${isDone ? "#2c7a4b" : "#d8d0c4"}`,
                    borderLeft: `4px solid ${isDone ? "#2c7a4b" : "#d8d0c4"}`,
                    borderRadius: 4,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onClick={() => toggle(habit.id)}
                >
                  <span style={{ fontSize: 22 }}>{habit.emoji}</span>
                  <span style={{
                    flex: 1,
                    fontSize: 14,
                    color: isDone ? "#7a7268" : "#1a1a1a",
                    textDecoration: isDone ? "line-through" : "none",
                    fontWeight: isDone ? 400 : 500,
                  }}>
                    {habit.name}
                  </span>
                  <div style={{
                    width: 22, height: 22,
                    border: `2px solid ${isDone ? "#2c7a4b" : "#d8d0c4"}`,
                    borderRadius: 3,
                    background: isDone ? "#2c7a4b" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {isDone && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteHabit(habit.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#d8d0c4", padding: 4, lineHeight: 1, fontSize: 16 }}
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add habit */}
      {showForm ? (
        <form onSubmit={addHabit} style={{ background: "#fff", border: "1px solid #d8d0c4", borderRadius: 4, padding: 20 }}>
          <p style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1, marginBottom: 12 }}>NOUVELLE HABITUDE</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Ex: Boire 2L d'eau"
              required
              style={{ flex: 1, border: "1px solid #d8d0c4", borderRadius: 3, padding: "10px 12px", fontSize: 13, background: "#f5f0e8", color: "#1a1a1a", outline: "none" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ ...mono, fontSize: 10, color: "#7a7268", letterSpacing: 1, marginBottom: 8 }}>EMOJI</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EMOJI_OPTIONS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setNewEmoji(em)}
                  style={{
                    fontSize: 20, padding: "4px 6px", borderRadius: 4,
                    border: `2px solid ${newEmoji === em ? "#1a1a1a" : "#d8d0c4"}`,
                    background: newEmoji === em ? "#ede8df" : "transparent",
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
              style={{ ...mono, fontSize: 11, background: "#1a1a1a", color: "#f5f0e8", padding: "10px 20px", borderRadius: 3, border: "none", cursor: "pointer", letterSpacing: 1 }}
            >
              {saving ? "…" : "AJOUTER"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ ...mono, fontSize: 11, background: "transparent", color: "#7a7268", padding: "10px 20px", borderRadius: 3, border: "1px solid #d8d0c4", cursor: "pointer", letterSpacing: 1 }}
            >
              ANNULER
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{ ...mono, fontSize: 11, background: "transparent", color: "#1a1a1a", padding: "12px 20px", borderRadius: 3, border: "1px solid #1a1a1a", cursor: "pointer", letterSpacing: 1, width: "100%" }}
        >
          + AJOUTER UNE HABITUDE
        </button>
      )}
    </div>
  );
}
