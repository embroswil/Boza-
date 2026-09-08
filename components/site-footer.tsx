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

const FOOTER_LINKS = [
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Conditions d'utilisation", href: "/terms" },
  { label: "Confidentialité", href: "/privacy" },
];

export function SiteFooter() {
  return (
    <div className="px-5 mb-6 pt-6 border-t border-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.jpg" alt="Boza" className="w-9 h-9 rounded-lg object-cover mb-4" />

      <div className="flex items-center gap-3 mb-5">
        {SOCIAL_LINKS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600"
          >
            <s.icon className="w-4.5 h-4.5" />
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        {FOOTER_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-[11.5px] text-slate-500 font-medium">
            {l.label}
          </Link>
        ))}
      </div>

      <div className="text-[10px] text-slate-300">
        © {new Date().getFullYear()} Boza. Tous droits réservés.
      </div>
    </div>
  );
}
