import { createPublicClient } from "@/lib/supabase/public";
import { ProgramsList } from "@/components/programs-list";

export const revalidate = 300; // cache 5 min, contenu public peu changeant

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const { level } = await searchParams;
  const supabase = createPublicClient();

  const { data: programs } = await supabase
    .from("programs")
    .select(
      "id, name, level, field, duration_months, tuition_fee, currency, teaching_language, universities(name, countries(name, flag_url))"
    )
    .order("created_at", { ascending: true });

  return (
    <ProgramsList programs={(programs ?? []) as unknown as never} initialLevel={level ?? null} />
  );
}
