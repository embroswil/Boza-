"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home as HomeIcon,
  ClipboardList,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function BottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Pas de barre de navigation sur les écrans d'authentification.
  if (pathname?.startsWith("/auth")) return null;

  // Tant qu'on ne sait pas encore, ou si la personne n'est pas connectée,
  // pas de barre de navigation du tout.
  if (!isLoggedIn) return null;

  const navItems = [
    {
      icon: ClipboardList,
      label: "Mes demandes",
      href: isLoggedIn ? "/demandes" : "/auth/login",
      match: "/demandes",
    },
    { icon: HomeIcon, label: "Accueil", href: "/", match: "__home__" },
    {
      icon: User,
      label: "Profil",
      href: isLoggedIn ? "/profile" : "/auth/login",
      match: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-[#15151F]/95 backdrop-blur-md border-t border-[#26263380] px-6 py-3 flex items-center justify-evenly z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.match
          ? item.match === "__home__"
            ? pathname === "/"
            : pathname?.startsWith(item.match)
          : false;

        return (
          <Link
            href={item.href}
            key={item.label}
            className="flex flex-col items-center gap-1"
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-violet-400" : "text-slate-500"}`} />
            <span
              className={`text-[9.5px] ${isActive ? "text-violet-400 font-semibold" : "text-slate-500"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
