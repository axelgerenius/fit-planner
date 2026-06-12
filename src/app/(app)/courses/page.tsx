import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GenerateShoppingListButton from "@/components/generate-shopping-list-button";
import ShoppingListManager from "@/components/shopping-list-manager";

export default async function CoursesPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const weekStart = getWeekStart();

  const shoppingList = await prisma.shoppingList.findFirst({
    where: { userId, weekStart },
    include: { items: { orderBy: { category: "asc" } } },
  });

  const weekLabel = weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 4, letterSpacing: 0.5 }}>Courses</h1>
          <p style={{ fontSize: 13, color: "#6B7280" }}>
            Semaine du {weekLabel}
          </p>
        </div>
        <GenerateShoppingListButton />
      </div>

      {shoppingList ? (
        <ShoppingListManager listId={shoppingList.id} initialItems={shoppingList.items} />
      ) : (
        <div style={{
          background: "#fff", borderRadius: 16, padding: 48,
          textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #E5E7EB",
        }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🛒</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#6B7280", marginBottom: 6 }}>Aucune liste pour cette semaine</p>
          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
            Appuie sur &quot;Générer la liste&quot; pour créer ta liste de courses à partir des menus de la semaine.
          </p>
        </div>
      )}
    </div>
  );
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
