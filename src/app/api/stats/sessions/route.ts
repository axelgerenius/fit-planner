import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Math.min(Number(searchParams.get("days") ?? "30"), 365);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCHours(0, 0, 0, 0);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - (days - 1));

  const sessions = await prisma.workoutSession.findMany({
    where: {
      plan: { userId: session.user.id },
      completed: true,
      completedAt: { gte: thirtyDaysAgo },
    },
    select: { completedAt: true },
    orderBy: { completedAt: "asc" },
  });

  // Group by day
  const byDate: Record<string, number> = {};
  for (const s of sessions) {
    if (!s.completedAt) continue;
    const key = s.completedAt.toISOString().split("T")[0];
    byDate[key] = (byDate[key] ?? 0) + 1;
  }

  return NextResponse.json({ byDate });
}
