import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">🛒 Liste de courses</h1>
          <p className="text-muted-foreground mt-1">
            Semaine du {weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
          </p>
        </div>
        <GenerateShoppingListButton />
      </div>

      {shoppingList ? (
        <ShoppingListManager
          listId={shoppingList.id}
          initialItems={shoppingList.items}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg mb-2">Aucune liste pour cette semaine</p>
            <p className="text-sm">
              Cliquez sur &quot;Générer la liste&quot; pour créer votre liste de courses à partir des menus de la semaine.
            </p>
          </CardContent>
        </Card>
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
