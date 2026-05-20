import { Goal, MealType, IngredientCategory } from "@/generated/prisma/client";

type IngredientTemplate = {
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
};

type MealTemplate = {
  type: MealType;
  name: string;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  ingredients: IngredientTemplate[];
};

type DayMenuTemplate = {
  dayOfWeek: number;
  meals: MealTemplate[];
};

// ─── Calcul des macros selon l'objectif ──────────────────────────────────────
export function computeTargetCalories(
  weight: number,
  height: number,
  age: number,
  sex: "MALE" | "FEMALE",
  goal: Goal
): { bmr: number; tdee: number; targetCalories: number } {
  // Formule Mifflin-St Jeor
  const bmr =
    sex === "MALE"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // Facteur d'activité modéré (3-5j/semaine)
  const tdee = bmr * 1.55;

  let targetCalories: number;
  if (goal === "MUSCLE_GAIN") targetCalories = tdee * 1.1;
  else if (goal === "FAT_LOSS") targetCalories = tdee * 0.82;
  else if (goal === "GENTLE_RETURN") targetCalories = tdee * 0.95;
  else targetCalories = tdee;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
  };
}

// ─── Scale les macros d'un repas selon les calories cibles ───────────────────
function scaleMeal(meal: MealTemplate, factor: number): MealTemplate {
  return {
    ...meal,
    baseCalories: meal.baseCalories * factor,
    baseProtein: meal.baseProtein * factor,
    baseCarbs: meal.baseCarbs * factor,
    baseFat: meal.baseFat * factor,
    ingredients: meal.ingredients.map((ing) => ({
      ...ing,
      quantity: Math.round(ing.quantity * factor * 10) / 10,
    })),
  };
}

// ─── Menus de base pour ~2000 kcal ───────────────────────────────────────────
const BASE_WEEK_MENUS: DayMenuTemplate[] = [
  {
    dayOfWeek: 0, // Lundi
    meals: [
      {
        type: MealType.BREAKFAST, name: "Porridge protéiné aux fruits",
        baseCalories: 420, baseProtein: 25, baseCarbs: 55, baseFat: 10,
        ingredients: [
          { name: "Flocons d'avoine", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Lait demi-écrémé", quantity: 200, unit: "ml", category: IngredientCategory.DAIRY_EGGS },
          { name: "Whey protéine vanille", quantity: 30, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Banane", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Miel", quantity: 10, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.SNACK, name: "Collation matinale",
        baseCalories: 180, baseProtein: 15, baseCarbs: 20, baseFat: 4,
        ingredients: [
          { name: "Yaourt grec 0%", quantity: 150, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Myrtilles", quantity: 80, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Poulet rôti, riz et légumes",
        baseCalories: 650, baseProtein: 50, baseCarbs: 70, baseFat: 12,
        ingredients: [
          { name: "Blanc de poulet", quantity: 180, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Riz basmati", quantity: 100, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Brocoli", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Huile d'olive", quantity: 10, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Herbes de Provence", quantity: 3, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.DINNER, name: "Saumon vapeur et quinoa",
        baseCalories: 580, baseProtein: 42, baseCarbs: 48, baseFat: 20,
        ingredients: [
          { name: "Filet de saumon", quantity: 160, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Quinoa", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Épinards frais", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Citron", quantity: 0.5, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Huile d'olive", quantity: 8, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 1, // Mardi
    meals: [
      {
        type: MealType.BREAKFAST, name: "Œufs brouillés et pain complet",
        baseCalories: 400, baseProtein: 28, baseCarbs: 38, baseFat: 14,
        ingredients: [
          { name: "Œufs", quantity: 3, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Pain complet", quantity: 60, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Tomate", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Beurre", quantity: 5, unit: "g", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.SNACK, name: "Fruit & oléagineux",
        baseCalories: 200, baseProtein: 5, baseCarbs: 22, baseFat: 12,
        ingredients: [
          { name: "Amandes", quantity: 30, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Pomme", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Salade de thon, pâtes et légumes",
        baseCalories: 620, baseProtein: 48, baseCarbs: 68, baseFat: 10,
        ingredients: [
          { name: "Thon en conserve (eau)", quantity: 160, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Pâtes complètes", quantity: 90, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Maïs", quantity: 60, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Concombre", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Huile d'olive", quantity: 8, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Moutarde", quantity: 5, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.DINNER, name: "Bœuf haché, patate douce et haricots verts",
        baseCalories: 600, baseProtein: 46, baseCarbs: 52, baseFat: 18,
        ingredients: [
          { name: "Bœuf haché 5%", quantity: 180, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Patate douce", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Haricots verts", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Huile d'olive", quantity: 8, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Ail", quantity: 2, unit: "gousse", category: IngredientCategory.CONDIMENTS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 2, // Mercredi
    meals: [
      {
        type: MealType.BREAKFAST, name: "Smoothie protéiné banane-beurre de cacahuète",
        baseCalories: 450, baseProtein: 30, baseCarbs: 50, baseFat: 14,
        ingredients: [
          { name: "Banane", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Lait d'amande", quantity: 250, unit: "ml", category: IngredientCategory.DAIRY_EGGS },
          { name: "Whey protéine chocolat", quantity: 30, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Beurre de cacahuète", quantity: 20, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Flocons d'avoine", quantity: 30, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
        ],
      },
      {
        type: MealType.SNACK, name: "Fromage blanc et fruits rouges",
        baseCalories: 170, baseProtein: 16, baseCarbs: 18, baseFat: 2,
        ingredients: [
          { name: "Fromage blanc 0%", quantity: 200, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Fruits rouges mélangés", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Lentilles au curry et riz",
        baseCalories: 600, baseProtein: 32, baseCarbs: 88, baseFat: 8,
        ingredients: [
          { name: "Lentilles corail", quantity: 100, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Riz basmati", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Lait de coco (light)", quantity: 100, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Oignon", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Curry en poudre", quantity: 5, unit: "g", category: IngredientCategory.CONDIMENTS },
          { name: "Tomates pelées", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.DINNER, name: "Dinde sautée et légumes wok",
        baseCalories: 520, baseProtein: 45, baseCarbs: 40, baseFat: 14,
        ingredients: [
          { name: "Escalope de dinde", quantity: 180, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Poivrons mélangés", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Courgette", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Nouilles soba", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Sauce soja", quantity: 15, unit: "ml", category: IngredientCategory.CONDIMENTS },
          { name: "Huile de sésame", quantity: 8, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 3, // Jeudi
    meals: [
      {
        type: MealType.BREAKFAST, name: "Bowl açaï et granola",
        baseCalories: 410, baseProtein: 18, baseCarbs: 60, baseFat: 12,
        ingredients: [
          { name: "Purée açaï surgelée", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Granola maison", quantity: 50, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Yaourt grec", quantity: 100, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Kiwi", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Graines de chia", quantity: 10, unit: "g", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.SNACK, name: "Barre de protéines maison",
        baseCalories: 220, baseProtein: 20, baseCarbs: 24, baseFat: 6,
        ingredients: [
          { name: "Flocons d'avoine", quantity: 40, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Whey protéine", quantity: 20, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Miel", quantity: 15, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.LUNCH, name: "Wrap poulet avocat",
        baseCalories: 620, baseProtein: 44, baseCarbs: 55, baseFat: 22,
        ingredients: [
          { name: "Blanc de poulet grillé", quantity: 160, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Tortilla de blé complet", quantity: 2, unit: "pièce", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Avocat", quantity: 0.5, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Laitue", quantity: 50, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Tomate cerise", quantity: 80, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Fromage râpé allégé", quantity: 20, unit: "g", category: IngredientCategory.DAIRY_EGGS },
        ],
      },
      {
        type: MealType.DINNER, name: "Crevettes sautées et riz thaï",
        baseCalories: 550, baseProtein: 40, baseCarbs: 60, baseFat: 10,
        ingredients: [
          { name: "Crevettes décortiquées", quantity: 200, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Riz thaï", quantity: 90, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Poivron rouge", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Oignon", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Sauce huître", quantity: 15, unit: "ml", category: IngredientCategory.CONDIMENTS },
          { name: "Huile d'olive", quantity: 8, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 4, // Vendredi
    meals: [
      {
        type: MealType.BREAKFAST, name: "Pancakes protéinés banane",
        baseCalories: 440, baseProtein: 32, baseCarbs: 52, baseFat: 10,
        ingredients: [
          { name: "Banane", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Œufs", quantity: 2, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Flocons d'avoine", quantity: 50, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Whey protéine", quantity: 20, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Sirop d'érable", quantity: 10, unit: "ml", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.SNACK, name: "Cottage cheese et noix",
        baseCalories: 190, baseProtein: 18, baseCarbs: 8, baseFat: 10,
        ingredients: [
          { name: "Cottage cheese", quantity: 150, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Noix de cajou", quantity: 20, unit: "g", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.LUNCH, name: "Salade niçoise protéinée",
        baseCalories: 580, baseProtein: 48, baseCarbs: 38, baseFat: 24,
        ingredients: [
          { name: "Thon en conserve", quantity: 160, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Œufs durs", quantity: 2, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Haricots verts", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Pommes de terre vapeur", quantity: 120, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Olives noires", quantity: 30, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Huile d'olive", quantity: 10, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Vinaigre de vin", quantity: 5, unit: "ml", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.DINNER, name: "Cod au four, purée de patate douce",
        baseCalories: 520, baseProtein: 44, baseCarbs: 50, baseFat: 12,
        ingredients: [
          { name: "Filet de cabillaud", quantity: 180, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Patate douce", quantity: 220, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Beurre", quantity: 8, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Citron", quantity: 0.5, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Persil frais", quantity: 10, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 5, // Samedi
    meals: [
      {
        type: MealType.BREAKFAST, name: "Tartines au beurre de cacahuète",
        baseCalories: 400, baseProtein: 18, baseCarbs: 45, baseFat: 16,
        ingredients: [
          { name: "Pain complet", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Beurre de cacahuète naturel", quantity: 30, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Banane", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Lait demi-écrémé", quantity: 200, unit: "ml", category: IngredientCategory.DAIRY_EGGS },
        ],
      },
      {
        type: MealType.SNACK, name: "Yaourt grec et amandes",
        baseCalories: 210, baseProtein: 14, baseCarbs: 14, baseFat: 12,
        ingredients: [
          { name: "Yaourt grec", quantity: 150, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Amandes effilées", quantity: 20, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Miel", quantity: 8, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.LUNCH, name: "Risotto au poulet et champignons",
        baseCalories: 640, baseProtein: 46, baseCarbs: 72, baseFat: 14,
        ingredients: [
          { name: "Blanc de poulet", quantity: 160, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Riz à risotto", quantity: 100, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Champignons de Paris", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Parmesan râpé", quantity: 20, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Bouillon de légumes", quantity: 400, unit: "ml", category: IngredientCategory.CONDIMENTS },
          { name: "Huile d'olive", quantity: 8, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.DINNER, name: "Steak et légumes grillés",
        baseCalories: 540, baseProtein: 50, baseCarbs: 28, baseFat: 22,
        ingredients: [
          { name: "Steak de bœuf (rumsteck)", quantity: 180, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Asperges", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Tomates", quantity: 2, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Huile d'olive", quantity: 10, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Pain complet", quantity: 40, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
        ],
      },
    ],
  },
  {
    dayOfWeek: 6, // Dimanche
    meals: [
      {
        type: MealType.BREAKFAST, name: "Brunch œufs bénédicte light",
        baseCalories: 480, baseProtein: 36, baseCarbs: 42, baseFat: 16,
        ingredients: [
          { name: "Œufs pochés", quantity: 3, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Jambon blanc", quantity: 80, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Pain de campagne", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Épinards sautés", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Fromage frais", quantity: 30, unit: "g", category: IngredientCategory.DAIRY_EGGS },
        ],
      },
      {
        type: MealType.LUNCH, name: "Tajine de poulet aux légumes",
        baseCalories: 620, baseProtein: 48, baseCarbs: 58, baseFat: 16,
        ingredients: [
          { name: "Cuisses de poulet", quantity: 200, unit: "g", category: IngredientCategory.MEAT_FISH },
          { name: "Pois chiches", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Courgette", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Carottes", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Semoule", quantity: 70, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Ras el hanout", quantity: 5, unit: "g", category: IngredientCategory.CONDIMENTS },
          { name: "Huile d'olive", quantity: 8, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.SNACK, name: "Fruit de saison",
        baseCalories: 90, baseProtein: 1, baseCarbs: 22, baseFat: 0,
        ingredients: [
          { name: "Orange ou poire", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.DINNER, name: "Soupe de légumes et tartines",
        baseCalories: 380, baseProtein: 18, baseCarbs: 50, baseFat: 10,
        ingredients: [
          { name: "Légumes pour soupe (poireau, carotte, navet)", quantity: 300, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Pain complet", quantity: 60, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Gruyère râpé", quantity: 30, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Huile d'olive", quantity: 8, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
    ],
  },
];

// ─── Menus végétariens (7 jours) ─────────────────────────────────────────────
const VEGETARIAN_WEEK_MENUS: DayMenuTemplate[] = [
  {
    dayOfWeek: 0,
    meals: [
      {
        type: MealType.BREAKFAST, name: "Porridge avoine, lait et fruits",
        baseCalories: 420, baseProtein: 20, baseCarbs: 58, baseFat: 10,
        ingredients: [
          { name: "Flocons d'avoine", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Lait demi-écrémé", quantity: 200, unit: "ml", category: IngredientCategory.DAIRY_EGGS },
          { name: "Banane", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Graines de chia", quantity: 15, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Miel", quantity: 10, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.SNACK, name: "Yaourt grec et fruits rouges",
        baseCalories: 180, baseProtein: 15, baseCarbs: 18, baseFat: 4,
        ingredients: [
          { name: "Yaourt grec 0%", quantity: 150, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Fruits rouges mélangés", quantity: 80, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Bowl tofu grillé, riz et brocoli",
        baseCalories: 640, baseProtein: 36, baseCarbs: 72, baseFat: 16,
        ingredients: [
          { name: "Tofu ferme", quantity: 200, unit: "g", category: IngredientCategory.OTHER },
          { name: "Riz basmati", quantity: 100, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Brocoli", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Sauce soja", quantity: 15, unit: "ml", category: IngredientCategory.CONDIMENTS },
          { name: "Huile de sésame", quantity: 10, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.DINNER, name: "Curry de lentilles corail au riz",
        baseCalories: 580, baseProtein: 28, baseCarbs: 76, baseFat: 12,
        ingredients: [
          { name: "Lentilles corail", quantity: 150, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Lait de coco", quantity: 100, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Tomates concassées", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Oignon", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Curry en poudre", quantity: 8, unit: "g", category: IngredientCategory.CONDIMENTS },
          { name: "Riz basmati", quantity: 60, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
        ],
      },
    ],
  },
  {
    dayOfWeek: 1,
    meals: [
      {
        type: MealType.BREAKFAST, name: "Œufs brouillés, pain complet et avocat",
        baseCalories: 420, baseProtein: 24, baseCarbs: 36, baseFat: 18,
        ingredients: [
          { name: "Œufs", quantity: 3, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Pain complet", quantity: 60, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Avocat", quantity: 0.5, unit: "pièce", category: IngredientCategory.FATS_OILS },
          { name: "Tomate", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.SNACK, name: "Amandes et pomme",
        baseCalories: 200, baseProtein: 5, baseCarbs: 22, baseFat: 12,
        ingredients: [
          { name: "Amandes", quantity: 30, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Pomme", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Salade quinoa, pois chiches et feta",
        baseCalories: 620, baseProtein: 28, baseCarbs: 76, baseFat: 18,
        ingredients: [
          { name: "Quinoa", quantity: 100, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Pois chiches", quantity: 150, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Feta", quantity: 40, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Concombre", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Tomates cerises", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Huile d'olive", quantity: 12, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.DINNER, name: "Pâtes complètes sauce tomate et parmesan",
        baseCalories: 560, baseProtein: 24, baseCarbs: 80, baseFat: 14,
        ingredients: [
          { name: "Pâtes complètes", quantity: 120, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Sauce tomate maison", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Parmesan", quantity: 30, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Basilic frais", quantity: 5, unit: "g", category: IngredientCategory.CONDIMENTS },
          { name: "Huile d'olive", quantity: 10, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 2,
    meals: [
      {
        type: MealType.BREAKFAST, name: "Smoothie banane, lait d'amande et avoine",
        baseCalories: 420, baseProtein: 18, baseCarbs: 60, baseFat: 12,
        ingredients: [
          { name: "Banane", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Lait d'amande", quantity: 300, unit: "ml", category: IngredientCategory.DAIRY_EGGS },
          { name: "Flocons d'avoine", quantity: 50, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Beurre d'amande", quantity: 20, unit: "g", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.SNACK, name: "Fromage blanc et fruits rouges",
        baseCalories: 160, baseProtein: 12, baseCarbs: 20, baseFat: 3,
        ingredients: [
          { name: "Fromage blanc 0%", quantity: 150, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Fraises", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Wrap légumes grillés et hummus",
        baseCalories: 580, baseProtein: 22, baseCarbs: 72, baseFat: 18,
        ingredients: [
          { name: "Tortilla de blé", quantity: 2, unit: "pièce", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Hummus", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Courgette grillée", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Poivron rouge", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Feta", quantity: 40, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Roquette", quantity: 30, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.DINNER, name: "Tempeh poêlé, patate douce et épinards",
        baseCalories: 580, baseProtein: 32, baseCarbs: 54, baseFat: 22,
        ingredients: [
          { name: "Tempeh", quantity: 200, unit: "g", category: IngredientCategory.OTHER },
          { name: "Patate douce", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Épinards frais", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Huile d'olive", quantity: 12, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Sauce soja", quantity: 10, unit: "ml", category: IngredientCategory.CONDIMENTS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 3,
    meals: [
      {
        type: MealType.BREAKFAST, name: "Granola maison, yaourt et fruits",
        baseCalories: 420, baseProtein: 18, baseCarbs: 58, baseFat: 14,
        ingredients: [
          { name: "Granola", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Yaourt grec 0%", quantity: 200, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Fruits rouges mélangés", quantity: 80, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Miel", quantity: 10, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.SNACK, name: "Mélange noix et raisins secs",
        baseCalories: 220, baseProtein: 6, baseCarbs: 20, baseFat: 14,
        ingredients: [
          { name: "Noix de cajou", quantity: 25, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Noix", quantity: 15, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Raisins secs", quantity: 30, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Soupe de lentilles aux légumes et pain",
        baseCalories: 560, baseProtein: 28, baseCarbs: 72, baseFat: 10,
        ingredients: [
          { name: "Lentilles vertes", quantity: 150, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Carottes", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Céleri", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Oignon", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Pain complet", quantity: 60, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Huile d'olive", quantity: 10, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.DINNER, name: "Omelette aux champignons et fromage",
        baseCalories: 480, baseProtein: 36, baseCarbs: 10, baseFat: 30,
        ingredients: [
          { name: "Œufs", quantity: 4, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Champignons", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Emmental râpé", quantity: 40, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Oignon", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Huile d'olive", quantity: 10, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 4,
    meals: [
      {
        type: MealType.BREAKFAST, name: "Pancakes à l'avoine et banane",
        baseCalories: 420, baseProtein: 20, baseCarbs: 60, baseFat: 12,
        ingredients: [
          { name: "Flocons d'avoine", quantity: 100, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Œufs", quantity: 2, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Lait demi-écrémé", quantity: 150, unit: "ml", category: IngredientCategory.DAIRY_EGGS },
          { name: "Banane", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Miel", quantity: 15, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.SNACK, name: "Chocolat noir et noix",
        baseCalories: 200, baseProtein: 4, baseCarbs: 18, baseFat: 14,
        ingredients: [
          { name: "Chocolat noir 85%", quantity: 30, unit: "g", category: IngredientCategory.OTHER },
          { name: "Noix mélangées", quantity: 20, unit: "g", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.LUNCH, name: "Buddha bowl tofu mariné et légumes",
        baseCalories: 640, baseProtein: 32, baseCarbs: 74, baseFat: 20,
        ingredients: [
          { name: "Tofu ferme", quantity: 200, unit: "g", category: IngredientCategory.OTHER },
          { name: "Riz brun", quantity: 100, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Avocat", quantity: 0.5, unit: "pièce", category: IngredientCategory.FATS_OILS },
          { name: "Carotte râpée", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Edamame", quantity: 80, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Sauce tamari", quantity: 15, unit: "ml", category: IngredientCategory.CONDIMENTS },
          { name: "Graines de sésame", quantity: 10, unit: "g", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.DINNER, name: "Risotto aux champignons et parmesan",
        baseCalories: 580, baseProtein: 20, baseCarbs: 80, baseFat: 18,
        ingredients: [
          { name: "Riz arborio", quantity: 120, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Champignons mélangés", quantity: 250, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Parmesan", quantity: 40, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Oignon", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Beurre", quantity: 10, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Bouillon de légumes", quantity: 400, unit: "ml", category: IngredientCategory.OTHER },
        ],
      },
    ],
  },
  {
    dayOfWeek: 5,
    meals: [
      {
        type: MealType.BREAKFAST, name: "Avocado toast et œuf poché",
        baseCalories: 400, baseProtein: 22, baseCarbs: 38, baseFat: 18,
        ingredients: [
          { name: "Pain complet", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Avocat", quantity: 0.5, unit: "pièce", category: IngredientCategory.FATS_OILS },
          { name: "Œufs", quantity: 2, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Tomate", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Citron", quantity: 0.5, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.SNACK, name: "Yaourt et granola",
        baseCalories: 200, baseProtein: 10, baseCarbs: 28, baseFat: 6,
        ingredients: [
          { name: "Yaourt nature", quantity: 150, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Granola", quantity: 30, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Kiwi", quantity: 2, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Curry pois chiches et patate douce",
        baseCalories: 600, baseProtein: 24, baseCarbs: 82, baseFat: 16,
        ingredients: [
          { name: "Pois chiches", quantity: 200, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Patate douce", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Lait de coco", quantity: 100, unit: "ml", category: IngredientCategory.FATS_OILS },
          { name: "Tomates concassées", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Curry en poudre", quantity: 8, unit: "g", category: IngredientCategory.CONDIMENTS },
          { name: "Riz basmati", quantity: 60, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
        ],
      },
      {
        type: MealType.DINNER, name: "Tarte aux légumes et fromage",
        baseCalories: 580, baseProtein: 22, baseCarbs: 58, baseFat: 26,
        ingredients: [
          { name: "Pâte brisée", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Courgette", quantity: 200, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Poivrons", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Œufs", quantity: 2, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Crème fraîche", quantity: 60, unit: "ml", category: IngredientCategory.DAIRY_EGGS },
          { name: "Fromage râpé", quantity: 40, unit: "g", category: IngredientCategory.DAIRY_EGGS },
        ],
      },
    ],
  },
  {
    dayOfWeek: 6,
    meals: [
      {
        type: MealType.BREAKFAST, name: "Crêpes au sarrasin et fruits",
        baseCalories: 400, baseProtein: 16, baseCarbs: 62, baseFat: 10,
        ingredients: [
          { name: "Farine de sarrasin", quantity: 100, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Lait demi-écrémé", quantity: 200, unit: "ml", category: IngredientCategory.DAIRY_EGGS },
          { name: "Œufs", quantity: 1, unit: "pièce", category: IngredientCategory.DAIRY_EGGS },
          { name: "Pomme", quantity: 1, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Sirop d'érable", quantity: 20, unit: "g", category: IngredientCategory.CONDIMENTS },
        ],
      },
      {
        type: MealType.SNACK, name: "Hummus et crudités",
        baseCalories: 180, baseProtein: 8, baseCarbs: 18, baseFat: 8,
        ingredients: [
          { name: "Hummus", quantity: 80, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Carottes", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Concombre", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
        ],
      },
      {
        type: MealType.LUNCH, name: "Salade composée feta et olives",
        baseCalories: 560, baseProtein: 22, baseCarbs: 52, baseFat: 26,
        ingredients: [
          { name: "Salade mélangée", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Feta", quantity: 80, unit: "g", category: IngredientCategory.DAIRY_EGGS },
          { name: "Olives", quantity: 30, unit: "g", category: IngredientCategory.FATS_OILS },
          { name: "Tomates", quantity: 2, unit: "pièce", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Pain pita", quantity: 60, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Huile d'olive", quantity: 12, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
      {
        type: MealType.DINNER, name: "Couscous légumes et pois chiches",
        baseCalories: 580, baseProtein: 24, baseCarbs: 84, baseFat: 12,
        ingredients: [
          { name: "Semoule", quantity: 120, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Pois chiches", quantity: 150, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
          { name: "Courgette", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Carotte", quantity: 150, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Navet", quantity: 100, unit: "g", category: IngredientCategory.FRUITS_VEGETABLES },
          { name: "Harissa", quantity: 8, unit: "g", category: IngredientCategory.CONDIMENTS },
          { name: "Huile d'olive", quantity: 10, unit: "ml", category: IngredientCategory.FATS_OILS },
        ],
      },
    ],
  },
];

// ─── Substitutions vegan (dérivées des menus végétariens) ─────────────────────
const VEGAN_SUBSTITUTES: Record<string, IngredientTemplate> = {
  "Lait demi-écrémé":    { name: "Lait d'avoine",         quantity: 0, unit: "ml", category: IngredientCategory.OTHER },
  "Lait d'amande":       { name: "Lait d'avoine",         quantity: 0, unit: "ml", category: IngredientCategory.OTHER },
  "Yaourt grec 0%":      { name: "Yaourt de soja nature", quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
  "Yaourt nature":       { name: "Yaourt de soja nature", quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
  "Fromage blanc 0%":    { name: "Tofu soyeux",           quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
  "Parmesan":            { name: "Levure nutritionnelle", quantity: 0, unit: "g",  category: IngredientCategory.CONDIMENTS },
  "Emmental râpé":       { name: "Levure nutritionnelle", quantity: 0, unit: "g",  category: IngredientCategory.CONDIMENTS },
  "Fromage râpé":        { name: "Levure nutritionnelle", quantity: 0, unit: "g",  category: IngredientCategory.CONDIMENTS },
  "Feta":                { name: "Tofu mariné aux herbes", quantity: 0, unit: "g", category: IngredientCategory.OTHER },
  "Beurre":              { name: "Margarine végétale",    quantity: 0, unit: "g",  category: IngredientCategory.FATS_OILS },
  "Crème fraîche":       { name: "Crème de soja",         quantity: 0, unit: "ml", category: IngredientCategory.OTHER },
  "Œufs":                { name: "Tofu soyeux",           quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
};

function applyVeganSubs(days: DayMenuTemplate[]): DayMenuTemplate[] {
  return days.map(day => ({
    ...day,
    meals: day.meals.map(meal => ({
      ...meal,
      ingredients: meal.ingredients.map(ing => {
        const sub = VEGAN_SUBSTITUTES[ing.name];
        return sub ? { ...sub, quantity: ing.quantity } : ing;
      }),
    })),
  }));
}

const VEGAN_WEEK_MENUS = applyVeganSubs(VEGETARIAN_WEEK_MENUS);

// ─── Substitutions allergènes ─────────────────────────────────────────────────
type AllergyKey = "GLUTEN" | "LACTOSE" | "NUTS" | "EGGS" | "SOY" | "SHELLFISH";

const ALLERGEN_SUBSTITUTES: Record<AllergyKey, Record<string, IngredientTemplate>> = {
  GLUTEN: {
    "Pain complet":      { name: "Pain sans gluten",        quantity: 0, unit: "g",  category: IngredientCategory.CEREALS_LEGUMES },
    "Flocons d'avoine":  { name: "Flocons de riz",          quantity: 0, unit: "g",  category: IngredientCategory.CEREALS_LEGUMES },
    "Pâtes complètes":   { name: "Pâtes de riz",            quantity: 0, unit: "g",  category: IngredientCategory.CEREALS_LEGUMES },
    "Tortilla de blé":   { name: "Tortilla de maïs",        quantity: 0, unit: "pièce", category: IngredientCategory.CEREALS_LEGUMES },
    "Granola":           { name: "Granola sans gluten",     quantity: 0, unit: "g",  category: IngredientCategory.CEREALS_LEGUMES },
    "Pâte brisée":       { name: "Pâte brisée sans gluten", quantity: 0, unit: "g",  category: IngredientCategory.CEREALS_LEGUMES },
    "Semoule":           { name: "Semoule de maïs",         quantity: 0, unit: "g",  category: IngredientCategory.CEREALS_LEGUMES },
    "Pain pita":         { name: "Pain pita sans gluten",   quantity: 0, unit: "g",  category: IngredientCategory.CEREALS_LEGUMES },
  },
  LACTOSE: {
    "Lait demi-écrémé":  { name: "Lait d'avoine",           quantity: 0, unit: "ml", category: IngredientCategory.OTHER },
    "Lait d'amande":     { name: "Lait de riz",             quantity: 0, unit: "ml", category: IngredientCategory.OTHER },
    "Yaourt grec 0%":    { name: "Yaourt de soja nature",   quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
    "Yaourt nature":     { name: "Yaourt de soja nature",   quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
    "Fromage blanc 0%":  { name: "Tofu soyeux",             quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
    "Parmesan":          { name: "Levure nutritionnelle",   quantity: 0, unit: "g",  category: IngredientCategory.CONDIMENTS },
    "Emmental râpé":     { name: "Fromage sans lactose",    quantity: 0, unit: "g",  category: IngredientCategory.DAIRY_EGGS },
    "Fromage râpé":      { name: "Fromage sans lactose",    quantity: 0, unit: "g",  category: IngredientCategory.DAIRY_EGGS },
    "Feta":              { name: "Feta sans lactose",       quantity: 0, unit: "g",  category: IngredientCategory.DAIRY_EGGS },
    "Beurre":            { name: "Margarine sans lactose",  quantity: 0, unit: "g",  category: IngredientCategory.FATS_OILS },
    "Crème fraîche":     { name: "Crème de soja",           quantity: 0, unit: "ml", category: IngredientCategory.OTHER },
  },
  NUTS: {
    "Amandes":           { name: "Graines de tournesol",   quantity: 0, unit: "g",  category: IngredientCategory.FATS_OILS },
    "Noix de cajou":     { name: "Graines de courge",      quantity: 0, unit: "g",  category: IngredientCategory.FATS_OILS },
    "Noix":              { name: "Graines de lin",         quantity: 0, unit: "g",  category: IngredientCategory.FATS_OILS },
    "Noix mélangées":    { name: "Graines mélangées",      quantity: 0, unit: "g",  category: IngredientCategory.FATS_OILS },
    "Beurre d'amande":   { name: "Beurre de tournesol",    quantity: 0, unit: "g",  category: IngredientCategory.FATS_OILS },
    "Lait d'amande":     { name: "Lait d'avoine",          quantity: 0, unit: "ml", category: IngredientCategory.OTHER },
  },
  EGGS: {
    "Œufs":              { name: "Tofu soyeux",            quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
  },
  SOY: {
    "Tofu ferme":        { name: "Pois chiches cuits",     quantity: 0, unit: "g",  category: IngredientCategory.CEREALS_LEGUMES },
    "Tofu soyeux":       { name: "Purée de haricots blancs", quantity: 0, unit: "g", category: IngredientCategory.CEREALS_LEGUMES },
    "Tempeh":            { name: "Seitan",                 quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
    "Sauce soja":        { name: "Sauce tamari sans soja", quantity: 0, unit: "ml", category: IngredientCategory.CONDIMENTS },
    "Sauce tamari":      { name: "Jus de citron + sel",    quantity: 0, unit: "ml", category: IngredientCategory.CONDIMENTS },
    "Lait de soja":      { name: "Lait d'avoine",          quantity: 0, unit: "ml", category: IngredientCategory.OTHER },
    "Yaourt de soja nature": { name: "Yaourt de coco",     quantity: 0, unit: "g",  category: IngredientCategory.OTHER },
    "Edamame":           { name: "Petits pois",            quantity: 0, unit: "g",  category: IngredientCategory.FRUITS_VEGETABLES },
  },
  SHELLFISH: {},
};

function applyAllergenFilters(days: DayMenuTemplate[], allergies: AllergyKey[]): DayMenuTemplate[] {
  if (allergies.length === 0) return days;
  return days.map(day => ({
    ...day,
    meals: day.meals.map(meal => ({
      ...meal,
      ingredients: meal.ingredients.map(ing => {
        for (const allergy of allergies) {
          const sub = ALLERGEN_SUBSTITUTES[allergy]?.[ing.name];
          if (sub) return { ...sub, quantity: ing.quantity };
        }
        return ing;
      }),
    })),
  }));
}

// ─── Génère les menus scalés selon les calories cibles ───────────────────────
export function generateWeekMenus(
  targetCalories: number,
  _goal: Goal,
  diet: "OMNIVORE" | "VEGETARIAN" | "VEGAN" = "OMNIVORE",
  allergies: AllergyKey[] = [],
) {
  const baseMenus =
    diet === "VEGAN" ? VEGAN_WEEK_MENUS
    : diet === "VEGETARIAN" ? VEGETARIAN_WEEK_MENUS
    : BASE_WEEK_MENUS;

  const filtered = applyAllergenFilters(baseMenus, allergies);

  const baseTotalCalories = 2000;
  const factor = targetCalories / baseTotalCalories;

  return filtered.map((day) => {
    const scaledMeals = day.meals.map((meal) => scaleMeal(meal, factor));
    return {
      dayOfWeek: day.dayOfWeek,
      totalCalories: scaledMeals.reduce((s, m) => s + m.baseCalories, 0),
      totalProtein: scaledMeals.reduce((s, m) => s + m.baseProtein, 0),
      totalCarbs: scaledMeals.reduce((s, m) => s + m.baseCarbs, 0),
      totalFat: scaledMeals.reduce((s, m) => s + m.baseFat, 0),
      meals: scaledMeals,
    };
  });
}
