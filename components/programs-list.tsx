"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, ChevronRight, GraduationCap } from "lucide-react";

type Program = {
  id: string;
  name: string;
  level: string | null;
  duration_months: number | null;
  tuition_fee: number | null;
  currency: string | null;
  teaching_language: string | null;
  universities: {
    name: string;
    countries: { name: string; flag_url: string | null } | null;
  } | null;
};

const LEVEL_LABELS: Record<string, string> = {
  licence: "Licence",
  master: "Master",
  doctorat: "Doctorat",
  certificat: "Certificat",
  autre: "Autre",
};

export function ProgramsList({ programs }: { programs: Program[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.universities?.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Programmes d&apos;études</h1>
        </div>

        {/* Search */}
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un programme..."
              className="flex-1 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* List */}
        <div className="px-5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              {programs.length === 0
                ? "Aucun programme pour l'instant."
                : "Aucun résultat pour cette recherche."}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/programs/${p.id}`}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-lg">
                    {p.universities?.countries?.flag_url ?? (
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-slate-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {p.universities?.name}
                      {p.level ? ` · ${LEVEL_LABELS[p.level] ?? p.level}` : ""}
                    </div>
                  </div>
                  {p.tuition_fee != null && (
                    <span className="text-[12.5px] font-bold text-slate-900 whitespace-nowrap">
                      {p.tuition_fee} {p.currency}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
