"use client";

import { useEffect, useState } from "react";

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

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

const SESSION_BORDER: Record<string, string> = {
  STRENGTH: "#1E3A8A", CARDIO: "#FF6500", HIIT: "#EF4444",
  YOGA_STRETCH: "#6B7280", FULL_BODY: "#22C55E", REST: "#E5E7EB",
};

const SESSION_ICONS: Record<string, string> = {
  STRENGTH: "🏋️", CARDIO: "🏃", HIIT: "🔥",
  YOGA_STRETCH: "🧘", FULL_BODY: "💪", REST: "🛌",
};

export default function CarnetPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  async function loadLogs(offset = 0) {
    const res = await fetch(`/api/workout-logs?limit=20&offset=${offset}`);
    if (!res.ok) return;
    const data = await res.json();
    setLogs(prev => offset === 0 ? data.logs : [...prev, ...data.logs]);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => { loadLogs(); }, []);

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const grouped: { month: string; entries: WorkoutLog[] }[] = [];
  for (const log of logs) {
    const month = fmtMonth(log.date);
    const last = grouped[grouped.length - 1];
    if (last && last.month === month) last.entries.push(log);
    else grouped.push({ month, entries: [log] });
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 4, letterSpacing: 0.5 }}>Carnet</h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          {total} séance{total !== 1 ? "s" : ""} enregistrée{total !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <p style={{ fontSize: 13, color: "#6B7280" }}>Chargement…</p>
      ) : logs.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📖</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}>Carnet vide</p>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
            Valide une séance dans Sport pour commencer ton carnet.
          </p>
        </div>
      ) : (
        <>
          {grouped.map(({ month, entries }) => (
            <div key={month} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", textTransform: "uppercase", marginBottom: 10 }}>
                {month}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {entries.map(log => {
                  const isOpen = expanded.has(log.id);
                  const borderColor = SESSION_BORDER[log.sessionType] ?? "#E5E7EB";
                  const icon = log.sessionIcon ?? SESSION_ICONS[log.sessionType] ?? "🏋️";
                  return (
                    <div key={log.id} style={{
                      background: "#fff",
                      borderRadius: 16,
                      borderLeft: `4px solid ${borderColor}`,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      overflow: "hidden",
                    }}>
                      <button
                        onClick={() => toggleExpand(log.id)}
                        style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", width: "100%", boxSizing: "border-box" }}
                      >
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <p style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{log.sessionName}</p>
                          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2, textTransform: "capitalize" }}>
                            {fmtDate(log.date)}{log.durationMin ? ` · ${log.durationMin} min` : ""}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {log.exercises.length > 0 && (
                            <span style={{ fontSize: 12, fontWeight: 600, background: "#F3F4F6", color: "#6B7280", padding: "3px 8px", borderRadius: 6 }}>
                              {log.exercises.length} exo{log.exercises.length > 1 ? "s" : ""}
                            </span>
                          )}
                          <span style={{ color: "#9CA3AF", fontSize: 14, transition: "transform 0.2s", display: "block", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                        </div>
                      </button>

                      {isOpen && (
                        <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px 16px", background: "#F9FAFB" }}>
                          {log.exercises.length > 0 && (
                            <div style={{ marginBottom: log.notes ? 12 : 0 }}>
                              {log.exercises.map((ex, i) => (
                                <div key={ex.id} style={{
                                  display: "flex", justifyContent: "space-between", alignItems: "center",
                                  padding: "7px 0",
                                  borderBottom: i < log.exercises.length - 1 ? "1px solid #E5E7EB" : "none",
                                }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D1D5DB", display: "inline-block", flexShrink: 0 }} />
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{ex.name}</span>
                                  </div>
                                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                                    {[
                                      ex.sets && ex.reps ? `${ex.sets}×${ex.reps}` : ex.sets ? `${ex.sets} sér.` : ex.reps ?? null,
                                      ex.weightKg ? `${ex.weightKg}kg` : null,
                                      ex.restSec ? `${ex.restSec}s` : null,
                                    ].filter(Boolean).join(" · ")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          {log.notes && (
                            <p style={{ fontSize: 13, color: "#6B7280", fontStyle: "italic", lineHeight: 1.6, marginTop: 8 }}>
                              &ldquo;{log.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {logs.length < total && (
            <button
              onClick={() => loadLogs(logs.length)}
              style={{ fontSize: 13, fontWeight: 600, padding: "14px 20px", borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#fff", color: "#6B7280", cursor: "pointer", width: "100%", marginTop: 4 }}
            >
              Charger plus ({total - logs.length} restantes)
            </button>
          )}
        </>
      )}
    </div>
  );
}
