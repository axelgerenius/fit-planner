import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeIngredient } from "@/lib/normalize-ingredient";

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = session.user.id;
  const weekStart = getWeekStart();

  const nutritionPlan = await prisma.nutritionPlan.findUnique({
    where: { userId },
    include: {
      weekMenus: {
        include: {
          meals: { include: { ingredients: true } },
        },
      },
    },
  });

  if (!nutritionPlan) {
    return NextResponse.json({ error: "Aucun plan nutritionnel" }, { status: 404 });
  }

  // Agréger tous les ingrédients par nom normalisé + unité
  const aggregated = new Map<string, { name: string; quantity: number; unit: string; category: string }>();

  for (const menu of nutritionPlan.weekMenus) {
    for (const meal of menu.meals) {
      for (const ing of meal.ingredients) {
        const { name: normalizedName, unitOverride } = normalizeIngredient(ing.name);
        const unit = unitOverride ?? ing.unit;
        const key = `${normalizedName.toLowerCase()}::${unit}`;

        if (aggregated.has(key)) {
          aggregated.get(key)!.quantity += ing.quantity;
        } else {
          aggregated.set(key, {
            name: normalizedName,
            quantity: ing.quantity,
            unit,
            category: ing.category,
          });
        }
      }
    }
  }

  // Supprimer l'ancienne liste de la semaine si elle existe
  await prisma.shoppingList.deleteMany({ where: { userId, weekStart } });

  await prisma.shoppingList.create({
    data: {
      userId,
      weekStart,
      items: {
        create: Array.from(aggregated.values()).map((item) => ({
          name: item.name,
          quantity: Math.round(item.quantity * 10) / 10,
          unit: item.unit,
          category: item.category as never,
          checked: false,
        })),
      },
    },
  });

  return NextResponse.json({ ok: true });
}
