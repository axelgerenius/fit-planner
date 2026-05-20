import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const GOAL_LABELS: Record<string, string> = {
  MUSCLE_GAIN: "Prise de masse",
  FAT_LOSS: "Perte de gras",
  STAY_FIT: "Rester en forme",
  GENTLE_RETURN: "Reprise douce",
};

const DAY_NAMES_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const SESSION_ICONS: Record<string, string> = {
  STRENGTH: "🏋️", CARDIO: "🏃", HIIT: "🔥",
  YOGA_STRETCH: "🧘", FULL_BODY: "💪", REST: "🛌",
};

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  // Start of current week (Monday)
  const weekStart = new Date();
  weekStart.setUTCHours(0, 0, 0, 0);
  const dayOfWeek = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const [profile, workoutPlan, nutritionPlan, habits, habitLogs] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.workoutPlan.findFirst({
      where: { userId, isActive: true },
      include: { sessions: { orderBy: { dayOfWeek: "asc" } } },
    }),
    prisma.nutritionPlan.findUnique({
      where: { userId },
      include: { weekMenus: { orderBy: { dayOfWeek: "asc" } } },
    }),
    prisma.habit.count({ where: { userId, isActive: true } }),
    prisma.habitLog.findMany({
      where: { userId, date: { gte: weekStart } },
      select: { date: true },
    }),
  ]);

  // Build habit count per day of week (0=Mon … 6=Sun)
  const habitsByDay: number[] = Array(7).fill(0);
  for (const log of habitLogs) {
    const d = new Date(log.date);
    const idx = (d.getDay() + 6) % 7; // convert Sun=0 to Mon=0
    habitsByDay[idx]++;
  }

  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;
  const todaySession = workoutPlan?.sessions.find((s) => s.dayOfWeek === todayIndex);
  const todayMenu = nutritionPlan?.weekMenus.find((m) => m.dayOfWeek === todayIndex);
  const completedSessions = workoutPlan?.sessions.filter((s) => s.completed).length ?? 0;
  const totalSessions = workoutPlan?.sessions.filter((s) => s.type !== "REST").length ?? 0;
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="space-y-3 pb-8">
      {/* Day header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded"
        style={{ background: "#1a1a1a" }}
      >
        <h1 style={{ ...display, fontSize: "28px", letterSpacing: "2px", color: "#fff" }}>
          Bonjour {firstName}
        </h1>
        <span
          style={{ ...mono, fontSize: "10px", background: "#c0392b", color: "#fff", padding: "4px 10px", borderRadius: "3px" }}
        >
          {profile?.goal ? GOAL_LABELS[profile.goal].toUpperCase() : ""}
        </span>
      </div>

      {/* Macros row */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { val: Math.round(profile?.targetCalories ?? 0), lbl: "kcal cible", accent: true },
          { val: `${completedSessions}/${totalSessions}`, lbl: "séances", accent: false },
          { val: `${profile?.weight ?? 0}`, lbl: "kg", accent: false },
          { val: profile?.bmr ? Math.round(profile.bmr) : "—", lbl: "BMR", accent: false },
        ].map(({ val, lbl, accent }) => (
          <div
            key={lbl}
            className="rounded text-center py-2.5 px-1"
            style={{
              background: "#fff",
              border: accent ? "2px solid #c0392b" : "1px solid #d8d0c4",
            }}
          >
            <p style={{ ...mono, fontSize: "13px", fontWeight: 700, color: accent ? "#c0392b" : "#1a1a1a" }}>
              {val}
            </p>
            <p style={{ fontSize: "10px", color: "#7a7268", marginTop: "2px" }}>{lbl}</p>
          </div>
        ))}
      </div>

      {/* Séance du jour */}
      <div
        className="rounded p-4"
        style={{ background: "#fff", border: "1px solid #d8d0c4", borderLeft: "4px solid #1a3a5c" }}
      >
        <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "6px" }}>
          SÉANCE DU JOUR
        </p>
        {todaySession && todaySession.type !== "REST" ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{SESSION_ICONS[todaySession.type]}</span>
              <p className="font-semibold text-sm">{todaySession.name}</p>
              <span
                style={{ ...mono, fontSize: "10px", background: "#ede8df", border: "1px solid #d8d0c4", padding: "2px 7px", borderRadius: "3px", color: "#7a7268", marginLeft: "auto" }}
              >
                {todaySession.durationMin} min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/planning"
                className="inline-block text-xs font-semibold px-3 py-1.5 transition-colors hover:opacity-80"
                style={{ background: "#1a3a5c", color: "#fff", borderRadius: "3px", ...mono, fontSize: "10px" }}
              >
                VOIR LES EXERCICES →
              </Link>
              {todaySession.completed && (
                <span style={{ ...mono, fontSize: "10px", background: "#2c7a4b", color: "#fff", padding: "6px 8px", borderRadius: "3px" }}>
                  ✓ TERMINÉE
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Repos aujourd&apos;hui 🛌</p>
        )}
      </div>

      {/* Menu du jour */}
      <div
        className="rounded p-4"
        style={{ background: "#fff", border: "1px solid #d8d0c4", borderLeft: "4px solid #2c7a4b" }}
      >
        <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "6px" }}>
          MENU DU JOUR
        </p>
        {todayMenu ? (
          <>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                { lbl: `${Math.round(todayMenu.totalCalories)} kcal`, accent: true },
                { lbl: `P ${Math.round(todayMenu.totalProtein)}g` },
                { lbl: `G ${Math.round(todayMenu.totalCarbs)}g` },
                { lbl: `L ${Math.round(todayMenu.totalFat)}g` },
              ].map(({ lbl, accent }) => (
                <span
                  key={lbl}
                  style={{
                    ...mono,
                    fontSize: "10px",
                    padding: "3px 7px",
                    borderRadius: "3px",
                    background: "#ede8df",
                    border: accent ? "1px solid #c0392b" : "1px solid #d8d0c4",
                    color: accent ? "#c0392b" : "#7a7268",
                  }}
                >
                  {lbl}
                </span>
              ))}
            </div>
            <Link
              href="/nutrition"
              className="inline-block text-xs font-semibold px-3 py-1.5 transition-colors hover:opacity-80"
              style={{ background: "#2c7a4b", color: "#fff", borderRadius: "3px", ...mono, fontSize: "10px" }}
            >
              VOIR LE MENU →
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun menu pour aujourd&apos;hui.</p>
        )}
      </div>

      {/* Habitudes de la semaine */}
      <div className="rounded p-4" style={{ background: "#fff", border: "1px solid #d8d0c4", borderLeft: "4px solid #f39c12" }}>
        <div className="flex items-center justify-between mb-3">
          <p style={{ ...mono, fontSize: "10px", color: "#7a7268" }}>HABITUDES — CETTE SEMAINE</p>
          <a href="/habitudes" style={{ ...mono, fontSize: "10px", color: "#c0392b", textDecoration: "none" }}>AUJOURD'HUI →</a>
        </div>
        {habits === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune habitude définie. <a href="/habitudes" style={{ color: "#c0392b" }}>Ajouter</a></p>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {DAY_NAMES_SHORT.map((day, i) => {
              const count = habitsByDay[i];
              const pct = habits > 0 ? count / habits : 0;
              const isToday = i === todayIndex;
              const bg = pct === 0 ? "#f5f0e8" : pct < 0.5 ? "#f39c12" : pct < 1 ? "#a8d5b5" : "#2c7a4b";
              const textColor = pct >= 0.5 ? "#fff" : "#1a1a1a";
              return (
                <div key={day} className="text-center py-2 rounded" style={{ background: bg, border: isToday ? "2px solid #1a1a1a" : "1px solid #d8d0c4" }}>
                  <p style={{ ...mono, fontSize: "9px", color: pct >= 0.5 ? "#fff" : "#7a7268", fontWeight: 700, marginBottom: 2 }}>{day.toUpperCase()}</p>
                  <p style={{ ...mono, fontSize: "9px", color: textColor }}>{count > 0 ? `${count}/${habits}` : "·"}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Semaine */}
      <div className="rounded p-4" style={{ background: "#fff", border: "1px solid #d8d0c4" }}>
        <p style={{ ...mono, fontSize: "9px", letterSpacing: "2px", color: "#1a3a5c", marginBottom: "10px", textTransform: "uppercase", borderBottom: "1px solid #d8d0c4", paddingBottom: "6px" }}>
          Programme de la semaine
        </p>
        <div className="grid grid-cols-7 gap-1">
          {DAY_NAMES_SHORT.map((day, i) => {
            const s = workoutPlan?.sessions.find((s) => s.dayOfWeek === i);
            const isToday = i === todayIndex;
            return (
              <div
                key={day}
                className="text-center py-2 px-1 rounded"
                style={{
                  background: isToday ? "#1a1a1a" : s?.completed ? "#ede8df" : "#f5f0e8",
                  border: isToday ? "none" : "1px solid #d8d0c4",
                }}
              >
                <p style={{ ...mono, fontSize: "9px", color: isToday ? "#fff" : "#7a7268", fontWeight: 700, marginBottom: "4px" }}>
                  {day.toUpperCase()}
                </p>
                <p style={{ fontSize: "12px" }}>
                  {s ? (s.type === "REST" ? "—" : SESSION_ICONS[s.type]) : "·"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
