"use client";

import Link from "next/link";

// ─── Design tokens ────────────────────────────────────────────────────────────
const P  = "#FF6500";   // primary orange
const PL = "#FFF3ED";   // orange light bg
const G  = "#22C55E";   // green success
const GL = "#F0FDF4";   // green light bg
const D  = "#111827";   // dark text
const GR = "#6B7280";   // gray text
const LG = "#F3F4F6";   // light gray bg
const BD = "#E5E7EB";   // border
const W  = "#FFFFFF";   // white

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

const SESSION_LABELS: Record<string, string> = {
  STRENGTH: "Force", CARDIO: "Cardio", HIIT: "HIIT",
  YOGA_STRETCH: "Yoga / Étirements", FULL_BODY: "Full Body", REST: "Repos",
  RUNNING: "Running", CYCLING: "Cyclisme", CROSSFIT: "CrossFit / HYROX", MARTIAL_ARTS: "Arts Martiaux",
};
const SESSION_ICONS: Record<string, string> = {
  STRENGTH: "🏋️", CARDIO: "🏃", HIIT: "🔥",
  YOGA_STRETCH: "🧘", FULL_BODY: "💪", REST: "🛌",
  RUNNING: "🏃", CYCLING: "🚴", CROSSFIT: "🔗", MARTIAL_ARTS: "🥋",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type DayData = {
  session?: { id: string; name: string; type: string; icon: string | null; durationMin: number; completed: boolean };
  menu?: { totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number };
  habitCount: number;
};

type TodayHabit = { id: string; name: string; emoji: string; done: boolean };

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
  todayHabits: TodayHabit[];
  latestWeight: number | null;
  prevWeight: number | null;
  totalSessionCount: number;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: W, borderRadius: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: GR, textTransform: "uppercase", marginBottom: 10 }}>
      {children}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardClient({
  firstName, todayIndex, totalHabits, streak,
  completedSessions, totalSessions,
  days, todayHabits, latestWeight, prevWeight, totalSessionCount,
}: Props) {
  const today = days[todayIndex];
  const session = today?.session;
  const menu = today?.menu;

  const todayDone   = todayHabits.filter(h => h.done).length;
  const todayTotal  = todayHabits.length;
  const todayPct    = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;

  const sessionPct  = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const sessionsLeft = totalSessions - completedSessions;

  // Gamification level
  const totalXP  = totalSessionCount * 100 + streak * 10;
  const level    = Math.floor(totalXP / 500) + 1;
  const xpPct    = Math.min(100, Math.round((totalXP % 500) / 500 * 100));

  const weightDelta = latestWeight && prevWeight ? +(latestWeight - prevWeight).toFixed(1) : null;

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", paddingBottom: 40 }}>

      {/* ═══ GREETING + LEVEL ═══════════════════════════════════════════════ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 12 }}>

        {/* Left: greeting + streak */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: D, marginBottom: 8, lineHeight: 1.2 }}>
            Bonjour {firstName} 👋
          </h1>
          {streak > 0 && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: PL, borderRadius: 20, padding: "5px 12px",
            }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: P }}>
                {streak} jour{streak > 1 ? "s" : ""} de série
              </span>
            </div>
          )}
        </div>

        {/* Right: level card */}
        <Card style={{ padding: "12px 14px", minWidth: 130, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: D }}>NIVEAU {level}</span>
          </div>
          <p style={{ fontSize: 11, color: GR, marginBottom: 6 }}>
            {totalXP % 500} / 500 XP
          </p>
          <div style={{ height: 5, background: LG, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${xpPct}%`, background: P, borderRadius: 3, transition: "width 0.6s" }} />
          </div>
        </Card>
      </div>

      {/* ═══ OBJECTIF DE LA SEMAINE ══════════════════════════════════════════ */}
      {totalSessions > 0 && (
        <Card style={{ padding: "16px 20px", marginBottom: 16, background: "#FFF8F5", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flex: 1 }}>
            <span style={{ fontSize: 30, flexShrink: 0 }}>🎯</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: D, marginBottom: 3 }}>Objectif de la semaine</p>
              <p style={{ fontSize: 12, color: GR, lineHeight: 1.5 }}>
                {sessionsLeft > 0
                  ? `Encore ${sessionsLeft} séance${sessionsLeft > 1 ? "s" : ""} pour atteindre ton objectif !`
                  : "Objectif de la semaine atteint ! 🎉"}
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: P, lineHeight: 1 }}>
              {completedSessions}<span style={{ fontSize: 14, fontWeight: 500, color: GR }}> / {totalSessions}</span>
            </p>
            <p style={{ fontSize: 11, color: GR }}>séances</p>
          </div>
        </Card>
      )}

      {/* ═══ SÉANCE DU JOUR ══════════════════════════════════════════════════ */}
      {session && session.type !== "REST" ? (
        <div style={{
          borderRadius: 20, marginBottom: 16, overflow: "hidden",
          background: "linear-gradient(140deg, #1a1a1a 0%, #FF6500 100%)",
          position: "relative", padding: "22px 20px 18px",
        }}>
          {/* Decorative emoji background */}
          <div style={{
            position: "absolute", right: 12, top: 10,
            fontSize: 72, opacity: 0.2, zIndex: 0, transform: "rotate(-10deg)",
            lineHeight: 1,
          }}>
            {session.icon ?? SESSION_ICONS[session.type]}
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>
              SÉANCE DU JOUR
            </p>
            <p style={{ fontSize: 30, fontWeight: 800, color: W, marginBottom: 4, lineHeight: 1.1 }}>
              {session.name}
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 18 }}>
              {SESSION_LABELS[session.type]} · {session.durationMin} min
            </p>

            {/* Programme progress */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>Progression du programme</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: W }}>{sessionPct}%</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${sessionPct}%`, background: W, borderRadius: 3 }} />
              </div>
            </div>

            <Link href="/planning" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: W, color: P, padding: "13px 20px",
              borderRadius: 30, fontWeight: 800, fontSize: 13,
              textDecoration: "none", letterSpacing: 0.5,
            }}>
              ▶ COMMENCER MA SÉANCE
            </Link>
          </div>
        </div>
      ) : session?.type === "REST" ? (
        <Card style={{ padding: 20, marginBottom: 16 }}>
          <SectionLabel>Séance du jour</SectionLabel>
          <p style={{ fontSize: 22, fontWeight: 800, color: D, marginBottom: 6 }}>Repos 🛌</p>
          <p style={{ fontSize: 13, color: GR, lineHeight: 1.6 }}>
            Vise <strong style={{ color: D }}>7 000 à 10 000 pas</strong> aujourd'hui.
            Le NEAT représente jusqu'à 30 % de ta dépense calorique quotidienne.
          </p>
        </Card>
      ) : null}

      {/* ═══ OBJECTIF SEMAINE + CALENDRIER ══════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>

        {/* Objectif semaine */}
        <Card style={{ padding: 16 }}>
          <SectionLabel>Objectif semaine</SectionLabel>
          <p style={{ fontSize: 20, fontWeight: 800, color: D, marginBottom: 2, lineHeight: 1.2 }}>
            {completedSessions} séances
          </p>
          <p style={{ fontSize: 12, color: GR, marginBottom: 8 }}>sur {totalSessions}</p>
          <div style={{ height: 5, background: LG, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${sessionPct}%`, background: sessionPct === 100 ? G : P, transition: "width 0.4s" }} />
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: sessionPct === 100 ? G : GR }}>
            {sessionsLeft > 0 ? `Encore ${sessionsLeft} séance${sessionsLeft > 1 ? "s" : ""} 💪` : "Objectif atteint ! 🎉"}
          </p>
        </Card>

        {/* Calendrier */}
        <Card style={{ padding: 16 }}>
          <SectionLabel>Calendrier</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            {DAY_LABELS.map((d, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 600, textAlign: "center",
                color: i === todayIndex ? P : GR, width: 20,
              }}>
                {d}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {days.map((day, i) => {
              const done = day.session?.completed && day.session.type !== "REST";
              const isToday = i === todayIndex;
              const isFuture = i > todayIndex;
              return (
                <div key={i} style={{
                  width: 20, height: 20, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? G : "transparent",
                  border: isToday
                    ? `2px solid ${P}`
                    : done ? "none"
                    : `1.5px solid ${BD}`,
                  opacity: isFuture && !isToday ? 0.5 : 1,
                }}>
                  {done && <span style={{ color: W, fontSize: 9, fontWeight: 700 }}>✓</span>}
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 10, color: P, fontWeight: 600, marginTop: 8, textAlign: "center" }}>
            Aujourd'hui
          </p>
        </Card>
      </div>

      {/* ═══ HABITUDES + PROGRESSION ════════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>

        {/* Habitudes */}
        <Card style={{ padding: 16 }}>
          <SectionLabel>Habitudes aujourd'hui</SectionLabel>

          {todayHabits.length === 0 ? (
            <p style={{ fontSize: 11, color: GR }}>Aucune habitude définie</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 10 }}>
              {todayHabits.slice(0, 4).map(h => (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{h.emoji}</span>
                  <span style={{
                    fontSize: 11, color: D, flex: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {h.name}
                  </span>
                  <div style={{
                    width: 17, height: 17, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: h.done ? G : "transparent",
                    border: h.done ? "none" : `1.5px solid ${BD}`,
                  }}>
                    {h.done && <span style={{ color: W, fontSize: 9, fontWeight: 700 }}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {todayTotal > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: P }}>{todayDone} / {todayTotal} habitudes</span>
                <span style={{ fontSize: 11, color: GR }}>{todayPct}%</span>
              </div>
              <div style={{ height: 4, background: LG, borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${todayPct}%`, background: todayPct === 100 ? G : "#3B82F6", borderRadius: 2, transition: "width 0.4s" }} />
              </div>
            </>
          )}

          <Link href="/habitudes" style={{ fontSize: 10, fontWeight: 700, color: P, textDecoration: "none", letterSpacing: 0.5 }}>
            VOIR TOUTES MES HABITUDES
          </Link>
        </Card>

        {/* Progression — compact vertical */}
        <Card style={{ padding: 16 }}>
          <SectionLabel>Progression</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: D, lineHeight: 1 }}>
                {latestWeight ?? "—"}
                {latestWeight && <span style={{ fontSize: 11, fontWeight: 400, color: GR }}> kg</span>}
              </p>
              {weightDelta !== null ? (
                <p style={{ fontSize: 11, fontWeight: 700, marginTop: 2, color: weightDelta < 0 ? G : "#EF4444" }}>
                  {weightDelta > 0 ? "+" : ""}{weightDelta} kg cette sem.
                </p>
              ) : (
                <p style={{ fontSize: 10, color: GR, marginTop: 2 }}>vs sem. dernière</p>
              )}
            </div>

            <div style={{ height: 1, background: BD }} />

            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: D, lineHeight: 1 }}>
                🔥 {totalSessionCount}
              </p>
              <p style={{ fontSize: 10, color: GR, marginTop: 2 }}>séances réalisées</p>
            </div>

            <div style={{ height: 1, background: BD }} />

            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: P, lineHeight: 1 }}>
                🏆 Niv. {level}
              </p>
              <p style={{ fontSize: 10, color: GR, marginTop: 2 }}>niveau actuel</p>
              <div style={{ height: 4, background: LG, borderRadius: 2, overflow: "hidden", marginTop: 5 }}>
                <div style={{ height: "100%", width: `${xpPct}%`, background: P, borderRadius: 2 }} />
              </div>
              <p style={{ fontSize: 9, color: GR, marginTop: 3 }}>{totalXP % 500} / 500 XP</p>
            </div>

          </div>
        </Card>
      </div>

      {/* ═══ NUTRITION DU JOUR ═══════════════════════════════════════════════ */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <SectionLabel>Nutrition du jour</SectionLabel>
          <Link href="/nutrition" style={{ fontSize: 10, fontWeight: 700, color: P, textDecoration: "none", letterSpacing: 0.5 }}>
            VOIR LE MENU
          </Link>
        </div>
        {menu ? (
          <>
            <p style={{ fontSize: 30, fontWeight: 800, color: D, lineHeight: 1, marginBottom: 16 }}>
              {Math.round(menu.totalCalories)}
              <span style={{ fontSize: 14, fontWeight: 400, color: GR }}> kcal</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { emoji: "🥩", label: "Protéines",  val: Math.round(menu.totalProtein) },
                { emoji: "🍚", label: "Glucides",   val: Math.round(menu.totalCarbs) },
                { emoji: "🥑", label: "Lipides",    val: Math.round(menu.totalFat) },
              ].map(m => (
                <div key={m.label} style={{ background: LG, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
                  <p style={{ fontSize: 18, marginBottom: 2 }}>{m.emoji}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: D, lineHeight: 1 }}>{m.val}</p>
                  <p style={{ fontSize: 10, color: GR, marginTop: 2 }}>g {m.label}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontSize: 12, color: GR }}>Aucun menu configuré.</p>
        )}
      </Card>

    </div>
  );
}
