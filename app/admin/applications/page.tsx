import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminApplicationDetail } from "@/components/admin-application-detail";

export const dynamic = "force-dynamic";

export default async function AdminApplicationPage({
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/");
  }

  const { data: application } = await supabase
    .from("applications")
    .select(
      `id, user_id, status, submitted_at, created_at, application_kind, contact_email,
       passport_number, education_level, diploma_title, diploma_institution,
       diploma_year, applicant_notes, date_of_birth, gender,
       language_proficiency, motivation_letter, financial_support,
       intended_start_date, health_conditions,
       profiles ( full_name, email, phone, nationality ),
       visas ( name, type, official_fee, service_fee, currency, processing_days, countries ( name, flag_url ) ),
       programs:study_program_id ( name, universities ( name, countries ( name, flag_url ) ) ),
       application_documents ( id, document_type, status, file_url, uploaded_at ),
       payments ( id, amount, currency, status, paid_at ),
       appointments ( id, appointment_date, status, embassies ( name, city ) )`
    )
    .eq("id", id)
    .single();

  if (!application) {
    notFound();
  }

  const { data: verificationRequests } = await supabase
    .from("verification_requests")
    .select("id, application_id, portal_name, instructions, status, code, requested_at, fulfilled_at")
    .eq("application_id", id)
    .order("requested_at", { ascending: false });

  return (
    <AdminApplicationDetail
      application={application as unknown as never}
      verificationRequests={verificationRequests ?? []}
    />
  );
}
