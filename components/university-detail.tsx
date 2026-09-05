"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Globe2,
  MapPin,
  ChevronRight,
  Star,
} from "lucide-react";

type Program = {
  id: string;
  name: string;
  level: string | null;
  duration_months: number | null;
  tuition_fee: number | null;
  currency: string | null;
  teaching_language: string | null;
};

type University = {
  id: string;
  name: string;
  city: string | null;
  ranking: number | null;
  description: string | null;
  website: string | null;
  countries: { id: string; name: string; flag_url: string | null } | null;
};

const LEVEL_LABELS: Record<string, string> = {
  licence: "Licence",
  master: "Master",
  doctorat: "Doctorat",
  certificat: "Certificat",
  autre: "Autre",
};

export function UniversityDetail({
  university,
  programs,
}: {
  university: University;
  programs: Program[];
}) {
  const router = useRouter();
  const country = university.countries;

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 truncate">
            {university.name}
          </h1>
        </div>

        {/* Hero */}
        <div className="mx-5 mb-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl shrink-0">
              {country?.flag_url ?? (
                <GraduationCap className="w-7 h-7 text-emerald-600" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xl font-extrabold text-slate-900">
                {university.name}
              </div>
              {university.city && (
                <div className="text-[12px] text-slate-500 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {university.city}
                </div>
              )}
              {country && (
                <Link
                  href={`/countries/${country.id}`}
                  className="text-[12px] text-blue-600 flex items-center gap-1 mt-0.5"
                >
                  <Globe2 className="w-3 h-3" /> {country.name}
                </Link>
              )}
            </div>
          </div>
          {university.description && (
            <p className="text-[13px] text-slate-500 mt-3 leading-relaxed">
              {university.description}
            </p>
          )}
          {university.ranking && (
            <span className="inline-flex items-center gap-1 mt-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              <Star className="w-3 h-3" /> Classement #{university.ranking}
            </span>
          )}
        </div>

        {/* Site officiel */}
        {university.website && (
          <div className="px-5 mb-5">
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-slate-700"
            >
              Site officiel <Globe2 className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Programmes proposés */}
        <div className="px-5 mb-5">
          <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">
            Programmes proposés
          </h2>
          {programs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-4 text-[13px] text-slate-400 text-center">
              Aucun programme référencé pour l&apos;instant.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {programs.map((p) => (
                <Link
                  key={p.id}
                  href={`/programs/${p.id}`}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {[
                        p.level ? LEVEL_LABELS[p.level] ?? p.level : null,
                        p.duration_months ? `${p.duration_months} mois` : null,
                        p.teaching_language,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                  {p.tuition_fee != null && (
                    <span className="text-[12px] font-bold text-slate-900 shrink-0">
                      {p.tuition_fee.toLocaleString("fr-FR")} {p.currency}
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
