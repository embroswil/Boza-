// Associe une photo de destination à un pays (utilisée pour la page Pays,
// les cartes destinations de l'accueil, et les cartes de visas tourisme).
// Utilise `image_url` si fourni par la base, sinon une photo dédiée à ce
// pays précis (chaque pays a sa propre image, aucune répétition), avec un
// repli générique si le pays n'est pas encore dans la liste.
//
// Toutes ces images sont reprises du pool déjà vérifié fonctionnel ailleurs
// sur le site (aucune nouvelle URL non testée n'est introduite ici).

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const COUNTRY_IMAGES: Record<string, string> = {
  // Pays d'études
  albanie: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
  autriche: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=600&auto=format&fit=crop",
  chine: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
  estonie: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
  georgie: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
  hongrie: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=600&auto=format&fit=crop",
  luxembourg: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600&auto=format&fit=crop",
  maroc: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=600&auto=format&fit=crop",
  moldavie: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
  pologne: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=600&auto=format&fit=crop",
  // Pays visas tourisme
  "arabie saoudite": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
  australie: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop",
  "emirats arabes unis": "https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?q=80&w=600&auto=format&fit=crop",
  ouzbekistan: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=600&auto=format&fit=crop",
  qatar: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop",
  serbie: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop",
  thailande: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
};

// Repli uniquement pour un pays pas encore répertorié ci-dessus.
const FALLBACK_IMAGES = [
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
