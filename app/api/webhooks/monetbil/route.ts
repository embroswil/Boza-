import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Client "admin" avec la clé de service : nécessaire ici car Monetbil appelle
// cette route directement (pas de session utilisateur), et cette route doit
// pouvoir mettre à jour les paiements de n'importe quel utilisateur.
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Vérifie le statut réel du paiement directement auprès de Monetbil plutôt
// que de faire confiance aux données brutes reçues dans la notification —
// c'est l'étape de sécurité recommandée par Monetbil eux-mêmes.
async function verifyWithMonetbil(transactionId: string) {
  const serviceSecret = process.env.MONETBIL_SERVICE_SECRET;
  const res = await fetch("https://api.monetbil.com/payment/v1/checkPayment", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      service_secret: serviceSecret || "",
      transaction_id: transactionId,
    }),
  });
  const data = await res.json().catch(() => null);
  // Monetbil renvoie un statut : 1 = succès, 0 = échec, -1 = annulé
  // (7/8/9 = équivalents en mode test)
  return data;
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let fields: Record<string, string> = {};

  if (contentType.includes("application/json")) {
    fields = await req.json();
  } else {
    const formData = await req.formData();
    formData.forEach((value, key) => {
      fields[key] = String(value);
    });
  }

  const transactionId = fields["transaction_id"];
  const paymentRef = fields["payment_ref"] || fields["item_ref"];
  const reportedStatus = fields["status"];

  if (!transactionId || !paymentRef) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const supabase = getAdminClient();

  let isSuccess = reportedStatus === "1" || reportedStatus === "7";

  // Double-vérification serveur-à-serveur si le secret est configuré.
  if (process.env.MONETBIL_SERVICE_SECRET) {
    const verification = await verifyWithMonetbil(transactionId);
    if (verification && Array.isArray(verification)) {
      const status = verification[0];
      isSuccess = status === 1 || status === 7;
    }
  }

  if (isSuccess) {
    await supabase
      .from("payments")
      .update({
        status: "reussi",
        payment_method: "mobile_money",
        paid_at: new Date().toISOString(),
      })
      .eq("id", paymentRef);

    const { data: payment } = await supabase
      .from("payments")
      .select("application_id")
      .eq("id", paymentRef)
      .single();

    if (payment?.application_id) {
      await supabase
        .from("applications")
        .update({ status: "soumise", submitted_at: new Date().toISOString() })
        .eq("id", payment.application_id);
    }
  } else {
    await supabase.from("payments").update({ status: "echoue" }).eq("id", paymentRef);
  }

  // Monetbil attend une réponse 200 pour considérer la notification reçue.
  return NextResponse.json({ received: true });
}
