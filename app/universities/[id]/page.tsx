import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UniversityDetail } from "@/components/university-detail";

export const dynamic = "force-dynamic";

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

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
      "id, name, level, duration_months, tuition_fee, currency, teaching_language"
    )
    .eq("university_id", id);

  return (
    <UniversityDetail
      university={university as unknown as never}
      programs={programs ?? []}
    />
  );
}
