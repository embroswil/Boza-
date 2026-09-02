import { createClient } from "@/lib/supabase/server";
import { ProgramsList } from "@/components/programs-list";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const supabase = await createClient();

  const { data: programs } = await supabase
    .from("programs")
    .select(
      "id, name, level, field, duration_months, tuition_fee, currency, teaching_language, universities(name, countries(name, flag_url))"
    )
    .order("created_at", { ascending: true });

  return <ProgramsList programs={(programs ?? []) as unknown as never} />;
}
