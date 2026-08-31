import { createClient } from "@/lib/supabase/server";
import { CountriesList } from "@/components/countries-list";

export const dynamic = "force-dynamic";

export default async function CountriesPage() {
  const supabase = await createClient();

  const { data: countries } = await supabase
    .from("countries")
    .select("id, name, continent, flag_url, description")
    .order("name", { ascending: true });

  return <CountriesList countries={countries ?? []} />;
}
