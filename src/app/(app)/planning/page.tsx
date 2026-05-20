import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CompleteSessionButton from "@/components/complete-session-button";

const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

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
  REST:         { bg: "#2c7a4b", fg: "#ffffff" },
};

const SESSION_BORDER: Record<string, string> = {
  STRENGTH: "#1a3a5c", CARDIO: "#f39c12", HIIT: "#c0392b",
  YOGA_STRETCH: "#7a7268", FULL_BODY: "#2c7a4b", REST: "#d8d0c4",
};

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

export default async function PlanningPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const workoutPlan = await prisma.workoutPlan.findFirst({
    where: { userId, isActive: true },
    include: {
      sessions: {
        orderBy: { dayOfWeek: "asc" },
        include: { exercises: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!workoutPlan) {
    return <div className="text-center py-20 text-muted-foreground">Aucun programme trouvé.</div>;
  }

  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <div className="space-y-3 pb-8">
      <div className="flex items-center justify-between">
        <h1 style={{ ...display, fontSize: "26px", letterSpacing: "2px" }}>PLANNING SPORT</h1>
      </div>
      <p style={{ ...mono, fontSize: "10px", color: "#7a7268" }}>{workoutPlan.name.toUpperCase()}</p>

      <div className="space-y-2.5">
        {workoutPlan.sessions.map((s) => {
          const badge = SESSION_BADGE_COLORS[s.type] ?? SESSION_BADGE_COLORS.REST;
          const borderColor = SESSION_BORDER[s.type] ?? "#d8d0c4";
          const isToday = s.dayOfWeek === todayIndex;

          return (
            <div
              key={s.id}
              className="rounded p-4"
              style={{
                background: "#fff",
                border: "1px solid #d8d0c4",
                borderLeft: `4px solid ${borderColor}`,
                opacity: s.completed ? 0.6 : 1,
                outline: isToday ? "2px solid #1a1a1a" : undefined,
                outlineOffset: isToday ? "2px" : undefined,
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2 mb-0">
                <div className="flex items-center gap-3">
                  <span style={{ ...mono, fontSize: "11px", color: isToday ? "#1a1a1a" : "#7a7268", fontWeight: isToday ? 700 : 400 }}>
                    {DAY_NAMES[s.dayOfWeek].toUpperCase().slice(0, 3)}
                    {isToday && <span style={{ color: "#c0392b" }}> ●</span>}
                  </span>
                  <p className="font-semibold text-sm">{s.name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    style={{ ...mono, fontSize: "10px", background: badge.bg, color: badge.fg, padding: "4px 8px", borderRadius: "3px" }}
                  >
                    {SESSION_LABELS[s.type]}
                  </span>
                  {s.type !== "REST" && (
                    <span
                      style={{ ...mono, fontSize: "10px", background: "#ede8df", border: "1px solid #d8d0c4", color: "#7a7268", padding: "3px 7px", borderRadius: "3px" }}
                    >
                      {s.durationMin} min
                    </span>
                  )}
                  {s.completed && (
                    <span
                      style={{ ...mono, fontSize: "10px", background: "#2c7a4b", color: "#fff", padding: "4px 8px", borderRadius: "3px" }}
                    >
                      ✓ FAIT
                    </span>
                  )}
                </div>
              </div>

              {s.type !== "REST" && s.exercises.length > 0 && (
                <>
                  <div
                    className="space-y-2 mt-3 pt-3"
                    style={{ borderTop: "1px solid #d8d0c4" }}
                  >
                    {s.exercises.map((ex) => (
                      <div key={ex.id} className="flex items-start justify-between">
                        <span className="text-sm font-medium">{ex.name}</span>
                        <span style={{ ...mono, fontSize: "11px", color: "#7a7268", textAlign: "right" }}>
                          {ex.sets && ex.reps && `${ex.sets}×${ex.reps}`}
                          {ex.restSec && <span style={{ color: "#7a7268", marginLeft: "8px" }}>{ex.restSec}s</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <CompleteSessionButton sessionId={s.id} completed={s.completed} isFuture={s.dayOfWeek > todayIndex} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
