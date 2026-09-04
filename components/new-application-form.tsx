"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe2,
  Loader2,
  ChevronRight,
  Upload,
  CheckCircle2,
  Circle,
  FileText,
  X,
  CreditCard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Country = { id: string; name: string; flag_url: string | null };
type Visa = {
  id: string;
  name: string;
  type: string;
  official_fee: number | null;
  service_fee: number | null;
  currency: string | null;
  processing_days: number | null;
};
type Requirement = {
  id: string;
  document_name: string;
  is_required: boolean | null;
  description: string | null;
};
type ProgramContext = {
  id: string;
  name: string;
  universities: {
    name: string;
    countries: { id: string; name: string; flag_url: string | null } | null;
  } | null;
} | null;

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
  initialCountry = null,
  initialVisa = null,
  initialProgram = null,
}: {
  countries: Country[];
  userId: string;
  initialCountry?: Country | null;
  initialVisa?: (Visa & { countries: Country | null }) | null;
  initialProgram?: ProgramContext;
}) {
  const router = useRouter();
  const supabase = createClient();

  // Détermine l'étape de départ : si un visa ou un programme est déjà
  // choisi (venant de la fiche programme/visa), on saute directement aux
  // étapes déjà résolues au lieu de tout redemander depuis zéro.
  const startingCountry: Country | null =
    initialVisa?.countries ?? initialProgram?.universities?.countries ?? initialCountry;
  const startingStep: 1 | 2 | 3 = initialVisa ? 3 : startingCountry ? 2 : 1;

  const [step, setStep] = useState<1 | 2 | 3>(startingStep);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(startingCountry);
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(initialVisa);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loadingVisas, setLoadingVisas] = useState(false);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Étape 3 — informations du dossier
  const [passportNumber, setPassportNumber] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [diplomaTitle, setDiplomaTitle] = useState("");
  const [diplomaInstitution, setDiplomaInstitution] = useState("");
  const [diplomaYear, setDiplomaYear] = useState("");
  const [applicantNotes, setApplicantNotes] = useState("");

  // Étape 3 — documents à téléverser (un fichier par exigence du visa)
  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({});
  const [extraFiles, setExtraFiles] = useState<File[]>([]);

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

  // Charge les visas du pays choisi (étape 1 -> 2), sauf si un visa précis
  // a déjà été fourni au départ.
  useEffect(() => {
    if (!selectedCountry || initialVisa) return;
    setLoadingVisas(true);
    supabase
      .from("visas")
      .select("id, name, type, official_fee, service_fee, currency, processing_days")
      .eq("country_id", selectedCountry.id)
      .not("type", "in", '("travail","business","immigration")')
      .then(({ data, error }) => {
        if (error) setError("Impossible de charger les visas de ce pays.");
        const list = data ?? [];
        setVisas(list);
        setLoadingVisas(false);
        // Venant d'un programme d'études : s'il n'existe qu'un seul visa
        // "études" pour ce pays, on le sélectionne automatiquement pour
        // éviter une étape inutile.
        if (initialProgram) {
          const etudesVisas = list.filter((v) => v.type === "etudes");
          if (etudesVisas.length === 1) {
            setSelectedVisa(etudesVisas[0]);
            setStep(3);
          }
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  // Charge la liste des documents requis dès qu'un visa est connu.
  useEffect(() => {
    if (!selectedVisa) return;
    setLoadingRequirements(true);
    supabase
      .from("visa_documents")
      .select("id, document_name, is_required, description")
      .eq("visa_id", selectedVisa.id)
      .then(({ data }) => {
        setRequirements(data ?? []);
        setLoadingRequirements(false);
      });
  }, [selectedVisa, supabase]);

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

  const missingRequiredDocs = requirements.filter(
    (r) => r.is_required && !docFiles[r.id]
  );

  const handleSubmitAndPay = async () => {
    if (!passportNumber.trim() || !educationLevel) {
      setError("Merci de renseigner au moins le passeport et le niveau d'études.");
      return;
    }
    if (missingRequiredDocs.length > 0) {
      setError(
        `Merci de téléverser : ${missingRequiredDocs.map((d) => d.document_name).join(", ")}.`
      );
      return;
    }
    setSubmitting(true);
    setError(null);

    // Garde le numéro de passeport à jour sur le profil pour la prochaine fois
    await supabase
      .from("profiles")
      .update({ passport_number: passportNumber.trim() })
      .eq("id", userId);

    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        visa_id: selectedVisa?.id ?? null,
        study_program_id: initialProgram?.id ?? null,
        status: "brouillon",
        passport_number: passportNumber.trim(),
        education_level: educationLevel,
        diploma_title: diplomaTitle.trim() || null,
        diploma_institution: diplomaInstitution.trim() || null,
        diploma_year: diplomaYear ? parseInt(diplomaYear, 10) : null,
        applicant_notes: applicantNotes.trim() || null,
      })
      .select("id")
      .single();

    if (appError || !application) {
      setError("La création de la demande a échoué. Réessaie.");
      setSubmitting(false);
      return;
    }

    // Téléverse chaque document dans le bucket "documents" et enregistre
    // une ligne application_documents par fichier.
    const filesToUpload: { file: File; docType: string }[] = [
      ...requirements
        .filter((r) => docFiles[r.id])
        .map((r) => ({ file: docFiles[r.id] as File, docType: r.document_name })),
      ...extraFiles.map((f) => ({ file: f, docType: "Autre document" })),
    ];

    for (const { file, docType } of filesToUpload) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${userId}/applications/${application.id}/${Date.now()}_${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file);
      if (!uploadError) {
        await supabase.from("application_documents").insert({
          application_id: application.id,
          document_type: docType,
          file_url: path,
          status: "en_attente",
        });
      }
    }

    // Crée le paiement en attente (frais officiels + frais de service du visa)
    const amount = (selectedVisa?.official_fee ?? 0) + (selectedVisa?.service_fee ?? 0);
    await supabase.from("payments").insert({
      application_id: application.id,
      amount,
      currency: selectedVisa?.currency ?? "XAF",
      status: "en_attente",
    });

    router.push(`/demandes/${application.id}/payer`);
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600";
  const labelClass = "text-[13px] font-medium text-slate-700 mb-1.5 block";

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button
            onClick={() =>
              step === 3 && !initialVisa
                ? setStep(2)
                : step === 2 && !startingCountry
                ? setStep(1)
                : router.back()
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
                : "Finalise ta demande"}
            </h1>
            {step >= 2 && selectedCountry && (
              <p className="text-[11px] text-slate-400">
                {selectedCountry.flag_url} {selectedCountry.name}
                {initialProgram ? ` · ${initialProgram.name}` : ""}
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
          <div className="px-5 flex flex-col gap-5">
            {/* Informations du dossier */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
              <h2 className="text-[13px] font-bold text-slate-900">
                Informations du dossier
              </h2>
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
            </div>

            {/* Documents requis */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
              <h2 className="text-[13px] font-bold text-slate-900">
                Documents à téléverser
              </h2>

              {loadingRequirements ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                </div>
              ) : requirements.length === 0 ? (
                <p className="text-[12px] text-slate-400">
                  Aucun document spécifique requis pour ce visa — tu peux tout de
                  même en ajouter ci-dessous si besoin.
                </p>
              ) : (
                <div className="flex flex-col divide-y divide-slate-100">
                  {requirements.map((r) => {
                    const file = docFiles[r.id];
                    return (
                      <div key={r.id} className="py-3 flex items-start gap-3">
                        {file ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-slate-900">
                            {r.document_name}
                            {!r.is_required && (
                              <span className="text-slate-400 font-normal"> (optionnel)</span>
                            )}
                          </div>
                          {r.description && (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {r.description}
                            </div>
                          )}
                          {file ? (
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[11px] text-emerald-700 truncate max-w-[160px]">
                                {file.name}
                              </span>
                              <button
                                onClick={() =>
                                  setDocFiles((prev) => ({ ...prev, [r.id]: null }))
                                }
                                className="text-slate-400"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <label className="inline-flex items-center gap-1.5 mt-1.5 text-[11.5px] font-semibold text-blue-600 cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              Ajouter un fichier
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0] ?? null;
                                  setDocFiles((prev) => ({ ...prev, [r.id]: f }));
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Documents additionnels libres */}
              <div className="pt-1">
                {extraFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="flex-1 text-[11.5px] text-slate-600 truncate">
                      {f.name}
                    </span>
                    <button
                      onClick={() => setExtraFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <label className="inline-flex items-center gap-1.5 mt-1.5 text-[11.5px] font-semibold text-blue-600 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  Ajouter un autre document
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setExtraFiles((prev) => [...prev, f]);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Récap frais + bouton payer */}
            {selectedVisa && (
              <div className="bg-blue-50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-[12.5px] text-blue-700 font-medium">
                  Total à payer
                </span>
                <span className="text-[15px] font-extrabold text-blue-800">
                  {(
                    (selectedVisa.official_fee ?? 0) + (selectedVisa.service_fee ?? 0)
                  ).toLocaleString("fr-FR")}{" "}
                  {selectedVisa.currency ?? ""}
                </span>
              </div>
            )}

            <button
              onClick={handleSubmitAndPay}
              disabled={submitting}
              className="w-full bg-blue-600 text-white text-sm font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Préparation du paiement...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Payer
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
