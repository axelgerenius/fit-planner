import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient, { type DayData } from "@/components/dashboard-client";

const GOAL_LABELS: Record<string, string> = {
  MUSCLE_GAIN: "Prise de masse",
  FAT_LOSS: "Perte de gras",
  STAY_FIT: "Rester en forme",
  GENTLE_RETURN: "Reprise douce",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayDow = today.getDay();
  const todayIndex = todayDow === 0 ? 6 : todayDow - 1;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - todayIndex);

  const streakFrom = new Date(today);
  streakFrom.setDate(today.getDate() - 59);

  const [profile, workoutPlan, nutritionPlan, totalHabits, weekLogs, streakLogs] = await Promise.all([
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
    prisma.habitLog.findMany({
      where: { userId, date: { gte: streakFrom } },
      select: { date: true },
    }),
  ]);

  // Habits per day-of-week this week (0=Mon)
  const habitsByDay: number[] = Array(7).fill(0);
  for (const log of weekLogs) {
    const d = new Date(log.date);
    habitsByDay[(d.getDay() + 6) % 7]++;
  }

  // Streak: consecutive days with all habits done, going back from today
  let streak = 0;
  if (totalHabits > 0) {
    const byDate: Record<string, number> = {};
    for (const log of streakLogs) {
      const key = new Date(log.date).toISOString().split("T")[0];
      byDate[key] = (byDate[key] ?? 0) + 1;
    }
    for (let i = 0; i <= 59; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if ((byDate[key] ?? 0) >= totalHabits) streak++;
      else break;
    }
  }

  // Weekly sessions stats
  const completedSessions = workoutPlan?.sessions.filter(s => s.completed).length ?? 0;
  const totalSessions = workoutPlan?.sessions.filter(s => s.type !== "REST").length ?? 0;

  // Weekly habits score (% over days elapsed this week)
  const daysElapsed = todayIndex + 1;
  const weeklyHabitsTotal = totalHabits * daysElapsed;
  const weeklyHabitsDone = habitsByDay.slice(0, daysElapsed).reduce((a, b) => a + b, 0);
  const weeklyHabitsPct = weeklyHabitsTotal > 0
    ? Math.round((weeklyHabitsDone / weeklyHabitsTotal) * 100)
    : 0;

  const days: DayData[] = Array.from({ length: 7 }, (_, i) => {
    const s = workoutPlan?.sessions.find(s => s.dayOfWeek === i);
    const m = nutritionPlan?.weekMenus.find(m => m.dayOfWeek === i);
    return {
      session: s ? { id: s.id, name: s.name, type: s.type, durationMin: s.durationMin, completed: s.completed } : undefined,
      menu: m ? { totalCalories: m.totalCalories, totalProtein: m.totalProtein, totalCarbs: m.totalCarbs, totalFat: m.totalFat } : undefined,
      habitCount: habitsByDay[i],
    };
  });

  return (
    <DashboardClient
      firstName={session?.user?.name?.split(" ")[0] ?? ""}
      goalLabel={profile?.goal ? GOAL_LABELS[profile.goal].toUpperCase() : ""}
      todayIndex={todayIndex}
      totalHabits={totalHabits}
      streak={streak}
      completedSessions={completedSessions}
      totalSessions={totalSessions}
      weeklyHabitsPct={weeklyHabitsPct}
      days={days}
    />
  );
}
