import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

// Lucide n'a pas d'icône TikTok. Les tracés SVG "officiels" trouvés en
// mémoire se sont révélés invisibles une fois rendus — on utilise donc une
// forme géométrique simple (note de musique stylisée), garantie de
// s'afficher correctement quel que soit le navigateur.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="9" cy="17" r="3.2" fill="currentColor" />
      <rect x="10.8" y="3" width="2.4" height="14" rx="1.2" fill="currentColor" />
      <path
        d="M13.2 3c0 3 2.3 5.3 5.3 5.5v2.4c-2-.1-3.8-.8-5.3-2v-1.2z"
        fill="currentColor"
      />
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
    <div className="w-full bg-slate-900 px-6 pt-10 pb-14 mt-4">
      <h3 className="text-white text-[22px] font-extrabold leading-tight mb-3">
        Votre passeport pour le monde
      </h3>
      <p className="text-slate-400 text-[13px] leading-relaxed mb-8">
        Visa, admission, documents, paiement : Boza vous accompagne du premier clic jusqu&apos;à
        votre départ, sans jamais quitter la plateforme.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h4 className="text-white font-bold text-[14px] mb-4">Destinations populaires</h4>
          <div className="flex flex-col gap-3">
            {destinations.slice(0, 4).map((d) => (
              <Link
                key={d.id}
                href={`/countries/${d.id}`}
                className="text-slate-400 text-[13px]"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold text-[14px] mb-4">Boza</h4>
          <div className="flex flex-col gap-3">
            {COMPANY_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-slate-400 text-[13px]">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-7 flex flex-col items-center gap-5">
        <div className="text-slate-500 text-[11px] text-center">
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
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700"
            >
              <s.icon className="w-4.5 h-4.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
