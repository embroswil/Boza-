import { createPublicClient } from "@/lib/supabase/public";
import { CountriesList } from "@/components/countries-list";

export const revalidate = 300; // cache 5 min, contenu public peu changeant

export default async function CountriesPage() {
  const supabase = createPublicClient();

  const { data: countries } = await supabase
    .from("countries")
    .select("id, name, continent, flag_url, description")
    .order("name", { ascending: true });

  return <CountriesList countries={countries ?? []} />;
}
