import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase pour les pages 100% publiques (accueil, pays, visas,
 * programmes, universités...) qui ne lisent AUCUNE donnée propre à
 * l'utilisateur connecté.
 *
 * Contrairement à `lib/supabase/server.ts`, celui-ci ne touche PAS aux
 * cookies. C'est important : dès qu'une Server Component appelle
 * `cookies()` (ce que fait `createClient()` de server.ts à chaque appel),
 * Next.js désactive automatiquement tout cache/ISR sur la page, même si
 * elle déclare `export const revalidate = ...`. En utilisant ce client
 * public sur les pages catalogue, on permet enfin au cache de fonctionner.
 *
 * Ne JAMAIS utiliser ce client sur une page qui doit vérifier si
 * l'utilisateur est connecté ou afficher des données propres à un compte
 * (demandes, profil, documents) — pour ça, garder `lib/supabase/server.ts`.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
