"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home as HomeIcon,
  ClipboardList,
  Plus,
  FileText,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function BottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  // Pas de barre de navigation sur les écrans d'authentification.
  if (pathname?.startsWith("/auth")) return null;

  const navItems = [
    { icon: HomeIcon, label: "Accueil", href: "/" },
    {
      icon: ClipboardList,
      label: "Mes demandes",
      href: isLoggedIn ? "/demandes" : "/auth/login",
      match: "/demandes",
    },
    {
      icon: Plus,
      label: "Démarrer",
      isCenter: true,
      href: isLoggedIn ? "/demandes/nouvelle" : "/auth/login",
    },
    {
      icon: FileText,
      label: "Documents",
      href: isLoggedIn ? "/documents" : "/auth/login",
      match: "/documents",
    },
    {
      icon: User,
      label: "Profil",
      href: isLoggedIn ? "/profile" : "/auth/login",
      match: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-between z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.match
          ? pathname?.startsWith(item.match)
          : pathname === "/";

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
          <Link
            href={item.href}
            key={item.label}
            className="flex flex-col items-center gap-1"
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
            <span
              className={`text-[9.5px] ${isActive ? "text-blue-600 font-semibold" : "text-slate-400"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
