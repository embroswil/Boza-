import {
  Bell,
  ChevronRight,
  User,
  Globe,
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

        {/* Aperçu de l'app, style capture produit */}
        <div className="px-5 mb-6 pt-2">
          <h2 className="text-[19px] font-extrabold text-slate-900 leading-tight mb-1.5">
            Toutes vos démarches, au même endroit
          </h2>
          <p className="text-slate-500 text-[12.5px] mb-4 leading-relaxed">
            Visa, admission, documents, paiement : suivez chaque étape depuis l&apos;app.
          </p>
          <BrowserFrame>
            <div className="p-3.5 flex flex-col gap-2.5">
              {[
                { name: "Master Gestion — Université de Poznań", status: "En cours", color: "bg-blue-100 text-blue-700" },
                { name: "Visa touristique — Arabie Saoudite", status: "Approuvé", color: "bg-emerald-100 text-emerald-700" },
                { name: "Documents — Passeport", status: "Validé", color: "bg-emerald-100 text-emerald-700" },
              ].map((row) => (
                <div
                  key={row.name}
                  className="bg-white rounded-xl px-3 py-2.5 flex items-center justify-between shadow-sm"
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

        {/* Destinations études populaires */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Destinations d&apos;études</h2>
          <Link href="/countries" className="text-blue-600 text-sm font-medium flex items-center gap-0.5">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-5 mb-3">
          <Link
            href="/countries"
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 flex flex-col"
          >
            <h3 className="text-[20px] font-extrabold text-slate-900 leading-tight max-w-[62%]">
              Étudiez dans le pays de vos rêves
            </h3>
            <p className="text-slate-500 text-[12.5px] mt-2 max-w-[58%] leading-relaxed">
              Découvrez les meilleures destinations pour vos études à l&apos;étranger.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getDestinationImage({ id: "home-etudes", name: "Destinations études" })}
              alt="Destinations d'études"
              className="absolute right-0 top-0 bottom-0 w-[42%] object-cover rounded-l-3xl"
            />
            <span className="relative w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3 mt-4 flex items-center justify-center gap-2">
              Explorer les destinations <ChevronRight className="w-4 h-4" />
            </span>
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

        {/* Destinations touristiques */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Destinations touristiques</h2>
          <Link
            href="/visas?type=tourisme"
            className="text-blue-600 text-sm font-medium flex items-center gap-0.5"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-5 mb-3">
          <Link
            href="/visas?type=tourisme"
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 flex flex-col"
          >
            <h3 className="text-[20px] font-extrabold text-slate-900 leading-tight max-w-[62%]">
              Voyagez librement, explorez le monde
            </h3>
            <p className="text-slate-500 text-[12.5px] mt-2 max-w-[58%] leading-relaxed">
              Obtenez votre visa touristique rapidement, où que vous alliez.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getDestinationImage({ id: "home-tourisme", name: "Destinations tourisme" })}
              alt="Destinations touristiques"
              className="absolute right-0 top-0 bottom-0 w-[42%] object-cover rounded-l-3xl"
            />
            <span className="relative w-full bg-emerald-600 text-white text-sm font-semibold rounded-2xl py-3 mt-4 flex items-center justify-center gap-2">
              Explorer les visas touristiques <ChevronRight className="w-4 h-4" />
            </span>
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

        {/* Programmes d'études par niveau */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Programmes d&apos;études</h2>
          <Link href="/programs" className="text-blue-600 text-sm font-medium flex items-center gap-0.5">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-5 mb-4 flex flex-col gap-4">
          {[
            {
              level: "licence",
              title: "Programmes de licence",
              desc: "Démarrez vos études supérieures dans l'université qui vous correspond.",
              img: getProgramImage({ id: "home-licence", name: "Licence Gestion" }),
            },
            {
              level: "master",
              title: "Programmes de master",
              desc: "Spécialisez-vous et approfondissez votre expertise à l'international.",
              img: getProgramImage({ id: "home-master", name: "Master Ingénierie" }),
            },
            {
              level: "doctorat",
              title: "Programmes de doctorat",
              desc: "Menez vos travaux de recherche au sein d'universités reconnues.",
              img: getProgramImage({ id: "home-doctorat", name: "Doctorat Recherche" }),
            },
          ].map((b) => (
            <Link
              key={b.level}
              href={`/programs?level=${b.level}`}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 flex flex-col"
            >
              <h3 className="text-[20px] font-extrabold text-slate-900 leading-tight max-w-[62%]">
                {b.title}
              </h3>
              <p className="text-slate-500 text-[12.5px] mt-2 max-w-[58%] leading-relaxed">
                {b.desc}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.img}
                alt={b.title}
                className="absolute right-0 top-0 bottom-0 w-[42%] object-cover rounded-l-3xl"
              />
              <span className="relative w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-3 mt-4 flex items-center justify-center gap-2">
                Commencer maintenant <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* Bannière footer */}
        <div className="px-5 mb-24">
          <Link
            href="/countries"
            className="w-full bg-emerald-50 rounded-2xl px-4 py-3.5 flex items-center gap-2 text-emerald-700 text-sm font-semibold"
          >
            <Globe className="w-4 h-4" />
            <span className="flex-1 text-left">
              Voir toutes les destinations
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <SiteFooter destinations={destinations} />
      </div>
    </div>
  );
}
