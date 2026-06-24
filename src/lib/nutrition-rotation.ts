import { prisma } from "@/lib/prisma";
import { generateWeekMenus } from "@/lib/templates/nutrition";
import { getWeekStart } from "@/lib/week";
import { notify } from "@/lib/notifications";

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// Si la semaine en cours a changé depuis la dernière visite, fait tourner le
// plan nutritionnel vers la variante de menus suivante.
export async function ensureCurrentWeekNutrition(userId: string) {
  const plan = await prisma.nutritionPlan.findUnique({ where: { userId } });
  if (!plan) return;

  const weekStart = getWeekStart();
  if (plan.currentWeekStart.getTime() >= weekStart.getTime()) return;

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile?.targetCalories) return;

  const weeksElapsed = Math.max(1, Math.round((weekStart.getTime() - plan.currentWeekStart.getTime()) / MS_PER_WEEK));
  const nextWeekIndex = plan.weekIndex + weeksElapsed;

  const weekMenus = generateWeekMenus(
    profile.targetCalories,
    profile.goal,
    profile.diet,
    profile.allergies as ("GLUTEN" | "LACTOSE" | "NUTS" | "EGGS" | "SOY" | "SHELLFISH")[],
    nextWeekIndex,
  );

  await prisma.$transaction(async (tx) => {
    await tx.dayMenu.deleteMany({ where: { planId: plan.id } });
    await tx.nutritionPlan.update({
      where: { id: plan.id },
      data: {
        weekIndex: nextWeekIndex,
        currentWeekStart: weekStart,
        weekMenus: {
          create: weekMenus.map((day) => ({
            dayOfWeek: day.dayOfWeek,
            totalCalories: day.totalCalories,
            totalProtein: day.totalProtein,
            totalCarbs: day.totalCarbs,
            totalFat: day.totalFat,
            meals: {
              create: day.meals.map((meal) => ({
                type: meal.type,
                name: meal.name,
                calories: meal.baseCalories,
                protein: meal.baseProtein,
                carbs: meal.baseCarbs,
                fat: meal.baseFat,
                ingredients: { create: meal.ingredients },
              })),
            },
          })),
        },
      },
    });
  });

  await notify(userId, {
    type: "NUTRITION_ROTATION",
    title: "Nouveau menu de la semaine",
    message: "Ton plan nutritionnel a été mis à jour pour cette semaine.",
    link: "/nutrition",
  });
}
