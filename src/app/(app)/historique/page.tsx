"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

type WeightLog = { id: string; date: string; weight: number };
type HabitLogsData = { byDate: Record<string, number>; totalHabits: number };
type WorkoutSession = { completedAt: string | null; completed: boolean };

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #d8d0c4", borderLeft: `4px solid ${color}`, borderRadius: 4, padding: "20px 24px", marginBottom: 20 }}>
      <p style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1, marginBottom: 16 }}>{title}</p>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label, unit }: { active?: boolean; payload?: { value: number }[]; label?: string; unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #d8d0c4", padding: "8px 12px", borderRadius: 3 }}>
      <p style={{ ...mono, fontSize: 10, color: "#7a7268" }}>{label}</p>
      <p style={{ ...mono, fontSize: 12, color: "#1a1a1a", fontWeight: 700 }}>{payload[0].value}{unit}</p>
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function HistoriquePage() {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [habitData, setHabitData] = useState<HabitLogsData | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    const [w, h, s] = await Promise.all([
      fetch("/api/weight").then(r => r.json()),
      fetch("/api/habits/logs?days=30").then(r => r.json()),
      fetch("/api/stats/sessions").then(r => r.json()),
    ]);
    setWeightLogs(w);
    setHabitData(h);
    setSessions(s);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function logWeight(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (isNaN(val)) return;
    setSaving(true);
    const res = await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight: val }),
    });
    setSaving(false);
    if (res.ok) {
      setNewWeight("");
      loadAll();
    }
  }

  // Build 30-day habit chart data
  const habitChartData = (() => {
    if (!habitData) return [];
    const result = [];
    const total = habitData.totalHabits;
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      result.push({
        date: fmtDate(key),
        habitudes: habitData.byDate[key] ?? 0,
        total,
      });
    }
    return result;
  })();

  // Build weekly sessions chart (last 8 weeks)
  const sessionsChartData = (() => {
    const weeks: Record<string, number> = {};
    for (const s of sessions) {
      if (!s.completed || !s.completedAt) continue;
      const d = new Date(s.completedAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toISOString().split("T")[0];
      weeks[key] = (weeks[key] ?? 0) + 1;
    }
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([date, séances]) => ({ date: fmtDate(date), séances }));
  })();

  const weightChartData = weightLogs.map(l => ({
    date: fmtDate(l.date),
    poids: l.weight,
  }));

  return (
    <div style={{ padding: "24px 16px", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ ...display, fontSize: 36, letterSpacing: 2, color: "#1a1a1a", marginBottom: 4 }}>
          HISTORIQUE
        </h1>
        <p style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1 }}>
          ÉVOLUTION SUR 30 JOURS
        </p>
      </div>

      {loading ? (
        <p style={{ ...mono, fontSize: 11, color: "#7a7268" }}>Chargement…</p>
      ) : (
        <>
          {/* Weight */}
          <Section title="ÉVOLUTION DU POIDS (kg)" color="#1a3a5c">
            {weightChartData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede8df" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} />
                  <Tooltip content={<CustomTooltip unit=" kg" />} />
                  <Line type="monotone" dataKey="poids" stroke="#1a3a5c" strokeWidth={2} dot={{ r: 3, fill: "#1a3a5c" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#7a7268" }}>Pas encore assez de données. Enregistre ton poids chaque jour.</p>
            )}

            <form onSubmit={logWeight} style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <input
                type="number"
                step="0.1"
                min="20"
                max="300"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                placeholder="Ex: 75.5"
                style={{ flex: 1, border: "1px solid #d8d0c4", borderRadius: 3, padding: "8px 12px", fontSize: 13, background: "#f5f0e8", color: "#1a1a1a", outline: "none" }}
              />
              <button
                type="submit"
                disabled={saving}
                style={{ ...mono, fontSize: 10, background: "#1a3a5c", color: "#fff", padding: "8px 16px", borderRadius: 3, border: "none", cursor: "pointer", letterSpacing: 1 }}
              >
                {saving ? "…" : "AJOUTER"}
              </button>
            </form>
          </Section>

          {/* Habits */}
          <Section title="HABITUDES COMPLÉTÉES / JOUR (30 derniers jours)" color="#2c7a4b">
            {habitChartData.some(d => d.habitudes > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={habitChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede8df" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} interval={6} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} />
                  <Tooltip content={<CustomTooltip unit=" habitude(s)" />} />
                  <Bar dataKey="habitudes" fill="#2c7a4b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#7a7268" }}>Aucune habitude cochée ces 30 derniers jours.</p>
            )}
          </Section>

          {/* Sessions */}
          <Section title="SÉANCES EFFECTUÉES / SEMAINE" color="#c0392b">
            {sessionsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede8df" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} />
                  <Tooltip content={<CustomTooltip unit=" séance(s)" />} />
                  <Bar dataKey="séances" fill="#c0392b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#7a7268" }}>Aucune séance effectuée enregistrée.</p>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
