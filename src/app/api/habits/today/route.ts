import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const logs = await prisma.habitLog.findMany({
    where: { userId: session.user.id, date: today },
    select: { habitId: true },
  });

  return NextResponse.json(logs.map(l => l.habitId));
}
