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
};

const EDUCATION_LEVELS = [
  "Baccalauréat",
  "Licence / Bachelor",
  "Master",
  "Doctorat",
  "Autre",
];

export function NewApplicationForm({
  countries,
  userId,
}: {
  countries: Country[];
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loadingVisas, setLoadingVisas] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Étape 3 — informations du dossier
  const [passportNumber, setPassportNumber] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [diplomaTitle, setDiplomaTitle] = useState("");
  const [diplomaInstitution, setDiplomaInstitution] = useState("");
  const [diplomaYear, setDiplomaYear] = useState("");
  const [applicantNotes, setApplicantNotes] = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("passport_number")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (data?.passport_number) setPassportNumber(data.passport_number);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    setLoadingVisas(true);
    supabase
      .from("visas")
      .select("id, name, type, official_fee, currency, processing_days")
      .eq("country_id", selectedCountry.id)
      .not("type", "in", '("travail","business","immigration")')
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

  const handleChooseVisa = (visa: Visa) => {
    setSelectedVisa(visa);
    setStep(3);
    setError(null);
  };

  const handleSubmitDossier = async () => {
    if (!selectedVisa) return;
    if (!passportNumber.trim() || !educationLevel) {
      setError("Merci de renseigner au moins le passeport et le niveau d'études.");
      return;
    }
    setSubmitting(true);
    setError(null);

    // Garde le numéro de passeport à jour sur le profil pour la prochaine fois
    await supabase
      .from("profiles")
      .update({ passport_number: passportNumber.trim() })
      .eq("id", userId);

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        visa_id: selectedVisa.id,
        status: "soumise",
        submitted_at: new Date().toISOString(),
        passport_number: passportNumber.trim(),
        education_level: educationLevel,
        diploma_title: diplomaTitle.trim() || null,
        diploma_institution: diplomaInstitution.trim() || null,
        diploma_year: diplomaYear ? parseInt(diplomaYear, 10) : null,
        applicant_notes: applicantNotes.trim() || null,
      })
      .select("id")
      .single();

    if (error || !data) {
      setError("La création de la demande a échoué. Réessaie.");
      setSubmitting(false);
      return;
    }
    router.push(`/demandes/${data.id}`);
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600";
  const labelClass = "text-[13px] font-medium text-slate-700 mb-1.5 block";

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button
            onClick={() =>
              step === 3 ? setStep(2) : step === 2 ? setStep(1) : router.back()
            }
            className="p-1 -ml-1"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {step === 1
                ? "Choisis une destination"
                : step === 2
                ? "Choisis un visa"
                : "Informations du dossier"}
            </h1>
            {step >= 2 && selectedCountry && (
              <p className="text-[11px] text-slate-400">
                {selectedCountry.flag_url} {selectedCountry.name}
                {step === 3 && selectedVisa ? ` · ${selectedVisa.name}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 mb-4 flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                s <= step ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
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
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
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
                        {v.official_fee.toLocaleString("fr-FR")} {v.currency ?? ""}
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="px-5">
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
              <div>
                <label className={labelClass}>Numéro de passeport *</label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="Ex : 123456789"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Niveau d&apos;études *</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Sélectionne un niveau</option>
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Dernier diplôme obtenu</label>
                <input
                  type="text"
                  value={diplomaTitle}
                  onChange={(e) => setDiplomaTitle(e.target.value)}
                  placeholder="Ex : Licence en Informatique"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Établissement d&apos;obtention</label>
                <input
                  type="text"
                  value={diplomaInstitution}
                  onChange={(e) => setDiplomaInstitution(e.target.value)}
                  placeholder="Ex : Université de Yaoundé I"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Année d&apos;obtention</label>
                <input
                  type="number"
                  value={diplomaYear}
                  onChange={(e) => setDiplomaYear(e.target.value)}
                  placeholder="Ex : 2023"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Précisions supplémentaires{" "}
                  <span className="text-slate-400 font-normal">(facultatif)</span>
                </label>
                <textarea
                  value={applicantNotes}
                  onChange={(e) => setApplicantNotes(e.target.value)}
                  rows={3}
                  placeholder="Toute information utile pour ton dossier..."
                  className={inputClass}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Tu pourras ajouter tes documents (photocopie de passeport, diplômes...)
                juste après avoir créé ta demande.
              </p>

              <button
                onClick={handleSubmitDossier}
                disabled={submitting}
                className="w-full bg-blue-600 text-white text-sm font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Création en cours...
                  </>
                ) : (
                  "Créer ma demande"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
