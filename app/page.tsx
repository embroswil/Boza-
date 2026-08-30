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
  BookOpen,
  Calendar,
  FileCheck2,
  Globe,
  Heart,
  Plane,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { icon: GraduationCap, label: "Étudiant", active: true, badge: "NOUVEAU", color: "text-blue-600" },
  { icon: Briefcase, label: "Tourisme", color: "text-emerald-500" },
  { icon: Briefcase, label: "Travail", color: "text-orange-500" },
  { icon: Building2, label: "Affaires", color: "text-violet-500" },
  { icon: Plane, label: "Immigration", color: "text-blue-600" },
];

const destinations = [
  { name: "Allemagne", flag: "🇩🇪", intake: "JANVIER", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=400&auto=format&fit=crop" },
  { name: "Canada", flag: "🇨🇦", intake: "JANVIER", img: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?q=80&w=400&auto=format&fit=crop" },
  { name: "Pologne", flag: "🇵🇱", intake: "FÉVRIER", img: "https://images.unsplash.com/photo-1607427293702-036933bbf746?q=80&w=400&auto=format&fit=crop" },
  { name: "France", flag: "🇫🇷", intake: "JANVIER", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop" },
];

const programs = [
  {
    logo: "TUM",
    logoBg: "bg-white border border-slate-200",
    logoColor: "text-blue-700",
    title: "MSc in Computer Science",
    university: "Technical University of Munich",
    duration: "18 mois",
    language: "Anglais",
    price: "15 000 €",
  },
  {
    logo: "TORONTO",
    logoBg: "bg-red-800",
    logoColor: "text-white",
    title: "MSc in Data Science",
    university: "University of Toronto",
    duration: "16 mois",
    language: "Anglais",
    price: "24 000 CAD",
  },
  {
    logo: "S",
    logoBg: "bg-blue-950",
    logoColor: "text-white",
    title: "MSc in Artificial Intelligence",
    university: "Sorbonne Université",
    duration: "18 mois",
    language: "Anglais",
    price: "9 900 €",
  },
];

const navItems = [
  { icon: HomeIcon, label: "Accueil", active: true, href: "/" },
  { icon: ClipboardList, label: "Mes demandes", href: "/protected" },
  { icon: Plus, label: "Démarrer", isCenter: true, href: "/protected" },
  { icon: FileText, label: "Documents", href: "/protected" },
  { icon: User, label: "Profil", href: "/auth/login" },
];

export default function Home() {
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
            <Link href="/auth/login">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border border-slate-200">
            <Search className="w-5 h-5 text-slate-400" strokeWidth={2} />
            <span className="text-[15px] text-slate-400 flex-1">
              Rechercher un pays, un visa ou un programme...
            </span>
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Hero étudiant */}
        <div className="mx-5 mb-3 relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5">
          <span className="relative inline-flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
            🎓 PRIORITÉ ÉTUDIANT
          </span>

          <h1 className="relative text-[26px] font-extrabold text-slate-900 leading-tight mt-3">
            Étudiez à l&apos;étranger,
            <br />
            construisez <span className="text-blue-600">votre avenir</span>
          </h1>
          <p className="relative text-slate-500 text-[13px] mt-3 max-w-[62%] leading-relaxed">
            Trouvez les meilleures universités et programmes avec rentrée
            d&apos;hiver et réalisez votre projet d&apos;études en toute simplicité.
          </p>

          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop"
            alt="étudiant"
            className="absolute right-0 bottom-0 w-40 h-52 object-cover object-top rounded-tl-3xl"
          />

          <div className="relative grid grid-cols-3 gap-2 mt-32">
            <div className="bg-white rounded-xl px-2.5 py-2.5 flex flex-col gap-1.5 shadow-sm">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-[10.5px] font-medium text-slate-700 leading-tight">
                Universités partenaires
              </span>
            </div>
            <div className="bg-white rounded-xl px-2.5 py-2.5 flex flex-col gap-1.5 shadow-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-[10.5px] font-medium text-slate-700 leading-tight">
                Rentrées d&apos;hiver
              </span>
            </div>
            <div className="bg-white rounded-xl px-2.5 py-2.5 flex flex-col gap-1.5 shadow-sm">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span className="text-[10.5px] font-medium text-slate-700 leading-tight">
                Accompagnement complet
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 mb-6">
          <button className="w-full bg-blue-600 text-white text-sm font-semibold rounded-2xl py-4 flex items-center justify-center gap-2">
            Explorer les programmes d&apos;études <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories */}
        <div className="px-5 grid grid-cols-5 gap-2 mb-6">
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
                {c.badge && (
                  <span className="text-[8px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full absolute -bottom-2">
                    {c.badge}
                  </span>
                )}
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
          {destinations.map((d) => (
            <div key={d.name} className="rounded-xl overflow-hidden bg-white shadow-sm">
              <img src={d.img} alt={d.name} className="w-full h-24 object-cover" />
              <div className="px-2.5 py-2">
                <div className="flex items-center gap-1 text-[13px] font-semibold text-slate-800">
                  <span>{d.flag}</span> {d.name}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  Rentrée hiver{" "}
                  <span className="bg-blue-50 text-blue-600 font-semibold px-1.5 py-0.5 rounded">
                    {d.intake}
                  </span>
                </div>
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
            {programs.map((p) => (
              <div key={p.title} className="flex items-start gap-3 px-4 py-3.5">
                <div className={`w-11 h-11 rounded-lg ${p.logoBg} flex items-center justify-center shrink-0`}>
                  <span className={`text-[9px] font-extrabold ${p.logoColor}`}>{p.logo}</span>
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
