/**
 * Normalise un nom d'ingrédient pour la liste de courses.
 * - Retire les méthodes de cuisson (poché, brouillé, rôti…)
 * - Fusionne les synonymes courants (Oeuf/Œufs/Oeufs durs → Œufs)
 * - Normalise les pluriels simples
 */

// Convertit les ligatures pour une comparaison homogène (œ→oe, æ→ae)
function normalizeLigatures(s: string): string {
  return s.replace(/œ/g, "oe").replace(/Œ/g, "Oe").replace(/æ/g, "ae").replace(/Æ/g, "Ae");
}

// Table de synonymes explicites → [nom canonique, unité canonique]
const SYNONYM_MAP: Record<string, [string, string]> = {
  // ─── Œufs
  "oeuf":                  ["Œufs",             "pièce"],
  "oeufs":                 ["Œufs",             "pièce"],
  "oeuf dur":              ["Œufs",             "pièce"],
  "oeufs durs":            ["Œufs",             "pièce"],
  "oeuf poché":            ["Œufs",             "pièce"],
  "oeufs pochés":          ["Œufs",             "pièce"],
  "oeuf brouillé":         ["Œufs",             "pièce"],
  "oeufs brouillés":       ["Œufs",             "pièce"],
  "oeuf à la coque":       ["Œufs",             "pièce"],
  "oeufs au plat":         ["Œufs",             "pièce"],
  "oeuf au plat":          ["Œufs",             "pièce"],
  "oeufs sautés":          ["Œufs",             "pièce"],
  "oeuf sauté":            ["Œufs",             "pièce"],

  // ─── Volaille
  "blanc de poulet":       ["Blanc de poulet",  "g"],
  "blancs de poulet":      ["Blanc de poulet",  "g"],
  "filet de poulet":       ["Blanc de poulet",  "g"],
  "filets de poulet":      ["Blanc de poulet",  "g"],
  "poulet rôti":           ["Blanc de poulet",  "g"],
  "escalope de poulet":    ["Blanc de poulet",  "g"],
  "escalopes de poulet":   ["Blanc de poulet",  "g"],

  // ─── Légumes courants (pluriel/singulier)
  "oignon":                ["Oignon",           "pièce"],
  "oignons":               ["Oignon",           "pièce"],
  "gousse d'ail":          ["Ail",              "gousse"],
  "gousses d'ail":         ["Ail",              "gousse"],
  "tomate":                ["Tomate",           "pièce"],
  "tomates":               ["Tomate",           "pièce"],
  "carotte":               ["Carottes",         "g"],
  "carottes":              ["Carottes",         "g"],
  "courgette":             ["Courgette",        "g"],
  "courgettes":            ["Courgette",        "g"],
  "champignon":            ["Champignons",      "g"],
  "champignons":           ["Champignons",      "g"],
  "champignons mélangés":  ["Champignons",      "g"],
  "poivron":               ["Poivron",          "pièce"],
  "poivrons":              ["Poivron",          "pièce"],
  "poivron rouge":         ["Poivron",          "pièce"],
  "épinard frais":         ["Épinards frais",   "g"],
  "épinards frais":        ["Épinards frais",   "g"],

  // ─── Laitages
  "lait demi-écrémé":      ["Lait demi-écrémé", "ml"],
  "lait entier":           ["Lait demi-écrémé", "ml"],
  "yaourt grec 0%":        ["Yaourt grec",      "g"],
  "yaourt nature":         ["Yaourt grec",      "g"],
  "yaourt nature 0%":      ["Yaourt grec",      "g"],
  "fromage blanc 0%":      ["Fromage blanc",    "g"],
  "fromage blanc nature":  ["Fromage blanc",    "g"],
};

// Mots de cuisson à retirer (suffixes/mots isolés)
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
];

export function normalizeIngredient(raw: string): { name: string; unitOverride?: string } {
  // Normalise les ligatures avant tout traitement (œ→oe, etc.)
  const lower = normalizeLigatures(raw).toLowerCase().trim();

  // 1. Cherche un synonyme exact
  if (SYNONYM_MAP[lower]) {
    const [name, unit] = SYNONYM_MAP[lower];
    return { name, unitOverride: unit };
  }

  // 2. Retire les mots de cuisson
  let cleaned = lower;
  for (const word of COOKING_WORDS) {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), "").trim();
    cleaned = cleaned.replace(/\s+/g, " ").replace(/,\s*$/, "").trim();
  }

  // Retire les lettres/abréviations orphelines en fin de chaîne (ex: "oeufs s" → "oeufs")
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
