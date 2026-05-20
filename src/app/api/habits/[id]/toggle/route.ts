import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const habit = await prisma.habit.findFirst({ where: { id, userId: session.user.id } });
  if (!habit) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId: id, date: today } },
  });

  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
    return NextResponse.json({ checked: false });
  } else {
    await prisma.habitLog.create({ data: { habitId: id, userId: session.user.id, date: today } });
    return NextResponse.json({ checked: true });
  }
}
