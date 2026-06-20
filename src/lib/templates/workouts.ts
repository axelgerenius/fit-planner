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

// ─── Full musculation – Débutant (Push/Pull/Legs 4j) ─────────────────────────
const FULL_STRENGTH_BEGINNER_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Full Musculation – Débutant (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Poussée", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Développé couché barre", sets: 4, reps: "5-6", restSec: 120, order: 1 },
          { name: "Développé incliné haltères", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Développé militaire barre", sets: 3, reps: "6-8", restSec: 90, order: 3 },
          { name: "Dips", sets: 3, reps: "8-10", restSec: 75, order: 4 },
          { name: "Extensions triceps poulie", sets: 3, reps: "10-12", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Tirage", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Tractions (assistées si besoin)", sets: 4, reps: "5-8", restSec: 120, order: 1 },
          { name: "Rowing barre pronation", sets: 4, reps: "6-8", restSec: 90, order: 2 },
          { name: "Tirage vertical prise large", sets: 3, reps: "8-10", restSec: 75, order: 3 },
          { name: "Curl biceps barre", sets: 3, reps: "8-10", restSec: 75, order: 4 },
          { name: "Face pull", sets: 3, reps: "15", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Jambes – Squat", type: SessionType.STRENGTH, durationMin: 70,
        exercises: [
          { name: "Squat barre haute", sets: 5, reps: "5", restSec: 150, order: 1 },
          { name: "Leg press", sets: 3, reps: "10-12", restSec: 90, order: 2 },
          { name: "Fentes bulgares haltères", sets: 3, reps: "8/jambe", restSec: 90, order: 3 },
          { name: "Leg curl couché", sets: 3, reps: "10-12", restSec: 75, order: 4 },
          { name: "Mollets debout", sets: 4, reps: "15-20", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 4, name: "Haut du corps", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Développé couché barre", sets: 3, reps: "8", restSec: 90, order: 1 },
          { name: "Rowing haltères unilatéral", sets: 3, reps: "8/côté", restSec: 75, order: 2 },
          { name: "Push press", sets: 3, reps: "6-8", restSec: 90, order: 3 },
          { name: "Curl marteau", sets: 3, reps: "10-12", restSec: 60, order: 4 },
          { name: "Shrugs haltères", sets: 3, reps: "12-15", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Récupération active", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Full Musculation – Débutant (Semaine B – Deadlift)",
    sessions: [
      {
        dayOfWeek: 0, name: "Chest & Triceps", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Développé couché barre", sets: 5, reps: "5", restSec: 120, order: 1 },
          { name: "Développé décliné haltères", sets: 3, reps: "8-10", restSec: 90, order: 2 },
          { name: "Fly haltères", sets: 3, reps: "12", restSec: 60, order: 3 },
          { name: "Dips lestés", sets: 3, reps: "6-8", restSec: 90, order: 4 },
          { name: "Kickbacks poulie", sets: 3, reps: "12-15", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Dos & Biceps", type: SessionType.STRENGTH, durationMin: 70,
        exercises: [
          { name: "Soulevé de terre", sets: 5, reps: "3-5", restSec: 150, order: 1 },
          { name: "Tractions prise serrée", sets: 3, reps: "6-8", restSec: 90, order: 2 },
          { name: "Rowing barre supination", sets: 4, reps: "6-8", restSec: 90, order: 3 },
          { name: "Curl biceps barre EZ", sets: 3, reps: "8-10", restSec: 75, order: 4 },
          { name: "Rowing visage", sets: 3, reps: "15", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Jambes – Deadlift", type: SessionType.STRENGTH, durationMin: 70,
        exercises: [
          { name: "Squat barre", sets: 3, reps: "8", restSec: 120, order: 1 },
          { name: "Romanian Deadlift", sets: 4, reps: "6-8", restSec: 90, order: 2 },
          { name: "Hip thrust barre", sets: 3, reps: "10-12", restSec: 90, order: 3 },
          { name: "Leg extension", sets: 3, reps: "12", restSec: 60, order: 4 },
          { name: "Mollets assis", sets: 4, reps: "15-20", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 4, name: "Épaules & Bras", type: SessionType.STRENGTH, durationMin: 60,
        exercises: [
          { name: "Press militaire barre", sets: 4, reps: "5-6", restSec: 120, order: 1 },
          { name: "Élévations latérales", sets: 4, reps: "12-15", restSec: 60, order: 2 },
          { name: "Curl biceps haltères", sets: 3, reps: "10-12", restSec: 60, order: 3 },
          { name: "Dips triceps banc", sets: 3, reps: "12-15", restSec: 60, order: 4 },
          { name: "Oiseau haltères (deltoïdes post.)", sets: 3, reps: "15", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Récupération", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Full Musculation – Débutant (Semaine C – Volume)",
    sessions: [
      {
        dayOfWeek: 0, name: "Poussée volume", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Développé couché barre", sets: 4, reps: "8-10", restSec: 90, order: 1 },
          { name: "Développé incliné barre", sets: 3, reps: "10-12", restSec: 75, order: 2 },
          { name: "Développé militaire haltères", sets: 3, reps: "10-12", restSec: 75, order: 3 },
          { name: "Fly câbles croisés", sets: 3, reps: "12-15", restSec: 60, order: 4 },
          { name: "Extensions triceps barre droite", sets: 3, reps: "10-12", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Tirage volume", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Tirage vertical prise large", sets: 4, reps: "10-12", restSec: 75, order: 1 },
          { name: "Rowing machine assis", sets: 4, reps: "10-12", restSec: 75, order: 2 },
          { name: "Pull-over haltère", sets: 3, reps: "12-15", restSec: 60, order: 3 },
          { name: "Curl concentré", sets: 3, reps: "12-15/bras", restSec: 60, order: 4 },
          { name: "Tirage horizontal prise serrée", sets: 3, reps: "12", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Jambes volume", type: SessionType.STRENGTH, durationMin: 70,
        exercises: [
          { name: "Squat hack", sets: 4, reps: "10-12", restSec: 90, order: 1 },
          { name: "Leg press pied haut", sets: 4, reps: "12-15", restSec: 75, order: 2 },
          { name: "Fentes marchées haltères", sets: 3, reps: "12/jambe", restSec: 75, order: 3 },
          { name: "Leg curl debout", sets: 3, reps: "12-15", restSec: 60, order: 4 },
          { name: "Adducteurs machine", sets: 3, reps: "15", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 4, name: "Full upper léger", type: SessionType.STRENGTH, durationMin: 55,
        exercises: [
          { name: "Pompes lestées", sets: 3, reps: "12-15", restSec: 60, order: 1 },
          { name: "Tractions supination", sets: 3, reps: "8-10", restSec: 75, order: 2 },
          { name: "Élévations latérales câbles", sets: 3, reps: "15", restSec: 60, order: 3 },
          { name: "Curl barre EZ", sets: 3, reps: "12", restSec: 60, order: 4 },
          { name: "Extension triceps poulie haute", sets: 3, reps: "15", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 5, name: "Récupération", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
];

// ─── Full musculation – Intermédiaire/Avancé (Upper/Lower 5j) ────────────────
const FULL_STRENGTH_ADVANCED_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Full Musculation – Avancé (Semaine A – Force)",
    sessions: [
      {
        dayOfWeek: 0, name: "Upper – Force", type: SessionType.STRENGTH, durationMin: 75,
        exercises: [
          { name: "Développé couché barre", sets: 5, reps: "3-5", restSec: 150, order: 1 },
          { name: "Rowing Pendlay", sets: 5, reps: "3-5", restSec: 150, order: 2 },
          { name: "Développé militaire barre", sets: 4, reps: "4-6", restSec: 120, order: 3 },
          { name: "Tractions lestées", sets: 4, reps: "4-6", restSec: 120, order: 4 },
          { name: "Curl biceps lourd", sets: 3, reps: "6-8", restSec: 75, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Lower – Squat", type: SessionType.STRENGTH, durationMin: 80,
        exercises: [
          { name: "Squat barre (basse prise)", sets: 5, reps: "3-5", restSec: 180, order: 1 },
          { name: "Front squat", sets: 3, reps: "5", restSec: 150, order: 2 },
          { name: "Soulevé de terre roumain", sets: 3, reps: "6-8", restSec: 120, order: 3 },
          { name: "Leg press", sets: 3, reps: "8-10", restSec: 90, order: 4 },
          { name: "Mollets debout lourds", sets: 5, reps: "8-10", restSec: 75, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Upper – Hypertrophie", type: SessionType.STRENGTH, durationMin: 70,
        exercises: [
          { name: "Développé incliné barre", sets: 4, reps: "8-10", restSec: 90, order: 1 },
          { name: "Rowing haltères unilatéral", sets: 4, reps: "8-10/côté", restSec: 75, order: 2 },
          { name: "Dips lestés", sets: 4, reps: "8-10", restSec: 90, order: 3 },
          { name: "Tirage vertical prise neutre", sets: 4, reps: "8-10", restSec: 75, order: 4 },
          { name: "Élévations latérales 3 séries drop", sets: 3, reps: "10+5+5", restSec: 75, order: 5 },
        ],
      },
      {
        dayOfWeek: 4, name: "Lower – Deadlift", type: SessionType.STRENGTH, durationMin: 80,
        exercises: [
          { name: "Soulevé de terre conventionnel", sets: 5, reps: "3", restSec: 180, order: 1 },
          { name: "Squat bulgare lestés", sets: 3, reps: "8/jambe", restSec: 120, order: 2 },
          { name: "Hip thrust barre lourd", sets: 4, reps: "8-10", restSec: 90, order: 3 },
          { name: "Leg curl couché", sets: 3, reps: "10-12", restSec: 75, order: 4 },
          { name: "Mollets assis lourds", sets: 4, reps: "10-12", restSec: 75, order: 5 },
        ],
      },
      {
        dayOfWeek: 5, name: "Accessoires & Core", type: SessionType.STRENGTH, durationMin: 55,
        exercises: [
          { name: "Face pull + rotation externe", sets: 3, reps: "15", restSec: 60, order: 1 },
          { name: "Curl barre EZ", sets: 3, reps: "10-12", restSec: 60, order: 2 },
          { name: "Extension triceps barre front", sets: 3, reps: "10-12", restSec: 60, order: 3 },
          { name: "Gainage planche", sets: 3, reps: "45s", restSec: 45, order: 4 },
          { name: "Crunchs câble", sets: 3, reps: "15", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Full Musculation – Avancé (Semaine B – Volume)",
    sessions: [
      {
        dayOfWeek: 0, name: "Upper A – Volume poussée", type: SessionType.STRENGTH, durationMin: 75,
        exercises: [
          { name: "Développé couché barre", sets: 5, reps: "6-8", restSec: 120, order: 1 },
          { name: "Développé incliné haltères", sets: 4, reps: "8-10", restSec: 90, order: 2 },
          { name: "Développé militaire haltères", sets: 4, reps: "10-12", restSec: 75, order: 3 },
          { name: "Fly câbles pec deck", sets: 3, reps: "12-15", restSec: 60, order: 4 },
          { name: "Extension triceps corde", sets: 4, reps: "12-15", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Lower A – Squat volume", type: SessionType.STRENGTH, durationMin: 75,
        exercises: [
          { name: "Squat barre", sets: 5, reps: "6-8", restSec: 120, order: 1 },
          { name: "Leg press pied bas", sets: 4, reps: "10-12", restSec: 90, order: 2 },
          { name: "Fentes marchées", sets: 3, reps: "12/jambe", restSec: 75, order: 3 },
          { name: "Leg curl assis", sets: 4, reps: "12-15", restSec: 60, order: 4 },
          { name: "Mollets debout superset assis", sets: 4, reps: "15+15", restSec: 75, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Upper B – Volume tirage", type: SessionType.STRENGTH, durationMin: 75,
        exercises: [
          { name: "Tractions poids corps max", sets: 5, reps: "6-10", restSec: 90, order: 1 },
          { name: "Rowing barre pronation", sets: 4, reps: "8-10", restSec: 90, order: 2 },
          { name: "Pull-over câble", sets: 3, reps: "12-15", restSec: 60, order: 3 },
          { name: "Curl incliné haltères", sets: 4, reps: "10-12", restSec: 60, order: 4 },
          { name: "Rowing visage haute poulie", sets: 3, reps: "15-20", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 4, name: "Lower B – DL volume", type: SessionType.STRENGTH, durationMin: 75,
        exercises: [
          { name: "Soulevé de terre roumain", sets: 4, reps: "8-10", restSec: 120, order: 1 },
          { name: "Hip thrust barre", sets: 4, reps: "10-12", restSec: 90, order: 2 },
          { name: "Fentes bulgares haltères", sets: 3, reps: "10/jambe", restSec: 90, order: 3 },
          { name: "Leg extension", sets: 3, reps: "12-15", restSec: 60, order: 4 },
          { name: "Gainage latéral", sets: 3, reps: "40s/côté", restSec: 45, order: 5 },
        ],
      },
      {
        dayOfWeek: 5, name: "Bras & Épaules", type: SessionType.STRENGTH, durationMin: 55,
        exercises: [
          { name: "Curl barre lourde", sets: 4, reps: "8-10", restSec: 75, order: 1 },
          { name: "Dips poids corps", sets: 3, reps: "12-15", restSec: 60, order: 2 },
          { name: "Élévations frontales disque", sets: 3, reps: "12", restSec: 60, order: 3 },
          { name: "Oiseau câble", sets: 3, reps: "15", restSec: 60, order: 4 },
          { name: "Crunchs bicycle", sets: 3, reps: "20", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Full Musculation – Avancé (Semaine C – Intensité haute)",
    sessions: [
      {
        dayOfWeek: 0, name: "Chest & Tris – Intensité", type: SessionType.STRENGTH, durationMin: 75,
        exercises: [
          { name: "Développé couché pause 1s", sets: 5, reps: "3-4", restSec: 180, order: 1 },
          { name: "Développé incliné barre", sets: 4, reps: "6", restSec: 120, order: 2 },
          { name: "Dips lestés", sets: 4, reps: "5-6", restSec: 120, order: 3 },
          { name: "Fly haltères lents", sets: 3, reps: "10", restSec: 75, order: 4 },
          { name: "Barre au front (skull crusher)", sets: 3, reps: "8-10", restSec: 75, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Back & Bis – Intensité", type: SessionType.STRENGTH, durationMin: 75,
        exercises: [
          { name: "Soulevé de terre", sets: 4, reps: "3", restSec: 180, order: 1 },
          { name: "Tractions lestées", sets: 4, reps: "4-6", restSec: 120, order: 2 },
          { name: "Rowing barre lourd", sets: 4, reps: "5-6", restSec: 120, order: 3 },
          { name: "Curl biceps barre lourd", sets: 3, reps: "6-8", restSec: 90, order: 4 },
          { name: "Gainage planche", sets: 3, reps: "60s", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Jambes – Intensité max", type: SessionType.STRENGTH, durationMin: 85,
        exercises: [
          { name: "Squat barre lourd", sets: 5, reps: "4-5", restSec: 180, order: 1 },
          { name: "Front squat", sets: 3, reps: "4-5", restSec: 150, order: 2 },
          { name: "Soulevé de terre roumain", sets: 4, reps: "6", restSec: 120, order: 3 },
          { name: "Leg press pieds haut", sets: 3, reps: "8", restSec: 90, order: 4 },
          { name: "Mollets debout lourds", sets: 5, reps: "8", restSec: 75, order: 5 },
        ],
      },
      {
        dayOfWeek: 4, name: "Épaules – Press lourd", type: SessionType.STRENGTH, durationMin: 65,
        exercises: [
          { name: "Press militaire barre", sets: 5, reps: "3-5", restSec: 150, order: 1 },
          { name: "Push press explosif", sets: 3, reps: "4-5", restSec: 120, order: 2 },
          { name: "Tirage vertical prise large", sets: 4, reps: "6-8", restSec: 90, order: 3 },
          { name: "Élévations latérales lourdes", sets: 4, reps: "10-12", restSec: 75, order: 4 },
          { name: "Face pull lourd", sets: 3, reps: "12", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 5, name: "Accessoires & Récupération active", type: SessionType.YOGA_STRETCH, durationMin: 35, exercises: [] },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
];

// ─── Running (Course à pied) ──────────────────────────────────────────────────
const RUNNING_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Running – Fondation (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Footing facile", type: SessionType.RUNNING, durationMin: 40,
        exercises: [
          { name: "Échauffement marche / trot", sets: 1, reps: "8 min", restSec: 0, order: 1 },
          { name: "Course zone 2 (allure conversation)", sets: 1, reps: "25 min", restSec: 0, order: 2 },
          { name: "Retour au calme + étirements", sets: 1, reps: "7 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Renforcement musculaire", type: SessionType.STRENGTH, durationMin: 40,
        exercises: [
          { name: "Squat sauté", sets: 3, reps: "10", restSec: 60, order: 1 },
          { name: "Fentes marchées", sets: 3, reps: "12/jambe", restSec: 60, order: 2 },
          { name: "Hip thrust poids corps", sets: 3, reps: "15", restSec: 60, order: 3 },
          { name: "Gainage planche", sets: 3, reps: "40s", restSec: 45, order: 4 },
          { name: "Mollets debout", sets: 3, reps: "20", restSec: 45, order: 5 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Tempo modéré", type: SessionType.RUNNING, durationMin: 45,
        exercises: [
          { name: "Échauffement footing lent", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Tempo allure seuil (6x3min)", sets: 6, reps: "3 min", restSec: 60, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "7 min", restSec: 0, order: 3 },
        ],
      },
      {
        dayOfWeek: 5, name: "Sortie longue", type: SessionType.RUNNING, durationMin: 65,
        exercises: [
          { name: "Course facile Z2 (longue durée)", sets: 1, reps: "55 min", restSec: 0, order: 1 },
          { name: "Retour au calme + étirements", sets: 1, reps: "10 min", restSec: 0, order: 2 },
        ],
      },
      { dayOfWeek: 6, name: "Récupération & Mobilité", type: SessionType.YOGA_STRETCH, durationMin: 25, exercises: [] },
    ],
  },
  {
    name: "Running – Développement (Semaine B – Fractionné)",
    sessions: [
      {
        dayOfWeek: 0, name: "Footing + accélérations", type: SessionType.RUNNING, durationMin: 45,
        exercises: [
          { name: "Footing facile", sets: 1, reps: "20 min", restSec: 0, order: 1 },
          { name: "Accélérations 100m (strides)", sets: 6, reps: "100m", restSec: 90, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Fractionné 400m", type: SessionType.RUNNING, durationMin: 55,
        exercises: [
          { name: "Échauffement 10 min + gammes", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Fractionné 400m (allure 5km)", sets: 8, reps: "400m", restSec: 90, order: 2 },
          { name: "Retour au calme footing lent", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 3, name: "Repos actif", type: SessionType.YOGA_STRETCH, durationMin: 25, exercises: [] },
      {
        dayOfWeek: 4, name: "Tempo soutenu", type: SessionType.RUNNING, durationMin: 50,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Course au seuil lactique", sets: 1, reps: "25 min", restSec: 0, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      {
        dayOfWeek: 5, name: "Sortie longue", type: SessionType.RUNNING, durationMin: 80,
        exercises: [
          { name: "Course facile Z2", sets: 1, reps: "70 min", restSec: 0, order: 1 },
          { name: "Étirements finaux", sets: 1, reps: "10 min", restSec: 0, order: 2 },
        ],
      },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Running – Performance (Semaine C – Intensité max)",
    sessions: [
      {
        dayOfWeek: 0, name: "Activation + strides", type: SessionType.RUNNING, durationMin: 30,
        exercises: [
          { name: "Footing léger + gammes athlétisme", sets: 1, reps: "15 min", restSec: 0, order: 1 },
          { name: "Accélérations progressives 80m", sets: 6, reps: "80m", restSec: 90, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "8 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Intervalles VO2max", type: SessionType.RUNNING, durationMin: 55,
        exercises: [
          { name: "Échauffement progressif", sets: 1, reps: "12 min", restSec: 0, order: 1 },
          { name: "Intervalles 1000m (allure 3km)", sets: 6, reps: "1000m", restSec: 120, order: 2 },
          { name: "Récupération trot 400m", sets: 5, reps: "400m trot", restSec: 0, order: 3 },
          { name: "Retour au calme", sets: 1, reps: "8 min", restSec: 0, order: 4 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Tempo marathon", type: SessionType.RUNNING, durationMin: 55,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Allure marathon 30 min", sets: 1, reps: "30 min", restSec: 0, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      {
        dayOfWeek: 5, name: "Sortie longue allure", type: SessionType.RUNNING, durationMin: 90,
        exercises: [
          { name: "Course facile 30 min", sets: 1, reps: "30 min Z2", restSec: 0, order: 1 },
          { name: "Progression allure marathon 40 min", sets: 1, reps: "40 min", restSec: 0, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 3 },
          { name: "Étirements complets", sets: 1, reps: "10 min", restSec: 0, order: 4 },
        ],
      },
      { dayOfWeek: 6, name: "Récupération", type: SessionType.YOGA_STRETCH, durationMin: 25, exercises: [] },
    ],
  },
];

// ─── Cycling (Vélo / Cyclisme) ────────────────────────────────────────────────
const CYCLING_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Cycling – Endurance de base (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Sortie Z2 (endurance)", type: SessionType.CYCLING, durationMin: 60,
        exercises: [
          { name: "Échauffement progressif", sets: 1, reps: "10 min Z1", restSec: 0, order: 1 },
          { name: "Endurance aérobie (FTP 60-65%)", sets: 1, reps: "40 min", restSec: 0, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min Z1", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Intervalles courts", type: SessionType.CYCLING, durationMin: 55,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "12 min Z1-Z2", restSec: 0, order: 1 },
          { name: "Intervalles 1 min @ 120% FTP", sets: 10, reps: "1 min", restSec: 60, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "12 min Z1", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 3, name: "Récupération active", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      {
        dayOfWeek: 4, name: "Tempo (sweet spot)", type: SessionType.CYCLING, durationMin: 55,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Sweet spot FTP 88-93%", sets: 2, reps: "15 min", restSec: 300, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      {
        dayOfWeek: 5, name: "Sortie longue", type: SessionType.CYCLING, durationMin: 120,
        exercises: [
          { name: "Sortie longue Z2 constante", sets: 1, reps: "100 min", restSec: 0, order: 1 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 2 },
        ],
      },
      { dayOfWeek: 6, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
  {
    name: "Cycling – Développement puissance (Semaine B)",
    sessions: [
      {
        dayOfWeek: 0, name: "Activation + côtes", type: SessionType.CYCLING, durationMin: 50,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Répétitions côtes (VO2max)", sets: 5, reps: "4 min @ 110% FTP", restSec: 300, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "12 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Intervalles VO2max", type: SessionType.CYCLING, durationMin: 60,
        exercises: [
          { name: "Échauffement progressif", sets: 1, reps: "15 min", restSec: 0, order: 1 },
          { name: "Intervalles 5 min @ 110-120% FTP", sets: 5, reps: "5 min", restSec: 300, order: 2 },
          { name: "Récupération entre séries (50% FTP)", sets: 4, reps: "5 min", restSec: 0, order: 3 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 4 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Sweet spot long", type: SessionType.CYCLING, durationMin: 70,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Sweet spot 3x20 min (FTP 88-93%)", sets: 3, reps: "20 min", restSec: 300, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      {
        dayOfWeek: 5, name: "Sortie longue + relances", type: SessionType.CYCLING, durationMin: 100,
        exercises: [
          { name: "Sortie Z2 (fond de sortie)", sets: 1, reps: "60 min", restSec: 0, order: 1 },
          { name: "Relances tempo 3 min", sets: 5, reps: "3 min", restSec: 120, order: 2 },
          { name: "Retour au calme Z1", sets: 1, reps: "15 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 6, name: "Récupération", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
    ],
  },
  {
    name: "Cycling – Performance & Compétition (Semaine C)",
    sessions: [
      {
        dayOfWeek: 0, name: "Activation légère", type: SessionType.CYCLING, durationMin: 40,
        exercises: [
          { name: "Sortie récupération active Z1-Z2", sets: 1, reps: "35 min", restSec: 0, order: 1 },
          { name: "3 accélérations courtes", sets: 3, reps: "30s sprint", restSec: 300, order: 2 },
        ],
      },
      { dayOfWeek: 1, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 2, name: "Simulation course (micro-sprints)", type: SessionType.CYCLING, durationMin: 60,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "15 min", restSec: 0, order: 1 },
          { name: "Sprints neuromusculaires 10s", sets: 8, reps: "10s @ max", restSec: 300, order: 2 },
          { name: "Sweet spot 2x12 min", sets: 2, reps: "12 min", restSec: 300, order: 3 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 4 },
        ],
      },
      { dayOfWeek: 3, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 4, name: "Tempo race pace", type: SessionType.CYCLING, durationMin: 60,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Effort race pace FTP", sets: 1, reps: "30 min @ FTP", restSec: 0, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      {
        dayOfWeek: 5, name: "Sortie compétition / longue", type: SessionType.CYCLING, durationMin: 90,
        exercises: [
          { name: "Course longue Z2", sets: 1, reps: "60 min", restSec: 0, order: 1 },
          { name: "Finales race pace", sets: 3, reps: "5 min race pace", restSec: 180, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 6, name: "Récupération", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
    ],
  },
];

// ─── CrossFit & HYROX ─────────────────────────────────────────────────────────
const CROSSFIT_HYROX_VARIANTS: WorkoutTemplate[] = [
  {
    name: "CrossFit / HYROX – Fondation (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "WOD – Force fonctionnelle", type: SessionType.CROSSFIT, durationMin: 60,
        exercises: [
          { name: "Échauffement dynamique + mobilité", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Power clean", sets: 5, reps: "3", restSec: 120, order: 2 },
          { name: "Thruster barre", sets: 4, reps: "5", restSec: 120, order: 3 },
          { name: "WOD : Deadlift + Box jumps AMRAP 10 min", sets: 1, reps: "10 min AMRAP", restSec: 0, order: 4 },
          { name: "Core : GHD sit-ups", sets: 3, reps: "15", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Conditioning – AMRAP", type: SessionType.CROSSFIT, durationMin: 50,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "8 min", restSec: 0, order: 1 },
          { name: "AMRAP 20 min : 10 Burpees / 15 Wall balls / 200m row", sets: 1, reps: "20 min", restSec: 0, order: 2 },
          { name: "Finisher : Box step-ups lestés", sets: 3, reps: "20", restSec: 60, order: 3 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "HYROX Simulation (partielle)", type: SessionType.CROSSFIT, durationMin: 65,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Ski erg", sets: 4, reps: "250m", restSec: 90, order: 2 },
          { name: "Sled push (60% BW)", sets: 4, reps: "25m", restSec: 90, order: 3 },
          { name: "Burpee broad jumps", sets: 3, reps: "10", restSec: 75, order: 4 },
          { name: "Wall balls 9/6kg", sets: 4, reps: "15", restSec: 75, order: 5 },
          { name: "Run 400m récup", sets: 2, reps: "400m", restSec: 120, order: 6 },
        ],
      },
      {
        dayOfWeek: 4, name: "Gymnastics & Skills", type: SessionType.CROSSFIT, durationMin: 50,
        exercises: [
          { name: "Échauffement + mobility", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Toes-to-bar", sets: 4, reps: "10", restSec: 60, order: 2 },
          { name: "Handstand push-ups (ou pike push-ups)", sets: 4, reps: "6-8", restSec: 90, order: 3 },
          { name: "Ring dips", sets: 3, reps: "8-10", restSec: 75, order: 4 },
          { name: "Double unders à la corde", sets: 3, reps: "50", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 5, name: "WOD Long (chipper)", type: SessionType.CROSSFIT, durationMin: 65,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Chipper : 50 Wall balls / 40 Pull-ups / 30 Box jumps / 20 Thrusters / 10 Muscle-ups", sets: 1, reps: "For time", restSec: 0, order: 2 },
          { name: "Cool down + stretching", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 6, name: "Mobilité & Récupération", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
    ],
  },
  {
    name: "CrossFit / HYROX – Développement (Semaine B)",
    sessions: [
      {
        dayOfWeek: 0, name: "WOD Force & Olympique", type: SessionType.CROSSFIT, durationMin: 65,
        exercises: [
          { name: "Échauffement + activation", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Squat clean", sets: 5, reps: "3", restSec: 150, order: 2 },
          { name: "Jerk (split ou push jerk)", sets: 4, reps: "3", restSec: 120, order: 3 },
          { name: "Snatch power", sets: 4, reps: "3", restSec: 120, order: 4 },
          { name: "WOD : Grace (30 C&J for time)", sets: 1, reps: "For time", restSec: 0, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Running + Fonctionnel", type: SessionType.CROSSFIT, durationMin: 55,
        exercises: [
          { name: "Run 800m warm-up", sets: 1, reps: "800m", restSec: 0, order: 1 },
          { name: "5 rounds : 400m run + 15 Kettlebell swings + 10 Pull-ups", sets: 5, reps: "1 round", restSec: 60, order: 2 },
          { name: "Cool down 400m marche", sets: 1, reps: "400m", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "HYROX Full Simulation", type: SessionType.CROSSFIT, durationMin: 75,
        exercises: [
          { name: "Échauffement 1km run léger", sets: 1, reps: "1 km", restSec: 0, order: 1 },
          { name: "Stations HYROX : Ski erg 1000m", sets: 1, reps: "1000m", restSec: 0, order: 2 },
          { name: "Sled push 50m", sets: 1, reps: "50m", restSec: 0, order: 3 },
          { name: "Sled pull 50m", sets: 1, reps: "50m", restSec: 0, order: 4 },
          { name: "Burpee broad jumps 80m", sets: 1, reps: "80m", restSec: 0, order: 5 },
          { name: "Rowing 1000m", sets: 1, reps: "1000m", restSec: 0, order: 6 },
          { name: "Farmer carry 200m", sets: 1, reps: "200m", restSec: 0, order: 7 },
          { name: "Sandbag lunges 100m", sets: 1, reps: "100m", restSec: 0, order: 8 },
          { name: "Wall balls 100 reps", sets: 1, reps: "100 reps", restSec: 0, order: 9 },
        ],
      },
      { dayOfWeek: 4, name: "Repos actif", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 5, name: "Benchmark WOD", type: SessionType.CROSSFIT, durationMin: 70,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Fran : 21-15-9 Thrusters 43/30kg + Pull-ups", sets: 1, reps: "For time", restSec: 0, order: 2 },
          { name: "Diane : 21-15-9 DL 102/70kg + HSPU", sets: 1, reps: "For time", restSec: 0, order: 3 },
          { name: "Cool down + mobilité", sets: 1, reps: "10 min", restSec: 0, order: 4 },
        ],
      },
      { dayOfWeek: 6, name: "Mobilité & Récupération", type: SessionType.YOGA_STRETCH, durationMin: 35, exercises: [] },
    ],
  },
  {
    name: "CrossFit / HYROX – Précompétition (Semaine C)",
    sessions: [
      {
        dayOfWeek: 0, name: "Force lourde + explosivité", type: SessionType.CROSSFIT, durationMin: 60,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Back squat lourd", sets: 5, reps: "3", restSec: 150, order: 2 },
          { name: "Box jumps max height", sets: 5, reps: "5", restSec: 90, order: 3 },
          { name: "Clean & jerk puissance", sets: 4, reps: "2", restSec: 120, order: 4 },
          { name: "EMOM 10 min : 3 thrusters @ 85%", sets: 10, reps: "3", restSec: 0, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "HYROX Stations spécifiques", type: SessionType.CROSSFIT, durationMin: 60,
        exercises: [
          { name: "Ski erg 4x500m", sets: 4, reps: "500m", restSec: 120, order: 1 },
          { name: "Sled push race pace", sets: 6, reps: "25m", restSec: 60, order: 2 },
          { name: "Wall balls compétition", sets: 5, reps: "20", restSec: 60, order: 3 },
          { name: "Burpee broad jumps", sets: 4, reps: "10", restSec: 90, order: 4 },
          { name: "Farmer carry 100m", sets: 4, reps: "100m", restSec: 90, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Simulation HYROX race + sprints", type: SessionType.CROSSFIT, durationMin: 65,
        exercises: [
          { name: "Run 1km échauffement", sets: 1, reps: "1 km", restSec: 0, order: 1 },
          { name: "Half HYROX (4 stations run 1km + 4 stations)", sets: 1, reps: "For time", restSec: 0, order: 2 },
          { name: "Sprint final 200m", sets: 3, reps: "200m", restSec: 120, order: 3 },
          { name: "Cool down", sets: 1, reps: "10 min", restSec: 0, order: 4 },
        ],
      },
      { dayOfWeek: 4, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 5, name: "Affûtage – WOD court", type: SessionType.CROSSFIT, durationMin: 50,
        exercises: [
          { name: "Échauffement + gammes", sets: 1, reps: "12 min", restSec: 0, order: 1 },
          { name: "WOD court : 3 rounds 400m + 10 HSPU + 15 Pull-ups", sets: 3, reps: "1 round", restSec: 60, order: 2 },
          { name: "Mobilité ciblée (hanches, épaules)", sets: 1, reps: "10 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 6, name: "Repos complet", type: SessionType.REST, durationMin: 0, exercises: [] },
    ],
  },
];

// ─── Arts Martiaux ────────────────────────────────────────────────────────────
const MARTIAL_ARTS_VARIANTS: WorkoutTemplate[] = [
  {
    name: "Arts Martiaux – Technique & Bases (Semaine A)",
    sessions: [
      {
        dayOfWeek: 0, name: "Techniques de base", type: SessionType.MARTIAL_ARTS, durationMin: 60,
        exercises: [
          { name: "Échauffement articulaire + souplesse", sets: 1, reps: "15 min", restSec: 0, order: 1 },
          { name: "Gardes et déplacements", sets: 3, reps: "5 min", restSec: 60, order: 2 },
          { name: "Combinaisons de frappes (directs, crochets, uppercuts)", sets: 5, reps: "2 min", restSec: 60, order: 3 },
          { name: "Travail des esquives et parades", sets: 3, reps: "3 min", restSec: 60, order: 4 },
          { name: "Shadow boxing technique", sets: 3, reps: "3 min", restSec: 60, order: 5 },
        ],
      },
      {
        dayOfWeek: 1, name: "Conditionnement physique", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Pompes (variantes)", sets: 4, reps: "15-20", restSec: 60, order: 1 },
          { name: "Tractions / tirage barre", sets: 3, reps: "8-10", restSec: 75, order: 2 },
          { name: "Squat sauté", sets: 4, reps: "15", restSec: 60, order: 3 },
          { name: "Gainage planche & variantes", sets: 3, reps: "45s", restSec: 45, order: 4 },
          { name: "Burpees", sets: 3, reps: "12", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Travail au sac", type: SessionType.MARTIAL_ARTS, durationMin: 60,
        exercises: [
          { name: "Échauffement corde à sauter", sets: 3, reps: "3 min", restSec: 60, order: 1 },
          { name: "Sac de frappe – combinaisons directes", sets: 5, reps: "3 min", restSec: 60, order: 2 },
          { name: "Sac – séquences basses (kicks)", sets: 4, reps: "3 min", restSec: 60, order: 3 },
          { name: "Sac – puissance de frappe 20s max", sets: 6, reps: "20s", restSec: 40, order: 4 },
          { name: "Cool down + étirements", sets: 1, reps: "10 min", restSec: 0, order: 5 },
        ],
      },
      {
        dayOfWeek: 4, name: "Sparring contrôlé", type: SessionType.MARTIAL_ARTS, durationMin: 55,
        exercises: [
          { name: "Échauffement + revue techniques", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Drill partenaire (distance et timing)", sets: 4, reps: "3 min", restSec: 60, order: 2 },
          { name: "Sparring light contact (50%)", sets: 4, reps: "3 min", restSec: 60, order: 3 },
          { name: "Travail au sol (clinch / projection)", sets: 3, reps: "3 min", restSec: 60, order: 4 },
        ],
      },
      {
        dayOfWeek: 5, name: "Cardio & Endurance", type: SessionType.RUNNING, durationMin: 35,
        exercises: [
          { name: "Footing récupération", sets: 1, reps: "20 min", restSec: 0, order: 1 },
          { name: "Sprints 30m (accélérations)", sets: 8, reps: "30m", restSec: 60, order: 2 },
          { name: "Étirements finaux", sets: 1, reps: "8 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 6, name: "Souplesse & Récupération", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
    ],
  },
  {
    name: "Arts Martiaux – Intensification (Semaine B)",
    sessions: [
      {
        dayOfWeek: 0, name: "Kata & Technique avancée", type: SessionType.MARTIAL_ARTS, durationMin: 60,
        exercises: [
          { name: "Échauffement + souplesse hanches", sets: 1, reps: "15 min", restSec: 0, order: 1 },
          { name: "Kata / enchaînements imposés", sets: 5, reps: "5 min", restSec: 60, order: 2 },
          { name: "Combinaisons avancées (3-5 coups)", sets: 5, reps: "3 min", restSec: 60, order: 3 },
          { name: "Contre-attaque et riposte", sets: 3, reps: "3 min", restSec: 60, order: 4 },
        ],
      },
      {
        dayOfWeek: 1, name: "Circuit training fonctionnel", type: SessionType.STRENGTH, durationMin: 50,
        exercises: [
          { name: "Circuit 5 exercices x3 tours (repos 2 min entre tours)", sets: 1, reps: "Instruction", restSec: 0, order: 1 },
          { name: "Kettlebell swings", sets: 3, reps: "20", restSec: 0, order: 2 },
          { name: "Burpees", sets: 3, reps: "12", restSec: 0, order: 3 },
          { name: "Box jumps", sets: 3, reps: "10", restSec: 0, order: 4 },
          { name: "Pompes diamant", sets: 3, reps: "15", restSec: 0, order: 5 },
          { name: "Gainage dynamique", sets: 3, reps: "30s", restSec: 120, order: 6 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Défense & Contre-attaque", type: SessionType.MARTIAL_ARTS, durationMin: 60,
        exercises: [
          { name: "Échauffement + gammes défensives", sets: 1, reps: "12 min", restSec: 0, order: 1 },
          { name: "Drill défense – parades / esquives", sets: 4, reps: "3 min", restSec: 60, order: 2 },
          { name: "Contre-attaque sur signal partenaire", sets: 5, reps: "3 min", restSec: 60, order: 3 },
          { name: "Projection et contrôle au sol", sets: 3, reps: "3 min", restSec: 75, order: 4 },
        ],
      },
      {
        dayOfWeek: 4, name: "Sparring intensif", type: SessionType.MARTIAL_ARTS, durationMin: 65,
        exercises: [
          { name: "Échauffement + shadow boxing", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Sparring progressif (70-80%)", sets: 5, reps: "3 min", restSec: 60, order: 2 },
          { name: "Sparring spécifique (clinch)", sets: 3, reps: "3 min", restSec: 60, order: 3 },
          { name: "Ronde de finition pleine intensité", sets: 1, reps: "5 min", restSec: 0, order: 4 },
        ],
      },
      {
        dayOfWeek: 5, name: "Run cardio", type: SessionType.RUNNING, durationMin: 40,
        exercises: [
          { name: "Footing modéré", sets: 1, reps: "25 min", restSec: 0, order: 1 },
          { name: "Accélérations 15s", sets: 6, reps: "15s sprint", restSec: 75, order: 2 },
          { name: "Retour au calme", sets: 1, reps: "8 min", restSec: 0, order: 3 },
        ],
      },
      { dayOfWeek: 6, name: "Étirements profonds", type: SessionType.YOGA_STRETCH, durationMin: 35, exercises: [] },
    ],
  },
  {
    name: "Arts Martiaux – Précompétition (Semaine C)",
    sessions: [
      {
        dayOfWeek: 0, name: "Perfection technique", type: SessionType.MARTIAL_ARTS, durationMin: 60,
        exercises: [
          { name: "Échauffement spécifique", sets: 1, reps: "15 min", restSec: 0, order: 1 },
          { name: "Combinaisons compétition (x100 répétitions)", sets: 10, reps: "10 fois", restSec: 60, order: 2 },
          { name: "Analyse vidéo + corrections techniques", sets: 1, reps: "10 min", restSec: 0, order: 3 },
          { name: "Shadow boxing chrono 3x5 min", sets: 3, reps: "5 min", restSec: 60, order: 4 },
        ],
      },
      {
        dayOfWeek: 1, name: "Explosivité & Pliométrie", type: SessionType.STRENGTH, durationMin: 45,
        exercises: [
          { name: "Squat sauté lourd", sets: 4, reps: "6", restSec: 90, order: 1 },
          { name: "Fentes sautées", sets: 3, reps: "10/jambe", restSec: 75, order: 2 },
          { name: "Medicine ball slam", sets: 4, reps: "12", restSec: 60, order: 3 },
          { name: "Push-ups explosifs", sets: 3, reps: "10", restSec: 60, order: 4 },
          { name: "Sprint 20m", sets: 6, reps: "20m", restSec: 60, order: 5 },
        ],
      },
      { dayOfWeek: 2, name: "Repos", type: SessionType.REST, durationMin: 0, exercises: [] },
      {
        dayOfWeek: 3, name: "Simulation combat", type: SessionType.MARTIAL_ARTS, durationMin: 70,
        exercises: [
          { name: "Échauffement complet rituel compétition", sets: 1, reps: "15 min", restSec: 0, order: 1 },
          { name: "Combats simulés (durée règlement)", sets: 4, reps: "3-5 min", restSec: 60, order: 2 },
          { name: "Scénarios tactiques spécifiques", sets: 3, reps: "3 min", restSec: 60, order: 3 },
          { name: "Round final pleine intensité", sets: 1, reps: "5 min", restSec: 0, order: 4 },
        ],
      },
      { dayOfWeek: 4, name: "Repos léger", type: SessionType.YOGA_STRETCH, durationMin: 30, exercises: [] },
      {
        dayOfWeek: 5, name: "Affûtage – Sparring léger", type: SessionType.MARTIAL_ARTS, durationMin: 60,
        exercises: [
          { name: "Échauffement", sets: 1, reps: "10 min", restSec: 0, order: 1 },
          { name: "Sparring très léger (confiance)", sets: 4, reps: "3 min", restSec: 60, order: 2 },
          { name: "Travail mental & visualisation", sets: 1, reps: "10 min", restSec: 0, order: 3 },
          { name: "Étirements complets", sets: 1, reps: "10 min", restSec: 0, order: 4 },
        ],
      },
      { dayOfWeek: 6, name: "Repos complet", type: SessionType.REST, durationMin: 0, exercises: [] },
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
  if (goal === Goal.FULL_STRENGTH) {
    return level === Level.BEGINNER ? FULL_STRENGTH_BEGINNER_VARIANTS : FULL_STRENGTH_ADVANCED_VARIANTS;
  }
  if (goal === Goal.RUNNING) {
    return RUNNING_VARIANTS;
  }
  if (goal === Goal.CYCLING) {
    return CYCLING_VARIANTS;
  }
  if (goal === Goal.CROSSFIT_HYROX) {
    return CROSSFIT_HYROX_VARIANTS;
  }
  if (goal === Goal.MARTIAL_ARTS) {
    return MARTIAL_ARTS_VARIANTS;
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
