import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ weight: z.number().min(20).max(300) });

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Math.min(Number(searchParams.get("days") ?? "90"), 365);

  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));

  const logs = await prisma.weightLog.findMany({
    where: { userId: session.user.id, date: { gte: from } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const _now = new Date();
  const today = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate());

  const log = await prisma.weightLog.upsert({
    where: { userId_date: { userId: session.user.id, date: today } },
    update: { weight: parsed.data.weight },
    create: { userId: session.user.id, weight: parsed.data.weight, date: today },
  });

  return NextResponse.json(log);
}
