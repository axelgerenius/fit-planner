import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const list = await prisma.shoppingList.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!list) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await prisma.shoppingItem.updateMany({
    where: { listId: id },
    data: { checked: false },
  });

  return NextResponse.json({ ok: true });
}
