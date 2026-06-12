"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditSessionSheet, { type SessionType } from "@/components/edit-session-sheet";
import LogSessionModal from "@/components/log-session-modal";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };

const SESSION_ICONS: Record<string, string> = {
  STRENGTH: "🏋️", CARDIO: "🏃", HIIT: "🔥",
  YOGA_STRETCH: "🧘", FULL_BODY: "💪", REST: "🛌",
};
const SESSION_LABELS: Record<string, string> = {
  STRENGTH: "FORCE", CARDIO: "CARDIO", HIIT: "HIIT",
  YOGA_STRETCH: "YOGA", FULL_BODY: "FULL BODY", REST: "REPOS",
};
const BADGE: Record<string, { bg: string; fg: string }> = {
  STRENGTH:     { bg: "#1E3A8A", fg: "#fff" },
  CARDIO:       { bg: "#FF6500", fg: "#fff" },
  HIIT:         { bg: "#EF4444", fg: "#fff" },
  YOGA_STRETCH: { bg: "#6B7280", fg: "#fff" },
  FULL_BODY:    { bg: "#22C55E", fg: "#fff" },
  REST:         { bg: "#E5E7EB", fg: "#6B7280" },
};
const BORDER: Record<string, string> = {
  STRENGTH: "#1E3A8A", CARDIO: "#FF6500", HIIT: "#EF4444",
  YOGA_STRETCH: "#6B7280", FULL_BODY: "#22C55E", REST: "#E5E7EB",
};

type Exercise = {
  id: string; name: string; sets?: number | null; reps?: string | null;
  restSec?: number | null; weightKg?: number | null; order: number;
};

type Props = {
  session: {
    id: string; name: string; type: string; icon: string | null;
    notes: string | null; dayOfWeek: number; durationMin: number;
    completed: boolean; exercises: Exercise[];
  };
  isToday: boolean;
  todayIndex: number;
  dayLabel: string;
  fullDayLabel: string;
};

function ExerciseRows({ exercises }: { exercises: Exercise[] }) {
  return (
    <>
      {exercises.map((ex) => (
        <div key={ex.id} className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D1D5DB", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>{ex.name}</span>
          </div>
          <span style={{ ...mono, fontSize: "11px", color: "#6B7280", whiteSpace: "nowrap", marginLeft: 8 }}>
            {ex.sets && ex.reps ? `${ex.sets}×${ex.reps}` : ex.sets ? `${ex.sets} séries` : ex.reps ?? ""}
            {ex.weightKg ? <span style={{ color: "#FF6500", marginLeft: 5 }}>{ex.weightKg}kg</span> : null}
            {ex.restSec ? <span style={{ marginLeft: 5 }}>{ex.restSec}s</span> : null}
          </span>
        </div>
      ))}
    </>
  );
}

export default function SessionCard({ session: s, isToday, todayIndex, dayLabel, fullDayLabel }: Props) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [isDone, setIsDone] = useState(s.completed);
  const [undoing, setUndoing] = useState(false);
  useEffect(() => { setIsDone(s.completed); }, [s.completed]);

  const badge = BADGE[s.type] ?? BADGE.REST;
  const borderColor = BORDER[s.type] ?? "#E5E7EB";
  const sessionIcon = s.icon ?? SESSION_ICONS[s.type] ?? "🏃";
  const isFuture = s.dayOfWeek > todayIndex;

  async function handleUndo() {
    setUndoing(true);
    const res = await fetch(`/api/sessions/${s.id}/complete`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setIsDone(data.completed);
      router.refresh();
    }
    setUndoing(false);
  }

  const cardBase: React.CSSProperties = {
    background: "#fff",
    borderRadius: "16px",
    borderLeft: `4px solid ${borderColor}`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  };

  function Badges() {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ ...mono, fontSize: "10px", background: badge.bg, color: badge.fg, padding: "3px 8px", borderRadius: "4px" }}>
          {SESSION_LABELS[s.type]}
        </span>
        {s.type !== "REST" && (
          <span style={{ ...mono, fontSize: "10px", background: "#F3F4F6", color: "#6B7280", padding: "3px 8px", borderRadius: "4px" }}>
            {s.durationMin} min
          </span>
        )}
        {isDone && (
          <span style={{ ...mono, fontSize: "10px", background: "#22C55E", color: "#fff", padding: "3px 8px", borderRadius: "4px" }}>
            ✓ FAIT
          </span>
        )}
      </div>
    );
  }

  function ActionRow() {
    if (s.type === "REST") {
      return (
        <button onClick={() => setEditOpen(true)} style={outlineBtn}>
          ✏️ MODIFIER
        </button>
      );
    }
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setEditOpen(true)} style={outlineBtn}>✏️ MODIFIER</button>
        <button onClick={() => setDetailOpen(true)} style={outlineBtn}>👁 DÉTAILS</button>
        <div style={{ marginLeft: "auto" }}>
          {isFuture && !isDone ? (
            <span style={{ ...mono, fontSize: "10px", color: "#D1D5DB", padding: "7px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", display: "inline-block" }}>
              DÉMARRER
            </span>
          ) : isDone ? (
            <button onClick={handleUndo} disabled={undoing} style={{ ...mono, fontSize: "10px", padding: "7px 12px", borderRadius: "8px", border: "1px solid #6B7280", background: "transparent", color: "#6B7280", cursor: "pointer", opacity: undoing ? 0.5 : 1 }}>
              {undoing ? "…" : "↩ ANNULER"}
            </button>
          ) : (
            <button onClick={() => setLogOpen(true)} style={{ ...mono, fontSize: "10px", padding: "7px 14px", borderRadius: "8px", border: "none", background: "#22C55E", color: "#fff", cursor: "pointer", letterSpacing: "0.5px" }}>
              ▶ DÉMARRER
            </button>
          )}
        </div>
      </div>
    );
  }

  const outlineBtn: React.CSSProperties = {
    ...mono, fontSize: "10px", letterSpacing: "1px",
    padding: "7px 14px", borderRadius: "8px",
    border: "1px solid #E5E7EB", background: "transparent",
    color: "#6B7280", cursor: "pointer",
  };

  return (
    <>
      {/* ── Desktop: expanded card ── */}
      <div className="hidden md:block" style={cardBase}>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ ...mono, fontSize: "11px", color: isToday ? "#111827" : "#6B7280", fontWeight: isToday ? 700 : 400, minWidth: 28 }}>
                {dayLabel}{isToday && <span style={{ color: "#EF4444" }}> ●</span>}
              </span>
              <span style={{ fontSize: "20px" }}>{sessionIcon}</span>
              <span style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>{s.name}</span>
            </div>
            <Badges />
          </div>

          {s.type !== "REST" && s.exercises.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
              <ExerciseRows exercises={s.exercises} />
            </div>
          )}

          {s.notes && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
              <p style={{ ...mono, fontSize: "9px", color: "#6B7280", letterSpacing: 1, marginBottom: 4 }}>📝 NOTES</p>
              <p style={{ fontSize: "13px", color: "#111827", lineHeight: 1.7, whiteSpace: "pre-line" }}>{s.notes}</p>
            </div>
          )}

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
            <ActionRow />
          </div>
        </div>
      </div>

      {/* ── Mobile: compact row ── */}
      <div
        className="md:hidden"
        style={{ ...cardBase, cursor: "pointer" }}
        onClick={() => setDetailOpen(true)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px" }}>
          <span style={{ ...mono, fontSize: "11px", color: isToday ? "#111827" : "#6B7280", fontWeight: isToday ? 700 : 400, minWidth: 28, flexShrink: 0 }}>
            {dayLabel}{isToday && <span style={{ color: "#EF4444" }}> ●</span>}
          </span>
          <span style={{ fontSize: "18px", flexShrink: 0 }}>{sessionIcon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: "13px", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3 }}>
              {s.name}
            </p>
            <Badges />
          </div>
          <span style={{ color: "#9CA3AF", fontSize: "18px", flexShrink: 0 }}>›</span>
        </div>
      </div>

      {/* ── Detail sheet (mobile + desktop DÉTAILS) ── */}
      {detailOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={() => setDetailOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90dvh",
              overflowY: "auto",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 12px", position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #E5E7EB", zIndex: 1 }}>
              <button
                onClick={() => setDetailOpen(false)}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "#F3F4F6", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ←
              </button>
              <span style={{ fontWeight: 700, letterSpacing: "2px", fontSize: "13px", color: "#111827" }}>{fullDayLabel}</span>
              <button
                onClick={() => { setDetailOpen(false); setEditOpen(true); }}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: "#F3F4F6", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ···
              </button>
            </div>

            <div style={{ padding: "16px" }}>
              {/* Session summary card */}
              <div style={{ background: "#F9FAFB", borderRadius: "14px", padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: "24px" }}>{sessionIcon}</span>
                  <span style={{ fontWeight: 700, fontSize: "16px", color: "#111827" }}>{s.name}</span>
                </div>
                <Badges />
              </div>

              {/* Exercises */}
              {s.type !== "REST" && s.exercises.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ ...mono, fontSize: "10px", color: "#6B7280", letterSpacing: "1px", marginBottom: 8 }}>EXERCICES</p>
                  <div style={{ background: "#F9FAFB", borderRadius: "14px", padding: "12px 16px" }}>
                    <ExerciseRows exercises={s.exercises} />
                  </div>
                </div>
              )}

              {/* Notes */}
              {s.type !== "REST" && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <p style={{ ...mono, fontSize: "10px", color: "#6B7280", letterSpacing: "1px" }}>NOTES</p>
                    <button
                      onClick={() => { setDetailOpen(false); setEditOpen(true); }}
                      style={{ border: "none", background: "none", cursor: "pointer", color: "#6B7280", fontSize: "15px", padding: 4 }}
                    >
                      ✏️
                    </button>
                  </div>
                  <div style={{ background: "#F9FAFB", borderRadius: "14px", padding: "12px 16px" }}>
                    <p style={{ fontSize: "13px", color: s.notes ? "#111827" : "#9CA3AF", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                      {s.notes || "Ajouter une note..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { setDetailOpen(false); setEditOpen(true); }}
                  style={{
                    flex: 1, padding: "13px 8px", borderRadius: "12px",
                    border: "1.5px solid #E5E7EB", background: "transparent",
                    color: "#FF6500", fontWeight: 600, fontSize: "13px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  ✏️ MODIFIER
                </button>
                {s.type !== "REST" && (
                  isDone ? (
                    <button
                      onClick={() => { setDetailOpen(false); handleUndo(); }}
                      disabled={undoing}
                      style={{
                        flex: 1, padding: "13px 8px", borderRadius: "12px",
                        border: "1.5px solid #6B7280", background: "transparent",
                        color: "#6B7280", fontWeight: 600, fontSize: "13px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        opacity: undoing ? 0.5 : 1,
                      }}
                    >
                      {undoing ? "…" : "↩ ANNULER"}
                    </button>
                  ) : (
                    <button
                      onClick={() => { setDetailOpen(false); if (!isFuture) setLogOpen(true); }}
                      disabled={isFuture}
                      style={{
                        flex: 1, padding: "13px 8px", borderRadius: "12px",
                        border: "none", background: isFuture ? "#E5E7EB" : "#22C55E",
                        color: isFuture ? "#9CA3AF" : "#fff",
                        fontWeight: 600, fontSize: "13px",
                        cursor: isFuture ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      ▶ DÉMARRER
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <EditSessionSheet
          sessionId={s.id}
          currentName={s.name}
          currentType={s.type as SessionType}
          currentIcon={s.icon}
          currentNotes={s.notes}
          currentDuration={s.durationMin}
          currentExercises={s.exercises.map(e => ({ name: e.name, sets: e.sets, reps: e.reps, restSec: e.restSec, weightKg: e.weightKg }))}
          onClose={() => setEditOpen(false)}
        />
      )}

      {logOpen && (
        <LogSessionModal
          sessionId={s.id}
          sessionName={s.name}
          sessionType={s.type}
          sessionIcon={s.icon}
          durationMin={s.durationMin}
          exercises={s.exercises}
          onClose={() => { setLogOpen(false); router.refresh(); }}
        />
      )}
    </>
  );
}
