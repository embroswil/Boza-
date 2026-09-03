import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewAdmissionForm } from "@/components/new-admission-form";

export const dynamic = "force-dynamic";

export default async function NouvelleAdmissionPage({
  searchParams,
}: {
  searchParams: Promise<{ programId?: string }>;
}) {
  const { programId } = await searchParams;
  if (!programId) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: program } = await supabase
    .from("programs")
    .select(
      "id, name, level, universities ( name, countries ( name, flag_url ) )"
    )
    .eq("id", programId)
    .single();

  if (!program) notFound();

  return (
    <NewAdmissionForm
      program={program as unknown as never}
      userId={user.id}
    />
  );
}
