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

const CATEGORY_LABELS: Record<string, string> = {
  MEAT_FISH: "Viandes & Poissons",
  DAIRY_EGGS: "Produits laitiers & Œufs",
  FRUITS_VEGETABLES: "Fruits & Légumes",
  CEREALS_LEGUMES: "Céréales & Légumineuses",
  FATS_OILS: "Matières grasses",
  CONDIMENTS: "Condiments",
  OTHER: "Autres",
};

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };

export default function ShoppingListManager({
  listId,
  initialItems,
}: {
  listId: string;
  initialItems: Item[];
}) {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>(
    Object.fromEntries(initialItems.map((i) => [i.id, i.checked]))
  );

  const total = initialItems.length;
  const checked = Object.values(checkedState).filter(Boolean).length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  async function toggle(id: string) {
    setCheckedState((prev) => ({ ...prev, [id]: !prev[id] }));
    await fetch(`/api/shopping/${id}/toggle`, { method: "POST" });
  }

  async function reset() {
    setCheckedState(Object.fromEntries(initialItems.map((i) => [i.id, false])));
    await fetch(`/api/shopping/${listId}/reset`, { method: "POST" });
  }

  const grouped = initialItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, Item[]>
  );

  return (
    <div className="space-y-0 pb-8">
      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span style={{ fontSize: "12px", color: "#1a1a1a" }}>
            <span style={{ fontWeight: 600 }}>{checked}</span> / {total} articles
          </span>
          <div className="flex items-center gap-3">
            <span style={{ ...mono, fontSize: "12px", color: "#c0392b", fontWeight: 700 }}>{pct}%</span>
            <button
              onClick={reset}
              style={{
                ...mono,
                fontSize: "10px",
                padding: "5px 12px",
                borderRadius: "3px",
                border: "1px solid #c0392b",
                background: "transparent",
                color: "#c0392b",
                cursor: "pointer",
              }}
            >
              RESET
            </button>
          </div>
        </div>
        <div style={{ height: "5px", background: "#d8d0c4", borderRadius: "0" }}>
          <div
            style={{ height: "100%", background: "#c0392b", width: `${pct}%`, transition: "width 0.4s" }}
          />
        </div>
      </div>

      {/* Liste */}
      {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
        const items = grouped[cat];
        if (!items?.length) return null;
        return (
          <div key={cat}>
            <p
              style={{
                ...mono,
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#1a3a5c",
                padding: "14px 0 6px",
                borderBottom: "1px solid #d8d0c4",
                marginBottom: 0,
              }}
            >
              {label}
            </p>
            {items.map((item) => {
              const isChecked = checkedState[item.id] ?? false;
              return (
                <div
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-3 cursor-pointer transition-opacity"
                  style={{
                    padding: "12px 2px",
                    borderBottom: "1px solid #d8d0c4",
                    opacity: isChecked ? 0.38 : 1,
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "3px",
                      border: isChecked ? "2px solid #c0392b" : "2px solid #d8d0c4",
                      background: isChecked ? "#c0392b" : "#fff",
                    }}
                  >
                    {isChecked && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <span
                    className="flex-1 text-sm font-medium"
                    style={{ textDecoration: isChecked ? "line-through" : "none", color: isChecked ? "#7a7268" : "#1a1a1a", fontWeight: isChecked ? 400 : 500 }}
                  >
                    {item.name}
                  </span>
                  <span style={{ ...mono, fontSize: "10px", color: "#7a7268", textAlign: "right" }}>
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
