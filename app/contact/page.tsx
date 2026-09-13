import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0A12] flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-[#0A0A12] pb-24">
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </Link>
          <h1 className="text-lg font-bold text-white">Contact</h1>
        </div>

        <div className="px-5 flex flex-col gap-3">
          <a
            href="mailto:contact@boza.app"
            className="bg-[#15151F] rounded-2xl shadow-none p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">Par email</div>
              <div className="text-[11.5px] text-slate-500">contact@boza.app</div>
            </div>
          </a>

          <div className="bg-[#15151F] rounded-2xl shadow-none p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">Support</div>
              <div className="text-[11.5px] text-slate-500">
                Une question sur votre demande ? Contactez-nous par email.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
