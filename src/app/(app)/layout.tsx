import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppNav from "@/components/app-nav";
import { ensureCurrentWeekPlan } from "@/lib/workout-rotation";
import { ensureCurrentWeekNutrition } from "@/lib/nutrition-rotation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.onboardingDone) redirect("/onboarding");

  await ensureCurrentWeekPlan(session.user.id);
  await ensureCurrentWeekNutrition(session.user.id);

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F5" }}>
      <AppNav user={{ name: session.user.name ?? "", email: session.user.email ?? "" }} />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">{children}</main>
    </div>
  );
}
