"use client";

import { useState } from "react";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type VerificationRequest = {
  id: string;
  portal_name: string;
  instructions: string | null;
  status: "pending" | "fulfilled" | "expired";
};

export function VerificationCodeRequest({ request }: { request: VerificationRequest }) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(request.status === "fulfilled");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("verification_requests")
      .update({ code: code.trim(), status: "fulfilled", fulfilled_at: new Date().toISOString() })
      .eq("id", request.id);

    setSubmitting(false);
    if (updateError) {
      setError("Une erreur est survenue, réessaie.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 mb-4">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <div className="text-[12.5px] text-emerald-700">
          Code transmis — on continue la démarche pour toi, tu n&apos;as rien d&apos;autre à
          faire.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
        <div className="text-[13px] font-bold text-amber-800">Code de vérification requis</div>
      </div>
      <p className="text-[12px] text-amber-700 leading-relaxed mb-3">
        {request.instructions ??
          `Un code de vérification a été envoyé à ton adresse email par ${request.portal_name}. Va le chercher dans ta boîte mail et colle-le ici pour qu'on continue ta démarche.`}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code reçu par email"
          className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 outline-none"
        />
        <button
          type="submit"
          disabled={submitting || !code.trim()}
          className="bg-amber-600 text-white text-[12.5px] font-semibold rounded-xl px-4 py-2.5 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Envoyer"}
        </button>
      </form>
      {error && <p className="text-[11px] text-red-600 mt-2">{error}</p>}
    </div>
  );
}
