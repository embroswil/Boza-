import { createClient } from "@/lib/supabase/server";
import { VisasList } from "@/components/visas-list";

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = {
  tourisme: "Tourisme",
  etudes: "Études",
  travail: "Travail",
  business: "Affaires",
  immigration: "Immigration",
};

export default async function VisasPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("visas")
    .select("id, name, type, official_fee, currency, processing_days, countries(name, flag_url)")
    .order("created_at", { ascending: true });

  if (type) {
    query = query.eq("type", type);
  }

  const { data: visas } = await query;

  return (
    <VisasList
      visas={(visas ?? []) as unknown as never}
      activeType={type ?? null}
      title={type ? `Visas ${typeLabels[type] ?? type}` : "Tous les visas"}
    />
  );
}
