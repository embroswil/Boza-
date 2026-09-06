// Associe une photo de destination à un pays (utilisée pour la page Pays,
// les cartes destinations de l'accueil, et les cartes de visas tourisme).
// Utilise `image_url`/`flag_photo_url` si fourni par la base, sinon choisit
// une photo selon le nom du pays, avec repli déterministe sinon.

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Seules ces 3 photos sont vérifiées comme fonctionnelles (confirmées à
// l'écran). Les autres entrées pointaient vers des liens Unsplash morts
// (Albanie, Moldavie, etc.) — supprimées pour éviter les images cassées;
// ces pays retombent automatiquement sur le pool générique ci-dessous.
const COUNTRY_IMAGES: Record<string, string> = {
  pologne:
    "https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=600&auto=format&fit=crop",
  maroc:
    "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=600&auto=format&fit=crop",
  autriche:
    "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=600&auto=format&fit=crop",
};

// Pool générique (voyage / aéroport / carte du monde) utilisé quand le pays
// n'est pas reconnu, avec assez de variété pour une grille.
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDestinationImage(destination: {
  id: string;
  name?: string | null;
  image_url?: string | null;
}): string {
  if (destination.image_url) return destination.image_url;

  const key = destination.name ? normalize(destination.name) : "";
  if (key && COUNTRY_IMAGES[key]) return COUNTRY_IMAGES[key];

  const seed = hashString(destination.id || destination.name || "x");
  return FALLBACK_IMAGES[seed % FALLBACK_IMAGES.length];
}
