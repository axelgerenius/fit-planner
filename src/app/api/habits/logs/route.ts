import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Returns habit completion per day for the last N days
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Math.min(Number(searchParams.get("days") ?? "30"), 90);

  const from = new Date();
  from.setUTCHours(0, 0, 0, 0);
  from.setDate(from.getDate() - days + 1);

  const [logs, totalHabits] = await Promise.all([
    prisma.habitLog.findMany({
      where: { userId: session.user.id, date: { gte: from } },
      select: { date: true },
    }),
    prisma.habit.count({ where: { userId: session.user.id, isActive: true } }),
  ]);

  // Group by date
  const byDate: Record<string, number> = {};
  for (const log of logs) {
    const key = log.date.toISOString().split("T")[0];
    byDate[key] = (byDate[key] ?? 0) + 1;
  }

  return NextResponse.json({ byDate, totalHabits });
}
