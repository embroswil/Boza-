import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewApplicationForm } from "@/components/new-application-form";

export const dynamic = "force-dynamic";

export default async function NouvelleDemandePage() {
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

  return <NewApplicationForm countries={countries ?? []} userId={user.id} />;
}
