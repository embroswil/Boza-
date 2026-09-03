"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Globe2,
  FileText,
  CreditCard,
  CalendarClock,
  Loader2,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Application = {
  id: string;
  status: string;
  submitted_at: string | null;
  created_at: string;
  passport_number: string | null;
  education_level: string | null;
  diploma_title: string | null;
  diploma_institution: string | null;
  diploma_year: number | null;
  applicant_notes: string | null;
  date_of_birth: string | null;
  gender: string | null;
  language_proficiency: string | null;
  motivation_letter: string | null;
  financial_support: string | null;
  intended_start_date: string | null;
  health_conditions: string | null;
  visas: {
    name: string;
    type: string;
    official_fee: number | null;
    currency: string | null;
    processing_days: number | null;
    countries: { name: string; flag_url: string | null } | null;
  } | null;
  programs: {
    name: string;
    universities: {
      name: string;
      countries: { name: string; flag_url: string | null } | null;
    } | null;
  } | null;
  application_documents: {
    id: string;
    document_type: string;
    status: string;
    uploaded_at: string;
  }[];
  payments: {
    id: string;
    amount: number;
    currency: string | null;
    status: string;
    paid_at: string | null;
  }[];
  appointments: {
    id: string;
    appointment_date: string;
    status: string;
    embassies: { name: string; city: string | null } | null;
  }[];
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  brouillon: { label: "Brouillon", className: "bg-slate-100 text-slate-500" },
  soumise: { label: "Soumise", className: "bg-blue-50 text-blue-600" },
  en_cours: { label: "En cours", className: "bg-amber-50 text-amber-600" },
  documents_manquants: {
    label: "Documents manquants",
    className: "bg-orange-50 text-orange-600",
  },
  approuvee: { label: "Approuvée", className: "bg-emerald-50 text-emerald-600" },
  refusee: { label: "Refusée", className: "bg-red-50 text-red-600" },
  annulee: { label: "Annulée", className: "bg-slate-100 text-slate-400" },
};

const DOC_STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  valide: "Validé",
  rejete: "Rejeté",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationDetail({ application }: { application: Application }) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState(application.status);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const country =
    application.visas?.countries ?? application.programs?.universities?.countries ?? null;
  const title = application.visas?.name ?? application.programs?.name ?? "Demande";
  const subtitle =
    application.programs?.universities?.name ?? country?.name ?? "";
  const statusInfo = STATUS_STYLES[status] ?? STATUS_STYLES.brouillon;
  const pendingPayment = application.payments.find((p) => p.status === "en_attente");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const { error } = await supabase
      .from("applications")
      .update({ status: "soumise", submitted_at: new Date().toISOString() })
      .eq("id", application.id);

    if (error) {
      setError("La soumission a échoué. Réessaie.");
    } else {
      setStatus("soumise");
      router.refresh();
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Détail de la demande</h1>
        </div>

        {/* Summary card */}
        <div className="px-5 mb-5">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-xl">
              {country?.flag_url ?? <Globe2 className="w-6 h-6 text-blue-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-slate-900 truncate">{title}</div>
              <div className="text-[11px] text-slate-400 truncate">{subtitle}</div>
              <span
                className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.className}`}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-5 mb-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Informations du dossier */}
        {(application.passport_number || application.education_level) && (
          <div className="px-5 mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 mb-2">
              Informations du dossier
            </h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {application.passport_number && (
                <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-slate-400">Numéro de passeport</span>
                  <span className="font-semibold text-slate-900">
                    {application.passport_number}
                  </span>
                </div>
              )}
              {application.education_level && (
                <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-slate-400">Niveau d&apos;études</span>
                  <span className="font-semibold text-slate-900">
                    {application.education_level}
                  </span>
                </div>
              )}
              {application.diploma_title && (
                <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-slate-400">Dernier diplôme</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {application.diploma_title}
                  </span>
                </div>
              )}
              {application.diploma_institution && (
                <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-slate-400">Établissement</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {application.diploma_institution}
                  </span>
                </div>
              )}
              {application.diploma_year && (
                <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-slate-400">Année d&apos;obtention</span>
                  <span className="font-semibold text-slate-900">
                    {application.diploma_year}
                  </span>
                </div>
              )}
              {application.date_of_birth && (
                <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-slate-400">Date de naissance</span>
                  <span className="font-semibold text-slate-900">
                    {application.date_of_birth}
                  </span>
                </div>
              )}
              {application.language_proficiency && (
                <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-slate-400">Niveau de langue</span>
                  <span className="font-semibold text-slate-900">
                    {application.language_proficiency}
                  </span>
                </div>
              )}
              {application.intended_start_date && (
                <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-slate-400">Début souhaité</span>
                  <span className="font-semibold text-slate-900">
                    {application.intended_start_date}
                  </span>
                </div>
              )}
              {application.motivation_letter && (
                <div className="px-4 py-3 text-[13px]">
                  <span className="text-slate-400 block mb-1">Lettre de motivation</span>
                  <span className="text-slate-700">{application.motivation_letter}</span>
                </div>
              )}
              {application.applicant_notes && (
                <div className="px-4 py-3 text-[13px]">
                  <span className="text-slate-400 block mb-1">Précisions</span>
                  <span className="text-slate-700">{application.applicant_notes}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visa info */}
        {application.visas && (
          <div className="px-5 mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 mb-2">Informations visa</h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                <span className="text-slate-400">Frais officiels</span>
                <span className="font-semibold text-slate-900">
                  {application.visas.official_fee != null
                    ? `${application.visas.official_fee} ${application.visas.currency ?? ""}`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-[13px]">
                <span className="text-slate-400">Délai de traitement</span>
                <span className="font-semibold text-slate-900">
                  {application.visas.processing_days
                    ? `${application.visas.processing_days} jours`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="px-5 mb-5">
          <h2 className="text-[13px] font-bold text-slate-900 mb-2">Documents</h2>
          {application.application_documents.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center text-[12.5px] text-slate-400 shadow-sm">
              Aucun document lié pour l&apos;instant.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {application.application_documents.map((d) => (
                <div key={d.id} className="flex items-center gap-3 px-4 py-3">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="flex-1 text-[13px] text-slate-900 truncate">
                    {d.document_type}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {DOC_STATUS_LABELS[d.status] ?? d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="px-5 mb-5">
          <h2 className="text-[13px] font-bold text-slate-900 mb-2">Paiement</h2>
          {application.payments.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center text-[12.5px] text-slate-400 shadow-sm">
              Aucun paiement enregistré.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {application.payments.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="flex-1 text-[13px] text-slate-900">
                    {p.amount} {p.currency ?? ""}
                  </span>
                  <span className="text-[11px] text-slate-400 capitalize">{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointment */}
        <div className="px-5 mb-6">
          <h2 className="text-[13px] font-bold text-slate-900 mb-2">Rendez-vous</h2>
          {application.appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center text-[12.5px] text-slate-400 shadow-sm">
              Aucun rendez-vous planifié.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {application.appointments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <CalendarClock className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-slate-900">
                      {formatDate(a.appointment_date)}
                    </div>
                    {a.embassies && (
                      <div className="text-[11px] text-slate-400 truncate">
                        {a.embassies.name} — {a.embassies.city}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 capitalize">{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payer */}
        {pendingPayment && (
          <div className="px-5 mb-3">
            <Link
              href={`/demandes/${application.id}/payer`}
              className="w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Payer {pendingPayment.amount.toLocaleString("fr-FR")}{" "}
              {pendingPayment.currency ?? ""}
            </Link>
          </div>
        )}

        {/* Submit button (anciennes demandes sans paiement associé) */}
        {status === "brouillon" && application.payments.length === 0 && (
          <div className="px-5">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Soumettre la demande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
