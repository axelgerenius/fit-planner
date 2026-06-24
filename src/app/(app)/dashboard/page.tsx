import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient, { type DayData } from "@/components/dashboard-client";

const GOAL_LABELS: Record<string, string> = {
  MUSCLE_GAIN: "Prise de masse",
  FAT_LOSS: "Perte de gras",
  STAY_FIT: "Rester en forme",
  GENTLE_RETURN: "Reprise douce",
  FULL_STRENGTH: "Full musculation",
  RUNNING: "Running",
  CYCLING: "Cyclisme",
  CROSSFIT_HYROX: "CrossFit / HYROX",
  MARTIAL_ARTS: "Arts martiaux",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const now = new Date();
  const todayDow = now.getDay();
  const todayIndex = todayDow === 0 ? 6 : todayDow - 1;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - todayIndex);

  const streakFrom = new Date(today);
  streakFrom.setDate(today.getDate() - 59);

  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const [
    profile, workoutPlan, nutritionPlan,
    totalHabits, weekLogs, streakLogs,
    todayHabitsRaw, todayHabitLogsRaw,
    latestWeightLog, prevWeightLog,
    totalSessionCount,
  ] = await Promise.all([
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
    prisma.habit.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
    prisma.habitLog.findMany({
      where: { userId, date: today },
      select: { habitId: true },
    }),
    prisma.weightLog.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.weightLog.findFirst({
      where: { userId, date: { lt: today } },
      orderBy: { date: "desc" },
    }),
    prisma.workoutLog.count({ where: { userId } }),
  ]);

  // Habits per day-of-week this week
  const habitsByDay: number[] = Array(7).fill(0);
  for (const log of weekLogs) {
    const d = new Date(log.date);
    habitsByDay[(d.getDay() + 6) % 7]++;
  }

  // Streak: consecutive days with all habits done
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

  const completedSessions = workoutPlan?.sessions.filter(s => s.completed).length ?? 0;
  const totalSessions = workoutPlan?.sessions.filter(s => s.type !== "REST").length ?? 0;

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
      session: s ? { id: s.id, name: s.name, type: s.type, icon: s.icon ?? null, durationMin: s.durationMin, completed: s.completed } : undefined,
      menu: m ? { totalCalories: m.totalCalories, totalProtein: m.totalProtein, totalCarbs: m.totalCarbs, totalFat: m.totalFat } : undefined,
      habitCount: habitsByDay[i],
    };
  });

  // Today's habits with done status
  const doneIds = new Set(todayHabitLogsRaw.map(l => l.habitId));
  const todayHabits = todayHabitsRaw.map(h => ({
    id: h.id,
    name: h.name,
    emoji: h.emoji,
    done: doneIds.has(h.id),
  }));

  return (
    <DashboardClient
      firstName={session?.user?.name?.split(" ")[0] ?? ""}
      goalLabel={profile?.goal ? (GOAL_LABELS[profile.goal] ?? profile.goal).toUpperCase() : ""}
      todayIndex={todayIndex}
      totalHabits={totalHabits}
      streak={streak}
      completedSessions={completedSessions}
      totalSessions={totalSessions}
      weeklyHabitsPct={weeklyHabitsPct}
      days={days}
      todayHabits={todayHabits}
      latestWeight={latestWeightLog?.weight ?? null}
      prevWeight={prevWeightLog?.weight ?? null}
      totalSessionCount={totalSessionCount}
    />
  );
}
