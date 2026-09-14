import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaiementEchecPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A12] flex justify-center items-center py-6 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <XCircle className="w-9 h-9 text-red-500" />
        </div>
        <h1 className="text-lg font-bold text-white">Paiement échoué</h1>
        <p className="text-[13px] text-slate-400">
          Le paiement n&apos;a pas abouti (solde insuffisant, annulation, ou délai
          dépassé). Aucun montant n&apos;a été débité. Tu peux réessayer depuis ta
          demande.
        </p>
        <Link
          href="/demandes"
          className="mt-2 bg-violet-600 text-white text-sm font-semibold rounded-2xl px-6 py-3"
        >
          Retour à mes demandes
        </Link>
      </div>
    </div>
  );
}
