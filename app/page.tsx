import {
  Bell,
  User,
  Globe2,
  Plane,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HeroCarousel } from "@/components/hero-carousel";
import { SearchBar } from "@/components/search-bar";
import { SiteFooter } from "@/components/site-footer";
import { PromoSection } from "@/components/promo-section";
import { getProgramImage } from "@/lib/program-images";
import { getDestinationImage } from "@/lib/destination-images";

export const revalidate = 300; // cache 5 min, contenu public peu changeant

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  let hasUnreadNotifications = false;
  if (isLoggedIn) {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    hasUnreadNotifications = (count ?? 0) > 0;
  }

  const FEATURED_UNIVERSITY_IDS = [
    "8d2833c1-28a8-466f-a97e-36ac54e67417", // Tsinghua (Chine)
    "0a1aae68-598f-4c7d-92ea-719de642d92b", // Tbilissi (Géorgie)
    "68244386-3794-4d05-afb3-238cfb089759", // Mohammed V (Maroc)
    "5d592169-e0d4-4426-b936-cfe9ce073fd6", // Luxembourg
  ];

  const [
    { data: countries },
    { data: featuredUniversitiesData },
  ] = await Promise.all([
    supabase
      .from("countries")
      .select("id, name, flag_url")
      .order("created_at", { ascending: true })
      .limit(4),
    supabase
      .from("universities")
      .select("id, name, city, ranking, countries(name)")
      .in("id", FEATURED_UNIVERSITY_IDS),
  ]);

  const featuredUniversities = FEATURED_UNIVERSITY_IDS.map((id) => {
    const u = (featuredUniversitiesData ?? []).find((row) => row.id === id);
    if (!u) return null;
    const country = u.countries as unknown as { name: string } | null;
    return {
      id: u.id,
      name: u.name,
      city: u.city,
      ranking: u.ranking,
      country: country?.name ?? null,
    };
  }).filter((u): u is NonNullable<typeof u> => u !== null);

  const destinations = (countries ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    flag: c.flag_url ?? "🌍",
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center pt-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 relative">
        {/* Header */}
        {isLoggedIn ? (
          <div className="px-5 pt-5 pb-3 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="Boza" className="w-10 h-10 rounded-xl object-cover" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-xl leading-none tracking-tight">
                  BOZA
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Votre passeport pour le monde
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-slate-700" />
                {hasUnreadNotifications && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                )}
              </div>
              <Link href="/profile">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="px-5 pt-5 pb-3 flex items-center justify-between bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Boza" className="w-10 h-10 rounded-xl object-cover" />
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-[13px] font-semibold text-blue-600">
                Se connecter
              </Link>
              <Link
                href="/auth/sign-up"
                className="bg-blue-600 text-white text-[13px] font-semibold rounded-xl px-4 py-2"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        )}

        {/* Search */}
        <SearchBar />

        {/* Hero carrousel */}
        <HeroCarousel universities={featuredUniversities} />

        {/* Destinations d'études */}
        <PromoSection
          badgeIcon={<Globe2 className="w-4 h-4 text-emerald-600" />}
          badgeText="16 pays partenaires"
          title="Étudiez dans le pays de vos rêves"
          image={getDestinationImage({ id: "home-etudes", name: "Destinations études" })}
          imageAlt="Destinations d'études"
          ctaLabel="Explorer les destinations"
          href="/countries"
        />

        {/* Destinations touristiques */}
        <PromoSection
          badgeIcon={<Plane className="w-4 h-4 text-emerald-600" />}
          badgeText="Visas rapides et fiables"
          title="Voyagez librement, explorez le monde"
          image={getDestinationImage({ id: "home-tourisme", name: "Destinations tourisme" })}
          imageAlt="Destinations touristiques"
          ctaLabel="Explorer les visas touristiques"
          href="/visas?type=tourisme"
        />

        {/* Programmes d'études */}
        <PromoSection
          badgeIcon={<GraduationCap className="w-4 h-4 text-emerald-600" />}
          badgeText="Licence · Master · Doctorat"
          title="Trouvez le programme qui vous correspond"
          image={getProgramImage({ id: "home-programmes", name: "Programmes d'études" })}
          imageAlt="Programmes d'études"
          ctaLabel="Voir tous les programmes"
          href="/programs"
        />

        {/* Suivi des demandes */}
        <PromoSection
          badgeIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
          badgeText="Suivi en temps réel"
          title="Vous savez où en est votre dossier"
          image={getProgramImage({ id: "home-suivi", name: "Suivi demandes" })}
          imageAlt="Suivi des demandes"
          ctaLabel="Découvrir le suivi de demandes"
          href="/demandes"
        />


        <SiteFooter destinations={destinations} />
      </div>
    </div>
  );
}
