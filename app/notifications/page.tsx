import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotificationsList } from "@/components/notifications-list";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, message, cta_label, cta_url, created_at")
    .order("created_at", { ascending: false });

  // On marque l'ensemble des annonces comme vues à cet instant (badge de la
  // cloche basé sur last_seen_announcements_at, comparé à la date des
  // annonces — voir bottom-nav.tsx / app/page.tsx).
  await supabase
    .from("profiles")
    .update({ last_seen_announcements_at: new Date().toISOString() })
    .eq("id", user.id);

  return <NotificationsList announcements={announcements ?? []} />;
}
