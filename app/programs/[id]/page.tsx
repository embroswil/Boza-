import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { ProgramDetail } from "@/components/program-detail";

export const revalidate = 300; // cache 5 min, contenu public peu changeant

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createPublicClient();

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
