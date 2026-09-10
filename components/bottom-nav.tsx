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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // getSession() lit la session en local (cookies/stockage), sans aller
    // taper le serveur Supabase — plus rapide et surtout plus fiable que
    // getUser() ici : avant, un simple echec reseau sur cet appel (sans
    // .catch()) laissait isLoggedIn bloque a `false` pour toujours, donc
    // la barre de navigation restait invisible meme en etant connecte.
    supabase.auth
      .getSession()
      .then(({ data }) => setIsLoggedIn(!!data.session))
      .catch(() => setIsLoggedIn(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Pas de barre de navigation sur les écrans d'authentification.
  if (pathname?.startsWith("/auth")) return null;

  // Pas de barre de navigation pour les visiteurs non connectés — tout y
  // renvoie de toute façon vers la connexion.
  if (!isLoggedIn) return null;

  const navItems = [
    { icon: HomeIcon, label: "Accueil", href: "/" },
    {
      icon: ClipboardList,
      label: "Mes demandes",
      href: isLoggedIn ? "/demandes" : "/auth/login",
      match: "/demandes",
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
