// Convertit et affiche tous les prix du site en Francs CFA (XAF).
//
// Le XAF est arrimé à taux FIXE à l'euro : 1 EUR = 655,957 XAF (officiel,
// invariable). Pour les autres devises, les taux ci-dessous sont des
// APPROXIMATIONS (marché courant, à mettre à jour périodiquement) — pas un
// taux de change en temps réel. À rafraîchir de temps en temps si besoin
// de précision.
const RATES_TO_XAF: Record<string, number> = {
  XAF: 1,
  EUR: 655.957,
  USD: 607,
  CNY: 85.5,
  THB: 17.3,
  KRW: 0.44,
  AED: 165.3,
  SGD: 449.6,
  AUD: 399,
  QAR: 166.8,
  GBP: 780,
  SAR: 162,
};

export function toXAF(amount: number, currency: string | null | undefined): number {
  const rate = RATES_TO_XAF[(currency ?? "XAF").toUpperCase()] ?? 1;
  return Math.round(amount * rate);
}

/** Formate un montant (dans sa devise d'origine) en Francs CFA affichables. */
export function formatXAF(
  amount: number | null | undefined,
  currency?: string | null
): string {
  if (amount == null) return "";
  const value = toXAF(amount, currency);
  return `${value.toLocaleString("fr-FR")} XAF`;
}
