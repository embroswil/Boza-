"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Program = {
  id: string;
  name: string;
  level: string | null;
  universities: {
    name: string;
    countries: { name: string; flag_url: string | null } | null;
  } | null;
};

const EDUCATION_LEVELS = ["Baccalauréat", "Licence / Bachelor", "Master", "Doctorat", "Autre"];
const LANGUAGE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const GENDERS = ["Masculin", "Féminin", "Autre"];
const FINANCIAL_OPTIONS = ["Oui", "Non", "Partiellement"];

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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600";
  const labelClass = "text-[13px] font-medium text-slate-700 mb-1.5 block";

  const handleSubmit = async () => {
    if (!dateOfBirth || !gender || !educationLevel || !motivationLetter.trim()) {
      setError("Merci de remplir au moins la date de naissance, le genre, le niveau d'études et la lettre de motivation.");
      return;
    }
    if (motivationLetter.trim().length < 50) {
      setError("Ta lettre de motivation est un peu courte — développe un peu plus ton projet.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        study_program_id: program.id,
        application_kind: "admission",
        status: "soumise",
        submitted_at: new Date().toISOString(),
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

        <div className="px-5">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
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
              <label className={labelClass}>Niveau de langue (anglais/français)</label>
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

            <p className="text-[11px] text-slate-400">
              Tu pourras ajouter tes documents (diplômes, relevés de notes,
              CV...) juste après avoir créé ta demande.
            </p>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 text-white text-sm font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Création en cours...
                </>
              ) : (
                "Envoyer ma demande d'admission"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
