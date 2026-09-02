import {
  Bell,
  GraduationCap,
  Briefcase,
  ChevronRight,
  Home as HomeIcon,
  ClipboardList,
  FileText,
  User,
  Plus,
  Calendar,
  Globe,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HeroCarousel } from "@/components/hero-carousel";
import { SearchBar } from "@/components/search-bar";
import { getProgramImage } from "@/lib/program-images";
import { getDestinationImage } from "@/lib/destination-images";

export const dynamic = "force-dynamic";

const LEVEL_LABELS: Record<string, string> = {
  licence: "Licence",
  master: "Master",
  doctorat: "Doctorat",
  certificat: "Certificat",
  autre: "Autre",
};

const categories = [
  { icon: GraduationCap, label: "Étudiant", active: true, color: "text-blue-600", href: "/programs" },
  { icon: Briefcase, label: "Tourisme", color: "text-emerald-500", href: "/visas?type=tourisme" },
];

const buildNavItems = (isLoggedIn: boolean) => [
  { icon: HomeIcon, label: "Accueil", active: true, href: "/" },
  { icon: ClipboardList, label: "Mes demandes", href: isLoggedIn ? "/demandes" : "/auth/login" },
  { icon: Plus, label: "Démarrer", isCenter: true, href: isLoggedIn ? "/demandes/nouvelle" : "/auth/login" },
  { icon: FileText, label: "Documents", href: isLoggedIn ? "/documents" : "/auth/login" },
  { icon: User, label: "Profil", href: isLoggedIn ? "/profile" : "/auth/login" },
];

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const navItems = buildNavItems(isLoggedIn);

  let hasUnreadNotifications = false;
  if (isLoggedIn) {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    hasUnreadNotifications = (count ?? 0) > 0;
  }

  const { data: countries } = await supabase
    .from("countries")
    .select("id, name, flag_url")
    .order("created_at", { ascending: true })
    .limit(4);

  const { data: programsData } = await supabase
    .from("programs")
    .select(
      "id, name, level, field, duration_months, tuition_fee, currency, teaching_language, universities(name, countries(name, flag_url))"
    )
    .order("created_at", { ascending: true })
    .limit(12);

  const destinations = (countries ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    flag: c.flag_url ?? "🌍",
    intake: "À confirmer",
  }));

  const programs = (programsData ?? []).map((p) => {
    const university = p.universities as unknown as {
      name: string;
      countries: { name: string; flag_url: string | null } | null;
    } | null;
    return {
      id: p.id,
      title: p.name,
      level: p.level ? LEVEL_LABELS[p.level] ?? p.level : "",
      university: university?.name ?? "",
      country: university?.countries?.name ?? "",
      flag: university?.countries?.flag_url ?? "🎓",
      duration: p.duration_months ? `${p.duration_months} mois` : "",
      language: p.teaching_language ?? "",
      price: p.tuition_fee ? `${p.tuition_fee} ${p.currency ?? ""}` : "",
      image: getProgramImage({ id: p.id, field: p.field, name: p.name }),
    };
  });
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 relative">
        {/* Header */}
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
            <Link href={isLoggedIn ? "/profile" : "/auth/login"}>
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
            </Link>
          </div>
        </div>

        {/* Search */}
        <SearchBar />

        {/* Hero carrousel */}
        <HeroCarousel />

        {/* Categories */}
        <div className="px-5 grid grid-cols-2 gap-2 mb-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.label}
                href={c.href}
                className={`relative rounded-2xl py-3 flex flex-col items-center gap-1.5 ${
                  c.active
                    ? "bg-blue-50 border-2 border-blue-600"
                    : "bg-white border border-slate-100 shadow-sm"
                }`}
              >
                <Icon className={`w-6 h-6 ${c.color}`} strokeWidth={1.8} />
                <span className="text-[10.5px] font-semibold text-slate-800">{c.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Destinations études populaires */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">
            Destinations études populaires
          </h2>
          <Link href="/countries" className="text-blue-600 text-sm font-medium flex items-center gap-0.5">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-5 grid grid-cols-2 gap-3 mb-6">
          {destinations.length === 0 && (
            <div className="col-span-2 bg-white rounded-xl p-5 text-center text-sm text-slate-400 shadow-sm">
              Aucun pays pour l&apos;instant — ajoute-les dans Supabase.
            </div>
          )}
          {destinations.map((d) => (
            <Link
              key={d.id}
              href={`/countries/${d.id}`}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getDestinationImage({ id: d.id, name: d.name })}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative h-full flex flex-col items-center justify-center gap-2 p-3">
                <span className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center text-2xl shadow-sm">
                  {d.flag}
                </span>
                <span className="text-[13px] font-bold text-white text-center leading-tight">
                  {d.name}
                </span>
                <span className="text-[9px] text-white font-semibold bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                  {d.intake}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Programmes d'études */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">
            Programmes d&apos;études (hiver)
          </h2>
          <Link href="/programs" className="text-blue-600 text-sm font-medium flex items-center gap-0.5">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-5 mb-3">
          <Link
            href="/programs"
            className="w-full bg-blue-50 rounded-2xl px-4 py-3.5 flex items-center gap-2 text-blue-600 text-sm font-semibold"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="flex-1 text-left">
              Voir plus de programmes avec rentrée d&apos;hiver
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-5 mb-4">
          {programs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-5 text-center text-sm text-slate-400">
              Aucun programme pour l&apos;instant — ajoute-les dans Supabase.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {programs.map((p) => (
                <Link
                  key={p.id}
                  href={`/programs/${p.id}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative w-full aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {p.level && (
                      <span className="absolute top-2 left-2 text-[9.5px] font-bold px-2 py-1 rounded-full bg-white/90 text-blue-700 backdrop-blur">
                        {p.level}
                      </span>
                    )}
                    <Heart className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow" />
                  </div>
                  <div className="p-3 flex flex-col gap-1.5 flex-1">
                    <div className="text-[12.5px] font-semibold text-slate-900 leading-tight line-clamp-2">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {p.university}
                      {p.country ? ` · ${p.country}` : ""}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-auto pt-1">
                      {p.duration && (
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-3 h-3" /> {p.duration}
                        </span>
                      )}
                      {p.language && (
                        <span className="flex items-center gap-0.5 truncate">
                          <Globe className="w-3 h-3" /> {p.language}
                        </span>
                      )}
                    </div>
                    {p.price && (
                      <div className="text-[12.5px] font-bold text-slate-900 pt-0.5">
                        {p.price}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
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

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.isCenter) {
              return (
                <Link href={item.href} key={item.label}>
                  <button className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center -mt-6 shadow-lg shadow-blue-600/30">
                    <Icon className="w-6 h-6 text-white" />
                  </button>
                </Link>
              );
            }
            return (
              <Link href={item.href} key={item.label} className="flex flex-col items-center gap-1">
                <Icon className={`w-5 h-5 ${item.active ? "text-blue-600" : "text-slate-400"}`} />
                <span className={`text-[9.5px] ${item.active ? "text-blue-600 font-semibold" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
