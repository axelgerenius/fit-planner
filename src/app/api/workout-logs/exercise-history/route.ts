import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Returns all logs for a specific exercise name (for progression chart)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const exerciseName = searchParams.get("name");
    if (!exerciseName) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

    const entries = await prisma.workoutLogExercise.findMany({
      where: {
        name: { contains: exerciseName, mode: "insensitive" },
        log: { userId: session.user.id },
      },
      include: { log: { select: { date: true } } },
      orderBy: { log: { date: "asc" } },
      take: 60,
    });

    return NextResponse.json(entries.map(e => ({
      date: e.log.date,
      sets: e.sets,
      reps: e.reps,
      weightKg: e.weightKg,
    })));
  } catch (err) {
    console.error("[GET /api/workout-logs/exercise-history]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Returns distinct exercise names for the current user
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const exercises = await prisma.workoutLogExercise.findMany({
      where: { log: { userId: session.user.id } },
      select: { name: true },
      distinct: ["name"],
      orderBy: { name: "asc" },
    });

    return NextResponse.json(exercises.map(e => e.name));
  } catch (err) {
    console.error("[POST /api/workout-logs/exercise-history]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
