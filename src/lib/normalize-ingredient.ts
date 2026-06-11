/**
 * Normalise un nom d'ingrédient pour la liste de courses.
 * - Retire les qualificatifs entre parenthèses : "(eau)", "(light)", "(0%)"…
 * - Retire les méthodes de cuisson (poché, brouillé, rôti, grillé…)
 * - Fusionne les synonymes courants via SYNONYM_MAP
 */

// Convertit les ligatures pour une comparaison homogène (œ→oe, æ→ae)
function normalizeLigatures(s: string): string {
  return s.replace(/œ/g, "oe").replace(/Œ/g, "Oe").replace(/æ/g, "ae").replace(/Æ/g, "Ae");
}

// Table de synonymes explicites → [nom canonique, unité canonique]
const SYNONYM_MAP: Record<string, [string, string]> = {
  // ─── Œufs
  "oeuf":                          ["Œufs",                  "pièce"],
  "oeufs":                         ["Œufs",                  "pièce"],
  "oeuf dur":                      ["Œufs",                  "pièce"],
  "oeufs durs":                    ["Œufs",                  "pièce"],
  "oeuf poché":                    ["Œufs",                  "pièce"],
  "oeufs pochés":                  ["Œufs",                  "pièce"],
  "oeuf brouillé":                 ["Œufs",                  "pièce"],
  "oeufs brouillés":               ["Œufs",                  "pièce"],
  "oeuf à la coque":               ["Œufs",                  "pièce"],
  "oeufs au plat":                 ["Œufs",                  "pièce"],
  "oeuf au plat":                  ["Œufs",                  "pièce"],
  "oeufs sautés":                  ["Œufs",                  "pièce"],
  "oeuf sauté":                    ["Œufs",                  "pièce"],

  // ─── Volaille
  "blanc de poulet":               ["Blanc de poulet",        "g"],
  "blancs de poulet":              ["Blanc de poulet",        "g"],
  "filet de poulet":               ["Blanc de poulet",        "g"],
  "filets de poulet":              ["Blanc de poulet",        "g"],
  "poulet rôti":                   ["Blanc de poulet",        "g"],
  "escalope de poulet":            ["Blanc de poulet",        "g"],
  "escalopes de poulet":           ["Blanc de poulet",        "g"],

  // ─── Poissons / conserves
  "thon en conserve":              ["Thon en conserve",       "g"],
  "thon en boite":                 ["Thon en conserve",       "g"],
  "thon à l'huile":                ["Thon en conserve",       "g"],
  "thon au naturel":               ["Thon en conserve",       "g"],

  // ─── Légumes courants
  "oignon":                        ["Oignon",                 "pièce"],
  "oignons":                       ["Oignon",                 "pièce"],
  "gousse d'ail":                  ["Ail",                    "gousse"],
  "gousses d'ail":                 ["Ail",                    "gousse"],
  "tomate":                        ["Tomate",                 "pièce"],
  "tomates":                       ["Tomate",                 "pièce"],
  "tomate cerise":                 ["Tomate cerise",          "pièce"],
  "tomates cerises":               ["Tomate cerise",          "pièce"],
  "tomates concassées":            ["Tomates concassées",     "g"],
  "tomates pelées":                ["Tomates concassées",     "g"],
  "tomates pelées concassées":     ["Tomates concassées",     "g"],
  "carotte":                       ["Carottes",               "g"],
  "carottes":                      ["Carottes",               "g"],
  "courgette":                     ["Courgette",              "g"],
  "courgettes":                    ["Courgette",              "g"],
  "champignon":                    ["Champignons",            "g"],
  "champignons":                   ["Champignons",            "g"],
  "champignons mélangés":          ["Champignons",            "g"],
  "champignons de paris":          ["Champignons",            "g"],
  "champignon de paris":           ["Champignons",            "g"],
  "poivron":                       ["Poivron",                "pièce"],
  "poivrons":                      ["Poivron",                "pièce"],
  "poivron rouge":                 ["Poivron",                "pièce"],
  "poivrons mélangés":             ["Poivron",                "pièce"],
  "épinard frais":                 ["Épinards frais",         "g"],
  "épinards frais":                ["Épinards frais",         "g"],

  // ─── Laitages
  "lait demi-écrémé":              ["Lait demi-écrémé",       "ml"],
  "lait entier":                   ["Lait demi-écrémé",       "ml"],
  "lait de coco":                  ["Lait de coco",           "ml"],
  "lait de coco light":            ["Lait de coco",           "ml"],
  "yaourt grec":                   ["Yaourt grec",            "g"],
  "yaourt grec 0%":                ["Yaourt grec",            "g"],
  "yaourt nature":                 ["Yaourt grec",            "g"],
  "yaourt nature 0%":              ["Yaourt grec",            "g"],
  "fromage blanc 0%":              ["Fromage blanc",          "g"],
  "fromage blanc nature":          ["Fromage blanc",          "g"],

  // ─── Céréales / féculents
  "riz arborio":                   ["Riz arborio",            "g"],
  "riz à risotto":                 ["Riz arborio",            "g"],
  "riz a risotto":                 ["Riz arborio",            "g"],
  "granola":                       ["Granola",                "g"],
  "granola maison":                ["Granola",                "g"],

  // ─── Oléagineux / matières grasses
  "beurre de cacahuète":           ["Beurre de cacahuète",    "g"],
  "beurre de cacahuete":           ["Beurre de cacahuète",    "g"],
  "beurre de cacahuète naturel":   ["Beurre de cacahuète",    "g"],
  "beurre de cacahuete naturel":   ["Beurre de cacahuète",    "g"],
  "noix mélangées":                ["Noix",                   "g"],
};

// Mots de cuisson / qualification à retirer
const COOKING_WORDS = [
  "brouillé", "brouillés", "brouillée", "brouillées",
  "poché", "pochés", "pochée", "pochées",
  "rôti", "rôtis", "rôtie", "rôties",
  "grillé", "grillés", "grillée", "grillées",
  "cuit", "cuits", "cuite", "cuites",
  "sauté", "sautés", "sautée", "sautées",
  "dur", "durs", "dure", "dures",
  "à la coque", "au plat", "sur le plat",
  "scramblé", "scramblés",
  "vapeur", "maison", "naturel", "naturelle",
];

export function normalizeIngredient(raw: string): { name: string; unitOverride?: string } {
  // 0. Normalise ligatures + retire parenthèses de qualification : "(eau)", "(light)", "(0%)"…
  const lower = normalizeLigatures(raw)
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // 1. Cherche un synonyme exact
  if (SYNONYM_MAP[lower]) {
    const [name, unit] = SYNONYM_MAP[lower];
    return { name, unitOverride: unit };
  }

  // 2. Retire les mots de cuisson / qualificatifs
  let cleaned = lower;
  for (const word of COOKING_WORDS) {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), "").trim();
    cleaned = cleaned.replace(/\s+/g, " ").replace(/,\s*$/, "").trim();
  }

  // Retire les lettres / abréviations orphelines en fin de chaîne ("oeufs s" → "oeufs")
  cleaned = cleaned.replace(/\s+[a-zàâéèêëîïôùûüç]\.?$/i, "").trim();

  // 3. Vérifie à nouveau dans la table après nettoyage
  if (SYNONYM_MAP[cleaned]) {
    const [name, unit] = SYNONYM_MAP[cleaned];
    return { name, unitOverride: unit };
  }

  // 4. Capitalise la première lettre et retourne
  const finalName = cleaned
    ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    : raw.trim();

  return { name: finalName };
}
