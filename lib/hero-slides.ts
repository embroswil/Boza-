import { MapPin, Star, Globe2 } from "lucide-react";
import { getUniversityImage } from "@/lib/university-images";

export type HeroUniversity = {
  id: string;
  name: string;
  city: string | null;
  ranking: number | null;
  country: string | null;
};

export function getUniversitySlides(universities: HeroUniversity[]) {
  return universities.map((u) => ({
    key: u.id,
    badge: "🎓 UNIVERSITÉ",
    line1: u.name,
    highlight: [u.city, u.country].filter(Boolean).join(", "),
    desc: `Découvrez les programmes proposés par ${u.name} et lancez votre projet d'études dès aujourd'hui.`,
    img: getUniversityImage({ id: u.id, country: u.country, city: u.city }),
    pills: [
      { icon: Star, label: u.ranking ? `Classement #${u.ranking}` : "Université partenaire" },
      { icon: MapPin, label: u.city ?? "—" },
      { icon: Globe2, label: u.country ?? "—" },
    ],
    cta: "Voir les programmes",
    href: `/universities/${u.id}`,
  }));
}
