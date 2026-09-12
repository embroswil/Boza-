"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Loader2, Copy, Check, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

const FILTER_TABS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "soumise", label: "Soumises" },
  { key: "en_cours", label: "En cours" },
  { key: "documents_manquants", label: "Docs manquants" },
  { key: "approuvee", label: "Approuvées" },
  { key: "refusee", label: "Refusées" },
];

type Application = {
  id: string;
  user_id: string;
  status: string;
  submitted_at: string | null;
  application_kind: string | null;
  contact_email: string | null;
  profiles: { full_name: string | null; email: string | null } | null;
  visas: { name: string; countries: { name: string } | null } | null;
  programs: { name: string; universities: { name: string } | null } | null;
};

export type VerificationRequest = {
  id: string;
  application_id: string;
  portal_name: string;
  instructions: string | null;
  status: "pending" | "fulfilled" | "expired";
  code: string | null;
  requested_at: string;
  fulfilled_at: string | null;
};

function applicationLabel(a: Application) {
  return a.visas?.name ?? a.programs?.name ?? "Demande";
}

function applicantLabel(a: Application) {
  return a.profiles?.full_name || a.profiles?.email || "Utilisateur";
}

export function RequestForm({
  applicationId,
  userId,
}: {
  applicationId: string;
  userId: string;
}) {
  const [open, setOpen] = useState(false);
  const [portalName, setPortalName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!portalName.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("verification_requests").insert({
      application_id: applicationId,
      portal_name: portalName.trim(),
      instructions: instructions.trim() || null,
    });
    if (!error) {
      // Alerte l'utilisateur DANS l'app (cloche) pour qu'il revienne coller
      // le code sans tarder, même s'il a déjà quitté la page de la demande.
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Code de vérification requis",
        message: `${portalName.trim()} attend un code pour continuer ta demande — va voir ta boîte mail et colle-le sur ta page de demande.`,
      });
    }
    setSubmitting(false);
    if (!error) {
      setDone(true);
      setPortalName("");
      setInstructions("");
      setTimeout(() => {
        setDone(false);
        setOpen(false);
      }, 1200);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[11.5px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1"
      >
        <KeyRound className="w-3 h-3" /> Demander un code
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-1.5 w-full">
      <input
        value={portalName}
        onChange={(e) => setPortalName(e.target.value)}
        placeholder="Nom du portail (ex: Portail visa Géorgie)"
        className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11.5px]"
      />
      <input
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Instructions à afficher à l'utilisateur (optionnel)"
        className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11.5px]"
      />
      <div className="flex gap-1.5">
        <button
          type="submit"
          disabled={submitting || !portalName.trim()}
          className="bg-amber-600 text-white text-[11.5px] font-semibold rounded-lg px-3 py-1.5 disabled:opacity-50 flex items-center gap-1"
        >
          {submitting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : done ? (
            <Check className="w-3 h-3" />
          ) : (
            "Envoyer la demande"
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[11.5px] text-slate-400 px-2 py-1.5"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export function CodeRow({ r }: { r: VerificationRequest }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="bg-white rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-slate-900 truncate">{r.portal_name}</div>
        <div className="text-[10.5px] text-slate-400">
          {r.status === "pending" ? "En attente du code" : "Code reçu"}
        </div>
      </div>
      {r.status === "fulfilled" && r.code && (
        <button
          onClick={() => {
            navigator.clipboard.writeText(r.code ?? "");
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[12px] font-bold px-2.5 py-1.5 rounded-lg shrink-0"
        >
          {r.code} {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
}

export function AdminDashboard({
  applications,
  verificationRequests,
}: {
  applications: Application[];
  verificationRequests: VerificationRequest[];
}) {
  const pending = verificationRequests.filter((r) => r.status === "pending");
  const fulfilled = verificationRequests.filter((r) => r.status === "fulfilled");
  const [filter, setFilter] = useState("all");

  const filteredApplications =
    filter === "all" ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24 px-5">
        <h1 className="text-lg font-bold text-slate-900 mb-1">Admin — Demandes</h1>
        <p className="text-[11.5px] text-slate-400 mb-5">Réservé à Boza.</p>

        {pending.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 mb-2">
              En attente ({pending.length})
            </h2>
            <div className="flex flex-col gap-2">
              {pending.map((r) => (
                <CodeRow key={r.id} r={r} />
              ))}
            </div>
          </div>
        )}

        {fulfilled.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 mb-2">
              Codes reçus ({fulfilled.length})
            </h2>
            <div className="flex flex-col gap-2">
              {fulfilled.map((r) => (
                <CodeRow key={r.id} r={r} />
              ))}
            </div>
          </div>
        )}

        <h2 className="text-[13px] font-bold text-slate-900 mb-2">
          Demandes ({filteredApplications.length})
        </h2>

        <div className="flex gap-1.5 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`shrink-0 text-[11.5px] font-semibold px-3 py-1.5 rounded-full ${
                filter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filteredApplications.length === 0 && (
            <div className="bg-white rounded-2xl p-4 text-center text-[12.5px] text-slate-400 shadow-sm">
              Aucune demande dans cette catégorie.
            </div>
          )}
          {filteredApplications.map((a) => {
            const statusInfo = STATUS_STYLES[a.status] ?? STATUS_STYLES.brouillon;
            return (
              <Link
                key={a.id}
                href={`/admin/applications/${a.id}`}
                className="bg-white rounded-2xl shadow-sm p-3.5 flex items-center gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="text-[12.5px] font-semibold text-slate-900 truncate">
                      {applicationLabel(a)}
                    </div>
                    <span
                      className={`shrink-0 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 truncate mt-0.5">
                    {applicantLabel(a)}
                  </div>
                  {a.contact_email && (
                    <div className="text-[11px] font-semibold text-blue-700 truncate mt-0.5">
                      {a.contact_email}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
