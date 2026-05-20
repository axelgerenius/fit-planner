import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const logs = await prisma.habitLog.findMany({
    where: { userId: session.user.id, date: today },
    select: { habitId: true },
  });

  return NextResponse.json(logs.map(l => l.habitId));
}
