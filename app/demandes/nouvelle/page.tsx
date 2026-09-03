import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewApplicationForm } from "@/components/new-application-form";
import { NewAdmissionForm } from "@/components/new-admission-form";

export const dynamic = "force-dynamic";

export default async function NouvelleDemandePage({
  searchParams,
}: {
  searchParams: Promise<{ programId?: string; visaId?: string; kind?: string }>;
}) {
  const { programId, visaId, kind } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Demande d'admission à un programme universitaire : formulaire dédié
  // (date de naissance, lettre de motivation, etc.), séparé de la demande
  // de visa qui se fait dans un second temps une fois l'admission acquise.
  if (kind === "admission") {
    if (!programId) notFound();

    const { data: program } = await supabase
      .from("programs")
      .select(
        "id, name, level, currency, required_documents, universities ( name, application_fee, countries ( name, flag_url ) )"
      )
      .eq("id", programId)
      .single();

    if (!program) notFound();

    return (
      <NewAdmissionForm program={program as unknown as never} userId={user.id} />
    );
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
