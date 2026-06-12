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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid #F3F4F6" }}>
      <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      <span style={{ ...mono, fontSize: 12, fontWeight: 700, color: accent ? "#FF6500" : "#111827" }}>
        {value}
      </span>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      overflow: "hidden",
      borderLeft: `4px solid ${accent ?? "#E5E7EB"}`,
    }}>
      <div style={{ padding: "13px 20px", borderBottom: "1px solid #F3F4F6" }}>
        <p style={{ ...mono, fontSize: 9, letterSpacing: 2, color: "#111827", fontWeight: 700 }}>
          {title.toUpperCase()}
        </p>
      </div>
      <div style={{ padding: "0 20px" }}>
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
    <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ ...display, fontSize: 32, letterSpacing: 2, color: "#111827", marginBottom: 4 }}>MON PROFIL</h1>
        <p style={{ ...mono, fontSize: 11, color: "#6B7280", letterSpacing: 1 }}>
          {user?.name?.toUpperCase() ?? "—"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Infos personnelles */}
        <Section title="Informations personnelles" accent="#3B82F6">
          <Row label="Nom" value={user?.name ?? "—"} />
          <Row label="Email" value={user?.email ?? "—"} />
        </Section>

        {/* Programme */}
        <Section title="Mon programme" accent="#FF6500">
          <Row label="Objectif" value={GOAL_LABELS[profile.goal] ?? profile.goal} />
          <Row label="Niveau" value={LEVEL_LABELS[profile.level] ?? profile.level} />
          <Row
            label="Matériel"
            value={profile.equipment.map((e) => EQUIPMENT_LABELS[e] ?? e).join(", ")}
          />
        </Section>

        {/* Données physiques */}
        <Section title="Données physiques & Nutrition" accent="#22C55E">
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
          style={{
            ...mono,
            fontSize: 11,
            background: "#FF6500",
            color: "#fff",
            padding: "14px",
            borderRadius: 14,
            letterSpacing: 1,
            textDecoration: "none",
            display: "block",
            textAlign: "center",
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          RECONFIGURER MON PROGRAMME
        </Link>
      </div>
    </div>
  );
}
