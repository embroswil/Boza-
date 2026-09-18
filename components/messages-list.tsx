"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  application_id: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessagesList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const supabase = createClient();

  const handleOpen = async (n: Notification) => {
    if (!n.is_read) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", n.id);
    }
    if (n.application_id) {
      router.push(`/demandes/${n.application_id}`);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-[#0A0A12] pb-24">
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </button>
          <h1 className="text-lg font-bold text-white">Messages</h1>
        </div>

        <div className="px-5">
          {notifications.length === 0 ? (
            <div className="bg-[#15151F] rounded-2xl p-6 text-center shadow-none">
              <MessageCircle className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-[12.5px] text-slate-500">
                Tu n&apos;as reçu aucun message pour l&apos;instant. Boza t&apos;écrira ici si un
                document supplémentaire est nécessaire ou si le statut d&apos;une demande change.
              </p>
            </div>
          ) : (
            <div className="bg-[#15151F] rounded-2xl shadow-none divide-y divide-[#26263380]">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleOpen(n)}
                  className="w-full text-left flex items-start gap-3 px-4 py-3.5"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {!n.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                      )}
                      <span
                        className={`text-[13px] truncate ${
                          n.is_read ? "text-slate-300 font-medium" : "text-white font-bold"
                        }`}
                      >
                        {n.title}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">{formatDate(n.created_at)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
