"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FieldDef = {
  key: string;
  label: string;
  type: "text" | "date" | "tel" | "email" | "textarea" | "select" | "number";
  options?: string[];
};

const EMPLOYMENT_STATUS_OPTIONS = [
  "Salarié(e)",
  "Entrepreneur(e)",
  "Étudiant(e)",
  "Sans emploi",
  "Autre",
];
const TRAVEL_MOTIVE_OPTIONS = ["Tourisme", "Visite", "Autre"];
const FUNDS_OPTIONS = [
  "Oui",
  "Non",
  "Je souhaite être accompagné(e) pour l'évaluation de mon dossier",
];
const BUDGET_OPTIONS = ["Moins de 45 € / jour", "45 € ou plus / jour", "Je ne sais pas"];
const EDUCATION_LEVELS = ["Baccalauréat", "Licence / Bachelor", "Master", "Doctorat", "Autre"];
const GENDER_OPTIONS = ["Homme", "Femme"];

// Registre de tous les champs possibles — on n'affiche que ceux qui manquent.
const FIELD_REGISTRY: Record<string, FieldDef> = {
  contact_email: { key: "contact_email", label: "Email pour cette demande", type: "email" },
  last_name: { key: "last_name", label: "Nom(s)", type: "text" },
  first_name: { key: "first_name", label: "Prénom(s)", type: "text" },
  date_of_birth: { key: "date_of_birth", label: "Date de naissance", type: "date" },
  gender: { key: "gender", label: "Genre", type: "select", options: GENDER_OPTIONS },
  nationality: { key: "nationality", label: "Nationalité", type: "text" },
  residence_country: { key: "residence_country", label: "Pays de résidence", type: "text" },
  residence_city: { key: "residence_city", label: "Ville de résidence", type: "text" },
  full_address: { key: "full_address", label: "Adresse complète", type: "textarea" },
  contact_phone: { key: "contact_phone", label: "Téléphone / WhatsApp", type: "tel" },
  emergency_contact: {
    key: "emergency_contact",
    label: "Contact en cas de besoin",
    type: "text",
  },
  profession: { key: "profession", label: "Emploi / profession", type: "text" },
  employer_name: { key: "employer_name", label: "Entreprise / établissement", type: "text" },
  employment_status: {
    key: "employment_status",
    label: "Situation professionnelle",
    type: "select",
    options: EMPLOYMENT_STATUS_OPTIONS,
  },
  passport_number: { key: "passport_number", label: "Numéro de passeport", type: "text" },
  passport_issue_date: {
    key: "passport_issue_date",
    label: "Date de délivrance du passeport",
    type: "date",
  },
  passport_expiry_date: {
    key: "passport_expiry_date",
    label: "Date d'expiration du passeport",
    type: "date",
  },
  passport_issuing_country: {
    key: "passport_issuing_country",
    label: "Pays / autorité de délivrance",
    type: "text",
  },
  travel_date: { key: "travel_date", label: "Date prévue du voyage", type: "date" },
  travel_duration: { key: "travel_duration", label: "Durée prévue du séjour", type: "text" },
  travel_cities: { key: "travel_cities", label: "Ville(s) de destination", type: "text" },
  travel_motive: {
    key: "travel_motive",
    label: "Motif du voyage",
    type: "select",
    options: TRAVEL_MOTIVE_OPTIONS,
  },
  has_sufficient_funds: {
    key: "has_sufficient_funds",
    label: "Ressources financières suffisantes ?",
    type: "select",
    options: FUNDS_OPTIONS,
  },
  daily_budget: {
    key: "daily_budget",
    label: "Budget disponible estimé",
    type: "select",
    options: BUDGET_OPTIONS,
  },
  education_level: {
    key: "education_level",
    label: "Niveau d'études",
    type: "select",
    options: EDUCATION_LEVELS,
  },
  motivation_letter: { key: "motivation_letter", label: "Lettre de motivation", type: "textarea" },
};

// Champs requis selon le type de dossier.
export function getRequiredFieldKeys(kind: "tourisme" | "etudes" | "admission"): string[] {
  if (kind === "tourisme") {
    return [
      "contact_email",
      "last_name",
      "first_name",
      "date_of_birth",
      "nationality",
      "residence_country",
      "residence_city",
      "full_address",
      "contact_phone",
      "profession",
      "employment_status",
      "passport_number",
      "passport_issue_date",
      "passport_expiry_date",
      "passport_issuing_country",
      "travel_date",
      "travel_duration",
      "travel_cities",
      "travel_motive",
      "has_sufficient_funds",
      "daily_budget",
    ];
  }
  if (kind === "admission") {
    return [
      "contact_email",
      "date_of_birth",
      "gender",
      "nationality",
      "residence_country",
      "residence_city",
      "full_address",
      "contact_phone",
      "passport_number",
      "passport_issue_date",
      "passport_expiry_date",
      "passport_issuing_country",
      "education_level",
      "motivation_letter",
    ];
  }
  // etudes (visa) — alignés sur le tourisme : un dossier de visa a besoin
  // des mêmes informations de base (identité, passeport, résidence), moins
  // les champs propres au séjour touristique (durée, villes, budget/jour).
  return [
    "contact_email",
    "last_name",
    "first_name",
    "date_of_birth",
    "nationality",
    "residence_country",
    "residence_city",
    "full_address",
    "contact_phone",
    "passport_number",
    "passport_issue_date",
    "passport_expiry_date",
    "passport_issuing_country",
    "education_level",
  ];
}

export function getMissingFields(
  application: Record<string, unknown>,
  kind: "tourisme" | "etudes" | "admission"
): FieldDef[] {
  return getRequiredFieldKeys(kind)
    .filter((key) => {
      const value = application[key];
      return value === null || value === undefined || value === "";
    })
    .map((key) => FIELD_REGISTRY[key])
    .filter(Boolean);
}

export function CompleteApplicationForm({
  applicationId,
  missingFields,
  onDone,
}: {
  applicationId: string;
  missingFields: FieldDef[];
  onDone: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lecture directe des valeurs du formulaire (FormData) plutôt que du
    // state React : certains navigateurs (Safari notamment) remplissent les
    // champs automatiquement sans déclencher onChange, ce qui faisait que
    // le state restait vide alors que le champ affichait bien une valeur.
    const formData = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    missingFields.forEach((f) => {
      values[f.key] = String(formData.get(f.key) ?? "").trim();
    });

    const missing = missingFields.filter((f) => !values[f.key]);
    if (missing.length > 0) {
      setError(`Merci de compléter : ${missing.map((f) => f.label).join(", ")}.`);
      return;
    }
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("applications")
      .update(values)
      .eq("id", applicationId);

    setSubmitting(false);
    if (updateError) {
      setError("Impossible d'enregistrer — réessaie.");
      return;
    }
    onDone();
  };

  const inputClass =
    "w-full border border-slate-700 bg-[#15151F] text-white rounded-xl px-3 py-2.5 text-[13px] outline-none";
  const labelClass = "text-[11.5px] font-semibold text-slate-300 mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="bg-[#1B1B27] rounded-2xl p-4 flex flex-col gap-3">
      <p className="text-[12.5px] text-slate-400 leading-relaxed mb-1">
        Il manque encore quelques informations avant de pouvoir payer et finaliser ta demande.
      </p>
      {missingFields.map((f) => (
        <div key={f.key}>
          <label className={labelClass}>{f.label} *</label>
          {f.type === "select" ? (
            <select name={f.key} defaultValue="" className={inputClass}>
              <option value="">Sélectionne une réponse</option>
              {f.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea name={f.key} rows={2} className={inputClass} />
          ) : (
            <input type={f.type} name={f.key} className={inputClass} />
          )}
        </div>
      ))}
      {error && <p className="text-[11.5px] text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white text-[13px] font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer et continuer"}
      </button>
    </form>
  );
}
