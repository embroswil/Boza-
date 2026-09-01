import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/profile-view";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, nationality, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <ProfileView
      userId={user.id}
      fullName={profile?.full_name || ""}
      email={profile?.email || user.email || ""}
      phone={profile?.phone || ""}
      nationality={profile?.nationality || ""}
      avatarUrl={profile?.avatar_url || ""}
    />
  );
}
