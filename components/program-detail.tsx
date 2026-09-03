"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Globe2,
  Clock,
  Wallet,
  Languages,
  CalendarDays,
  FileText,
  ExternalLink,
  MapPin,
} from "lucide-react";

type Program = {
  id: string;
  name: string;
  level: string | null;
  field: string | null;
  duration_months: number | null;
  tuition_fee: number | null;
  currency: string | null;
  teaching_language: string | null;
  description: string | null;
  admission_requirements: string | null;
  required_documents: string | null;
  program_url: string | null;
  intake: string | null;
  winter_intake: boolean | null;
  universities: {
    id: string;
    name: string;
    city: string | null;
    countries: { id: string; name: string; flag_url: string | null } | null;
  } | null;
};

const LEVEL_LABELS: Record<string, string> = {
  licence: "Licence",
  master: "Master",
  doctorat: "Doctorat",
  certificat: "Certificat",
  autre: "Autre",
};

export function ProgramDetail({ program }: { program: Program }) {
  const router = useRouter();
  const university = program.universities;
  const country = university?.countries;

  const infoRows = [
    { icon: Clock, label: "Durée", value: program.duration_months ? `${program.duration_months} mois` : null },
    { icon: Languages, label: "Langue d'enseignement", value: program.teaching_language },
    {
      icon: CalendarDays,
      label: "Rentrée",
      value: [program.intake, program.winter_intake ? "rentrée d'hiver possible" : null]
        .filter(Boolean)
        .join(" · ") || null,
    },
  ].filter((r) => r.value);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 truncate">{program.name}</h1>
        </div>

        {/* Hero */}
        <div className="mx-5 mb-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl shrink-0">
              {country?.flag_url ?? <GraduationCap className="w-7 h-7 text-emerald-600" />}
            </div>
            <div className="min-w-0">
              <div className="text-xl font-extrabold text-slate-900">{program.name}</div>
              {university && (
                <div className="text-[12px] text-slate-500 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {university.name}
                  {university.city ? `, ${university.city}` : ""}
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
          {program.description && (
            <p className="text-[13px] text-slate-500 mt-3 leading-relaxed">
              {program.description}
            </p>
          )}
          {program.level && (
            <span className="inline-block mt-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              {LEVEL_LABELS[program.level] ?? program.level}
              {program.field ? ` · ${program.field}` : ""}
            </span>
          )}
        </div>

        {/* Frais */}
        {program.tuition_fee != null && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">Frais de scolarité</h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg font-extrabold text-slate-900">
                {program.tuition_fee} {program.currency}
                <span className="text-[12px] font-medium text-slate-400"> /an</span>
              </div>
            </div>
          </div>
        )}

        {/* Infos générales */}
        {infoRows.length > 0 && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">Informations</h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {infoRows.map((r) => (
                <div key={r.label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[12.5px] text-slate-400 flex items-center gap-2">
                    <r.icon className="w-3.5 h-3.5" /> {r.label}
                  </span>
                  <span className="text-[13px] font-medium text-slate-900">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditions d'admission */}
        {program.admission_requirements && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">
              Conditions d&apos;admission
            </h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 text-[13px] text-slate-600 leading-relaxed">
              {program.admission_requirements}
            </div>
          </div>
        )}

        {/* Documents requis */}
        {program.required_documents && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">Documents requis</h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 text-[13px] text-slate-600 leading-relaxed flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              {program.required_documents}
            </div>
          </div>
        )}

        {/* Lien officiel */}
        {program.program_url && (
          <div className="px-5 mb-6">
            <a
              href={program.program_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-slate-700"
            >
              Page du programme <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* CTA */}
        <div className="px-5">
          <Link
            href={`/demandes/nouvelle/admission?programId=${program.id}`}
            className="w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center"
          >
            Démarrer une demande
          </Link>
        </div>
      </div>
    </div>
  );
}
