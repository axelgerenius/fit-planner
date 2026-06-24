import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const notification = await prisma.notification.findFirst({ where: { id, userId: session.user.id } });
  if (!notification) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await prisma.notification.update({ where: { id }, data: { read: true } });

  return NextResponse.json({ ok: true });
}
