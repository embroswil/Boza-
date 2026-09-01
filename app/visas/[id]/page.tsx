import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VisaDetail } from "@/components/visa-detail";

export const dynamic = "force-dynamic";

export default async function VisaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: visa } = await supabase
    .from("visas")
    .select("*, countries(id, name, flag_url)")
    .eq("id", id)
    .single();

  if (!visa) {
    notFound();
  }

  const { data: requirements } = await supabase
    .from("visa_documents")
    .select("*")
    .eq("visa_id", id);

  return <VisaDetail visa={visa as unknown as never} requirements={requirements ?? []} />;
}
