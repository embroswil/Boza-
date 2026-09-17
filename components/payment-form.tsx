"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  Loader2,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { formatXAF } from "@/lib/currency";

export function PaymentForm({
  paymentId,
  title,
  countryName,
  countryFlag,
  amount,
  currency,
}: {
  applicationId: string;
  paymentId: string;
  title: string;
  countryName: string | null;
  countryFlag: string | null;
  amount: number;
  currency: string;
}) {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full bg-[#0A0A12] border border-[#2E2E3D] rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500";

  const handlePay = async () => {
    if (phone.trim().length < 8) {
      setError("Merci d'indiquer un numéro de téléphone Mobile Money valide.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/payments/monetbil/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, phone: phone.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "Impossible de lancer le paiement. Réessaie.");
        setSubmitting(false);
        return;
      }

      // Redirection vers le widget Monetbil (Orange Money / MTN MoMo...).
      // Le retour se fera sur /paiement/succes ou /paiement/echec.
      window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue. Vérifie ta connexion et réessaie.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-[#0A0A12] pb-24">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </button>
          <h1 className="text-lg font-bold text-white">Paiement</h1>
        </div>

        {/* Récap */}
        <div className="px-5 mb-5">
          <div className="bg-[#15151F] rounded-2xl shadow-none p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center overflow-hidden shrink-0">
              {countryFlag ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={countryFlag} alt="" className="w-full h-full object-cover object-left" />
              ) : (
                <Globe2 className="w-5 h-5 text-violet-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold text-white truncate">{title}</div>
              {countryName && (
                <div className="text-[11px] text-slate-500 truncate">{countryName}</div>
              )}
            </div>
            <div className="text-[15px] font-extrabold text-white whitespace-nowrap">
              {formatXAF(amount, currency)}
            </div>
          </div>
          {currency?.toUpperCase() !== "XAF" && (
            <p className="text-[11px] text-slate-500 mt-2 px-1">
              Montant d&apos;origine : {amount.toLocaleString("fr-FR")} {currency} — converti en XAF
              au taux indicatif du jour (Mobile Money ne traite qu&apos;en devises africaines).
            </p>
          )}
        </div>

        {error && (
          <div className="mx-5 mb-4 bg-red-500/10 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Mobile Money (Orange Money / MTN MoMo via Monetbil) */}
        <div className="px-5 mb-4">
          <div className="rounded-2xl py-3 flex items-center justify-center gap-2 border bg-violet-500/10 border-violet-500">
            <Smartphone className="w-5 h-5 text-violet-400" />
            <span className="text-[12.5px] font-semibold text-slate-100">
              Mobile Money (Orange Money / MTN MoMo)
            </span>
          </div>
        </div>

        <div className="px-5 mb-5">
          <div className="bg-[#15151F] rounded-2xl shadow-none p-4 flex flex-col gap-3.5">
            <div>
              <label className="text-[13px] font-medium text-slate-200 mb-1.5 block">
                Numéro Mobile Money
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex : 6XX XX XX XX"
                className={inputClass}
              />
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2.5 px-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            Paiement sécurisé par Monetbil — tu recevras une demande de confirmation sur ton téléphone.
          </p>
        </div>

        <div className="px-5">
          <button
            onClick={handlePay}
            disabled={submitting}
            className="w-full bg-violet-600 text-white text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Redirection vers Monetbil...
              </>
            ) : (
              `Payer ${formatXAF(amount, currency)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
