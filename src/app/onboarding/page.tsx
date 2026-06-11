"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  { value: "MUSCLE_GAIN", label: "Prise de masse", icon: "🏋️", desc: "Augmenter ma masse musculaire" },
  { value: "FAT_LOSS", label: "Perte de gras", icon: "🔥", desc: "Perdre du poids et affiner ma silhouette" },
  { value: "STAY_FIT", label: "Rester en forme", icon: "⚡", desc: "Maintenir ma condition physique" },
  { value: "GENTLE_RETURN", label: "Reprise douce", icon: "🌱", desc: "Reprendre le sport progressivement" },
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
  { value: "OMNIVORE",    label: "Omnivore",    icon: "🍗", desc: "Je mange de tout" },
  { value: "VEGETARIAN",  label: "Végétarien",  icon: "🥚", desc: "Pas de viande ni poisson, mais œufs et produits laitiers" },
  { value: "VEGAN",       label: "Vegan",       icon: "🌱", desc: "Aucun produit d'origine animale" },
];

const ALLERGIES = [
  { value: "GLUTEN",    label: "Gluten",          icon: "🌾" },
  { value: "LACTOSE",   label: "Lactose",         icon: "🥛" },
  { value: "NUTS",      label: "Fruits à coque",  icon: "🥜" },
  { value: "EGGS",      label: "Œufs",            icon: "🥚" },
  { value: "SOY",       label: "Soja",            icon: "🫘" },
  { value: "SHELLFISH", label: "Crustacés",       icon: "🦐" },
];

type FormData = {
  goal: string; level: string; equipment: string[];
  sex: string; age: string; weight: string; height: string;
  sessionsPerWeek: string; diet: string; allergies: string[];
};

const mono: React.CSSProperties = { fontFamily: "var(--font-space-mono), 'Space Mono', monospace" };
const display: React.CSSProperties = { fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" };

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #d8d0c4", borderRadius: "3px",
  padding: "10px 12px", background: "#f5f0e8", color: "#1a1a1a",
  fontSize: "14px", outline: "none",
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#f5f0e8" }}>
      <div className="w-full" style={{ maxWidth: "480px" }}>

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 style={{ ...display, fontSize: "36px", letterSpacing: "4px", color: "#1a1a1a", lineHeight: 1 }}>
            VITA<span style={{ color: "#c0392b" }}>LOOP</span>
          </h1>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span style={{ ...mono, fontSize: "10px", color: "#7a7268", letterSpacing: "1px" }}>
              ÉTAPE {step} / {totalSteps}
            </span>
            <span style={{ ...mono, fontSize: "10px", color: "#c0392b", fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ height: "4px", background: "#d8d0c4" }}>
            <div style={{ height: "100%", background: "#c0392b", width: `${pct}%`, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Card */}
        <div className="rounded" style={{ background: "#fff", border: "1px solid #d8d0c4" }}>

          {/* Step 1 — Objectif */}
          {step === 1 && (
            <div>
              <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid #d8d0c4" }}>
                <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px" }}>VOTRE OBJECTIF</h2>
                <p style={{ fontSize: "12px", color: "#7a7268", marginTop: "4px" }}>
                  Votre programme sera entièrement adapté à votre but.
                </p>
              </div>
              <div className="p-4 space-y-2">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setForm((f) => ({ ...f, goal: g.value }))}
                    className="w-full flex items-center gap-4 text-left transition-all hover:opacity-90"
                    style={{
                      padding: "12px 14px", borderRadius: "3px",
                      border: form.goal === g.value ? "2px solid #c0392b" : "1px solid #d8d0c4",
                      background: form.goal === g.value ? "#fff5f5" : "#f5f0e8",
                    }}
                  >
                    <span style={{ fontSize: "22px" }}>{g.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "14px" }}>{g.label}</p>
                      <p style={{ fontSize: "12px", color: "#7a7268" }}>{g.desc}</p>
                    </div>
                  </button>
                ))}
                <button
                  disabled={!form.goal}
                  onClick={() => setStep(2)}
                  className="w-full mt-2 font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{ ...mono, fontSize: "11px", background: "#1a1a1a", color: "#f5f0e8", padding: "12px", borderRadius: "3px", border: "none", cursor: "pointer", letterSpacing: "1px" }}
                >
                  CONTINUER →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Niveau */}
          {step === 2 && (
            <div>
              <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid #d8d0c4" }}>
                <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px" }}>NIVEAU SPORTIF</h2>
                <p style={{ fontSize: "12px", color: "#7a7268", marginTop: "4px" }}>
                  Pour adapter l&apos;intensité des séances.
                </p>
              </div>
              <div className="p-4 space-y-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setForm((f) => ({ ...f, level: l.value }))}
                    className="w-full flex flex-col text-left transition-all hover:opacity-90"
                    style={{
                      padding: "12px 14px", borderRadius: "3px",
                      border: form.level === l.value ? "2px solid #c0392b" : "1px solid #d8d0c4",
                      background: form.level === l.value ? "#fff5f5" : "#f5f0e8",
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: "14px" }}>{l.label}</p>
                    <p style={{ fontSize: "12px", color: "#7a7268" }}>{l.desc}</p>
                  </button>
                ))}
                {/* Séances par semaine */}
                {form.level && (
                  <div>
                    <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "8px", letterSpacing: "1px" }}>
                      SÉANCES PAR SEMAINE
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {["2", "3", "4", "5"].map((n) => (
                        <button
                          key={n}
                          onClick={() => setForm((f) => ({ ...f, sessionsPerWeek: n }))}
                          className="transition-all hover:opacity-90"
                          style={{
                            padding: "12px 8px", borderRadius: "3px", fontWeight: 700,
                            ...mono, fontSize: "16px",
                            border: form.sessionsPerWeek === n ? "2px solid #c0392b" : "1px solid #d8d0c4",
                            background: form.sessionsPerWeek === n ? "#fff5f5" : "#f5f0e8",
                            color: form.sessionsPerWeek === n ? "#c0392b" : "#1a1a1a",
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 transition-opacity hover:opacity-80"
                    style={{ ...mono, fontSize: "11px", background: "#f5f0e8", color: "#1a1a1a", padding: "12px", borderRadius: "3px", border: "1px solid #d8d0c4", cursor: "pointer", letterSpacing: "1px" }}
                  >
                    ← RETOUR
                  </button>
                  <button
                    disabled={!form.level || !form.sessionsPerWeek}
                    onClick={() => setStep(3)}
                    className="flex-1 font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ ...mono, fontSize: "11px", background: "#1a1a1a", color: "#f5f0e8", padding: "12px", borderRadius: "3px", border: "none", cursor: "pointer", letterSpacing: "1px" }}
                  >
                    CONTINUER →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Matériel */}
          {step === 3 && (
            <div>
              <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid #d8d0c4" }}>
                <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px" }}>MATÉRIEL DISPONIBLE</h2>
                <p style={{ fontSize: "12px", color: "#7a7268", marginTop: "4px" }}>
                  Sélectionnez tout ce qui s&apos;applique.
                </p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {EQUIPMENTS.map((eq) => (
                    <button
                      key={eq.value}
                      onClick={() => toggleEquipment(eq.value)}
                      className="flex flex-col items-center gap-2 transition-all hover:opacity-90"
                      style={{
                        padding: "16px 8px", borderRadius: "3px",
                        border: form.equipment.includes(eq.value) ? "2px solid #c0392b" : "1px solid #d8d0c4",
                        background: form.equipment.includes(eq.value) ? "#fff5f5" : "#f5f0e8",
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>{eq.icon}</span>
                      <span style={{ fontSize: "13px", fontWeight: 500 }}>{eq.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 transition-opacity hover:opacity-80"
                    style={{ ...mono, fontSize: "11px", background: "#f5f0e8", color: "#1a1a1a", padding: "12px", borderRadius: "3px", border: "1px solid #d8d0c4", cursor: "pointer", letterSpacing: "1px" }}
                  >
                    ← RETOUR
                  </button>
                  <button
                    disabled={form.equipment.length === 0}
                    onClick={() => setStep(4)}
                    className="flex-1 font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ ...mono, fontSize: "11px", background: "#1a1a1a", color: "#f5f0e8", padding: "12px", borderRadius: "3px", border: "none", cursor: "pointer", letterSpacing: "1px" }}
                  >
                    CONTINUER →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Données physiques */}
          {step === 4 && (
            <div>
              <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid #d8d0c4" }}>
                <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px" }}>DONNÉES PHYSIQUES</h2>
                <p style={{ fontSize: "12px", color: "#7a7268", marginTop: "4px" }}>
                  Utilisées pour calculer vos besoins caloriques.
                </p>
              </div>
              <div className="p-4 space-y-4">
                {/* Sexe */}
                <div>
                  <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "8px", letterSpacing: "1px" }}>SEXE</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ value: "MALE", label: "Homme" }, { value: "FEMALE", label: "Femme" }].map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setForm((f) => ({ ...f, sex: s.value }))}
                        className="transition-all hover:opacity-90"
                        style={{
                          padding: "10px", borderRadius: "3px", fontWeight: 600, fontSize: "14px",
                          border: form.sex === s.value ? "2px solid #c0392b" : "1px solid #d8d0c4",
                          background: form.sex === s.value ? "#fff5f5" : "#f5f0e8",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Âge / Poids / Taille */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "age", label: "ÂGE", placeholder: "25", min: 10, max: 100 },
                    { key: "weight", label: "POIDS (kg)", placeholder: "70", min: 30, max: 300 },
                    { key: "height", label: "TAILLE (cm)", placeholder: "175", min: 100, max: 250 },
                  ].map((field) => (
                    <div key={field.key}>
                      <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "6px", letterSpacing: "1px" }}>
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

                {error && <p style={{ ...mono, fontSize: "11px", color: "#c0392b" }}>{error}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 transition-opacity hover:opacity-80"
                    style={{ ...mono, fontSize: "11px", background: "#f5f0e8", color: "#1a1a1a", padding: "12px", borderRadius: "3px", border: "1px solid #d8d0c4", cursor: "pointer", letterSpacing: "1px" }}
                  >
                    ← RETOUR
                  </button>
                  <button
                    disabled={!form.sex || !form.age || !form.weight || !form.height}
                    onClick={() => setStep(5)}
                    className="flex-1 font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ ...mono, fontSize: "11px", background: "#1a1a1a", color: "#f5f0e8", padding: "12px", borderRadius: "3px", border: "none", cursor: "pointer", letterSpacing: "1px" }}
                  >
                    CONTINUER →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Régime & allergies */}
          {step === 5 && (
            <div>
              <div className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid #d8d0c4" }}>
                <h2 style={{ ...display, fontSize: "22px", letterSpacing: "1px" }}>ALIMENTATION</h2>
                <p style={{ fontSize: "12px", color: "#7a7268", marginTop: "4px" }}>
                  Pour adapter vos menus à vos préférences et contraintes.
                </p>
              </div>
              <div className="p-4 space-y-5">

                {/* Régime */}
                <div>
                  <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "8px", letterSpacing: "1px" }}>
                    RÉGIME ALIMENTAIRE
                  </p>
                  <div className="space-y-2">
                    {DIETS.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setForm((f) => ({ ...f, diet: d.value }))}
                        className="w-full flex items-center gap-3 text-left transition-all hover:opacity-90"
                        style={{
                          padding: "11px 14px", borderRadius: "3px",
                          border: form.diet === d.value ? "2px solid #c0392b" : "1px solid #d8d0c4",
                          background: form.diet === d.value ? "#fff5f5" : "#f5f0e8",
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>{d.icon}</span>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "14px" }}>{d.label}</p>
                          <p style={{ fontSize: "11px", color: "#7a7268" }}>{d.desc}</p>
                        </div>
                        {form.diet === d.value && (
                          <span style={{ marginLeft: "auto", color: "#c0392b", fontSize: "16px" }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <p style={{ ...mono, fontSize: "10px", color: "#7a7268", marginBottom: "8px", letterSpacing: "1px" }}>
                    ALLERGIES / INTOLÉRANCES <span style={{ color: "#d8d0c4" }}>(optionnel)</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {ALLERGIES.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => toggleAllergy(a.value)}
                        className="flex items-center gap-2 text-left transition-all hover:opacity-90"
                        style={{
                          padding: "10px 12px", borderRadius: "3px",
                          border: form.allergies.includes(a.value) ? "2px solid #1a3a5c" : "1px solid #d8d0c4",
                          background: form.allergies.includes(a.value) ? "#eef2f7" : "#f5f0e8",
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>{a.icon}</span>
                        <span style={{ fontSize: "13px", fontWeight: form.allergies.includes(a.value) ? 600 : 400 }}>
                          {a.label}
                        </span>
                        {form.allergies.includes(a.value) && (
                          <span style={{ marginLeft: "auto", color: "#1a3a5c", fontSize: "12px" }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p style={{ ...mono, fontSize: "11px", color: "#c0392b" }}>{error}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 transition-opacity hover:opacity-80"
                    style={{ ...mono, fontSize: "11px", background: "#f5f0e8", color: "#1a1a1a", padding: "12px", borderRadius: "3px", border: "1px solid #d8d0c4", cursor: "pointer", letterSpacing: "1px" }}
                  >
                    ← RETOUR
                  </button>
                  <button
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-1 font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ ...mono, fontSize: "11px", background: "#c0392b", color: "#fff", padding: "12px", borderRadius: "3px", border: "none", cursor: "pointer", letterSpacing: "1px" }}
                  >
                    {loading ? "GÉNÉRATION…" : "🚀 CRÉER MON PROGRAMME"}
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
