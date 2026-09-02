"use client";

import { useMemo, useState } from "react";
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

const LEVEL_ORDER = ["licence", "master", "doctorat", "certificat", "autre"];

export function ProgramsList({ programs }: { programs: Program[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.universities?.name.toLowerCase().includes(query.toLowerCase()) ||
      p.universities?.countries?.name.toLowerCase().includes(query.toLowerCase())
  );

  // Regroupement : pays -> niveau -> programmes
  const grouped = useMemo(() => {
    const byCountry = new Map<
      string,
      { flag: string | null; levels: Map<string, Program[]> }
    >();

    for (const p of filtered) {
      const countryName = p.universities?.countries?.name ?? "Autre";
      const flag = p.universities?.countries?.flag_url ?? null;
      const level = p.level ?? "autre";

      if (!byCountry.has(countryName)) {
        byCountry.set(countryName, { flag, levels: new Map() });
      }
      const entry = byCountry.get(countryName)!;
      if (!entry.levels.has(level)) entry.levels.set(level, []);
      entry.levels.get(level)!.push(p);
    }

    return Array.from(byCountry.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([countryName, { flag, levels }]) => ({
        countryName,
        flag,
        levelGroups: Array.from(levels.entries()).sort(
          (a, b) => LEVEL_ORDER.indexOf(a[0]) - LEVEL_ORDER.indexOf(b[0])
        ),
      }));
  }, [filtered]);

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
        <div className="px-5 mb-2">
          <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un programme, une université..."
              className="flex-1 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>
        <div className="px-5 mb-4 text-[11px] text-slate-400">
          {filtered.length} programme{filtered.length > 1 ? "s" : ""}
        </div>

        {filtered.length === 0 ? (
          <div className="px-5">
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              {programs.length === 0
                ? "Aucun programme pour l'instant."
                : "Aucun résultat pour cette recherche."}
            </div>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.countryName} className="mb-6">
              <div className="px-5 flex items-center gap-2 mb-3">
                <span className="text-xl">{group.flag ?? "🌍"}</span>
                <h2 className="font-bold text-slate-900 text-[15px]">
                  {group.countryName}
                </h2>
              </div>

              {group.levelGroups.map(([level, progs]) => (
                <div key={level} className="mb-4 last:mb-0">
                  <div className="px-5 mb-2">
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {LEVEL_LABELS[level] ?? level} · {progs.length}
                    </span>
                  </div>
                  <div className="px-5 grid grid-cols-2 gap-3">
                    {progs.map((p) => (
                      <Link
                        key={p.id}
                        href={`/programs/${p.id}`}
                        className="flex flex-col bg-white rounded-2xl shadow-sm p-3.5"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-2.5">
                          <GraduationCap className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="text-[13px] font-semibold text-slate-900 leading-tight line-clamp-2 min-h-[32px]">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-1">
                          {p.universities?.name}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                          {p.duration_months && <span>{p.duration_months} mois</span>}
                          {p.teaching_language && (
                            <span>· {p.teaching_language}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                          {p.tuition_fee != null ? (
                            <span className="text-[12.5px] font-bold text-slate-900">
                              {p.tuition_fee.toLocaleString("fr-FR")} {p.currency}
                            </span>
                          ) : (
                            <span />
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
