import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

// Lucide n'a pas d'icône TikTok officielle — SVG inline (tracé vérifié).
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.32 1.38V7.3s-1.88.09-3.25-1.48z" />
    </svg>
  );
}

// TODO: remplacer par les vrais liens des comptes Boza.
const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: TikTokIcon, label: "TikTok", href: "https://tiktok.com" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

const COMPANY_LINKS = [
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Conditions d'utilisation", href: "/terms" },
  { label: "Confidentialité", href: "/privacy" },
];

export function SiteFooter({
  destinations = [],
}: {
  destinations?: { id: string; name: string }[];
}) {
  return (
    <div className="mt-2 mb-6 bg-slate-900 rounded-3xl mx-5 px-5 py-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-white font-bold text-[13px] mb-3">Destinations populaires</h4>
          <div className="flex flex-col gap-2.5">
            {destinations.slice(0, 4).map((d) => (
              <Link
                key={d.id}
                href={`/countries/${d.id}`}
                className="text-slate-400 text-[12px]"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold text-[13px] mb-3">Boza</h4>
          <div className="flex flex-col gap-2.5">
            {COMPANY_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-slate-400 text-[12px]">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 mt-6 pt-5 flex flex-col items-center gap-4">
        <div className="text-slate-500 text-[10.5px] text-center">
          © {new Date().getFullYear()} Boza. Tous droits réservés.
        </div>
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700"
            >
              <s.icon className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
