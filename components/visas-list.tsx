"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, ChevronRight, FileCheck2, Globe2 } from "lucide-react";

type Visa = {
  id: string;
  name: string;
  type: string;
  official_fee: number | null;
  currency: string | null;
  processing_days: number | null;
  countries: { name: string; flag_url: string | null } | null;
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

        {/* List */}
        <div className="px-5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              {visas.length === 0
                ? "Aucun visa pour l'instant."
                : "Aucun résultat pour cette recherche."}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filtered.map((v) => {
                const style = TYPE_STYLES[v.type] ?? { bg: "bg-slate-50", text: "text-slate-500" };
                return (
                  <Link
                    key={v.id}
                    href={`/visas/${v.id}`}
                    className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-4 py-3.5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 text-2xl border border-slate-100">
                      {v.countries?.flag_url ?? <FileCheck2 className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-slate-900 truncate">
                        {v.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                          {v.countries?.name ?? <Globe2 className="w-3 h-3" />}
                        </span>
                        <span
                          className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full ${style.bg} ${style.text}`}
                        >
                          {TYPE_LABELS[v.type] ?? v.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      {v.official_fee != null && (
                        <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">
                          {formatPrice(v.official_fee)} {v.currency}
                        </span>
                      )}
                      {v.processing_days != null && (
                        <span className="text-[10px] text-slate-400">
                          {v.processing_days} jours
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
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
