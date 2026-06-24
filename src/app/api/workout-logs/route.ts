import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";
import { z } from "zod";

const exerciseSchema = z.object({
  name: z.string().min(1).max(80),
  sets: z.coerce.number().int().min(1).max(99).optional().nullable(),
  reps: z.string().max(20).optional().nullable(),
  weightKg: z.coerce.number().min(0).max(999).optional().nullable(),
  restSec: z.coerce.number().int().min(0).max(600).optional().nullable(),
});

const schema = z.object({
  sessionId: z.string().optional(),
  sessionName: z.string().min(1).max(80),
  sessionType: z.string().min(1),
  sessionIcon: z.string().max(10).optional().nullable(),
  date: z.string(),
  durationMin: z.coerce.number().int().min(1).max(600).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  exercises: z.array(exerciseSchema).default([]),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
    }

    const { sessionId, sessionName, sessionType, sessionIcon, date, durationMin, notes, exercises } = parsed.data;

    const log = await prisma.workoutLog.create({
      data: {
        userId: session.user.id,
        sessionId: sessionId ?? null,
        sessionName,
        sessionType,
        sessionIcon: sessionIcon ?? null,
        date: new Date(date),
        durationMin: durationMin ?? null,
        notes: notes ?? null,
        exercises: {
          create: exercises
            .filter(e => e.name.trim())
            .map((e, i) => ({
              name: e.name,
              sets: e.sets ?? null,
              reps: e.reps ?? null,
              weightKg: e.weightKg ?? null,
              restSec: e.restSec ?? null,
              order: i,
            })),
        },
      },
      include: { exercises: true },
    });

    await notify(session.user.id, {
      type: "WORKOUT_LOGGED",
      title: "Séance enregistrée",
      message: `"${log.sessionName}" a bien été ajoutée à ton carnet.`,
      link: "/carnet",
    });

    return NextResponse.json(log, { status: 201 });
  } catch (err) {
    console.error("[POST /api/workout-logs]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 50);
    const offset = Number(searchParams.get("offset") ?? "0");

    const logs = await prisma.workoutLog.findMany({
      where: { userId: session.user.id },
      include: { exercises: { orderBy: { order: "asc" } } },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.workoutLog.count({ where: { userId: session.user.id } });

    return NextResponse.json({ logs, total });
  } catch (err) {
    console.error("[GET /api/workout-logs]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
