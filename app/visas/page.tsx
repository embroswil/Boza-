import { createPublicClient } from "@/lib/supabase/public";
import { VisasList } from "@/components/visas-list";

export const revalidate = 300; // cache 5 min, contenu public peu changeant

const typeLabels: Record<string, string> = {
  tourisme: "Tourisme",
  etudes: "Études",
};

export default async function VisasPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const supabase = createPublicClient();

  let query = supabase
    .from("visas")
    .select("id, name, type, official_fee, currency, processing_days, countries(id, name, flag_url)")
    .not("type", "in", '("travail","business","immigration")')
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
