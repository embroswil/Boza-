import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationDetail } from "@/components/application-detail";

export const dynamic = "force-dynamic";

export default async function DemandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: application } = await supabase
    .from("applications")
    .select(
      `id, status, submitted_at, created_at, application_kind,
       passport_number, education_level, diploma_title, diploma_institution, diploma_year, applicant_notes,
       date_of_birth, gender, language_proficiency, motivation_letter, financial_support, intended_start_date, health_conditions,
       visas ( name, type, official_fee, currency, processing_days, countries ( name, flag_url ) ),
       programs ( name, universities ( name, countries ( name, flag_url ) ) ),
       application_documents ( id, document_type, status, uploaded_at ),
       payments ( id, amount, currency, status, paid_at ),
       appointments ( id, appointment_date, status, embassies ( name, city ) )`
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!application) {
    notFound();
  }

  return <ApplicationDetail application={application as unknown as never} /* eslint-disable-line @typescript-eslint/no-explicit-any */ />;
}
