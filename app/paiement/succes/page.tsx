import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PaiementSuccesPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const supabase = await createClient();

  let applicationId: string | null = null;
  let confirmed = false;

  if (ref) {
    const { data: payment } = await supabase
      .from("payments")
      .select("status, application_id")
      .eq("id", ref)
      .single();
    if (payment) {
      applicationId = payment.application_id;
      confirmed = payment.status === "reussi";
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A12] flex justify-center items-center py-6 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-emerald-500" />
        </div>
        <h1 className="text-lg font-bold text-white">
          {confirmed ? "Paiement confirmé" : "Paiement en cours de vérification"}
        </h1>
        <p className="text-[13px] text-slate-400">
          {confirmed
            ? "Ta demande a bien été soumise."
            : "Nous confirmons ton paiement avec Monetbil — cela ne prend généralement que quelques secondes. Rafraîchis la page de ta demande dans un instant si le statut n'a pas encore changé."}
        </p>
        {!confirmed && <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />}
        {applicationId && (
          <Link
            href={`/demandes/${applicationId}`}
            className="mt-2 bg-violet-600 text-white text-sm font-semibold rounded-2xl px-6 py-3"
          >
            Voir ma demande
          </Link>
        )}
      </div>
    </div>
  );
}
