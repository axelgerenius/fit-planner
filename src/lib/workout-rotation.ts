import { prisma } from "@/lib/prisma";
import { getWorkoutTemplate } from "@/lib/templates/workouts";
import { getWeekStart } from "@/lib/week";

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// Si la semaine en cours a changé depuis la dernière visite, fait tourner le
// programme actif vers la variante de séances suivante et réinitialise les
// séances (et leur statut "complété").
export async function ensureCurrentWeekPlan(userId: string) {
  const plan = await prisma.workoutPlan.findFirst({ where: { userId, isActive: true } });
  if (!plan) return;

  const weekStart = getWeekStart();
  if (plan.currentWeekStart.getTime() >= weekStart.getTime()) return;

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) return;

  const weeksElapsed = Math.max(1, Math.round((weekStart.getTime() - plan.currentWeekStart.getTime()) / MS_PER_WEEK));
  const nextWeekIndex = plan.weekIndex + weeksElapsed;

  const template = getWorkoutTemplate(profile.goal, profile.level, profile.equipment, profile.sessionsPerWeek ?? undefined, nextWeekIndex);

  await prisma.$transaction(async (tx) => {
    await tx.workoutSession.deleteMany({ where: { planId: plan.id } });
    await tx.workoutPlan.update({
      where: { id: plan.id },
      data: {
        name: template.name,
        weekIndex: nextWeekIndex,
        currentWeekStart: weekStart,
        sessions: {
          create: template.sessions.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            name: s.name,
            type: s.type,
            durationMin: s.durationMin,
            exercises: { create: s.exercises },
          })),
        },
      },
    });
  });
}
