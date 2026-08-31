"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, User, Mail, Phone, Flag, LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ProfileView({
  fullName,
  email,
  phone,
  nationality,
}: {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const fields = [
    { icon: User, label: "Nom complet", value: fullName || "Non renseigné" },
    { icon: Mail, label: "Email", value: email },
    { icon: Phone, label: "Téléphone", value: phone || "Non renseigné" },
    { icon: Flag, label: "Nationalité", value: nationality || "Non renseignée" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Mon profil</h1>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {(fullName || email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="mt-3 font-bold text-slate-900 text-base">
            {fullName || "Bienvenue"}
          </div>
        </div>

        {/* Infos */}
        <div className="px-5">
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
            {fields.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-slate-400">{f.label}</div>
                    <div className="text-[13.5px] font-medium text-slate-900 truncate">
                      {f.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="px-5 mt-6">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full bg-white border border-red-200 text-red-500 text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
