import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(60),
  emoji: z.string().max(4).default("✅"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(habits);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const habit = await prisma.habit.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return NextResponse.json(habit, { status: 201 });
}
