import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const exerciseSchema = z.object({
  name: z.string().min(1).max(80),
  sets: z.coerce.number().int().min(1).max(99).optional().nullable(),
  reps: z.string().max(20).optional().nullable(),
  restSec: z.coerce.number().int().min(0).max(600).optional().nullable(),
  weightKg: z.coerce.number().min(0).max(999).optional().nullable(),
});

const schema = z.object({
  name: z.string().min(1).max(80),
  type: z.enum(["STRENGTH", "CARDIO", "HIIT", "YOGA_STRETCH", "FULL_BODY", "REST", "RUNNING", "CYCLING", "CROSSFIT", "MARTIAL_ARTS"]),
  icon: z.string().max(10).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  durationMin: z.coerce.number().int().min(5).max(300).optional(),
  exercises: z.array(exerciseSchema).optional(),
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

    const workoutSession = await prisma.workoutSession.findFirst({
      where: { id, plan: { userId: session.user.id } },
    });
    if (!workoutSession) return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });

    const updated = await prisma.$transaction(async (tx) => {
      const session = await tx.workoutSession.update({
        where: { id },
        data: {
          name: parsed.data.name,
          type: parsed.data.type as never,
          icon: parsed.data.icon ?? null,
          notes: parsed.data.notes ?? null,
          ...(parsed.data.durationMin ? { durationMin: parsed.data.durationMin } : {}),
        },
      });

      if (parsed.data.exercises !== undefined) {
        await tx.exercise.deleteMany({ where: { sessionId: id } });
        if (parsed.data.exercises.length > 0) {
          await tx.exercise.createMany({
            data: parsed.data.exercises.map((ex, i) => ({
              sessionId: id,
              name: ex.name,
              sets: ex.sets ?? null,
              reps: ex.reps ?? null,
              restSec: ex.restSec ?? null,
              weightKg: ex.weightKg ?? null,
              order: i,
            })),
          });
        }
      }

      return session;
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/sessions/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
