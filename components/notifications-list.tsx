"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Megaphone } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  cta_label: string | null;
  cta_url: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function NotificationsList({ announcements }: { announcements: Announcement[] }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0A12] flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-[#0A0A12] pb-24">
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </button>
          <h1 className="text-lg font-bold text-white">Notifications</h1>
        </div>

        <div className="px-5">
          {announcements.length === 0 ? (
            <div className="bg-[#15151F] rounded-2xl p-6 text-center shadow-none">
              <Megaphone className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-[12.5px] text-slate-500">
                Aucune actualité pour l&apos;instant. Les nouveautés Boza (nouveaux pays, offres...)
                s&apos;afficheront ici pour tout le monde.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {announcements.map((a) => (
                <div key={a.id} className="bg-[#15151F] rounded-2xl shadow-none p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-bold text-white">{a.title}</span>
                      <p className="text-[11.5px] text-slate-400 mt-0.5 leading-relaxed">
                        {a.message}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1.5">
                        {formatDate(a.created_at)}
                      </p>
                      {a.cta_url && (
                        <a
                          href={a.cta_url}
                          className="inline-block mt-2 text-[11.5px] font-semibold text-violet-400"
                        >
                          {a.cta_label || "En savoir plus"} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
