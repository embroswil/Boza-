import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewApplicationForm } from "@/components/new-application-form";

export const dynamic = "force-dynamic";

export default async function NouvelleDemandePage({
  searchParams,
}: {
  searchParams: Promise<{ programId?: string; visaId?: string }>;
}) {
  const { programId, visaId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: countries } = await supabase
    .from("countries")
    .select("id, name, flag_url")
    .order("name", { ascending: true });

  // Le programme et/ou le visa choisis sur la fiche précédente sont
  // transmis en amont pour ne pas faire tout resélectionner à l'utilisateur.
  let initialProgram = null;
  if (programId) {
    const { data } = await supabase
      .from("programs")
      .select("id, name, universities(name, countries(id, name, flag_url))")
      .eq("id", programId)
      .single();
    initialProgram = data;
  }

  let initialVisa = null;
  if (visaId) {
    const { data } = await supabase
      .from("visas")
      .select(
        "id, name, type, official_fee, service_fee, currency, processing_days, countries(id, name, flag_url)"
      )
      .eq("id", visaId)
      .single();
    initialVisa = data;
  }

  return (
    <NewApplicationForm
      countries={countries ?? []}
      userId={user.id}
      initialProgram={initialProgram as unknown as never}
      initialVisa={initialVisa as unknown as never}
    />
  );
}
