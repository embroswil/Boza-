import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationsList } from "@/components/applications-list";

export const dynamic = "force-dynamic";

export default async function DemandesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: applications } = await supabase
    .from("applications")
    .select(
      `id, status, submitted_at, created_at,
       visas ( name, type, countries ( name, flag_url ) ),
       programs ( name, universities ( name, countries ( name, flag_url ) ) )`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <ApplicationsList applications={(applications ?? []) as unknown as never} />;
}
