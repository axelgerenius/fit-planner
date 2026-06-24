import { prisma } from "@/lib/prisma";

export async function notify(
  userId: string,
  data: { type: string; title: string; message: string; link?: string }
) {
  await prisma.notification.create({
    data: { userId, type: data.type, title: data.title, message: data.message, link: data.link ?? null },
  });
}
