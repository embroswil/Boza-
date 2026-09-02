"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileCheck2,
  Globe2,
  Clock,
  Wallet,
  Repeat,
  ShieldCheck,
  ExternalLink,
  FileText,
  CheckCircle2,
  Circle,
} from "lucide-react";

type Visa = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  processing_days: number | null;
  official_fee: number | null;
  service_fee: number | null;
  currency: string | null;
  eligibility: string | null;
  validity: string | null;
  entries: string | null;
  official_url: string | null;
  notes: string | null;
  countries: { id: string; name: string; flag_url: string | null } | null;
};

type Requirement = {
  id: string;
  document_name: string;
  is_required: boolean | null;
  description: string | null;
  format: string | null;
  copies: number | null;
};

const TYPE_LABELS: Record<string, string> = {
  tourisme: "Tourisme",
  etudes: "Études",
};

export function VisaDetail({
  visa,
  requirements,
}: {
  visa: Visa;
  requirements: Requirement[];
}) {
  const router = useRouter();

  const infoRows = [
    { icon: Clock, label: "Délai de traitement", value: visa.processing_days ? `${visa.processing_days} jours` : null },
    { icon: Repeat, label: "Entrées", value: visa.entries },
    { icon: ShieldCheck, label: "Validité", value: visa.validity },
  ].filter((r) => r.value);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 truncate">{visa.name}</h1>
        </div>

        {/* Hero */}
        <div className="mx-5 mb-5 rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl shrink-0">
              {visa.countries?.flag_url ?? <FileCheck2 className="w-7 h-7 text-blue-600" />}
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">{visa.name}</div>
              {visa.countries && (
                <Link
                  href={`/countries/${visa.countries.id}`}
                  className="text-[12px] text-blue-600 flex items-center gap-1"
                >
                  <Globe2 className="w-3 h-3" /> {visa.countries.name}
                </Link>
              )}
            </div>
          </div>
          {visa.description && (
            <p className="text-[13px] text-slate-500 mt-3 leading-relaxed">{visa.description}</p>
          )}
          <span className="inline-block mt-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {TYPE_LABELS[visa.type] ?? visa.type}
          </span>
        </div>

        {/* Frais */}
        {(visa.official_fee != null || visa.service_fee != null) && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">Frais</h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {visa.official_fee != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[12.5px] text-slate-400 flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5" /> Frais officiels
                  </span>
                  <span className="text-[13px] font-bold text-slate-900">
                    {visa.official_fee} {visa.currency}
                  </span>
                </div>
              )}
              {visa.service_fee != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[12.5px] text-slate-400 flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5" /> Frais de service
                  </span>
                  <span className="text-[13px] font-bold text-slate-900">
                    {visa.service_fee} {visa.currency}
                  </span>
                </div>
              )}
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

        {/* Éligibilité */}
        {visa.eligibility && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">Éligibilité</h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 text-[13px] text-slate-600 leading-relaxed">
              {visa.eligibility}
            </div>
          </div>
        )}

        {/* Documents requis */}
        {requirements.length > 0 && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">Documents requis</h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {requirements.map((r) => (
                <div key={r.id} className="flex items-start gap-3 px-4 py-3.5">
                  {r.is_required ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {r.document_name}
                    </div>
                    {r.description && (
                      <div className="text-[11px] text-slate-400 mt-0.5">{r.description}</div>
                    )}
                    {(r.format || r.copies) && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {[r.format, r.copies ? `${r.copies} copie(s)` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {visa.notes && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">À savoir</h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 text-[13px] text-slate-600 leading-relaxed flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              {visa.notes}
            </div>
          </div>
        )}

        {/* Lien officiel */}
        {visa.official_url && (
          <div className="px-5 mb-6">
            <a
              href={visa.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 flex items-center justify-center gap-2 text-[13px] font-semibold text-slate-700"
            >
              Site officiel <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* CTA */}
        <div className="px-5">
          <Link
            href={`/demandes/nouvelle?visaId=${visa.id}`}
            className="w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center"
          >
            Démarrer une demande
          </Link>
        </div>
      </div>
    </div>
  );
}
