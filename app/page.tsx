import {
  Bell,
  ChevronRight,
  User,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HeroCarousel } from "@/components/hero-carousel";
import { SearchBar } from "@/components/search-bar";
import { SiteFooter } from "@/components/site-footer";
import { BrowserFrame } from "@/components/browser-frame";
import { getProgramImage } from "@/lib/program-images";
import { getDestinationImage } from "@/lib/destination-images";
import { formatXAF } from "@/lib/currency";

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
    { data: tourismVisasData },
    { data: featuredUniversitiesData },
  ] = await Promise.all([
    supabase
      .from("countries")
      .select("id, name, flag_url")
      .order("created_at", { ascending: true })
      .limit(4),
    supabase
      .from("visas")
      .select("id, name, official_fee, currency, countries(id, name, flag_url)")
      .eq("type", "tourisme")
      .order("created_at", { ascending: true })
      .limit(6),
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

  const tourismDestinations = (tourismVisasData ?? []).map((v) => {
    const country = v.countries as unknown as {
      id: string;
      name: string;
      flag_url: string | null;
    } | null;
    return {
      id: v.id,
      countryId: country?.id ?? v.id,
      name: country?.name ?? v.name,
      flag: country?.flag_url ?? "✈️",
      price: v.official_fee ? formatXAF(v.official_fee, v.currency) : "",
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
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

        {/* Aperçu produit, style bandeau teinté + capture qui déborde */}
        <div className="w-full bg-blue-50 pt-8 pb-16 px-7 text-center mb-[-2.5rem]">
          <span className="text-blue-600 text-[11px] font-bold uppercase tracking-wide">
            Suivi en temps réel
          </span>
          <h2 className="text-[21px] font-extrabold text-slate-900 leading-tight mt-2 mb-3">
            Vous savez où en est votre dossier.
            <br />
            Nous vous montrons chaque étape.
          </h2>
          <p className="text-slate-500 text-[12.5px] mb-5 leading-relaxed">
            Visa, admission, documents, paiement : suivez chaque étape de votre demande en temps
            réel, sans avoir à demander.
          </p>
          <Link
            href="/demandes"
            className="inline-block bg-blue-600 text-white text-[13px] font-semibold rounded-full px-6 py-3"
          >
            Découvrir le suivi de demandes
          </Link>
        </div>
        <div className="px-5 mb-10">
          <BrowserFrame>
            <div className="bg-blue-600 h-9 flex items-center justify-between px-3.5">
              <span className="text-white text-[11px] font-bold">Mes demandes</span>
              <span className="text-white/70 text-[9px]">Boza</span>
            </div>
            <div className="bg-white p-3 flex flex-col gap-2">
              {[
                { name: "Master Gestion — Université de Poznań", status: "En cours", color: "bg-blue-100 text-blue-700" },
                { name: "Visa touristique — Arabie Saoudite", status: "Approuvé", color: "bg-emerald-100 text-emerald-700" },
                { name: "Documents — Passeport", status: "Validé", color: "bg-emerald-100 text-emerald-700" },
              ].map((row) => (
                <div
                  key={row.name}
                  className="bg-slate-50 rounded-xl px-3 py-2.5 flex items-center justify-between"
                >
                  <span className="text-[11.5px] font-medium text-slate-700 truncate pr-2">
                    {row.name}
                  </span>
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${row.color}`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </BrowserFrame>
        </div>

        {/* Destinations (études + tourisme), version compacte */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Destinations d&apos;études</h2>
          <Link href="/countries" className="text-blue-600 text-sm font-medium flex items-center gap-0.5">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mb-6 flex gap-3 overflow-x-auto px-5 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {destinations.length === 0 && (
            <div className="bg-white rounded-xl p-4 text-center text-sm text-slate-400 shadow-sm">
              Aucun pays pour l&apos;instant — ajoute-les dans Supabase.
            </div>
          )}
          {destinations.map((d) => (
            <Link
              key={d.id}
              href={`/countries/${d.id}`}
              className="relative w-24 aspect-square rounded-2xl overflow-hidden shadow-md shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getDestinationImage({ id: d.id, name: d.name })}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative h-full flex flex-col items-center justify-center gap-1.5 p-2">
                <span className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center overflow-hidden shadow-sm">
                  {d.flag.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.flag} alt={d.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base">{d.flag}</span>
                  )}
                </span>
                <span className="text-[10.5px] font-bold text-white text-center leading-tight">
                  {d.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Destinations touristiques</h2>
          <Link
            href="/visas?type=tourisme"
            className="text-blue-600 text-sm font-medium flex items-center gap-0.5"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mb-6 flex gap-3 overflow-x-auto px-5 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tourismDestinations.length === 0 && (
            <div className="bg-white rounded-xl p-4 text-center text-sm text-slate-400 shadow-sm">
              Aucun visa tourisme pour l&apos;instant — ajoute-les dans Supabase.
            </div>
          )}
          {tourismDestinations.map((d) => (
            <Link
              key={d.id}
              href={`/visas/${d.id}`}
              className="relative w-24 aspect-square rounded-2xl overflow-hidden shadow-md shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getDestinationImage({ id: d.countryId, name: d.name })}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative h-full flex flex-col items-center justify-center gap-1.5 p-2">
                <span className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center overflow-hidden shadow-sm">
                  {d.flag.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.flag} alt={d.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base">{d.flag}</span>
                  )}
                </span>
                <span className="text-[10.5px] font-bold text-white text-center leading-tight">
                  {d.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Programmes d'études par niveau, version compacte */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Programmes d&apos;études</h2>
          <Link href="/programs" className="text-blue-600 text-sm font-medium flex items-center gap-0.5">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-5 mb-10 grid grid-cols-3 gap-2.5">
          {[
            { level: "licence", title: "Licence", img: getProgramImage({ id: "home-licence", name: "Licence Gestion" }) },
            { level: "master", title: "Master", img: getProgramImage({ id: "home-master", name: "Master Ingénierie" }) },
            { level: "doctorat", title: "Doctorat", img: getProgramImage({ id: "home-doctorat", name: "Doctorat Recherche" }) },
          ].map((b) => (
            <Link
              key={b.level}
              href={`/programs?level=${b.level}`}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.img} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="relative h-full flex items-end justify-center pb-3 text-[12.5px] font-bold text-white">
                {b.title}
              </span>
            </Link>
          ))}
        </div>

        <SiteFooter destinations={destinations} />
      </div>
    </div>
  );
}
