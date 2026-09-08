import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Conditions d&apos;utilisation</h1>
        </div>

        <div className="px-5">
          <div className="bg-white rounded-2xl shadow-sm p-5 text-[13px] text-slate-600 leading-relaxed space-y-4">
            <p>
              En utilisant Boza, vous acceptez que la plateforme sert à vous accompagner dans vos
              démarches de visa, d&apos;admission et de voyage, sans garantie d&apos;acceptation
              par les autorités ou établissements concernés — la décision finale appartient
              toujours aux ambassades, consulats et universités partenaires.
            </p>
            <p>
              Les informations, documents et paiements transmis via Boza doivent être exacts et à
              jour. Toute fausse déclaration engage votre seule responsabilité.
            </p>
            <p>Ces conditions seront complétées et précisées prochainement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
