import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const GOAL_LABELS: Record<string, string> = {
  MUSCLE_GAIN: "Prise de masse",
  FAT_LOSS: "Perte de gras",
  STAY_FIT: "Rester en forme",
  GENTLE_RETURN: "Reprise douce",
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

const EQUIPMENT_LABELS: Record<string, string> = {
  GYM: "Salle de sport",
  HOME: "À domicile",
  OUTDOOR: "Extérieur",
  NONE: "Aucun matériel",
};

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid #d8d0c4" }}
    >
      <span style={{ fontSize: "13px", color: "#7a7268" }}>{label}</span>
      <span
        style={{
          ...mono,
          fontSize: "12px",
          fontWeight: 700,
          color: accent ? "#c0392b" : "#1a1a1a",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded" style={{ background: "#fff", border: "1px solid #d8d0c4" }}>
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid #d8d0c4" }}
      >
        <p style={{ ...mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#1a3a5c" }}>
          {title}
        </p>
      </div>
      <div className="px-4">
        {children}
      </div>
    </div>
  );
}

export default async function ProfilPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
  ]);

  if (!profile) return null;

  return (
    <div className="space-y-3 pb-8" style={{ maxWidth: "520px", margin: "0 auto" }}>
      <h1 style={{ ...display, fontSize: "26px", letterSpacing: "2px" }}>MON PROFIL</h1>

      {/* Infos personnelles */}
      <Section title="Informations personnelles">
        <Row label="Nom" value={user?.name ?? "—"} />
        <Row label="Email" value={user?.email ?? "—"} />
      </Section>

      {/* Programme */}
      <Section title="Mon programme">
        <Row label="Objectif" value={GOAL_LABELS[profile.goal]} />
        <Row label="Niveau" value={LEVEL_LABELS[profile.level]} />
        <Row
          label="Matériel"
          value={profile.equipment.map((e) => EQUIPMENT_LABELS[e]).join(", ")}
        />
      </Section>

      {/* Données physiques */}
      <Section title="Données physiques & Nutrition">
        <Row label="Sexe" value={profile.sex === "MALE" ? "Homme" : "Femme"} />
        <Row label="Âge" value={`${profile.age} ans`} />
        <Row label="Poids" value={`${profile.weight} kg`} />
        <Row label="Taille" value={`${profile.height} cm`} />
        <Row label="Métabolisme de base (BMR)" value={`${Math.round(profile.bmr ?? 0)} kcal`} />
        <Row label="Dépense totale (TDEE)" value={`${Math.round(profile.tdee ?? 0)} kcal`} />
        <Row label="Objectif calorique" value={`${Math.round(profile.targetCalories ?? 0)} kcal`} accent />
      </Section>

      {/* CTA */}
      <Link
        href="/onboarding"
        className="block w-full text-center font-semibold transition-opacity hover:opacity-80"
        style={{
          ...mono,
          fontSize: "11px",
          background: "#1a1a1a",
          color: "#f5f0e8",
          padding: "13px",
          borderRadius: "3px",
          letterSpacing: "1px",
          textDecoration: "none",
        }}
      >
        RECONFIGURER MON PROGRAMME
      </Link>
    </div>
  );
}
