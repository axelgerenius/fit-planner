import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ weight: z.number().min(20).max(300) });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const logs = await prisma.weightLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
    take: 90,
  });

  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const log = await prisma.weightLog.upsert({
    where: { userId_date: { userId: session.user.id, date: today } },
    update: { weight: parsed.data.weight },
    create: { userId: session.user.id, weight: parsed.data.weight, date: today },
  });

  return NextResponse.json(log);
}
