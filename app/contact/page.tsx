import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-24">
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Contact</h1>
        </div>

        <div className="px-5 flex flex-col gap-3">
          <a
            href="mailto:contact@boza.app"
            className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-900">Par email</div>
              <div className="text-[11.5px] text-slate-400">contact@boza.app</div>
            </div>
          </a>

          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-900">Support</div>
              <div className="text-[11.5px] text-slate-400">
                Une question sur votre demande ? Contactez-nous par email.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
