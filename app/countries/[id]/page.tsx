import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { CountryDetail } from "@/components/country-detail";

export const revalidate = 300; // cache 5 min, contenu public peu changeant

export default async function CountryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createPublicClient();

  const { data: country } = await supabase
    .from("countries")
    .select("*")
    .eq("id", id)
    .single();

  if (!country) {
    notFound();
  }

  const [{ data: embassies }, { data: visas }, { data: universities }, { data: costOfLiving }, { data: practicalInfo }] =
    await Promise.all([
      supabase.from("embassies").select("*").eq("country_id", id),
      supabase.from("visas").select("*").eq("country_id", id),
      supabase.from("universities").select("*").eq("country_id", id),
      supabase.from("cost_of_living").select("*").eq("country_id", id).maybeSingle(),
      supabase.from("practical_info").select("*").eq("country_id", id).maybeSingle(),
    ]);

  return (
    <CountryDetail
      country={country}
      embassies={embassies ?? []}
      visas={visas ?? []}
      universities={universities ?? []}
      costOfLiving={costOfLiving}
      practicalInfo={practicalInfo}
    />
  );
}
