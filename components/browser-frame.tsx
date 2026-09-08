// Cadre "capture produit" — coins arrondis, ombre portée, bordure fine.
// Contrairement à un mockup d'appareil générique, le bandeau du haut fait
// partie du contenu lui-même (comme une vraie capture d'écran), pas une
// fausse barre de navigateur avec des points.
export function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
      {children}
    </div>
  );
}
