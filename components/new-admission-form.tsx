"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  Loader2,
  Upload,
  CheckCircle2,
  Circle,
  FileText,
  X,
  CreditCard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Program = {
  id: string;
  name: string;
  level: string | null;
  currency?: string | null;
  required_documents?: string | null;
  universities: {
    name: string;
    application_fee?: number | null;
    countries: { name: string; flag_url: string | null } | null;
  } | null;
};

const EDUCATION_LEVELS = ["Baccalauréat", "Licence / Bachelor", "Master", "Doctorat", "Autre"];
const LANGUAGE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const GENDERS = ["Masculin", "Féminin", "Autre"];
const FINANCIAL_OPTIONS = ["Oui", "Non", "Partiellement"];

// Documents systématiquement demandés pour un dossier d'admission.
const REQUIRED_DOCS = [
  { id: "diplome", label: "Diplôme (dernier obtenu)", required: true },
  {
    id: "langue",
    label: "Attestation de maîtrise de la langue (anglais ou allemand)",
    required: true,
  },
  { id: "identite", label: "Passeport ou pièce d'identité", required: true },
  { id: "cv", label: "CV", required: false },
];

export function NewAdmissionForm({
  program,
  userId,
}: {
  program: Program;
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [diplomaTitle, setDiplomaTitle] = useState("");
  const [diplomaInstitution, setDiplomaInstitution] = useState("");
  const [diplomaYear, setDiplomaYear] = useState("");
  const [languageProficiency, setLanguageProficiency] = useState("");
  const [motivationLetter, setMotivationLetter] = useState("");
  const [financialSupport, setFinancialSupport] = useState("");
  const [intendedStartDate, setIntendedStartDate] = useState("");
  const [healthConditions, setHealthConditions] = useState("");

  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({});
  const [extraFiles, setExtraFiles] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600";
  const labelClass = "text-[13px] font-medium text-slate-700 mb-1.5 block";

  const missingRequiredDocs = REQUIRED_DOCS.filter((d) => d.required && !docFiles[d.id]);
  const applicationFee = program.universities?.application_fee ?? 0;
  const currency = "XAF";

  const handleSubmit = async () => {
    if (!dateOfBirth || !gender || !educationLevel || !motivationLetter.trim()) {
      setError(
        "Merci de remplir au moins la date de naissance, le genre, le niveau d'études et la lettre de motivation."
      );
      return;
    }
    if (motivationLetter.trim().length < 50) {
      setError("Ta lettre de motivation est un peu courte — développe un peu plus ton projet.");
      return;
    }
    if (missingRequiredDocs.length > 0) {
      setError(
        `Merci de téléverser : ${missingRequiredDocs.map((d) => d.label).join(", ")}.`
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        study_program_id: program.id,
        application_kind: "admission",
        status: "brouillon",
        date_of_birth: dateOfBirth,
        gender,
        education_level: educationLevel,
        diploma_title: diplomaTitle.trim() || null,
        diploma_institution: diplomaInstitution.trim() || null,
        diploma_year: diplomaYear ? parseInt(diplomaYear, 10) : null,
        language_proficiency: languageProficiency || null,
        motivation_letter: motivationLetter.trim(),
        financial_support: financialSupport || null,
        intended_start_date: intendedStartDate || null,
        health_conditions: healthConditions.trim() || null,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError("La création de la demande a échoué. Réessaie.");
      setSubmitting(false);
      return;
    }

    // Téléverse les documents dans le bucket "documents"
    const filesToUpload: { file: File; docType: string }[] = [
      ...REQUIRED_DOCS.filter((d) => docFiles[d.id]).map((d) => ({
        file: docFiles[d.id] as File,
        docType: d.label,
      })),
      ...extraFiles.map((f) => ({ file: f, docType: "Autre document" })),
    ];

    for (const { file, docType } of filesToUpload) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${userId}/applications/${data.id}/${Date.now()}_${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file);
      if (!uploadError) {
        await supabase.from("application_documents").insert({
          application_id: data.id,
          document_type: docType,
          file_url: path,
          status: "en_attente",
        });
      }
    }

    // Frais de dossier de l'université, en attente de paiement
    await supabase.from("payments").insert({
      application_id: data.id,
      amount: applicationFee,
      currency,
      status: "en_attente",
    });

    router.push(`/demandes/${data.id}/payer`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Demande d&apos;admission</h1>
            <p className="text-[11px] text-slate-400">
              {program.universities?.countries?.flag_url} {program.name}
            </p>
          </div>
        </div>

        <div className="mx-5 mb-4 bg-blue-50 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-[12px] text-blue-700 leading-snug">
            La demande de visa se fera dans un second temps, une fois ton
            admission confirmée.
          </div>
        </div>

        {error && (
          <div className="mx-5 mb-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="px-5 flex flex-col gap-5">
          {/* Informations du dossier */}
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
            <h2 className="text-[13px] font-bold text-slate-900">Informations du dossier</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Date de naissance *</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Genre *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Choisir</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Niveau d&apos;études actuel *</label>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Établissement</label>
                <input
                  type="text"
                  value={diplomaInstitution}
                  onChange={(e) => setDiplomaInstitution(e.target.value)}
                  placeholder="Université..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Année</label>
                <input
                  type="number"
                  value={diplomaYear}
                  onChange={(e) => setDiplomaYear(e.target.value)}
                  placeholder="2023"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Niveau de langue (anglais/allemand)</label>
              <select
                value={languageProficiency}
                onChange={(e) => setLanguageProficiency(e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionne un niveau</option>
                {LANGUAGE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Lettre de motivation *</label>
              <textarea
                value={motivationLetter}
                onChange={(e) => setMotivationLetter(e.target.value)}
                rows={5}
                placeholder="Pourquoi ce programme ? Explique ton projet d'études..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Besoin d&apos;aide financière ?</label>
              <select
                value={financialSupport}
                onChange={(e) => setFinancialSupport(e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner</option>
                {FINANCIAL_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Date de début souhaitée</label>
              <input
                type="date"
                value={intendedStartDate}
                onChange={(e) => setIntendedStartDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Conditions de santé particulières{" "}
                <span className="text-slate-400 font-normal">(facultatif)</span>
              </label>
              <textarea
                value={healthConditions}
                onChange={(e) => setHealthConditions(e.target.value)}
                rows={2}
                placeholder="Décrire si pertinent..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Documents requis */}
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
            <h2 className="text-[13px] font-bold text-slate-900">Documents à téléverser</h2>

            {program.required_documents && (
              <p className="text-[11.5px] text-slate-500 bg-slate-50 rounded-xl p-3">
                {program.required_documents}
              </p>
            )}

            <div className="flex flex-col divide-y divide-slate-100">
              {REQUIRED_DOCS.map((d) => {
                const file = docFiles[d.id];
                return (
                  <div key={d.id} className="py-3 flex items-start gap-3">
                    {file ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-slate-900">
                        {d.label}
                        {!d.required && (
                          <span className="text-slate-400 font-normal"> (optionnel)</span>
                        )}
                      </div>
                      {file ? (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-emerald-700 truncate max-w-[180px]">
                            {file.name}
                          </span>
                          <button
                            onClick={() => setDocFiles((prev) => ({ ...prev, [d.id]: null }))}
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
                              setDocFiles((prev) => ({ ...prev, [d.id]: f }));
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-1">
              {extraFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="flex-1 text-[11.5px] text-slate-600 truncate">{f.name}</span>
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
          <div className="bg-blue-50 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-[12.5px] text-blue-700 font-medium">
              Frais de dossier
            </span>
            <span className="text-[15px] font-extrabold text-blue-800">
              {applicationFee.toLocaleString("fr-FR")} {currency}
            </span>
          </div>

          <button
            onClick={handleSubmit}
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
      </div>
    </div>
  );
}
