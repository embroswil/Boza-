"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Loader2,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatXAF } from "@/lib/currency";
import { RequestForm, CodeRow, type VerificationRequest } from "@/components/admin-dashboard";

type Application = {
  id: string;
  user_id: string;
  status: string;
  submitted_at: string | null;
  created_at: string;
  application_kind: string | null;
  contact_email: string | null;
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
  profiles: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    nationality: string | null;
  } | null;
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
    file_url: string;
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

const STATUS_ORDER = [
  "soumise",
  "en_cours",
  "documents_manquants",
  "approuvee",
  "refusee",
  "annulee",
];

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

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-[13px] border-b border-slate-100 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-900 text-right ml-3">{value}</span>
    </div>
  );
}

function StatusSwitcher({
  applicationId,
  currentStatus,
  onChanged,
}: {
  applicationId: string;
  currentStatus: string;
  onChanged: (status: string) => void;
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  async function changeStatus(next: string) {
    setUpdating(next);
    const { error } = await supabase
      .from("applications")
      .update({ status: next })
      .eq("id", applicationId);
    setUpdating(null);
    if (!error) onChanged(next);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUS_ORDER.map((s) => {
        const info = STATUS_STYLES[s];
        const active = s === currentStatus;
        return (
          <button
            key={s}
            onClick={() => !active && changeStatus(s)}
            disabled={active || updating !== null}
            className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 ${
              active
                ? `${info.className} ring-1 ring-inset ring-current`
                : "bg-white text-slate-500 border border-slate-200"
            } disabled:opacity-60`}
          >
            {updating === s ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            {info.label}
          </button>
        );
      })}
    </div>
  );
}

function DocumentRow({ doc }: { doc: Application["application_documents"][number] }) {
  const [status, setStatus] = useState(doc.status);
  const [busy, setBusy] = useState<"view" | "valide" | "rejete" | null>(null);
  const supabase = createClient();

  async function handleView() {
    setBusy("view");
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_url, 60);
    setBusy(null);
    if (!error && data?.signedUrl) {
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    }
  }

  async function handleReview(next: "valide" | "rejete") {
    setBusy(next);
    const { error } = await supabase
      .from("application_documents")
      .update({ status: next })
      .eq("id", doc.id);
    setBusy(null);
    if (!error) setStatus(next);
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 last:border-0">
      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-slate-900 truncate">{doc.document_type}</div>
        <div className="text-[10.5px] text-slate-400">{DOC_STATUS_LABELS[status] ?? status}</div>
      </div>
      <button
        onClick={handleView}
        disabled={busy !== null}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 disabled:opacity-50"
        title="Voir le document"
      >
        {busy === "view" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <ExternalLink className="w-3.5 h-3.5" />
        )}
      </button>
      <button
        onClick={() => handleReview("valide")}
        disabled={busy !== null || status === "valide"}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 disabled:opacity-40"
        title="Valider"
      >
        {busy === "valide" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      </button>
      <button
        onClick={() => handleReview("rejete")}
        disabled={busy !== null || status === "rejete"}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-600 disabled:opacity-40"
        title="Rejeter"
      >
        {busy === "rejete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export function AdminApplicationDetail({
  application,
  verificationRequests,
}: {
  application: Application;
  verificationRequests: VerificationRequest[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(application.status);

  const country =
    application.visas?.countries ?? application.programs?.universities?.countries ?? null;
  const title = application.visas?.name ?? application.programs?.name ?? "Demande";
  const subtitle = application.programs?.universities?.name ?? country?.name ?? "";

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24 px-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-[12.5px] text-slate-500 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Retour au tableau de bord
        </Link>

        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-[12.5px] text-slate-400 mb-3">{subtitle}</p>}

        <div className="mb-5">
          <StatusSwitcher
            applicationId={application.id}
            currentStatus={status}
            onChanged={(next) => {
              setStatus(next);
              router.refresh();
            }}
          />
        </div>

        {/* Candidat */}
        <div className="mb-5">
          <h2 className="text-[13px] font-bold text-slate-900 mb-2">Candidat</h2>
          <div className="bg-white rounded-2xl shadow-sm">
            <Field label="Nom" value={application.profiles?.full_name} />
            <Field
              label="Email à utiliser (portail externe)"
              value={application.contact_email}
            />
            <Field label="Email du compte Boza" value={application.profiles?.email} />
            <Field label="Téléphone" value={application.profiles?.phone} />
            <Field label="Nationalité" value={application.profiles?.nationality} />
            <Field label="Date de naissance" value={application.date_of_birth} />
            <Field label="Genre" value={application.gender} />
            <Field label="N° passeport" value={application.passport_number} />
          </div>
        </div>

        {/* Détails de la demande (études) */}
        {application.programs && (
          <div className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 mb-2">Détails du dossier</h2>
            <div className="bg-white rounded-2xl shadow-sm">
              <Field label="Niveau" value={application.education_level} />
              <Field label="Diplôme" value={application.diploma_title} />
              <Field label="Établissement" value={application.diploma_institution} />
              <Field label="Année du diplôme" value={application.diploma_year?.toString()} />
              <Field label="Niveau de langue" value={application.language_proficiency} />
              <Field label="Financement" value={application.financial_support} />
              <Field label="Début souhaité" value={application.intended_start_date} />
              <Field label="Santé (déclaré)" value={application.health_conditions} />
            </div>
            {application.motivation_letter && (
              <div className="bg-white rounded-2xl shadow-sm mt-2 p-3.5">
                <div className="text-[11px] text-slate-400 mb-1">Lettre de motivation</div>
                <p className="text-[12.5px] text-slate-700 whitespace-pre-wrap">
                  {application.motivation_letter}
                </p>
              </div>
            )}
            {application.applicant_notes && (
              <div className="bg-white rounded-2xl shadow-sm mt-2 p-3.5">
                <div className="text-[11px] text-slate-400 mb-1">Notes du candidat</div>
                <p className="text-[12.5px] text-slate-700 whitespace-pre-wrap">
                  {application.applicant_notes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Visa */}
        {application.visas && (
          <div className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 mb-2">Visa</h2>
            <div className="bg-white rounded-2xl shadow-sm">
              <Field label="Type" value={application.visas.type} />
              <Field
                label="Total"
                value={
                  application.visas.official_fee != null
                    ? formatXAF(
                        (application.visas.official_fee ?? 0) +
                          (application.visas.service_fee ?? 0),
                        application.visas.currency
                      )
                    : null
                }
              />
              <Field
                label="Délai de traitement"
                value={
                  application.visas.processing_days
                    ? `${application.visas.processing_days} jours`
                    : null
                }
              />
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="mb-5">
          <h2 className="text-[13px] font-bold text-slate-900 mb-2">
            Documents ({application.application_documents.length})
          </h2>
          {application.application_documents.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center text-[12.5px] text-slate-400 shadow-sm">
              Aucun document envoyé.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm">
              {application.application_documents.map((d) => (
                <DocumentRow key={d.id} doc={d} />
              ))}
            </div>
          )}
        </div>

        {/* Paiement */}
        <div className="mb-5">
          <h2 className="text-[13px] font-bold text-slate-900 mb-2">Paiement</h2>
          {application.payments.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center text-[12.5px] text-slate-400 shadow-sm">
              Aucun paiement enregistré.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {application.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[13px] font-semibold text-slate-900">
                    {formatXAF(p.amount, p.currency)}
                  </span>
                  <span
                    className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === "reussi"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {p.status === "reussi" ? `Payé le ${p.paid_at ? formatDate(p.paid_at) : ""}` : p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rendez-vous */}
        {application.appointments.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 mb-2">Rendez-vous</h2>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {application.appointments.map((a) => (
                <div key={a.id} className="px-4 py-3">
                  <div className="text-[13px] font-semibold text-slate-900">
                    {formatDate(a.appointment_date)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {a.embassies?.name}
                    {a.embassies?.city ? ` — ${a.embassies.city}` : ""} · {a.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Codes de vérification */}
        <div className="mb-5">
          <h2 className="text-[13px] font-bold text-slate-900 mb-2">Codes de vérification</h2>
          {verificationRequests.length > 0 && (
            <div className="flex flex-col gap-2 mb-2">
              {verificationRequests.map((r) => (
                <CodeRow key={r.id} r={r} />
              ))}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm p-3.5">
            <RequestForm applicationId={application.id} userId={application.user_id} />
          </div>
        </div>
      </div>
    </div>
  );
}
