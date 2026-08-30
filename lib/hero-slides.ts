import {
  BookOpen,
  Calendar,
  FileCheck2,
  Globe,
  Briefcase,
} from "lucide-react";

export const heroSlides = [
  {
    key: "etudiant",
    badge: "🎓 PROCÉDURE ÉTUDIANT",
    line1: "Étudiez à l'étranger,",
    highlight: "construisez votre avenir",
    desc: "Trouvez les meilleures universités et programmes avec rentrée d'hiver et réalisez votre projet d'études en toute simplicité.",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop",
    pills: [
      { icon: BookOpen, label: "Universités partenaires" },
      { icon: Calendar, label: "Rentrées d'hiver" },
      { icon: FileCheck2, label: "Accompagnement complet" },
    ],
    cta: "Explorer les programmes d'études",
  },
  {
    key: "tourisme",
    badge: "✈️ VISA TOURISTIQUE",
    line1: "Voyagez librement,",
    highlight: "explorez le monde",
    desc: "Obtenez votre visa touristique rapidement et voyagez l'esprit tranquille, où que vous alliez.",
    img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=500&auto=format&fit=crop",
    pills: [
      { icon: Globe, label: "100+ destinations" },
      { icon: FileCheck2, label: "Dossier simplifié" },
      { icon: Calendar, label: "Traitement rapide" },
    ],
    cta: "Explorer les visas touristiques",
  },
  {
    key: "affaires",
    badge: "💼 VISA AFFAIRES",
    line1: "Développez votre activité,",
    highlight: "à l'international",
    desc: "Simplifiez vos déplacements professionnels et développez votre entreprise à l'étranger.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop",
    pills: [
      { icon: Briefcase, label: "Visa express" },
      { icon: FileCheck2, label: "Support entreprise" },
      { icon: Globe, label: "Réseau international" },
    ],
    cta: "Explorer les visas affaires",
  },
  {
    key: "travail",
    badge: "🧳 VISA TRAVAIL",
    line1: "Travaillez à l'étranger,",
    highlight: "concrétisez votre carrière",
    desc: "Trouvez les opportunités et le visa de travail adaptés à votre projet professionnel.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=500&auto=format&fit=crop",
    pills: [
      { icon: Briefcase, label: "Offres d'emploi" },
      { icon: FileCheck2, label: "Dossier complet" },
      { icon: Calendar, label: "Suivi de dossier" },
    ],
    cta: "Explorer les visas travail",
  },
];
