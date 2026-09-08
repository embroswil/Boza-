import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

// Lucide n'a pas d'icône TikTok officielle — SVG inline à la place.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-.9-.94-1.44-2.13-1.53-3.42h-3.13v13.4c0 1.57-1.27 2.85-2.85 2.85a2.85 2.85 0 0 1-2.85-2.85 2.85 2.85 0 0 1 2.85-2.85c.28 0 .55.04.8.12v-3.18a6.02 6.02 0 0 0-.8-.05A5.98 5.98 0 0 0 3.1 15.8a5.98 5.98 0 0 0 5.98 5.98c3.3 0 5.98-2.68 5.98-5.98V8.4a8.16 8.16 0 0 0 4.76 1.52V6.79c-1.03 0-1.99-.36-2.74-.97h-.48z" />
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

export function SiteFooter() {
  return (
    <div className="px-5 mb-6 pt-6 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpg" alt="Boza" className="w-9 h-9 rounded-lg object-cover" />
        <div>
          <div className="font-extrabold text-slate-900 text-[15px] leading-none">BOZA</div>
          <div className="text-[10.5px] text-slate-400 mt-0.5">
            Votre passeport pour le monde
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
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
      <div className="text-[10px] text-slate-300 mt-5">
        © {new Date().getFullYear()} Boza. Tous droits réservés.
      </div>
    </div>
  );
}
