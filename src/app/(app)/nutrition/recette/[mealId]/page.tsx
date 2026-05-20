import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, string> = {
  MEAT_FISH: "🥩",
  DAIRY_EGGS: "🥚",
  FRUITS_VEGETABLES: "🥦",
  CEREALS_LEGUMES: "🌾",
  FATS_OILS: "🫒",
  CONDIMENTS: "🧂",
  OTHER: "📦",
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  BREAKFAST: "Petit-déjeuner",
  LUNCH: "Déjeuner",
  DINNER: "Dîner",
  SNACK: "Collation",
};

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  category: string;
};

function generateSteps(mealName: string, ingredients: Ingredient[]): string[] {
  const steps: string[] = [];
  const meats    = ingredients.filter((i) => i.category === "MEAT_FISH");
  const veggies  = ingredients.filter((i) => i.category === "FRUITS_VEGETABLES");
  const cereals  = ingredients.filter((i) => i.category === "CEREALS_LEGUMES");
  const dairy    = ingredients.filter((i) => i.category === "DAIRY_EGGS");
  const fats     = ingredients.filter((i) => i.category === "FATS_OILS");
  const condiments = ingredients.filter((i) => i.category === "CONDIMENTS");

  steps.push("Rassembler et peser tous les ingrédients avant de commencer.");

  if (cereals.length > 0) {
    const names = cereals.map((i) => i.name.toLowerCase()).join(", ");
    steps.push(`Faire cuire ${names} selon les instructions de l'emballage (eau bouillante salée ou vapeur).`);
  }

  if (veggies.length > 0) {
    const names = veggies.map((i) => i.name.toLowerCase()).join(", ");
    steps.push(`Laver soigneusement et découper ${names} en morceaux réguliers.`);
  }

  if (meats.length > 0) {
    const names = meats.map((i) => i.name.toLowerCase()).join(" et ");
    if (fats.length > 0) {
      steps.push(`Faire chauffer un filet d'huile dans une poêle. Saisir ${names} à feu vif 2 min de chaque côté, puis baisser à feu moyen jusqu'à cuisson complète.`);
    } else {
      steps.push(`Cuire ${names} à la vapeur ou au four à 180 °C jusqu'à cuisson complète (température à cœur 75 °C pour la volaille).`);
    }
  }

  if (dairy.length > 0) {
    const names = dairy.map((i) => i.name.toLowerCase()).join(", ");
    steps.push(`Incorporer ${names} en fin de préparation pour conserver toutes les qualités nutritionnelles.`);
  }

  if (condiments.length > 0) {
    const names = condiments.map((i) => i.name.toLowerCase()).join(", ");
    steps.push(`Assaisonner avec ${names} selon votre goût.`);
  }

  steps.push(`Dresser le tout dans une assiette et servir ${mealName.toLowerCase()} immédiatement.`);

  return steps;
}

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

const MEAL_BORDER: Record<string, string> = {
  BREAKFAST: "#f39c12",
  LUNCH: "#2c7a4b",
  DINNER: "#c0392b",
  SNACK: "#1a3a5c",
};

export default async function RecettePage({
  params,
}: {
  params: Promise<{ mealId: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const { mealId } = await params;

  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      dayMenu: { plan: { userId } },
    },
    include: { ingredients: { orderBy: { category: "asc" } } },
  });

  if (!meal) notFound();

  const steps = generateSteps(meal.name, meal.ingredients);
  const borderColor = MEAL_BORDER[meal.type] ?? "#d8d0c4";

  return (
    <div className="space-y-3 pb-8" style={{ maxWidth: "600px", margin: "0 auto" }}>
      {/* Retour */}
      <Link
        href="/nutrition"
        style={{ ...mono, fontSize: "10px", color: "#7a7268", textDecoration: "none", letterSpacing: "1px" }}
      >
        ← RETOUR AU MENU
      </Link>

      {/* Header */}
      <div
        className="rounded px-5 py-4"
        style={{ background: "#1a1a1a", borderLeft: `4px solid ${borderColor}` }}
      >
        <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "4px" }}>
          {MEAL_TYPE_LABELS[meal.type]?.toUpperCase()} — RECETTE
        </p>
        <h1 style={{ ...display, fontSize: "26px", letterSpacing: "2px", color: "#fff", lineHeight: 1.1 }}>
          {meal.name.toUpperCase()}
        </h1>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { val: `${Math.round(meal.calories)}`, lbl: "kcal", accent: true },
          { val: `${Math.round(meal.protein)}g`, lbl: "protéines" },
          { val: `${Math.round(meal.carbs)}g`, lbl: "glucides" },
          { val: `${Math.round(meal.fat)}g`, lbl: "lipides" },
        ].map(({ val, lbl, accent }) => (
          <div
            key={lbl}
            className="text-center py-2.5 px-1 rounded"
            style={{ background: "#fff", border: accent ? "2px solid #c0392b" : "1px solid #d8d0c4" }}
          >
            <p style={{ ...mono, fontSize: "13px", fontWeight: 700, color: accent ? "#c0392b" : "#1a1a1a" }}>{val}</p>
            <p style={{ fontSize: "10px", color: "#7a7268", marginTop: "2px" }}>{lbl}</p>
          </div>
        ))}
      </div>

      {/* Ingrédients */}
      <div className="rounded" style={{ background: "#fff", border: "1px solid #d8d0c4" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #d8d0c4" }}>
          <p style={{ ...mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#1a3a5c" }}>
            Ingrédients
          </p>
        </div>
        <div className="px-4">
          {meal.ingredients.map((ing, idx) => (
            <div
              key={ing.id}
              className="flex items-center justify-between py-2.5"
              style={{ borderBottom: idx < meal.ingredients.length - 1 ? "1px solid #d8d0c4" : "none" }}
            >
              <div className="flex items-center gap-2">
                <span>{CATEGORY_ICONS[ing.category] ?? "•"}</span>
                <span style={{ fontSize: "13px", fontWeight: 500 }}>{ing.name}</span>
              </div>
              <span style={{ ...mono, fontSize: "11px", color: "#7a7268" }}>
                {ing.quantity} {ing.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Préparation */}
      <div className="rounded" style={{ background: "#fff", border: "1px solid #d8d0c4" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid #d8d0c4" }}>
          <p style={{ ...mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#1a3a5c" }}>
            Préparation
          </p>
        </div>
        <div className="px-4 py-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex gap-4 py-3"
              style={{ borderBottom: idx < steps.length - 1 ? "1px solid #d8d0c4" : "none" }}
            >
              <span
                className="flex-shrink-0 flex items-center justify-center"
                style={{ ...mono, fontSize: "11px", fontWeight: 700, color: "#fff", background: "#1a1a1a", width: "22px", height: "22px", borderRadius: "3px" }}
              >
                {idx + 1}
              </span>
              <p style={{ fontSize: "13px", color: "#1a1a1a", lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div
        className="rounded px-4 py-3"
        style={{ background: "#fff", border: "1px solid #d8d0c4", borderTop: "3px solid #f39c12" }}
      >
        <p style={{ ...mono, fontSize: "9px", color: "#b7770d", fontWeight: 700, letterSpacing: "1px", marginBottom: "4px" }}>
          💡 CONSEIL NUTRITION
        </p>
        <p style={{ fontSize: "12px", color: "#7a7268", lineHeight: 1.6 }}>
          Préparez vos ingrédients à l&apos;avance (meal prep du dimanche) pour gagner du temps en semaine et respecter plus facilement vos apports nutritionnels.
        </p>
      </div>
    </div>
  );
}
