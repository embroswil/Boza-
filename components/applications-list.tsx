"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, ChevronRight, FileQuestion, Globe2 } from "lucide-react";
import { getDestinationImage } from "@/lib/destination-images";

type Application = {
  id: string;
  status: string;
  submitted_at: string | null;
  created_at: string;
  visas: {
    name: string;
    type: string;
    countries: { id?: string; name: string; flag_url: string | null } | null;
  } | null;
  programs: {
    name: string;
    universities: {
      name: string;
      countries: { id?: string; name: string; flag_url: string | null } | null;
    } | null;
  } | null;
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  brouillon: { label: "Brouillon", className: "bg-slate-100 text-slate-500" },
  soumise: { label: "Soumise", className: "bg-blue-50 text-blue-600" },
  en_cours: { label: "En cours", className: "bg-amber-50 text-amber-600" },
  documents_manquants: {
    label: "Documents manquants",
    className: "bg-orange-50 text-orange-600",
  },
  approuvee: { label: "Approuvée", className: "bg-emerald-50 text-emerald-600" },
  refusee: { label: "Refusée", className: "bg-red-50 text-red-600" },
  annulee: { label: "Annulée", className: "bg-slate-100 text-slate-400" },
};

export function ApplicationsList({ applications }: { applications: Application[] }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Mes demandes</h1>
          </div>
          <Link
            href="/demandes/nouvelle"
            className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0"
          >
            <Plus className="w-5 h-5 text-white" />
          </Link>
        </div>

        {/* Grille (une seule colonne) */}
        <div className="px-5 flex flex-col gap-3.5">
          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm flex flex-col items-center gap-3">
              <FileQuestion className="w-8 h-8 text-slate-300" />
              <p className="text-sm text-slate-400">
                Tu n&apos;as encore aucune demande soumise.
              </p>
              <Link
                href="/demandes/nouvelle"
                className="mt-1 bg-blue-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5"
              >
                Démarrer une demande
              </Link>
            </div>
          ) : (
            applications.map((a) => {
              const country =
                a.visas?.countries ?? a.programs?.universities?.countries ?? null;
              const title = a.visas?.name ?? a.programs?.name ?? "Demande";
              const subtitle = a.programs?.universities?.name ?? country?.name ?? "";
              const status = STATUS_STYLES[a.status] ?? STATUS_STYLES.brouillon;

              return (
                <Link
                  key={a.id}
                  href={`/demandes/${a.id}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative w-full aspect-[16/9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getDestinationImage({
                        id: country?.id ?? a.id,
                        name: country?.name,
                      })}
                      alt={country?.name ?? title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-base shadow-sm">
                      {country?.flag_url ?? <Globe2 className="w-4 h-4 text-blue-600" />}
                    </span>
                    <span
                      className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="px-4 py-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-slate-900 truncate">
                        {title}
                      </div>
                      <div className="text-[11.5px] text-slate-400 truncate">{subtitle}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
