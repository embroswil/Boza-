import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">À propos</h1>
        </div>

        <div className="px-5">
          <div className="bg-white rounded-2xl shadow-sm p-5 text-[13.5px] text-slate-600 leading-relaxed space-y-4">
            <p>
              Boza est une plateforme qui accompagne les étudiants et voyageurs dans leurs
              démarches de visa, d&apos;admission universitaire et de projet de mobilité à
              l&apos;étranger.
            </p>
            <p>
              Notre mission : rendre les démarches de visa et d&apos;études à l&apos;étranger
              simples, transparentes et accessibles, sans intermédiaire compliqué.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
