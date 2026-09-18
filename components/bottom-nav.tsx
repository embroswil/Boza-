"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home as HomeIcon,
  ClipboardList,
  User,
  MessageCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function BottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const checkUnread = async (userId: string) => {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      setHasUnread((count ?? 0) > 0);
    };

    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
      if (data.user) checkUnread(data.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) checkUnread(session.user.id);
    });

    return () => subscription.unsubscribe();
    // On revérifie aussi à chaque changement de page (ex : retour de /messages
    // après avoir tout lu) pour que le point rouge disparaisse sans reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Pas de barre de navigation sur les écrans d'authentification.
  if (pathname?.startsWith("/auth")) return null;

  // Tant qu'on ne sait pas encore, ou si la personne n'est pas connectée,
  // pas de barre de navigation du tout.
  if (!isLoggedIn) return null;

  const navItems = [
    {
      icon: ClipboardList,
      label: "Mes demandes",
      href: "/demandes",
      match: "/demandes",
    },
    { icon: HomeIcon, label: "Accueil", href: "/", match: "__home__" },
    {
      icon: MessageCircle,
      label: "Messages",
      href: "/messages",
      match: "/messages",
      badge: hasUnread,
    },
    {
      icon: User,
      label: "Profil",
      href: "/profile",
      match: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-[#15151F]/95 backdrop-blur-md border-t border-[#26263380] px-4 py-3 flex items-center justify-evenly z-50">
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
            className="flex flex-col items-center gap-1 relative"
          >
            <span className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "text-violet-400" : "text-slate-500"}`} />
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#15151F]" />
              )}
            </span>
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
