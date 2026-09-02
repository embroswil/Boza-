"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, ChevronRight, FileCheck2, Globe2, Clock } from "lucide-react";
import { getDestinationImage } from "@/lib/destination-images";

type Visa = {
  id: string;
  name: string;
  type: string;
  official_fee: number | null;
  currency: string | null;
  processing_days: number | null;
  countries: { id?: string; name: string; flag_url: string | null } | null;
};

const TYPE_LABELS: Record<string, string> = {
  tourisme: "Tourisme",
  etudes: "Études",
};

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  tourisme: { bg: "bg-emerald-50", text: "text-emerald-600" },
  etudes: { bg: "bg-blue-50", text: "text-blue-600" },
};

const formatPrice = (n: number) => n.toLocaleString("fr-FR");

export function VisasList({
  visas,
  activeType,
  title,
}: {
  visas: Visa[];
  activeType: string | null;
  title: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // La page "Visas Tourisme" propose une expérience dédiée : pas de barre
  // de recherche, pas d'onglets (Tous/Études), uniquement des cartes visuelles.
  const isTourismOnly = activeType === "tourisme";

  const filtered = visas.filter(
    (v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.countries?.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        </div>

        {!isTourismOnly && (
          <>
            {/* Search */}
            <div className="px-5 mb-4">
              <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un visa..."
                  className="flex-1 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Type filters */}
            <div className="px-5 mb-5 flex gap-2 overflow-x-auto no-scrollbar">
              <Link
                href="/visas"
                className={`shrink-0 text-[12.5px] font-semibold px-4 py-2 rounded-full ${
                  !activeType ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200"
                }`}
              >
                Tous
              </Link>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <Link
                  key={value}
                  href={`/visas?type=${value}`}
                  className={`shrink-0 text-[12.5px] font-semibold px-4 py-2 rounded-full ${
                    activeType === value
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-slate-500 border border-slate-200"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </>
        )}

        {isTourismOnly && (
          <div className="px-5 mb-4 text-[12.5px] text-slate-400">
            {visas.length} destination{visas.length > 1 ? "s" : ""} disponible
            {visas.length > 1 ? "s" : ""}
          </div>
        )}

        {/* List */}
        <div className="px-5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              {visas.length === 0
                ? "Aucun visa pour l'instant."
                : "Aucun résultat pour cette recherche."}
            </div>
          ) : isTourismOnly ? (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((v) => (
                <Link
                  key={v.id}
                  href={`/visas/${v.id}`}
                  className="relative rounded-2xl overflow-hidden shadow-sm flex flex-col bg-white"
                >
                  <div className="relative w-full aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getDestinationImage({
                        id: v.countries?.id ?? v.id,
                        name: v.countries?.name,
                      })}
                      alt={v.countries?.name ?? v.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[9.5px] font-bold px-2 py-1 rounded-full bg-white/90 text-emerald-700 backdrop-blur flex items-center gap-1">
                      {v.countries?.flag_url && <span>{v.countries.flag_url}</span>}
                      {v.countries?.name ?? "Voyage"}
                    </span>
                  </div>
                  <div className="p-3 flex flex-col gap-1.5 flex-1">
                    <div className="text-[12.5px] font-semibold text-slate-900 leading-tight line-clamp-2">
                      {v.name}
                    </div>
                    {v.processing_days != null && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" /> {v.processing_days} jours de traitement
                      </div>
                    )}
                    <div className="flex items-end justify-between mt-auto pt-1.5">
                      {v.official_fee != null ? (
                        <div>
                          <div className="text-[12.5px] font-bold text-slate-900 leading-tight">
                            {formatPrice(v.official_fee)}
                          </div>
                          <div className="text-[9px] text-slate-400">{v.currency}</div>
                        </div>
                      ) : (
                        <span />
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((v) => {
                const style = TYPE_STYLES[v.type] ?? { bg: "bg-slate-50", text: "text-slate-500" };
                return (
                  <Link
                    key={v.id}
                    href={`/visas/${v.id}`}
                    className="flex flex-col bg-white rounded-2xl shadow-sm p-3.5"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-xl border border-slate-100 mb-2.5">
                      {v.countries?.flag_url ?? <FileCheck2 className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="text-[13px] font-semibold text-slate-900 leading-tight line-clamp-2 min-h-[32px]">
                      {v.name}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate mt-1 flex items-center gap-1">
                      {v.countries?.name ?? <Globe2 className="w-3 h-3" />}
                    </span>
                    <span
                      className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full self-start mt-2 ${style.bg} ${style.text}`}
                    >
                      {TYPE_LABELS[v.type] ?? v.type}
                    </span>
                    <div className="flex items-end justify-between mt-3 pt-2.5 border-t border-slate-100">
                      <div>
                        {v.official_fee != null && (
                          <div className="text-[12.5px] font-bold text-slate-900 leading-tight">
                            {formatPrice(v.official_fee)}
                          </div>
                        )}
                        <div className="text-[9px] text-slate-400">{v.currency}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
