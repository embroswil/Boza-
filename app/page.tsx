import {
  Search,
  Bell,
  GraduationCap,
  Briefcase,
  Building2,
  ChevronRight,
  Home as HomeIcon,
  ClipboardList,
  FileText,
  User,
  Plus,
  Send,
  SlidersHorizontal,
  Calendar,
  Globe,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HeroCarousel } from "@/components/hero-carousel";

export const dynamic = "force-dynamic";

const categories = [
  { icon: GraduationCap, label: "Étudiant", active: true, color: "text-blue-600" },
  { icon: Briefcase, label: "Tourisme", color: "text-emerald-500" },
  { icon: Briefcase, label: "Travail", color: "text-orange-500" },
  { icon: Building2, label: "Affaires", color: "text-violet-500" },
];

const buildNavItems = (isLoggedIn: boolean) => [
  { icon: HomeIcon, label: "Accueil", active: true, href: "/" },
  { icon: ClipboardList, label: "Mes demandes", href: isLoggedIn ? "/protected" : "/auth/login" },
  { icon: Plus, label: "Démarrer", isCenter: true, href: isLoggedIn ? "/protected" : "/auth/login" },
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

  const { data: countries } = await supabase
    .from("countries")
    .select("id, name, flag_url")
    .order("created_at", { ascending: true })
    .limit(4);

  const { data: programsData } = await supabase
    .from("programs")
    .select(
      "id, name, level, duration_months, tuition_fee, currency, teaching_language, universities(name)"
    )
    .order("created_at", { ascending: true })
    .limit(3);

  const destinations = (countries ?? []).map((c) => ({
    name: c.name,
    flag: c.flag_url ?? "🌍",
    intake: "À confirmer",
  }));

  const programs = (programsData ?? []).map((p) => ({
    title: p.name,
    university: (p.universities as unknown as { name: string } | null)?.name ?? "",
    duration: p.duration_months ? `${p.duration_months} mois` : "",
    language: p.teaching_language ?? "",
    price: p.tuition_fee ? `${p.tuition_fee} ${p.currency ?? ""}` : "",
    logo: (p.universities as unknown as { name: string } | null)?.name?.slice(0, 3).toUpperCase() ?? "",
  }));
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-6 font-sans">
      <div className="w-full max-w-sm bg-slate-50 relative">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Send className="w-9 h-9 text-blue-600 -rotate-45" fill="currentColor" strokeWidth={0} />
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
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
            </div>
            <Link href={isLoggedIn ? "/profile" : "/auth/login"}>
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" strokeWidth={2} />
            <span className="text-[13px] text-slate-400 flex-1">
              Rechercher un pays, un visa ou un programme...
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Hero carrousel */}
        <HeroCarousel />

        {/* Categories */}
        <div className="px-5 grid grid-cols-4 gap-2 mb-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className={`relative rounded-2xl py-3 flex flex-col items-center gap-1.5 ${
                  c.active
                    ? "bg-blue-50 border-2 border-blue-600"
                    : "bg-white border border-slate-100 shadow-sm"
                }`}
              >
                <Icon className={`w-6 h-6 ${c.color}`} strokeWidth={1.8} />
                <span className="text-[10.5px] font-semibold text-slate-800">{c.label}</span>
              </div>
            );
          })}
        </div>

        {/* Destinations études populaires */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">
            Destinations études populaires
          </h2>
          <button className="text-blue-600 text-sm font-medium flex items-center gap-0.5">
            Voir tout <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 grid grid-cols-2 gap-3 mb-6">
          {destinations.length === 0 && (
            <div className="col-span-2 bg-white rounded-xl p-5 text-center text-sm text-slate-400 shadow-sm">
              Aucun pays pour l&apos;instant — ajoute-les dans Supabase.
            </div>
          )}
          {destinations.map((d) => (
            <div key={d.name} className="rounded-xl overflow-hidden bg-white shadow-sm p-3">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
                <span>{d.flag}</span> {d.name}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                Rentrée hiver{" "}
                <span className="bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded">
                  {d.intake}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Programmes d'études */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">
            Programmes d&apos;études (hiver)
          </h2>
          <button className="text-blue-600 text-sm font-medium flex items-center gap-0.5">
            Voir tout <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 mb-4">
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
            {programs.length === 0 && (
              <div className="p-5 text-center text-sm text-slate-400">
                Aucun programme pour l&apos;instant — ajoute-les dans Supabase.
              </div>
            )}
            {programs.map((p) => (
              <div key={p.title} className="flex items-start gap-3 px-4 py-3.5">
                <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-extrabold text-blue-700">{p.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-slate-900 leading-tight">
                    {p.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.university}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {p.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {p.language}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Heart className="w-4 h-4 text-slate-300" />
                  <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">
                    {p.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bannière footer */}
        <div className="px-5 mb-24">
          <button className="w-full bg-blue-50 rounded-2xl px-4 py-3.5 flex items-center gap-2 text-blue-600 text-sm font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span className="flex-1 text-left">
              Voir plus de programmes avec rentrée d&apos;hiver
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
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
