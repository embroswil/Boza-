// Location: components/user-dashboard-card.tsx
import Link from "next/link";
import { PlusCircle, ChevronRight } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  soumise: "Soumise",
  en_cours: "En cours",
  documents_manquants: "Documents manquants",
  approuvee: "Approuvée",
  refusee: "Refusée",
  annulee: "Annulée",
};

// Progression indicative de la demande dans son parcours (pas un vrai
// pourcentage mesure, juste un repere visuel de l'etape atteinte) —
// inspire des barres de score de la reference (rouge/orange/vert).
const STATUS_PROGRESS: Record<string, number> = {
  soumise: 25,
  en_cours: 55,
  documents_manquants: 45,
  approuvee: 100,
  refusee: 100,
  annulee: 10,
};

function progressColor(pct: number, status: string) {
  if (status === "refusee") return "bg-red-500";
  if (status === "annulee") return "bg-slate-300";
  if (pct < 40) return "bg-red-500";
  if (pct < 70) return "bg-amber-500";
  return "bg-emerald-500";
}

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

  const total = applications.length;
  const enCours = applications.filter((a) => a.status === "en_cours").length;
  const docsManquants = applications.filter(
    (a) => a.status === "documents_manquants"
  ).length;
  const approuvees = applications.filter((a) => a.status === "approuvee").length;

  const stats = [
    { label: "Demandes", value: total },
    { label: "En cours", value: enCours },
    { label: "Docs manquants", value: docsManquants },
    { label: "Approuvées", value: approuvees },
  ];

  return (
    <div className="px-5 pb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold text-slate-900">Mon tableau de bord</h2>
        <Link
          href="/demandes"
          className="text-[11.5px] font-semibold text-blue-600 flex items-center gap-0.5"
        >
          Voir tout <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Bandeau de stats */}
      <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-4 gap-2 mb-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-[19px] font-extrabold text-slate-900 leading-none">
              {s.value}
            </div>
            <div className="text-[9.5px] text-slate-400 mt-1 leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progression par demande */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="text-[11px] font-semibold text-slate-400 mb-3">
          Avancement de mes demandes
        </div>
        <div className="flex flex-col gap-3">
          {applications.slice(0, 4).map((a) => {
            const pct = STATUS_PROGRESS[a.status] ?? 20;
            return (
              <Link key={a.id} href={`/demandes/${a.id}`} className="block">
                <div className="flex items-center justify-between mb-1">
                  <div className="min-w-0 pr-2">
                    <div className="text-[12.5px] font-semibold text-slate-900 truncate">
                      {applicationLabel(a)}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {applicationSubtitle(a)} · {STATUS_LABELS[a.status] ?? a.status}
                    </div>
                  </div>
                  <span className="shrink-0 text-[12px] font-bold text-slate-700">
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${progressColor(pct, a.status)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
