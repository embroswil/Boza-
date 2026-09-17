import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toXAF, getRateToXAF } from "@/lib/currency";

// Construit l'URL du widget Monetbil et la renvoie au client, qui redirige
// le navigateur dessus. Le SERVICE_KEY reste côté serveur (variable d'env),
// jamais exposé dans le code front.
export async function POST(req: NextRequest) {
  const { paymentId, phone } = await req.json();

  if (!paymentId) {
    return NextResponse.json({ error: "paymentId manquant" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("id, amount, currency, application_id, applications(user_id)")
    .eq("id", paymentId)
    .single();

  if (!payment) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
  }

  const application = payment.applications as unknown as { user_id: string } | null;
  if (application?.user_id !== user.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://boza.vercel.app";

  if (!SERVICE_KEY) {
    return NextResponse.json(
      { error: "Monetbil n'est pas configuré (MONETBIL_SERVICE_KEY manquant sur le serveur)." },
      { status: 500 }
    );
  }

  // Monetbil règle en devises locales africaines (XAF, XOF, CDF, GNF...).
  // Si ce paiement n'est pas déjà en XAF, on le convertit avant envoi et on
  // trace le taux appliqué (utile en cas de litige, les taux étant révisés
  // périodiquement dans lib/currency.ts).
  const rate = getRateToXAF(payment.currency);
  const amountXAF = toXAF(Number(payment.amount), payment.currency);

  const { error: updateError } = await supabase
    .from("payments")
    .update({ converted_amount_xaf: amountXAF, exchange_rate_used: rate })
    .eq("id", payment.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Impossible d'enregistrer la conversion du paiement." },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    amount: String(amountXAF),
    currency: "XAF",
    item_ref: payment.id,
    payment_ref: payment.id,
    user: user.id,
    phone: phone || "",
    return_url: `${BASE_URL}/paiement/succes?ref=${payment.id}`,
    notify_url: `${BASE_URL}/api/webhooks/monetbil`,
  });

  const url = `https://api.monetbil.com/widget/v2.1/${SERVICE_KEY}?${params.toString()}`;

  return NextResponse.json({ url });
}
