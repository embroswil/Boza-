// Associe une image de couverture à chaque programme.
// Utilise `image_url` si la base de données en fournit une, sinon choisit
// une photo thématique selon la filière (field) / le niveau, avec une
// variation déterministe (basée sur l'id) pour éviter les répétitions.

const THEMES: { match: RegExp; images: string[] }[] = [
  {
    match: /informatique|logiciel|data|digital|numérique|réseau|cyber|IT\b/i,
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    match: /ingénieur|ingénierie|génie|mécanique|électrique|industriel/i,
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581091012184-7add54fdd7a4?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    match: /gestion|commerce|business|management|finance|comptab|marketing|économ/i,
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    match: /médec|santé|infirm|pharma|dentaire|clinique/i,
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    match: /droit|juridique|loi\b/i,
    images: [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    match: /art|design|architecture|mode|graphisme/i,
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    match: /science|biolog|physique|chimie|environnement|agro/i,
    images: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    match: /langue|traduction|lettres|communication|journalis/i,
    images: [
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
    ],
  },
];

// Pool générique (campus / bibliothèque / étudiants) utilisé quand aucune
// filière ne correspond, avec assez de variété pour une grille de 10+.
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getProgramImage(program: {
  id: string;
  image_url?: string | null;
  field?: string | null;
  name?: string | null;
}): string {
  if (program.image_url) return program.image_url;

  const haystack = `${program.field ?? ""} ${program.name ?? ""}`;
  const theme = THEMES.find((t) => t.match.test(haystack));
  const seed = hashString(program.id);

  if (theme && theme.images.length > 0) {
    return theme.images[seed % theme.images.length];
  }
  return FALLBACK_IMAGES[seed % FALLBACK_IMAGES.length];
}
