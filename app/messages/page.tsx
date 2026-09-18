import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessagesList } from "@/components/messages-list";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, message, is_read, application_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <MessagesList notifications={notifications ?? []} />;
}
