import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A12] flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-[#0A0A12] pb-24">
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </Link>
          <h1 className="text-lg font-bold text-white">Confidentialité</h1>
        </div>

        <div className="px-5">
          <div className="bg-[#15151F] rounded-2xl shadow-none p-5 text-[13px] text-slate-600 leading-relaxed space-y-4">
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
