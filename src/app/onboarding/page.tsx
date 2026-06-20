"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  { value: "MUSCLE_GAIN",    label: "Prise de masse",       icon: "🏋️",  desc: "Augmenter ma masse musculaire" },
  { value: "FAT_LOSS",       label: "Perte de gras",         icon: "🔥",  desc: "Perdre du poids et affiner ma silhouette" },
  { value: "STAY_FIT",       label: "Rester en forme",       icon: "⚡",  desc: "Maintenir ma condition physique" },
  { value: "GENTLE_RETURN",  label: "Reprise douce",         icon: "🌱",  desc: "Reprendre le sport progressivement" },
  { value: "FULL_STRENGTH",  label: "Full Musculation",      icon: "💪",  desc: "Programme force pure – Push/Pull/Legs intensif" },
  { value: "RUNNING",        label: "Running",               icon: "🏃",  desc: "Course à pied – endurance, fractionné, longue sortie" },
  { value: "CYCLING",        label: "Vélo / Cyclisme",       icon: "🚴",  desc: "Programme cyclisme – endurance et puissance" },
  { value: "CROSSFIT_HYROX", label: "CrossFit / HYROX",     icon: "🔗",  desc: "Fitness fonctionnel et préparation HYROX" },
  { value: "MARTIAL_ARTS",   label: "Arts Martiaux",         icon: "🥋",  desc: "Technique, conditionnement et sparring" },
];

const LEVELS = [
  { value: "BEGINNER", label: "Débutant", desc: "Moins d'1 an de pratique régulière" },
  { value: "INTERMEDIATE", label: "Intermédiaire", desc: "1 à 3 ans de pratique" },
  { value: "ADVANCED", label: "Avancé", desc: "Plus de 3 ans de pratique" },
];

const EQUIPMENTS = [
  { value: "GYM", label: "Salle de sport", icon: "🏢" },
  { value: "HOME", label: "À domicile", icon: "🏠" },
  { value: "OUTDOOR", label: "Extérieur", icon: "🌳" },
  { value: "NONE", label: "Aucun matériel", icon: "🤸" },
];

const DIETS = [
  { value: "OMNIVORE",   label: "Omnivore",   icon: "🍗", desc: "Je mange de tout" },
  { value: "VEGETARIAN", label: "Végétarien", icon: "🥚", desc: "Pas de viande ni poisson, mais œufs et produits laitiers" },
  { value: "VEGAN",      label: "Vegan",      icon: "🌱", desc: "Aucun produit d'origine animale" },
];

const ALLERGIES = [
  { value: "GLUTEN",    label: "Gluten",         icon: "🌾" },
  { value: "LACTOSE",   label: "Lactose",        icon: "🥛" },
  { value: "NUTS",      label: "Fruits à coque", icon: "🥜" },
  { value: "EGGS",      label: "Œufs",           icon: "🥚" },
  { value: "SOY",       label: "Soja",           icon: "🫘" },
  { value: "SHELLFISH", label: "Crustacés",      icon: "🦐" },
];

type FormData = {
  goal: string; level: string; equipment: string[];
  sex: string; age: string; weight: string; height: string;
  sessionsPerWeek: string; diet: string; allergies: string[];
};

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #E5E7EB", borderRadius: 10,
  padding: "11px 14px", background: "#F9FAFB", color: "#111827",
  fontSize: 14, outline: "none", boxSizing: "border-box",
};

function optionStyle(selected: boolean): React.CSSProperties {
  return {
    border: selected ? "2px solid #FF6500" : "1px solid #E5E7EB",
    background: selected ? "#FFF3ED" : "#fff",
    borderRadius: 12,
    transition: "all 0.15s",
    cursor: "pointer",
  };
}

function allergyStyle(selected: boolean): React.CSSProperties {
  return {
    border: selected ? "2px solid #22C55E" : "1px solid #E5E7EB",
    background: selected ? "#F0FDF4" : "#fff",
    borderRadius: 12,
    transition: "all 0.15s",
    cursor: "pointer",
  };
}

const btnPrimary: React.CSSProperties = {
  fontSize: 14, fontWeight: 700,
  background: "#FF6500", color: "#fff", padding: "13px",
  borderRadius: 12, border: "none", cursor: "pointer",
};
const btnBack: React.CSSProperties = {
  fontSize: 14, fontWeight: 600,
  background: "#F3F4F6", color: "#6B7280", padding: "13px",
  borderRadius: 12, border: "none", cursor: "pointer",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    goal: "", level: "", equipment: [], sex: "", age: "", weight: "", height: "",
    sessionsPerWeek: "", diet: "OMNIVORE", allergies: [],
  });

  const totalSteps = 5;
  const pct = Math.round((step / totalSteps) * 100);

  function toggleEquipment(val: string) {
    setForm((f) => ({
      ...f,
      equipment: f.equipment.includes(val)
        ? f.equipment.filter((e) => e !== val)
        : [...f.equipment, val],
    }));
  }

  function toggleAllergy(val: string) {
    setForm((f) => ({
      ...f,
      allergies: f.allergies.includes(val)
        ? f.allergies.filter((a) => a !== val)
        : [...f.allergies, val],
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Une erreur est survenue. Veuillez réessayer.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "#F9FAFB" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: "#111827", letterSpacing: 0.5 }}>
            VITA<span style={{ color: "#FF6500" }}>LOOP</span>
          </h1>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#6B7280" }}>
              Étape {step} / {totalSteps}
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#FF6500" }}>{pct}%</span>
          </div>
          <div style={{ height: 5, background: "#E5E7EB", borderRadius: 99 }}>
            <div style={{ height: "100%", background: "#FF6500", width: `${pct}%`, borderRadius: 99, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          {/* Step 1 — Objectif */}
          {step === 1 && (
            <div>
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F3F4F6" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Votre objectif</h2>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                  Votre programme sera entièrement adapté à votre but.
                </p>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setForm((f) => ({ ...f, goal: g.value }))}
                    style={{ ...optionStyle(form.goal === g.value), display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", width: "100%", textAlign: "left" }}
                  >
                    <span style={{ fontSize: 22 }}>{g.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{g.label}</p>
                      <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{g.desc}</p>
                    </div>
                    {form.goal === g.value && (
                      <span style={{ marginLeft: "auto", color: "#FF6500", fontSize: 16, flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                ))}
                <button
                  disabled={!form.goal}
                  onClick={() => setStep(2)}
                  style={{ ...btnPrimary, marginTop: 8, opacity: form.goal ? 1 : 0.4 }}
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Niveau */}
          {step === 2 && (
            <div>
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F3F4F6" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Niveau sportif</h2>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                  Pour adapter l&apos;intensité des séances.
                </p>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setForm((f) => ({ ...f, level: l.value }))}
                    style={{ ...optionStyle(form.level === l.value), display: "flex", flexDirection: "column", padding: "13px 16px", width: "100%", textAlign: "left" }}
                  >
                    <p style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{l.label}</p>
                    <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{l.desc}</p>
                  </button>
                ))}

                {form.level && (
                  <div style={{ marginTop: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>
                      Séances par semaine
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                      {["2", "3", "4", "5"].map((n) => (
                        <button
                          key={n}
                          onClick={() => setForm((f) => ({ ...f, sessionsPerWeek: n }))}
                          style={{
                            ...optionStyle(form.sessionsPerWeek === n),
                            fontSize: 20, fontWeight: 800,
                            padding: "13px 8px",
                            color: form.sessionsPerWeek === n ? "#FF6500" : "#111827",
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => setStep(1)} style={{ ...btnBack, flex: 1 }}>← Retour</button>
                  <button
                    disabled={!form.level || !form.sessionsPerWeek}
                    onClick={() => setStep(3)}
                    style={{ ...btnPrimary, flex: 1, opacity: form.level && form.sessionsPerWeek ? 1 : 0.4 }}
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Matériel */}
          {step === 3 && (
            <div>
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F3F4F6" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Matériel disponible</h2>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                  Sélectionnez tout ce qui s&apos;applique.
                </p>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 16 }}>
                  {EQUIPMENTS.map((eq) => (
                    <button
                      key={eq.value}
                      onClick={() => toggleEquipment(eq.value)}
                      style={{ ...optionStyle(form.equipment.includes(eq.value)), display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 8px" }}
                    >
                      <span style={{ fontSize: 26 }}>{eq.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{eq.label}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setStep(2)} style={{ ...btnBack, flex: 1 }}>← Retour</button>
                  <button
                    disabled={form.equipment.length === 0}
                    onClick={() => setStep(4)}
                    style={{ ...btnPrimary, flex: 1, opacity: form.equipment.length > 0 ? 1 : 0.4 }}
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Données physiques */}
          {step === 4 && (
            <div>
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F3F4F6" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Données physiques</h2>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                  Utilisées pour calculer vos besoins caloriques.
                </p>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Sexe */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>Sexe</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[{ value: "MALE", label: "Homme" }, { value: "FEMALE", label: "Femme" }].map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setForm((f) => ({ ...f, sex: s.value }))}
                        style={{ ...optionStyle(form.sex === s.value), padding: "11px", fontWeight: 600, fontSize: 15, color: form.sex === s.value ? "#FF6500" : "#111827" }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Âge / Poids / Taille */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {[
                    { key: "age", label: "Âge", placeholder: "25", min: 10, max: 100 },
                    { key: "weight", label: "Poids (kg)", placeholder: "70", min: 30, max: 300 },
                    { key: "height", label: "Taille (cm)", placeholder: "175", min: 100, max: 250 },
                  ].map((field) => (
                    <div key={field.key}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
                        {field.label}
                      </p>
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof FormData] as string}
                        onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>

                {error && (
                  <p style={{ fontSize: 13, color: "#EF4444", background: "#FEF2F2", padding: "8px 12px", borderRadius: 8 }}>
                    {error}
                  </p>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setStep(3)} style={{ ...btnBack, flex: 1 }}>← Retour</button>
                  <button
                    disabled={!form.sex || !form.age || !form.weight || !form.height}
                    onClick={() => setStep(5)}
                    style={{ ...btnPrimary, flex: 1, opacity: form.sex && form.age && form.weight && form.height ? 1 : 0.4 }}
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Régime & allergies */}
          {step === 5 && (
            <div>
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F3F4F6" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>Alimentation</h2>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                  Pour adapter vos menus à vos préférences et contraintes.
                </p>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Régime */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>
                    Régime alimentaire
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {DIETS.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setForm((f) => ({ ...f, diet: d.value }))}
                        style={{ ...optionStyle(form.diet === d.value), display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", width: "100%", textAlign: "left" }}
                      >
                        <span style={{ fontSize: 20 }}>{d.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{d.label}</p>
                          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{d.desc}</p>
                        </div>
                        {form.diet === d.value && (
                          <span style={{ color: "#FF6500", fontSize: 16, flexShrink: 0 }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>
                    Allergies / intolérances{" "}
                    <span style={{ color: "#D1D5DB", fontWeight: 400 }}>(optionnel)</span>
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                    {ALLERGIES.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => toggleAllergy(a.value)}
                        style={{ ...allergyStyle(form.allergies.includes(a.value)), display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", textAlign: "left" }}
                      >
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: form.allergies.includes(a.value) ? 600 : 400, color: "#111827" }}>
                          {a.label}
                        </span>
                        {form.allergies.includes(a.value) && (
                          <span style={{ marginLeft: "auto", color: "#22C55E", fontSize: 14, flexShrink: 0 }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p style={{ fontSize: 13, color: "#EF4444", background: "#FEF2F2", padding: "8px 12px", borderRadius: 8 }}>
                    {error}
                  </p>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setStep(4)} style={{ ...btnBack, flex: 1 }}>← Retour</button>
                  <button
                    disabled={loading}
                    onClick={handleSubmit}
                    style={{ ...btnPrimary, flex: 1, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Génération…" : "🚀 Créer mon programme"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
