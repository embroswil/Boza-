"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Globe2,
  Landmark,
  FileCheck2,
  GraduationCap,
  Wallet,
  Info,
  Building2,
  Phone,
  Mail,
  ChevronRight,
  Coins,
  Languages,
  Clock,
  TrendingUp,
} from "lucide-react";

type Country = {
  id: string;
  name: string;
  continent: string | null;
  flag_url: string | null;
  description: string | null;
  code: string | null;
  capital: string | null;
  currency: string | null;
  official_languages: string | null;
  timezone: string | null;
  cost_of_living_level: string | null;
  official_tourism_url: string | null;
  entry_conditions: string | null;
};

type Embassy = {
  id: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
};

type Visa = {
  id: string;
  type: string;
  name: string;
  official_fee: number | null;
  currency: string | null;
  processing_days: number | null;
};

type University = {
  id: string;
  name: string;
  city: string | null;
  ranking: number | null;
};

type CostOfLiving = {
  estimated_total_monthly: number | null;
  housing_monthly: number | null;
  food_monthly: number | null;
  currency: string | null;
} | null;

type PracticalInfo = {
  climate: string | null;
  security: string | null;
  emergency_numbers: string | null;
  student_tips: string | null;
} | null;

export function CountryDetail({
  country,
  embassies,
  visas,
  universities,
  costOfLiving,
  practicalInfo,
}: {
  country: Country;
  embassies: Embassy[];
  visas: Visa[];
  universities: University[];
  costOfLiving: CostOfLiving;
  practicalInfo: PracticalInfo;
}) {
  const router = useRouter();

  const infoRows = [
    { label: "Capitale", value: country.capital, icon: Landmark, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Devise", value: country.currency, icon: Coins, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Langue(s)", value: country.official_languages, icon: Languages, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Fuseau horaire", value: country.timezone, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Coût de la vie", value: country.cost_of_living_level, icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
  ].filter((r) => r.value);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 truncate">
            {country.name}
          </h1>
        </div>

        {/* Hero */}
        <div className="mx-5 mb-5 rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl shrink-0">
              {country.flag_url ?? <Globe2 className="w-7 h-7 text-blue-600" />}
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">
                {country.name}
              </div>
              {country.continent && (
                <div className="text-[12px] text-slate-400">{country.continent}</div>
              )}
            </div>
          </div>
          {country.description && (
            <p className="text-[13px] text-slate-500 mt-3 leading-relaxed">
              {country.description}
            </p>
          )}
        </div>

        {/* Infos générales */}
        {infoRows.length > 0 && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">
              Informations générales
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {infoRows.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.label}
                    className="bg-white rounded-2xl shadow-sm p-3.5 flex flex-col gap-2"
                  >
                    <div className={`w-8 h-8 rounded-lg ${r.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${r.color}`} />
                    </div>
                    <div>
                      <div className="text-[10.5px] text-slate-400">{r.label}</div>
                      <div className="text-[13px] font-bold text-slate-900 leading-tight mt-0.5">
                        {r.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Conditions d'entrée */}
        {country.entry_conditions && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">
              Conditions d&apos;entrée
            </h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 text-[13px] text-slate-600 leading-relaxed">
              {country.entry_conditions}
            </div>
          </div>
        )}

        {/* Visas */}
        {visas.length > 0 && (
          <div className="px-5 mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-bold text-slate-900 text-[15px]">
                Visas disponibles
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {visas.map((v) => (
                <Link
                  key={v.id}
                  href={`/visas/${v.id}`}
                  className="flex flex-col bg-white rounded-2xl shadow-sm p-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mb-2">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-[12.5px] font-semibold text-slate-900 leading-tight line-clamp-2 min-h-[30px]">
                    {v.name}
                  </div>
                  <div className="text-[10.5px] text-slate-400 mt-1">
                    {v.processing_days ? `${v.processing_days} jours` : ""}
                  </div>
                  {v.official_fee && (
                    <span className="text-[12px] font-bold text-slate-900 mt-2 pt-2 border-t border-slate-100">
                      {v.official_fee.toLocaleString("fr-FR")} {v.currency}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Universités */}
        {universities.length > 0 && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">
              Universités
            </h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {universities.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {u.name}
                    </div>
                    {u.city && (
                      <div className="text-[11px] text-slate-400">{u.city}</div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coût de la vie */}
        {costOfLiving?.estimated_total_monthly && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">
              Coût de la vie estimé
            </h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  {costOfLiving.estimated_total_monthly} {costOfLiving.currency}
                  <span className="text-[12px] font-medium text-slate-400"> /mois</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ambassades */}
        {embassies.length > 0 && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">
              Ambassades / consulats
            </h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {embassies.map((e) => (
                <div key={e.id} className="flex items-start gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-900">
                      {e.name}
                    </div>
                    {e.address && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {e.address}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      {e.phone && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Phone className="w-3 h-3" /> {e.phone}
                        </span>
                      )}
                      {e.email && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Mail className="w-3 h-3" /> {e.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Infos pratiques */}
        {practicalInfo && (practicalInfo.climate || practicalInfo.student_tips) && (
          <div className="px-5 mb-5">
            <h2 className="font-bold text-slate-900 text-[15px] mb-2.5">
              Infos pratiques
            </h2>
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              {practicalInfo.climate && (
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-[13px] text-slate-600">{practicalInfo.climate}</p>
                </div>
              )}
              {practicalInfo.student_tips && (
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-[13px] text-slate-600">
                    {practicalInfo.student_tips}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rien du tout */}
        {visas.length === 0 &&
          universities.length === 0 &&
          embassies.length === 0 &&
          infoRows.length === 0 && (
            <div className="px-5">
              <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
                <Landmark className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                Les informations détaillées pour ce pays arrivent bientôt.
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
