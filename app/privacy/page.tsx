import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Confidentialité</h1>
        </div>

        <div className="px-5">
          <div className="bg-white rounded-2xl shadow-sm p-5 text-[13px] text-slate-600 leading-relaxed space-y-4">
            <p>
              Boza collecte les informations nécessaires au traitement de vos demandes de visa et
              d&apos;admission (identité, documents, paiement) et ne les partage qu&apos;avec les
              organismes strictement nécessaires à votre démarche (ambassades, consulats,
              universités).
            </p>
            <p>
              Vos données ne sont ni vendues, ni utilisées à des fins publicitaires par des tiers.
            </p>
            <p>Cette politique sera complétée et précisée prochainement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
