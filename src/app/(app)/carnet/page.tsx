"use client";

import { useEffect, useState } from "react";
import SportTabs from "@/components/sport-tabs";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

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
  STRENGTH: "#1a3a5c", CARDIO: "#f39c12", HIIT: "#c0392b",
  YOGA_STRETCH: "#7a7268", FULL_BODY: "#2c7a4b", REST: "#d8d0c4",
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

  // Grouper par mois
  const grouped: { month: string; entries: WorkoutLog[] }[] = [];
  for (const log of logs) {
    const month = fmtMonth(log.date);
    const last = grouped[grouped.length - 1];
    if (last && last.month === month) last.entries.push(log);
    else grouped.push({ month, entries: [log] });
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <SportTabs />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ ...display, fontSize: 36, letterSpacing: 2, color: "#1a1a1a", marginBottom: 4 }}>CARNET</h1>
        <p style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1 }}>
          {total} SÉANCE{total !== 1 ? "S" : ""} ENREGISTRÉE{total !== 1 ? "S" : ""}
        </p>
      </div>

      {loading ? (
        <p style={{ ...mono, fontSize: 11, color: "#7a7268" }}>Chargement…</p>
      ) : logs.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #d8d0c4", borderRadius: 4, padding: 32, textAlign: "center" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📖</p>
          <p style={{ ...mono, fontSize: 11, color: "#7a7268", letterSpacing: 1 }}>CARNET VIDE</p>
          <p style={{ fontSize: 13, color: "#7a7268", marginTop: 4 }}>
            Valide une séance dans Planning pour commencer ton carnet.
          </p>
        </div>
      ) : (
        <>
          {grouped.map(({ month, entries }) => (
            <div key={month} style={{ marginBottom: 28 }}>
              {/* Titre du mois */}
              <p style={{ ...mono, fontSize: 10, letterSpacing: 2, color: "#7a7268", marginBottom: 12, textTransform: "uppercase" }}>
                {month}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {entries.map(log => {
                  const isOpen = expanded.has(log.id);
                  const border = SESSION_BORDER[log.sessionType] ?? "#d8d0c4";
                  return (
                    <div key={log.id}
                      style={{ background: "#fff", border: "1px solid #d8d0c4", borderLeft: `4px solid ${border}`, borderRadius: 4, overflow: "hidden" }}>

                      {/* En-tête cliquable */}
                      <button onClick={() => toggleExpand(log.id)}
                        style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", width: "100%", boxSizing: "border-box" }}>
                        <span style={{ fontSize: 20 }}>{log.sessionIcon ?? "🏋️"}</span>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <p style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{log.sessionName}</p>
                          <p style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 1, marginTop: 2, textTransform: "capitalize" }}>
                            {fmtDate(log.date)}{log.durationMin ? ` · ${log.durationMin} min` : ""}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {log.exercises.length > 0 && (
                            <span style={{ ...mono, fontSize: 9, color: "#7a7268", letterSpacing: 1 }}>
                              {log.exercises.length} exo{log.exercises.length > 1 ? "s" : ""}
                            </span>
                          )}
                          <span style={{ color: "#7a7268", fontSize: 14, transition: "transform 0.2s", display: "block", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                        </div>
                      </button>

                      {/* Détail expandable */}
                      {isOpen && (
                        <div style={{ borderTop: "1px solid #ede8df", padding: "12px 16px" }}>
                          {log.exercises.length > 0 && (
                            <div style={{ marginBottom: log.notes ? 12 : 0 }}>
                              {log.exercises.map((ex, i) => (
                                <div key={ex.id} style={{
                                  display: "flex", justifyContent: "space-between", alignItems: "center",
                                  padding: "6px 0",
                                  borderBottom: i < log.exercises.length - 1 ? "1px solid #f5f0e8" : "none",
                                }}>
                                  <span style={{ fontSize: 13, fontWeight: 500 }}>{ex.name}</span>
                                  <span style={{ ...mono, fontSize: 11, color: "#7a7268" }}>
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
                            <p style={{ fontSize: 13, color: "#7a7268", fontStyle: "italic", lineHeight: 1.6, marginTop: 8 }}>
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
            <button onClick={() => loadLogs(logs.length)}
              style={{ ...mono, fontSize: 10, letterSpacing: 1, padding: "12px 20px", borderRadius: 4, border: "1px solid #d8d0c4", background: "transparent", color: "#7a7268", cursor: "pointer", width: "100%", marginTop: 8 }}>
              CHARGER PLUS ({total - logs.length} restantes)
            </button>
          )}
        </>
      )}
    </div>
  );
}
