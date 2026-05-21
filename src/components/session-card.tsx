"use client";

import { useState } from "react";
import CompleteSessionButton from "@/components/complete-session-button";
import EditSessionSheet, { type SessionType } from "@/components/edit-session-sheet";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };

const SESSION_ICONS: Record<string, string> = {
  STRENGTH: "🏋️", CARDIO: "🏃", HIIT: "🔥",
  YOGA_STRETCH: "🧘", FULL_BODY: "💪", REST: "🛌",
};
const SESSION_LABELS: Record<string, string> = {
  STRENGTH: "FORCE", CARDIO: "CARDIO", HIIT: "HIIT",
  YOGA_STRETCH: "YOGA", FULL_BODY: "FULL BODY", REST: "REPOS",
};
const SESSION_BADGE_COLORS: Record<string, { bg: string; fg: string }> = {
  STRENGTH:     { bg: "#1a3a5c", fg: "#ffffff" },
  CARDIO:       { bg: "#f39c12", fg: "#ffffff" },
  HIIT:         { bg: "#c0392b", fg: "#ffffff" },
  YOGA_STRETCH: { bg: "#7a7268", fg: "#ffffff" },
  FULL_BODY:    { bg: "#2c7a4b", fg: "#ffffff" },
  REST:         { bg: "#ede8df", fg: "#7a7268"  },
};
const SESSION_BORDER: Record<string, string> = {
  STRENGTH: "#1a3a5c", CARDIO: "#f39c12", HIIT: "#c0392b",
  YOGA_STRETCH: "#7a7268", FULL_BODY: "#2c7a4b", REST: "#d8d0c4",
};

type Exercise = { id: string; name: string; sets?: number | null; reps?: string | null; restSec?: number | null; weightKg?: number | null; order: number };

type Props = {
  session: {
    id: string;
    name: string;
    type: string;
    icon: string | null;
    notes: string | null;
    dayOfWeek: number;
    durationMin: number;
    completed: boolean;
    exercises: Exercise[];
  };
  isToday: boolean;
  todayIndex: number;
  dayLabel: string;
};

export default function SessionCard({ session: s, isToday, todayIndex, dayLabel }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const badge = SESSION_BADGE_COLORS[s.type] ?? SESSION_BADGE_COLORS.REST;
  const borderColor = SESSION_BORDER[s.type] ?? "#d8d0c4";
  const sessionIcon = s.icon ?? SESSION_ICONS[s.type] ?? "🏃";

  return (
    <>
      <div
        className="rounded p-4"
        style={{
          background: "#fff",
          border: "1px solid #d8d0c4",
          borderLeft: `4px solid ${borderColor}`,
          opacity: s.completed ? 0.7 : 1,
          outline: isToday ? "2px solid #1a1a1a" : undefined,
          outlineOffset: isToday ? "2px" : undefined,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-0">
          <div className="flex items-center gap-3">
            <span style={{ ...mono, fontSize: "11px", color: isToday ? "#1a1a1a" : "#7a7268", fontWeight: isToday ? 700 : 400 }}>
              {dayLabel}
              {isToday && <span style={{ color: "#c0392b" }}> ●</span>}
            </span>
            <span style={{ fontSize: "18px" }}>{sessionIcon}</span>
            <p className="font-semibold text-sm">{s.name}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ ...mono, fontSize: "10px", background: badge.bg, color: badge.fg, padding: "4px 8px", borderRadius: "3px" }}>
              {SESSION_LABELS[s.type]}
            </span>
            {s.type !== "REST" && (
              <span style={{ ...mono, fontSize: "10px", background: "#ede8df", border: "1px solid #d8d0c4", color: "#7a7268", padding: "3px 7px", borderRadius: "3px" }}>
                {s.durationMin} min
              </span>
            )}
            {s.completed && (
              <span style={{ ...mono, fontSize: "10px", background: "#2c7a4b", color: "#fff", padding: "4px 8px", borderRadius: "3px" }}>
                ✓ FAIT
              </span>
            )}
          </div>
        </div>

        {s.type !== "REST" && s.exercises.length > 0 && (
          <div className="space-y-2 mt-3 pt-3" style={{ borderTop: "1px solid #d8d0c4" }}>
            {s.exercises.map((ex) => (
              <div key={ex.id} className="flex items-start justify-between">
                <span className="text-sm font-medium">{ex.name}</span>
                <span style={{ ...mono, fontSize: "11px", color: "#7a7268", textAlign: "right" }}>
                  {ex.sets && ex.reps ? `${ex.sets}×${ex.reps}` : ex.sets ? `${ex.sets} séries` : ex.reps ?? ""}
                  {ex.weightKg ? <span style={{ color: "#1a3a5c", marginLeft: "6px" }}>{ex.weightKg}kg</span> : null}
                  {ex.restSec ? <span style={{ marginLeft: "6px" }}>{ex.restSec}s</span> : null}
                </span>
              </div>
            ))}
          </div>
        )}

        {s.notes && (
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid #d8d0c4" }}>
            <p style={{ ...mono, fontSize: "9px", color: "#7a7268", letterSpacing: 1, marginBottom: 6 }}>📝 NOTES</p>
            <p style={{ fontSize: "13px", color: "#1a1a1a", lineHeight: 1.7, whiteSpace: "pre-line" }}>{s.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #ede8df" }}>
          {s.type !== "REST" && (
            <CompleteSessionButton sessionId={s.id} completed={s.completed} isFuture={s.dayOfWeek > todayIndex} />
          )}
          <button
            onClick={() => setEditOpen(true)}
            style={{
              ...mono, fontSize: "10px", letterSpacing: "1px",
              padding: "7px 14px", borderRadius: "3px",
              border: "1px solid #d8d0c4", background: "transparent",
              color: "#7a7268", cursor: "pointer",
            }}
          >
            ✏️ MODIFIER
          </button>
        </div>
      </div>

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
    </>
  );
}
