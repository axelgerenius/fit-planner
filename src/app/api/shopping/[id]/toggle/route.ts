import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const item = await prisma.shoppingItem.findFirst({
    where: { id, list: { userId: session.user.id } },
  });

  if (!item) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await prisma.shoppingItem.update({
    where: { id },
    data: { checked: !item.checked },
  });

  return NextResponse.json({ ok: true });
}
