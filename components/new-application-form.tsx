"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe2, Loader2, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Country = { id: string; name: string; flag_url: string | null };
type Visa = {
  id: string;
  name: string;
  type: string;
  official_fee: number | null;
  currency: string | null;
  processing_days: number | null;
};

const VISA_TYPE_LABELS: Record<string, string> = {
  tourisme: "Tourisme",
  etudes: "Études",
  immigration: "Immigration",
};

export function NewApplicationForm({
  countries,
  userId,
}: {
  countries: Country[];
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loadingVisas, setLoadingVisas] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCountry) return;
    setLoadingVisas(true);
    supabase
      .from("visas")
      .select("id, name, type, official_fee, currency, processing_days")
      .eq("country_id", selectedCountry.id)
      .not("type", "in", '("travail","business")')
      .then(({ data, error }) => {
        if (error) setError("Impossible de charger les visas de ce pays.");
        setVisas(data ?? []);
        setLoadingVisas(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  const handleChooseCountry = (c: Country) => {
    setSelectedCountry(c);
    setStep(2);
    setError(null);
  };

  const handleChooseVisa = async (visa: Visa) => {
    setSubmitting(true);
    setError(null);
    const { data, error } = await supabase
      .from("applications")
      .insert({ user_id: userId, visa_id: visa.id, status: "brouillon" })
      .select("id")
      .single();

    if (error || !data) {
      setError("La création de la demande a échoué. Réessaie.");
      setSubmitting(false);
      return;
    }
    router.push(`/demandes/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button
            onClick={() => (step === 2 ? setStep(1) : router.back())}
            className="p-1 -ml-1"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {step === 1 ? "Choisis une destination" : "Choisis un visa"}
            </h1>
            {step === 2 && selectedCountry && (
              <p className="text-[11px] text-slate-400">
                {selectedCountry.flag_url} {selectedCountry.name}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-5 mb-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="px-5">
            {countries.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
                Aucun pays disponible pour l&apos;instant.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
                {countries.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleChooseCountry(c)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-lg">
                      {c.flag_url ?? <Globe2 className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 text-[13.5px] font-semibold text-slate-900">
                      {c.name}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="px-5">
            {loadingVisas ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
              </div>
            ) : visas.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-sm text-slate-400 shadow-sm">
                Aucun visa disponible pour ce pays pour l&apos;instant.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
                {visas.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleChooseVisa(v)}
                    disabled={submitting}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left disabled:opacity-60"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-slate-900">
                        {v.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {VISA_TYPE_LABELS[v.type] ?? v.type}
                        {v.processing_days ? ` · ${v.processing_days} jours` : ""}
                      </div>
                    </div>
                    {v.official_fee != null && (
                      <div className="text-[13px] font-bold text-slate-900 whitespace-nowrap">
                        {v.official_fee} {v.currency ?? ""}
                      </div>
                    )}
                    {submitting ? (
                      <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
