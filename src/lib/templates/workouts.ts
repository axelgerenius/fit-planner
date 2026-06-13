import { Goal, Level, Equipment, SessionType } from "@/generated/prisma/client";

type ExerciseTemplate = {
  name: string;
  sets?: number;
  reps?: string;
  restSec?: number;
  notes?: string;
  order: number;
};

type SessionTemplate = {
  dayOfWeek: number;
  name: string;
  type: SessionType;
  durationMin: number;
  exercises: ExerciseTemplate[];
};

type WorkoutTemplate = {
  name: string;
  sessions: SessionTemplate[];
};

// ─── Prise de masse – Débutant (Full Body 3j) ────────────────────────────────
const MUSCLE_BEGINNER_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Prise de masse – Full Body Débutant (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body A", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Squat barre", sets: 3, reps: "8-10", restSec: 90, order: 1 },
          { name: "Développé couché", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Rowing barre", sets: 3, reps: "8-10", restSec: 90, order: 3 },
          { name: "Développé militaire", sets: 3, reps: "10-12", restSec: 60, order: 4 },
          { name: "Curl biceps haltères", sets: 3, reps: "10-12", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Full Body B", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Soulevé de terre", sets: 3, reps: "6-8", restSec: 120, order: 1 },
          { name: "Tractions assistées", sets: 3, reps: "6-10", restSec: 90, order: 2 },
          { name: "Dips", sets: 3, reps: "8-12", restSec: 90, order: 3 },
          { name: "Presse à cuisses", sets: 3, reps: "10-12", restSec: 90, order: 4 },
          { name: "Gainage", sets: 3, reps: "30s", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Full Body C", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Squat goblet", sets: 3, reps: "10-12", restSec: 75, order: 1 },
          { name: "Pompes", sets: 3, reps: "10-15", restSec: 60, order: 2 },
          { name: "Tirage vertical", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Fentes marchées", sets: 3, reps: "12/jambe", restSec: 60, order: 4 },
          { name: "Extensions triceps poulie", sets: 3, reps: "12-15", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Repos actif", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Prise de masse – Full Body Débutant (Semaine B)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body A", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Presse à cuisses", sets: 3, reps: "10-12", restSec: 90, order: 1 },
          { name: "Développé incliné haltères", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Tirage horizontal poulie", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Élévations latérales", sets: 3, reps: "12-15", restSec: 60, order: 4 },
          { name: "Curl marteau", sets: 3, reps: "10-12", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Full Body B", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Fentes bulgares", sets: 3, reps: "10/jambe", restSec: 90, order: 1 },
          { name: "Rowing haltère unilatéral", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Pompes", sets: 3, reps: "10-15", restSec: 60, order: 3 },
          { name: "Développé épaules haltères", sets: 3, reps: "10-12", restSec: 60, order: 4 },
          { name: "Gainage latéral", sets: 3, reps: "30s/côté", restSec: 30, order: 5 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Full Body C", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Squat sumo haltère", sets: 3, reps: "10-12", restSec: 90, order: 1 },
          { name: "Tirage vertical prise large", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Dips entre bancs", sets: 3, reps: "8-12", restSec: 60, order: 3 },
          { name: "Soulevé de terre roumain haltères", sets: 3, reps: "10-12", restSec: 75, order: 4 },
          { name: "Crunch poulie", sets: 3, reps: "15-20", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Repos actif – Étirements", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Prise de masse – Full Body Débutant (Semaine C)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body A", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Hack squat", sets: 3, reps: "10-12", restSec: 90, order: 1 },
          { name: "Développé couché prise serrée", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Rowing T-bar", sets: 3, reps: "8-10", restSec: 90, order: 3 },
          { name: "Développé Arnold", sets: 3, reps: "10-12", restSec: 60, order: 4 },
          { name: "Curl pupitre", sets: 3, reps: "10-12", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Full Body B", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Soulevé de terre sumo", sets: 3, reps: "6-8", restSec: 120, order: 1 },
          { name: "Tractions prise large assistées", sets: 3, reps: "6-10", restSec: 90, order: 2 },
          { name: "Pompes diamant", sets: 3, reps: "8-12", restSec: 60, order: 3 },
          { name: "Presse à cuisses unilatérale", sets: 3, reps: "10/jambe", restSec: 90, order: 4 },
          { name: "Planche dynamique", sets: 3, reps: "30s", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Full Body C", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Squat avant haltères", sets: 3, reps: "10-12", restSec: 75, order: 1 },
          { name: "Développé militaire assis", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Tirage horizontal prise large", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Fentes arrière", sets: 3, reps: "12/jambe", restSec: 60, order: 4 },
          { name: "Extensions triceps barre", sets: 3, reps: "12-15", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Repos actif – Mobilité", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
];

// ─── Prise de masse – Intermédiaire/Avancé (PPL 5j) ─────────────────────────
const MUSCLE_INTERMEDIATE_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Prise de masse – PPL Intermédiaire (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Push – Pectoraux & Épaules", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Développé couché barre", sets: 4, reps: "6-8", restSec: 120, order: 1 },
          { name: "Développé incliné haltères", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Développé militaire", sets: 4, reps: "6-8", restSec: 90, order: 3 },
          { name: "Élévations latérales", sets: 3, reps: "12-15", restSec: 60, order: 4 },
          { name: "Dips lestés", sets: 3, reps: "8-12", restSec: 90, order: 5 },
          { name: "Extensions triceps poulie", sets: 3, reps: "12-15", restSec: 45, order: 6 },
        ],
      },
      {
        dayOfWeek: 1, name: "Pull – Dos & Biceps", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Tractions lestées", sets: 4, reps: "6-8", restSec: 120, order: 1 },
          { name: "Rowing barre", sets: 4, reps: "6-8", restSec: 90, order: 2 },
          { name: "Tirage vertical prise serrée", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Rowing haltère unilatéral", sets: 3, reps: "10-12", restSec: 60, order: 4 },
          { name: "Curl barre", sets: 3, reps: "8-10", restSec: 60, order: 5 },
          { name: "Curl concentré", sets: 3, reps: "12-15", restSec: 45, order: 6 },
        ],
      },
      {
        dayOfWeek: 2, name: "Legs – Jambes", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Squat barre", sets: 4, reps: "5-8", restSec: 150, order: 1 },
          { name: "Presse à cuisses", sets: 3, reps: "10-12", restSec: 90, order: 2 },
          { name: "Leg curl couché", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Fentes bulgares", sets: 3, reps: "10/jambe", restSec: 75, order: 4 },
          { name: "Mollets debout", sets: 4, reps: "15-20", restSec: 45, order: 5 },
          { name: "Soulevé de terre roumain", sets: 3, reps: "8-10", restSec: 90, order: 6 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Push – Force & Volume", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Développé couché haltères", sets: 4, reps: "8-10", restSec: 90, order: 1 },
          { name: "Écarté poulie", sets: 3, reps: "12-15", restSec: 60, order: 2 },
          { name: "Arnold press", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Oiseau haltères", sets: 3, reps: "12-15", restSec: 45, order: 4 },
          { name: "Skull crushers", sets: 3, reps: "10-12", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 5, name: "Pull – Volume", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Tirage horizontal poulie", sets: 4, reps: "10-12", restSec: 75, order: 1 },
          { name: "Pull-over haltère", sets: 3, reps: "12-15", restSec: 60, order: 2 },
          { name: "Face pull", sets: 3, reps: "15-20", restSec: 45, order: 3 },
          { name: "Curl marteau", sets: 3, reps: "10-12", restSec: 60, order: 4 },
          { name: "Curl câble", sets: 3, reps: "12-15", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Prise de masse – PPL Intermédiaire (Semaine B)",
    sessions: [
      {
        dayOfWeek: 0, name: "Push – Pectoraux & Épaules", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Développé incliné barre", sets: 4, reps: "6-8", restSec: 120, order: 1 },
          { name: "Développé couché haltères", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Élévations latérales poulie", sets: 3, reps: "12-15", restSec: 60, order: 3 },
          { name: "Développé Arnold", sets: 3, reps: "8-10", restSec: 90, order: 4 },
          { name: "Écarté couché haltères", sets: 3, reps: "12-15", restSec: 60, order: 5 },
          { name: "Extensions triceps barre front", sets: 3, reps: "10-12", restSec: 45, order: 6 },
        ],
      },
      {
        dayOfWeek: 1, name: "Pull – Dos & Biceps", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Rowing T-bar", sets: 4, reps: "6-8", restSec: 120, order: 1 },
          { name: "Tirage horizontal prise large", sets: 3, reps: "10-12", restSec: 90, order: 2 },
          { name: "Tractions prise serrée", sets: 3, reps: "6-10", restSec: 90, order: 3 },
          { name: "Face pull", sets: 3, reps: "15-20", restSec: 60, order: 4 },
          { name: "Curl incliné haltères", sets: 3, reps: "8-10", restSec: 60, order: 5 },
          { name: "Curl marteau câble", sets: 3, reps: "12-15", restSec: 45, order: 6 },
        ],
      },
      {
        dayOfWeek: 2, name: "Legs – Jambes", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Front squat", sets: 4, reps: "6-8", restSec: 150, order: 1 },
          { name: "Hack squat", sets: 3, reps: "10-12", restSec: 90, order: 2 },
          { name: "Soulevé de terre jambes tendues", sets: 3, reps: "10-12", restSec: 90, order: 3 },
          { name: "Fentes avant haltères", sets: 3, reps: "10/jambe", restSec: 75, order: 4 },
          { name: "Leg extension", sets: 3, reps: "12-15", restSec: 60, order: 5 },
          { name: "Mollets assis", sets: 4, reps: "15-20", restSec: 45, order: 6 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Push – Force & Volume", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Développé couché prise serrée", sets: 4, reps: "6-8", restSec: 90, order: 1 },
          { name: "Développé militaire haltères", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Dips lestés", sets: 3, reps: "8-12", restSec: 90, order: 3 },
          { name: "Élévations frontales", sets: 3, reps: "12-15", restSec: 45, order: 4 },
          { name: "Pull-over haltère", sets: 3, reps: "12-15", restSec: 60, order: 5 },
          { name: "Extensions triceps câble overhead", sets: 3, reps: "10-12", restSec: 45, order: 6 },
        ],
      },
      {
        dayOfWeek: 5, name: "Pull – Volume", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Rowing barre prise large", sets: 4, reps: "8-10", restSec: 90, order: 1 },
          { name: "Tirage vertical poulie", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Rowing inversé", sets: 3, reps: "10-15", restSec: 60, order: 3 },
          { name: "Oiseau câble", sets: 3, reps: "15-20", restSec: 45, order: 4 },
          { name: "Curl barre EZ", sets: 3, reps: "8-10", restSec: 60, order: 5 },
          { name: "Curl araignée", sets: 3, reps: "12-15", restSec: 45, order: 6 },
        ],
      },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Prise de masse – PPL Intermédiaire (Semaine C)",
    sessions: [
      {
        dayOfWeek: 0, name: "Push – Pectoraux & Épaules", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Développé couché haltères prise neutre", sets: 4, reps: "8-10", restSec: 90, order: 1 },
          { name: "Développé incliné machine", sets: 3, reps: "10-12", restSec: 90, order: 2 },
          { name: "Écarté poulie haute", sets: 3, reps: "12-15", restSec: 60, order: 3 },
          { name: "Développé militaire barre", sets: 4, reps: "6-8", restSec: 90, order: 4 },
          { name: "Dips", sets: 3, reps: "10-15", restSec: 75, order: 5 },
          { name: "Kickback triceps haltère", sets: 3, reps: "12-15", restSec: 45, order: 6 },
        ],
      },
      {
        dayOfWeek: 1, name: "Pull – Dos & Biceps", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Tractions lestées prise large", sets: 4, reps: "6-8", restSec: 120, order: 1 },
          { name: "Rowing unilatéral haltère", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Tirage poulie basse", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Pull-over poulie", sets: 3, reps: "12-15", restSec: 60, order: 4 },
          { name: "Curl prise marteau", sets: 3, reps: "10-12", restSec: 60, order: 5 },
          { name: "Curl inversé barre", sets: 3, reps: "12-15", restSec: 45, order: 6 },
        ],
      },
      {
        dayOfWeek: 2, name: "Legs – Jambes", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Squat barre", sets: 4, reps: "6-8", restSec: 150, order: 1 },
          { name: "Presse à cuisses pieds hauts", sets: 3, reps: "10-12", restSec: 90, order: 2 },
          { name: "Leg curl assis", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Fentes bulgares haltères", sets: 3, reps: "10/jambe", restSec: 75, order: 4 },
          { name: "Hip thrust barre", sets: 3, reps: "10-12", restSec: 90, order: 5 },
          { name: "Mollets debout unilatéral", sets: 3, reps: "15/jambe", restSec: 45, order: 6 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Push – Force & Volume", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Développé couché prise large", sets: 4, reps: "6-8", restSec: 120, order: 1 },
          { name: "Développé épaules machine", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Écarté incliné haltères", sets: 3, reps: "12-15", restSec: 60, order: 3 },
          { name: "Dips lestés", sets: 3, reps: "8-12", restSec: 90, order: 4 },
          { name: "Triceps corde poulie", sets: 3, reps: "12-15", restSec: 45, order: 5 },
          { name: "Pompes diamant", sets: 3, reps: "10-15", restSec: 45, order: 6 },
        ],
      },
      {
        dayOfWeek: 5, name: "Pull – Volume", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Tirage horizontal câble prise neutre", sets: 4, reps: "10-12", restSec: 75, order: 1 },
          { name: "Rowing barre T", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Face pull", sets: 3, reps: "15-20", restSec: 45, order: 3 },
          { name: "Tractions supination", sets: 3, reps: "6-10", restSec: 90, order: 4 },
          { name: "Curl concentré", sets: 3, reps: "12-15", restSec: 45, order: 5 },
          { name: "Curl câble une main", sets: 3, reps: "12-15", restSec: 45, order: 6 },
        ],
      },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
];

// ─── Perte de gras – Full Body HIIT ──────────────────────────────────────────
const FAT_LOSS_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Perte de gras – Cardio & Renforcement (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body + Cardio", type: SessionType.FULL_BODY, durationMin: 45,
        exercises: [
          { name: "Burpees", sets: 3, reps: "10", restSec: 45, order: 1 },
          { name: "Squat sauté", sets: 3, reps: "15", restSec: 30, order: 2 },
          { name: "Pompes", sets: 3, reps: "10-15", restSec: 45, order: 3 },
          { name: "Mountain climbers", sets: 3, reps: "30s", restSec: 30, order: 4 },
          { name: "Fentes sautées", sets: 3, reps: "10/jambe", restSec: 45, order: 5 },
          { name: "Planche", sets: 3, reps: "30-45s", restSec: 30, order: 6 },
        ],
      },
      { dayOfWeek: 1, name: "Cardio modéré", type: SessionType.CARDIO, durationMin: 35, exercises: [
        { name: "Marche rapide ou vélo", sets: 1, reps: "35 min à 65% FC max", order: 1 },
      ]},
      {
        dayOfWeek: 2, name: "HIIT", type: SessionType.HIIT, durationMin: 30,
        exercises: [
          { name: "Sprint 20s / Marche 40s", sets: 8, reps: "1 tour", restSec: 0, order: 1, notes: "Répéter 8 fois" },
          { name: "Gainage dynamique", sets: 3, reps: "30s", restSec: 30, order: 2 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Renforcement musculaire", type: SessionType.STRENGTH, durationMin: 45,
        exercises: [
          { name: "Squat goblet", sets: 3, reps: "15", restSec: 60, order: 1 },
          { name: "Rowing haltères", sets: 3, reps: "12", restSec: 60, order: 2 },
          { name: "Développé haltères", sets: 3, reps: "12", restSec: 60, order: 3 },
          { name: "Fentes", sets: 3, reps: "12/jambe", restSec: 45, order: 4 },
          { name: "Gainage latéral", sets: 3, reps: "30s/côté", restSec: 30, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Cardio + Étirements", type: SessionType.CARDIO, durationMin: 40, exercises: [
        { name: "Jogging léger ou natation", sets: 1, reps: "30 min", order: 1 },
        { name: "Étirements globaux", sets: 1, reps: "10 min", order: 2 },
      ]},
      { dayOfWeek: 6, name: "Repos actif", type: SessionType.YOGA_STRETCH, durationMin: 20, exercises: [] },
    ],
  },
  {
    name: "Perte de gras – Cardio & Renforcement (Semaine B)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body + Cardio", type: SessionType.FULL_BODY, durationMin: 45,
        exercises: [
          { name: "Jumping jacks", sets: 3, reps: "30s", restSec: 30, order: 1 },
          { name: "Squat sauté", sets: 3, reps: "15", restSec: 30, order: 2 },
          { name: "Pompes surélevées", sets: 3, reps: "10-12", restSec: 45, order: 3 },
          { name: "Crunch vélo", sets: 3, reps: "20", restSec: 30, order: 4 },
          { name: "Fentes sautées", sets: 3, reps: "10/jambe", restSec: 45, order: 5 },
          { name: "Gainage latéral", sets: 3, reps: "30s/côté", restSec: 30, order: 6 },
        ],
      },
      { dayOfWeek: 1, name: "Cardio modéré", type: SessionType.CARDIO, durationMin: 35, exercises: [
        { name: "Vélo elliptique ou rameur", sets: 1, reps: "35 min à 65% FC max", order: 1 },
      ]},
      {
        dayOfWeek: 2, name: "HIIT", type: SessionType.HIIT, durationMin: 30,
        exercises: [
          { name: "Squat jump / Repos", sets: 10, reps: "20s / 10s", restSec: 0, order: 1, notes: "Tabata – répéter 10 fois" },
          { name: "Gainage", sets: 3, reps: "45s", restSec: 30, order: 2 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Renforcement musculaire", type: SessionType.STRENGTH, durationMin: 45,
        exercises: [
          { name: "Fentes bulgares", sets: 3, reps: "12/jambe", restSec: 60, order: 1 },
          { name: "Rowing élastique", sets: 3, reps: "15", restSec: 60, order: 2 },
          { name: "Pompes inclinées", sets: 3, reps: "12-15", restSec: 45, order: 3 },
          { name: "Soulevé de terre haltères", sets: 3, reps: "12", restSec: 60, order: 4 },
          { name: "Gainage dynamique", sets: 3, reps: "30s", restSec: 30, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Cardio + Étirements", type: SessionType.CARDIO, durationMin: 40, exercises: [
        { name: "Corde à sauter ou natation", sets: 1, reps: "30 min", order: 1 },
        { name: "Étirements globaux", sets: 1, reps: "10 min", order: 2 },
      ]},
      { dayOfWeek: 6, name: "Repos actif", type: SessionType.YOGA_STRETCH, durationMin: 20, exercises: [] },
    ],
  },
  {
    name: "Perte de gras – Cardio & Renforcement (Semaine C)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body + Cardio", type: SessionType.FULL_BODY, durationMin: 45,
        exercises: [
          { name: "Burpees sans saut", sets: 3, reps: "10", restSec: 45, order: 1 },
          { name: "Squat au poids du corps", sets: 3, reps: "20", restSec: 30, order: 2 },
          { name: "Pompes genoux au sol", sets: 3, reps: "12-15", restSec: 45, order: 3 },
          { name: "Mountain climbers", sets: 3, reps: "30s", restSec: 30, order: 4 },
          { name: "Fentes statiques", sets: 3, reps: "12/jambe", restSec: 45, order: 5 },
          { name: "Planche", sets: 3, reps: "30-45s", restSec: 30, order: 6 },
        ],
      },
      { dayOfWeek: 1, name: "Cardio modéré", type: SessionType.CARDIO, durationMin: 35, exercises: [
        { name: "Natation ou vélo", sets: 1, reps: "35 min à 65% FC max", order: 1 },
      ]},
      {
        dayOfWeek: 2, name: "HIIT", type: SessionType.HIIT, durationMin: 30,
        exercises: [
          { name: "Montées de genoux / Marche", sets: 8, reps: "30s / 30s", restSec: 0, order: 1, notes: "Répéter 8 fois" },
          { name: "Gainage", sets: 3, reps: "30s", restSec: 30, order: 2 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Renforcement musculaire", type: SessionType.STRENGTH, durationMin: 45,
        exercises: [
          { name: "Squat sumo", sets: 3, reps: "15", restSec: 60, order: 1 },
          { name: "Tirage élastique", sets: 3, reps: "15", restSec: 60, order: 2 },
          { name: "Pompes surélevées", sets: 3, reps: "12-15", restSec: 45, order: 3 },
          { name: "Fentes arrière", sets: 3, reps: "12/jambe", restSec: 45, order: 4 },
          { name: "Gainage latéral", sets: 3, reps: "30s/côté", restSec: 30, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Cardio + Étirements", type: SessionType.CARDIO, durationMin: 40, exercises: [
        { name: "Marche rapide en côte ou vélo", sets: 1, reps: "30 min", order: 1 },
        { name: "Étirements globaux", sets: 1, reps: "10 min", order: 2 },
      ]},
      { dayOfWeek: 6, name: "Repos actif", type: SessionType.YOGA_STRETCH, durationMin: 20, exercises: [] },
    ],
  },
];

// ─── Rester en forme ──────────────────────────────────────────────────────────
const STAY_FIT_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Maintien – Programme équilibré (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body", type: SessionType.FULL_BODY, durationMin: 50,
        exercises: [
          { name: "Squat", sets: 3, reps: "10-12", restSec: 75, order: 1 },
          { name: "Développé couché ou pompes", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Tirage ou tractions", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Gainage", sets: 3, reps: "30-45s", restSec: 30, order: 4 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Cardio & Core", type: SessionType.CARDIO, durationMin: 40,
        exercises: [
          { name: "Jogging ou vélo", sets: 1, reps: "25 min", order: 1 },
          { name: "Crunchs", sets: 3, reps: "15", order: 2 },
          { name: "Planche", sets: 3, reps: "30s", order: 3 },
          { name: "Russian twist", sets: 3, reps: "20", order: 4 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Full Body", type: SessionType.FULL_BODY, durationMin: 50,
        exercises: [
          { name: "Soulevé de terre", sets: 3, reps: "8-10", restSec: 90, order: 1 },
          { name: "Dips ou développé épaules", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Fentes", sets: 3, reps: "12/jambe", restSec: 60, order: 3 },
          { name: "Gainage dynamique", sets: 3, reps: "30s", order: 4 },
        ],
      },
      { dayOfWeek: 5, name: "Yoga & Étirements", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Maintien – Programme équilibré (Semaine B)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body", type: SessionType.FULL_BODY, durationMin: 50,
        exercises: [
          { name: "Fentes avant", sets: 3, reps: "10/jambe", restSec: 75, order: 1 },
          { name: "Pompes inclinées ou développé haltères", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Rowing élastique", sets: 3, reps: "12-15", restSec: 60, order: 3 },
          { name: "Gainage latéral", sets: 3, reps: "30s/côté", restSec: 30, order: 4 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Cardio & Core", type: SessionType.CARDIO, durationMin: 40,
        exercises: [
          { name: "Vélo ou rameur", sets: 1, reps: "25 min", order: 1 },
          { name: "Relevés de jambes", sets: 3, reps: "15", order: 2 },
          { name: "Gainage dynamique", sets: 3, reps: "30s", order: 3 },
          { name: "Mountain climbers", sets: 3, reps: "20", order: 4 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Full Body", type: SessionType.FULL_BODY, durationMin: 50,
        exercises: [
          { name: "Squat sumo", sets: 3, reps: "10-12", restSec: 75, order: 1 },
          { name: "Tirage vertical ou tractions assistées", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Développé épaules haltères", sets: 3, reps: "10-12", restSec: 60, order: 3 },
          { name: "Pont fessier", sets: 3, reps: "15", order: 4 },
        ],
      },
      { dayOfWeek: 5, name: "Yoga & Étirements", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Maintien – Programme équilibré (Semaine C)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body", type: SessionType.FULL_BODY, durationMin: 50,
        exercises: [
          { name: "Squat goblet", sets: 3, reps: "10-12", restSec: 75, order: 1 },
          { name: "Pompes", sets: 3, reps: "10-15", restSec: 75, order: 2 },
          { name: "Rowing haltère unilatéral", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Planche", sets: 3, reps: "30-45s", restSec: 30, order: 4 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Cardio & Core", type: SessionType.CARDIO, durationMin: 40,
        exercises: [
          { name: "Marche rapide ou natation", sets: 1, reps: "25 min", order: 1 },
          { name: "Crunchs inversés", sets: 3, reps: "15", order: 2 },
          { name: "Gainage latéral", sets: 3, reps: "30s/côté", order: 3 },
          { name: "Superman", sets: 3, reps: "12", order: 4 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Full Body", type: SessionType.FULL_BODY, durationMin: 50,
        exercises: [
          { name: "Fentes bulgares", sets: 3, reps: "10/jambe", restSec: 75, order: 1 },
          { name: "Dips ou pompes triceps", sets: 3, reps: "10-12", restSec: 60, order: 2 },
          { name: "Tirage horizontal élastique", sets: 3, reps: "12-15", restSec: 60, order: 3 },
          { name: "Gainage", sets: 3, reps: "45s", order: 4 },
        ],
      },
      { dayOfWeek: 5, name: "Yoga & Étirements", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
];

// ─── Reprise douce ────────────────────────────────────────────────────────────
const GENTLE_RETURN_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Reprise douce – Programme progressif (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body doux", type: SessionType.FULL_BODY, durationMin: 35,
        exercises: [
          { name: "Squat au poids du corps", sets: 2, reps: "12", restSec: 60, order: 1 },
          { name: "Pompes genoux au sol", sets: 2, reps: "8-10", restSec: 60, order: 2 },
          { name: "Rowing avec élastique", sets: 2, reps: "12", restSec: 60, order: 3 },
          { name: "Gainage", sets: 2, reps: "20s", restSec: 45, order: 4 },
          { name: "Fentes statiques", sets: 2, reps: "8/jambe", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Marche active", type: SessionType.CARDIO, durationMin: 30,
        exercises: [
          { name: "Marche à bonne allure", sets: 1, reps: "25-30 min", order: 1 },
          { name: "Étirements", sets: 1, reps: "5 min", order: 2 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Mobilité & Renforcement", type: SessionType.YOGA_STRETCH, durationMin: 35,
        exercises: [
          { name: "Mobilité des hanches", sets: 2, reps: "10/côté", order: 1 },
          { name: "Pont fessier", sets: 2, reps: "15", restSec: 45, order: 2 },
          { name: "Superman", sets: 2, reps: "12", restSec: 45, order: 3 },
          { name: "Chat-vache (mobilité dos)", sets: 2, reps: "10", order: 4 },
          { name: "Étirements globaux", sets: 1, reps: "10 min", order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Reprise douce – Programme progressif (Semaine B)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body doux", type: SessionType.FULL_BODY, durationMin: 35,
        exercises: [
          { name: "Squat sur chaise (assis-debout)", sets: 2, reps: "10", restSec: 60, order: 1 },
          { name: "Pompes contre un mur", sets: 2, reps: "10", restSec: 60, order: 2 },
          { name: "Rowing élastique léger", sets: 2, reps: "12", restSec: 60, order: 3 },
          { name: "Gainage genoux au sol", sets: 2, reps: "15s", restSec: 45, order: 4 },
          { name: "Pont fessier au sol", sets: 2, reps: "12", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Marche active", type: SessionType.CARDIO, durationMin: 30,
        exercises: [
          { name: "Marche en extérieur", sets: 1, reps: "25-30 min", order: 1 },
          { name: "Étirements doux", sets: 1, reps: "5 min", order: 2 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Mobilité & Renforcement", type: SessionType.YOGA_STRETCH, durationMin: 35,
        exercises: [
          { name: "Cercles de bras", sets: 2, reps: "10", order: 1 },
          { name: "Pont fessier maintenu", sets: 2, reps: "15s", restSec: 45, order: 2 },
          { name: "Étirement chat-vache", sets: 2, reps: "10", order: 3 },
          { name: "Rotation du tronc assis", sets: 2, reps: "10/côté", order: 4 },
          { name: "Étirements globaux", sets: 1, reps: "10 min", order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Reprise douce – Programme progressif (Semaine C)",
    sessions: [
      {
        dayOfWeek: 0, name: "Full Body doux", type: SessionType.FULL_BODY, durationMin: 35,
        exercises: [
          { name: "Squat assis-debout sur chaise", sets: 2, reps: "10", restSec: 60, order: 1 },
          { name: "Pompes inclinées sur table", sets: 2, reps: "8", restSec: 60, order: 2 },
          { name: "Tirage élastique assis", sets: 2, reps: "12", restSec: 60, order: 3 },
          { name: "Gainage sur genoux", sets: 2, reps: "20s", restSec: 45, order: 4 },
          { name: "Fentes statiques tenues", sets: 2, reps: "8/jambe", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Marche active", type: SessionType.CARDIO, durationMin: 30,
        exercises: [
          { name: "Marche sur terrain plat", sets: 1, reps: "25 min", order: 1 },
          { name: "Étirements des jambes", sets: 1, reps: "5 min", order: 2 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Mobilité & Renforcement", type: SessionType.YOGA_STRETCH, durationMin: 35,
        exercises: [
          { name: "Mobilité des épaules (cercles)", sets: 2, reps: "10", order: 1 },
          { name: "Bird dog", sets: 2, reps: "8/côté", restSec: 30, order: 2 },
          { name: "Étirement ischio-jambiers", sets: 2, reps: "30s/côté", order: 3 },
          { name: "Pont fessier", sets: 2, reps: "12", restSec: 45, order: 4 },
          { name: "Respiration diaphragmatique", sets: 1, reps: "5 min", order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
];

function pickVariants(goal: Goal, level: Level): WorkoutTemplate[] {
  if (goal === Goal.MUSCLE_GAIN) {
    return level === Level.BEGINNER ? MUSCLE_BEGINNER_VARIANTS : MUSCLE_INTERMEDIATE_VARIANTS;
  }
  if (goal === Goal.FAT_LOSS) {
    return FAT_LOSS_VARIANTS;
  }
  if (goal === Goal.GENTLE_RETURN) {
    return GENTLE_RETURN_VARIANTS;
  }
  return STAY_FIT_VARIANTS;
}

export function getWorkoutTemplate(
  goal: Goal,
  level: Level,
  _equipment: Equipment[],
  sessionsPerWeek?: number,
  weekIndex = 0,
): WorkoutTemplate {
  const variants = pickVariants(goal, level);
  const variantIndex = ((weekIndex % variants.length) + variants.length) % variants.length;
  const template = variants[variantIndex];

  if (!sessionsPerWeek) return template;

  // Convertir les séances d'entraînement en excès en repos
  let trainingSeen = 0;
  const sessions = template.sessions.map((s) => {
    if (s.type === SessionType.REST || s.type === SessionType.YOGA_STRETCH) return s;
    trainingSeen++;
    if (trainingSeen > sessionsPerWeek) {
      return { ...s, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] };
    }
    return s;
  });

  return { ...template, sessions };
}
