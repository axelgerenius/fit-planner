"use client";

import { useState } from "react";
import Link from "next/link";

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

const DAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MEAL_CONFIG: Record<string, { label: string; icon: string; borderColor: string }> = {
  BREAKFAST: { label: "Petit-déjeuner", icon: "🥣", borderColor: "#FF6500" },
  LUNCH:     { label: "Déjeuner",       icon: "🍽️", borderColor: "#22C55E" },
  DINNER:    { label: "Dîner",          icon: "🌙", borderColor: "#3B82F6" },
  SNACK:     { label: "Collation",      icon: "🍎", borderColor: "#F59E0B" },
};

type Ingredient = { id: string; name: string; quantity: number; unit: string; category: string };
type Meal = { id: string; name: string; type: string; calories: number; protein: number; carbs: number; fat: number; ingredients: Ingredient[] };
type WeekMenu = { id: string; dayOfWeek: number; totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number; meals: Meal[] };

type Props = {
  targetCalories: number;
  todayIndex: number;
  weekMenus: WeekMenu[];
};

export default function NutritionClient({ targetCalories, todayIndex, weekMenus }: Props) {
  const [activeDay, setActiveDay] = useState(todayIndex);
  const menu = weekMenus.find(m => m.dayOfWeek === activeDay) ?? weekMenus[0];

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ ...display, fontSize: 26, letterSpacing: 2, color: "#111827" }}>NUTRITION</h1>
        <span style={{ ...mono, fontSize: 10, background: "#111827", color: "#fff", padding: "4px 12px", borderRadius: 8 }}>
          ~{Math.round(targetCalories)} KCAL
        </span>
      </div>

      {/* Day selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {weekMenus.map(m => {
          const isActive = m.dayOfWeek === activeDay;
          const isToday = m.dayOfWeek === todayIndex;
          return (
            <button
              key={m.id}
              onClick={() => setActiveDay(m.dayOfWeek)}
              style={{
                ...mono,
                fontSize: 11,
                padding: "8px 14px",
                borderRadius: 20,
                border: "none",
                background: isActive ? "#FF6500" : "#fff",
                color: isActive ? "#fff" : isToday ? "#FF6500" : "#6B7280",
                fontWeight: isToday || isActive ? 700 : 400,
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: isActive ? "0 2px 8px rgba(255,101,0,0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              {DAY_SHORT[m.dayOfWeek]}
              {isToday && !isActive && (
                <span style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, borderRadius: "50%", background: "#FF6500", display: "block" }} />
              )}
            </button>
          );
        })}
      </div>

      {menu && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Macros */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {[
              { val: Math.round(menu.totalCalories), lbl: "kcal", accent: true },
              { val: `${Math.round(menu.totalProtein)}g`, lbl: "protéines" },
              { val: `${Math.round(menu.totalCarbs)}g`, lbl: "glucides" },
              { val: `${Math.round(menu.totalFat)}g`, lbl: "lipides" },
            ].map(({ val, lbl, accent }) => (
              <div key={lbl} style={{
                background: "#fff",
                borderRadius: 14,
                padding: "12px 8px",
                textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: accent ? "2px solid #FF6500" : "1px solid #E5E7EB",
              }}>
                <p style={{ ...mono, fontSize: 13, fontWeight: 700, color: accent ? "#FF6500" : "#111827" }}>{val}</p>
                <p style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{lbl}</p>
              </div>
            ))}
          </div>

          {/* Meals */}
          {menu.meals.map(meal => {
            const cfg = MEAL_CONFIG[meal.type] ?? MEAL_CONFIG.SNACK;
            return (
              <div key={meal.id} style={{
                background: "#fff",
                borderRadius: 16,
                borderLeft: `4px solid ${cfg.borderColor}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                padding: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "#F3F4F6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {cfg.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ ...mono, fontSize: 9, color: "#6B7280", letterSpacing: 1, marginBottom: 2 }}>
                      {cfg.label.toUpperCase()}
                    </p>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", lineHeight: 1.2 }}>{meal.name}</p>
                  </div>
                  <Link
                    href={`/nutrition/recette/${meal.id}`}
                    style={{
                      ...mono, fontSize: 10, padding: "6px 12px",
                      borderRadius: 8, background: "#111827", color: "#fff",
                      textDecoration: "none", flexShrink: 0, letterSpacing: "0.5px",
                    }}
                  >
                    RECETTE →
                  </Link>
                </div>

                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 10 }}>
                  {meal.ingredients.map(ing => `${ing.name} ${ing.quantity}${ing.unit}`).join(" · ")}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    { lbl: `${Math.round(meal.calories)} kcal`, color: "#FF6500", bg: "#FFF3ED" },
                    { lbl: `P ${Math.round(meal.protein)}g`, color: "#3B82F6", bg: "#EFF6FF" },
                    { lbl: `G ${Math.round(meal.carbs)}g`, color: "#6B7280", bg: "#F3F4F6" },
                    { lbl: `L ${Math.round(meal.fat)}g`, color: "#6B7280", bg: "#F3F4F6" },
                  ].map(({ lbl, color, bg }) => (
                    <span key={lbl} style={{ ...mono, fontSize: 10, padding: "3px 8px", borderRadius: 6, background: bg, color }}>
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Lien courses */}
          <Link href="/courses" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fff", borderRadius: 16, padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textDecoration: "none",
            border: "1px solid #E5E7EB", marginTop: 4,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FFF3ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                🛒
              </div>
              <div>
                <p style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#111827" }}>LISTE DE COURSES</p>
                <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Générer la liste pour cette semaine</p>
              </div>
            </div>
            <span style={{ color: "#FF6500", fontSize: 18 }}>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
