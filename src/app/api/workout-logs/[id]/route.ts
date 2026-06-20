import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const exerciseSchema = z.object({
  name: z.string().min(1).max(80),
  sets: z.coerce.number().int().min(1).max(99).optional().nullable(),
  reps: z.string().max(20).optional().nullable(),
  weightKg: z.coerce.number().min(0).max(999).optional().nullable(),
  restSec: z.coerce.number().int().min(0).max(600).optional().nullable(),
});

const schema = z.object({
  sessionName: z.string().min(1).max(80),
  date: z.string(),
  durationMin: z.coerce.number().int().min(1).max(600).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  exercises: z.array(exerciseSchema).default([]),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.workoutLog.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });

    const { sessionName, date, durationMin, notes, exercises } = parsed.data;

    const updated = await prisma.$transaction(async (tx) => {
      const log = await tx.workoutLog.update({
        where: { id },
        data: {
          sessionName,
          date: new Date(date),
          durationMin: durationMin ?? null,
          notes: notes ?? null,
        },
      });

      await tx.workoutLogExercise.deleteMany({ where: { logId: id } });
      const cleaned = exercises.filter(e => e.name.trim());
      if (cleaned.length > 0) {
        await tx.workoutLogExercise.createMany({
          data: cleaned.map((e, i) => ({
            logId: id,
            name: e.name,
            sets: e.sets ?? null,
            reps: e.reps ?? null,
            weightKg: e.weightKg ?? null,
            restSec: e.restSec ?? null,
            order: i,
          })),
        });
      }

      return log;
    });

    const result = await prisma.workoutLog.findUnique({
      where: { id: updated.id },
      include: { exercises: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[PATCH /api/workout-logs/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.workoutLog.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });

    await prisma.workoutLog.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/workout-logs/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
