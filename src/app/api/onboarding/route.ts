import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Goal, Level, Equipment, Sex, Diet, Allergy } from "@/generated/prisma/client";
import { getWorkoutTemplate } from "@/lib/templates/workouts";
import { computeTargetCalories, generateWeekMenus } from "@/lib/templates/nutrition";

const schema = z.object({
  goal: z.nativeEnum(Goal),
  level: z.nativeEnum(Level),
  equipment: z.array(z.nativeEnum(Equipment)).min(1),
  sex: z.nativeEnum(Sex),
  age: z.coerce.number().int().min(10).max(100),
  weight: z.coerce.number().min(30).max(300),
  height: z.coerce.number().min(100).max(250),
  sessionsPerWeek: z.coerce.number().int().min(2).max(6).optional(),
  diet: z.nativeEnum(Diet).default(Diet.OMNIVORE),
  allergies: z.array(z.nativeEnum(Allergy)).default([]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }

  const { goal, level, equipment, sex, age, weight, height, sessionsPerWeek, diet, allergies } = parsed.data;

  // Calcul des calories
  const { bmr, tdee, targetCalories } = computeTargetCalories(weight, height, age, sex, goal);

  // Sélection du template de workout
  const workoutTemplate = getWorkoutTemplate(goal, level, equipment, sessionsPerWeek);

  // Menus nutritionnels adaptés au régime et aux allergies
  const weekMenus = generateWeekMenus(targetCalories, goal, diet, allergies as ("GLUTEN"|"LACTOSE"|"NUTS"|"EGGS"|"SOY"|"SHELLFISH")[]);

  await prisma.$transaction(async (tx) => {
    // Profil utilisateur
    await tx.userProfile.upsert({
      where: { userId },
      create: { userId, goal, level, equipment, sex, age, weight, height, bmr, tdee, targetCalories, diet, allergies, onboardingDone: true },
      update: { goal, level, equipment, sex, age, weight, height, bmr, tdee, targetCalories, diet, allergies, onboardingDone: true },
    });

    // Désactiver les anciens plans
    await tx.workoutPlan.updateMany({ where: { userId }, data: { isActive: false } });

    // Créer le nouveau plan sportif
    await tx.workoutPlan.create({
      data: {
        userId,
        name: workoutTemplate.name,
        goal,
        level,
        isActive: true,
        sessions: {
          create: workoutTemplate.sessions.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            name: s.name,
            type: s.type,
            durationMin: s.durationMin,
            exercises: { create: s.exercises },
          })),
        },
      },
    });

    // Supprimer l'ancien plan nutritionnel
    await tx.nutritionPlan.deleteMany({ where: { userId } });

    // Créer le nouveau plan nutritionnel
    await tx.nutritionPlan.create({
      data: {
        userId,
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

  return NextResponse.json({ ok: true }, { status: 201 });
}
