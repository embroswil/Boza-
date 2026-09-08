// Encadre un aperçu (image ou mini-preview de l'app) dans un cadre façon
// fenêtre de navigateur — barre colorée en haut, coins arrondis, ombre.
// Inspiré de la présentation "TV" vue sur le-fax.com.

export function BrowserFrame({
  children,
  barColor = "bg-blue-600",
}: {
  children: React.ReactNode;
  barColor?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
      <div className={`${barColor} h-7 flex items-center gap-1.5 px-3`}>
        <span className="w-2 h-2 rounded-full bg-white/40" />
        <span className="w-2 h-2 rounded-full bg-white/40" />
        <span className="w-2 h-2 rounded-full bg-white/40" />
      </div>
      <div className="bg-slate-50">{children}</div>
    </div>
  );
}
