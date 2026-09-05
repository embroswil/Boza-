"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Globe2,
  FileCheck2,
  GraduationCap,
  Building2,
  ChevronRight,
} from "lucide-react";

type Country = { id: string; name: string; flag_url: string | null };
type Visa = { id: string; name: string; type: string };
type Program = { id: string; name: string; level: string | null };
type University = { id: string; name: string; city: string | null };

export function SearchResults({
  query,
  countries,
  visas,
  programs,
  universities,
}: {
  query: string;
  countries: Country[];
  visas: Visa[];
  programs: Program[];
  universities: University[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(query);

  const goSearch = () => {
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  const totalResults =
    countries.length + visas.length + programs.length + universities.length;

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Recherche</h1>
        </div>

        {/* Search input */}
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goSearch()}
              placeholder="Rechercher..."
              className="flex-1 text-[13.5px] text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {!query ? (
          <div className="px-5">
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              Tape un mot-clé pour chercher un pays, un visa, une université ou un programme.
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="px-5">
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              Aucun résultat pour &quot;{query}&quot;.
            </div>
          </div>
        ) : (
          <div className="px-5 flex flex-col gap-5">
            {countries.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold text-slate-400 uppercase mb-2">
                  Pays
                </h2>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
                  {countries.map((c) => (
                    <Link
                      key={c.id}
                      href={`/countries/${c.id}`}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg shrink-0">
                        {c.flag_url ?? <Globe2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <span className="flex-1 text-[13.5px] font-medium text-slate-900">
                        {c.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {visas.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold text-slate-400 uppercase mb-2">
                  Visas
                </h2>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
                  {visas.map((v) => (
                    <Link
                      key={v.id}
                      href={`/visas/${v.id}`}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="flex-1 text-[13.5px] font-medium text-slate-900">
                        {v.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {programs.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold text-slate-400 uppercase mb-2">
                  Programmes d&apos;études
                </h2>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
                  {programs.map((p) => (
                    <Link
                      key={p.id}
                      href={`/programs/${p.id}`}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-violet-600" />
                      </div>
                      <span className="flex-1 text-[13.5px] font-medium text-slate-900">
                        {p.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {universities.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold text-slate-400 uppercase mb-2">
                  Universités
                </h2>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
                  {universities.map((u) => (
                    <Link
                      key={u.id}
                      href={`/universities/${u.id}`}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-[13.5px] font-medium text-slate-900">
                          {u.name}
                        </div>
                        {u.city && (
                          <div className="text-[11px] text-slate-400">{u.city}</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
