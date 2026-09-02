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

const COUNTRY_IMAGES: Record<string, string> = {
  albanie:
    "https://images.unsplash.com/photo-1592472239536-2d5905d5c1c2?q=80&w=600&auto=format&fit=crop",
  pologne:
    "https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=600&auto=format&fit=crop",
  maroc:
    "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=600&auto=format&fit=crop",
  autriche:
    "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=600&auto=format&fit=crop",
  luxembourg:
    "https://images.unsplash.com/photo-1591208667522-2eeff2d0a4b0?q=80&w=600&auto=format&fit=crop",
  moldavie:
    "https://images.unsplash.com/photo-1567430825009-2a2d29fe0acd?q=80&w=600&auto=format&fit=crop",
  hongrie:
    "https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=600&auto=format&fit=crop",
  estonie:
    "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=600&auto=format&fit=crop",
  france:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
  allemagne:
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=600&auto=format&fit=crop",
  italie:
    "https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=600&auto=format&fit=crop",
  espagne:
    "https://images.unsplash.com/photo-1509840841025-9088ba78a826?q=80&w=600&auto=format&fit=crop",
  portugal:
    "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=600&auto=format&fit=crop",
  canada:
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=600&auto=format&fit=crop",
  "etats-unis":
    "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=600&auto=format&fit=crop",
  "royaume-uni":
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop",
  belgique:
    "https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=600&auto=format&fit=crop",
  suisse:
    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&auto=format&fit=crop",
  turquie:
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=600&auto=format&fit=crop",
  tunisie:
    "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=600&auto=format&fit=crop",
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
