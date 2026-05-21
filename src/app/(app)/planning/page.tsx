import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SessionCard from "@/components/session-card";

const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

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
        {workoutPlan.sessions.map((s) => (
          <SessionCard
            key={s.id}
            session={{
              id: s.id,
              name: s.name,
              type: s.type,
              icon: s.icon ?? null,
              notes: s.notes ?? null,
              dayOfWeek: s.dayOfWeek,
              durationMin: s.durationMin,
              completed: s.completed,
              exercises: s.exercises,
            }}
            isToday={s.dayOfWeek === todayIndex}
            todayIndex={todayIndex}
            dayLabel={DAY_NAMES[s.dayOfWeek].toUpperCase().slice(0, 3)}
          />
        ))}
      </div>
    </div>
  );
}
