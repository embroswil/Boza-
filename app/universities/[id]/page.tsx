import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { UniversityDetail } from "@/components/university-detail";

export const revalidate = 300; // cache 5 min, contenu public peu changeant

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createPublicClient();

  const { data: university } = await supabase
    .from("universities")
    .select("*, countries(id, name, flag_url)")
    .eq("id", id)
    .single();

  if (!university) {
    notFound();
  }

  const { data: programs } = await supabase
    .from("programs")
    .select(
      "id, name, level, duration_months, tuition_fee, currency, teaching_language, field"
    )
    .eq("university_id", id);

  return (
    <UniversityDetail
      university={university as unknown as never}
      programs={programs ?? []}
    />
  );
}
