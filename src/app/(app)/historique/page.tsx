"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

type Range = 7 | 30 | 365;
const RANGES: { value: Range; label: string }[] = [
  { value: 7,   label: "1 sem" },
  { value: 30,  label: "1 mois" },
  { value: 365, label: "1 an" },
];

type WeightLog = { date: string; weight: number };
type HabitLogsData = { byDate: Record<string, number>; totalHabits: number };
type ExercisePoint = { date: string; weightKg: number | null; reps: string | null; sets: number | null };
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

function Section({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      borderLeft: `4px solid ${accentColor}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: "20px",
      marginBottom: 14,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", textTransform: "uppercase", marginBottom: 16 }}>{title}</p>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label, unit }: { active?: boolean; payload?: { value: number }[]; label?: string; unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "8px 12px", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{payload[0].value}{unit}</p>
    </div>
  );
}

function RangeBar({ range, onChange }: { range: Range; onChange: (r: Range) => void }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "#F3F4F6", borderRadius: 10, padding: 4 }}>
      {RANGES.map(r => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          style={{
            fontSize: 12, fontWeight: 600,
            padding: "6px 14px", borderRadius: 8,
            border: "none",
            background: range === r.value ? "#FF6500" : "transparent",
            color: range === r.value ? "#fff" : "#6B7280",
            cursor: "pointer",
            transition: "all 0.2s",
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
  const [exerciseNames, setExerciseNames] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [exercisePoints, setExercisePoints] = useState<ExercisePoint[]>([]);

  const loadAll = useCallback(async (days: number) => {
    setLoading(true);
    const [w, h, s, names] = await Promise.all([
      fetch(`/api/weight?days=${days}`).then(r => r.json()),
      fetch(`/api/habits/logs?days=${days}`).then(r => r.json()),
      fetch(`/api/stats/sessions?days=${days}`).then(r => r.json()),
      fetch("/api/workout-logs/exercise-history", { method: "POST" }).then(r => r.json()),
    ]);
    setWeightLogs(w);
    setHabitData(h);
    setSessionsData(s);
    setExerciseNames(Array.isArray(names) ? names : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(range); }, [range, loadAll]);

  useEffect(() => {
    if (!selectedExercise) { setExercisePoints([]); return; }
    fetch(`/api/workout-logs/exercise-history?name=${encodeURIComponent(selectedExercise)}`)
      .then(r => r.json())
      .then(data => setExercisePoints(Array.isArray(data) ? data : []));
  }, [selectedExercise]);

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
  const rangeLabel = range === 7 ? "7 derniers jours" : range === 30 ? "30 derniers jours" : "12 derniers mois";
  const groupLabel = isYearly ? "/ semaine" : "/ jour";

  const habitChartData = habitData
    ? (isYearly ? buildWeeklyPoints(habitData.byDate, range, "habitudes") : buildDailyPoints(habitData.byDate, range, "habitudes"))
    : [];
  const sessionsChartData = sessionsData
    ? (isYearly ? buildWeeklyPoints(sessionsData.byDate, range, "séances") : buildDailyPoints(sessionsData.byDate, range, "séances"))
    : [];
  const weightChartData = weightLogs.map(l => ({ date: fmtDay(l.date), poids: l.weight }));

  const axisTick = { fontSize: 10, fill: "#9CA3AF" };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 4, letterSpacing: 0.5 }}>Historique</h1>
          <p style={{ fontSize: 13, color: "#6B7280" }}>{rangeLabel}</p>
        </div>
        <RangeBar range={range} onChange={setRange} />
      </div>

      {loading ? (
        <p style={{ fontSize: 13, color: "#6B7280" }}>Chargement…</p>
      ) : (
        <>
          {/* Poids */}
          <Section title="Évolution du poids (kg)" accentColor="#3B82F6">
            {weightChartData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={axisTick} interval={xInterval} />
                  <YAxis domain={["auto", "auto"]} tick={axisTick} />
                  <Tooltip content={<CustomTooltip unit=" kg" />} />
                  <Line type="monotone" dataKey="poids" stroke="#3B82F6" strokeWidth={2} dot={range === 365 ? false : { r: 3, fill: "#3B82F6" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#6B7280" }}>Pas encore assez de données. Enregistre ton poids régulièrement.</p>
            )}
            <form onSubmit={logWeight} style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <input
                type="number" step="0.1" min="20" max="300"
                value={newWeight} onChange={e => setNewWeight(e.target.value)}
                placeholder="Ex: 75.5"
                style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 10, padding: "10px 14px", fontSize: 14, background: "#F9FAFB", color: "#111827", outline: "none" }}
              />
              <button type="submit" disabled={saving}
                style={{ fontSize: 13, fontWeight: 700, background: "#3B82F6", color: "#fff", padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "…" : "Ajouter"}
              </button>
            </form>
          </Section>

          {/* Habitudes */}
          <Section title={`Habitudes complétées ${groupLabel}`} accentColor="#22C55E">
            {habitChartData.some(d => (d as Record<string, number>)["habitudes"] > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={habitChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={axisTick} interval={xInterval} />
                  <YAxis allowDecimals={false} tick={axisTick} />
                  <Tooltip content={<CustomTooltip unit=" habitude(s)" />} />
                  <Bar dataKey="habitudes" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#6B7280" }}>Aucune habitude cochée sur cette période.</p>
            )}
          </Section>

          {/* Séances */}
          <Section title={`Séances effectuées ${groupLabel}`} accentColor="#FF6500">
            {sessionsChartData.some(d => (d as Record<string, number>)["séances"] > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={axisTick} interval={xInterval} />
                  <YAxis allowDecimals={false} tick={axisTick} />
                  <Tooltip content={<CustomTooltip unit=" séance(s)" />} />
                  <Bar dataKey="séances" fill="#FF6500" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ fontSize: 13, color: "#6B7280" }}>Aucune séance effectuée sur cette période.</p>
            )}
          </Section>

          {/* Progression par exercice */}
          <Section title="Progression par exercice" accentColor="#F59E0B">
            {exerciseNames.length === 0 ? (
              <p style={{ fontSize: 13, color: "#6B7280" }}>
                Valide des séances dans le Carnet pour suivre ta progression.
              </p>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>Choisir un exercice</p>
                  <select
                    value={selectedExercise}
                    onChange={e => setSelectedExercise(e.target.value)}
                    style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 10, padding: "10px 14px", fontSize: 14, background: "#F9FAFB", color: "#111827", outline: "none", fontFamily: "inherit" }}
                  >
                    <option value="">-- Sélectionner --</option>
                    {exerciseNames.map(name => <option key={name} value={name}>{name}</option>)}
                  </select>
                </div>
                {selectedExercise && exercisePoints.length >= 2 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={exercisePoints.map(p => ({
                      date: new Date(p.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
                      kg: p.weightKg ?? 0,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={axisTick} />
                      <YAxis domain={["auto", "auto"]} tick={axisTick} />
                      <Tooltip content={<CustomTooltip unit=" kg" />} />
                      <Line type="monotone" dataKey="kg" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4, fill: "#F59E0B" }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : selectedExercise ? (
                  <p style={{ fontSize: 13, color: "#6B7280" }}>Pas encore assez de données (minimum 2 séances).</p>
                ) : null}
              </>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
