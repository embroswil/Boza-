"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, ClipboardList, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { icon: Home, label: "Accueil", href: "/", match: "/" },
  { icon: Search, label: "Rechercher", href: "/search", match: "/search" },
  { icon: ClipboardList, label: "Mes demandes", href: "/demandes", match: "/demandes" },
  { icon: User, label: "Profil", href: "/profile", match: "/profile" },
];

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

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] flex items-stretch z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.match === "/"
            ? pathname === "/"
            : pathname?.startsWith(item.match);

        return (
          <Link
            href={item.href}
            key={item.label}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative"
          >
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
            )}
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                isActive ? "bg-blue-50" : ""
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                strokeWidth={isActive ? 2.4 : 2}
              />
            </div>
            <span
              className={`text-[9.5px] leading-none ${
                isActive ? "text-blue-600 font-bold" : "text-slate-400 font-medium"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
