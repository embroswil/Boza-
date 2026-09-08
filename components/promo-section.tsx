import Link from "next/link";

export function PromoSection({
  badgeIcon,
  badgeText,
  title,
  image,
  imageAlt,
  ctaLabel,
  href,
}: {
  badgeIcon: React.ReactNode;
  badgeText: string;
  title: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  href: string;
}) {
  return (
    <div className="px-6 mb-10">
      <h2 className="text-[26px] font-extrabold text-slate-900 leading-tight mb-2">{title}</h2>
      <div className="flex items-center gap-1.5 mb-5">
        {badgeIcon}
        <span className="text-slate-500 text-[13px]">{badgeText}</span>
      </div>

      <div className="relative mb-6">
        <span className="absolute -left-3 top-8 w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center shadow-md z-10">
          ⭐
        </span>
        <span className="absolute -left-3 top-24 w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center shadow-md z-10 text-white text-lg">
          📈
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={imageAlt}
          className="w-full aspect-[4/3] object-cover rounded-3xl"
        />
      </div>

      <Link href={href} className="block relative">
        <span className="absolute inset-x-2 -bottom-1.5 h-full bg-blue-300 rounded-full" />
        <span className="relative block w-full bg-blue-600 text-white text-center text-[15px] font-bold rounded-full py-4">
          {ctaLabel}
        </span>
      </Link>
    </div>
  );
}
