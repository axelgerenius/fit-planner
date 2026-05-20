import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);

  const sessions = await prisma.workoutSession.findMany({
    where: {
      plan: { userId: session.user.id },
      completed: true,
      completedAt: { gte: twoMonthsAgo },
    },
    select: { completed: true, completedAt: true },
    orderBy: { completedAt: "asc" },
  });

  return NextResponse.json(sessions);
}
