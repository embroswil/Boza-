import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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

  const { data: applications } = await supabase
    .from("applications")
    .select(
      `id, status, submitted_at, application_kind, contact_email,
       profiles ( full_name, email ),
       visas ( name, countries ( name ) ),
       programs:study_program_id ( name, universities ( name ) )`
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: verificationRequests } = await supabase
    .from("verification_requests")
    .select("id, application_id, portal_name, instructions, status, code, requested_at, fulfilled_at")
    .order("requested_at", { ascending: false })
    .limit(50);

  return (
    <AdminDashboard
      applications={(applications ?? []) as unknown as never}
      verificationRequests={verificationRequests ?? []}
    />
  );
}
