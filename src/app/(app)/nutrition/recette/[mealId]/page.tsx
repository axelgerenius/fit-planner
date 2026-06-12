import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, string> = {
  MEAT_FISH: "🥩", DAIRY_EGGS: "🥚", FRUITS_VEGETABLES: "🥦",
  CEREALS_LEGUMES: "🌾", FATS_OILS: "🫒", CONDIMENTS: "🧂", OTHER: "📦",
};
const MEAL_TYPE_LABELS: Record<string, string> = {
  BREAKFAST: "Petit-déjeuner", LUNCH: "Déjeuner", DINNER: "Dîner", SNACK: "Collation",
};
const MEAL_BORDER: Record<string, string> = {
  BREAKFAST: "#FF6500", LUNCH: "#22C55E", DINNER: "#3B82F6", SNACK: "#F59E0B",
};

type Ingredient = { name: string; quantity: number; unit: string; category: string };

function generateSteps(mealName: string, ingredients: Ingredient[]): string[] {
  const steps: string[] = [];
  const meats     = ingredients.filter(i => i.category === "MEAT_FISH");
  const veggies   = ingredients.filter(i => i.category === "FRUITS_VEGETABLES");
  const cereals   = ingredients.filter(i => i.category === "CEREALS_LEGUMES");
  const dairy     = ingredients.filter(i => i.category === "DAIRY_EGGS");
  const fats      = ingredients.filter(i => i.category === "FATS_OILS");
  const condiments = ingredients.filter(i => i.category === "CONDIMENTS");

  steps.push("Rassembler et peser tous les ingrédients avant de commencer.");
  if (cereals.length > 0)
    steps.push(`Faire cuire ${cereals.map(i => i.name.toLowerCase()).join(", ")} selon les instructions de l'emballage.`);
  if (veggies.length > 0)
    steps.push(`Laver et découper ${veggies.map(i => i.name.toLowerCase()).join(", ")} en morceaux réguliers.`);
  if (meats.length > 0) {
    const names = meats.map(i => i.name.toLowerCase()).join(" et ");
    steps.push(fats.length > 0
      ? `Faire chauffer un filet d'huile. Saisir ${names} à feu vif 2 min de chaque côté, puis à feu moyen jusqu'à cuisson complète.`
      : `Cuire ${names} à la vapeur ou au four à 180 °C jusqu'à cuisson complète.`);
  }
  if (dairy.length > 0)
    steps.push(`Incorporer ${dairy.map(i => i.name.toLowerCase()).join(", ")} en fin de préparation.`);
  if (condiments.length > 0)
    steps.push(`Assaisonner avec ${condiments.map(i => i.name.toLowerCase()).join(", ")} selon votre goût.`);
  steps.push(`Dresser et servir ${mealName.toLowerCase()} immédiatement.`);
  return steps;
}

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

export default async function RecettePage({ params }: { params: Promise<{ mealId: string }> }) {
  const session = await auth();
  const userId = session!.user!.id!;
  const { mealId } = await params;

  const meal = await prisma.meal.findFirst({
    where: { id: mealId, dayMenu: { plan: { userId } } },
    include: { ingredients: { orderBy: { category: "asc" } } },
  });

  if (!meal) notFound();

  const steps = generateSteps(meal.name, meal.ingredients);
  const borderColor = MEAL_BORDER[meal.type] ?? "#FF6500";

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingBottom: 32 }}>
      {/* Back */}
      <Link
        href="/nutrition"
        style={{ ...mono, fontSize: 10, color: "#FF6500", textDecoration: "none", letterSpacing: 1, display: "inline-block", marginBottom: 16 }}
      >
        ← RETOUR AU MENU
      </Link>

      {/* Hero header */}
      <div style={{
        background: "#111827",
        borderRadius: 20,
        borderLeft: `5px solid ${borderColor}`,
        padding: "20px 24px",
        marginBottom: 14,
      }}>
        <p style={{ ...mono, fontSize: 9, color: "#6B7280", letterSpacing: 2, marginBottom: 6 }}>
          {MEAL_TYPE_LABELS[meal.type]?.toUpperCase()} — RECETTE
        </p>
        <h1 style={{ ...display, fontSize: 28, letterSpacing: 2, color: "#fff", lineHeight: 1.1 }}>
          {meal.name.toUpperCase()}
        </h1>
      </div>

      {/* Macros */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
        {[
          { val: `${Math.round(meal.calories)}`, lbl: "kcal", accent: true },
          { val: `${Math.round(meal.protein)}g`, lbl: "protéines" },
          { val: `${Math.round(meal.carbs)}g`, lbl: "glucides" },
          { val: `${Math.round(meal.fat)}g`, lbl: "lipides" },
        ].map(({ val, lbl, accent }) => (
          <div key={lbl} style={{
            background: "#fff", borderRadius: 14, padding: "12px 8px", textAlign: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            border: accent ? `2px solid ${borderColor}` : "1px solid #E5E7EB",
          }}>
            <p style={{ ...mono, fontSize: 13, fontWeight: 700, color: accent ? borderColor : "#111827" }}>{val}</p>
            <p style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{lbl}</p>
          </div>
        ))}
      </div>

      {/* Ingrédients */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
          <p style={{ ...mono, fontSize: 10, letterSpacing: 2, color: "#111827", fontWeight: 700 }}>INGRÉDIENTS</p>
        </div>
        <div style={{ padding: "0 20px" }}>
          {meal.ingredients.map((ing, idx) => (
            <div key={ing.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 0",
              borderBottom: idx < meal.ingredients.length - 1 ? "1px solid #F3F4F6" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[ing.category] ?? "•"}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{ing.name}</span>
              </div>
              <span style={{ ...mono, fontSize: 11, color: "#6B7280" }}>{ing.quantity} {ing.unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Préparation */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
          <p style={{ ...mono, fontSize: 10, letterSpacing: 2, color: "#111827", fontWeight: 700 }}>PRÉPARATION</p>
        </div>
        <div style={{ padding: "8px 20px" }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{
              display: "flex", gap: 14, padding: "12px 0",
              borderBottom: idx < steps.length - 1 ? "1px solid #F3F4F6" : "none",
            }}>
              <span style={{
                ...mono, fontSize: 11, fontWeight: 700, color: "#fff",
                background: borderColor, width: 24, height: 24, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {idx + 1}
              </span>
              <p style={{ fontSize: 13, color: "#111827", lineHeight: 1.65 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conseil */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "14px 20px", marginBottom: 14, borderTop: `3px solid #F59E0B` }}>
        <p style={{ ...mono, fontSize: 9, color: "#D97706", fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>💡 CONSEIL NUTRITION</p>
        <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.65 }}>
          Préparez vos ingrédients à l&apos;avance (meal prep du dimanche) pour gagner du temps en semaine et respecter plus facilement vos apports nutritionnels.
        </p>
      </div>

      {/* Marmiton */}
      <a
        href={`https://www.marmiton.org/recettes/recherche.aspx?aqt=${encodeURIComponent(meal.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#fff", borderRadius: 16, padding: "14px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textDecoration: "none",
          border: "1px solid #E5E7EB",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FFF3ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            👨‍🍳
          </div>
          <div>
            <p style={{ ...mono, fontSize: 10, color: "#111827", letterSpacing: 1, fontWeight: 700 }}>VOIR SUR MARMITON</p>
            <p style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
              Variantes pour &laquo;&nbsp;{meal.name}&nbsp;&raquo;
            </p>
          </div>
        </div>
        <span style={{ color: "#FF6500", fontSize: 18 }}>→</span>
      </a>
    </div>
  );
}
