"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { getDestinationImage } from "@/lib/destination-images";
import { formatXAF } from "@/lib/currency";

type Visa = {
  id: string;
  name: string;
  type: string;
  official_fee: number | null;
  service_fee: number | null;
  currency: string | null;
  processing_days: number | null;
  countries: { id?: string; name: string; flag_url: string | null } | null;
};

const TYPE_LABELS: Record<string, string> = {
  tourisme: "Tourisme",
  etudes: "Études",
};


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

  // La page "Visas Tourisme" propose une expérience dédiée, sans recherche
  // ni onglets, puisqu'elle est déjà filtrée sur une seule catégorie.
  const isTourismOnly = activeType === "tourisme";

  const filtered = visas.filter(
    (v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.countries?.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
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

        {/* Grid — même traitement visuel (photos) pour toutes les vues */}
        <div className="px-5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              {visas.length === 0
                ? "Aucun visa pour l'instant."
                : "Aucun résultat pour cette recherche."}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((v) => (
                <Link
                  key={v.id}
                  href={`/visas/${v.id}`}
                  className="relative rounded-2xl overflow-hidden shadow-sm aspect-[4/5] group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getDestinationImage({
                      id: v.countries?.id ?? v.id,
                      name: v.countries?.name,
                    })}
                    alt={v.countries?.name ?? v.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center overflow-hidden shadow-sm">
                    {v.countries?.flag_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.countries.flag_url}
                        alt={v.countries.name}
                        className="w-full h-full object-cover object-left"
                      />
                    ) : (
                      <span className="text-base">🌍</span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 text-[9px] font-bold px-2 py-1 rounded-full bg-white/90 backdrop-blur text-slate-700">
                    {TYPE_LABELS[v.type] ?? v.type}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-[13px] font-bold text-white leading-tight line-clamp-1">
                      {v.countries?.name ?? v.name}
                    </div>
                    <div className="text-[10.5px] text-white/80 mt-0.5 line-clamp-1">
                      {v.name}
                    </div>
                    {v.official_fee != null && (
                      <div className="text-[12px] font-bold text-white mt-1">
                        {formatXAF((v.official_fee ?? 0) + (v.service_fee ?? 0), v.currency)}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
