// Associe une image de couverture à chaque université.
// Utilise `image_url` si la base de données en fournit une (ex: ajoutée
// manuellement plus tard pour une université précise), sinon choisit une
// photo réelle représentative du pays/de la région, avec une variation
// déterministe (basée sur l'id) pour éviter les répétitions au sein d'un
// même pays.

const REGION_POOLS: { match: RegExp; images: string[] }[] = [
  // Europe (architecture académique / campus historique)
  {
    match: /albanie|autriche|estonie|géorgie|hongrie|luxembourg|moldavie|pologne|serbie/i,
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600&auto=format&fit=crop",
    ],
  },
  // Asie (Chine, Corée du Sud, Singapour, Thaïlande — campus modernes)
  {
    match: /chine|corée|singapour|thaïlande/i,
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
    ],
  },
  // Maghreb / Moyen-Orient (Maroc, Émirats, Qatar)
  {
    match: /maroc|émirats|qatar/i,
    images: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554475900-0a0350e3fc7b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=600&auto=format&fit=crop",
    ],
  },
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getUniversityImage(university: {
  id: string;
  image_url?: string | null;
  country?: string | null;
  city?: string | null;
}): string {
  if (university.image_url) return university.image_url;

  const haystack = `${university.country ?? ""} ${university.city ?? ""}`;
  const region = REGION_POOLS.find((r) => r.match.test(haystack));
  const seed = hashString(university.id);

  if (region && region.images.length > 0) {
    return region.images[seed % region.images.length];
  }
  return FALLBACK_IMAGES[seed % FALLBACK_IMAGES.length];
}
