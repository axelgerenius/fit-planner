"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

type Range = 7 | 30 | 365;
const RANGES: { value: Range; label: string }[] = [
  { value: 7,   label: "1 SEM" },
  { value: 30,  label: "1 MOIS" },
  { value: 365, label: "1 AN" },
];

type WeightLog = { date: string; weight: number };
type HabitLogsData = { byDate: Record<string, number>; totalHabits: number };
type SessionsData = { byDate: Record<string, number> };

function fmtDay(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
function fmtWeek(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function mondayOf(d: Date): string {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().split("T")[0];
}

// Aggregate daily byDate into weekly buckets
function toWeeklyBuckets(byDate: Record<string, number>, days: number) {
  const buckets: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const week = mondayOf(d);
    buckets[week] = (buckets[week] ?? 0) + (byDate[key] ?? 0);
  }
  return buckets;
}

function buildDailyPoints(byDate: Record<string, number>, days: number, field: string) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push({ date: fmtDay(key), [field]: byDate[key] ?? 0 });
  }
  return result;
}

function buildWeeklyPoints(byDate: Record<string, number>, days: number, field: string) {
  const buckets = toWeeklyBuckets(byDate, days);
  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, val]) => ({ date: fmtWeek(week), [field]: val }));
}

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

function RangeBar({ range, onChange }: { range: Range; onChange: (r: Range) => void }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {RANGES.map(r => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          style={{
            ...mono,
            fontSize: 10,
            letterSpacing: 1,
            padding: "5px 12px",
            borderRadius: 3,
            border: "1px solid #d8d0c4",
            background: range === r.value ? "#1a1a1a" : "transparent",
            color: range === r.value ? "#f5f0e8" : "#7a7268",
            cursor: "pointer",
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export default function HistoriquePage() {
  const [range, setRange] = useState<Range>(30);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [habitData, setHabitData] = useState<HabitLogsData | null>(null);
  const [sessionsData, setSessionsData] = useState<SessionsData | null>(null);
  const [newWeight, setNewWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async (days: number) => {
    setLoading(true);
    const [w, h, s] = await Promise.all([
      fetch(`/api/weight?days=${days}`).then(r => r.json()),
      fetch(`/api/habits/logs?days=${days}`).then(r => r.json()),
      fetch(`/api/stats/sessions?days=${days}`).then(r => r.json()),
    ]);
    setWeightLogs(w);
    setHabitData(h);
    setSessionsData(s);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(range); }, [range, loadAll]);

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
    if (res.ok) { setNewWeight(""); loadAll(range); }
  }

  const isYearly = range === 365;
  const xInterval = range === 7 ? 0 : range === 30 ? 6 : 4;

  const habitChartData = habitData
    ? (isYearly
        ? buildWeeklyPoints(habitData.byDate, range, "habitudes")
        : buildDailyPoints(habitData.byDate, range, "habitudes"))
    : [];

  const sessionsChartData = sessionsData
    ? (isYearly
        ? buildWeeklyPoints(sessionsData.byDate, range, "séances")
        : buildDailyPoints(sessionsData.byDate, range, "séances"))
    : [];

  const weightChartData = weightLogs.map(l => ({
    date: fmtDay(l.date),
    poids: l.weight,
  }));

  const rangeLabel = range === 7 ? "7 DERNIERS JOURS" : range === 30 ? "30 DERNIERS JOURS" : "12 DERNIERS MOIS";
  const groupLabel = isYearly ? "/ SEMAINE" : "/ JOUR";

  return (
    <div style={{ padding: "24px 16px", maxWidth: 700, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ ...display, fontSize: 36, letterSpacing: 2, color: "#1a1a1a", marginBottom: 4 }}>
            HISTORIQUE
          </h1>
          <p style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1 }}>{rangeLabel}</p>
        </div>
        <RangeBar range={range} onChange={setRange} />
      </div>

      {loading ? (
        <p style={{ ...mono, fontSize: 11, color: "#7a7268" }}>Chargement…</p>
      ) : (
        <>
          {/* Poids */}
          <Section title="ÉVOLUTION DU POIDS (kg)" color="#1a3a5c">
            {weightChartData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede8df" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} interval={xInterval} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} />
                  <Tooltip content={<CustomTooltip unit=" kg" />} />
                  <Line type="monotone" dataKey="poids" stroke="#1a3a5c" strokeWidth={2} dot={range === 365 ? false : { r: 3, fill: "#1a3a5c" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#7a7268" }}>Pas encore assez de données. Enregistre ton poids régulièrement.</p>
            )}
            <form onSubmit={logWeight} style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <input
                type="number" step="0.1" min="20" max="300"
                value={newWeight} onChange={e => setNewWeight(e.target.value)}
                placeholder="Ex: 75.5"
                style={{ flex: 1, border: "1px solid #d8d0c4", borderRadius: 3, padding: "8px 12px", fontSize: 13, background: "#f5f0e8", color: "#1a1a1a", outline: "none" }}
              />
              <button type="submit" disabled={saving}
                style={{ ...mono, fontSize: 10, background: "#1a3a5c", color: "#fff", padding: "8px 16px", borderRadius: 3, border: "none", cursor: "pointer", letterSpacing: 1 }}>
                {saving ? "…" : "AJOUTER"}
              </button>
            </form>
          </Section>

          {/* Habitudes */}
          <Section title={`HABITUDES COMPLÉTÉES ${groupLabel}`} color="#2c7a4b">
            {habitChartData.some(d => (d as Record<string, number>)["habitudes"] > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={habitChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede8df" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} interval={xInterval} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} />
                  <Tooltip content={<CustomTooltip unit=" habitude(s)" />} />
                  <Bar dataKey="habitudes" fill="#2c7a4b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#7a7268" }}>Aucune habitude cochée sur cette période.</p>
            )}
          </Section>

          {/* Séances */}
          <Section title={`SÉANCES EFFECTUÉES ${groupLabel}`} color="#c0392b">
            {sessionsChartData.some(d => (d as Record<string, number>)["séances"] > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede8df" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} interval={xInterval} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "#7a7268" }} />
                  <Tooltip content={<CustomTooltip unit=" séance(s)" />} />
                  <Bar dataKey="séances" fill="#c0392b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#7a7268" }}>Aucune séance effectuée sur cette période.</p>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
