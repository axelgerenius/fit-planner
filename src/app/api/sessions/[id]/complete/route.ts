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

  // Block completing future sessions (allow unchecking regardless)
  if (!workoutSession.completed) {
    const todayIndex = ((new Date().getDay() + 6) % 7); // 0=Mon … 6=Sun
    if (workoutSession.dayOfWeek > todayIndex) {
      return NextResponse.json({ error: "Cette séance n'est pas encore disponible" }, { status: 403 });
    }
  }

  const newState = !workoutSession.completed;

  await prisma.workoutSession.update({
    where: { id },
    data: {
      completed: newState,
      completedAt: newState ? new Date() : null,
    },
  });

  return NextResponse.json({ completed: newState });
}
