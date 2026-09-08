import { createPublicClient } from "@/lib/supabase/public";
import { CountriesList } from "@/components/countries-list";

export const revalidate = 300; // cache 5 min, contenu public peu changeant

// Seuls les pays qui ont réellement des programmes d'études (les 10 pays de
// lancement) apparaissent dans "Destinations d'études" — les pays ajoutés
// uniquement pour un visa tourisme (Qatar, Serbie, Thaïlande...) n'y
// figurent pas.
const STUDY_COUNTRIES = [
  "Albanie",
  "Autriche",
  "Chine",
  "Estonie",
  "Géorgie",
  "Hongrie",
  "Luxembourg",
  "Maroc",
  "Moldavie",
  "Pologne",
];

export default async function CountriesPage() {
  const supabase = createPublicClient();

  const { data: countries } = await supabase
    .from("countries")
    .select("id, name, continent, flag_url, description")
    .in("name", STUDY_COUNTRIES)
    .order("name", { ascending: true });

  return <CountriesList countries={countries ?? []} />;
}
