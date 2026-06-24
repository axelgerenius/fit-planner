import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notifications";

const DAY_LABELS: Record<number, string> = {
  0: "Lundi", 1: "Mardi", 2: "Mercredi", 3: "Jeudi",
  4: "Vendredi", 5: "Samedi", 6: "Dimanche",
};

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authSession = await auth();
    if (!authSession?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;

    const workoutSession = await prisma.workoutSession.findFirst({
      where: { id, plan: { userId: authSession.user.id } },
      include: { exercises: { orderBy: { order: "asc" } } },
    });

    if (!workoutSession) return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });
    if (workoutSession.type === "REST") return NextResponse.json({ error: "Impossible de reporter un jour de repos" }, { status: 400 });
    if (workoutSession.completed) return NextResponse.json({ error: "Séance déjà effectuée" }, { status: 400 });

    // Next non-REST, non-completed session later in the week
    const targetSession = await prisma.workoutSession.findFirst({
      where: {
        planId: workoutSession.planId,
        dayOfWeek: { gt: workoutSession.dayOfWeek },
        type: { not: "REST" as never },
        completed: false,
      },
      include: { exercises: { orderBy: { order: "asc" } } },
      orderBy: { dayOfWeek: "asc" },
    });

    if (!targetSession) {
      return NextResponse.json(
        { error: "Aucune séance d'entraînement disponible cette semaine pour le report" },
        { status: 400 }
      );
    }

    const postponedExes = workoutSession.exercises;
    const existingExes = targetSession.exercises;

    // Interleave: existing[i], postponed[i] → superset pairs
    const merged: {
      name: string; sets: number | null; reps: string | null;
      restSec: number | null; weightKg: number | null;
    }[] = [];
    const maxLen = Math.max(postponedExes.length, existingExes.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < existingExes.length) {
        merged.push({
          name: existingExes[i].name,
          sets: existingExes[i].sets,
          reps: existingExes[i].reps,
          restSec: existingExes[i].restSec,
          weightKg: existingExes[i].weightKg,
        });
      }
      if (i < postponedExes.length) {
        merged.push({
          name: `⟲ ${postponedExes[i].name}`,
          sets: postponedExes[i].sets,
          reps: postponedExes[i].reps,
          restSec: postponedExes[i].restSec,
          weightKg: postponedExes[i].weightKg,
        });
      }
    }

    const targetNotes = [
      targetSession.notes,
      `⟲ Exercices rattrapés de "${workoutSession.name}"`,
    ].filter(Boolean).join("\n");

    await prisma.$transaction(async (tx) => {
      // Merge exercises into target session
      await tx.exercise.deleteMany({ where: { sessionId: targetSession.id } });
      if (merged.length > 0) {
        await tx.exercise.createMany({
          data: merged.map((ex, i) => ({
            sessionId: targetSession.id,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            restSec: ex.restSec,
            weightKg: ex.weightKg,
            order: i,
          })),
        });
      }
      await tx.workoutSession.update({
        where: { id: targetSession.id },
        data: {
          notes: targetNotes,
          durationMin: targetSession.durationMin + workoutSession.durationMin,
        },
      });

      // Convert current session to REST
      await tx.exercise.deleteMany({ where: { sessionId: id } });
      await tx.workoutSession.update({
        where: { id },
        data: {
          type: "REST" as never,
          name: "Repos",
          notes: `⟲ "${workoutSession.name}" reportée au ${DAY_LABELS[targetSession.dayOfWeek]}`,
          durationMin: 0,
          icon: null,
        },
      });
    });

    await notify(authSession.user.id, {
      type: "SESSION_POSTPONED",
      title: "Séance reportée",
      message: `"${workoutSession.name}" a été reportée et fusionnée avec "${targetSession.name}" (${DAY_LABELS[targetSession.dayOfWeek]}).`,
      link: "/planning",
    });

    return NextResponse.json({
      ok: true,
      targetName: targetSession.name,
      targetDay: DAY_LABELS[targetSession.dayOfWeek],
    });
  } catch (err) {
    console.error("[POST /api/sessions/:id/postpone]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
