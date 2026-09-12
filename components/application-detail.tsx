"use client";

import { useRef, useState } from "react";
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
  Mail,
  Plus,
  UploadCloud,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatXAF } from "@/lib/currency";
import { VerificationCodeRequest } from "@/components/verification-code-request";

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
    service_fee: number | null;
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

const DOC_STATUS_STYLES: Record<string, { label: string; className: string }> = {
  en_attente: { label: "En cours de vérification", className: "text-amber-600" },
  valide: { label: "Validé", className: "text-emerald-600" },
  rejete: { label: "Rejeté — à renvoyer", className: "text-red-600" },
};

const STEPS = [
  { key: "soumise", label: "Soumise" },
  { key: "en_cours", label: "En cours" },
  { key: "approuvee", label: "Approuvée" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationDetail({
  application,
  verificationRequests = [],
  userId,
}: {
  application: Application;
  verificationRequests?: {
    id: string;
    portal_name: string;
    instructions: string | null;
    status: "pending" | "fulfilled" | "expired";
  }[];
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState(application.status);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [docLabel, setDocLabel] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  const country =
    application.visas?.countries ?? application.programs?.universities?.countries ?? null;
  const title = application.visas?.name ?? application.programs?.name ?? "Demande";
  const subtitle = application.programs?.universities?.name ?? country?.name ?? "";
  const statusInfo = STATUS_STYLES[status] ?? STATUS_STYLES.brouillon;
  const pendingPayment = application.payments.find((p) => p.status === "en_attente");
  const currentStepIndex = STEPS.findIndex((s) => s.key === status);

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

  const handleUpload = async (file: File) => {
    if (!docLabel.trim()) {
      setError("Précise le type de document avant d'envoyer.");
      return;
    }
    setUploading(true);
    setError(null);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/applications/${application.id}/${Date.now()}_${safeName}`;
    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);

    if (uploadError) {
      setError("L'envoi du document a échoué. Réessaie.");
      setUploading(false);
      return;
    }

    await supabase.from("application_documents").insert({
      application_id: application.id,
      document_type: docLabel.trim(),
      file_url: path,
      status: "en_attente",
    });

    setUploading(false);
    setDocLabel("");
    setShowUploadForm(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Détail de la demande</h1>
        </div>

        {/* Code de vérification requis (actif) */}
        {verificationRequests
          .filter((r) => r.status !== "expired")
          .map((r) => (
            <div key={r.id} className="px-5">
              <VerificationCodeRequest request={r} />
            </div>
          ))}

        {/* Prévenir à l'avance, tant qu'aucune demande de code n'est active */}
        {verificationRequests.filter((r) => r.status !== "expired").length === 0 && (
          <div className="px-5 mb-2">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[12px] text-blue-700 leading-relaxed">
                Pendant qu&apos;on traite ton dossier, l&apos;université/l&apos;ambassade peut
                t&apos;envoyer un code de confirmation par email. Si ça arrive, reviens ici pour
                le coller — une carte apparaîtra automatiquement à cet endroit.
              </p>
            </div>
          </div>
        )}

        {/* Hero / résumé */}
        <div className="px-5 mb-4">
          <div className="bg-white rounded-3xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                {country?.flag_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={country.flag_url}
                    alt={country.name}
                    className="w-full h-full object-cover object-left"
                  />
                ) : (
                  <Globe2 className="w-7 h-7 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-slate-900 truncate">{title}</div>
                <div className="text-[11.5px] text-slate-400 truncate">{subtitle}</div>
                <span
                  className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Progression */}
            {currentStepIndex >= 0 && status !== "refusee" && status !== "annulee" && (
              <div className="flex items-center pt-1">
                {STEPS.map((s, i) => (
                  <div key={s.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          i <= currentStepIndex
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-300"
                        }`}
                      >
                        {i < currentStepIndex ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">{i + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-[9px] font-medium whitespace-nowrap ${
                          i <= currentStepIndex ? "text-slate-700" : "text-slate-300"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 mb-4 ${
                          i < currentStepIndex ? "bg-blue-600" : "bg-slate-100"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info permanente : à quoi s'attendre */}
        <div className="px-5 mb-5">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-700 leading-relaxed">
              À une étape de ta démarche, tu pourrais recevoir un{" "}
              <b>code de confirmation par email</b>. Reviens sur cette page et colle-le dès que tu
              le reçois — c&apos;est normal et ça fait avancer ton dossier.
            </p>
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
                <span className="text-slate-400">Total</span>
                <span className="font-semibold text-slate-900">
                  {application.visas.official_fee != null
                    ? formatXAF(
                        (application.visas.official_fee ?? 0) +
                          (application.visas.service_fee ?? 0),
                        application.visas.currency
                      )
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
          {status === "documents_manquants" && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-3 flex gap-3">
              <FileText className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[12.5px] font-bold text-orange-800 mb-1">
                  Des documents manquent à ton dossier
                </p>
                <p className="text-[11.5px] text-orange-700 leading-relaxed mb-2">
                  Vérifie la liste ci-dessous et complète ce qu&apos;il manque pour ne pas
                  bloquer ta demande.
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="text-[11.5px] font-bold text-white bg-orange-600 rounded-xl px-3 py-2"
                >
                  Ajouter un document maintenant
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[13px] font-bold text-slate-900">Documents</h2>
            <button
              onClick={() => setShowUploadForm((v) => !v)}
              className="text-[11px] font-semibold text-blue-600 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>

          {showUploadForm && (
            <div className="bg-white rounded-2xl shadow-sm p-3.5 mb-2 flex flex-col gap-2">
              <input
                value={docLabel}
                onChange={(e) => setDocLabel(e.target.value)}
                placeholder="Type de document (ex : Passeport, Relevé de notes...)"
                className="border border-slate-200 rounded-xl px-3 py-2 text-[12.5px]"
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !docLabel.trim()}
                className="w-full border border-dashed border-blue-300 text-blue-600 text-[12.5px] font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                Choisir un fichier
              </button>
            </div>
          )}

          {application.application_documents.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center text-[12.5px] text-slate-400 shadow-sm">
              Aucun document lié pour l&apos;instant.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {application.application_documents.map((d) => {
                const docStatus = DOC_STATUS_STYLES[d.status] ?? {
                  label: d.status,
                  className: "text-slate-400",
                };
                return (
                  <div key={d.id} className="flex items-center gap-3 px-4 py-3">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="flex-1 text-[13px] text-slate-900 truncate">
                      {d.document_type}
                    </span>
                    <span className={`text-[11px] font-medium flex items-center gap-1 ${docStatus.className}`}>
                      {d.status === "valide" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {docStatus.label}
                    </span>
                  </div>
                );
              })}
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
                    {formatXAF(p.amount, p.currency)}
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
              Payer {formatXAF(pendingPayment.amount, pendingPayment.currency)}
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
