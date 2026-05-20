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

// ─── Génère les menus scalés selon les calories cibles ───────────────────────
export function generateWeekMenus(targetCalories: number, _goal: Goal) {
  const baseTotalCalories = 2000;
  const factor = targetCalories / baseTotalCalories;

  return BASE_WEEK_MENUS.map((day) => {
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
