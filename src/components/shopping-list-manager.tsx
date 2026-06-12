"use client";

import { useState } from "react";

type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
};

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  MEAT_FISH:          { label: "Viandes & Poissons",         icon: "🥩" },
  DAIRY_EGGS:         { label: "Produits laitiers & Œufs",   icon: "🥚" },
  FRUITS_VEGETABLES:  { label: "Fruits & Légumes",           icon: "🥦" },
  CEREALS_LEGUMES:    { label: "Céréales & Légumineuses",    icon: "🌾" },
  FATS_OILS:          { label: "Matières grasses",           icon: "🫒" },
  CONDIMENTS:         { label: "Condiments",                  icon: "🧂" },
  OTHER:              { label: "Autres",                      icon: "📦" },
};

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };

export default function ShoppingListManager({ listId, initialItems }: { listId: string; initialItems: Item[] }) {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>(
    Object.fromEntries(initialItems.map(i => [i.id, i.checked]))
  );

  const total = initialItems.length;
  const checked = Object.values(checkedState).filter(Boolean).length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const allDone = total > 0 && checked === total;

  async function toggle(id: string) {
    setCheckedState(prev => ({ ...prev, [id]: !prev[id] }));
    await fetch(`/api/shopping/${id}/toggle`, { method: "POST" });
  }

  async function reset() {
    setCheckedState(Object.fromEntries(initialItems.map(i => [i.id, false])));
    await fetch(`/api/shopping/${listId}/reset`, { method: "POST" });
  }

  const grouped = initialItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Progress card */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{checked}</span>
            <span style={{ fontSize: 13, color: "#6B7280" }}> / {total} articles</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...mono, fontSize: 13, color: allDone ? "#22C55E" : "#FF6500", fontWeight: 700 }}>{pct}%</span>
            <button
              onClick={reset}
              style={{ ...mono, fontSize: 10, padding: "6px 14px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "transparent", color: "#6B7280", cursor: "pointer" }}
            >
              RESET
            </button>
          </div>
        </div>
        <div style={{ height: 6, background: "#F3F4F6", borderRadius: 99 }}>
          <div style={{ height: "100%", background: allDone ? "#22C55E" : "#FF6500", width: `${pct}%`, borderRadius: 99, transition: "width 0.4s" }} />
        </div>
        {allDone && (
          <p style={{ ...mono, fontSize: 10, color: "#22C55E", letterSpacing: 1, marginTop: 8, textAlign: "right" }}>
            🎉 TOUS LES ARTICLES COCHÉS !
          </p>
        )}
      </div>

      {/* Items by category */}
      {Object.entries(CATEGORY_LABELS).map(([cat, { label, icon }]) => {
        const items = grouped[cat];
        if (!items?.length) return null;
        return (
          <div key={cat} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 10, overflow: "hidden" }}>
            {/* Category header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ ...mono, fontSize: 10, letterSpacing: 1, color: "#111827", fontWeight: 700 }}>
                {label.toUpperCase()}
              </span>
              <span style={{ ...mono, fontSize: 10, color: "#6B7280", marginLeft: "auto" }}>
                {items.filter(i => checkedState[i.id]).length}/{items.length}
              </span>
            </div>

            {/* Items */}
            {items.map((item, idx) => {
              const isChecked = checkedState[item.id] ?? false;
              return (
                <div
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px",
                    borderBottom: idx < items.length - 1 ? "1px solid #F9FAFB" : "none",
                    cursor: "pointer",
                    opacity: isChecked ? 0.45 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <div style={{
                    width: 22, height: 22, flexShrink: 0,
                    borderRadius: "50%",
                    border: `2px solid ${isChecked ? "#22C55E" : "#D1D5DB"}`,
                    background: isChecked ? "#22C55E" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {isChecked && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <span style={{ flex: 1, fontSize: 14, fontWeight: isChecked ? 400 : 500, color: isChecked ? "#9CA3AF" : "#111827", textDecoration: isChecked ? "line-through" : "none" }}>
                    {item.name}
                  </span>
                  <span style={{ ...mono, fontSize: 11, color: "#6B7280" }}>
                    {item.quantity} {item.unit}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
