"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Globe2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Method = "carte" | "mobile_money";

export function PaymentForm({
  applicationId,
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
  const supabase = createClient();

  const [method, setMethod] = useState<Method>("mobile_money");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600";

  const handlePay = async () => {
    if (method === "mobile_money" && phone.trim().length < 8) {
      setError("Merci d'indiquer un numéro de téléphone valide.");
      return;
    }
    if (method === "carte" && (cardNumber.trim().length < 12 || !cardExpiry || cardCvc.trim().length < 3)) {
      setError("Merci de renseigner des informations de carte valides.");
      return;
    }
    setError(null);
    setSubmitting(true);

    // ⚠️ Paiement simulé : aucune passerelle réelle (Stripe / CinetPay /
    // Orange Money / MTN MoMo...) n'est branchée ici. On enregistre juste le
    // paiement comme "réussi" pour faire avancer le dossier dans l'app.
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const { error: payError } = await supabase
      .from("payments")
      .update({
        status: "reussi",
        payment_method: method,
        paid_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (payError) {
      setError("Le paiement a échoué. Réessaie.");
      setSubmitting(false);
      return;
    }

    await supabase
      .from("applications")
      .update({ status: "soumise", submitted_at: new Date().toISOString() })
      .eq("id", applicationId);

    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => router.push(`/demandes/${applicationId}`), 1600);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center py-6 font-sans">
        <div className="w-full max-w-sm flex flex-col items-center gap-4 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">Paiement confirmé</h1>
          <p className="text-[13px] text-slate-500">
            Ta demande a bien été soumise. Redirection vers ton dossier...
          </p>
          <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 pb-10">
        {/* Header */}
        <div className="px-5 pt-2 pb-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Paiement</h1>
        </div>

        {/* Récap */}
        <div className="px-5 mb-5">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-lg">
              {countryFlag ?? <Globe2 className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold text-slate-900 truncate">{title}</div>
              {countryName && (
                <div className="text-[11px] text-slate-400 truncate">{countryName}</div>
              )}
            </div>
            <div className="text-[15px] font-extrabold text-slate-900 whitespace-nowrap">
              {amount.toLocaleString("fr-FR")} {currency}
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-5 mb-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Méthode de paiement */}
        <div className="px-5 mb-4 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setMethod("mobile_money")}
            className={`rounded-2xl py-3 flex flex-col items-center gap-1.5 border ${
              method === "mobile_money"
                ? "bg-blue-50 border-blue-600"
                : "bg-white border-slate-100 shadow-sm"
            }`}
          >
            <Smartphone
              className={`w-5 h-5 ${method === "mobile_money" ? "text-blue-600" : "text-slate-400"}`}
            />
            <span className="text-[11.5px] font-semibold text-slate-800">Mobile Money</span>
          </button>
          <button
            onClick={() => setMethod("carte")}
            className={`rounded-2xl py-3 flex flex-col items-center gap-1.5 border ${
              method === "carte"
                ? "bg-blue-50 border-blue-600"
                : "bg-white border-slate-100 shadow-sm"
            }`}
          >
            <CreditCard
              className={`w-5 h-5 ${method === "carte" ? "text-blue-600" : "text-slate-400"}`}
            />
            <span className="text-[11.5px] font-semibold text-slate-800">Carte bancaire</span>
          </button>
        </div>

        {/* Formulaire */}
        <div className="px-5 mb-5">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3.5">
            {method === "mobile_money" ? (
              <div>
                <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                  Numéro Orange Money / MTN MoMo
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex : 6XX XX XX XX"
                  className={inputClass}
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={inputClass}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                      Expiration
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">
                      CVC
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2.5 px-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            Paiement sécurisé — tes informations ne sont pas stockées.
          </p>
        </div>

        <div className="px-5">
          <button
            onClick={handlePay}
            disabled={submitting}
            className="w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Traitement...
              </>
            ) : (
              `Payer ${amount.toLocaleString("fr-FR")} ${currency}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
