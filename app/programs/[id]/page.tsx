import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgramDetail } from "@/components/program-detail";

export const dynamic = "force-dynamic";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: program } = await supabase
    .from("programs")
    .select("*, universities(id, name, city, countries(id, name, flag_url))")
    .eq("id", id)
    .single();

  if (!program) {
    notFound();
  }

  return <ProgramDetail program={program as unknown as never} />;
}
