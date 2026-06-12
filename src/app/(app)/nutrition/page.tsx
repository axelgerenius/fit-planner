import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NutritionClient from "@/components/nutrition-client";

export default async function NutritionPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [profile, nutritionPlan] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.nutritionPlan.findUnique({
      where: { userId },
      include: {
        weekMenus: {
          orderBy: { dayOfWeek: "asc" },
          include: { meals: { orderBy: { type: "asc" }, include: { ingredients: true } } },
        },
      },
    }),
  ]);

  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  if (!nutritionPlan) {
    return (
      <div style={{ textAlign: "center", padding: "80px 16px", color: "#6B7280" }}>
        Aucun plan nutritionnel trouvé.
      </div>
    );
  }

  return (
    <NutritionClient
      targetCalories={profile?.targetCalories ?? 0}
      todayIndex={todayIndex}
      weekMenus={nutritionPlan.weekMenus}
    />
  );
}
