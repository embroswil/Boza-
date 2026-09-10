// Location: components/user-dashboard-card.tsx
import Link from "next/link";
import { FileText, ChevronRight, PlusCircle } from "lucide-react";

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

type SummaryApplication = {
  id: string;
  status: string;
  visas: { name: string; countries: { name: string } | null } | null;
  programs: { name: string; universities: { name: string } | null } | null;
};

function applicationLabel(a: SummaryApplication) {
  return a.visas?.name ?? a.programs?.name ?? "Demande";
}

function applicationSubtitle(a: SummaryApplication) {
  return a.visas?.countries?.name ?? a.programs?.universities?.name ?? "";
}

export function UserDashboardCard({
  applications,
}: {
  applications: SummaryApplication[];
}) {
  const activeCount = applications.filter(
    (a) => !["annulee", "refusee", "brouillon"].includes(a.status)
  ).length;

  if (applications.length === 0) {
    return (
      <div className="px-5 pb-5">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <PlusCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-slate-900">
              Vous n&apos;avez pas encore de demande
            </div>
            <div className="text-[11.5px] text-slate-400">
              Lancez votre première demande de visa ou d&apos;admission.
            </div>
          </div>
          <Link
            href="/search"
            className="shrink-0 text-[12px] font-bold text-blue-600 bg-blue-50 rounded-full px-3 py-1.5"
          >
            Démarrer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[13px] font-bold text-slate-900">
          Mon tableau de bord
          {activeCount > 0 && (
            <span className="ml-1.5 text-[11px] font-semibold text-blue-600">
              · {activeCount} en cours
            </span>
          )}
        </h2>
        <Link
          href="/demandes"
          className="text-[11.5px] font-semibold text-blue-600 flex items-center gap-0.5"
        >
          Voir tout <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
        {applications.slice(0, 3).map((a) => {
          const statusInfo = STATUS_STYLES[a.status] ?? STATUS_STYLES.brouillon;
          return (
            <Link
              key={a.id}
              href={`/demandes/${a.id}`}
              className="flex items-center gap-2.5 px-4 py-3"
            >
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold text-slate-900 truncate">
                  {applicationLabel(a)}
                </div>
                <div className="text-[10.5px] text-slate-400 truncate">
                  {applicationSubtitle(a)}
                </div>
              </div>
              <span
                className={`shrink-0 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${statusInfo.className}`}
              >
                {statusInfo.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
