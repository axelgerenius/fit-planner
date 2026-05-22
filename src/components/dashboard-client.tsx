"use client";

import { useState } from "react";
import Link from "next/link";

function InfoTooltip({ text, align = "center" }: { text: string; align?: "left" | "center" | "right" }) {
  const [show, setShow] = useState(false);
  const leftVal = align === "left" ? 0 : align === "right" ? "auto" : "50%";
  const rightVal = align === "right" ? 0 : "auto";
  const transform = align === "center" ? "translateX(-50%)" : "none";

  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "help", marginLeft: 4 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        ...mono, fontSize: "9px", color: "#7a7268",
        border: "1px solid #d8d0c4", borderRadius: "50%",
        width: 13, height: 13, display: "inline-flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>?</span>
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)",
          left: leftVal, right: rightVal, transform,
          background: "#1a1a1a", color: "#f5f0e8",
          padding: "8px 10px", borderRadius: 4,
          fontSize: 11, lineHeight: 1.6,
          width: 190, zIndex: 20,
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          pointerEvents: "none",
        }}>
          {text}
          <span style={{
            position: "absolute", top: "100%",
            left: align === "center" ? "50%" : align === "left" ? 10 : "auto",
            right: align === "right" ? 10 : "auto",
            transform: align === "center" ? "translateX(-50%)" : "none",
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #1a1a1a",
            display: "block", width: 0, height: 0,
          }} />
        </div>
      )}
    </span>
  );
}

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

const DAY_NAMES_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const SESSION_ICONS: Record<string, string> = {
  STRENGTH: "🏋️", CARDIO: "🏃", HIIT: "🔥",
  YOGA_STRETCH: "🧘", FULL_BODY: "💪", REST: "🛌",
};
const SESSION_LABELS: Record<string, string> = {
  STRENGTH: "Force", CARDIO: "Cardio", HIIT: "HIIT",
  YOGA_STRETCH: "Yoga", FULL_BODY: "Full Body", REST: "Repos",
};
const SESSION_COLOR: Record<string, string> = {
  STRENGTH: "#1a3a5c", CARDIO: "#f39c12", HIIT: "#c0392b",
  YOGA_STRETCH: "#7a7268", FULL_BODY: "#2c7a4b", REST: "#d8d0c4",
};

export type DayData = {
  session?: { id: string; name: string; type: string; icon: string | null; durationMin: number; completed: boolean };
  menu?: { totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number };
  habitCount: number;
};

type Props = {
  firstName: string;
  goalLabel: string;
  todayIndex: number;
  totalHabits: number;
  streak: number;
  completedSessions: number;
  totalSessions: number;
  weeklyHabitsPct: number;
  days: DayData[];
};


export default function DashboardClient({
  firstName, goalLabel, todayIndex, totalHabits,
  streak, completedSessions, totalSessions, weeklyHabitsPct,
  days,
}: Props) {
  const [selected, setSelected] = useState(todayIndex);
  const day = days[selected];
  const s = day?.session;
  const m = day?.menu;

  return (
    <div className="space-y-3 pb-8">

      {/* BONJOUR */}
      <div className="flex items-center justify-between px-4 py-3 rounded" style={{ background: "#1a1a1a" }}>
        <h1 style={{ ...display, fontSize: "28px", letterSpacing: "2px", color: "#fff" }}>
          Bonjour {firstName}
        </h1>
        <span style={{ ...mono, fontSize: "10px", background: "#c0392b", color: "#fff", padding: "4px 10px", borderRadius: "3px" }}>
          {goalLabel}
        </span>
      </div>

      {/* BLOC SEMAINE */}
      <div className="rounded" style={{ background: "#fff", border: "1px solid #d8d0c4", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid #ede8df" }}>
          <p style={{ ...mono, fontSize: "9px", letterSpacing: "2px", color: "#7a7268" }}>PROGRAMME DE LA SEMAINE</p>
        </div>

        {/* Cercles des 7 jours */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", padding: "14px 4px 10px" }}>
          {DAY_NAMES_SHORT.map((dayLetter, i) => {
            const d = days[i];
            const isToday = i === todayIndex;
            const isSelected = i === selected;
            const isPast = i <= todayIndex;
            const sessionColor = d.session ? SESSION_COLOR[d.session.type] : "#d8d0c4";
            const sessionDone = d.session?.completed && d.session.type !== "REST";
            const hPct = totalHabits > 0 ? d.habitCount / totalHabits : 0;

            // Couleur du fond du cercle
            const bg = !isPast ? "#fff"
              : sessionDone && hPct === 1 ? "#2c7a4b"
              : sessionDone && hPct >= 0.5 ? "#3a8f5e"
              : sessionDone ? "#1a3a5c"
              : d.session?.type === "REST" && hPct === 1 ? "#2c7a4b"
              : d.session?.type === "REST" && hPct > 0 ? "#a8d5b5"
              : hPct >= 0.5 ? "#f9d48a"
              : "#ede8df";

            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{ all: "unset", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
              >
                {/* Cercle */}
                <div style={{
                  width: 40, height: 40,
                  borderRadius: "50%",
                  background: bg,
                  border: isSelected ? "2.5px solid #1a1a1a"
                    : isToday ? `2.5px solid ${sessionColor}`
                    : sessionDone ? `2px solid ${sessionColor}`
                    : "2px solid #d8d0c4",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                  transition: "all 0.15s",
                  position: "relative",
                }}>
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>
                    {d.session ? (d.session.icon ?? (d.session.type === "REST" ? "🛌" : SESSION_ICONS[d.session.type])) : "·"}
                  </span>
                  {sessionDone && (
                    <span style={{
                      position: "absolute", bottom: -1, right: -1,
                      width: 13, height: 13, borderRadius: "50%",
                      background: "#2c7a4b", border: "1.5px solid #fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 7, color: "#fff",
                    }}>✓</span>
                  )}
                </div>

                {/* Nom du jour */}
                <span style={{
                  ...mono, fontSize: "9px", fontWeight: 700,
                  color: isToday ? "#c0392b" : isSelected ? "#1a1a1a" : "#7a7268",
                }}>
                  {dayLetter}{isToday ? "•" : ""}
                </span>

                {/* Barre habitudes */}
                <div style={{ width: 30, height: 3, borderRadius: 2, background: "#ede8df", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${hPct * 100}%`,
                    background: hPct === 1 && totalHabits > 0 ? "#2c7a4b" : "#f39c12",
                    transition: "width 0.3s",
                  }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* 3 stats hebdo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid #ede8df" }}>
          {[
            {
              icon: "🔥",
              val: streak > 0 ? `${streak}j` : "—",
              lbl: "série",
              color: streak >= 7 ? "#c0392b" : streak >= 3 ? "#f39c12" : "#7a7268",
              tooltip: "Jours consécutifs où tu as coché 100 % de tes habitudes. La régularité est la clé du progrès — ne brise pas la chaîne !",
              align: "left" as const,
            },
            {
              icon: "💪",
              val: totalSessions > 0 ? `${completedSessions}/${totalSessions}` : "—",
              lbl: "séances sem.",
              color: completedSessions === totalSessions && totalSessions > 0 ? "#2c7a4b" : "#1a1a1a",
              tooltip: "Séances de sport complétées cette semaine sur le total prévu (hors jours de repos).",
              align: "center" as const,
            },
            {
              icon: "✅",
              val: totalHabits > 0 ? `${weeklyHabitsPct}%` : "—",
              lbl: "habitudes sem.",
              color: weeklyHabitsPct >= 80 ? "#2c7a4b" : weeklyHabitsPct >= 50 ? "#f39c12" : "#7a7268",
              tooltip: "% d'habitudes réalisées sur les jours déjà écoulés cette semaine. Ex : 3 habitudes sur 4 pendant 2 jours = 75 %.",
              align: "right" as const,
            },
          ].map((stat, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "10px 4px",
              borderRight: i < 2 ? "1px solid #ede8df" : "none",
              position: "relative",
            }}>
              <p style={{ fontSize: 16, marginBottom: 2 }}>{stat.icon}</p>
              <p style={{ ...mono, fontSize: "13px", fontWeight: 700, color: stat.color }}>{stat.val}</p>
              <p style={{ fontSize: "10px", color: "#7a7268", display: "inline-flex", alignItems: "center" }}>
                {stat.lbl}
                <InfoTooltip text={stat.tooltip} align={stat.align} />
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* SÉANCE DU JOUR */}
      <div className="rounded p-4" style={{ background: "#fff", border: "1px solid #d8d0c4", borderLeft: `4px solid ${s ? SESSION_COLOR[s.type] : "#d8d0c4"}` }}>
        <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "8px" }}>SÉANCE DU JOUR</p>
        {s && s.type === "REST" && !s.icon ? (
          // Repos par défaut (non personnalisé) → message NEAT
          <div>
            <p style={{ fontSize: 14, color: "#1a1a1a", marginBottom: 8 }}>Repos 🛌 — récupération active</p>
            <div style={{ background: "#f5f0e8", border: "1px solid #d8d0c4", borderLeft: "3px solid #f39c12", borderRadius: 3, padding: "10px 14px" }}>
              <p style={{ ...mono, fontSize: "10px", color: "#f39c12", letterSpacing: 1, marginBottom: 4 }}>💡 NEAT DU JOUR</p>
              <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.6 }}>
                Vise <strong style={{ color: "#1a1a1a" }}>7 000 à 10 000 pas</strong> aujourd'hui — marche, prends les escaliers, bouge régulièrement. Le NEAT représente jusqu'à 30 % de ta dépense calorique quotidienne.
              </p>
            </div>
          </div>
        ) : s ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: "20px" }}>{s.icon ?? SESSION_ICONS[s.type]}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</p>
                <p style={{ ...mono, fontSize: "10px", color: "#7a7268" }}>{SESSION_LABELS[s.type]} · {s.durationMin} min</p>
              </div>
              {s.completed && (
                <span style={{ ...mono, fontSize: "10px", background: "#2c7a4b", color: "#fff", padding: "4px 8px", borderRadius: "3px" }}>✓ FAIT</span>
              )}
            </div>
            <Link href="/planning" className="inline-block transition-colors hover:opacity-80"
              style={{ background: "#1a3a5c", color: "#fff", borderRadius: "3px", ...mono, fontSize: "10px", padding: "6px 12px" }}>
              VOIR LES EXERCICES →
            </Link>
          </>
        ) : (
          <p style={{ fontSize: 14, color: "#7a7268" }}>Aucune séance planifiée.</p>
        )}
      </div>

      {/* MENU DU JOUR */}
      <div className="rounded p-4" style={{ background: "#fff", border: "1px solid #d8d0c4", borderLeft: "4px solid #2c7a4b" }}>
        <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "8px" }}>MENU DU JOUR</p>
        {m ? (
          <>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                { lbl: `${Math.round(m.totalCalories)} kcal`, accent: true },
                { lbl: `P ${Math.round(m.totalProtein)}g` },
                { lbl: `G ${Math.round(m.totalCarbs)}g` },
                { lbl: `L ${Math.round(m.totalFat)}g` },
              ].map(({ lbl, accent }) => (
                <span key={lbl} style={{ ...mono, fontSize: "10px", padding: "3px 7px", borderRadius: "3px", background: "#ede8df", border: accent ? "1px solid #c0392b" : "1px solid #d8d0c4", color: accent ? "#c0392b" : "#7a7268" }}>
                  {lbl}
                </span>
              ))}
            </div>
            <Link href="/nutrition" className="inline-block transition-colors hover:opacity-80"
              style={{ background: "#2c7a4b", color: "#fff", borderRadius: "3px", ...mono, fontSize: "10px", padding: "6px 12px" }}>
              VOIR LE MENU →
            </Link>
          </>
        ) : (
          <p style={{ fontSize: 14, color: "#7a7268" }}>Aucun menu pour ce jour.</p>
        )}
      </div>

    </div>
  );
}
