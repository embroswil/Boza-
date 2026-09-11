import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TEAM_EMAIL = "Embroswill@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json();
    if (!applicationId) {
      return NextResponse.json({ error: "applicationId manquant" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: application } = await supabase
      .from("applications")
      .select(
        `id, application_kind, contact_email, created_at,
         profiles ( full_name, email, phone ),
         visas ( name, countries ( name ) ),
         programs:study_program_id ( name, universities ( name, countries ( name ) ) )`
      )
      .eq("id", applicationId)
      .single();

    if (!application) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    const a = application as unknown as {
      id: string;
      contact_email: string | null;
      profiles: { full_name: string | null; email: string | null; phone: string | null } | null;
      visas: { name: string; countries: { name: string } | null } | null;
      programs: {
        name: string;
        universities: { name: string; countries: { name: string } | null } | null;
      } | null;
    };

    const label = a.visas?.name ?? a.programs?.name ?? "Demande";
    const destination =
      a.visas?.countries?.name ?? a.programs?.universities?.countries?.name ?? "";
    const applicantName = a.profiles?.full_name || "Utilisateur";
    const contactEmail = a.contact_email || a.profiles?.email || "—";
    const applicantPhone = a.profiles?.phone || "—";

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY manquante — email non envoyé");
      return NextResponse.json({ error: "Email non configuré" }, { status: 200 });
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Boza <onboarding@resend.dev>",
        to: [TEAM_EMAIL],
        subject: `⚡ Nouvelle demande — à créer maintenant — ${label}`,
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 14px; color: #0f172a;">
            <h2 style="margin-bottom: 4px;">Nouvelle demande reçue</h2>
            <p style="color: #64748b; margin-top: 0;">
              À traiter immédiatement : crée le compte sur le portail externe avec l'email
              ci-dessous, le code de confirmation ne restera pas valable longtemps.
            </p>
            <table style="border-collapse: collapse; margin-top: 12px;">
              <tr><td style="padding: 4px 12px 4px 0; color:#64748b;">Type</td><td><b>${label}</b></td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color:#64748b;">Destination</td><td>${destination}</td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color:#64748b;">Demandeur</td><td>${applicantName}</td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color:#64748b;">Email à utiliser</td><td><b>${contactEmail}</b></td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color:#64748b;">Téléphone</td><td>${applicantPhone}</td></tr>
            </table>
            <p style="margin-top: 20px;">
              <a href="https://boza.vercel.app/admin" style="background:#2563eb;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;">Ouvrir le tableau de bord admin</a>
            </p>
          </div>
        `,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur notify-team:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
