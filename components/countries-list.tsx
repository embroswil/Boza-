"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { getDestinationImage } from "@/lib/destination-images";

type Country = {
  id: string;
  name: string;
  continent: string | null;
  flag_url: string | null;
  description: string | null;
};

export function CountriesList({ countries }: { countries: Country[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Tous les pays</h1>
        </div>

        {/* Search */}
        <div className="px-5 mb-5">
          <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un pays..."
              className="flex-1 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="px-5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
              {countries.length === 0
                ? "Aucun pays pour l'instant."
                : "Aucun résultat pour cette recherche."}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((c) => (
                <Link
                  key={c.id}
                  href={`/countries/${c.id}`}
                  className="relative rounded-2xl overflow-hidden shadow-sm aspect-[4/5] group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getDestinationImage({ id: c.id, name: c.name })}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-base shadow-sm">
                    {c.flag_url ?? "🌍"}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-[14px] font-bold text-white leading-tight">
                      {c.name}
                    </div>
                    {c.continent && (
                      <div className="text-[10.5px] text-white/80 mt-0.5">
                        {c.continent}
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
