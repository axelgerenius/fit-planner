import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const workoutSession = await prisma.workoutSession.findFirst({
    where: { id, plan: { userId: session.user.id } },
  });

  if (!workoutSession) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await prisma.workoutSession.update({
    where: { id },
    data: { completed: true, completedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
