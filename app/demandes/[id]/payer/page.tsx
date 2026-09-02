import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PaymentForm } from "@/components/payment-form";

export const dynamic = "force-dynamic";

export default async function PayerDemandePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: application } = await supabase
    .from("applications")
    .select(
      `id, status,
       visas ( name, countries ( name, flag_url ) ),
       programs ( name, universities ( name, countries ( name, flag_url ) ) ),
       payments ( id, amount, currency, status )`
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!application) {
    notFound();
  }

  const payments = (application.payments ?? []) as {
    id: string;
    amount: number;
    currency: string | null;
    status: string;
  }[];
  const pendingPayment = payments.find((p) => p.status === "en_attente") ?? payments[0] ?? null;

  // Déjà payée : direction la page de détail plutôt que de repayer.
  if (!pendingPayment || pendingPayment.status === "reussi") {
    redirect(`/demandes/${id}`);
  }

  const visa = application.visas as unknown as {
    name: string;
    countries: { name: string; flag_url: string | null } | null;
  } | null;
  const program = application.programs as unknown as {
    name: string;
    universities: { name: string; countries: { name: string; flag_url: string | null } | null } | null;
  } | null;

  const title = visa?.name ?? program?.name ?? "Ta demande";
  const country = visa?.countries ?? program?.universities?.countries ?? null;

  return (
    <PaymentForm
      applicationId={id}
      paymentId={pendingPayment.id}
      title={title}
      countryName={country?.name ?? null}
      countryFlag={country?.flag_url ?? null}
      amount={pendingPayment.amount}
      currency={pendingPayment.currency ?? "XAF"}
    />
  );
}
