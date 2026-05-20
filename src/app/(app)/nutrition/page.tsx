import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const DAY_NAMES = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const DAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MEAL_CONFIG: Record<string, { label: string; icon: string; borderColor: string }> = {
  BREAKFAST: { label: "Petit-déjeuner", icon: "🥣", borderColor: "#f39c12" },
  LUNCH:     { label: "Déjeuner",       icon: "🍽️", borderColor: "#2c7a4b" },
  DINNER:    { label: "Dîner",          icon: "🌙", borderColor: "#c0392b" },
  SNACK:     { label: "Collation",      icon: "🍎", borderColor: "#1a3a5c" },
};

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

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
    return <div className="text-center py-20 text-muted-foreground">Aucun plan nutritionnel trouvé.</div>;
  }

  return (
    <div className="space-y-3 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 style={{ ...display, fontSize: "26px", letterSpacing: "2px" }}>NUTRITION</h1>
        <span
          style={{ ...mono, fontSize: "10px", background: "#1a1a1a", color: "#f5f0e8", padding: "4px 10px", borderRadius: "3px" }}
        >
          ~{Math.round(profile?.targetCalories ?? 0)} KCAL
        </span>
      </div>

      <Tabs defaultValue={String(todayIndex)}>
        {/* Sélecteur jours */}
        <TabsList
          className="flex w-full h-auto p-0 gap-0 rounded-none"
          style={{ background: "#f5f0e8", borderBottom: "1px solid #d8d0c4", borderTop: "1px solid #d8d0c4" }}
        >
          {nutritionPlan.weekMenus.map((menu) => {
            const isToday = menu.dayOfWeek === todayIndex;
            return (
              <TabsTrigger
                key={menu.id}
                value={String(menu.dayOfWeek)}
                className="flex-1 rounded-none border-r last:border-r-0 py-2 transition-all data-[state=active]:shadow-none"
                style={{
                  ...mono,
                  fontSize: "11px",
                  borderRight: "1px solid #d8d0c4",
                  fontWeight: isToday ? 700 : 500,
                }}
              >
                {DAY_SHORT[menu.dayOfWeek]}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {nutritionPlan.weekMenus.map((menu) => (
          <TabsContent key={menu.id} value={String(menu.dayOfWeek)} className="mt-3 space-y-3">
            {/* Macros */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { val: Math.round(menu.totalCalories), lbl: "kcal", accent: true },
                { val: `${Math.round(menu.totalProtein)}g`, lbl: "protéines" },
                { val: `${Math.round(menu.totalCarbs)}g`, lbl: "glucides" },
                { val: `${Math.round(menu.totalFat)}g`, lbl: "lipides" },
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

            {/* Repas */}
            {menu.meals.map((meal) => {
              const cfg = MEAL_CONFIG[meal.type] ?? MEAL_CONFIG.SNACK;
              return (
                <div
                  key={meal.id}
                  className="rounded p-4"
                  style={{ background: "#fff", border: "1px solid #d8d0c4", borderLeft: `4px solid ${cfg.borderColor}` }}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="flex items-center justify-center text-xl flex-shrink-0"
                      style={{ width: "36px", height: "36px", background: "#ede8df", borderRadius: "4px" }}
                    >
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ ...mono, fontSize: "10px", color: "#7a7268" }}>{cfg.label.toUpperCase()}</p>
                      <p className="font-semibold text-sm leading-tight">{meal.name}</p>
                    </div>
                    <Link
                      href={`/nutrition/recette/${meal.id}`}
                      style={{
                        ...mono,
                        fontSize: "10px",
                        padding: "4px 10px",
                        borderRadius: "3px",
                        background: "#1a1a1a",
                        color: "#f5f0e8",
                        textDecoration: "none",
                        flexShrink: 0,
                        letterSpacing: "0.5px",
                      }}
                    >
                      RECETTE →
                    </Link>
                  </div>

                  <p style={{ fontSize: "12px", color: "#7a7268", lineHeight: 1.6, marginBottom: "8px" }}>
                    {meal.ingredients.map((ing) => `${ing.name} ${ing.quantity}${ing.unit}`).join(" · ")}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { lbl: `${Math.round(meal.calories)} kcal`, accent: true },
                      { lbl: `P ${Math.round(meal.protein)}g`, navy: true },
                      { lbl: `G ${Math.round(meal.carbs)}g` },
                      { lbl: `L ${Math.round(meal.fat)}g` },
                    ].map(({ lbl, accent, navy }) => (
                      <span
                        key={lbl}
                        style={{
                          ...mono,
                          fontSize: "10px",
                          padding: "3px 7px",
                          borderRadius: "3px",
                          background: "#ede8df",
                          border: accent ? "1px solid #c0392b" : navy ? "1px solid #1a3a5c" : "1px solid #d8d0c4",
                          color: accent ? "#c0392b" : navy ? "#1a3a5c" : "#7a7268",
                        }}
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
